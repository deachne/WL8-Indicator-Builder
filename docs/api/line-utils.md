# LineUtils Class

**Namespace:** WealthLab.Core  
**Parent:** None (Static Class)

The `LineUtils` class provides static utility methods for projecting and manipulating trendlines in both linear and logarithmic chart scales. These functions are particularly useful for technical analysis and price target projections.

## Line Extension Methods

### ExtendLine
```csharp
public static double ExtendLine(double x1, double y1, double x2, double y2, double x)
public static double ExtendLine(PeakTrough peakTrough1, PeakTrough peakTrough2, double x)
public static double ExtendLine(TrendLine trendline, double x)
```
Projects a line defined by two points to calculate its value at position `x` using linear scale.

**Parameters:**
- `x1`, `y1`: First point coordinates
- `x2`, `y2`: Second point coordinates
- `x`: Target x-coordinate for projection
- `peakTrough1`, `peakTrough2`: Peak/trough points defining the line
- `trendline`: Existing trendline to extend

### ExtendLineLog
```csharp
public static double ExtendLineLog(double x1, double y1, double x2, double y2, double x)
public static double ExtendLineLog(PeakTrough peakTrough1, PeakTrough peakTrough2, double x)
public static double ExtendLineLog(TrendLine trendline, double x)
```
Projects a line defined by two points to calculate its value at position `x` using logarithmic scale.

### ExtendLineY
```csharp
public static double ExtendLineY(double x1, double y1, double x2, double y2, double x, bool useLog = false)
public static double ExtendLineY(PeakTrough peakTrough1, PeakTrough peakTrough2, double x, bool useLog = false)
public static double ExtendLineY(TrendLine trendline, double x, bool useLog = false)
```
Wrapper method that calls either `ExtendLine` or `ExtendLineLog` based on the `useLog` parameter.

## Parallel Line Methods

### ParallelTrendLine
```csharp
public static TrendLine ParallelTrendLine(BarHistory bars, int leftPtIndex, double leftPtValue, 
    int rightPtIndex, double rightPtValue, bool useLog = false)
public static TrendLine ParallelTrendLine(BarHistory bars, PeakTrough peakTrough1, 
    PeakTrough peakTrough2, bool useLog = false)
public static TrendLine ParallelTrendLine(BarHistory bars, Trendline trendline, bool useLog = false)
```
Creates a parallel trendline opposite to the input points/line, automatically positioned to create the widest channel.

**Notes:**
- Locates the line by analyzing price distribution relative to the input line
- Maintains the same index values as the original line
- Use `ExtendLineY` to project the resultant trendline for price targets

### ParallelTrendLineAt
```csharp
public static TrendLine ParallelTrendLineAt(BarHistory bars, int atIndex, double atValue, 
    int leftPtIndex, double leftPtValue, int rightPtIndex, double rightPtValue, bool useLog = false)
public static TrendLine ParallelTrendLineAt(BarHistory bars, int atIndex, double atValue, 
    PeakTrough peakTrough1, PeakTrough peakTrough2, bool useLog = false)
public static TrendLine ParallelTrendLineAt(BarHistory bars, int atIndex, double atValue, 
    TrendLine trendline, bool useLog = false)
```
Creates a parallel trendline that passes through a specific point `[atIndex, atValue]`.

## High/Low Trendline Methods

### TrendLineFromHighs
```csharp
public static TrendLine TrendLineFromHighs(BarHistory bars, int bar, int anchorBar, 
    int ignoreBarsAfterAnchor = 2)
```
Creates a trendline connecting price highs from the anchor bar to the current bar.

**Parameters:**
- `bars`: Price history
- `bar`: Current bar index
- `anchorBar`: Starting bar index
- `ignoreBarsAfterAnchor`: Number of bars after anchor to ignore crossings

**Notes:**
- Returns null if no valid trendline is found
- Use `TrendLine.ExtendTo()` to project the line forward

### TrendLineFromLows
```csharp
public static TrendLine TrendLineFromLows(BarHistory bars, int bar, int anchorBar, 
    int ignoreBarsAfterAnchor = 2)
```
Creates a trendline connecting price lows from the anchor bar to the current bar.

## Triangle Formation

### TriangleTrendLine
```csharp
public static TrendLine TriangleTrendLine(BarHistory bars, int leftPtIndex, double leftPtValue, 
    int rightPtIndex, double rightPtValue, bool useLog = false)
public static TrendLine TriangleTrendLine(BarHistory bars, PeakTrough peakTrough1, 
    PeakTrough peakTrough2, bool useLog = false)
public static TrendLine TriangleTrendLine(BarHistory bars, TrendLine trendline, bool useLog = false)
```
Creates an opposite trendline with inverted slope to form a symmetrical triangle.

**Notes:**
- Can form converging or diverging (horn) patterns
- `Index1` set to leftPtIndex
- `Index2` set to highest/lowest point index
- Validate post-Index2 price action for pattern validity

## Usage Examples

### Basic Line Extension
```csharp
public class TrendlineStrategy : UserStrategyBase
{
    public override void Execute(BarHistory bars, int idx)
    {
        if (idx < 20) return;
        
        // Create trendline from recent highs
        var trendline = LineUtils.TrendLineFromHighs(bars, idx, idx - 20);
        if (trendline != null)
        {
            // Project value at current bar
            double projectedValue = LineUtils.ExtendLineY(
                trendline.Index1, trendline.Value1,
                trendline.Index2, trendline.Value2,
                idx
            );
            
            // Check for breakout
            if (bars.Close[idx] > projectedValue)
            {
                Buy();
            }
        }
    }
}
```

### Parallel Channel Trading
```csharp
public class ChannelStrategy : UserStrategyBase
{
    public override void Execute(BarHistory bars, int idx)
    {
        if (idx < 50) return;
        
        // Create upper trendline
        var upperLine = LineUtils.TrendLineFromHighs(bars, idx - 10, idx - 50);
        if (upperLine != null)
        {
            // Create parallel lower channel line
            var lowerLine = LineUtils.ParallelTrendLine(bars, upperLine);
            
            // Get projected values
            double upperValue = LineUtils.ExtendLineY(upperLine, idx);
            double lowerValue = LineUtils.ExtendLineY(lowerLine, idx);
            
            // Trade channel boundaries
            if (bars.Close[idx] <= lowerValue)
                Buy();
            else if (bars.Close[idx] >= upperValue)
                SellAll();
        }
    }
}
```

### Triangle Pattern Detection
```csharp
public class TriangleStrategy : UserStrategyBase
{
    public override void Execute(BarHistory bars, int idx)
    {
        if (idx < 40) return;
        
        // Create resistance line
        var resistance = LineUtils.TrendLineFromHighs(bars, idx, idx - 40);
        if (resistance != null)
        {
            // Create triangle support line
            var support = LineUtils.TriangleTrendLine(bars, resistance);
            
            // Check for triangle breakout
            double resistanceValue = LineUtils.ExtendLineY(resistance, idx);
            if (bars.Close[idx] > resistanceValue)
            {
                Buy();
            }
        }
    }
}
```

## Best Practices

1. **Line Projection**
   - Choose appropriate scale (linear/log) for your analysis
   - Validate projected values against price action
   - Consider using multiple timeframes

2. **Channel Analysis**
   - Verify channel width is significant
   - Consider price volatility when setting boundaries
   - Monitor for pattern breakdowns

3. **Triangle Patterns**
   - Validate post-formation price action
   - Consider volume confirmation
   - Watch for false breakouts

4. **Performance**
   - Cache trendline calculations where possible
   - Limit projection calculations in tight loops
   - Use appropriate bar ranges for analysis 