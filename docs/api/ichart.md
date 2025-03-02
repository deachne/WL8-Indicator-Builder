# IChart Interface

**Namespace:** WealthLab.WPF

The `IChart` interface enables communication between WealthLab 8 and charts within `ChildWindow` instances. The `WealthLab.WPF.Chart` class implements this interface by default. When implementing a custom `ChildWindow` in a WealthLab extension that contains a chart, you should override the `Chart` property to return an instance of this interface.

## Methods

### ChartThisSymbol
```csharp
void ChartThisSymbol(string symbol, DataSet ds)
```
Called by WealthLab 8 when a user clicks a symbol in the DataSet tree.

**Parameters:**
- `symbol`: The symbol to chart
- `ds`: The parent DataSet containing the symbol

### PushKey
```csharp
void PushKey(Key key)
```
Called by WealthLab 8 when the chart is visible and the user presses a key. The default `Chart` class implementation handles:
- Character input for the symbol entry field
- Special keystrokes (backspace, control+left/right arrow)

## Usage Examples

### Basic Chart Implementation
```csharp
public class CustomChart : ChildWindow, IChart
{
    private Chart _chart;
    
    public CustomChart()
    {
        _chart = new Chart();
        Content = _chart;
    }
    
    public void ChartThisSymbol(string symbol, DataSet ds)
    {
        // Load and display the symbol data
        var bars = GetHistory(symbol, ds);
        _chart.DisplayData(bars);
    }
    
    public void PushKey(Key key)
    {
        // Handle keyboard input
        switch (key)
        {
            case Key.Left:
                if (Keyboard.Modifiers == ModifierKeys.Control)
                    _chart.ScrollLeft();
                break;
                
            case Key.Right:
                if (Keyboard.Modifiers == ModifierKeys.Control)
                    _chart.ScrollRight();
                break;
                
            default:
                // Pass character to symbol input
                if (char.IsLetterOrDigit((char)key))
                    _chart.SymbolInput.Text += (char)key;
                break;
        }
    }
}
```

### Advanced Chart Implementation
```csharp
public class AdvancedChart : ChildWindow, IChart
{
    private readonly Chart _chart;
    private readonly Dictionary<string, BarHistory> _cachedData;
    
    public AdvancedChart()
    {
        _chart = new Chart();
        _cachedData = new Dictionary<string, BarHistory>();
        
        InitializeComponents();
    }
    
    public void ChartThisSymbol(string symbol, DataSet ds)
    {
        try
        {
            // Check cache first
            if (_cachedData.TryGetValue(symbol, out var cachedBars))
            {
                _chart.DisplayData(cachedBars);
                return;
            }
            
            // Load new data
            var bars = GetHistory(symbol, ds);
            
            // Cache the data
            _cachedData[symbol] = bars;
            
            // Display
            _chart.DisplayData(bars);
            
            // Update UI elements
            UpdateTitle($"Chart: {symbol}");
            EnableTradingControls(ds.IsTradable(symbol));
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Error loading chart for {symbol}: {ex.Message}");
        }
    }
    
    public void PushKey(Key key)
    {
        // Handle keyboard shortcuts
        if (Keyboard.Modifiers == ModifierKeys.Control)
        {
            switch (key)
            {
                case Key.Left:
                    _chart.ScrollLeft();
                    break;
                    
                case Key.Right:
                    _chart.ScrollRight();
                    break;
                    
                case Key.Up:
                    _chart.ZoomIn();
                    break;
                    
                case Key.Down:
                    _chart.ZoomOut();
                    break;
                    
                case Key.R:
                    RefreshCurrentSymbol();
                    break;
            }
            return;
        }
        
        // Handle regular input
        if (char.IsLetterOrDigit((char)key))
        {
            _chart.SymbolInput.Text += (char)key;
            AutoCompleteSymbol();
        }
        else if (key == Key.Back && _chart.SymbolInput.Text.Length > 0)
        {
            _chart.SymbolInput.Text = _chart.SymbolInput.Text.Substring(0, _chart.SymbolInput.Text.Length - 1);
        }
    }
    
    private void AutoCompleteSymbol()
    {
        // Implement symbol auto-completion logic
    }
    
    private void RefreshCurrentSymbol()
    {
        // Implement refresh logic
    }
}
```

This example demonstrates:
- Basic chart window implementation
- Advanced features with data caching
- Custom keyboard handling
- Error handling
- UI state management

### Extension Integration
```csharp
public class CustomExtension : WealthLab.Extension
{
    public override void Initialize()
    {
        // Register custom chart window
        RegisterChildWindow("CustomChart", () => new CustomChart());
    }
}
```

This example demonstrates:
- Registering a custom chart window
- Integration with WealthLab's extension system 