# ManuallyDrawnObject Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object

The `ManuallyDrawnObject` class represents a user-drawn chart object such as trend lines, Fibonacci retracements, or text notes. WealthLab 8 persists these objects by symbol and `HistoryScale` (Daily, Weekly, etc.).

## Properties

### Bars
```csharp
public BarHistory Bars
```
The `BarHistory` instance associated with this drawing object.

### DrawingObjectType
```csharp
public string DrawingObjectType
```
Specifies the type of drawing object. Common types include:
- `"Line"`
- `"Fibonacci Retracement"`
- `"Text Note"`

**Note:** You can identify an object's type in WealthLab 8 by:
- Editing the object (type appears in dialog title)
- Hovering over its button in the drawing toolbar

### NameFromUser
```csharp
public string NameFromUser
```
The user-assigned name of the drawing object, if any, specified during creation or editing.

### Pane
```csharp
public string Pane
```
The chart pane containing the drawing object:
- `"Price"`: Main price pane
- `"Volume"`: Volume pane
- Other values (e.g., `"RSI"`, `"CMO"`): Indicator panes

### Points
```csharp
public List<HistoricalDataPoint> Points
```
List of `HistoricalDataPoint` instances defining the object's points. The number of points varies by object type:
- Line: 2 points
- Fibonacci Retracement: 2 points
- Text Note: 1 point

## Methods

### ExtendLine
```csharp
public double ExtendLine(int pt1, int pt2, int idx)
```
Projects a line between two points to calculate its value at a specific bar index using linear scale.

**Parameters:**
- `pt1`: Index of first point in `Points` list
- `pt2`: Index of second point in `Points` list
- `idx`: Target bar index in associated `BarHistory`

**Returns:** Y-axis value where line intersects at `idx`

### ExtendLineLog
```csharp
public double ExtendLineLog(int pt1, int pt2, int idx)
```
Projects a line between two points to calculate its value at a specific bar index using logarithmic scale.

## Usage Examples

### Trend Line Analysis
```csharp
public class TrendLineStrategy : UserStrategyBase
{
    public override void Execute(BarHistory bars, int idx)
    {
        // Get manually drawn objects
        var drawnObjects = GetDrawnObjects();
        
        foreach (var obj in drawnObjects)
        {
            // Process only trend lines in price pane
            if (obj.DrawingObjectType == "Line" && obj.Pane == "Price")
            {
                // Project line to current bar
                double projectedValue = obj.ExtendLine(0, 1, idx);
                
                // Check for breakout
                if (bars.Close[idx] > projectedValue)
                {
                    Buy();
                }
            }
        }
    }
}
```

### Fibonacci Level Trading
```csharp
public class FibonacciStrategy : UserStrategyBase
{
    public override void Execute(BarHistory bars, int idx)
    {
        foreach (var obj in GetDrawnObjects())
        {
            if (obj.DrawingObjectType == "Fibonacci Retracement")
            {
                // Get Fibonacci points
                var highPoint = obj.Points[0];
                var lowPoint = obj.Points[1];
                
                // Calculate 61.8% retracement level
                double range = highPoint.Value - lowPoint.Value;
                double fibLevel = lowPoint.Value + (range * 0.618);
                
                // Trade on retracement level
                if (bars.Close[idx] > fibLevel && bars.Close[idx-1] <= fibLevel)
                {
                    Buy();
                }
            }
        }
    }
}
```

### Multi-Pane Analysis
```csharp
public class MultiPaneStrategy : UserStrategyBase
{
    public override void Execute(BarHistory bars, int idx)
    {
        var priceObjects = GetDrawnObjects()
            .Where(o => o.Pane == "Price");
            
        var rsiObjects = GetDrawnObjects()
            .Where(o => o.Pane == "RSI");
            
        // Analyze objects in different panes
        foreach (var priceObj in priceObjects)
        {
            foreach (var rsiObj in rsiObjects)
            {
                // Custom analysis logic
                AnalyzeObjects(priceObj, rsiObj, idx);
            }
        }
    }
}
```

## Best Practices

1. **Object Type Handling**
   - Verify object type before processing
   - Handle different types appropriately
   - Consider pane context in analysis

2. **Point Management**
   - Validate point count for object type
   - Handle missing or invalid points
   - Consider time alignment of points

3. **Line Projection**
   - Choose appropriate scale (linear/log)
   - Validate projected values
   - Consider projection distance

4. **Performance**
   - Cache drawn objects when possible
   - Limit projection calculations
   - Filter objects by relevant types/panes

## Common Use Cases

1. **Technical Analysis**
   - Trend line breakouts
   - Support/resistance levels
   - Pattern recognition

2. **Fibonacci Analysis**
   - Retracement levels
   - Extension targets
   - Price projections

3. **Multi-Timeframe Analysis**
   - Trend line correlation
   - Level confirmation
   - Pattern validation

## Notes

- Objects persist across sessions
- Scale-specific storage (Daily, Weekly, etc.)
- Consider user modifications
- Validate object existence before use 