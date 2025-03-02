# PlotBase Class

**Namespace:** WealthLab.ChartWPF  
**Parent:** Configurable  
**Descendants:** BarGlyphBase

The `PlotBase` class is the foundational abstract class for all objects that can be plotted on a WealthLab 8 chart. It provides essential methods and properties for rendering, configuration, and chart interaction.

## Chart-Related Properties

### Bars
```csharp
public BarHistory Bars
```
Returns the `BarHistory` instance currently being charted.

### ChartPreferences
```csharp
public ChartPreferences ChartPreferences
```
Returns chart rendering preferences, including colors and styles.

### Color
```csharp
public WLColor Color
```
Specifies the color used when plotting this object.

### DefaultBrush
```csharp
public Brush DefaultBrush
```
Returns the default `Brush` for rendering the plot object.

### DefaultPen
```csharp
public Pen DefaultPen
```
Returns the default `Pen` for rendering the plot object.

## Rendering Methods

### GetBarColor
```csharp
public virtual WLColor GetBarColor(int idx)
```
Returns the color for rendering a specific bar index.

### GetMaxValue
```csharp
public virtual double GetMaxValue(int start, int end)
```
Calculates the highest y-axis value within the specified index range.

### GetMinValue
```csharp
public virtual double GetMinValue(int start, int end)
```
Calculates the lowest y-axis value within the specified index range.

### Render
```csharp
public abstract void Render(DrawingContext dc)
```
Abstract method called to render the plot object to the specified drawing context.

### PreRender and PostRender
```csharp
public virtual void PreRender(DrawingContext dc)
public virtual void PostRender(DrawingContext dc)
```
Methods called before and after the main rendering phase.

## Interaction Properties

### IsMouseOver
```csharp
public virtual bool IsMouseOver(Point pt)
```
Determines if the mouse is hovering over the plot object.

### Opacity
```csharp
public byte Opacity
```
Controls the rendering opacity (0-255 range).

### HasMouseOverState
```csharp
public virtual bool HasMouseOverState
```
Indicates if the plot object has a special mouse-over rendering state.

## Rendering Passes

### RenderPass
```csharp
public virtual int RenderPass
```
Specifies which rendering pass the object participates in (1 or 2).

### RenderPasses
```csharp
public virtual int RenderPasses
```
Determines multiple rendering passes (1, 2, or 4).

## Coordinate Conversion Methods

### Conversion Methods
```csharp
public double ConvertDateTimeToX(DateTime dt)
public double ConvertIndexToX(int idx)
public double ConvertValueToY(double value)
public DateTime ConvertXToDateTime(double x)
public virtual int ConvertXToIndex(double x)
public double ConvertYToValue(double y)
```
Methods for converting between chart coordinates (pixels, indices, dates, values).

## Configuration Methods

### Configuration Properties
```csharp
public virtual string ConfigKey
public string Configuration
public virtual string Description
public virtual bool IsConfigurable
public abstract string Name
public ParameterList Parameters
```
Inherited from `Configurable`, these provide configuration management.

### Configuration Methods
```csharp
public virtual string EditConfig()
public virtual void ProcessConfig()
```
Methods for editing and processing configuration.

## Usage Examples

### Custom Plot Object
```csharp
public class CustomPlot : PlotBase
{
    public override string Name => "Custom Plot";

    public override void Render(DrawingContext dc)
    {
        // Custom rendering logic
        for (int i = 0; i < Bars.Count; i++)
        {
            double x = ConvertIndexToX(i);
            double y = ConvertValueToY(Bars.Close[i]);

            // Draw custom plot elements
            dc.DrawEllipse(
                DefaultBrush, 
                DefaultPen, 
                new Point(x, y), 
                2, 2
            );
        }
    }

    public override double GetMaxValue(int start, int end)
    {
        // Custom max value calculation
        return Bars.High.GetMaxValue(start, end);
    }

    public override double GetMinValue(int start, int end)
    {
        // Custom min value calculation
        return Bars.Low.GetMinValue(start, end);
    }
}
```

### Interactive Plot
```csharp
public class InteractivePlot : PlotBase
{
    public override bool IsMouseOver(Point pt)
    {
        // Custom mouse-over detection
        for (int i = 0; i < Bars.Count; i++)
        {
            double x = ConvertIndexToX(i);
            double y = ConvertValueToY(Bars.Close[i]);

            // Check if point is near plot points
            if (Distance(pt, new Point(x, y)) < 5)
                return true;
        }
        return false;
    }

    public override void RenderHighlight(DrawingContext dc)
    {
        // Render mouse-over highlight
        // Implementation depends on specific visualization needs
    }

    private double Distance(Point p1, Point p2)
    {
        return Math.Sqrt(
            Math.Pow(p1.X - p2.X, 2) + 
            Math.Pow(p1.Y - p2.Y, 2)
        );
    }
}
```

## Best Practices

1. **Rendering**
   - Implement efficient `Render` methods
   - Use coordinate conversion methods
   - Consider performance for large datasets

2. **Interaction**
   - Implement meaningful `IsMouseOver`
   - Provide clear visual feedback
   - Handle different rendering passes

3. **Configuration**
   - Use `Parameters` for customizable settings
   - Implement `EditConfig` for user-friendly configuration
   - Provide clear descriptions

## Notes

- Abstract base class for chart plot objects
- Provides comprehensive charting infrastructure
- Supports complex rendering and interaction scenarios
- Extensible through inheritance and method overriding 