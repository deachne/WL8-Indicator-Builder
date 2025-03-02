# UserStrategyBase Class

**Namespace:** WealthLab.Backtest  
**Parent:** StrategyBase

The `UserStrategyBase` class is the foundational class for creating custom trading strategies in WealthLab 8. It provides a comprehensive framework for implementing trading logic, managing positions, and controlling backtesting behavior.

## Overview

When developing a trading strategy in WealthLab, you create a custom class that inherits from `UserStrategyBase`. This class allows you to define:
- Strategy initialization logic
- Trade entry and exit conditions
- Position management
- Chart annotations and visualizations

## Key Methods

### Initialization and Execution

#### Initialize
```csharp
public virtual void Initialize(BarHistory bars)
```
Called once before the backtesting process begins for each symbol. Use this method to:
- Create indicators
- Set up strategy-specific objects
- Perform one-time setup tasks

**Example:**
```csharp
public override void Initialize(BarHistory bars)
{
    // Create indicators
    RSI rsi = RSI.Series(bars.Close, 14);
    EMA ema = EMA.Series(bars.Close, 50);
    
    // Plot indicators
    PlotIndicator(rsi);
    PlotIndicator(ema);
}
```

#### Execute
```csharp
public abstract void Execute(BarHistory bars, int idx)
```
Called for each bar during the backtesting process. This is where you implement your trading logic, including:
- Entry conditions
- Exit conditions
- Position management

**Example:**
```csharp
public override void Execute(BarHistory bars, int idx)
{
    // Trading logic
    if (rsi[idx] < 30 && !HasOpenPosition(bars, PositionType.Long))
    {
        Buy();
    }
    
    if (rsi[idx] > 70 && HasOpenPosition(bars, PositionType.Long))
    {
        SellAll();
    }
}
```

### Trading Methods

#### PlaceTrade
```csharp
public Transaction PlaceTrade(BarHistory bars, TransactionType transType, OrderType orderType, double price = 0)
```
Simulates placing a trade with specified parameters:
- `bars`: Current bar history
- `transType`: Buy, Sell, Short, or Cover
- `orderType`: Market, Limit, or Stop
- `price`: Optional order price for limit/stop orders

#### ClosePosition
```csharp
public void ClosePosition(Position pos, OrderType orderType, double price = 0)
```
Closes a specific open position with given order type and optional price.

### Chart Annotation Methods

#### DrawBarAnnotation
```csharp
public void DrawBarAnnotation(string text, int bar, bool aboveBar, WLColor color)
```
Adds text annotations to specific bars on the chart.

#### DrawDot
```csharp
public void DrawDot(int bar, double value, WLColor color, int radius)
```
Draws a colored dot at a specific location on the chart.

## Position Management

### Open Position Methods
- `HasOpenPosition(BarHistory bars, PositionType pt)`: Check for open positions
- `GetOpenPositions()`: Retrieve list of open positions
- `LastOpenPosition`: Access the most recently opened position

### Position Sizing
- Controlled through Strategy Settings
- Can be customized using `PlaceTrade` with custom quantity

## Backtesting Lifecycle Methods

### BacktestBegin
```csharp
public virtual void BacktestBegin()
```
Called before backtesting starts, useful for global initialization.

### BacktestComplete
```csharp
public virtual void BacktestComplete()
```
Called after backtesting completes, useful for final analysis or reporting.

## Best Practices

1. **Performance**: Minimize computational complexity in `Execute()`
2. **Indicators**: Create indicators in `Initialize()`
3. **Position Management**: Use built-in methods for trade execution
4. **Error Handling**: Implement robust entry/exit conditions
5. **Visualization**: Use chart annotation methods for strategy insights

## Example Strategy

```csharp
public class RSIMomentumStrategy : UserStrategyBase
{
    private RSI rsi;
    private EMA ema;

    public override void Initialize(BarHistory bars)
    {
        rsi = RSI.Series(bars.Close, 14);
        ema = EMA.Series(bars.Close, 50);

        PlotIndicator(rsi);
        PlotIndicator(ema);
    }

    public override void Execute(BarHistory bars, int idx)
    {
        if (idx < rsi.Count - 1) return;

        // Long entry
        if (rsi[idx] < 30 && bars.Close[idx] > ema[idx] && !HasOpenPosition(bars, PositionType.Long))
        {
            Buy();
            DrawDot(idx, bars.Low[idx], WLColor.Green, 5);
        }

        // Exit conditions
        if ((rsi[idx] > 70 || bars.Close[idx] < ema[idx]) && HasOpenPosition(bars, PositionType.Long))
        {
            SellAll();
            DrawDot(idx, bars.High[idx], WLColor.Red, 5);
        }
    }
}
```

## Notes

- Inherit from `UserStrategyBase` to create custom strategies
- Override `Initialize()` and `Execute()` methods
- Use built-in methods for trade management
- Leverage chart annotation methods for strategy visualization

## Performance Considerations

- Optimize indicator calculations
- Minimize complex logic in `Execute()`
- Use built-in WealthLab methods for efficiency 