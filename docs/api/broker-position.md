# BrokerPosition Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object

Represents an open position held in the associated Broker account.

## Constructors

```csharp
public BrokerPosition(BrokerAccount ba)
```
Pass the associated BrokerAccount instance when creating a new instance.

## Derived Properties

### Profit
```csharp
public double Profit
```
Returns the current profit of the position, based on its CurrentPrice, BasisPrice, and Quantity.

### ProfitPct
```csharp
public double ProfitPct
```
Returns the current percentage profit of the position, based on its CurrentPrice and BasisPrice.

### Value
```csharp
public double Value
```
Returns the current value of the position, based on its CurrentPrice and Quantity.

## Members

### Account
```csharp
public BrokerAccount Account
```
The BrokerAccount associated with this position.

### BasisPrice
```csharp
public double BasisPrice
```
The original basis price of the position, or the price at which the shares/contracts were originally acquired.

### CurrentPrice
```csharp
public double CurrentPrice
```
The most recent price of the underlying position's Symbol, as reported by the broker.

### PositionType
```csharp
public PositionType PositionType
```
The position's type, either PositionType.Long or PositionType.Short.

### Quantity
```csharp
public double Quantity
```
The number of shares or contracts in the position.

### Symbol
```csharp
public string Symbol
```
The position's symbol. 