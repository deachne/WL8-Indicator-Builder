# WFOOptimizer Class

**Namespace:** WealthLab.Backtest  
**Parent:** OptimizationRunnerBase

The `WFOOptimizer` class executes Walk-Forward Optimization (WFO), a powerful technique for validating and selecting trading strategies across different time periods.

## Overview

Walk-Forward Optimization helps traders:
- Test strategy robustness across multiple market conditions
- Reduce overfitting risks
- Validate strategy performance out-of-sample

## Base Class Properties

### BacktestSettings
```csharp
public BacktestSettings BacktestSettings
```
Returns the backtest settings used for the optimization.

### CompiledStrategy
```csharp
public StrategyBase CompiledStrategy
```
Returns the compiled strategy being optimized.

### OptimizationMethod
```csharp
public OptimizerBase OptimizationMethod
```
Returns the optimizer used for the optimization.

### PositionSize
```csharp
public PositionSize PositionSize
```
Returns the position sizing configuration used in the optimization.

### ScoreCard
```csharp
public ScoreCardBase ScoreCard
```
Returns the ScoreCard used to evaluate strategy performance.

### SymbolData
```csharp
public List<BarHistory> SymbolData
```
Contains the historical data being optimized.

## WFO-Specific Properties

### DataSet
```csharp
public DataSet DataSet
```
Returns the DataSet selected for walk-forward optimization.

### InSamplePercent
```csharp
public double InSamplePercent
```
Percentage of data used for in-sample optimization.

### OutOfSamplePercent
```csharp
public double OutOfSamplePercent
```
Percentage of data used for out-of-sample validation.

### Intervals
```csharp
public int Intervals
```
Number of intervals used in the walk-forward optimization.

### WindowType
```csharp
public WFOWindowTypes WindowType
```
Determines the windowing approach for optimization.

**Possible Values:**
- `Expanding`: Each interval includes all previous data
- `Sliding`: Fixed-size window moves across data

### Mode
```csharp
public string Mode
```
Defines how the best optimization result is selected.

### Selector
```csharp
public WFOResultSelectorBase Selector
```
Determines the criteria for selecting the best optimization run.

### WFOResults
```csharp
public List<WFOResult> WFOResults
```
Contains the best results for each optimization interval.

## Methods

### ReportEstimatedCompletion
```csharp
public void ReportEstimatedCompletion(double value)
```
Allows optimizers to report back their estimated completion percentage.

**Parameters:**
- `value`: Completion percentage (0-100)

## Usage Examples

### Basic Walk-Forward Optimization
```csharp
public class WFOOptimizationExample
{
    public void PerformWalkForwardOptimization(Strategy strategy, DataSet dataSet)
    {
        // Configure WFO parameters
        var wfoOptimizer = new WFOOptimizer
        {
            DataSet = dataSet,
            InSamplePercent = 70,
            OutOfSamplePercent = 30,
            Intervals = 10,
            WindowType = WFOWindowTypes.Sliding
        };

        // Perform optimization
        wfoOptimizer.Run(strategy);

        // Analyze results
        foreach (var result in wfoOptimizer.WFOResults)
        {
            Console.WriteLine($"Interval {result.Interval}:");
            Console.WriteLine($"  In-Sample Performance: {result.InSamplePerformance}");
            Console.WriteLine($"  Out-of-Sample Performance: {result.OutOfSamplePerformance}");
        }
    }
}
```

### Advanced WFO Strategy Selection
```csharp
public class AdvancedWFOAnalysis
{
    public void SelectBestStrategy(WFOOptimizer wfoOptimizer)
    {
        // Custom result selector
        var bestResult = wfoOptimizer.WFOResults
            .OrderByDescending(r => r.OutOfSamplePerformance)
            .ThenByDescending(r => r.InSamplePerformance)
            .FirstOrDefault();

        if (bestResult != null)
        {
            Console.WriteLine("Best WFO Strategy:");
            Console.WriteLine($"  Interval: {bestResult.Interval}");
            Console.WriteLine($"  In-Sample Performance: {bestResult.InSamplePerformance}");
            Console.WriteLine($"  Out-of-Sample Performance: {bestResult.OutOfSamplePerformance}");
        }
    }
}
```

## Best Practices

1. **Optimization Techniques**
   - Use appropriate in-sample/out-of-sample percentages
   - Consider different window types
   - Validate across multiple market conditions

2. **Performance Evaluation**
   - Compare in-sample and out-of-sample results
   - Look for consistent performance
   - Avoid strategies with significant performance discrepancies

3. **Risk Management**
   - Use multiple performance metrics
   - Consider drawdown and risk-adjusted returns
   - Validate strategy robustness

## Performance Considerations

- Walk-Forward Optimization can be computationally intensive
- Use efficient data structures
- Consider parallel processing for large datasets

## Potential Pitfalls

🚨 **Caution:**
- Beware of overfitting
- Not all optimized strategies perform well in live trading
- Continuous monitoring and adaptation are crucial

## Notes

- Essential tool for strategy validation
- Helps reduce curve-fitting risks
- Provides more realistic performance estimates
- Part of advanced algorithmic trading toolkit 