# BrokerAccount Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object

Represents an account associated with a connected broker.

## Constructors

```csharp
public BrokerAccount(BrokerBase broker)
```
Pass the associated BrokerBase instance when creating BrokerAccount instances.

## Derived Properties

### PositionsProfit
```csharp
public double PositionsProfit
```
Returns the total profit of the positions in the Positions List, based on their Quantity and CurrentPrice.

### PositionsProfitPct
```csharp
public double PositionsProfitPct
```
Returns the total percentage profit of the positions in the Positions List, based on their Quantity and CurrentPrice.

### PositionsValue
```csharp
public double PositionsValue
```
Returns the total value of the positions in the Positions List, based on their Quantity and CurrentPrice.

## Members

### AccountID
```csharp
public string AccountID
```
Returns the account number, or identifier, associated with this account.

### AccountValue
```csharp
public double AccountValue
```
Represents the overall account balance, or value. If the Broker does not have a value that maps cleanly to AccountValue, leave it unassigned and use the CustomFields property to display Broker-specific information.

### Broker
```csharp
public BrokerBase Broker
```
Returns the BrokerBase instance associated with the account.

### BuyingPower
```csharp
public double BuyingPower
```
Represents the current buying power available in the account. If the Broker does not have a value that maps cleanly to BuyingPower, leave it unassigned and use the CustomFields property to display Broker-specific information.

### Cash
```csharp
public double Cash
```
Represents the available cash balance in the account. If the Broker does not have a value that maps cleanly to Cash, leave it unassigned and use the CustomFields property to display Broker-specific information.

### CurrencyBalances
```csharp
public Dictionary<string, double> CurrencyBalances
```
Some Broker Providers populate this Dictionary with balance amounts per currency symbol in the account.

### CustomFields
```csharp
public Dictionary<string, string> CustomFields
```
Use this property to assign any Broker-specific balances or fields that you wish displayed in WL8. These fields will display, along with AccountValue, Cash, and BuyingPower (if assigned) in the Accounts window.

### GetCurrencyBalance
```csharp
public double GetCurrencyBalance(string symbol)
```
Returns the balance from the CurrencyBalances property for the corresponding currency symbol, or zero if the symbol is not contained in the Dictionary.

### Positions
```csharp
public List<BrokerPosition> Positions
```
A List of BrokerPosition instances that represent the open positions held in the account. Create a BrokerPosition instance for each open position reported by the Broker and add it to this List.

### SetCurrencyBalance
```csharp
public void SetCurrencyBalance(string symbol, double value)
```
Call this method from within your Broker Provider to set a currency specific balance amount. If you pass zero, the corresponding currency symbol is removed from the CurrencyBalances property. 