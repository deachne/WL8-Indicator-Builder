# EventDataPoint Class

**Namespace:** WealthLab.Data  
**Parent:** Object

Represents a single piece of event data, such as fundamental data (dividends, splits, earnings), analyst ratings, or chart patterns. WealthLab supports multiple Event Data Providers, both built-in and via extensions, each supplying its own set of historical event data.

Access event data through the `EventDataPoints` property or `GetEventDataPoints` method of the `BarHistory` class.

## Constructors

```csharp
public EventDataPoint()
public EventDataPoint(string name, DateTime dt, double value = 0)
```
Provides:
- A parameterless constructor
- A constructor that assigns values to `Name`, `Date`, and optionally `Value` properties

## Core Properties

### Data
```csharp
public string Data
```
Contains provider-specific string data. Consult provider's extension documentation for details on usage.

### Date
```csharp
public DateTime Date
```
The date when the event data item was reported.

### Name
```csharp
public string Name
```
Describes the event type (e.g., "Split", "Dividend", "Analyst Rating").

### Value
```csharp
public double Value
```
The numeric value associated with the event (e.g., 2 for a 2:1 split, 1.5 for a $1.50 dividend).

### ProviderName
```csharp
public string ProviderName
```
The name of the Event Data Provider that generated this event.

## Detail Properties

### Details
```csharp
public Dictionary<string, string> Details
```
Dictionary containing item-specific information.

### HasDetailItems
```csharp
public bool HasDetailItems
```
Returns true if the instance's Details Dictionary contains items.

### ItemName
```csharp
public string ItemName
```
Returns the event name with certain provider-specific prefixes removed.

## Display Properties

### Text
```csharp
public virtual string Text
```
Descriptive text for the event, typically combining `ItemName` and `Value`.

### TooltipText
```csharp
public string TooltipText
```
Text displayed in chart tooltips when hovering over the event's glyph icon. Combines `Text` with `ProviderName`.

## Utility Methods

### InCurrentRange
```csharp
public bool InCurrentRange(BarHistory bh)
```
Returns true if the event's `Date` falls within the historical data currently in the specified `BarHistory`.

## Members for Derived Classes

### GetBarGlyph
```csharp
public virtual object GetBarGlyph()
```
Override to return a custom `BarGlyphBase`-derived instance for chart rendering.

### Glyph
```csharp
public virtual Bitmap Glyph
```
Override to return a custom `System.Drawing.Bitmap` for the event's chart icon. Default null causes procedural generation using `GlyphText` and `GlyphColor`.

### GlyphColor
```csharp
public virtual Color? GlyphColor
```
Background color for chart glyph icon. Default null causes color to be determined by `ItemName`.

### GlyphText
```csharp
public virtual string GlyphText
```
Text rendered on the chart for this event. Default uses first character of `ItemName`.

## Usage Examples

```csharp
// Create a dividend event
var dividendEvent = new EventDataPoint("dividend", DateTime.Now, 1.50)
{
    ProviderName = "MyDataProvider",
    Data = "Q3 2023 Dividend"
};

// Add custom details
dividendEvent.Details["Type"] = "Regular Cash";
dividendEvent.Details["Currency"] = "USD";

// Create a stock split event
var splitEvent = new EventDataPoint
{
    Name = "split",
    Date = DateTime.Now,
    Value = 2.0,  // 2:1 split
    Data = "Stock Split 2:1"
};

// Check if event is in current chart range
var bars = GetBarHistory(); // Your BarHistory instance
if (splitEvent.InCurrentRange(bars))
{
    Console.WriteLine($"Split Event: {splitEvent.Text}");
    Console.WriteLine($"Tooltip: {splitEvent.TooltipText}");
}

// Custom event data point with custom glyph
public class CustomEvent : EventDataPoint
{
    public override Bitmap Glyph => LoadCustomBitmap();
    
    public override Color? GlyphColor => Color.Purple;
    
    public override string GlyphText => "C";
    
    private Bitmap LoadCustomBitmap()
    {
        // Return custom bitmap for chart icon
        return new Bitmap("path/to/icon.png");
    }
}
``` 