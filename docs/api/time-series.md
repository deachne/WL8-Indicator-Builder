# TimeSeries Class

**Namespace:** WealthLab.Core  
**Parent:** TimeSeriesBase  
**Descendants:** IndicatorBase

The `TimeSeries` class is a fundamental data structure in WealthLab 8, managing a synchronized list of numeric values and their corresponding dates.

## Overview

`TimeSeries` provides:
- A list of double-precision values
- A corresponding list of DateTime values
- Advanced mathematical and statistical operations
- Flexible data manipulation capabilities

## Constructors

### Parameterless Constructor
```csharp
public TimeSeries()
```
Creates an empty TimeSeries that manages its own DateTimes.

### DateTime List Constructor
```csharp
public TimeSeries(List<DateTime> dateTimes, bool fillNaN = true)
```
Creates a TimeSeries with a predefined list of DateTimes.

**Parameters:**
- `dateTimes`: List of DateTime values
- `fillNaN`: If true, populates Values with `Double.NaN`

### Filled Constructor
```csharp
public TimeSeries(List<DateTime> dateTimes, double fillValue)
```
Creates a TimeSeries with a predefined list of DateTimes and a specific fill value.

## Core Properties

### Values
```csharp
public List<double> Values
```
Contains the numeric values of the time series.

### DateTimes
```csharp
public virtual List<DateTime> DateTimes
```
Contains the corresponding dates for each value.

### Count
```csharp
public int Count
```
Returns the number of items in the time series.

### StartDate and EndDate
```csharp
public DateTime StartDate
public DateTime EndDate
```
Returns the first and last DateTime in the series.

## Key Methods

### Mathematical Operations

#### Abs
```csharp
public TimeSeries Abs()
```
Returns a new TimeSeries with absolute values.

#### LogReturn
```csharp
public TimeSeries LogReturn(int period)
```
Calculates log returns for a specified period.

#### Sum
```csharp
public TimeSeries Sum(int period)
```
Returns a new TimeSeries summed over the specified period.

### Statistical Methods

#### GetHighest and GetLowest
```csharp
public double GetHighest(int bar, int range)
public double GetLowest(int bar, int range)
public int GetHighestBar(int bar, int range)
public int GetLowestBar(int bar, int range)
```
Find highest/lowest values and their bar indices.

#### Kurtosis and Skewness
```csharp
public TimeSeries Kurtosis(int period)
public TimeSeries Skewness(int period)
```
Calculate statistical distribution measures.

### Comparison Methods

#### CrossesOver and CrossesUnder
```csharp
public bool CrossesOver(double value, int idx)
public bool CrossesOver(TimeSeries ts, int idx)
public bool CrossesUnder(double value, int idx)
public bool CrossesUnder(TimeSeries ts, int idx)
```
Detect value crossover and crossunder events.

## Operator Overloads

### Arithmetic Operators
```csharp
TimeSeries operator +(TimeSeries, TimeSeries)
TimeSeries operator -(TimeSeries)
TimeSeries operator *(TimeSeries, double)
TimeSeries operator /(TimeSeries, TimeSeries)
```

### Comparison Operators
```csharp
TimeSeries operator <(TimeSeries, TimeSeries)
TimeSeries operator >(TimeSeries, TimeSeries)
TimeSeries operator <=(TimeSeries, TimeSeries)
TimeSeries operator >=(TimeSeries, TimeSeries)
```

### Shift Operators
```csharp
TimeSeries operator <<(TimeSeries, int)  // Backward shift
TimeSeries operator >>(TimeSeries, int)  // Forward shift
```

## Static Methods

### Mathematical Transformations
```csharp
static TimeSeries Log(TimeSeries)
static TimeSeries Sqrt(TimeSeries)
static TimeSeries Pow(TimeSeries, double)
static TimeSeries Round(TimeSeries)
```

### Aggregation Methods
```csharp
static TimeSeries Max(TimeSeries, int period)
static TimeSeries Min(TimeSeries, int period)
static TimeSeries Sum(TimeSeries, int length)
```

## Usage Examples

### Basic TimeSeries Creation and Manipulation
```csharp
public class TimeSeriesDemo
{
    public void DemonstrateTimeSeries()
    {
        // Create TimeSeries from existing data
        var dateTimes = new List<DateTime> { 
            DateTime.Now.AddDays(-2), 
            DateTime.Now.AddDays(-1), 
            DateTime.Now 
        };
        var values = new List<double> { 10.0, 15.5, 12.3 };
        
        var timeSeries = new TimeSeries(dateTimes);
        for (int i = 0; i < values.Count; i++)
        {
            timeSeries[i] = values[i];
        }

        // Perform calculations
        var absoluteValues = timeSeries.Abs();
        var logReturns = timeSeries.LogReturn(1);
        
        // Find highest/lowest values
        double highest = timeSeries.GetHighest(timeSeries.Count - 1, timeSeries.Count);
        double lowest = timeSeries.GetLowest(timeSeries.Count - 1, timeSeries.Count);
    }
}
```

### Advanced Time Series Analysis
```csharp
public class TimeSeriesAnalyzer
{
    public void AnalyzeTimeSeries(TimeSeries prices)
    {
        // Calculate statistical measures
        var kurtosis = prices.Kurtosis(20);
        var skewness = prices.Skewness(20);
        
        // Detect crossover events
        bool crossedOver = prices.CrossesOver(prices.GetHighest(prices.Count - 1, 20), prices.Count - 1);
        
        // Perform mathematical transformations
        var logPrices = TimeSeries.Log(prices);
        var squaredPrices = TimeSeries.Pow(prices, 2);
    }
}
```

## Best Practices

1. **Data Synchronization**
   - Ensure DateTimes and Values lists are always synchronized
   - Use constructors that maintain list integrity

2. **Performance**
   - Minimize unnecessary TimeSeries creation
   - Use built-in methods for efficient calculations
   - Consider memory usage with large time series

3. **Null and NaN Handling**
   - Handle `Double.NaN` values appropriately
   - Use `FirstValidIndex` to skip initial invalid data

## Performance Considerations

- `TimeSeries` instances can be memory-intensive
- Prefer built-in methods over manual calculations
- Use lazy evaluation when possible
- Consider caching results of expensive computations

## Notes

- Fundamental to WealthLab's data processing
- Supports complex financial time series analysis
- Provides extensive mathematical and statistical operations
- Designed for high-performance financial computing

## Requirements

- Understanding of time series data structures
- Familiarity with financial mathematics
- Knowledge of statistical analysis techniques 