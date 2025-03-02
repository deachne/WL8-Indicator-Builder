# Optimizer API

This document details the API for building Optimizer extensions for Wealth-Lab 8. An Optimizer decides how Strategy Parameter values should be tested during an optimization.

The baseline Optimizer, Exhaustive, iterates through each possible combination of Parameter values. This can lead to extremely long run times depending on the number of Parameter combinations. Other Optimizers attempt different approaches to narrow down profitable Parameter ranges.

Each Parameter instance has `MinValue`, `MaxValue`, and `StepValue` properties that determine the possible range of values to consider during optimization. An Optimizer orchestrates the optimization by determining how Parameter values change from run to run during the optimization process.

## Build Environment

You can create an Optimizer in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Optimizer will be a class in this library that descends from `OptimizerBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Backtest` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Optimizer, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Configuration of an Optimizer

`OptimizerBase` descends from the base class `Configurable`, which provides a way to allow the user to configure the Optimizer. Consult the Configurable class reference for details.

By default, `OptimizerBase` assigns the `ParameterListType` value to its `ConfigurableType` property, so the Optimizer will use a `ParameterList` containing `Parameter` instances for configuration. You'll define these Parameters in the `GenerateParameters` method, as described in the Configurable class reference.

## Permutations

### public virtual int GetTotalPermutations(ParameterList pl)
Override this method to return the total (or estimated) number of optimization runs your Optimizer will perform based on:
- Strategy Parameters in the ParameterList `pl` parameter
- Your Optimizer's own Parameter values

## Optimizing

### public virtual void Initialize(StrategyOptimizer mo, ParameterList pl)
Override to perform initialization before each optimization run. Parameters:
- `mo`: StrategyOptimizer instance containing methods for optimization runs
- `pl`: ParameterList containing Optimizer's Parameter values

> **Important:** Call `base.Initialize` if you implement this method.

### public abstract void Optimize(ParameterList pl, bool resumePrevious)
Override to perform the optimization. Implementation steps:
1. Use your Optimizer's logic to generate parameter value combinations
2. Execute optimization runs via `StrategyOptimizer.ExecuteOptimizationRun`
3. Assign test values using `Parameter.SetNumericValue` method
4. Handle resuming previous runs if `resumePrevious` is true

`ExecuteOptimizationRun` returns an `OptimizationResult` with calculated performance metrics based on user selection.

### public bool IsCancelled
Check this property during optimization loops to detect user cancellation.

### public StrategyOptimizer StrategyOptimizer
Returns the `StrategyOptimizer` instance for executing optimization runs.

## Working with Performance Metrics

### ScoreCardFactory.Instance.SelectedMetrics
Returns list of user-selected Performance Metric names.

### protected virtual void ScoreCardChanged()
Override to handle changes to selected Performance Metrics.

### protected void SetMetrics(Parameter p)
Sets up an Optimizer Parameter to select from available Performance Metrics:
- Sets Parameter type to StringChoice
- Populates Choices from `ScoreCardFactory.Instance.SelectedMetrics`
- Call during Initialize and ScoreCardChanged

## Internal State

### public virtual string GetInternalState()
Override to return string representing Optimizer's internal state.

### public virtual void SetInternalState(string s, ParameterList pl)
Override to restore Optimizer's internal state from string.

> **Note:** Even without implementing state management, WL8 optimizes by caching results for identical Parameter values.

## Parallel Processing Considerations

For multi-threaded Optimizers:
1. Always clone ParameterList instances using `Clone()` method
2. Work with the cloned copy to prevent corruption
3. Take care with shared state across threads

## Example Implementation

Below is a complete implementation of a single-threaded exhaustive Optimizer:

```csharp
using System.Collections.Generic;
using WealthLab.Core;

namespace WealthLab.Backtest
{
    public class ExhaustiveNonParallel : OptimizerBase
    {
        //Name
        public override string Name => "Exhaustive (non-Parallel)";

        //description
        public override string Description => 
            "Executes the Strategy on each permutation of parameter values, " + 
            "but does not leverage parallel processing.";

        //private members
        private int totalRuns;
        private int runs;

        //execute the optimization
        public override void Optimize(ParameterList pl, bool resumePrevious)
        {
            totalRuns = GetTotalPermutations(pl);
            runs = 0;
            ProcessParameter(pl, 0);
        }

        //iterate through parameter values of the specified parameter (recursive)
        private void ProcessParameter(ParameterList pl, int depth)
        {
            ParameterList myPL = pl.Clone();
            if (depth == myPL.Count)
            {
                StrategyOptimizer.ExecuteOptimizationRun(myPL);
                runs++;
                StrategyOptimizer.ReportEstimatedCompletion(runs * 100.0 / totalRuns);
                return;
            }

            //are we optimizing this parameter?
            if (myPL[depth].IsChecked)
            {
                //yes, create list of step values
                List<double> values = new List<double>(myPL[depth]);

                //and optimize in parallel
                foreach (double myValue in values)
                {
                    if (!IsCancelled)
                    {
                        //set value
                        ParameterList runPL = myPL.Clone();
                        runPL[depth].SetNumericValue(myValue);

                        //continue to inner parameter
                        ProcessParameter(runPL, depth + 1);
                    }
                }
            }
            else
            {
                //no, use established value
                if (!IsCancelled)
                {
                    ProcessParameter(myPL, depth + 1);
                }
            }
        }
    }
} 