# PeakTroughCalculator Class

**Namespace:** WealthLab.Indicators  
**Parent:** Object

The `PeakTroughCalculator` is a powerful utility class for detecting and analyzing peaks and troughs in time series data. It provides sophisticated methods for identifying significant price extrema and performing trend analysis.

## Constructors

### BarHistory Constructor
```csharp
public PeakTroughCalculator(
    BarHistory source, 
    double reversal, 
    PeakTroughReversalType reversalType = PeakTroughReversalType.Percent, 
    int atrPeriod = 10
)
```

### TimeSeries Constructors
```csharp
public PeakTroughCalculator(
    TimeSeries highs, 
    TimeSeries lows, 
    double reversalAmount, 
    PeakTroughReversalType reversalType = PeakTroughReversalType.Percent
)

public PeakTroughCalculator(
    TimeSeries source, 
    double reversal, 
    PeakTroughReversalType reversalType = PeakTroughReversalType.Percent
)
```

### Custom PeakTrough List Constructor
```csharp
public PeakTroughCalculator(List<PeakTrough> pts)
```

### Reversal Types
- `Percent`: Detect peaks/troughs after percentage reversal
- `Point`: Detect peaks/troughs after absolute value reversal
- `ATR`: Detect peaks/troughs based on Average True Range
- `ATRPercent`: Detect peaks/troughs using ATR percentage

## Core Properties

### PeakTroughs
```csharp
public List<PeakTrough> PeakTroughs
```
Returns the complete list of detected peaks and troughs.

## Peak and Trough Retrieval Methods

### GetPeak
```csharp
public PeakTrough GetPeak(int idx)
```
Returns the most recent peak at the specified index.

### GetTrough
```csharp
public PeakTrough GetTrough(int idx)
```
Returns the most recent trough at the specified index.

### GetPeaksAsOf
```csharp
public List<PeakTrough> GetPeaksAsOf(int idx, int maxAgeInDays = Int32.MaxValue)
```
Retrieves peaks detected up to the specified index, optionally limited by age.

### GetTroughsAsOf
```csharp
public List<PeakTrough> GetTroughsAsOf(int idx, int maxAgeInDays = Int32.MaxValue)
```
Retrieves troughs detected up to the specified index, optionally limited by age.

## Trend Analysis Methods

### HasRisingPeaks
```csharp
public bool HasRisingPeaks(int idx)
```
Checks if the most recent peak is higher than the previous peak.

### HasFallingPeaks
```csharp
public bool HasFallingPeaks(int idx)
```
Checks if the most recent peak is lower than the previous peak.

### HasRisingTroughs
```csharp
public bool HasRisingTroughs(int idx)
```
Checks if the most recent trough is higher than the previous trough.

### HasFallingTroughs
```csharp
public bool HasFallingTroughs(int idx)
```
Checks if the most recent trough is lower than the previous trough.

## Divergence Detection

### Divergence
```csharp
public DivergenceType Divergence(
    int bar, 
    TimeSeries price, 
    out PeakTrough pt, 
    out PeakTrough pt2
)
```
Detects bullish or bearish divergence between peaks/troughs and price.

## Trendline Methods

### GetUpperTrendLine
```csharp
public TrendLine GetUpperTrendLine(int idx, int numPeaks)
```
Calculates an upper trendline using the most recent peaks.

### GetLowerTrendLine
```csharp
public TrendLine GetLowerTrendLine(int idx, int numTroughs)
```
Calculates a lower trendline using the most recent troughs.

### TrendlineEnvelope
```csharp
public TrendLine TrendlineEnvelope(
    BarHistory bars, 
    int idx, 
    PeakTroughType ptType, 
    int points, 
    bool useDescendingPeakTroughs, 
    double allowableIncursionPct = 3, 
    bool useLog = false, 
    int maxLookbackDays = 1000
)
```
Advanced trendline calculation with flexible parameters.

## Charting Methods

### DrawPeakLines
```csharp
public void DrawPeakLines(
    UserStrategyBase usb, 
    WLColor color = null, 
    int lineWidth = 1, 
    LineStyle lineStyle = LineStyle.Solid, 
    string paneTag = "Price", 
    bool behindBars = false
)
```
Draws lines connecting confirmed peaks.

### DrawTroughLines
```csharp
public void DrawTroughLines(
    UserStrategyBase usb, 
    WLColor color = null, 
    int lineWidth = 1, 
    LineStyle lineStyle = LineStyle.Solid, 
    string paneTag = "Price", 
    bool behindBars = false
)
```
Draws lines connecting confirmed troughs.

## Usage Examples

### Basic Peak and Trough Detection
```csharp
public class PeakTroughAnalyzer
{
    public void AnalyzePriceExtrema(BarHistory bars)
    {
        // Detect peaks and troughs with 5% reversal
        var ptCalculator = new PeakTroughCalculator(bars, 5.0, PeakTroughReversalType.Percent);

        // Analyze peaks
        foreach (var peak in ptCalculator.GetPeaksAsOf(bars.Count - 1))
        {
            Console.WriteLine($"Peak at {peak.PeakTroughIndex}: {peak.Value}");
        }

        // Check trend characteristics
        int lastIndex = bars.Count - 1;
        bool risingPeaks = ptCalculator.HasRisingPeaks(lastIndex);
        bool fallingTroughs = ptCalculator.HasFallingTroughs(lastIndex);
    }
}
```

### Divergence Detection
```csharp
public class DivergenceStrategy : UserStrategyBase
{
    public override void Execute(BarHistory bars, int idx)
    {
        // Calculate RSI peaks and troughs
        var rsiPtc = new PeakTroughCalculator(RSI.Series(bars.Close, 14), 5.0);

        // Check for divergence
        var divergenceType = rsiPtc.Divergence(idx, bars.Close, out var indicatorPt, out var pricePt);

        switch (divergenceType)
        {
            case DivergenceType.Bullish:
                Buy(); // Potential trend reversal
                break;
            case DivergenceType.Bearish:
                Sell(); // Potential trend reversal
                break;
        }
    }
}
```

### Trendline Analysis
```csharp
public class TrendlineStrategy : UserStrategyBase
{
    public override void Execute(BarHistory bars, int idx)
    {
        var ptCalculator = new PeakTroughCalculator(bars, 5.0);

        // Get upper and lower trendlines
        var upperTrendline = ptCalculator.GetUpperTrendLine(idx, 3);
        var lowerTrendline = ptCalculator.GetLowerTrendLine(idx, 3);

        // Check trendline breaks
        if (bars.Close[idx] > upperTrendline.Value(bars.DateTimes[idx]))
        {
            Buy(); // Bullish trendline break
        }
        else if (bars.Close[idx] < lowerTrendline.Value(bars.DateTimes[idx]))
        {
            Sell(); // Bearish trendline break
        }
    }
}
```

## Best Practices

1. **Reversal Detection**
   - Choose appropriate reversal percentages
   - Consider market volatility
   - Test across different market conditions

2. **Performance Optimization**
   - Use efficient reversal types
   - Limit lookback periods
   - Cache results when possible

3. **Trend Analysis**
   - Combine peak/trough analysis with other indicators
   - Use multiple confirmation signals
   - Implement robust risk management

## Notes

- Powerful tool for technical analysis
- Supports multiple data series types
- Flexible peak and trough detection
- Useful for trend identification and trading strategies 