# IStrategyHost Interface

**Namespace:** WealthLab.Backtest  
**Parent:** None

The `IStrategyHost` interface enables Performance Visualizers to communicate with their host Strategy window. It provides methods and properties for controlling strategy execution, parameter management, and window navigation.

## Properties

### Backtester
```csharp
public Backtester Backtester
```
Returns the `Backtester` instance for the Strategy window.

### BenchmarkBacktester
```csharp
public Backtester BenchmarkBacktester
```
Returns the `Backtester` instance that ran the buy & hold benchmark comparison for the Strategy window.

### Strategy
```csharp
public Strategy Strategy
```
Returns the `Strategy` instance for the Strategy in the host window.

## Methods

### ChartSymbolAtBar
```csharp
void ChartSymbolAtBar(string symbol, int idx)
```
Switches to the chart tab, displays the specified symbol, and scrolls to the specified bar index.

**Parameters:**
- `symbol`: The symbol to chart
- `idx`: The bar index to scroll to

### ParameterDefaultsChanged
```csharp
void ParameterDefaultsChanged()
```
Notifies the Strategy window that Strategy Parameter defaults have been modified, typically by an Optimization Visualizer.

### RunWithOverrides
```csharp
void RunWithOverrides(List<double> overrides)
```
Executes a backtest using specified Parameter override values.

**Parameters:**
- `overrides`: List of parameter values to use for the backtest

### SaveParameterDefaults
```csharp
void SaveParameterDefaults(List<double> paramValues)
```
Saves the provided Parameter values as defaults for the Strategy.

**Parameters:**
- `paramValues`: List of parameter values to save as defaults

### ShowTabPage
```csharp
void ShowTabPage(StrategyWindowTab tab)
```
Switches the Strategy window to the specified tab page.

**Valid tab values:**
- `Settings`
- `Designer`
- `Signals`
- `BacktestResults`
- `Chart`
- `Optimization`
- `DebugLog`
- `PreferredValues`

## Usage Examples

### Parameter Management
```csharp
public class OptimizationVisualizer
{
    private IStrategyHost _strategyHost;

    public void ApplyOptimizedParameters(List<double> optimizedValues)
    {
        try
        {
            // Save new parameter values as defaults
            _strategyHost.SaveParameterDefaults(optimizedValues);
            
            // Notify host of changes
            _strategyHost.ParameterDefaultsChanged();
            
            // Run backtest with new values
            _strategyHost.RunWithOverrides(optimizedValues);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error applying parameters: {ex.Message}");
        }
    }
}
```

### Chart Navigation
```csharp
public class SignalAnalyzer
{
    private IStrategyHost _strategyHost;

    public void AnalyzeSignal(string symbol, int signalBar)
    {
        // Switch to chart view
        _strategyHost.ShowTabPage(StrategyWindowTab.Chart);
        
        // Display symbol at signal bar
        _strategyHost.ChartSymbolAtBar(symbol, signalBar);
    }
}
```

### Backtester Analysis
```csharp
public class PerformanceAnalyzer
{
    private IStrategyHost _strategyHost;

    public void CompareWithBenchmark()
    {
        var strategy = _strategyHost.Strategy;
        var strategyResults = _strategyHost.Backtester;
        var benchmarkResults = _strategyHost.BenchmarkBacktester;

        // Analyze performance
        double strategyReturn = strategyResults.NetProfitPct;
        double benchmarkReturn = benchmarkResults.NetProfitPct;
        
        // Show results tab
        _strategyHost.ShowTabPage(StrategyWindowTab.BacktestResults);
    }
}
```

## Best Practices

1. **Parameter Management**
   - Validate parameter values before saving
   - Notify host of parameter changes
   - Handle parameter override errors gracefully

2. **Navigation**
   - Use appropriate tab pages for context
   - Provide visual feedback during navigation
   - Handle navigation errors

3. **Backtesting**
   - Compare strategy against benchmark
   - Analyze multiple performance metrics
   - Consider transaction costs and slippage

4. **Error Handling**
   - Validate inputs before operations
   - Handle exceptions appropriately
   - Provide meaningful error messages

## Common Use Cases

1. **Optimization**
   - Applying optimized parameters
   - Running backtests with different parameters
   - Comparing optimization results

2. **Performance Analysis**
   - Analyzing strategy performance
   - Comparing with benchmark
   - Visualizing results

3. **Signal Analysis**
   - Reviewing specific signals
   - Analyzing entry/exit points
   - Validating strategy logic

## Notes

- Interface primarily used in Performance Visualizer extensions
- Coordinate parameter changes with backtesting
- Consider performance implications of operations
- Handle benchmark comparisons appropriately 