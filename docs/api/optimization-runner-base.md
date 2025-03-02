# OptimizationRunnerBase Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object  
**Descendants:** StrategyOptimizer, WFOOptimizer

The `OptimizationRunnerBase` class serves as the base class for strategy optimization in WealthLab 8. It provides core functionality for both standard strategy optimization (`StrategyOptimizer`) and Walk-Forward Optimization (`WFOOptimizer`).

## Core Properties

### BacktestSettings
```csharp
public BacktestSettings BacktestSettings
```
Returns the `BacktestSettings` instance used for the optimization, containing configuration for commission rates, slippage, and other backtest parameters.

### CompiledStrategy
```csharp
public StrategyBase CompiledStrategy
```
Returns the compiled strategy instance (derived from `StrategyBase`) that is being optimized.

### OptimizationMethod
```csharp
public OptimizerBase OptimizationMethod
```
Returns the selected optimizer instance (derived from `OptimizerBase`) used for the optimization process.

### OptimizerHost
```csharp
public IOptimizerHost OptimizerHost
```
Returns an instance of `IOptimizerHost` that enables optimizer communication with its host.

### PositionSize
```csharp
public PositionSize PositionSize
```
Returns the position sizing configuration used during optimization.

### ScoreCard
```csharp
public ScoreCardBase ScoreCard
```
Returns the selected scorecard instance used to evaluate optimization results.

### SymbolData
```csharp
public List<BarHistory> SymbolData
```
Returns a list of `BarHistory` instances representing the historical data being optimized.

## Methods

### ReportEstimatedCompletion
```csharp
public void ReportEstimatedCompletion(double value)
```
Allows optimizers to report their estimated completion percentage.

**Parameters:**
- `value`: Completion percentage (0-100)

## Usage Examples

### Basic Optimization Runner
```csharp
public class CustomOptimizer : OptimizationRunnerBase
{
    private int _totalRuns;
    private int _completedRuns;
    
    public void RunOptimization()
    {
        try
        {
            // Configure optimization
            _totalRuns = CalculateTotalRuns();
            _completedRuns = 0;
            
            // Execute optimization runs
            foreach (var paramSet in GenerateParameterSets())
            {
                // Run backtest with parameters
                ExecuteBacktest(paramSet);
                
                // Update progress
                _completedRuns++;
                double progress = (_completedRuns * 100.0) / _totalRuns;
                ReportEstimatedCompletion(progress);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Optimization error: {ex.Message}");
        }
    }
    
    private void ExecuteBacktest(List<double> parameters)
    {
        // Apply backtest settings
        var settings = BacktestSettings;
        settings.CommissionAmount = 0.01; // Example setting
        
        // Use position sizing
        var posSize = PositionSize;
        posSize.DefaultSize = 100; // Example setting
        
        // Execute strategy
        var strategy = CompiledStrategy;
        // Implementation details...
    }
}
```

### Progress Reporting
```csharp
public class ProgressTrackingOptimizer : OptimizationRunnerBase
{
    public void OptimizeWithProgress()
    {
        int totalSteps = 100;
        
        for (int step = 0; step < totalSteps; step++)
        {
            // Perform optimization step
            ExecuteOptimizationStep(step);
            
            // Report progress
            double progress = ((step + 1) * 100.0) / totalSteps;
            ReportEstimatedCompletion(progress);
            
            // Check scorecard results
            var results = ScoreCard.GetResults();
            AnalyzeResults(results);
        }
    }
    
    private void AnalyzeResults(object results)
    {
        // Implementation details...
    }
}
```

### Multi-Symbol Optimization
```csharp
public class MultiSymbolOptimizer : OptimizationRunnerBase
{
    public void OptimizeAcrossSymbols()
    {
        // Access historical data
        foreach (var bars in SymbolData)
        {
            Console.WriteLine($"Optimizing {bars.Symbol}...");
            
            // Configure optimization method
            var optimizer = OptimizationMethod;
            optimizer.Configure(bars);
            
            // Run optimization
            RunOptimization(bars);
            
            // Report to optimizer host
            OptimizerHost.NotifyProgress(/* progress details */);
        }
    }
}
```

## Best Practices

1. **Progress Reporting**
   - Report progress regularly using `ReportEstimatedCompletion`
   - Provide accurate progress estimates
   - Handle long-running optimizations gracefully

2. **Resource Management**
   - Use backtest settings appropriately
   - Manage position sizing consistently
   - Handle historical data efficiently

3. **Error Handling**
   - Implement robust error handling
   - Report errors through appropriate channels
   - Maintain optimization state on errors

4. **Performance Optimization**
   - Optimize parameter space exploration
   - Cache intermediate results when possible
   - Consider parallel execution where appropriate

## Notes

- Base class for optimization implementations
- Provides essential optimization infrastructure
- Supports both standard and walk-forward optimization
- Enables progress tracking and reporting
- Manages optimization configuration and execution 