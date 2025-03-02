# OptimizationResult Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object  
**Descendants:** WFOResult

The `OptimizationResult` class contains performance metrics and details for a specific optimization run. It provides access to various performance metrics, parameter values, and run information that can be used to analyze and compare different optimization results.

## Core Properties

### AnnualizedReturn
```csharp
public double AnnualizedReturn
```
Returns the annualized return (APR) of the optimization run. This metric is particularly important for calculating Walk-Forward Optimization (WFO) Efficiency.

### ErrorMessage
```csharp
public string ErrorMessage
```
Contains the message field from any Exception thrown during the optimization run. Returns null if no Exception occurred.

### RunNumber
```csharp
public int RunNumber
```
Returns the chronological run number of these results, indicating the sequence in which this optimization was performed.

## Metrics and Parameters

### MetricNames
```csharp
public List<string> MetricNames
```
Returns the list of performance metric names, obtained from the `OptimizableMetricNames` property of the ScoreCard used during optimization.

### ParameterValues
```csharp
public List<double> ParameterValues
```
Returns the values of the parameters used in this optimization run.

### PerformanceMetrics
```csharp
public Dictionary<string, double> PerformanceMetrics
```
A dictionary containing entries for each performance metric from the optimization run. The metrics are determined by the ScoreCard used during optimization, with values corresponding to the metrics listed in `MetricNames`.

## Usage Examples

### Basic Optimization Analysis
```csharp
public class OptimizationAnalyzer
{
    public void AnalyzeResult(OptimizationResult result)
    {
        // Check for errors
        if (!string.IsNullOrEmpty(result.ErrorMessage))
        {
            Console.WriteLine($"Error in run #{result.RunNumber}: {result.ErrorMessage}");
            return;
        }
        
        // Analyze performance
        Console.WriteLine($"Run #{result.RunNumber}");
        Console.WriteLine($"Annual Return: {result.AnnualizedReturn:P2}");
        
        // Display parameters
        Console.WriteLine("\nParameters:");
        for (int i = 0; i < result.ParameterValues.Count; i++)
        {
            Console.WriteLine($"  Param {i + 1}: {result.ParameterValues[i]}");
        }
        
        // Display metrics
        Console.WriteLine("\nPerformance Metrics:");
        foreach (var metric in result.MetricNames)
        {
            double value = result.PerformanceMetrics[metric];
            Console.WriteLine($"  {metric}: {value}");
        }
    }
}
```

### Comparing Multiple Results
```csharp
public class OptimizationComparator
{
    public OptimizationResult FindBestResult(List<OptimizationResult> results)
    {
        // Filter out results with errors
        var validResults = results.Where(r => 
            string.IsNullOrEmpty(r.ErrorMessage)).ToList();
            
        // Sort by annualized return
        return validResults.OrderByDescending(r => r.AnnualizedReturn)
                         .FirstOrDefault();
    }
    
    public void CompareResults(List<OptimizationResult> results)
    {
        foreach (var result in results)
        {
            // Skip failed runs
            if (!string.IsNullOrEmpty(result.ErrorMessage))
                continue;
                
            Console.WriteLine($"\nRun #{result.RunNumber}");
            
            // Compare key metrics
            foreach (var metric in result.MetricNames)
            {
                double value = result.PerformanceMetrics[metric];
                Console.WriteLine($"  {metric}: {value}");
            }
            
            // Show parameter combinations
            Console.WriteLine("  Parameters:");
            for (int i = 0; i < result.ParameterValues.Count; i++)
            {
                Console.WriteLine($"    P{i + 1}: {result.ParameterValues[i]}");
            }
        }
    }
}
```

### Metric Analysis
```csharp
public class MetricAnalyzer
{
    public Dictionary<string, (double Min, double Max, double Avg)> 
        AnalyzeMetrics(List<OptimizationResult> results)
    {
        var analysis = new Dictionary<string, (double Min, double Max, double Avg)>();
        
        // Get valid results
        var validResults = results.Where(r => 
            string.IsNullOrEmpty(r.ErrorMessage)).ToList();
            
        if (!validResults.Any())
            return analysis;
            
        // Analyze each metric
        foreach (var metric in validResults[0].MetricNames)
        {
            var values = validResults.Select(r => 
                r.PerformanceMetrics[metric]).ToList();
                
            analysis[metric] = (
                Min: values.Min(),
                Max: values.Max(),
                Avg: values.Average()
            );
        }
        
        return analysis;
    }
}
```

## Best Practices

1. **Error Handling**
   - Always check `ErrorMessage` before processing results
   - Handle null or empty results appropriately
   - Consider impact of errors on overall optimization

2. **Performance Analysis**
   - Compare multiple metrics for robust evaluation
   - Consider risk-adjusted returns
   - Look for consistency across runs

3. **Parameter Management**
   - Track parameter combinations with results
   - Analyze parameter sensitivity
   - Consider parameter interactions

4. **Metric Selection**
   - Choose appropriate metrics for strategy goals
   - Consider multiple timeframes
   - Balance different performance aspects

## Notes

- Results are generated during optimization runs
- Metrics depend on ScoreCard configuration
- Parameter values correspond to strategy parameters
- Run numbers are sequential and unique
- Consider using multiple metrics for evaluation
- Results can be used for Walk-Forward Analysis 