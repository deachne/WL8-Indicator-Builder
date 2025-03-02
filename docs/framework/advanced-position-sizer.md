# Advanced Position Sizer API

This document details the API for building Advanced Position Sizers for Wealth-Lab 8. A Position Sizer calculates the number of shares/contracts for a Transaction during the backtest process. It has access to the current and historical equity/cash levels of the simulation, as well as other information to make position sizing decisions.

## Build Environment

You can create an Advanced Position Sizer in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Advanced Position Sizer will be a class in this library that descends from `PositionSizerBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Backtest` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Advanced Position Sizer, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Descriptive Properties

Override the following properties that provide descriptive details about your Position Sizer and describes how it functions.

### public abstract string Name
Return a descriptive name for your Position Sizer that will be used throughout WL8.

### public virtual string Description
Return a brief description of how your Position Sizer works. This is displayed when the user selects or configures your Position Sizer from the drop down in WL8's Strategy window.

### public virtual bool UsesBasisPrice
Return true if your Position Sizer should allow the user to specify the basis price option (current bar market close or next bar market open) in the position sizing user interface.

### public virtual bool UsesMaxRiskPct
Return true if your Position Sizer calls the Max Risk Percent Sizer so that WealthLab can automatically issue a Stop Loss order at the RiskStopLevel when that Trading Preference is enabled.

### protected virtual void GenerateParameters
If your Position Sizer has Parameters, override this method and create the Parameter instances here, adding them to the Parameters property.

> **Note:** `PositionSizerBase` descends from the `Configurable` base class. See the Configurable class reference for more information about parameters.

## Sizing Positions

### public virtual void Initialize()
WL8 calls this prior to sizing any positions. Override this method to perform any required one-time initialization.

### public abstract double SizePosition(Transaction t, BarHistory bars, int idx, double basisPrice, double equity, double cash)
WL8 calls this method each time it needs to size a position. Parameters:
- `t`: Transaction object representing the trade/signal being processed
- `bars`: BarHistory instance being processed
- `idx`: Current index into the BarHistory instance
- `basisPrice`: Transaction's basis price:
  - For Market orders: Based on user selection (current bar close or next bar open)
  - For Limit/Stop orders: The order price
- `equity`: Current simulated account equity
- `cash`: Available cash value

Your Position Sizer should use these parameters and required properties to calculate and return a position size.

## Simulation Related Properties

### public TimeSeries EquityCurve
A TimeSeries instance representing the simulated equity curve. This property and other TimeSeries properties are updated only to the point in time that the trade signal was made in the simulation.

### public TimeSeries CashCurve
A TimeSeries instance representing the available cash in the simulation.

### public TimeSeries DrawdownCurve
A TimeSeries instance representing the drawdown of the simulation (largest peak to trough decline in the simulation's equity curve, calculated on a closing price basis).

### public TimeSeries DrawdownPctCurve
A TimeSeries instance representing the percentage drawdown of the simulation.

### public List<Transaction> Orders
A List of Transaction instances containing orders already sized and processed on this bar, including both entries and exits.

### public List<Position> OpenPositions
A List of Position objects containing currently open positions in the simulation.

### public List<Position> ClosedPositions
A List of Position objects containing closed positions in the simulation.

### public List<Position> Positions
A List of Position objects containing all positions (open and closed) in the simulation.

### public List<Transaction> Candidates
A List of Transaction instances containing all entry signals being processed (sized) on this bar of the simulation.

## Helper Methods

### public double CalculatePositionSize(PositionSizeTypes pst, double value, BarHistory bars, double basisPrice, double equity, int? idx)
Calculates position size based on standard types:
- `Dollar`: Fixed dollar (or base currency) amount specified in the value parameter
- `Quantity`: Fixed number of shares/contracts specified in the value parameter
- `PctOfEquity`: Percentage of current simulated equity specified in the value parameter

You'll typically call this helper method from within the implementation of the SizePosition method, passing the idx parameter value from SizePosition.

### public bool UseFuturesMode(BarHistory bars)
Returns true if Futures Mode should be used for the specified BarHistory instance. When true, your Position Sizer can use:
- `PointValue`
- `Margin`
- `TickSize` properties from `bars.SymbolInfo`

Example futures mode calculation:
```csharp
if (FuturesMode)
   return 10000 / bars.SymbolInfo.Margin;
else
   return 10000 / basisPrice;
```

## BasicPositionSizer

For standard position sizing approaches, derive from `BasicPositionSizer` instead of `PositionSizerBase`. It provides:

1. Two pre-configured parameters:
   - Position Size Type (StringChoice with 3 options)
   - Amount (Double)

2. Implemented methods:
   - Initialize: Reads user-configured parameter values
   - SizePosition: Uses standard calculation logic

Example implementation:
```csharp
public override double SizePosition(Transaction t, BarHistory bars, int idx, double basisPrice, double equity, double cash)
{
    return CalculatePositionSize(_posSizeType, _amount, bars, basisPrice, equity);
}
```

## Example Implementation

Below is a complete implementation of the Max Entries per Bar Position Sizer:

```csharp
using System.Linq;
using WealthLab.Core;

namespace WealthLab.Backtest
{
    //A PosSizer that allows only a maximum number of entries per bar of data
    public class MaxEntriesPerBar : BasicPositionSizer
    {
        //add parameter to control how many entries per day
        public override void GenerateParameters()
        {
            base.GenerateParameters();
            Parameters.Add(new Parameter("Max Entries", ParameterType.Int32, 2, 1.0, 999999999.0));
            Parameters.Add(new Parameter("For intraday trades, sum up positions opened during the day", 
                ParameterType.Boolean, false));
        }

        //Name
        public override string Name => "Max Entries per Bar";

        //description
        public override string Description => 
            "Provides the basic Position Sizing options, with the additional ability to limit " +
            "the number of entries taken on each bar (or day) of data.";

        //initialize
        public override void Initialize()
        {
            base.Initialize();
            _maxEntries = Parameters[2].AsInt;
            _considerIntraday = Parameters[3].AsBoolean;
        }

        //Size the position, if max entries exceeded, set size to zero
        public override double SizePosition(Transaction t, BarHistory bars, int idx, 
            double basisPrice, double equity, double cash)
        {
            int count = 0;

            if (!_considerIntraday)
            {
                foreach (Transaction o in Orders)
                    if (o.TransactionType.IsEntry())
                        count++;
            }
            else
            {
                if (t.Bars.Scale.IsIntraday)
                {
                    var positionsInSymbolOpenedToday = Positions.AsParallel().AsOrdered().Reverse()
                        .TakeWhile(p => p.EntryDate.DayOfYear == t.EntryDate.DayOfYear && 
                                      p.Symbol == t.Symbol);
                    count += positionsInSymbolOpenedToday.Count();
                }
            }
            
            if (count >= _maxEntries)
                return 0.0;
            else
                return base.SizePosition(t, bars, idx, basisPrice, equity, cash);
        }

        //private members
        private int _maxEntries;
        private bool _considerIntraday;
    }
}
``` 