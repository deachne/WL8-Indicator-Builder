# OptimizationResultList Class

**Namespace:** WealthLab.Backtest  
**Parent:** List<OptimizationResult>

The `OptimizationResultList` class extends `List<OptimizationResult>` to provide additional helper methods for analyzing and finding optimal results from a collection of optimization runs.

## Methods

### FindBest
```csharp
public OptimizationResult FindBest(string metric, bool highestValue)
```
Returns the `OptimizationResult` instance with the highest or lowest metric value.

**Parameters:**
- `metric`: The name of the metric to evaluate
- `highestValue`: If true, finds maximum value; if false, finds minimum value

**Returns:** The `OptimizationResult` with the best metric value according to the criteria

### FindMetric
```csharp
public double FindMetric(string metric, List<double> paramValues)
```
Retrieves a specific metric value based on parameter values.

**Parameters:**
- `metric`: The name of the metric to find
- `paramValues`: List of parameter values to match

**Returns:** The value of the specified metric for the matching parameter combination

## Usage Examples

### Finding Best Results
```csharp
public class OptimizationAnalyzer
{
    public void AnalyzeBestResults(OptimizationResultList results)
    {
        // Find best profit factor
        var bestPF = results.FindBest("ProfitFactor", true);
        Console.WriteLine($"Best Profit Factor: {bestPF.PerformanceMetrics["ProfitFactor"]}");
        
        // Find lowest drawdown
        var lowestDD = results.FindBest("MaxDrawdown", false);
        Console.WriteLine($"Lowest Drawdown: {lowestDD.PerformanceMetrics["MaxDrawdown"]}");
        
        // Display parameter values for best results
        Console.WriteLine("\nBest Profit Factor Parameters:");
        foreach (var param in bestPF.ParameterValues)
        {
            Console.WriteLine($"  {param}");
        }
        
        Console.WriteLine("\nLowest Drawdown Parameters:");
        foreach (var param in lowestDD.ParameterValues)
        {
            Console.WriteLine($"  {param}");
        }
    }
}
```

### Metric Analysis
```csharp
public class MetricAnalyzer
{
    public void AnalyzeMetricDistribution(OptimizationResultList results)
    {
        var metrics = new[] { "NetProfit", "ProfitFactor", "MaxDrawdown" };
        
        foreach (var metric in metrics)
        {
            // Find best and worst cases
            var best = results.FindBest(metric, true);
            var worst = results.FindBest(metric, false);
            
            Console.WriteLine($"\nMetric: {metric}");
            Console.WriteLine($"Best Value: {best.PerformanceMetrics[metric]}");
            Console.WriteLine($"Worst Value: {worst.PerformanceMetrics[metric]}");
            
            // Find specific parameter combination
            var specificParams = new List<double> { 10, 20, 30 }; // Example parameters
            var specificValue = results.FindMetric(metric, specificParams);
            Console.WriteLine($"Value for specific parameters: {specificValue}");
        }
    }
}
```

### Parameter Sensitivity Analysis
```csharp
public class SensitivityAnalyzer
{
    public void AnalyzeParameterSensitivity(OptimizationResultList results, 
        string targetMetric)
    {
        // Get unique parameter combinations
        var paramSets = results.Select(r => r.ParameterValues).Distinct();
        
        foreach (var paramSet in paramSets)
        {
            // Find metric value for this parameter set
            double metricValue = results.FindMetric(targetMetric, paramSet);
            
            Console.WriteLine("\nParameter Set:");
            for (int i = 0; i < paramSet.Count; i++)
            {
                Console.WriteLine($"  P{i + 1}: {paramSet[i]}");
            }
            Console.WriteLine($"  {targetMetric}: {metricValue}");
        }
    }
    
    public void FindOptimalParameters(OptimizationResultList results)
    {
        // Define metrics to analyze
        var metricsToAnalyze = new Dictionary<string, bool>
        {
            { "NetProfit", true },      // Higher is better
            { "ProfitFactor", true },   // Higher is better
            { "MaxDrawdown", false },   // Lower is better
            { "TradeCount", true }      // Higher is better
        };
        
        foreach (var kvp in metricsToAnalyze)
        {
            var bestResult = results.FindBest(kvp.Key, kvp.Value);
            
            Console.WriteLine($"\nBest {kvp.Key} Parameters:");
            for (int i = 0; i < bestResult.ParameterValues.Count; i++)
            {
                Console.WriteLine($"  P{i + 1}: {bestResult.ParameterValues[i]}");
            }
            Console.WriteLine($"  Value: {bestResult.PerformanceMetrics[kvp.Key]}");
        }
    }
}
```

## Best Practices

1. **Metric Selection**
   - Choose appropriate metrics for optimization goals
   - Consider both risk and return metrics
   - Use multiple metrics for robust analysis

2. **Parameter Analysis**
   - Analyze parameter sensitivity
   - Look for stable parameter regions
   - Consider parameter interactions

3. **Result Validation**
   - Verify parameter combinations exist
   - Handle missing or invalid metrics
   - Consider statistical significance

4. **Performance Optimization**
   - Cache frequently accessed results
   - Use efficient search patterns
   - Handle large result sets appropriately

## Notes

- Results are ordered by run number
- Parameter values must match exactly for FindMetric
- Consider multiple metrics for robust optimization
- Results may contain failed optimization runs
- Parameter order matters for matching 