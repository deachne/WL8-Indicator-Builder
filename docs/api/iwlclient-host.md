# IWLClientHost Interface

**Namespace:** WealthLab.WPF  
**Parent:** None

The `IWLClientHost` interface provides methods and properties for interacting with the WealthLab 8 window hosting a child window, typically created by an extension. It enables control over various WealthLab features, window management, and UI interactions.

## Properties

### AllowAutoTrading
```csharp
public bool AllowAutoTrading
```
Returns true if the user has accepted the Auto-Trading Agreement dialog.

### IsDarkTheme
```csharp
public bool IsDarkTheme
```
Returns true if the currently selected WealthLab 8 Theme is a "dark" Theme.

## Window Management Methods

### ShowExtensionChildWindow
```csharp
void ShowExtensionChildWindow(ChildWindow cw, string title, System.Drawing.Image glyph)
```
Opens a `ChildWindow` instance with specified title and window icon.

**Parameters:**
- `cw`: The `ChildWindow` instance to display
- `title`: Window title
- `glyph`: Window icon image

### OpenStrategy
```csharp
void OpenStrategy(Strategy s)
void OpenStrategy(SavedOptimizationResults sor)
```
Opens a new Strategy window with either:
- A specified `Strategy` instance
- A saved optimization result instance

### OpenAndRunStrategy
```csharp
void OpenAndRunStrategy(Strategy s)
```
Opens a new Strategy window with the specified Strategy and automatically runs a backtest.

### OpenQuotesWindow
```csharp
void OpenQuotesWindow(SignalBlock sb)
```
Opens a new Quotes window populated with price triggers from the provided `SignalBlock` instance.

## Tool Window Methods

### ShowDataManager
```csharp
void ShowDataManager(string pageName = null, string providerName = null)
```
Opens the Data Manager tool with optional tab and provider selection.

### ShowPreferences
```csharp
void ShowPreferences(string pageName = null)
```
Opens the Preferences window with optional page selection.

### ActivateOrderManager
```csharp
void ActivateOrderManager()
```
Opens and brings the Order Manager window into focus.

## Navigation Methods

### ShowViewPage
```csharp
void ShowViewPage(string page)
```
Changes the left navigation pane to the specified view.

**Valid page values:**
- `"DataSets"`
- `"Indicators"`
- `"Strategies"`
- `"BuildingBlocks"`
- `"QuickRef"`

### ShowIndicator
```csharp
void ShowIndicator(string abbr)
```
Opens the Indicators page and highlights the specified indicator.

### ShowQuickRefEntry
```csharp
void ShowQuickRefEntry(QuickRefEntry entry)
void ShowQuickRefEntry(string className, string itemName)
void ShowQuickRefClass(string className)
```
Opens the QuickRef pane and navigates to the specified entry or class.

### ShowHelpPage
```csharp
void ShowHelpPage(string page)
```
Opens the Help File and navigates to the specified topic.

## UI and Theme Methods

### RefreshTheme
```csharp
void RefreshTheme(DependencyObject dobj)
```
Forces Light/Dark Theme refresh for the specified WPF control.

### PlaySound
```csharp
void PlaySound(string name)
```
Plays a predefined sound.

**Available sounds:**
- `"Alarm"`
- `"NewBar"`
- `"OptimizationComplete"`
- `"OrderFilled"`
- `"Save"`
- `"Signals"`

## Usage Examples

### Extension Window Management
```csharp
public class CustomExtension
{
    private IWLClientHost _clientHost;

    public void ShowCustomWindow()
    {
        var customWindow = new CustomChildWindow();
        var icon = LoadCustomIcon();
        
        _clientHost.ShowExtensionChildWindow(
            customWindow,
            "Custom Analysis Window",
            icon
        );
    }
}
```

### Strategy Management
```csharp
public class StrategyManager
{
    private IWLClientHost _clientHost;

    public void LoadAndRunStrategy(Strategy strategy)
    {
        if (_clientHost.AllowAutoTrading)
        {
            _clientHost.OpenAndRunStrategy(strategy);
        }
        else
        {
            _clientHost.OpenStrategy(strategy);
        }
    }
}
```

### Theme-Aware UI
```csharp
public class ThemeAwareControl : UserControl
{
    private IWLClientHost _clientHost;

    public void UpdateTheme()
    {
        // Apply theme-specific styles
        var darkTheme = _clientHost.IsDarkTheme;
        ApplyThemeStyles(darkTheme);
        
        // Force theme refresh
        _clientHost.RefreshTheme(this);
    }
}
```

## Best Practices

1. **Window Management**
   - Check `AllowAutoTrading` before automated operations
   - Provide meaningful window titles and icons
   - Clean up resources when closing windows

2. **Theme Handling**
   - Use `IsDarkTheme` for theme-aware UI components
   - Call `RefreshTheme` after dynamic UI changes
   - Support both light and dark themes

3. **Navigation**
   - Use appropriate navigation methods for context
   - Provide clear user feedback during navigation
   - Handle navigation errors gracefully

4. **Sound Usage**
   - Use sounds sparingly and appropriately
   - Consider user environment when playing sounds
   - Provide visual feedback alongside sounds

## Common Use Cases

1. **Extension Integration**
   - Creating custom tool windows
   - Integrating with WealthLab navigation
   - Managing strategy windows

2. **User Interface**
   - Theme-aware custom controls
   - Dynamic UI updates
   - Sound notifications

3. **Tool Integration**
   - Data Manager integration
   - Order Manager interaction
   - Quick Reference navigation

## Notes

- Interface methods are primarily used in extension development
- Consider user preferences when automating windows
- Handle theme changes appropriately
- Use sound notifications judiciously 