# HistoryScale Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `HistoryScale` class represents a data time scale for historical market data, such as daily, weekly, or intraday intervals. It provides a unified way to specify and work with different time frequencies in WealthLab 8.

## Constructors

### HistoryScale
```csharp
public HistoryScale(Frequency scale, int interval = 0)
```

Creates a new instance of `HistoryScale`.

**Parameters:**
- `scale`: A `Frequency` enum value specifying the base time scale
- `interval`: Optional interval for intraday scales (Tick, Second, Minute)

## Properties

### Description
```csharp
public string Description
```
Returns a human-readable description of the scale (e.g., "Daily", "5-Minute", "Weekly").

### Frequency
```csharp
public Frequency Frequency
```
The base frequency of the scale as a `Frequency` enum value. Possible values:
- `Daily`
- `Weekly`
- `Monthly`
- `Quarterly`
- `Yearly`
- `Tick`
- `Second`
- `Minute`

### Interval
```csharp
public int Interval
```
The time interval for intraday scales (Tick, Second, Minute). For example, a value of 5 with `Frequency.Minute` represents 5-minute bars.

### IsIntraday
```csharp
public bool IsIntraday
```
Returns true if this scale represents an intraday timeframe (Tick, Second, or Minute).

## Static Properties

```csharp
public static HistoryScale Daily = new HistoryScale(Frequency.Daily)
public static HistoryScale Weekly = new HistoryScale(Frequency.Weekly)
public static HistoryScale Monthly = new HistoryScale(Frequency.Monthly)
public static HistoryScale Quarterly = new HistoryScale(Frequency.Quarterly)
public static HistoryScale Yearly = new HistoryScale(Frequency.Yearly)
```

Convenient static properties for commonly used scales. These can be used instead of creating new instances.

## Usage Examples

### Basic Scale Creation
```csharp
// Create a 5-minute scale
var fiveMin = new HistoryScale(Frequency.Minute, 5);

// Create a daily scale
var daily = new HistoryScale(Frequency.Daily);

// Use static helper
var weekly = HistoryScale.Weekly;
```

### Using with BarHistory
```csharp
public class MyStrategy : UserStrategyBase
{
    public override void Initialize(BarHistory bars)
    {
        // Check if we're working with intraday data
        if (bars.Scale.IsIntraday)
        {
            if (bars.Scale.Frequency == Frequency.Minute)
            {
                int interval = bars.Scale.Interval;
                Debug.WriteLine($"Working with {interval}-minute data");
            }
        }
        
        // Get scale description
        Debug.WriteLine($"Data Scale: {bars.Scale.Description}");
    }
}
```

### Scale Comparison
```csharp
public bool IsValidScale(HistoryScale scale)
{
    // Check for specific timeframes
    if (scale.Frequency == Frequency.Daily)
        return true;
        
    if (scale.IsIntraday && scale.Interval >= 5)
        return true;
        
    return false;
}
```

### Creating Custom Scales
```csharp
public class ScaleManager
{
    public Dictionary<string, HistoryScale> GetCommonScales()
    {
        return new Dictionary<string, HistoryScale>
        {
            { "1min", new HistoryScale(Frequency.Minute, 1) },
            { "5min", new HistoryScale(Frequency.Minute, 5) },
            { "15min", new HistoryScale(Frequency.Minute, 15) },
            { "30min", new HistoryScale(Frequency.Minute, 30) },
            { "60min", new HistoryScale(Frequency.Minute, 60) },
            { "D", HistoryScale.Daily },
            { "W", HistoryScale.Weekly },
            { "M", HistoryScale.Monthly }
        };
    }
}
```

This example demonstrates:
- Creating various time scales
- Using static helpers
- Scale comparison and validation
- Managing multiple scales 