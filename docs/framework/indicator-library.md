# Indicator Library API

This document details the API for building Indicator Library extensions for Wealth-Lab 8. An Indicator Library exposes one or more Indicators, which appear in their own node in the WL8 indicator tree.

## Build Environment

You can create an Indicator in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Indicator will be a class in this library that descends from `IndicatorBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Indicators` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Indicator, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## IndicatorBase Class

Each Indicator in your Library should be implemented as a class that descends from `IndicatorBase`, which is defined in the `WealthLab.Indicators` namespace. Here is the hierarchy of `IndicatorBase`'s ancestor classes:

1. `DateSynchedList<double>`
2. `TimeSeriesBase`
3. `TimeSeries`
4. `IndicatorBase`

## Constructors

Each Indicator should have at least two constructors:

1. A parameterless constructor (used by WL8 to create lightweight instances for the Indicator roster)
2. A constructor with parameters matching the Parameter instances from `GenerateParameters`

Example SMA Indicator constructors:
```csharp
//parameterless constructor
public SMA() : base()
{
}

//for code based construction
public SMA(TimeSeries source, int period)
    : base()
{
    Parameters[0].Value = source;
    Parameters[1].Value = period;
    Populate();
}
```

## Working with Parameters

### Parameters Property
```csharp
public ParameterList Parameters
```
Contains Parameter instances that define the Indicator's configurable values.

### GenerateParameters
```csharp
protected virtual void GenerateParameters()
```
Override to create and add Parameter instances. Example for SMA:
```csharp
protected override void GenerateParameters()
{
    AddParameter("Source", ParameterType.TimeSeries, PriceComponents.Close);
    AddParameter("Period", ParameterType.Int32, 20);
}
```

### Helper Methods

#### AddParameter
```csharp
protected Parameter AddParameter(string name, ParameterTypes type, object value)
```
Creates and adds a Parameter instance.

#### AddIndicatorParameter
```csharp
protected Parameter AddIndicatorParameter(string name)
```
Creates a Parameter for accepting another Indicator as input. Example:
```csharp
protected override void GenerateParameters()
{
    AddParameter("Bars", ParameterType.BarHistory, null);
    AddIndicatorParameter("Indicator", "ROC");        
}

public override void Populate()
{
    BarHistory source = Parameters[0].AsBarHistory;
    DateTimes = source.DateTimes;

    Parameter p = Parameters[1];
    string indName = p.IndicatorAbbreviation;
    ParameterList indParams = p.IndicatorParameters;
    IndicatorBase ind = IndicatorFactory.Instance.CreateIndicator(indName, indParams, source);
    //...
}
```

#### AddSmootherParameter
```csharp
protected Parameter AddSmootherParameter(string name, string defaultValue)
```
Creates a Parameter for selecting from available smoother Indicators.

## Descriptive Properties

### Required Properties

- `public abstract string Name` - Full name (e.g., "Simple Moving Average")
- `public abstract string Abbreviation` - Short name (e.g., "SMA")
- `public abstract string HelpDescription` - Brief description shown in Indicator tree
- `public string Tooltip` - Optional hover text for plotted values
- `public virtual string HelpURL` - Optional link to detailed documentation

### Indicator Type Properties

- `public bool IsOscillator` - True if OverboughtLevel/OversoldLevel are set
- `public double OversoldLevel` - Lower bound for oscillator
- `public double OverboughtLevel` - Upper bound for oscillator
- `public virtual bool IsSmoother` - True for smoothing indicators
- `public string LibraryName` - Node name in Indicator tree

## Color and Plot Style

### Plot Location
```csharp
public override string PaneTag
```
Return:
- "Price" for price pane
- "Volume" for volume pane
- Custom string for own pane

### Color Properties
```csharp
public virtual Color DefaultColor
```
Default plot color. For multi-color indicators:
```csharp
public override void Populate()
{
    //... indicator calculation ...
    this.SeriesBarColors = new DateSynchedList<WLColor>(DateTimes, DefaultColor);
    
    for (int n = 0; n < bars.Count; n++)
    {
        Values[n] = myIndValues[n];
        if (myIndValues[n] > 0)
            this.SeriesBarColors[n] = myIndValues[n] > myIndValues[n - 1] ? 
                DefaultColor : WLColor.Blue;
        else if (myIndValues[n] < 0)
            this.SeriesBarColors[n] = myIndValues[n] < myIndValues[n - 1] ? 
                WLColor.Red : WLColor.Yellow;
    }
}
```

### Plot Style Properties
```csharp
public virtual PlotStyles DefaultPlotStyle
```
Available styles:
- Line
- Histogram
- Dots
- ThickLine
- ThickHistogram
- DottedLine
- DashedLine
- BooleanDots
- Bands
- ZigZag
- Blocks
- GradientBlocks
- BarHistory
- BarChart
- HistogramTwoColor

```csharp
public virtual string DefaultPlotName
```
Override for custom plot styles.

### Bar Chart Support
```csharp
public virtual IndicatorBase GetBarChartCompanion(PriceComponents pc)
```
Required for BarChart plot style.

```csharp
public virtual bool UseZeroOrigin
```
True to anchor y-axis at zero.

## Populating Values

### Main Population Method
```csharp
public abstract void Populate()
```
Calculate and assign indicator values:
```csharp
DateTimes = source.DateTimes;
for(int n = 0; n < source.Count; n++)
{
    double val = (source.High[n] + source.Low[n]) / 2.0;
    Values[n] = val;
}

// Or using TimeSeries math:
DateTimes = source.DateTimes;
TimeSeries avg = (source.High + source.Low) / 2.0;
Values = avg.Values;
```

### Helper Methods
```csharp
protected IndicatorBase GetSmoothedIndicator(string name, TimeSeries source, int period)
```
Creates smoothed version of source series.

## Static Methods

### Series Method
```csharp
public static SMA Series(TimeSeries source, int period)
{
    string key = CacheKey("SMA", period);
    if (source.Cache.ContainsKey(key))
        return (SMA)source.Cache[key];
    SMA sma = new SMA(source, period);
    source.Cache[key] = sma;
    return sma;
}
```

### Cache Key Generation
```csharp
public static string CacheKey(params object[] arguments)
```
Creates unique cache key from parameters.

### Value Method
Calculate indicator value at specific index.

## Band Indicators

### Band Properties
```csharp
public virtual string BandCompanionAbbreviation
```
Return companion indicator abbreviation for bands.

```csharp
public virtual IndicatorBase BandCompanion
```
Create companion indicator instance.

## Indicator Companions
```csharp
public virtual List<string> Companions
```
Return list of companion indicators to plot together.

## Complete Example

See the SMA (Simple Moving Average) implementation at the end of this document for a full working example that demonstrates all these concepts. 