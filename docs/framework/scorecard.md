# ScoreCard API

This document details the API for building ScoreCard extensions for Wealth-Lab 8. A ScoreCard generates a roster of Performance Metrics (such as APR, Net Profit, and Sharpe Ratio) based on the results of a backtest run. These Performance Metrics can be displayed in various Performance Visualizers and can be selected as optimization targets by certain Optimizers.

## Build Environment

You can create a ScoreCard in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your ScoreCard will be a class in this library that descends from `ScoreCardBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Backtest` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your ScoreCard, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Descriptive Properties

### public abstract string Name
Return the name of the ScoreCard, which appears in the Metrics Report and any other areas in the WL8 user interface that let the user select a ScoreCard.

### public abstract List<string> MetricNames
Return a List containing the names of the Performance Metrics that your ScoreCard calculates and returns. Each Metric should be named using a valid .NET variable name. You can associate more descriptive labels for Metrics in the report layout.

## Calculating Metrics

### public virtual void Initialize(Backtester bt)
Override this method to calculate your ScoreCard's Performance Metrics. Each Metric should be assigned to the `Metrics` property of the Backtester instance using the Metric name as a property name.

The Backtester class' `Metrics` property is a dynamic type, accepting any property name that is a valid .NET variable name. This allows you to inject custom Metrics into the WL8 environment that can be used by Optimizers or Performance Visualizers.

Example from the Basic ScoreCard:
```csharp
//gross profit
double sum = 0;
foreach (Position pos in bt.Positions)
    if (pos.Profit > 0)
        sum += pos.Profit;
bt.Metrics.GrossProfitWinners = sum;

//gross loss
sum = 0;
foreach (Position pos in bt.Positions)
    if (pos.Profit < 0)
        sum += pos.Profit;
bt.Metrics.GrossLossLosers = sum;
```

> **Note:** You can "reuse" Metrics calculated by other Scorecards (such as Basic or Extended). The list of Metric names can be found in the Preferences dialog > Metric Columns tab. This allows you to build derivative Metrics, combine various Metrics, and save effort in recreating them.

## Performance Metrics Report

### public abstract void LayoutMetricsReport(IMetricsReportHost reportHost)
WL8 calls this method when compiling a performance metrics report (e.g., in the Metrics Report Performance Visualizer). Override this method to compose the report using the `IMetricsReportHost` methods.

Example from the Basic ScoreCard:
```csharp
reportHost.AddHeader("Summary");
reportHost.AddMetricDouble("Profit", true, false);
reportHost.AddMetricDouble("ProfitPct", true, true);
reportHost.AddMetricDouble("ProfitPerBar", true, false);
reportHost.AddMetricDouble("APR", true, true, 2, "APR");
reportHost.AddMetricDouble("Exposure", false, true);
reportHost.AddMetricDouble("Alpha", false, false, 2, "Alpha (α)");
reportHost.AddMetricDouble("Beta", false, false, 2, "Beta (β)");
reportHost.AddMetricDouble("SharpeRatio", false, false);
reportHost.AddMetricDouble("SortinoRatio", false, false);
reportHost.AddMetricDouble("WLScore", false, false, 2, "WL Score");
reportHost.AddSeparator();
```

### public override string GetMetricTip(string itemName)
WL8 calls this method to determine what tooltip hint (if any) to display when a user clicks on a Performance Metric in the Metrics Report.

## Metrics in Optimizations

### public virtual int GetMetricValueDirection(string itemName)
WL8 calls this method to determine if a Performance Metric's value is "better" when:
- Higher (returns 1): Examples include NetProfit, APR, SharpeRatio
- Lower (returns -1): Examples include Beta, MarginInterest

The default return value is 1, so override this and return -1 for Metrics that are "better" when lower.

### public virtual List<string> OptimizableMetricNames
Returns a List of Performance Metric names that are exposed to optimizations. The default implementation includes Metrics of type int or double. Override this method for more specific control over which Metrics are exposed to optimizations.

### public abstract string DefaultMetricName
Return the name of the Performance Metric that should appear when your ScoreCard is first selected in an optimization context.

## Example Implementation

Below is a simple example of a custom ScoreCard that calculates basic risk metrics:

```csharp
public class RiskMetricsScoreCard : ScoreCardBase
{
    public override string Name => "Risk Metrics";

    public override List<string> MetricNames => new List<string>
    {
        "MaxDrawdown",
        "MaxDrawdownPct",
        "RiskAdjustedReturn",
        "ValueAtRisk"
    };

    public override void Initialize(Backtester bt)
    {
        // Calculate maximum drawdown
        double maxDD = 0;
        double maxDDPct = 0;
        double peak = bt.EquityCurve[0];
        
        for (int i = 1; i < bt.EquityCurve.Count; i++)
        {
            if (bt.EquityCurve[i] > peak)
                peak = bt.EquityCurve[i];
            else
            {
                double dd = peak - bt.EquityCurve[i];
                double ddPct = dd / peak * 100;
                if (dd > maxDD) maxDD = dd;
                if (ddPct > maxDDPct) maxDDPct = ddPct;
            }
        }

        bt.Metrics.MaxDrawdown = maxDD;
        bt.Metrics.MaxDrawdownPct = maxDDPct;

        // Calculate risk-adjusted return
        double returns = bt.Metrics.APR;
        double volatility = bt.Metrics.Volatility;
        bt.Metrics.RiskAdjustedReturn = returns / volatility;

        // Calculate Value at Risk (95% confidence)
        double var = CalculateValueAtRisk(bt.EquityCurve, 0.95);
        bt.Metrics.ValueAtRisk = var;
    }

    public override void LayoutMetricsReport(IMetricsReportHost reportHost)
    {
        reportHost.AddHeader("Risk Metrics");
        reportHost.AddMetricDouble("MaxDrawdown", true, false, 2, "Maximum Drawdown ($)");
        reportHost.AddMetricDouble("MaxDrawdownPct", true, true, 2, "Maximum Drawdown (%)");
        reportHost.AddMetricDouble("RiskAdjustedReturn", false, false, 2, "Risk-Adjusted Return");
        reportHost.AddMetricDouble("ValueAtRisk", true, false, 2, "Value at Risk (95%)");
        reportHost.AddSeparator();
    }

    public override string GetMetricTip(string itemName)
    {
        switch (itemName)
        {
            case "MaxDrawdown":
                return "The largest peak-to-trough decline in portfolio value";
            case "MaxDrawdownPct":
                return "The largest peak-to-trough decline as a percentage";
            case "RiskAdjustedReturn":
                return "Annual return divided by annual volatility";
            case "ValueAtRisk":
                return "Maximum expected loss at 95% confidence level";
            default:
                return null;
        }
    }

    public override int GetMetricValueDirection(string itemName)
    {
        // All risk metrics are better when lower
        return -1;
    }

    public override string DefaultMetricName => "RiskAdjustedReturn";

    private double CalculateValueAtRisk(TimeSeries equity, double confidence)
    {
        // Implement VaR calculation
        // This is a simplified example
        return 0.0;
    }
} 