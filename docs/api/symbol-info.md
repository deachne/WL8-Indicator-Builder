# SymbolInfo Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `SymbolInfo` class represents comprehensive information about a single tradable instrument. It provides detailed metadata about a symbol, which is crucial for accurate backtesting, especially in futures trading modes.

## Overview

`SymbolInfo` instances can be:
- Created within a Historical Data Provider
- Defined in WealthLab's Markets & Symbols tool
- Used to provide precise trading instrument details

## Properties

### DisplayDecimals
```csharp
public int DisplayDecimals
```
Specifies the number of decimal places to use when displaying values for this symbol.

**Example:**
```csharp
// For a stock trading at $123.4567, different DisplayDecimals settings
int decimals = symbolInfo.DisplayDecimals;
// If 2: displays as 123.46
// If 4: displays as 123.4567
```

### Margin
```csharp
public double Margin
```
Represents the funds required to maintain a single share or contract position.

**Notes:**
- Used only when Futures Mode is enabled
- Critical for accurate futures trading simulations

### Market
```csharp
public MarketDetails Market
```
Contains the market details for the symbol, represented by a `MarketDetails` instance.

### PointValue
```csharp
public double PointValue
```
Describes the base currency value gained when a single share or contract moves up one point.

**Notes:**
- Used only in Futures Mode
- Essential for calculating precise futures trading gains/losses

### QuantityDecimals
```csharp
public int QuantityDecimals
```
Specifies the number of decimal places used when representing position quantities.

**Example:**
```csharp
// Determines precision of share/contract quantities
int qtyDecimals = symbolInfo.QuantityDecimals;
// If 0: 100 shares
// If 2: 100.00 shares
```

### Symbol
```csharp
public string Symbol
```
The unique identifier for the trading instrument.

**Examples:**
- Stocks: "MSFT" (Microsoft Corporation)
- Futures: "ES" (E-mini S&P 500 Futures)
- Forex: "EURUSD" (Euro/US Dollar)

### TickSize
```csharp
public double TickSize
```
Represents the minimum price granularity for the symbol.

**Notes:**
- Used only in Futures Mode
- Determines the smallest price increment possible

## Usage Examples

### Basic Symbol Information Retrieval
```csharp
public class SymbolInfoAnalyzer
{
    public void DisplaySymbolDetails(SymbolInfo symbolInfo)
    {
        Console.WriteLine($"Symbol: {symbolInfo.Symbol}");
        Console.WriteLine($"Market: {symbolInfo.Market.Name}");
        Console.WriteLine($"Display Decimals: {symbolInfo.DisplayDecimals}");
        Console.WriteLine($"Point Value: {symbolInfo.PointValue}");
        
        if (symbolInfo.Market.IsFuturesMarket)
        {
            Console.WriteLine($"Margin: {symbolInfo.Margin}");
            Console.WriteLine($"Tick Size: {symbolInfo.TickSize}");
        }
    }
}
```

### Futures Trading Simulation
```csharp
public class FuturesTradeSimulator
{
    public double CalculateProfitLoss(
        SymbolInfo symbolInfo, 
        double entryPrice, 
        double exitPrice, 
        int quantity)
    {
        // Precise calculation considering point value
        double pointMove = exitPrice - entryPrice;
        double profitLoss = pointMove * symbolInfo.PointValue * quantity;
        
        return profitLoss;
    }
}
```

## Best Practices

1. **Accuracy**
   - Always verify symbol details before trading
   - Keep symbol information up-to-date
   - Use market-specific configurations

2. **Futures Trading**
   - Pay special attention to Margin, PointValue, and TickSize
   - Understand how these properties impact trading simulations

3. **Display and Quantity Formatting**
   - Use `DisplayDecimals` and `QuantityDecimals` for consistent presentation
   - Ensure proper decimal handling in trading algorithms

## Performance Considerations

- `SymbolInfo` instances are typically lightweight
- Cache and reuse instances when possible
- Minimize repeated property access in performance-critical code

## Notes

- Critical for accurate backtesting and trading simulations
- Provides instrument-specific trading metadata
- Supports both equity and futures trading modes 