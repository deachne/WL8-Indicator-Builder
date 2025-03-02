# BarHistoryCompressor Class

**Namespace:** WealthLab.Core  
**Parent:** None (Static Class)

BarHistoryCompressor is a static utility class containing methods that let you compress a BarHistory instance from one scale down to a more compressed scale. For example, you can call BarHistoryCompressor.ToWeekly to compress a daily BarHistory into a weekly one.

**Note:** If you want to be able to plot a compressed BarHistory onto the chart, you would need to first expand it back to the original scale. You can use the BarHistorySynchronizer utility class to accomplish this.

## Static Methods

### ToDaily
```csharp
public static BarHistory ToDaily(BarHistory source)
```
Compresses the source BarHistory to a daily scale, returning a new BarHistory instance.

### ToHour
```csharp
public static BarHistory ToHour(BarHistory source, int interval)
```
Compresses the source BarHistory to an interval-hour hourly scale, returning a new BarHistory instance.

### ToMinute
```csharp
public static BarHistory ToMinute(BarHistory source, int interval)
```
Compresses the source BarHistory to an interval-minute scale, returning a new BarHistory instance. The source should be an intraday BarHistory having higher granularity scale than the requested interval. For example, it makes sense to compress a source of 1 minute data to a 5 minute interval, but not the other way around.

### ToMonthly
```csharp
public static BarHistory ToMonthly(BarHistory source)
```
Compresses the source BarHistory to a monthly scale, returning a new BarHistory instance.

### ToQuarterly
```csharp
public static BarHistory ToQuarterly(BarHistory source)
```
Compresses the source BarHistory to a quarterly scale, returning a new BarHistory instance.

### ToScale
```csharp
public static BarHistory ToScale(BarHistory source, Frequency scale)
```
Compresses the source BarHistory to the specified scale, returning a new BarHistory instance.

### ToWeekly
```csharp
public static BarHistory ToWeekly(BarHistory source)
```
Compresses the source BarHistory to a weekly scale, returning a new BarHistory instance.

**Note:** For markets that trade 7 days of the week (e.g. Cryptos), the week closes on Sunday's bar and opens with Monday's bar.

### ToYearly
```csharp
public static BarHistory ToYearly(BarHistory source)
```
Compresses the source BarHistory to a yearly scale, returning a new BarHistory instance. 