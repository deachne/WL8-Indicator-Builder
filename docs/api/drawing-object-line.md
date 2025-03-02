# DrawingObjectLine Class

**Namespace:** WealthLab.ChartWPF  
**Parent:** Object

Represents a component line in a chart drawing object. This class provides functionality for rendering and manipulating lines within chart drawings.

## Properties

### Appearance Properties

### Color
```csharp
public WLColor Color
```
The line's color. Initializes to `WLColor.Transparent`. If set to a different color, overrides the parent drawing object's color.

### LineStyle
```csharp
public LineStyles LineStyle
```
Specifies the style used when rendering the line.

### LineWidth
```csharp
public int LineWidth
```
Specifies the width of the line when rendering.

### IsVisible
```csharp
public bool IsVisible
```
Controls whether the line should be rendered.

## Extension Properties

### ExtendLeft
```csharp
public bool ExtendLeft
```
Controls whether the line extends beyond its `LeftHandle` when rendered.

### ExtendRight
```csharp
public bool ExtendRight
```
Controls whether the line extends beyond its `RightHandle` when rendered.

### CanChangeExtendLeft
```csharp
public bool CanChangeExtendLeft
```
Controls whether the `ExtendLeft` property can be modified when the user changes the "Extend Left" Parameter of the Parent drawing object.

### CanChangeExtendRight
```csharp
public bool CanChangeExtendRight
```
Controls whether the `ExtendRight` property can be modified when the user changes the "Extend Right" Parameter of the Parent drawing object.

### CanChangeLineStyle
```csharp
public bool CanChangeLineStyle
```
Controls whether the `LineStyle` property can be modified when the user changes the "Line Style" Parameter of the Parent drawing object.

## Handle Properties

### Handle1
```csharp
public Handle Handle1
```
One of the two `Handle` instances that define this line.

### Handle2
```csharp
public Handle Handle2
```
One of the two `Handle` instances that define this line.

### LeftHandle
```csharp
public Handle LeftHandle
```
Returns the left side `Handle` of the line.

### RightHandle
```csharp
public Handle RightHandle
```
Returns the right side `Handle` of the line.

## Interaction Properties

### IsDraggable
```csharp
public bool IsDraggable
```
Controls whether the user can drag the line with the mouse.

### Parent
```csharp
public DrawingObjectBase Parent
```
Returns the chart drawing object (instance of `DrawingObjectBase`) that this line belongs to.

## Methods

### FixHandleOrder
```csharp
public void FixHandleOrder()
```
Checks the positions of `Handle1` and `Handle2` and swaps them if `Handle1` has a greater DateTime than `Handle2`.

### InViewport
```csharp
public bool InViewport(int startX, int endX)
```
Returns whether any portion of the line is visible within the specified index range.

### IsVertical
```csharp
public bool IsVertical
```
Returns whether the line is vertical.

### Render
```csharp
public void Render(DrawingContext dc, Pen pen)
```
Renders the line to the specified `DrawingContext` using the specified `Pen`.

### SolveForY
```csharp
public double SolveForY(DateTime dt)
```
Returns the y-axis value where the line intersects the specified DateTime.

## Usage Example

```csharp
// Create a trend line on a chart
var line = new DrawingObjectLine
{
    Color = WLColor.Blue,
    LineWidth = 2,
    LineStyle = LineStyles.Solid,
    ExtendRight = true,
    IsDraggable = true
};

// Set up the handles
line.Handle1 = new Handle(DateTime.Now.AddDays(-10), 100.0);
line.Handle2 = new Handle(DateTime.Now, 120.0);

// Ensure handles are in correct order
line.FixHandleOrder();

// Calculate intersection at a specific date
DateTime intersectDate = DateTime.Now.AddDays(-5);
double yValue = line.SolveForY(intersectDate);

// Render the line
using (var pen = new Pen(line.Color, line.LineWidth))
{
    line.Render(drawingContext, pen);
}
``` 