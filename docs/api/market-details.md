# MarketDetails Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `MarketDetails` class contains information about a market, such as the US Stock Market or Cryptocurrency markets. Historical Data Providers in WealthLab can create `MarketDetails` instances and assign them to symbols, or you can make such assignments using the Markets & Symbols tool.

## Core Properties

### BaseTimeZone
```csharp
public string BaseTimeZone
```
Contains the time zone that the market trades in. The string is compatible with Windows time zone ID values.

### BenchmarkSymbol
```csharp
public string BenchmarkSymbol
```
Contains a suggested symbol to use as a benchmark for backtest comparisons (e.g., "SPY" for US Stocks, "BTC.USD" for Cryptocurrencies).

### DisplayDecimals
```csharp
public int DisplayDecimals
```
Contains the number of decimal places to use when displaying price data for the market.

### Name
```csharp
public string Name
```
Contains the name of the market.

### QuantityDecimals
```csharp
public int QuantityDecimals
```
Contains the number of decimal places to use when calculating the number of shares or contracts for a position.

## Market Hours Methods

### GetHoursLocalTime
```csharp
public MarketHours GetHoursLocalTime(DateTime dt)
```
Returns the market hours in the market's time zone for the specified date in the local time zone.

### GetHoursMarketTime
```csharp
public MarketHours GetHoursMarketTime(DateTime dt)
```
Returns the market hours in the market's time zone for the specified date.

## Market Status Methods

### IsOpenNow
```csharp
public bool IsOpenNow
```
Determines if the market is currently open based on system time, time zone, and market hours.

### IsPostMarket
```csharp
public bool IsPostMarket
```
Determines if the current time is considered "post-market close".

### IsPreMarket
```csharp
public bool IsPreMarket
```
Determines if the current time is considered "pre-market open".

### IsTradingDay
```csharp
public bool IsTradingDay(DateTime dt)
```
Returns true if the specified date is an active trading day in this market.

## Trading Calendar Properties

### HolidayDates
```csharp
public List<DateTime> HolidayDates
```
A list of dates representing market holidays when the market would normally be open but is closed.

### TradingDaysOfWeek
```csharp
public List<DayOfWeek> TradingDaysOfWeek
```
Contains `DayOfWeek` values representing the days when this market is open for trading.

## Symbol Management

### GetSecurityName
```csharp
public string GetSecurityName(string symbol)
```
Returns the security name of the specified symbol, if available.

### SymbolMapping
```csharp
public Dictionary<string, string> SymbolMapping
```
A Dictionary that data provider creators can use to map symbols to their security names.

## Market Creation Methods

### Clone
```csharp
public MarketDetails Clone()
```
Creates a new `MarketDetails` instance that copies all properties of this market.

### SpecifyMarketHours
```csharp
public void SpecifyMarketHours(int dayOfWeek, TimeSpan mktOpen, TimeSpan mktClose)
```
Specifies market open and close times for a specific day of the week. Use -1 for `dayOfWeek` to set default market hours.

### TradeOnAllDays
```csharp
public void TradeOnAllDays()
```
Configures the market to trade on all days of the week.

### TradeOnWeekdays
```csharp
public void TradeOnWeekdays()
```
Configures the market to trade on weekdays (Monday through Friday).

## Usage Examples

### Creating a Custom Market
```csharp
public class CryptoMarketProvider : ProviderBase
{
    public MarketDetails CreateCryptoMarket()
    {
        var market = new MarketDetails
        {
            Name = "Cryptocurrency Market",
            BaseTimeZone = "UTC",
            BenchmarkSymbol = "BTC.USD",
            DisplayDecimals = 8,
            QuantityDecimals = 8
        };
        
        // Configure for 24/7 trading
        market.TradeOnAllDays();
        market.SpecifyMarketHours(-1, TimeSpan.Zero, TimeSpan.Zero);
        
        return market;
    }
}
```

### Creating a Traditional Stock Market
```csharp
public class StockMarketProvider : ProviderBase
{
    public MarketDetails CreateUSStockMarket()
    {
        var market = new MarketDetails
        {
            Name = "US Stock Market",
            BaseTimeZone = "Eastern Standard Time",
            BenchmarkSymbol = "SPY",
            DisplayDecimals = 2,
            QuantityDecimals = 0
        };
        
        // Configure trading days and hours
        market.TradeOnWeekdays();
        market.SpecifyMarketHours(-1, 
            TimeSpan.FromHours(9.5),  // 9:30 AM
            TimeSpan.FromHours(16));   // 4:00 PM
            
        // Add market holidays
        market.HolidayDates.AddRange(new[]
        {
            new DateTime(2024, 1, 1),   // New Year's Day
            new DateTime(2024, 1, 15),  // Martin Luther King Jr. Day
            // Add other holidays...
        });
        
        return market;
    }
}
```

### Market Status Checking
```csharp
public class MarketMonitor
{
    private MarketDetails _market;
    
    public void CheckMarketStatus()
    {
        if (_market.IsPreMarket)
        {
            Console.WriteLine("Market is in pre-market hours");
        }
        else if (_market.IsOpenNow)
        {
            Console.WriteLine("Market is open for trading");
        }
        else if (_market.IsPostMarket)
        {
            Console.WriteLine("Market is in post-market hours");
        }
        else
        {
            Console.WriteLine("Market is closed");
        }
    }
    
    public bool CanTrade(DateTime date)
    {
        return _market.IsTradingDay(date) && 
               !_market.HolidayDates.Contains(date.Date);
    }
}
```

## Best Practices

1. **Market Hours Configuration**
   - Always specify default hours using -1 for dayOfWeek
   - Consider time zone differences in calculations
   - Handle special trading sessions appropriately

2. **Holiday Management**
   - Keep holiday list updated
   - Consider partial trading days
   - Handle holiday adjustments for different years

3. **Symbol Management**
   - Maintain accurate symbol mappings
   - Update security names regularly
   - Handle symbol changes and delistings

4. **Time Zone Handling**
   - Use correct Windows time zone IDs
   - Consider daylight saving time transitions
   - Handle international market differences

## Notes

- Market details persist across WealthLab sessions
- Time zones must match Windows time zone IDs
- Holiday dates should be updated annually
- Consider extended hours trading where applicable 