# StrategyRunner Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object

The `StrategyRunner` class provides a simplified and flexible approach to running strategy backtests, optimizations, and performance analysis in WealthLab 8.

## Overview

`StrategyRunner` serves as a powerful utility for:
- Running strategy backtests
- Performing parameter optimizations
- Collecting and analyzing performance metrics
- Supporting both manual and automated strategy evaluation

## Properties

### BacktestSettings
```csharp
public BacktestSettings BacktestSettings
```
Configures the settings used during the backtest, including commission, slippage, and other simulation parameters.

### BenchmarkData
```csharp
public BarHistory BenchmarkData
```
Specifies the historical data for benchmark comparison. Used for calculating performance metrics like Alpha and Beta.

### BenchmarkSymbol
```csharp
public string BenchmarkSymbol
```
Defines the symbol to use for benchmark backtesting if `BenchmarkData` is not provided.

### Data
```csharp
public List<BarHistory> Data
```
Contains the historical data sources for backtesting when no DataSet or Symbols are specified.

### DataRange
```csharp
public DataRange DataRange
```
Determines the date range for the backtest. Default is the most recent 10 years.

### DataSet
```csharp
public DataSet DataSet
```
Specifies the DataSet to use as the data source for backtesting.

### PositionSize
```csharp
public PositionSize PositionSize
```
Configures the position sizing method for the backtest. Default is 10% of equity.

### Scale
```csharp
public HistoryScale Scale
```
Sets the data frequency for the backtest. Default is Daily.

### Symbols
```csharp
public List<string> Symbols
```
List of symbols to use for backtesting when no DataSet is specified.

## Methods

### RunBacktest
```csharp
public Backtester RunBacktest(string strategyName)
public Backtester RunBacktest(StrategyBase sb)
```
Executes a backtest for a specified strategy.

**Overloads:**
- By strategy name
- By `StrategyBase` instance

**Data Source Priority:**
1. DataSet symbols
2. Symbols list
3. Manually provided Data

**Returns:** A `Backtester` instance with performance metrics

### PerformOptimization
```csharp
public OptimizationResultList PerformOptimization(
    string optMethod, 
    string stratName, 
    OptimizationRunComplete runComplete = null
)
public OptimizationResultList PerformOptimization(
    string optMethod, 
    Strategy s, 
    OptimizationRunComplete runComplete = null
)
```
Performs strategy parameter optimization.

**Parameters:**
- `optMethod`: Optimization method name
- `stratName` or `s`: Strategy to optimize
- `runComplete`: Optional callback method for run completion tracking

**Returns:** `OptimizationResultList` containing optimization results

## Usage Examples

### Basic Backtest
```csharp
public class StrategyTester
{
    public void TestStrategy()
    {
        // Create StrategyRunner
        var runner = new StrategyRunner
        {
            // Configure backtest settings
            BacktestSettings = new BacktestSettings 
            { 
                CommissionAmount = 5.0, 
                CommissionType = CommissionTypes.Flat 
            },
            
            // Set data source
            DataSet = DataSetFactory.GetDataSet("MyMarketData"),
            
            // Configure position sizing
            PositionSize = new PositionSize 
            { 
                PositionSizeType = PositionSizeType.PctOfEquity, 
                Amount = 0.1 // 10% of equity
            },
            
            // Set benchmark
            BenchmarkSymbol = "SPY",
            
            // Set backtest range
            DataRange = new DataRange(
                DateTime.Now.AddYears(-5), 
                DateTime.Now
            )
        };

        // Run backtest
        var backtester = runner.RunBacktest("MyTradingStrategy");

        // Analyze results
        Console.WriteLine($"Net Profit: {backtester.Metrics["NetProfit"]}");
        Console.WriteLine($"Sharpe Ratio: {backtester.Metrics["SharpeRatio"]}");
    }
}
```

### Optimization Example
```csharp
public class StrategyOptimizer
{
    public void OptimizeStrategy()
    {
        var runner = new StrategyRunner
        {
            DataSet = DataSetFactory.GetDataSet("TechStocks"),
            Scale = new HistoryScale(Frequency.Daily)
        };

        // Perform optimization with progress tracking
        var results = runner.PerformOptimization(
            "Grid", 
            "RSIStrategy", 
            (result, progress) => 
            {
                Console.WriteLine($"Optimization Progress: {progress}%");
                Console.WriteLine($"Net Profit: {result.PerformanceMetrics["NetProfit"]}");
            }
        );

        // Analyze top results
        var bestResult = results
            .OrderByDescending(r => r.PerformanceMetrics["NetProfit"])
            .First();

        Console.WriteLine("Best Strategy Parameters:");
        for (int i = 0; i < bestResult.ParameterValues.Count; i++)
        {
            Console.WriteLine($"P{i}: {bestResult.ParameterValues[i]}");
        }
    }
}
```

### Multi-Symbol Backtest
```csharp
public class MultiSymbolTester
{
    public void TestMultipleSymbols()
    {
        var runner = new StrategyRunner
        {
            Symbols = new List<string> { "AAPL", "GOOGL", "MSFT" },
            Scale = new HistoryScale(Frequency.Daily)
        };

        var backtester = runner.RunBacktest("MultiSymbolStrategy");

        // Analyze aggregate performance
        Console.WriteLine($"Total Net Profit: {backtester.Metrics["NetProfit"]}");
    }
}
```

## Best Practices

1. **Data Source Management**
   - Prefer using DataSets for organized data
   - Manually manage symbols and data when needed
   - Ensure data quality and consistency

2. **Backtest Configuration**
   - Set realistic commission and slippage
   - Use appropriate position sizing
   - Consider transaction costs

3. **Optimization Strategies**
   - Use multiple performance metrics
   - Avoid overfitting
   - Validate results with out-of-sample testing

## Performance Considerations

- Large datasets can consume significant memory
- Optimize data loading and processing
- Consider parallel processing for complex optimizations
- Monitor system resources during long-running tests

## Caution

🔍 Backtesting and optimization results do not guarantee future performance:
- Market conditions change
- Past performance is not predictive
- Always validate strategies through comprehensive testing 🔍

## Requirements

- Deep understanding of trading strategy development
- Proficiency in performance metric analysis
- Knowledge of historical market data management

## Notes

- Provides a flexible framework for strategy evaluation
- Supports complex backtesting scenarios
- Enables data-driven strategy refinement 