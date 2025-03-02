# WFOResult Class

**Namespace:** WealthLab.Backtest  
**Parent:** OptimizationResult

The `WFOResult` class encapsulates the performance results and detailed information for a single Walk-Forward Optimization (WFO) run.

## Overview

`WFOResult` provides comprehensive insights into:
- In-sample and out-of-sample performance
- Optimization interval details
- Parameter values
- Performance metrics

## Properties

### Performance Metrics

#### AnnualizedReturn
```csharp
public double AnnualizedReturn
```
Returns the annualized return (APR) for the optimization run.

#### PerformanceMetrics
```csharp
public Dictionary<string, double> PerformanceMetrics
```
Contains performance metrics determined by the ScoreCard used during optimization.

#### MetricNames
```csharp
public List<string> MetricNames
```
Returns the list of performance metric names from the ScoreCard.

#### WFOEfficiency
```csharp
public double WFOEfficiency
```
Calculates the Walk-Forward Optimization Efficiency.

**Calculation:**
- Percentage gain of out-of-sample annualized return over in-sample return

## Optimization Interval Properties

### IntervalNumber
```csharp
public int IntervalNumber
```
The interval number of the walk-forward optimization run.

**Range:** 0 to (WFO Intervals - 1)

### StartDate
```csharp
public DateTime StartDate
```
Start date for the entire walk-forward optimization run.

### EndDate
```csharp
public DateTime EndDate
```
End date for the entire walk-forward optimization run.

### TimeSpan
```csharp
public TimeSpan TimeSpan
```
Complete time span of the walk-forward optimization run.

## Sample-Specific Properties

### IsInSample
```csharp
public bool IsInSample
```
Indicates whether the result represents in-sample or out-of-sample performance.

### InSampleStartDate
```csharp
public DateTime InSampleStartDate
```
Start date of the in-sample optimization period.

### InSampleEndDate
```csharp
public DateTime InSampleEndDate
```
End date of the in-sample optimization period.

### OutOfSampleStartDate
```csharp
public DateTime OutOfSampleStartDate
```
Start date of the out-of-sample validation period.

### OutOfSampleEndDate
```csharp
public DateTime OutOfSampleEndDate
```
End date of the out-of-sample validation period.

## Optimization Details

### BaseOptimization
```csharp
public StrategyOptimizer BaseOptimization
```
Contains the complete results of the in-sample optimization (only when `IsInSample` is true).

### ParameterValues
```csharp
public List<double> ParameterValues
```
Returns the parameter values used in this optimization run.

### RunNumber
```csharp
public int RunNumber
```
The chronological run number of these results.

### ErrorMessage
```csharp
public string ErrorMessage
```
Contains any error message if an exception occurred during optimization.

## Usage Examples

### Basic WFO Result Analysis
```csharp
public class WFOResultAnalyzer
{
    public void AnalyzeWFOResults(WFOOptimizer wfoOptimizer)
    {
        foreach (var result in wfoOptimizer.WFOResults)
        {
            Console.WriteLine($"Interval {result.IntervalNumber}:");
            
            // Performance metrics
            Console.WriteLine("Performance Metrics:");
            foreach (var metric in result.MetricNames)
            {
                Console.WriteLine(
                    $"  {metric}: {result.PerformanceMetrics[metric]}"
                );
            }
            
            // Date ranges
            Console.WriteLine($"In-Sample Period: " +
                $"{result.InSampleStartDate} - {result.InSampleEndDate}");
            Console.WriteLine($"Out-of-Sample Period: " +
                $"{result.OutOfSampleStartDate} - {result.OutOfSampleEndDate}");
            
            // Efficiency and return
            Console.WriteLine($"Annualized Return: {result.AnnualizedReturn:P2}");
            Console.WriteLine($"WFO Efficiency: {result.WFOEfficiency:P2}");
        }
    }
}
```

### Advanced WFO Result Filtering
```csharp
public class WFOResultFilter
{
    public List<WFOResult> FilterHighPerformanceResults(
        List<WFOResult> wfoResults, 
        string performanceMetric, 
        double threshold)
    {
        return wfoResults
            .Where(result => 
                result.PerformanceMetrics[performanceMetric] > threshold &&
                result.WFOEfficiency > 0)
            .OrderByDescending(result => 
                result.PerformanceMetrics[performanceMetric])
            .ToList();
    }
}
```

## Best Practices

1. **Performance Analysis**
   - Compare in-sample and out-of-sample metrics
   - Look for consistent performance across intervals
   - Use multiple performance metrics

2. **Efficiency Evaluation**
   - Analyze WFO Efficiency carefully
   - Be cautious of results with negative efficiency
   - Consider the stability of annualized returns

3. **Error Handling**
   - Always check `ErrorMessage` for potential issues
   - Validate optimization results thoroughly

## Performance Considerations

- Avoid excessive iterations through WFO results
- Use efficient LINQ queries
- Cache results when possible

## Potential Pitfalls

🚨 **Caution:**
- High in-sample performance doesn't guarantee future success
- Out-of-sample performance can differ significantly
- Continuous monitoring is crucial

## Notes

- Provides detailed walk-forward optimization insights
- Essential for strategy validation and selection
- Helps reduce overfitting risks
- Part of advanced algorithmic trading toolkit 