# Theming API

This document details the theming capabilities introduced in Wealth-Lab 8. WL8 supports both Light and Dark themes, with a framework designed to accommodate additional themes in the future.

## Theme Resources

Themes are defined in XAML files (`LightTheme.xaml` and `DarkTheme.xaml`) in the Themes folder. When building WL8 UI extensions, use these theme resources via DynamicResource bindings.

### Using Theme Resources in XAML

```xaml
<Window Background="{DynamicResource BrownBackground}">
```

### Available Theme Colors

#### Window Colors
```xaml
<SolidColorBrush x:Key="BackgroundColour" Color="#FFF8F8F8" />
<SolidColorBrush x:Key="WindowBorderColour" Color="#FFE0E0E0" />
<SolidColorBrush x:Key="WindowTitleColour" Color="WhiteSmoke" />
```

#### WL8 Specific Colors
```xaml
<SolidColorBrush x:Key="MDITitleBackground" Color="LightSteelBlue"/>
<SolidColorBrush x:Key="SelectorBackground" Color="DarkSlateGray"/>
<SolidColorBrush x:Key="BuildingBlock" Color="#f9e8d2"/>
<SolidColorBrush x:Key="BuildingBlockBuy" Color="#cce6ff"/>
<SolidColorBrush x:Key="BuildingBlockSell" Color="#ffcccc"/>
<SolidColorBrush x:Key="BuildingBlockShort" Color="#ccffcc"/>
<SolidColorBrush x:Key="BuildingBlockCover" Color="#ffe6cc"/>
```

#### Panel Background Colors
```xaml
<SolidColorBrush x:Key="GreenBackground" Color="#dfecdf"/>
<SolidColorBrush x:Key="RedBackground" Color="#eddede"/>
<SolidColorBrush x:Key="YellowBackground" Color="#f1ecda"/>
<SolidColorBrush x:Key="BlueBackground" Color="#d6edf5"/>
<SolidColorBrush x:Key="BrownBackground" Color="#ecdfdf"/>
```

#### Standard UI Elements
```xaml
<SolidColorBrush x:Key="ContainerBackground" Color="WhiteSmoke"/>
<SolidColorBrush x:Key="ControlDefaultForeground" Color="#FF040404" />
<SolidColorBrush x:Key="ControlDefaultBackground" Color="#FFE1E1E1"/>
```

## Theme Detection and Changes

### Detecting Theme in Code
```csharp
// Check if dark theme is active
bool isDark = WLClientHost.Instance.IsDarkTheme;

// Subscribe to theme changes
EventRouter.Subscribe("ThemeChanged", (bool isDark) => {
    // Handle theme change
});
```

### Theme Detection in XAML
```xaml
<wpf:WLImage IsReversed="{DynamicResource IsDark}" />
```

## WL8 UI Components

### WLImage
Enhanced Image control with theme support:

```xaml
<wpf:WLImage 
    BaseSource="/Images/icon.png"
    DisableReverse="False"
    IsReversed="{DynamicResource IsDark}" />
```

```csharp
public class WLImage : Image
{
    public ImageSource BaseSource { get; set; }
    public bool DisableReverse { get; set; }
    public bool IsReversed { get; set; }
}
```

### WLButton
Enhanced Button control with theme support:

```xaml
<wpf:WLButton 
    DisplayState="ImageAndText"
    Text="Submit"
    Image="/Images/submit.png"
    DisableReverse="False" />
```

```csharp
public class WLButton : Button
{
    public WLButtonDisplayState DisplayState { get; set; }
    public string Text { get; set; }
    public ImageSource Image { get; set; }
    public bool DisableReverse { get; set; }
}
```

### DialogWindow
Base window class for themed windows:

```xaml
<wpf:DialogWindow
    Style="{DynamicResource CustomToolWindowStyle}"
    Background="{DynamicResource ContainerBackground}"
    DesignSizeToContent="WidthAndHeight">
```

### WLContextMenu
Theme-aware context menu:

```xaml
<wpf:WLContextMenu>
    <MenuItem Header="Option 1" />
    <MenuItem Header="Option 2" />
</wpf:WLContextMenu>
```

## Working with Themes

### Configurable Extensions
For extensions derived from `Configurable`:

```csharp
public class MyExtension : Configurable
{
    public override bool DisableGlyphReverse => true; // Disable automatic image reversal
}
```

### Dynamic UI Updates
Refresh theme on dynamically created UI elements:

```csharp
public void OnUIChanged()
{
    // Refresh theme on this control and descendants
    MyClientHost.RefreshTheme(this);
}
```

## Best Practices

1. **Use Theme Resources**
   - Always use DynamicResource for colors and brushes
   - Reference standard theme colors where possible

2. **Window Development**
   - Derive from DialogWindow instead of Window
   - Use CustomToolWindowStyle
   - Use DesignSizeToContent instead of SizeToContent

3. **Context Menus**
   - Use WLContextMenu instead of ContextMenu
   - Ensures proper theme behavior

4. **Image Handling**
   - Use WLImage for automatic dark theme support
   - Override DisableGlyphReverse when needed

5. **Dynamic UI**
   - Call RefreshTheme after creating UI elements
   - Subscribe to ThemeChanged for runtime updates

## Example Implementation

Here's a complete example of a themed window:

```xaml
<wpf:DialogWindow x:Class="MyNamespace.MyWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:wpf="clr-namespace:WealthLab.WPF;assembly=WealthLab.WPF"
    Title="My Window"
    Style="{DynamicResource CustomToolWindowStyle}"
    Background="{DynamicResource ContainerBackground}"
    DesignSizeToContent="WidthAndHeight">
    
    <Grid Margin="10">
        <StackPanel>
            <wpf:WLButton 
                DisplayState="ImageAndText"
                Text="Settings"
                Image="/Images/settings.png">
                <wpf:WLButton.ContextMenu>
                    <wpf:WLContextMenu>
                        <MenuItem Header="Option 1" />
                        <MenuItem Header="Option 2" />
                    </wpf:WLContextMenu>
                </wpf:WLButton.ContextMenu>
            </wpf:WLButton>
            
            <TextBlock 
                Text="Sample Text"
                Foreground="{DynamicResource ControlDefaultForeground}" />
                
            <Border 
                Background="{DynamicResource BlueBackground}"
                BorderBrush="{DynamicResource ControlDefaultBorderBrush}"
                BorderThickness="1"
                Padding="10">
                <wpf:WLImage 
                    BaseSource="/Images/icon.png"
                    Width="32"
                    Height="32" />
            </Border>
        </StackPanel>
    </Grid>
</wpf:DialogWindow>
```

```csharp
public partial class MyWindow : DialogWindow
{
    public MyWindow()
    {
        InitializeComponent();
        
        // Subscribe to theme changes
        EventRouter.Subscribe("ThemeChanged", OnThemeChanged);
    }
    
    private void OnThemeChanged(bool isDark)
    {
        // Handle theme change
        MyClientHost.RefreshTheme(this);
    }
}
```

This example demonstrates:
1. Proper window setup
2. Theme-aware controls
3. Context menu implementation
4. Dynamic theme handling
5. Best practices for UI development 