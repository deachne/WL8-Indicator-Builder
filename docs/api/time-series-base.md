# TimeSeriesBase Class

**Namespace:** WealthLab.Core  
**Parent:** DateSynchedList<double>  
**Descendants:** BarHistory, TimeSeries

The `TimeSeriesBase` is an abstract base class that provides fundamental infrastructure for working with time-synchronized data series in WealthLab. It serves as the foundation for key classes like `TimeSeries` and `BarHistory`, enabling synchronized access to time-based data.

## Overview

`TimeSeriesBase` manages a collection of data points keyed to a list of DateTimes, allowing seamless interaction with time series data across different WealthLab components.

## Key Characteristics

- Maintains a synchronized list of DateTimes
- Provides caching mechanism for performance optimization
- Supports ad-hoc data storage
- Enables flexible time-based data access and manipulation

## Properties

### Cache
```csharp
public ConcurrentDictionary<string, object> Cache
```
A thread-safe cache dictionary for storing objects during a backtest run.

**Usage Example:**
```csharp
// Store and retrieve cached indicators
if (!timeSeries.Cache.ContainsKey("MyIndicator"))
{
    var indicator = ComputeIndicator(timeSeries);
    timeSeries.Cache["MyIndicator"] = indicator;
}
var cachedIndicator = timeSeries.Cache["MyIndicator"] as MyIndicatorType;
```

### Count
```csharp
public int Count
```
Returns the number of items in the time series.

**Usage Example:**
```csharp
int dataPointCount = timeSeries.Count;
Console.WriteLine($"Total data points: {dataPointCount}");
```

### DateTimes
```csharp
public virtual List<DateTime> DateTimes
```
A list of DateTime objects representing the timestamp for each data point.

**Usage Example:**
```csharp
// Iterate through timestamps
foreach (DateTime timestamp in timeSeries.DateTimes)
{
    Console.WriteLine($"Data point timestamp: {timestamp}");
}
```

### EndDate
```csharp
public DateTime EndDate
```
Returns the last DateTime in the series. Returns `DateTime.MaxValue` if the series is empty.

**Usage Example:**
```csharp
DateTime lastDataPoint = timeSeries.EndDate;
Console.WriteLine($"Last data point date: {lastDataPoint}");
```

### StartDate
```csharp
public DateTime StartDate
```
Returns the first DateTime in the series. Returns `DateTime.MinValue` if the series is empty.

**Usage Example:**
```csharp
DateTime firstDataPoint = timeSeries.StartDate;
Console.WriteLine($"First data point date: {firstDataPoint}");
```

### TimeSpan
```csharp
public TimeSpan TimeSpan
```
Returns the total time range of the DateTimes. Returns zero TimeSpan if fewer than two DateTimes exist.

**Usage Example:**
```csharp
TimeSpan dataRange = timeSeries.TimeSpan;
Console.WriteLine($"Data time range: {dataRange.TotalDays} days");
```

### UserData
```csharp
public object UserData
```
Allows storing ad-hoc data with the time series instance.

**Usage Example:**
```csharp
// Store custom metadata
timeSeries.UserData = new { 
    Source = "Market Data Provider", 
    Version = "1.0" 
};
```

### UserDataAsDouble and UserDataAsInt
```csharp
public double UserDataAsDouble
public int UserDataAsInt
```
Convenient accessors for storing and retrieving numeric user data.

**Usage Example:**
```csharp
timeSeries.UserData = 42.5;
double value = timeSeries.UserDataAsDouble; // 42.5
```

## Methods

### IndexOf
```csharp
public int IndexOf(DateTime dt, bool exactMatchOnly = false)
```
Finds the index of a specific DateTime in the series.

**Usage Example:**
```csharp
// Find index of a specific date
DateTime searchDate = DateTime.Now;
int index = timeSeries.IndexOf(searchDate);
if (index != -1)
{
    Console.WriteLine($"Found data point at index {index}");
}
```

### IsUpToDate
```csharp
public virtual bool IsUpToDate(DateTime endDate)
```
Checks if historical data is current, considering market holidays and trading times.

**Usage Example:**
```csharp
bool isCurrentData = timeSeries.IsUpToDate(DateTime.Now);
Console.WriteLine($"Data is up to date: {isCurrentData}");
```

## Best Practices

1. **Caching**
   - Use the `Cache` for storing computationally expensive derived data
   - Implement cache invalidation strategies
   - Be mindful of memory usage

2. **Time Series Manipulation**
   - Always check `Count` before accessing data
   - Use `IndexOf` for precise date lookups
   - Leverage `StartDate` and `EndDate` for data range validation

3. **Performance Considerations**
   - Minimize repeated calls to expensive methods
   - Use `UserData` judiciously
   - Prefer typed accessors like `UserDataAsDouble`

## Notes

- Fundamental to WealthLab's time-based data handling
- Supports both equity and futures market data
- Provides flexible, synchronized data access

## Inheritance and Polymorphism

Derived classes:
- `TimeSeries`: Manages series of double values
- `BarHistory`: Represents historical OHLCV data

## Example: Advanced Time Series Usage

```csharp
public class TimeSeriesAnalyzer
{
    public void AnalyzeTimeSeries(TimeSeriesBase timeSeries)
    {
        // Comprehensive time series analysis
        Console.WriteLine($"Data Points: {timeSeries.Count}");
        Console.WriteLine($"Date Range: {timeSeries.StartDate} to {timeSeries.EndDate}");
        Console.WriteLine($"Total Time Span: {timeSeries.TimeSpan.TotalDays} days");
        
        // Custom caching and metadata
        timeSeries.Cache["AnalysisTimestamp"] = DateTime.Now;
        timeSeries.UserData = new { 
            AnalysisType = "Comprehensive", 
            Confidence = 0.95 
        };
    }
}
```

## Cautions

- Ensure thread safety when using `Cache`
- Be aware of memory implications of storing large objects
- Validate data before accessing to prevent null reference exceptions 