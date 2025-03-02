# PositionSize Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object

The `PositionSize` class represents the position sizing configuration established for a backtest, providing detailed control over trade sizing and risk management.

## Position Sizing Methods

### PositionSizeType
```csharp
public PositionSizeType PositionSizeType
```
Specifies the position sizing method. Possible values:
- `Dollar`: Fixed currency amount
- `Quantity`: Fixed number of shares/contracts
- `PctOfEquity`: Percentage of current simulated equity
- `MaxRiskPct`: Risks a percentage of current simulated equity based on risk stop level
- `PosSizer`: Uses a custom `PositionSizerBase` instance for advanced sizing

## Sizing Parameters

### Amount
```csharp
public double Amount
```
The amount used for position sizing. Its interpretation depends on the `PositionSizeType`:
- For `Dollar`: Specific dollar amount per trade
- For `Quantity`: Number of shares/contracts
- For `PctOfEquity`: Percentage of equity to allocate
- For `MaxRiskPct`: Maximum risk percentage

### StartingCapital
```csharp
public double StartingCapital
```
The initial capital used for the backtest.

### MarginFactor
```csharp
public double MarginFactor
```
The margin factor to apply during the backtest.

## Position Limit Controls

### MaxOpenPositions
```csharp
public int MaxOpenPositions
```
Maximum number of open positions allowed simultaneously. Zero means no limit.

### MaxOpenPositionsInSymbol
```csharp
public int MaxOpenPositionsInSymbol
```
Maximum number of open positions per symbol. Zero means no limit.

### MaxOpenPositionsLong
```csharp
public int MaxOpenPositionsLong
```
Maximum number of open long positions allowed. Zero means no limit.

### MaxOpenPositionsShort
```csharp
public int MaxOpenPositionsShort
```
Maximum number of open short positions allowed. Zero means no limit.

## Advanced Positioning

### PositionSizer
```csharp
public PositionSizerBase PositionSizer
```
Contains the custom `PositionSizerBase` instance when `PositionSizeType` is set to `PosSizer`.

### UseNextBarOpenAsBasisPrice
```csharp
public bool UseNextBarOpenAsBasisPrice
```
Determines how the cost basis of a simulated trade is established:
- `false` (default): Cost basis uses closing price of entry bar
- `true`: Cost basis uses opening price of next bar

**Note:** 
- `false` may result in missed trades if market gaps up
- `true` avoids missed trades but assumes broker allows dollar-value orders

## Usage Examples

```csharp
public class BacktestConfigurer
{
    public void ConfigurePositionSizing(PositionSize posSize)
    {
        // Configure dollar-based position sizing
        posSize.PositionSizeType = PositionSizeType.Dollar;
        posSize.Amount = 10000; // $10,000 per trade
        posSize.StartingCapital = 100000;

        // Limit total open positions
        posSize.MaxOpenPositions = 5;
        posSize.MaxOpenPositionsLong = 3;
        posSize.MaxOpenPositionsShort = 2;

        // Use next bar's open price for more accurate simulations
        posSize.UseNextBarOpenAsBasisPrice = true;
    }

    public void ConfigureRiskBasedSizing(PositionSize posSize)
    {
        // Configure risk percentage-based sizing
        posSize.PositionSizeType = PositionSizeType.MaxRiskPct;
        posSize.Amount = 0.02; // 2% risk per trade
        posSize.StartingCapital = 100000;
    }

    public void ConfigureCustomPositionSizer(PositionSize posSize, PositionSizerBase customSizer)
    {
        // Use a custom position sizer for advanced logic
        posSize.PositionSizeType = PositionSizeType.PosSizer;
        posSize.PositionSizer = customSizer;
    }
}
```

## Best Practices

1. **Risk Management**
   - Use `MaxRiskPct` for consistent risk control
   - Set appropriate position limits
   - Consider correlation between positions

2. **Simulation Accuracy**
   - Choose `UseNextBarOpenAsBasisPrice` based on broker capabilities
   - Test different position sizing methods
   - Validate simulations against real-world trading

3. **Flexibility**
   - Leverage custom `PositionSizerBase` for complex sizing logic
   - Adapt sizing strategy to market conditions
   - Regularly review and adjust position sizing

## Notes

- Critical for controlling trade risk and capital allocation
- Supports various position sizing strategies
- Enables fine-grained control over backtesting
- Helps simulate realistic trading scenarios 