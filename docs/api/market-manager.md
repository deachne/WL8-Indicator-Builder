# MarketManager Class

**Namespace:** WealthLab.Core  
**Type:** Static Class

The `MarketManager` is a static utility class that manages market and symbol information in WealthLab. It maintains collections of `MarketDetails` and `SymbolInfo` instances, providing information about various markets (US stocks, Forex, Cryptocurrencies) and their associated symbols. This class is primarily intended for developers of custom Historical Data Provider adapters.

## Market Management

### Markets
```csharp
public static List<MarketDetails> Markets
```
Returns a list containing all installed market instances (`MarketDetails` class) in the system.

### AddMarket
```csharp
public static MarketDetails AddMarket(MarketDetails md)
```
Installs a custom market (instance of `MarketDetails`) into the platform.

### FindMarket
```csharp
public static MarketDetails FindMarket(string name)
```
Searches for a market by name and returns the matching `MarketDetails` instance, or null if not found.

## Symbol Management

### Symbols
```csharp
public static List<SymbolInfo> Symbols
```
Returns a list of `SymbolInfo` instances representing all symbol-specific information installed in the system.

### AddSymbol
```csharp
public static SymbolInfo AddSymbol(SymbolInfo si)
```
Installs symbol-specific information into the platform (e.g., market association, decimal positions).

### FindSymbol
```csharp
public static SymbolInfo FindSymbol(string symbol)
```
Searches for a specific symbol and returns the matching `SymbolInfo` instance, or null if not found.

## Holiday Management

### HolidaySetNames
```csharp
public static List<string> HolidaySetNames
```
Returns a list of all Holiday Sets installed on the platform. A Holiday Set is a named collection of dates containing holiday dates for a particular market.

### HolidaySets
```csharp
public static Dictionary<string, List<DateTime>> HolidaySets
```
Returns a dictionary of Holiday Sets keyed by name, where each set is a list of dates representing market holidays.

### RegisterHolidaySet
```csharp
public static List<DateTime> RegisterHolidaySet(string holidaySetName, string holidays)
```
Installs a new Holiday Set into the platform.

## Predefined Markets

### UsaStocks
```csharp
public static MarketDetails UsaStocks
```
Returns the `MarketDetails` instance representing the US stock market.

### Currencies
```csharp
public static MarketDetails Currencies
```
Returns the `MarketDetails` instance representing the currencies Forex market.

## Usage Examples

### Creating a Custom Market Provider
```csharp
public class CustomMarketProvider : ProviderBase
{
    public void InstallMarkets()
    {
        // Create and install a new market
        var cryptoMarket = new MarketDetails
        {
            Name = "Crypto Market",
            BaseTimeZone = "UTC",
            BenchmarkSymbol = "BTC.USD"
        };
        
        MarketManager.AddMarket(cryptoMarket);
        
        // Register market holidays
        string holidays = "2024-01-01,2024-12-25"; // CSV format
        MarketManager.RegisterHolidaySet("Crypto Holidays", holidays);
        
        // Add symbols to the market
        var btcSymbol = new SymbolInfo
        {
            Symbol = "BTC.USD",
            Market = cryptoMarket,
            DisplayDecimals = 2
        };
        
        MarketManager.AddSymbol(btcSymbol);
    }
}
```

### Market and Symbol Lookup
```csharp
public class MarketAnalyzer
{
    public void AnalyzeMarket(string symbol)
    {
        // Find symbol information
        var symbolInfo = MarketManager.FindSymbol(symbol);
        if (symbolInfo == null)
        {
            Console.WriteLine($"Symbol {symbol} not found");
            return;
        }
        
        // Get associated market
        var market = symbolInfo.Market;
        
        // Check if market is open
        if (market.IsOpenNow)
        {
            // Check for holidays
            var holidays = MarketManager.HolidaySets[market.Name];
            if (holidays.Contains(DateTime.Today))
            {
                Console.WriteLine("Market is closed for holiday");
                return;
            }
            
            // Perform analysis
            AnalyzeSymbol(symbolInfo);
        }
    }
}
```

### Holiday Set Management
```csharp
public class HolidayManager
{
    public void SetupHolidays()
    {
        // Create US market holidays
        string usHolidays = string.Join(",", new[]
        {
            "2024-01-01", // New Year's Day
            "2024-01-15", // Martin Luther King Jr. Day
            "2024-02-19", // Presidents' Day
            "2024-03-29", // Good Friday
            "2024-05-27", // Memorial Day
            "2024-07-04", // Independence Day
            "2024-09-02", // Labor Day
            "2024-11-28", // Thanksgiving Day
            "2024-12-25"  // Christmas Day
        });
        
        // Register holiday set
        MarketManager.RegisterHolidaySet("US Market Holidays", usHolidays);
        
        // Verify registration
        var holidaySets = MarketManager.HolidaySets;
        foreach (var set in holidaySets)
        {
            Console.WriteLine($"Holiday Set: {set.Key}");
            foreach (var date in set.Value)
            {
                Console.WriteLine($"  {date:d}");
            }
        }
    }
}
```

## Best Practices

1. **Market Management**
   - Create comprehensive market definitions
   - Include all necessary trading parameters
   - Maintain accurate time zone information

2. **Symbol Management**
   - Keep symbol information up to date
   - Handle symbol changes and delistings
   - Maintain accurate decimal places

3. **Holiday Management**
   - Update holiday sets annually
   - Include partial trading days
   - Verify holiday dates accuracy

4. **Error Handling**
   - Check for null returns from Find methods
   - Validate market and symbol relationships
   - Handle missing holiday sets

## Notes

- Changes persist across WealthLab sessions
- Market and symbol information affects trading behavior
- Holiday sets influence trading calendar calculations
- Consider international market differences 