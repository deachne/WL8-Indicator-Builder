# Data Panel ScoreCard API

This document details the API for building Data Panel ScoreCard extensions for Wealth-Lab 8. A Data Panel ScoreCard generates adds a new choice to the ScoreCard selector in the WL8 Data Panel. The Data Panel displays values as the mouse moves over a chart. Your Data Panel ScoreCard determines what values are displayed in the Data Panel.

## Build Environment

You can create a Data Panel ScoreCard in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Data Panel ScoreCard will be a class in this library that descends from `DataPanelScoreCardBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Backtest` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Data Panel ScoreCard, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Descriptive Properties

### public abstract string Name
Return the name of the Data Panel ScoreCard, which appears in the selector field of the Data Panel in WL8.

## Calculating and Displaying Values

### public abstract List<DataPanelItem> GetItems(BarHistory bars, int idx, List<IndicatorBase> plottedIndicators)
Override this method to determine what values are displayed in the Data Panel. Create instances of the `DataPanelItem` class, one for each row of data that should be displayed. 

The `DataPanelItem` class has several constructors you can choose from depending on:
- Whether the value is a string or a numeric
- The color used for the item

This method receives the following parameters:
- `bars`: The `BarHistory` instance containing the data being displayed
- `idx`: The index of the bar being hovered over
- `plottedIndicators`: A list of indicators currently plotted on the chart 