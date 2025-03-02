# IndicatorBase Class

**Namespace:** WealthLab.Indicators  
**Parent:** TimeSeries

The `IndicatorBase` class serves as the foundational class for creating custom indicators in WealthLab. Derived from `TimeSeries`, it provides a robust framework for developing technical analysis indicators with built-in support for parameter management, caching, and charting.

## Key Characteristics

- Manages a list of floating-point values keyed to a list of DateTimes
- Supports indicator management subsystem in WealthLab
- Essential for developers creating custom indicators

## Calculation Methods

### AssumeValuesOf
```csharp
public void AssumeValuesOf(TimeSeries ts)
```
Copies the values from the specified `TimeSeries` into the indicator's values, clearing existing values first.

### CalculatePartialValue
```csharp
public virtual bool CalculatePartialValue()
```
Used for calculating partial updates in streaming charts. The calculated value should be assigned to the `StreamingValue` property.

**Example (SMA Implementation):**
```csharp
public override bool CalculatePartialValue()
{
    // Implement partial value calculation logic
    StreamingValue = // Calculated streaming value
    return true; // Indicates successful calculation
}
```

### Populate
```csharp
public abstract void Populate()
```
An abstract method called by WealthLab to populate the indicator with values. Each derived indicator class must provide its own implementation to calculate indicator values.

## Parameters and Configuration

### Parameters
```csharp
public ParameterList Parameters
```
Returns a list of `Parameter` instances that define the indicator's configurable parameters.

## Companion Indicators

### BandCompanion
```csharp
public IndicatorBase BandCompanion
```
Returns the companion indicator (if applicable) using the same parameters as the source indicator. Used by the Bands plot style.

### BandCompanionAbbreviation
```csharp
public virtual string BandCompanionAbbreviation
```
Returns the name of the indicator's band pair. For example, BBandUpper's companion is BBandLower.

### Companions
```csharp
public virtual List<string> Companions
```
Returns abbreviations of indicators considered part of this indicator's family. 

**Example:** Directional Movement indicators include ADX, ADXR, DIPlus, and DIMinus.

## Descriptive Properties

### Abbreviation
```csharp
public abstract string Abbreviation
```
Returns the indicator's abbreviation.

### Name
```csharp
public abstract string Name
```
Returns the full name of the indicator.

### HelpDescription
```csharp
public abstract string HelpDescription
```
Provides descriptive text about the indicator.

### Color and Styling
```csharp
public WLColor Color
public virtual WLColor DefaultColor
public virtual PlotStyles DefaultPlotStyle
public virtual Bitmap Glyph
```
Properties for customizing the indicator's visual representation in charts and UI.

## Functional Properties

### ExtendedBarsRequired
```csharp
public virtual int ExtendedBarsRequired
```
Specifies the number of extended bars needed for the indicator, creating a projection area to the right of the chart.

### IsOscillator
```csharp
public bool IsOscillator
```
Indicates if the indicator moves within a defined range (e.g., RSI, CMO).

### IsSmoother
```csharp
public virtual bool IsSmoother
```
Indicates if the indicator smooths source data (e.g., moving averages like SMA or EMA).

## Usage Example: Creating a Custom Indicator

```csharp
public class MyCustomIndicator : IndicatorBase
{
    public MyCustomIndicator() : base() {}

    public MyCustomIndicator(TimeSeries source, int period = 14) : base()
    {
        Parameters[0].Value = source;
        Parameters[1].Value = period;
        Populate();
    }

    public override string Name => "My Custom Indicator";
    public override string Abbreviation => "MCI";
    public override string HelpDescription => "A custom technical indicator";
    public override WLColor DefaultColor => WLColor.Blue;

    protected override void GenerateParameters()
    {
        AddParameter("Source", ParameterType.TimeSeries, PriceComponent.Close);
        AddParameter("Period", ParameterType.Int32, 14);
    }

    protected override void Populate()
    {
        TimeSeries source = Parameters[0].AsTimeSeries;
        int period = Parameters[1].AsInt32;

        DateTimes = source.DateTimes;

        for (int bar = period - 1; bar < source.Count; bar++)
        {
            // Implement indicator calculation logic
            Values[bar] = CalculateIndicatorValue(source, bar, period);
        }
    }

    private double CalculateIndicatorValue(TimeSeries source, int bar, int period)
    {
        // Custom calculation implementation
        return 0.0;
    }
}
```

## Best Practices

1. Always implement the `Populate()` method with robust calculation logic
2. Use `Parameters` for configurable indicator settings
3. Handle edge cases and initial periods with `Double.NaN`
4. Implement `CalculatePartialValue()` for streaming chart support
5. Provide meaningful descriptions and default styling

## Performance Considerations

- Minimize computational complexity in `Populate()`
- Use caching mechanisms when appropriate
- Avoid redundant calculations 