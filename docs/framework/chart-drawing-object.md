# Chart Drawing Object API

This document details the API for building Chart Drawing Objects for Wealth-Lab 8. A Chart Drawing Object appears in a toolbar along the right edge of the WL8 main window when a chart has focus. The user can select a Drawing Object with the mouse, then click and drag on the chart to draw it there. Common Drawing Objects include:

- Trendline
- Triangle, and other shapes
- Fibonacci Retracement

## Build Environment

You can create a Drawing Object in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.ChartWPF library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Drawing Object will be a class in this library that descends from `DrawingObjectBase`, which is defined in the WealthLab.ChartWPF library, in the `WealthLab.ChartWPF` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Drawing Object, making it available in appropriate locations of the WL8 user interface.

`DrawingObjectBase` is derived from the `PlotBase` base class. Consult the PlotBase class reference for more properties and methods available to `DrawingObjectBase`.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Descriptive Properties

`DrawingObjectBase` derived from the `Configurable` base class, which exposes a number of descriptive properties you should implement. These include:

- `Name` - the Drawing Object's name
- `GlyphResource` - an icon to represent the drawing object in the toolbar

The following additional properties are specific to `DrawingObjectBase`:

### public string GroupName
By default `GroupName` returns the string "Basic". You can override this to return a string allowing you to group like Drawing Objects within the toolbar.

### public virtual bool AutoEdit
Returns false by default. If you override this to return true, WL8 will pop open the parameter editor window as soon as your Drawing Object is placed on the chart by the user. The Text Note Drawing Object employs this method to prompt the user to enter the text for the note as soon as it's placed on the chart.

## Drawing Object Parameters

The `Configurable` base class provides a mechanism for the user to configure parameters of your Drawing Object, via the `Parameters` property. Create `Parameter` instances in the `GenerateParameters` method override.

### Other Parameter-Related Functionality

The `DrawingObjectBase` class adds the following the Parameter instances in its default implementation of `GenerateParameters`. If you wish to keep these default parameters, calls `base.GenerateParameters` in your own implementation:

- Color (type = WLColor)
- Line Width (type = Int32)
- Line Style (type = LineStyle)

### protected void AddFilledShapeParameters()
You can call this method in your `GenerateParameters` override to add the following 2 Parameter instances to the Parameters property. You might use these parameters, for example, if your Drawing Object is a solid shape that shape that can optionally be filled with color:

- Fill? (type = Boolean)
- Opacity (0-100) (type = Int32)

## Accessing the CoreChart Instance

### public CoreChart Chart
This property is inherited from the `PlotBase` parent class, and returns an instance of the underlying chart component (an instance of the `CoreChart` class) that your Drawing Object is rendering to. Consult the CoreChart class reference for information about the properties and methods available.

## Handles and Lines

A Drawing Object is typically composed of handles and lines. Handles are the small circles that appear as you mouse over a Drawing Object. The user can click and drag a handle to move some or part of the Drawing Object. At minimum, a Drawing Object must have at least one handle. Handles are instances of the `Handle` class.

Two handles are often connected by a line. The user can typically drag a line to move the entire Drawing Object. Lines are instances of the `DrawingObjectLine` class.

### public List<Handle> Handles
A List containing the `Handle` instances representing the Drawing Object's handles.

### public List<DrawingObjectLine> Lines
A List containing `DrawingObjectLine` instances representing the Drawing Object's lines.

### public bool SnapToPrice
This property functions only if you added a Boolean Parameter instance named "Snap to Price" to the Drawing Object's Parameters. The property controls whether or not the Handles of your Drawing Object snap to the price on the chart as the user moves them with the mouse.

### public virtual void HandleMoved(Handle h)
WL8 calls this method after the user has moved one of the handles of your Drawing Object. You can override this to perform any calculations needed, or to move other handles to keep them synchronized with the moved handle, as required.

## Drawing Object Inception

### public abstract Handle InitializeAt(double x, double y)
WL8 calls this method when the user first begins to draw your Drawing Object on the chart. It is here that you add the code to define the handles and lines that make up your Drawing Object. Use a combination of the methods below to add handles and lines. The return value of the method should be an instance of the `Handle` class that becomes the handle that the user drags as they continue to draw your Drawing Object on the chart.

### protected Handle AddHandle Methods
```csharp
protected Handle AddHandle(double x, double y)
protected Handle AddHandle(DateTime dt, double val)
```

Call these methods to add handles to your Drawing Object. You can add handles using x, y pixel coordinates, or by specifying DateTime (dt), y-axis value val coordinates. 

Example of the Triangle Drawing Object which creates 3 handles, and then creates 3 lines based on these handles:
```csharp
public override Handle InitializeAt(double x, double y)
{
    Handle h1 = AddHandle(x - 100, y - 50);
    Handle h2 = AddHandle(x, y);
    Handle h3 = AddHandle(x - 100, y + 50);
    AddLine(h1, h2);
    AddLine(h2, h3);
    AddLine(h3, h1);
    return h2;
}
```

### protected DrawingObjectLine AddLine Methods
```csharp
protected DrawingObjectLine AddLine(double x1, double y1, double x2, double y2, bool canDrag = true)
protected DrawingObjectLine AddLine(Handle handle1, Handle handle2, bool canDrag = true)
protected DrawingObjectLine AddLine(DateTime dt1, double val1, DateTime dt2, double val2, bool canDrag = true)
```

Call these methods to add lines to your Drawing Object. You can base the lines using the same parameter options as the AddHandle calls above. Additionally, you can create a line based on Handle instances that you created earlier.

Example of the Trendline Drawing Object:
```csharp
public override Handle InitializeAt(double x, double y)
{
    AddLine(x, y, x, y, true);
    return Lines[0].Handle2;
}
```

## Responding to User Interaction

### public virtual void Moved(double startX, double startY, double x, double y)
This method is called when the user moves the Drawing Object on the chart. You are supplied the starting x, y mouse coordinates for when the move operation began, and then the current x, y mouse coordinates.

### public virtual void HandleMoved()
This method is called as the user moves one of the Drawing Object's handles on the chart.

### public virtual void MoveComplete()
This method is called when the user has finished moving the Drawing Object on the chart and has released the mouse button.

## Rendering Drawing Objects

### public override void Render(DrawingContext dc)
The Drawing Object Render method offers a default implementation that renders the lines of your Drawing Object using its Color, Line Width, and Line Style. You can override the Render method if you need to either replace or augment the default rendering.

### public override void RenderHighlight(DrawingContext dc)
The Drawing Object RenderHighlight method offers a default implementation that renders the handles of the Drawing Object when the user moves the mouse over it. Additionally, it calls `RenderDrawingObjectHighlight` described below. If you wish to keep the rendering of the handles but replace or augment the rendering of the highlighted lines, override the method below instead of this one.

### public virtual void RenderDrawingObjectHighlight(DrawingContext dc)
This method is called by RenderHightlight when the user moves the mouse over the Drawing Object. The default implementation renders a thick, translucent line over the first line defined in the Drawing Object. You can replace or augment this behavior by overriding this method.

### protected void RenderAllLinesHighlighted(DrawingContext dc)
You can call this helper method within your implementation of `RenderDrawingObjectHighlight` to render thick, translucent lines over all of the Drawing Object's lines.

### protected Brush GetBrush()
Returns a Brush that you can use to fill a fillable Drawing Object, based on its Parameters values.

### protected Pen GetPen(DrawingObjectLine line = null)
Returns a Pen that you can use the render the lines of a Drawing Object, based on its Parameters values. You can also pass the optional line parameter, an instance of the `DrawingObjectLine` class, to return a Pen for that specific line's properties.

### protected Pen GetHighlightPen()
Returns a Pen that you can use the render the highlighted line(s) of a Drawing Object, that get rendered when the mouse moves over the Drawing Object, based on its Parameters values.

### protected bool IsFilled
Returns true if the "Fill?" Parameter instance contains a value of true.

### protected Color FillColor
Returns a color based on the value of the Drawing Object's Color and the value of the "Fill Opacity (0-100)" Parameter value.

### protected List<Point> GetPointsArray()
Returns an array of Point instances that represent the Drawing Object's lines.

## Example

Below is the source code for the Triangle Drawing Object:

```csharp
namespace WealthLab.ChartWPF
{
    //triangle drawing object
    public class TriangleDrawingObject : DrawingObjectBase
    {
        //parameters
        public override void GenerateParameters()
        {
            base.GenerateParameters();
            AddFilledShapeParameters();
        }

        //name
        public override string Name => "Triangle";

        //Glyph
        public override string GlyphResource => "WealthLab.ChartWPF.Glyphs.TriangleDrawing.png";

        //initialize
        public override Handle InitializeAt(double x, double y)
        {
            Handle h1 = AddHandle(x - 100, y - 50);
            Handle h2 = AddHandle(x, y);
            Handle h3 = AddHandle(x - 100, y + 50);
            AddLine(h1, h2);
            AddLine(h2, h3);
            AddLine(h3, h1);
            return h2;
        }
    }
} 