# PeakTrough Class

**Namespace:** WealthLab.Indicators  
**Parent:** Object

The `PeakTrough` class represents a detected peak or trough in time series data, typically identified by the `PeakTroughCalculator` utility class. It provides detailed information about the location, type, and value of significant price extrema.

## Properties

### DetectedAtIndex
```csharp
public int DetectedAtIndex
```
The index where the peak or trough was actually detected. Since peaks and troughs are detected after reversals, this index will always be later than the actual index of the peak or trough apex/nadir.

### PeakTroughIndex
```csharp
public int PeakTroughIndex
```
The precise index of the peak's actual apex or the trough's actual nadir.

**Note:** This property is equivalent to `XIndex`.

### Type
```csharp
public PeakTroughType Type
```
Specifies the type of extremum, which can be either:
- `PeakTroughType.Peak`: A local maximum
- `PeakTroughType.Trough`: A local minimum

### Value
```csharp
public double Value
```
The apex value of the peak or the nadir value of the trough.

**Note:** This property is equivalent to `YValue`.

## Usage Examples

### Basic Peak and Trough Detection
```csharp
public class PriceExtremaAnalyzer
{
    public void AnalyzePeaksTroughs(TimeSeries prices)
    {
        // Use PeakTroughCalculator to find extrema
        var peakTroughs = PeakTroughCalculator.Calculate(prices);

        foreach (var pt in peakTroughs)
        {
            Console.WriteLine($"Extremum Type: {pt.Type}");
            Console.WriteLine($"Detected Index: {pt.DetectedAtIndex}");
            Console.WriteLine($"Actual Extremum Index: {pt.PeakTroughIndex}");
            Console.WriteLine($"Extremum Value: {pt.Value}");
        }
    }
}
```

### Trading Strategy with Peak/Trough Analysis
```csharp
public class PeakTroughTradingStrategy : UserStrategyBase
{
    public override void Execute(BarHistory bars, int idx)
    {
        // Calculate peaks and troughs
        var peakTroughs = PeakTroughCalculator.Calculate(bars.Close);

        // Find recent peaks and troughs
        var recentPeaks = peakTroughs
            .Where(pt => pt.Type == PeakTroughType.Peak && 
                         pt.DetectedAtIndex <= idx)
            .OrderByDescending(pt => pt.DetectedAtIndex)
            .Take(3)
            .ToList();

        var recentTroughs = peakTroughs
            .Where(pt => pt.Type == PeakTroughType.Trough && 
                         pt.DetectedAtIndex <= idx)
            .OrderByDescending(pt => pt.DetectedAtIndex)
            .Take(3)
            .ToList();

        // Example trading logic based on peaks and troughs
        if (recentPeaks.Any() && recentTroughs.Any())
        {
            var latestPeak = recentPeaks.First();
            var latestTrough = recentTroughs.First();

            // Check for potential trend reversal
            if (latestPeak.Value > bars.Close[idx] && 
                latestTrough.Value < bars.Close[idx])
            {
                // Potential trend change signal
                Buy();
            }
        }
    }
}
```

### Advanced Extrema Analysis
```csharp
public class ExtremaAnalyzer
{
    public void AnalyzeMarketCycles(TimeSeries prices)
    {
        var peakTroughs = PeakTroughCalculator.Calculate(prices);

        // Analyze market cycles
        var peaks = peakTroughs.Where(pt => pt.Type == PeakTroughType.Peak);
        var troughs = peakTroughs.Where(pt => pt.Type == PeakTroughType.Trough);

        // Calculate cycle statistics
        var cycleLengths = peaks.Zip(peaks.Skip(1), 
            (p1, p2) => p2.PeakTroughIndex - p1.PeakTroughIndex);

        var averageCycleLength = cycleLengths.Average();
        var maxPeakValue = peaks.Max(p => p.Value);
        var minTroughValue = troughs.Min(t => t.Value);

        Console.WriteLine($"Average Cycle Length: {averageCycleLength}");
        Console.WriteLine($"Highest Peak: {maxPeakValue}");
        Console.WriteLine($"Lowest Trough: {minTroughValue}");
    }
}
```

## Best Practices

1. **Extrema Detection**
   - Use appropriate time series and parameters for peak/trough calculation
   - Consider different lookback periods and sensitivity settings
   - Validate results across multiple market conditions

2. **Index Handling**
   - Be aware of the difference between `DetectedAtIndex` and `PeakTroughIndex`
   - Handle edge cases near the beginning or end of time series
   - Consider performance when processing large datasets

3. **Trading Strategies**
   - Don't rely solely on peak/trough detection
   - Combine with other technical indicators
   - Implement robust risk management

## Notes

- Part of WealthLab's technical analysis toolkit
- Useful for trend analysis and market cycle identification
- Supports both price and custom time series analysis
- Provides flexible extrema detection mechanisms 