# HistoricalDataPoint Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `HistoricalDataPoint` class represents a single data point on a WealthLab 8 chart, consisting of an x-axis index value and a y-axis value. This class is commonly used when working with chart data points and plotting functions.

## Properties

### Index
```csharp
public int Index
```
The x-axis value, representing the index into the `BarHistory` instance being charted.

### Value
```csharp
public double Value
```
The y-axis value at the specified index.

## Usage Examples

### Basic Point Creation
```csharp
// Create a data point at index 10 with value 100.5
var point = new HistoricalDataPoint
{
    Index = 10,
    Value = 100.5
};
```

### Working with Collections
```csharp
// Create a list of historical data points
var points = new List<HistoricalDataPoint>();

// Add points for a simple moving average
for (int i = 0; i < bars.Count; i++)
{
    points.Add(new HistoricalDataPoint
    {
        Index = i,
        Value = bars.Close[i]
    });
}
```

### Using with Chart Plotting
```csharp
public class MyStrategy : UserStrategyBase
{
    public override void Initialize(BarHistory bars)
    {
        // Create points for custom indicator
        var dataPoints = new List<HistoricalDataPoint>();
        
        for (int i = 0; i < bars.Count; i++)
        {
            // Calculate some custom value
            double customValue = (bars.High[i] + bars.Low[i]) / 2;
            
            dataPoints.Add(new HistoricalDataPoint
            {
                Index = i,
                Value = customValue
            });
        }
        
        // Use points for plotting or analysis
        foreach (var point in dataPoints)
        {
            // Access point data
            int barIndex = point.Index;
            double yValue = point.Value;
            
            // Use in calculations or plotting
        }
    }
}
```

### Finding Specific Points
```csharp
public List<HistoricalDataPoint> FindPeaks(BarHistory bars)
{
    var peaks = new List<HistoricalDataPoint>();
    
    // Skip first and last bars
    for (int i = 1; i < bars.Count - 1; i++)
    {
        // Check if current bar is a peak
        if (bars.High[i] > bars.High[i-1] && 
            bars.High[i] > bars.High[i+1])
        {
            peaks.Add(new HistoricalDataPoint
            {
                Index = i,
                Value = bars.High[i]
            });
        }
    }
    
    return peaks;
}
```

This example demonstrates:
- Creating individual data points
- Working with collections of data points
- Using points for chart analysis
- Finding specific patterns in price data 