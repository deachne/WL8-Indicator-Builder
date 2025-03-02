# BarHistory Class

**Namespace:** WealthLab.Core  
**Parent:** TimeSeriesBase

The BarHistory class represents historical price and volume data for a market. When you work with code-based Strategies, you're passed an instance of a BarHistory object in the Initialize, Execute, and other methods. This instance contains the historical data your Strategy should backtest.

A "bar" of data contains an open price, a high, low and closing price. The BarHistory class exposes these through Open, High, Low, and Close properties, each of which is an instance of the TimeSeries class. Volume information is available via the Volume property, also a TimeSeries instance. Use the DateTimes property to access the list of DateTimes that these time series are keyed off of.

## Constructors

```csharp
public BarHistory(string symbol, HistoryScale scale)
public BarHistory(string symbol, Frequency scale)
public BarHistory(BarHistory parent)
```

BarHistory has three constructors:
- First assigns the Symbol and Scale based on the passed parameters
- Second assigns the Symbol and creates a HistoryScale instance based on the passed Frequency enum value
- Third takes a BarHistory as a parameter (parent), and assigns the various property values from that instance

## Alternate Price Components

### AveragePriceHL
```csharp
public TimeSeries AveragePriceHL
```
Calculates and returns the average price TimeSeries (high + low) / 2.

### AveragePriceHLC
```csharp
public TimeSeries AveragePriceHLC
```
Calculates and returns the average price TimeSeries (high + low + close) / 3.

### AveragePriceHLCC
```csharp
public TimeSeries AveragePriceHLCC
```
Calculates and returns the average price TimeSeries (high + low + close + close) / 4.

### AveragePriceOC
```csharp
public TimeSeries AveragePriceOC
```
Calculates and returns the average price TimeSeries (open + close) / 2.

### AveragePriceOHLC
```csharp
public TimeSeries AveragePriceOHLC
```
Calculates and returns the average price TimeSeries (open + high + low + close) / 4.

## Event Data

### EventDataPoints
```csharp
public List<EventDataPoint> EventDataPoints
```
Returns a list of EventDataPoint instances that represents the event data loaded with the historical data.

**Note:** For intraday charts EventDataPoints will synchronize to the first bar of the Event Date.

### GetEventDataPoints
```csharp
public List<EventDataPoint> GetEventDataPoints(string name)
public List<EventDataPoint> GetEventDataPoints(string name, int idx)
```
Returns EventDataPoint instances for the specified event name. The idx overload returns events for specific bar number.

**Note:** Event Providers can use the same name string. Use Provider checkboxes or test EventDataPoint.ProviderName to ensure desired Provider.

## Futures Mode

### FuturesMode
```csharp
public bool FuturesMode
```
Set by the backtester, returns true if Futures Mode was enabled for this backtest.

### Margin
```csharp
public double Margin
```
Capital required to open a 1 share/contract position. Used in Futures Mode for position's cost basis.

### PointValue
```csharp
public double PointValue
```
Point value for each 1 point move. In Futures Mode, position's profit is multiplied by this.

### TickSize
```csharp
public double TickSize
```
Minimum resolution for position quantity. Used in Futures Mode for quantity adjustments.

## Core Members

### Add
```csharp
public int Add(DateTime dt, double o, double h, double l, double c, double v)
```
Adds datetime/open/high/low/close/volume values to this BarHistory.

### AddTradingDays
```csharp
public DateTime AddTradingDays(int bar, int days)
```
Returns date after adding specified trading days to the DateTime of the specified bar.

### Cache
```csharp
public ConcurrentDictionary<string, object> Cache
```
Generic cache Dictionary for storing objects during backtest run.

### Close
```csharp
public TimeSeries Close
```
Returns TimeSeries representing closing prices.

### Count
```csharp
public int Count
```
Returns number of items in the time series.

### DateTimes
```csharp
public virtual List<DateTime> DateTimes
```
List of DateTime objects representing date/time of each item.

### DisplayDecimals
```csharp
public int DisplayDecimals
```
Number of decimals places for displaying price data.

### EndDate
```csharp
public DateTime EndDate
```
Returns last DateTime in the DateTimes list (DateTime.MaxValue if empty).

### ExtendedBars
```csharp
public int ExtendedBars
```
Creates projected space along right edge of chart with future date/time values.

### GetNamedSeries
```csharp
public TimeSeries GetNamedSeries(string name)
```
Returns registered "Named TimeSeries" or null.

### GetTimeAsInt
```csharp
public int GetTimeAsInt(int bar)
```
Returns integer value for time of day (e.g., 930 for 9:30 AM).

### HasStreamingBar
```csharp
public bool HasStreamingBar
```
Returns true if BarHistory has streaming bar (for Extension development).

### High
```csharp
public TimeSeries High
```
Returns TimeSeries representing high prices.

### IndexOf
```csharp
public int IndexOf(DateTime dt, bool exactMatchOnly = false)
```
Returns index of specified DateTime in DateTimes list.

### IntradayBarNumber
```csharp
public int IntradayBarNumber
```
Returns intraday bar number of the day (-1 for non-intraday data).

### Low
```csharp
public TimeSeries Low
```
Returns TimeSeries representing low prices.

### Open
```csharp
public TimeSeries Open
```
Returns TimeSeries representing open prices.

### Volume
```csharp
public TimeSeries Volume
```
Returns TimeSeries representing volume data.

## Market Analysis Methods

### IsFirstBarOfDay
```csharp
public bool IsFirstBarOfDay(int idx)
```
Returns true if specified index is first bar of day.

### IsGap
```csharp
public bool IsGap(int bar)
```
Returns true if opening price has gapped up or down.

### IsGapDown
```csharp
public bool IsGapDown(int bar)
```
Returns true if opening price has gapped down (Open < previous Low).

### IsGapUp
```csharp
public bool IsGapUp(int bar)
```
Returns true if opening price has gapped up (Open > previous High).

### IsLastBarOfDay
```csharp
public bool IsLastBarOfDay(int idx)
```
Returns true if specified index is last bar of regular trading session.

### IsLastTradingDayOfMonth
```csharp
public bool IsLastTradingDayOfMonth(int bar)
```
Returns true if bar falls on last trading day of calendar month.

### IsUpToDate
```csharp
public virtual bool IsUpToDate(DateTime endDate)
```
Returns whether historical data is up to date as of specified date.

### NextOptionExpiryDate
```csharp
public DateTime NextOptionExpiryDate(int bar)
```
Returns DateTime of next closest monthly options expiration date.

### TomorrowIsLastTradingDayOfWeek
```csharp
public bool TomorrowIsLastTradingDayOfWeek(int bar)
```
Returns true if next trading day is last trading day of week.

### TradingDaysBetweenDates
```csharp
public int TradingDaysBetweenDates(DateTime dt1, DateTime dt2)
```
Returns number of trading days between specified dates.

### TradingDaysRemaining
```csharp
public int TradingDaysRemaining(int bar, Frequency interval)
```
Returns trading days remaining in specified Frequency interval.

## Data Management

### ReadFromBinaryFile
```csharp
public void ReadFromBinaryFile(string fileName, DateTime startDate, DateTime endDate, int maxBars)
```
Reads binary file in Wealth-Lab 8 supported format.

### WriteToBinaryFile
```csharp
public void WriteToBinaryFile(string fileName)
```
Writes BarHistory to binary file in Wealth-Lab 8 format.

### RemoveAt
```csharp
public void RemoveAt(int idx)
```
Removes data at specified index.

## Properties

### Market
```csharp
public MarketDetails Market
```
Returns MarketDetails instance with market information.

### Scale
```csharp
public HistoryScale Scale
```
Scale of the data being represented.

### SecurityName
```csharp
public string SecurityName
```
Security name if available (e.g., "Apple, Inc.").

### Symbol
```csharp
public string Symbol
```
Symbol being represented (e.g., "MSFT").

### TimeSpan
```csharp
public TimeSpan TimeSpan
```
TimeSpan encompassing DateTimes range.

## User Data

### UserData
```csharp
public object UserData
```
Stores ad-hoc data in BarHistory or TimeSeries instance.

### UserDataAsDouble
```csharp
public double UserDataAsInt
```
Access UserData as double.

### UserDataAsInt
```csharp
public int UserDataAsInt
```
Access UserData as int. 