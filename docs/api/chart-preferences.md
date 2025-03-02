# ChartPreferences Class

**Namespace:** WealthLab.ChartWPF  
**Parent:** Object

Contains all of the properties of a visual chart theme, including colors and settings information.

## Members

### AdaptiveScaleStopLimit
```csharp
public bool AdaptiveScaleStopLimit
```
When true, rescales y-axis to ensure stop/limit values are visible when plotted using PlotStopsAndLimits().

### BarSpacing
```csharp
public double BarSpacing
```
The spacing between bars in the chart, in pixels.

### ChartStyleName
```csharp
public string ChartStyleName
```
The name of the chart style that should used for this theme, for example "Bar" or "Candlestick".

### ChartStyleSettings
```csharp
public ParameterList ChartStyleSettings
```
A ParameterList instance that contains the parameters that the user configured for the chart style specified in this theme (ChartStyleName property).

### Clone
```csharp
public ChartPreferences Clone()
```
Creates a copy of the ChartPreferences instance.

## Color Properties

### ColorAxisBackground
```csharp
public WLColor ColorAxisBackground
```
The color to use to render the background of the chart x and y axes.

### ColorAxisLabels
```csharp
public WLColor ColorAxisLabels
```
The color to use to render the text of the x and y axis labels in the chart.

### ColorBackground
```csharp
public WLColor ColorBackground
```
The color to use to render the background of the chart.

### ColorDownBar
```csharp
public WLColor ColorDownBar
```
The color to use to render the bars on the chart whose closing price is less than their open price.

### ColorGridlines
```csharp
public WLColor ColorGridlines
```
The color to use to render the x and y axis grid lines on the chart.

### ColorPaneSeparator
```csharp
public WLColor ColorPaneSeparator
```
The color to use to render the pane separators that appear between chart panes.

### ColorUpBar
```csharp
public WLColor ColorUpBar
```
The color to use to render the bars on the chart whose closing price is greater than or equal to their open price.

### ColorWatermark
```csharp
public WLColor ColorWatermark
```
The color to use to render the text of the watermark that displays the symbol and security name in the middle of the chart.

### VerticalCursorColor
```csharp
public WLColor VerticalCursorColor
```
The color to use to render the vertical and crosshair cursors in the chart.

## Display Settings

### DisplayEvents
```csharp
public bool DisplayEvents
```
Determines whether glyph icons for event data, such as dividends and splits, are displayed in the chart.

### LogScale
```csharp
public bool LogScale
```
Determines whether the y axis of the chart uses a logarithmic (true) or linear (false) scale.

### Margin
```csharp
public int Margin
```
The number of pixels to reserve as top of bottom margins for the panes of the chart.

### ShowVolumePane
```csharp
public bool ShowVolumePane
```
Controls whether or not the volume pane is displayed in the chart.

## Utility Methods

### MassageColor
```csharp
public WLColor MassageColor(Color color)
```
Returns a potentially modified version of the specified color that ensures it renders well in the chart's background color. 