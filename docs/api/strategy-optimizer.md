# StrategyOptimizer Class

**Namespace:** WealthLab.Backtest  
**Parent:** OptimizationRunnerBase

The `StrategyOptimizer` class is responsible for executing optimization runs for trading strategies, providing a comprehensive framework for parameter exploration and performance evaluation.

## Overview

`StrategyOptimizer` serves as a critical component in the strategy development process, enabling:
- Systematic parameter optimization
- Performance metric collection
- Backtest execution across parameter variations

## Base Class Properties

### BacktestSettings
```csharp
public BacktestSettings BacktestSettings
```
Returns the backtest settings used for the optimization run.

### CompiledStrategy
```csharp
public StrategyBase CompiledStrategy
```
Returns the compiled `StrategyBase`-derived class being optimized.

### OptimizationMethod
```csharp
public OptimizerBase OptimizationMethod
```
Returns the `OptimizerBase`-derived optimizer selected for the optimization.

### OptimizerHost
```csharp
public IOptimizerHost OptimizerHost
```
Provides communication interface between the optimizer and its host.

### PositionSize
```csharp
public PositionSize PositionSize
```
Returns the position sizing configuration used during optimization.

### ScoreCard
```csharp
public ScoreCardBase ScoreCard
```
Returns the `ScoreCardBase` instance used for performance evaluation.

### SymbolData
```csharp
public List<BarHistory> SymbolData
```
Contains the historical data used for optimization across multiple symbols.

## Methods

### ExecuteOptimizationRun
```csharp
public OptimizationResult ExecuteOptimizationRun(
    ParameterList pl, 
    Backtester bmBacktester = null, 
    bool addToResults = true
)
```
Executes a single optimization run with specified parameter values.

**Parameters:**
- `pl`: Parameter list defining optimization parameters
- `bmBacktester`: Optional benchmark backtester
- `addToResults`: Whether to add result to optimization results list

**Returns:** An `OptimizationResult` containing performance metrics

### FindMetric
```csharp
public double FindMetric(string metric, List<double> paramValues)
```
Searches optimization results for a specific metric value matching given parameter values.

**Parameters:**
- `metric`: Performance metric name
- `paramValues`: Parameter values to match

**Returns:** Metric value or `Double.NaN` if not found

### GetUniqueValues
```csharp
public List<double> GetUniqueValues(int idx)
```
Retrieves unique parameter values for a specific parameter index.

**Parameters:**
- `idx`: Parameter index in strategy's parameter list

**Returns:** List of unique parameter values used in optimization

## Properties

### Results
```csharp
public OptimizationResultList Results
```
Contains all recorded optimization run results.

## Usage Examples

### Basic Optimization
```csharp
public class StrategyOptimizer
{
    public void PerformParameterOptimization(Strategy strategy)
    {
        // Create strategy optimizer
        var optimizer = new StrategyOptimizer
        {
            CompiledStrategy = strategy,
            BacktestSettings = new BacktestSettings(),
            ScoreCard = new NetProfitScoreCard()
        };

        // Optimize RSI period parameter
        var rsiPeriodParam = strategy.Parameters.FindName("RSI Period");
        
        // Execute optimization runs
        for (int period = 5; period <= 30; period += 5)
        {
            rsiPeriodParam.Value = period;
            
            var result = optimizer.ExecuteOptimizationRun(strategy.Parameters);
            
            Console.WriteLine($"RSI Period: {period}");
            Console.WriteLine($"Net Profit: {result.PerformanceMetrics["NetProfit"]}");
        }
    }
}
```

### Advanced Optimization Analysis
```csharp
public class OptimizationAnalyzer
{
    public void AnalyzeOptimizationResults(StrategyOptimizer optimizer)
    {
        // Sort results by net profit
        var sortedResults = optimizer.Results
            .OrderByDescending(r => r.PerformanceMetrics["NetProfit"])
            .ToList();

        Console.WriteLine("Top Performing Parameter Combinations:");
        foreach (var result in sortedResults.Take(5))
        {
            Console.WriteLine("\nParameter Values:");
            for (int i = 0; i < result.ParameterValues.Count; i++)
            {
                Console.WriteLine($"  P{i}: {result.ParameterValues[i]}");
            }

            Console.WriteLine("Performance Metrics:");
            foreach (var metric in result.PerformanceMetrics)
            {
                Console.WriteLine($"  {metric.Key}: {metric.Value}");
            }
        }
    }
}
```

### Progress Reporting
```csharp
public class CustomOptimizer : OptimizerBase
{
    public override void Optimize(StrategyOptimizer optimizer)
    {
        // Implement custom optimization logic
        for (double progress = 0; progress <= 100; progress += 10)
        {
            // Execute optimization runs
            ExecuteOptimizationRuns(optimizer);
            
            // Report progress
            optimizer.ReportEstimatedCompletion(progress);
        }
    }
}
```

## Best Practices

1. **Parameter Selection**
   - Choose meaningful parameters to optimize
   - Consider parameter interactions
   - Use reasonable parameter ranges

2. **Performance Metrics**
   - Use multiple performance metrics
   - Balance return and risk metrics
   - Avoid overfitting

3. **Optimization Techniques**
   - Use appropriate optimization methods
   - Consider computational complexity
   - Implement early stopping if needed

## Performance Considerations

- Optimization runs can be computationally intensive
- Use parallel processing for large parameter spaces
- Implement caching mechanisms
- Monitor memory usage

## Caution

🔬 Optimization results are not guaranteed to predict future performance. 
Always validate strategies through:
- Out-of-sample testing
- Walk-forward analysis
- Real-world paper trading 🔬

## Requirements

- Deep understanding of trading strategy development
- Proficiency in performance metric analysis
- Knowledge of optimization techniques

## Notes

- Provides systematic approach to strategy parameter tuning
- Supports complex optimization scenarios
- Enables data-driven strategy refinement 