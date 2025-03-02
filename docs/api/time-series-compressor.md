# TimeSeriesCompressor Class

**Namespace:** WealthLab.Core  
**Parent:** Static Utility Class

The `TimeSeriesCompressor` is a static utility class that provides methods for compressing `TimeSeries` instances from one time scale to a more compressed scale, enabling flexible time series data aggregation.

## Overview

`TimeSeriesCompressor` allows developers to transform high-granularity time series data into lower-frequency representations, such as converting minute-level data to daily or weekly series.

## Key Characteristics

- Static methods for time series compression
- Supports multiple time scales
- Preserves timestamp synchronization
- Handles various market trading scenarios

## Static Methods

### ToDaily
```csharp
public static TimeSeries ToDaily(TimeSeries source)
public static TimeSeries ToDaily(TimeSeries source, MarketDetails market)
```
Compresses the source TimeSeries to a daily scale.

**Parameters:**
- `source`: Source TimeSeries to compress
- `market` (optional): MarketDetails for specific market trading rules

**Remarks:**
- Useful for converting intraday data to daily scale
- Final value represents the last bar of the day
- Globex-type markets trading through midnight can use market parameter

**Usage Example:**
```csharp
TimeSeries minuteData = GetMinuteTimeSeries();
TimeSeries dailyData = TimeSeriesCompressor.ToDaily(minuteData);
```

### ToMinute
```csharp
public static TimeSeries ToMinute(TimeSeries source, int interval, MarketDetails market)
```
Compresses the source TimeSeries to an interval-minute scale.

**Parameters:**
- `source`: Intraday TimeSeries with higher granularity
- `interval`: Desired minute interval (e.g., 5, 15, 30)
- `market`: MarketDetails for synchronizing to market open

**Remarks:**
- Source must have higher granularity than requested interval
- Market parameter helps determine correct market open time

**Usage Example:**
```csharp
TimeSeries oneMinuteData = GetOneMinuteTimeSeries();
TimeSeries fiveMinuteData = TimeSeriesCompressor.ToMinute(oneMinuteData, 5, marketDetails);
```

### ToMonthly
```csharp
public static TimeSeries ToMonthly(TimeSeries source)
```
Compresses the source TimeSeries to a monthly scale.

**Remarks:**
- Synchronizes with final bar of each month
- For intraday sources, consider Pre/Post Market Data Strategy Setting
- Returns value of last source bar for the month

**Usage Example:**
```csharp
TimeSeries dailyData = GetDailyTimeSeries();
TimeSeries monthlyData = TimeSeriesCompressor.ToMonthly(dailyData);
```

### ToQuarterly
```csharp
public static TimeSeries ToQuarterly(TimeSeries source)
```
Compresses the source TimeSeries to a quarterly scale.

**Remarks:**
- Synchronizes with final bar of each quarter (March, June, September, December)
- Considers Pre/Post Market Data Strategy Setting
- Returns value of last source bar for the quarter

**Usage Example:**
```csharp
TimeSeries monthlyData = GetMonthlyTimeSeries();
TimeSeries quarterlyData = TimeSeriesCompressor.ToQuarterly(monthlyData);
```

### ToWeekly
```csharp
public static TimeSeries ToWeekly(TimeSeries source)
```
Compresses the source TimeSeries to a weekly scale.

**Remarks:**
- Synchronizes with final bar of each week
- Considers Pre/Post Market Data Strategy Setting
- Returns value of last source bar for the week

**Usage Example:**
```csharp
TimeSeries dailyData = GetDailyTimeSeries();
TimeSeries weeklyData = TimeSeriesCompressor.ToWeekly(dailyData);
```

### ToYearly
```csharp
public static TimeSeries ToYearly(TimeSeries source)
```
Compresses the source TimeSeries to a yearly scale.

**Usage Example:**
```csharp
TimeSeries monthlyData = GetMonthlyTimeSeries();
TimeSeries yearlyData = TimeSeriesCompressor.ToYearly(monthlyData);
```

## Comprehensive Example: Multi-Scale Analysis

```csharp
public class TimeSeriesScaleAnalyzer
{
    public void AnalyzeMultipleScales(TimeSeries sourceData)
    {
        // Compress to different scales
        TimeSeries dailyData = TimeSeriesCompressor.ToDaily(sourceData);
        TimeSeries weeklyData = TimeSeriesCompressor.ToWeekly(sourceData);
        TimeSeries monthlyData = TimeSeriesCompressor.ToMonthly(sourceData);
        
        // Analyze each scale
        Console.WriteLine($"Source Data Points: {sourceData.Count}");
        Console.WriteLine($"Daily Data Points: {dailyData.Count}");
        Console.WriteLine($"Weekly Data Points: {weeklyData.Count}");
        Console.WriteLine($"Monthly Data Points: {monthlyData.Count}");
    }
}
```

## Best Practices

1. **Scale Selection**
   - Choose appropriate compression scales
   - Ensure source data has sufficient granularity
   - Consider market-specific trading characteristics

2. **Data Integrity**
   - Validate compressed data against source
   - Be aware of data loss during compression
   - Use `TimeSeriesSynchronizer` for expanding compressed data

3. **Performance Considerations**
   - Compression can reduce memory usage
   - Be mindful of computational overhead
   - Cache compressed series when possible

## Cautions

⚠️ Important Considerations:
- Intraday closing prices may not match daily settled closes
- Different compression methods can yield varying results
- Always verify compressed data matches expectations

## Related Classes

- `BarHistoryCompressor`: Similar compression for OHLCV data
- `TimeSeriesSynchronizer`: Expands compressed time series

## Notes

- Essential for multi-scale financial analysis
- Supports various time series compression scenarios
- Flexible approach to data aggregation

## Performance Tips

- Reuse compressed time series when possible
- Consider memory implications of repeated compression
- Profile compression performance for large datasets 