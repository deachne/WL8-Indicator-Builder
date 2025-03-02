# IOptimizationHost Interface

**Namespace:** WealthLab.Backtest  
**Parent:** None

The `IOptimizationHost` interface enables Optimization Visualizers to communicate with their host Optimization (Strategy) window. It provides methods and properties to interact with different optimization methods and retrieve optimization-related information.

## Properties

### OptimizationMethod
```csharp
OptimizerBase OptimizationMethod
```
Returns the selected Optimizer (an instance of the `OptimizerBase` class) that was used during the optimization process.

### StrategyHost
```csharp
IStrategyHost StrategyHost
```
Returns an instance of the `IStrategyHost` interface, allowing communication with the host Strategy window.

### StrategyOptimizer
```csharp
StrategyOptimizer StrategyOptimizer
```
Returns the instance of the `StrategyOptimizer` used to perform the standard optimization.

### WFOOptimizer
```csharp
WFOOptimizer WFOOptimizer
```
Returns the instance of the `WFOOptimizer` used to perform the Walk Forward Optimization (WFO).

## Methods

### RunWFOBacktest
```csharp
void RunWFOBacktest()
```
Triggers the Strategy window to run a backtest using the out-of-sample Walk Forward Optimization (WFO) Parameter instances.

### ShowDetailedResults
```csharp
void ShowDetailedResults(WFOResult wfor)
```
Causes the Strategy window to run a standard optimization using the date range specified in the provided `WFOResult` instance.

**Parameters:**
- `wfor`: A `WFOResult` instance containing the optimization date range details

## Usage Examples

### Standard Optimization Interaction
```csharp
public class MyOptimizationVisualizer
{
    private IOptimizationHost _optimizationHost;

    public void InitializeOptimization(IOptimizationHost host)
    {
        _optimizationHost = host;

        // Access optimization method
        OptimizerBase optimizer = _optimizationHost.OptimizationMethod;
        
        // Interact with strategy host
        IStrategyHost strategyHost = _optimizationHost.StrategyHost;
    }
}
```

### Walk Forward Optimization (WFO) Example
```csharp
public class WFOVisualizerExtension
{
    private IOptimizationHost _optimizationHost;

    public void AnalyzeWFOResults()
    {
        // Get WFO Optimizer
        WFOOptimizer wfoOptimizer = _optimizationHost.WFOOptimizer;

        // Run WFO backtest
        _optimizationHost.RunWFOBacktest();

        // Show detailed results for a specific WFO result
        WFOResult selectedResult = GetSelectedWFOResult();
        if (selectedResult != null)
        {
            _optimizationHost.ShowDetailedResults(selectedResult);
        }
    }

    private WFOResult GetSelectedWFOResult()
    {
        // Implementation to retrieve selected WFO result
        return null;
    }
}
```

### Strategy Optimizer Interaction
```csharp
public class OptimizationAnalyzer
{
    private IOptimizationHost _optimizationHost;

    public void AnalyzeOptimizationResults()
    {
        // Access strategy optimizer
        StrategyOptimizer strategyOptimizer = _optimizationHost.StrategyOptimizer;

        // Retrieve optimization results
        var results = strategyOptimizer.Results;
        
        // Perform analysis or visualization
        foreach (var result in results)
        {
            // Process each optimization result
            ProcessOptimizationResult(result);
        }
    }

    private void ProcessOptimizationResult(object result)
    {
        // Custom result processing logic
    }
}
```

## Best Practices

1. Always check for null before accessing properties
2. Use the appropriate optimizer based on optimization type
3. Handle potential exceptions when interacting with optimization hosts
4. Leverage the `IStrategyHost` for additional strategy-related interactions
5. Be mindful of performance when processing large optimization result sets

## Optimization Types

- **Standard Optimization:** Explores parameter combinations systematically
- **Walk Forward Optimization (WFO):** Tests strategy performance across different time windows
- **Out-of-Sample Testing:** Validates strategy performance on unseen data

## Considerations

- The interface provides a flexible way to interact with different optimization methods
- Different optimization types (standard, WFO) have unique characteristics
- Always validate and analyze optimization results carefully 