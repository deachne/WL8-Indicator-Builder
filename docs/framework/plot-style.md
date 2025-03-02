# Plot Style Extension API

This document details the API for building Plot Style Extensions for Wealth-Lab 8. A Plot Style determines how a time series (such as an indicator) is plotted on a WL8 chart. Common Plot Styles include:

- Line
- Histogram
- Dots

## Build Environment

You can create a Plot Style in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.ChartWPF library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Plot Style will be a class in this library that descends from `SeriesStyleBase`, which is defined in the WealthLab.ChartWPF library, in the `WealthLab.ChartWPF` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Plot Style, making it available in appropriate locations of the WL8 user interface.

`SeriesStyleBase` is derived from the `PlotBase` base class. Consult the PlotBase class reference for properties and methods available to `SeriesStyleBase`.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Descriptive Properties and Parameters

The `SeriesStyleBase` class is ultimately derived from the `Configurable` base class. `Configurable` contains properties that let you describe:
- `Name` of your Plot Style
- `GlyphResource` for its icon

### public virtual void GenerateParameters()
Since `SeriesStyleBase` derives from `Configurable`, it supports Parameters that can be modified by the user. Override this method to install new Parameters specific to your Plot Style.

### public WLColor Color
The `SeriesStyleBase` constructor adds a Color Parameter to the Parameters list. The Color property:
- Getter reads value from this Parameter
- Setter sets value of this Parameter

> **Important:** If using the Color property, don't remove the Color Parameter. When overriding `GenerateParameters`, call `base.GenerateParameters` before adding new parameters.

## Accessing the CoreChart Instance

### public CoreChart Chart
Inherited from `PlotBase`, returns the underlying chart component (`CoreChart` instance). Important properties include:
- `StartIndex`: First index within BarHistory being charted
- `EndIndex`: Last index within BarHistory being charted

## Accessing the Source Data

### public TimeSeries Series
Returns the `TimeSeries` instance representing the data being plotted. The TimeSeries will have the same number of DateTimes and Values as the BarHistory being charted (`Chart.Bars` property).

## Rendering the Plot Style

### public abstract void Render(DrawingContext dc)
Override to render your Plot Style onto the WPF DrawingContext. Implementation steps:

1. Loop through visible bars (`Chart.StartIndex` to `Chart.EndIndex`)
2. Use conversion methods from PlotBase:
   - `ConvertIndexToX`: Convert index to x-pixel coordinates
   - `ConvertValueToY`: Convert price to y-pixel coordinates
3. Render data points using DrawingContext methods
4. Use `PenBrushFactory` for System.Windows.Media Pens and Brushes

### public override WLColor GetBarColor(int idx)
Returns color for rendering a data point. Default is based on Plot Style's Color property, but Strategy code can override colors.

### public virtual string OverridePlotPane
Override to specify chart pane for plotting. Return values:
- "Price": Plot in price pane
- "Volume": Plot in volume pane

Example: BooleanDots Plot Style returns "Price" to ensure dots plot in price pane regardless of indicator's pane.

### public override void RenderHighlight(DrawingContext dc)
Called when user hovers over Plot Style. Default implementation plots thick, translucent line.

### public bool IsCompanionPlotted
For indicators with companions (e.g., Bollinger Bands, Keltner Bands):
- Returns true if companion already rendered
- Access companion via `((IndicatorBase)Series).BandCompanion`

## Example Implementation

Below is a complete implementation of the Line Plot Style:

```csharp
using WealthLab.Core;
using WealthLab.WPF;
using System.Windows;
using System.Windows.Media;

namespace WealthLab.ChartWPF
{
    public class LineSeriesStyle : SeriesStyleBase
    {
        //generate parameters - add a line thickness parameter
        public override void GenerateParameters()
        {
            base.GenerateParameters();
            Parameters.Add(new Parameter("Thickness", ParameterType.Int32, 2));
            Parameters.Add(new Parameter("Line Style", ParameterType.LineStyle, LineStyle.Solid));
        }

        //Name
        public override string Name => "Line";

        //glyph
        public override string GlyphResource => "WealthLab.ChartWPF.Glyphs.Line.png";

        //line thickness
        public int LineThickness
        {
            get => Parameters.FindName("Thickness").AsInt;
            set
            {
                Parameter p = Parameters.FindName("Thickness");
                p.DefaultValue = value;
                p.Value = value;
            }
        }

        //line style
        public LineStyle LineStyle
        {
            get
            {
                Parameter p = Parameters.FindName("Line Style");
                return p?.AsLineStyle ?? LineStyle.Solid;
            }
            set
            {
                Parameter p = Parameters.FindName("Line Style");
                p.DefaultValue = value;
                p.Value = value;
            }
        }

        //render
        public override void Render(DrawingContext dc)
        {
            if (LineThickness <= 0)
                return;
            RenderLine(dc, Chart.StartIndex, Chart.EndIndex);
        }

        //render a line
        protected void RenderLine(DrawingContext dc, int startIdx, int endIdx)
        {
            //create geometry
            StreamGeometry sg = new StreamGeometry();
            StreamGeometryContext sgc = sg.Open();

            //get pen
            WLColor c = Color;
            Pen pen = PenBrushFactory.GetPen(c, LineThickness, LineStyle);

            //fast render if not custom colored
            if (Series.SeriesBarColors == null)
            {
                bool first = true;
                for (int n = startIdx; n <= endIdx; n++)
                {
                    if (Double.IsNaN(Series[n]))
                        continue;
                    if (n < Series.FirstValidIndex)
                        continue;
                    double xCoord = ConvertIndexToX(n);
                    double yData = ConvertValueToY(Series[n]);
                    if (first)
                    {
                        sgc.BeginFigure(new Point(xCoord, yData), false, false);
                        first = false;
                    }
                    else
                    {
                        sgc.LineTo(new Point(xCoord, yData), true, true);
                    }
                }
                RenderStreamingBarLine(sgc);
                sgc.Close();
                dc.DrawGeometry(null, pen, sg);
            }
            else
            {
                bool first = true;
                WLColor lastColor = WLColor.Empty;
                for (int n = startIdx; n <= endIdx; n++)
                {
                    if (Double.IsNaN(Series[n]))
                        continue;
                    if (n < Series.FirstValidIndex)
                        continue;
                    double xCoord = ConvertIndexToX(n);
                    double yData = ConvertValueToY(Series[n]);
                    c = GetBarColor(n);
                    Point pt = new Point(xCoord, yData);
                    if (c != lastColor)
                    {
                        if (!first)
                        {
                            sgc.LineTo(pt, true, true);
                            sgc.Close();
                            pen = PenBrushFactory.GetPen(lastColor, LineThickness, LineStyle);
                            dc.DrawGeometry(null, pen, sg);
                            sg = new StreamGeometry();
                            sgc = sg.Open();
                        }
                        sgc.BeginFigure(pt, false, false);
                        lastColor = c;
                        first = false;
                    }
                    else
                    {
                        sgc.LineTo(pt, true, true);
                    }
                }
                RenderStreamingBarLine(sgc);
                sgc.Close();
                pen = PenBrushFactory.GetPen(lastColor, LineThickness, LineStyle);
                dc.DrawGeometry(null, pen, sg);
            }
        }

        //render streaming bar portion of the line
        protected void RenderStreamingBarLine(StreamGeometryContext sgc)
        {
            if (LineThickness <= 0)
                return;

            if (Chart.ShouldStreamingBarBeRendered && !Double.IsNaN(Series.StreamingValue))
            {
                double xCoord = Chart.StreamingBarPlotX;
                double yCoord = ConvertValueToY(Series.StreamingValue);
                Point pt = new Point(xCoord, yCoord);
                sgc.LineTo(pt, true, true);
            }
        }
    }
} 