# PenBrushFactory Class

**Namespace:** WealthLab.WPF  
**Parent:** Object

The `PenBrushFactory` is a static utility class that provides themed brushes and pens for WealthLab 8 applications. It offers cached, theme-aware color and drawing utilities that ensure consistent visual styling across the application.

## Brush Methods

### BackgroundBrush
```csharp
public static SolidColorBrush BackgroundBrush
```
Returns a `SolidColorBrush` using the current WL8 theme's background color.

### ForegroundBrush
```csharp
public static SolidColorBrush ForegroundBrush
```
Returns a `SolidColorBrush` using the current WL8 theme's foreground color.

### GetBrush
```csharp
public static Brush GetBrush(WLColor color)
```
Creates a `SolidColorBrush` for the specified `WLColor`.

### GreenTextBrush
```csharp
public static SolidColorBrush GreenTextBrush
```
Returns a green-colored `SolidColorBrush` appropriate for the current theme.

### ProfitBrush
```csharp
public static SolidColorBrush ProfitBrush(double profit)
```
Returns a color-coded `SolidColorBrush` based on profit value:
- Negative profit: Red
- Positive profit: Green
- Zero profit: Gray

### RedTextBrush
```csharp
public static SolidColorBrush RedTextBrush
```
Returns a red-colored `SolidColorBrush` appropriate for the current theme.

## Color Methods

### BackgroundColor
```csharp
public static WLColor BackgroundColor
```
Returns the background color of the current WL8 theme.

### ForegroundColor
```csharp
public static WLColor ForegroundColor
```
Returns the foreground color of the current WL8 theme.

### GreenColor
```csharp
public static WLColor GreenColor
```
Returns a theme-appropriate green `WLColor`.

### RedColor
```csharp
public static WLColor RedColor
```
Returns a theme-appropriate red `WLColor`.

## Pen Methods

### GetPen (Color and Thickness)
```csharp
public static Pen GetPen(
    WLColor color, 
    double thickness = 1.0, 
    LineStyle ls = LineStyle.Solid
)
```
Creates a WPF `Pen` with:
- Specified color
- Optional thickness (default: 1.0)
- Optional line style (default: Solid)

### GetPen (Color and Line Style)
```csharp
public static Pen GetPen(
    WLColor color, 
    LineStyle ls
)
```
Creates a WPF `Pen` with:
- Specified color
- Specified line style
- Default thickness of 1.0

## Usage Examples

### Creating Themed Brushes and Pens
```csharp
public class ThemeAwareRenderer
{
    public void RenderChart(DrawingContext dc)
    {
        // Use theme background
        dc.DrawRectangle(
            PenBrushFactory.BackgroundBrush, 
            null, 
            new Rect(0, 0, 100, 100)
        );

        // Create a green profit line
        var profitPen = PenBrushFactory.GetPen(
            PenBrushFactory.GreenColor, 
            2.0, 
            LineStyle.Solid
        );
        
        // Draw a line using the pen
        dc.DrawLine(
            profitPen, 
            new Point(0, 0), 
            new Point(100, 100)
        );
    }

    public void RenderProfitText(TextBlock textBlock, double profit)
    {
        // Color-code text based on profit
        textBlock.Foreground = PenBrushFactory.ProfitBrush(profit);
        textBlock.Text = $"Profit: {profit:C2}";
    }
}
```

### Conditional Rendering
```csharp
public class TradeVisualizer
{
    public void HighlightTrade(Canvas canvas, Trade trade)
    {
        // Choose brush based on trade profitability
        var tradeBrush = trade.IsProfit 
            ? PenBrushFactory.GreenTextBrush 
            : PenBrushFactory.RedTextBrush;

        var tradePen = PenBrushFactory.GetPen(
            trade.IsProfit 
                ? PenBrushFactory.GreenColor 
                : PenBrushFactory.RedColor
        );

        // Render trade details
        var tradeRect = new Rectangle
        {
            Fill = tradeBrush,
            Stroke = tradePen
        };
        canvas.Children.Add(tradeRect);
    }
}
```

## Best Practices

1. **Theme Consistency**
   - Always use `PenBrushFactory` for color and drawing utilities
   - Ensures consistent styling across the application
   - Adapts to different theme settings

2. **Performance**
   - Brushes and pens are cached
   - Minimal overhead when creating multiple instances
   - Reuse factory methods instead of creating custom brushes

3. **Color Coding**
   - Use `ProfitBrush` for intuitive financial visualizations
   - Leverage theme-aware green and red colors
   - Provide clear visual feedback

## Notes

- Static utility for WealthLab 8 theming
- Supports dynamic theme adaptation
- Provides cached, efficient color and drawing utilities
- Simplifies creating theme-consistent visualizations 