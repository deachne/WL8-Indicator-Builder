# HeikinAshi Class

**Namespace:** WealthLab.Core  
**Parent:** Object

A static utility class that converts standard candlestick data into Heikin-Ashi format. Heikin-Ashi candlesticks are a modified form of candlestick charting that aims to reduce noise and better identify trends.

## Static Methods

### Convert
```csharp
public static BarHistory Convert(BarHistory bars)
public static BarHistory Convert(BarHistory bars, string smoother = "TEMA", int period = 21, string candleSmoothing = "Valcu")
```

Converts a standard `BarHistory` instance into its Heikin-Ashi equivalent.

**Parameters:**
- `bars`: Source `BarHistory` to convert
- `smoother`: Smoothing indicator to use (default: "TEMA")
- `period`: Smoothing period (default: 21)
- `candleSmoothing`: Candle smoothing formula to use (default: "Valcu")

**Notes:**
- When `candleSmoothing` is not "Valcu", the "Vervoort" formula is used
- The smoothed version helps reduce noise further than standard Heikin-Ashi

## Heikin-Ashi Calculation

Heikin-Ashi candlesticks are calculated using the following formulas:

```
HA_Close = (Open + High + Low + Close) / 4
HA_Open = (Previous HA_Open + Previous HA_Close) / 2
HA_High = Max(High, HA_Open, HA_Close)
HA_Low = Min(Low, HA_Open, HA_Close)
```

## Usage Examples

### Basic Conversion
```csharp
public class MyStrategy : UserStrategyBase
{
    public override void Initialize(BarHistory bars)
    {
        // Convert to basic Heikin-Ashi
        BarHistory heikinAshi = HeikinAshi.Convert(bars);
        PlotBarHistory(heikinAshi, "HA");
    }
}
```

### Smoothed Conversion
```csharp
public class MyStrategy : UserStrategyBase
{
    public override void Initialize(BarHistory bars)
    {
        // Convert with custom smoothing parameters
        BarHistory smoothedHA = HeikinAshi.Convert(
            bars,
            smoother: "EMA",      // Use EMA for smoothing
            period: 14,           // 14-period smoothing
            candleSmoothing: "Vervoort"  // Use Vervoort formula
        );
        
        PlotBarHistory(smoothedHA, "Smoothed HA");
    }
}
```

### Trading Strategy Example
```csharp
public class HeikinAshiStrategy : UserStrategyBase
{
    public override void Initialize(BarHistory bars)
    {
        // Create Heikin-Ashi version of the data
        BarHistory ha = HeikinAshi.Convert(bars);
        PlotBarHistory(ha, "HA");
    }

    public override void Execute(BarHistory bars, int idx)
    {
        if (idx < 1) return;
        
        BarHistory ha = HeikinAshi.Convert(bars);
        
        // Long entry: Previous red candle followed by green candle
        bool prevRedCandle = ha.Open[idx-1] > ha.Close[idx-1];
        bool currGreenCandle = ha.Open[idx] < ha.Close[idx];
        
        if (prevRedCandle && currGreenCandle && !HasOpenPositions())
        {
            Buy();
        }
        
        // Exit: First red candle after green
        bool wasGreen = ha.Open[idx-1] < ha.Close[idx-1];
        bool nowRed = ha.Open[idx] > ha.Close[idx];
        
        if (wasGreen && nowRed && HasOpenPositions())
        {
            SellAll();
        }
    }
}
```

This example demonstrates:
- Basic Heikin-Ashi conversion
- Using Heikin-Ashi for trend identification
- Entry signals based on candle color changes
- Exit signals based on trend reversal patterns 