# Position ScoreCard API

This document details the API for building Position ScoreCard extensions for Wealth-Lab 8. A Position ScoreCard generates a roster of Performance Metrics (such as Profit, MAE, and ProfitPerBar) based on a single Position in a set of Backtest results. These Position Performance Metrics can be selected for display in:
- The Positions Visualizer in WL8
- Other Visualizers (e.g., Position Metrics Visualizer in the Power Pack Extension)

## Build Environment

You can create a Position ScoreCard in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Position ScoreCard will be a class in this library that descends from `PositionScoreCardBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Backtest` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Position ScoreCard, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Descriptive Properties

### public abstract string Name
Return the name of the Position ScoreCard, which appears in the Position Metrics Preference page in WL8 where users select Position Metrics for the Positions Visualizer.

### public abstract List<string> PositionMetricNames
Return a List containing the names of the Performance Metrics that your Position ScoreCard calculates and returns.

## Calculating Metrics

### public abstract double CalculatePositionMetric(Backtester bt, Position pos, string metricName)
Override this method to calculate Performance Metrics. Parameters:
- `bt`: Backtester instance that generated the backtest
- `pos`: Position instance to analyze
- `metricName`: Name of metric to calculate

Return the calculated metric value as a double.

## Metric Properties

### public abstract bool ColorizeMetric(string metric)
Return true if the specified metric should be colorized in the Positions Visualizer:
- Green for profit
- Red for loss

### public abstract int DecimalsMetric(string metric)
Return the number of decimal places to use when displaying the metric value in the Positions Visualizer.

## Example Implementation

Below is a simple example of a Position ScoreCard that calculates basic position metrics:

```csharp
using System.Collections.Generic;
using WealthLab.Core;
using WealthLab.Backtest;

namespace WealthLab.Metrics
{
    public class BasicPositionScoreCard : PositionScoreCardBase
    {
        public override string Name => "Basic Position Metrics";

        public override List<string> PositionMetricNames => new List<string>
        {
            "Profit",
            "Profit %",
            "Bars Held"
        };

        public override double CalculatePositionMetric(Backtester bt, Position pos, string metricName)
        {
            switch (metricName)
            {
                case "Profit":
                    return pos.ProfitPoints * pos.Size;
                
                case "Profit %":
                    return pos.ProfitPercent;
                
                case "Bars Held":
                    return pos.BarsHeld;
                
                default:
                    return 0.0;
            }
        }

        public override bool ColorizeMetric(string metric)
        {
            // Colorize profit-related metrics
            return metric.StartsWith("Profit");
        }

        public override int DecimalsMetric(string metric)
        {
            switch (metric)
            {
                case "Profit":
                    return 2;  // Show dollars to 2 decimal places
                
                case "Profit %":
                    return 2;  // Show percentages to 2 decimal places
                
                case "Bars Held":
                    return 0;  // Show whole numbers for bars
                
                default:
                    return 2;
            }
        }
    }
} 