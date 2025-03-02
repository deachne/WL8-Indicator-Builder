# Transaction Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object

The `Transaction` class represents the result of an order (buy, sell, sell short, or cover short) placed during a simulated backtest or in the WealthLab Order Manager.

## Overview

When developing a C# Coded Strategy, you obtain a `Transaction` instance as a result of the `PlaceTrade` method. You can modify certain properties of the `Transaction` to implement customized position sizing and trading logic.

## Properties

### Backtest-Related Properties

#### Commission
```csharp
public double Commission
```
The commission applied to the order. Established in the Backtest Settings interface.

#### EntryDate
```csharp
public DateTime EntryDate
```
The signal entry date corresponding to the price bar where the trading signal was issued.

#### ExecutionDate
```csharp
public DateTime ExecutionDate
```
The date the backtester filled the order during the simulation.

#### ExecutionPrice
```csharp
public double ExecutionPrice
```
The price at which the backtester filled the order during the simulation.

#### MarginOverride
```csharp
public bool MarginOverride
```
When set to `true`, causes the backtester to fill the transaction even without sufficient simulated capital.

#### PositionTag
```csharp
public int PositionTag
```
An internal WealthLab integer used to track which Building Block a Transaction belongs to. Avoid using this directly.

#### Weight
```csharp
public double Weight
```
Specifies a weight value to determine transaction priority when multiple candidate transactions exist. Higher values result in higher priority during backtest processing.

### Order Management Properties

#### AutoProfitTargetPrice
```csharp
public double AutoProfitTargetPrice
```
Allows immediate submission of a "same-bar" limit order to exit a Position as soon as it is filled.

**Notes:**
- Works in both backtesting and live trading
- Best used with market entry orders
- Provides same-bar exit capabilities

#### AutoStopLossPrice
```csharp
public double AutoStopLossPrice
```
Allows immediate submission of a "same-bar" stop order to exit a Position as soon as it is filled.

**Notes:**
- Works in both backtesting and live trading
- Best used with market entry orders
- Provides same-bar exit capabilities

#### Bars
```csharp
public BarHistory Bars
```
The `BarHistory` instance on which the transaction was placed.

#### GranularWeightBasis
```csharp
public DateTime GranularWeightBasis
```
Contains the DateTime detected in intraday data that determined limit/stop order execution when advanced processing is enabled.

#### IsEntry
```csharp
public bool IsEntry
```
Returns `true` if the transaction is an entry (Buy or Short) transaction.

#### IsExit
```csharp
public bool IsExit
```
Returns `true` if the transaction is an exit (Sell or Cover) transaction.

#### NSF
```csharp
public bool NSF
```
Returns `true` if the Transaction was flagged as Non-Sufficient Funds by the backtester.

#### OrderPrice
```csharp
public double OrderPrice
```
The order price of the transaction (does not apply to Market orders).

#### OrderType
```csharp
public OrderType OrderType
```
Contains the order type of the transaction. Possible values:
- `OrderType.Market`
- `OrderType.Limit`
- `OrderType.Stop`
- `OrderType.StopLimit`
- `OrderType.FixedPrice`
- `OrderType.LimitMove`
- `OrderType.MarketClose`
- `OrderType.LimitClose`

#### PositionType
```csharp
public PositionType PositionType
```
Returns the position type:
- `PositionType.Long` for Buy and Sell orders
- `PositionType.Short` for Short and Cover orders

#### Quantity
```csharp
public double Quantity
```
Contains and assigns the number of shares or contracts in the transaction.

**Important:** 
- Assigning Quantity to an Entry Transaction overrides the Position Sizer
- Exit Transaction quantity is adjusted according to Portfolio Sync preferences

#### StopLimitLimitPrice
```csharp
public double StopLimitLimitPrice
```
Establishes the limit price for StopLimit orders. If unassigned, uses the OrderPrice.

#### Symbol
```csharp
public string Symbol
```
The symbol on which the transaction was placed.

#### Tag
```csharp
public object Tag
```
Allows attaching custom metadata to the Transaction. If set on an entry Transaction, the value is assigned to the resulting Position's Tag.

#### TransactionType
```csharp
public TransactionType TransactionType
```
Contains the transaction type:
- `TransactionType.Buy`
- `TransactionType.Sell`
- `TransactionType.Short`
- `TransactionType.Cover`

## Methods

### SetPositionMetric
```csharp
public void SetPositionMetric(string metric, double value)
```
Sets a Position Metric value that will be passed to the Position created by this Transaction.

**Parameters:**
- `metric`: Name of the metric
- `value`: Metric value

## Usage Examples

### Basic Transaction Handling
```csharp
public class TransactionManager
{
    public void ProcessTransaction(Transaction transaction)
    {
        // Check transaction details
        if (transaction.IsEntry)
        {
            // Customize entry transaction
            transaction.Quantity = CalculateCustomQuantity();
            transaction.AutoStopLossPrice = CalculateStopLoss();
        }
        
        // Set custom metrics
        transaction.SetPositionMetric("RiskFactor", 0.5);
        transaction.SignalName = "Custom Entry Signal";
    }
}
```

## Best Practices

1. **Position Sizing**
   - Use `Quantity` carefully to override Position Sizer
   - Consider risk management when setting quantities

2. **Same-Bar Exits**
   - Use `AutoProfitTargetPrice` and `AutoStopLossPrice` judiciously
   - Prefer market entry orders for realistic simulations

3. **Metadata and Tracking**
   - Utilize `Tag` and `SignalName` for detailed tracking
   - Set Position Metrics for advanced performance analysis

## Performance Considerations

- Minimize complex calculations in Transaction processing
- Use Position Metrics sparingly
- Validate custom quantity and exit price calculations

## Notes

- Critical for implementing advanced trading strategies
- Provides fine-grained control over trade execution
- Supports both backtesting and live trading scenarios 