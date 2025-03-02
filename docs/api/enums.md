# WealthLab Enums

**Namespace:** WealthLab.Core

This document covers the various enumerated types used throughout the WealthLab .NET Framework.

## Data Related Enums

### Frequency
```csharp
public enum Frequency
{
    Daily,
    Weekly,
    Monthly,
    Quarterly,
    Yearly,
    Tick,
    Second,
    Minute,
    Volume,
    Hour,
    NDays,
    WeeklyStartDay
}
```
Represents the frequency of historical data.

### PriceComponent
```csharp
public enum PriceComponent
{
    Open,
    High,
    Low,
    Close,
    Volume,
    AveragePriceOHLC,
    AveragePriceHLC,
    AveragePriceHL,
    AveragePriceOC,
    AveragePriceHLCC
}
```
Represents the components of historical data and derived averaging components.

## Trading Related Enums

### OrderType
```csharp
public enum OrderType
{
    Market,
    Limit,
    Stop,
    FixedPrice,
    LimitMove,
    MarketClose,
    LimitClose,
    StopLimit
}
```
Specifies order types for backtester or broker submission.

**Notes:**
- `Limit`: Executes when price penetrates below (long entry/short exit) or above (short entry/long exit)
- `Stop`: Executes when price penetrates above (long entry/short exit) or below (short entry/long exit)
- `StopLimit`: Like Stop with Limit price constraint
- `LimitMove`: Like Limit but won't execute if price opens beyond order Price
- `MarketClose`: Executes at bar's closing price
- `LimitClose`: Like MarketClose with Limit price constraint
- `FixedPrice`: Executes exactly at specified price within bar's OHLC range

### PositionType
```csharp
public enum PositionType
{
    Long,
    Short
}
```
Specifies position direction.

### SignalStatus
```csharp
public enum SignalStatus
{
    Staged,
    Placed,
    Active,
    Filled,
    PartialFilled,
    CancelPending,
    Canceled,
    Error,
    WaitForClose,
    Published,
    FinalOrder,
    HeldForReview,
    Killed
}
```
Represents possible order states during its lifecycle.

### TransactionType
```csharp
public enum TransactionType
{
    Buy,
    Sell,
    Short,
    Cover
}
```
Specifies transaction or order type.

### TrailingStopType
```csharp
public enum TrailingStopType
{
    PercentC,    // Percentage using closing price
    PointC,      // Fixed amount using closing price
    PercentHL,   // Percentage using highs/lows
    PointHL,     // Fixed amount using highs/lows
    ATR          // Variable amount using ATR
}
```
Determines trailing stop calculation method.

## Strategy Related Enums

### OptimizationRunType
```csharp
public enum OptimizationRunType
{
    None,
    Standard,
    WFO,
    SymbolBySymbol
}
```
Specifies optimization run types.

### StrategyExecutionMode
```csharp
public enum StrategyExecutionMode
{
    Strategy,
    Optimization,
    StreamingChart,
    StrategyMonitor,
    Rankings,
    Evolver
}
```
Represents backtester operation mode.

### ParameterType
```csharp
public enum ParameterType
{
    Int32,
    Double,
    String,
    Boolean,
    TimeSeries,
    BarHistory,
    Color,
    LineStyle,
    Text,
    Font,
    StringChoice,
    Indicator,
    Smoother,
    IndicatorSource,
    PriceComponent,
    DataSet,
    ColorWpfDeprecated,
    HistoryScale,
    Date,
    Password,
    Label,
    SmootherType,
    IndicatorTSSource
}
```
Represents parameter types for Strategies and Indicators.

**Notes:**
- Strategies only support `Int32` and `Double`
- `Text`: Multiline string field in UI
- `StringChoice`: Dropdown with discrete values
- `IndicatorSource`: Flags parameter to use source from another indicator

## Technical Analysis Enums

### PeakTroughType
```csharp
public enum PeakTroughType
{
    Peak,
    Trough
}
```
Specifies peak or trough type for `PeakTrough` class.

### PeakTroughReversalType
```csharp
public enum PeakTroughReversalType
{
    Percent,
    Point,
    ATR,
    ATRPercent
}
```
Determines peak/trough reversal calculation method.

## Visualization Enums

### LineStyle
```csharp
public enum LineStyle
{
    Solid,
    Dashed,
    Dotted
}
```
Describes line drawing styles.

### PlotStyle
```csharp
public enum PlotStyle
{
    Line,
    Histogram,
    Dots,
    ThickLine,
    ThickHistogram,
    DottedLine,
    DashedLine,
    BooleanDots,
    Bands,
    ZigZag,
    Blocks,
    GradientBlocks,
    BarHistory,
    BarChart,
    HistogramTwoColor,
    Oscillator,
    Cloud,
    Mountain
}
```
Represents indicator plotting styles.

**Notes:**
- `BooleanDots`: Plots in price pane, dots above price bar for values > 0
- `Bands`: Renders filled bands using source and companion indicators
- `ZigZag`: Best for sporadic values with NaN gaps
- `Blocks`: Outlined blocks for value ranges
- `GradientBlocks`: Blocks with gradient fill

### TextShape
```csharp
public enum TextShape
{
    TriangleUp,
    TriangleDown,
    TriangleHollowUp,
    TriangleHollowDown,
    SquareFilled,
    SquareHollow,
    SquareLeftTick,
    SquareRightTick,
    CircleHollow,
    CircleFilled,
    CircleCrosshair,
    CircleWithX,
    DiamondFilled,
    DiamondHollow,
    HexagonFilled,
    HexagonHollow,
    ArrowUp,
    ArrowDown,
    ArrowRight,
    ArrowLeft,
    ArrowRightLeft,
    StarFilled,
    StarHollow,
    Star8Points
}
```
Provides special symbols for `DrawBarAnnotation()`.

### VerticalAlignment
```csharp
public enum VerticalAlignment
{
    Bottom,
    Center,
    Top
}
```
Specifies vertical alignment for `DrawTextVAlign()`. 