# Using the Chart Component in Extensions

This document describes how to use the Chart components in Wealth-Lab 8 in your own Extensions. The Chart components are located in the `WealthLab.ChartWPF` assembly, so reference this assembly in addition to the other ones required for your Extension.

> **Note:** For a complete example of using the Chart components in an Extension, see our open source Extension Demo Project on GitHub.

The Chart Components in `WealthLab.ChartWPF` are organized into two primary classes:

- `CoreChart` - The stripped down chart without toolbar and status bar
- `Chart` - A higher level chart that contains a CoreChart, toolbar, and status bar

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Working with CoreChart

The first tab of the Extension Demo Project contains 4 CoreChart instances in a 2x2 grid. Examine the XAML and CS code for an example of how to bring the CoreChart into your project code base.

### public void Refresh(bool fullRefresh)
Causes the chart to refresh. Can be used to force a refresh after changing some properties in its ChartPreferences, for example. The chart uses two-pass rendering logic:
- First pass renders the underlying bars of data
- Second pass renders only the transient elements like cursors

The `fullRefresh` parameter controls whether both rendering passes will occur (`true`) or only the second pass (`false`).

### public BarHistory Bars
Assign a `BarHistory` instance to the Bars property to cause that data to be plotted in the chart.

### public ChartPreferences ChartPreferences
An instance of the `ChartPreferences` class that contains the cosmetic settings the chart will use to render. Assigning a new value to this property causes the chart to refresh with the new settings.

### public bool IsCrosshairEnabled
Controls whether the crosshair cursor is visible.

### public bool IsVerticalBarEnabled
Controls whether the vertical bar cursor is visible.

### public bool IsStreaming
Controls whether the chart is streaming. If you assign true, the chart will use the most recently selected Streaming Data Provider.

### public bool ActivateStreamingWith(StreamingProviderBase sb)
Lets you begin streaming with a specific Streaming Data Provider.

> **Note:** CoreChart has many more properties, methods and events, and we will continue to flesh out this document as time goes on. For answers to any particular questions, please use our Discussion Forum.

## Working with Chart

The second tab of the Extension Demo Project contains a Chart component that accepts user-selected Indicators for plotting. Examine the XAML and CS code for an example of how to bring the Chart into your project code base.

### public void ChartThisSymbol(string symbol, DataSet ds = null)
Causes the chart to load data for the specified symbol, optionally using the DataSet specified in `ds`.

### public CoreChart Core
The instance of `CoreChart` contained in this Chart.

### public void InstallContextMenuItem(string text, ImageSource imgsrc, RoutedEventHandler handler)
Lets you add a new menu item to the chart's right click context menu. Parameters:
- `text`: The text to display in the menu item
- `imgsrc`: The image to display next to the menu item
- `handler`: The event handler to execute when the menu item is clicked

### public bool AllowStreaming
Controls whether the streaming button should be visible in the chart toolbar.

### public bool IsStreaming
Determines whether the chart is streaming.

> **Note:** Chart has many more properties, methods and events, and we will continue to flesh out this document as time goes on. For answers to any particular questions, please use our Discussion Forum. 