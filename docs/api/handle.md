# Handle Class

**Namespace:** WealthLab.ChartWPF  
**Parent:** Object

The `Handle` class represents interactive handles of chart drawing objects. These handles can typically be grabbed and dragged across the chart with the mouse.

## Properties

### Chart Data Properties

### Bars
```csharp
public BarHistory Bars
```
Returns the `BarHistory` being charted in the chart where this drawing object is drawn.

### DateTime
```csharp
public DateTime DateTime
```
The date/time that this handle is pegged to within its source historical data.

### Index
```csharp
public int Index
```
Returns the index into the `BarHistory` that this handle is pegged to. Returns -1 if the handle's DateTime doesn't map to the current data range.

### Value
```csharp
public double Value
```
The y-axis value of the handle.

## Behavior Properties

### SnapToPrice
```csharp
public bool SnapToPrice
```
When true, the handle snaps to the nearest OHLC price value in the price pane, or nearest TimeSeries value in other panes during mouse movement.

### Visible
```csharp
public bool Visible
```
Controls whether the handle should be rendered when the user hovers over its drawing object.

### Parent
```csharp
public DrawingObjectBase Parent
```
Returns the chart drawing object (instance of `DrawingObjectBase`) that this Handle belongs to.

## Usage Example

```csharp
// Create a trend line with two handles
public class TrendLine : DrawingObjectBase
{
    private Handle _startHandle;
    private Handle _endHandle;
    
    public TrendLine(BarHistory bars)
    {
        // Initialize start handle
        _startHandle = new Handle
        {
            DateTime = bars.DateTimes[0],
            Value = bars.Low[0],
            SnapToPrice = true,
            Visible = true
        };
        
        // Initialize end handle
        _endHandle = new Handle
        {
            DateTime = bars.DateTimes[bars.Count - 1],
            Value = bars.High[bars.Count - 1],
            SnapToPrice = true,
            Visible = true
        };
    }
    
    public override void Render(DrawingContext dc)
    {
        // Only render if both handles are in valid range
        if (_startHandle.Index >= 0 && _endHandle.Index >= 0)
        {
            // Draw line between handles
            Point start = new Point(
                ConvertDateTimeToX(_startHandle.DateTime),
                ConvertValueToY(_startHandle.Value)
            );
            
            Point end = new Point(
                ConvertDateTimeToX(_endHandle.DateTime),
                ConvertValueToY(_endHandle.Value)
            );
            
            dc.DrawLine(new Pen(Brushes.Blue, 2), start, end);
        }
    }
}

// Usage
var trendLine = new TrendLine(barHistory);
chart.AddDrawingObject(trendLine);
```

This example demonstrates:
- Creating handles for a trend line
- Setting handle properties for interaction
- Using handles for rendering
- Handling out-of-range scenarios 