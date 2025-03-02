# Strategy Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object

The `Strategy` class encapsulates comprehensive information about a trading strategy, including metadata, configuration, and execution parameters used during backtesting.

## 🚨 Important Warning 🚨
**Do not modify a Strategy's Properties in Strategy code. Doing so may cause unexpected behavior and potential issues with your backtesting environment.**

## Strategy Metadata Properties

### Author
```csharp
public string Author
```
Returns the WealthLab username of the Strategy's author.

### LibraryName
```csharp
public string LibraryName
```
Returns the name of the assembly for a compiled strategy.

### FolderName
```csharp
public string FolderName
```
Returns the name of the folder where the strategy was last saved.

### StrategyData
```csharp
public string StrategyData
```
Contains a copy of the strategy code, rules, and other configuration details.

## Backtest Configuration Properties

### Benchmark
```csharp
public string Benchmark
```
Specifies the symbol to use for the comparison benchmark backtest (buy & hold run).

### SingleSymbol
```csharp
public string SingleSymbol
```
The symbol used for a single symbol backtest.

### SingleSymbolMode
```csharp
public bool SingleSymbolMode
```
Indicates whether the strategy was run in single symbol mode (`true`) or portfolio backtest mode (`false`).

### DataSetName
```csharp
public string DataSetName
```
Returns the name of the DataSet selected for a Portfolio Backtest.

### DataRange
```csharp
public DataRange DataRange
```
Returns the date range used for the backtest.

## Position and Risk Management Properties

### PositionSize
```csharp
public PositionSize PositionSize
```
Returns the position sizing method used in the backtest.

### RetainNSF
```csharp
public bool RetainNSF
```
Determines if the strategy should retain Positions with Insufficient Funds.

## Advanced Backtesting Properties

### RunWithPreferredValues
```csharp
public bool RunWithPreferredValues
```
Indicates whether the strategy should be run using Preferred Values from an optimization.

### GranularLimitStopScale
```csharp
public HistoryScale GranularLimitStopScale
```
Returns the intraday scale for granular stop/limit processing.
- If returns `HistoryScale.Daily`, granular processing is disabled
- For intraday scales, enables more precise stop/limit handling

### UpdateGranularData
```csharp
public bool UpdateGranularData
```
Determines if granular data should be updated during the backtest.

## Usage Examples

### Basic Strategy Inspection
```csharp
public class StrategyInspector
{
    public void InspectStrategyDetails(Strategy strategy)
    {
        Console.WriteLine($"Strategy Author: {strategy.Author}");
        Console.WriteLine($"Benchmark Symbol: {strategy.Benchmark}");
        Console.WriteLine($"Backtest Mode: {(strategy.SingleSymbolMode ? "Single Symbol" : "Portfolio")}");
        
        if (strategy.SingleSymbolMode)
        {
            Console.WriteLine($"Test Symbol: {strategy.SingleSymbol}");
        }
        else
        {
            Console.WriteLine($"DataSet: {strategy.DataSetName}");
        }

        // Inspect Position Sizing
        var posSize = strategy.PositionSize;
        Console.WriteLine($"Position Size Type: {posSize.PositionSizeType}");
        Console.WriteLine($"Max Open Positions: {posSize.MaxOpenPositions}");
    }
}
```

### Advanced Backtest Configuration Analysis
```csharp
public class BacktestConfigAnalyzer
{
    public void AnalyzeStrategyConfig(Strategy strategy)
    {
        // Check granular processing settings
        if (strategy.UpdateGranularData)
        {
            var granularScale = strategy.GranularLimitStopScale;
            Console.WriteLine($"Granular Processing Scale: {granularScale.Description}");
        }

        // Analyze date range and optimization settings
        Console.WriteLine($"Backtest Date Range: {strategy.DataRange.StartDate} - {strategy.DataRange.EndDate}");
        Console.WriteLine($"Run with Preferred Values: {strategy.RunWithPreferredValues}");
        
        // Check NSF (Not Sufficient Funds) handling
        if (strategy.RetainNSF)
        {
            Console.WriteLine("Strategy retains positions with insufficient funds");
        }
    }
}
```

## Best Practices

1. **Strategy Inspection**
   - Use properties for metadata and configuration analysis
   - Avoid modifying properties during runtime
   - Treat strategy properties as read-only

2. **Backtest Configuration**
   - Carefully review position sizing and risk management settings
   - Understand the implications of `RetainNSF` and `RunWithPreferredValues`
   - Pay attention to granular processing settings for intraday strategies

3. **Performance Considerations**
   - Be mindful of computational overhead when inspecting strategy properties
   - Use properties judiciously in performance-critical code paths

## Notes

- Provides a comprehensive view of strategy configuration
- Supports both single symbol and portfolio backtesting
- Offers insights into strategy metadata and execution parameters
- Designed for flexible strategy analysis and inspection

## Requirements

- Understanding of WealthLab backtesting concepts
- Familiarity with trading strategy configuration
- Knowledge of position sizing and risk management principles

## Caution

🚨 Modifying strategy properties during execution can lead to unpredictable results and is strongly discouraged. 🚨 