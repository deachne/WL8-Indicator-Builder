# Broker Adapter API

This document details the API for building Broker Adapter extensions for WealthLab 8. A Broker Adapter allows WL8 to connect to a live broker, obtain account information, place, and monitor trades. With a Broker Adapter connected, WL8 becomes a powerful trading bot. Both the Strategy Monitor and the Streaming Chart tool can be configured to automatically stage or even place Strategy-generated Signals to a connected broker.

## Build Environment

You can create a Broker Adapter in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Broker Adapter will be a class in this library that descends from `BrokerBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Backtest` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Broker Adapter, making it available in appropriate locations of the WL8 user interface.

## Configuration of a Broker Adapter

`BrokerBase` descends from the base class `Configurable`, which provides a way to allow the user to configure the Broker Adapter. Consult the Configurable class reference for details.

By default, `BrokerBase` assigns the `ParameterListType` value to its `ConfigurableType` property, so the BrokerAdapter will use a `ParameterList` containing `Parameter` instances for configuration.

You'll define these Parameters in the `GenerateParameters` method, as described in the Configurable class reference.

## Important Descriptive Properties

The `Configurable` class provides descriptive properties that control how your Broker Adapter appears in WL8. The most important ones to override are:
- `Name`
- `GlyphResource`
- `Description`
- `URL`

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Connecting to the Broker

### protected virtual bool Connect()
WL8 calls this method when it needs to connect to the broker supported by your Broker Adapter. Override the method to perform the actual connection, returning the success or failure. Prior to attempting to connect, you'll likely need to ensure that the user has properly configured the Broker Adapter. Check the Parameters, or the Configuration string property to determine if the Broker Adapter is configured.

### public virtual bool IsConnected
Returns true if a previous connection attempt has been successful. The default implementation uses a local bool variable that stores the result of your Connect method above. You can override this property to employ some different method to determine if the Broker Adapter is connected to the broker.

### public void Disconnect()
If you detect a disconnection with the broker services, call this method to notify WL8.

### public void DisplayBrokerMessage(string msg, WLColor color, Exception ex = null)
Call this method to communicate connection status information back to WL8. The color parameter uses the convention of:
- Red for errors
- Yellow for warnings
- Green for informational messages

Try to keep the chatter to the required minimum to avoid clogging up the WL8 Log Viewer.

## Account Information

### public List<BrokerAccount> Accounts
Returns a list of `BrokerAccount` instances that represent the accounts associated with this Broker. Your Broker Adapter should call the `UpdateAccounts` method after successfully connecting, to initially populate this list.

### public virtual void UpdateAccounts()
Override this method to populate the Accounts property with instances of the `BrokerAccount` class, to represent the accounts associated with this Broker. WL8 calls this method directly when the user explicitly requests an account update, and when trades are filled. After the update procedure is complete and the Accounts are ready, call `AccountsUpdated` to notify WL8 that accounts have been updated.

### public void AccountsUpdated()
Call this method after your `UpdateAccounts` method has completely updated accounts and their positions. This notifies WL8 that accounts have been updated, causing this to be reflected in any open Accounts window.

### public List<string> AccountNumbers
This property returns a List of strings containing the Account ID's of the Accounts associated with this Broker.

### public virtual List<Transaction> GetActiveOrders()
Override this method to return a list of active orders (typically limit or stop orders) that are live at the Broker. Create a Transaction object instance for each order. Assign:
- The order's account identifier to the Transaction Account property
- The broker-specific order identifier in its BrokerTag property
- Values to the Symbol, TransactionType, Quantity, OrderType, and OrderPrice properties

Also be sure to complete any other internal mapping your Broker Provider might require to associate a Transaction with a broker specific order identifier (BrokerTag).

## Market and Symbol Information

### public virtual int GetSymbolDecimals(string symbol, double price)
Override this method to return the number of decimal places the broker uses for limit/stop order pricing for the specified symbol and price values. This is used to establish the value of the Transaction class OrderPriceAdjusted property, which you should use in PlaceTrade. The default value is 2 decimal places.

### public virtual int GetSymbolQuantityDecimals(string symbol)
Override this method to return the number of decimal places the broker uses for the quantity (number of shares, coins, contracts, etc.) of an order for the specified symbol. This is used to establish the value of the Transaction class QuantityAdjusted property, which you should use in PlaceTrade. The default value is 0 decimal places.

### public virtual MarketDetails GetMarketForSymbol(string symbol)
Override this method to return a `MarketDetails` instance that represents the market which the specified symbol trades in. You can find `MarketDetails` instances in the `MarketManager` class, specifically the Markets property and the FindMarket method. The default implementation returns `MarketManager.USAStocks`.

### public virtual MarketDetails DefaultMarket
Override this property to return a default `MarketDetails` instance for the Broker Provider. The default return value is `MarketManager.USAStocks`.

## Placing and Canceling Trades

### protected abstract void PlaceTrade(Transaction t)
WL8 calls this method whenever a trade is being placed. The Transaction instance in the t parameter contains all of the relevant information about the trade, including:

- `MappedSymbol` - use this property, rather than the Transaction Symbol property, when passing the symbol to the broker
- `TransactionType` - Buy, Sell, Short or Cover
- `OrderType` - Limit (or LimitMove, which can be treated as a Limit order), Stop, Market, or MarketClose
- `QuantityAdjusted` - the Quantity rounded by the number of decimals returned in GetSymbolDecimals
- `OrderPriceAdjusted` - the stop/limit order price rounded by the number of decimals returned in GetSymbolQuantityDecimals

Your implementation should place the trade with the broker, and map any incoming identifier such as an order ID back to the original Transaction instance. You can use the Transaction instance's BrokerTag property to store a broker-specific order ID.

### protected abstract void CancelTrade(Transaction t)
WL8 calls this method whenever a trade should be canceled. The Transaction instance is passed in the t parameter, and you would typically use its BrokerTag property to map it back to a broker-specific identifier you can then use to request the cancellation of the trade with the broker.

### public virtual bool SupportsOco
Override this property and return true if your Broker Adapter supports native OCO (One-Cancels-Other) orders.

### protected virtual void PlaceOcoTradePair(Transaction t1, Transaction t2)
WL8 calls this method if a pair of trades should be submitted as an OCO (One-Cancels-Other) pair. This will only occur if your Broker Adapter returns true for `SupportsOCO`, and the user has selected "Use OCO orders when possible" in Trading Preferences.

### public virtual bool SupportsReplace
Override this property and return true if your Broker Adapter supports native order replacement.

### protected virtual void ReplaceTrade(Transaction oldOrder, Transaction newOrder)
WL8 calls this method whenever an active order should be replaced. This will only occur if your Broker Adapter returns true for `SupportsReplace`.

### public virtual bool SupportsMOC
Override this property to return true if the broker supports native Market on Close orders. If false, WL8 will stage these orders in the Order Manager with a WaitForClose status, and then submit them as Market orders shortly before the market close.

### public virtual bool SupportsLOC
Override this property to return true if the broker supports native Limit on Close orders. If false, WL8 will stage these orders in the Order Manager with a WaitForClose status, and then submit them as Limit orders shortly before the market close.

### public virtual bool AllowExit(BrokerAccount acct, string symbol, PositionType pt)
WL8 calls this method to determine a Sell or Cover order can be placed with the broker. The default implementation is to look for a broker position with a matching symbol and PositionType (pt) in the specific BrokerAccount (acct). You can override this method if your Broker Provider does not access broker positions.

### public virtual int FinalOrderDelayMinutes
Some brokers cancel day orders for the next session immediately if they're submitted moments (or even minutes) after the market close. Starting with WL8 Build 18 orders placed for the final bar of the session go into a status FinalOrder. They'll sit in the Order Manager until N minutes (FinalOrderDelayMinutes) after market close at which time "Final orders" are placed. The default value is 15 minutes.

## Monitoring Trade Status

After a broker connection is successful, your Broker Adapter should employ some mechanism to receive order status updates from the broker. Typical mechanisms for receiving order status are:

- Connections to a socket-based API (Interactive Brokers, Tradier)
- Handling events from an interface library (Binance)
- Periodically polling for status updates (Schwab)

### public void UpdateSignalStatus(Transaction t, SignalStatuses newStatus)
When you receive an updated order status, call this method to communicate it back to the WL8 Order Manager. Pass the Transaction instance (which you might map back to using its BrokerTag property), along with the new order status in the newStatus parameter. The SignalStatus enum has the following values:

- Staged
- Placed
- Active
- Filled
- PartialFilled
- CancelPending
- Canceled
- Error
- WaitForClose - used when an order is submitted in WealthLab's MarketClose order type
- Published - used by signal subscription services such as Collective2 that have an integrated Broker Adapter

If an order is partially or completely filled, assign values to the Transaction object's `FillPrice` and `FillQty` properties prior to calling `UpdateSignalStatus`. You can also add messages to the Transaction object's Messages property to communicate information from the broker to WL8.

## Companion Providers

WL8 attempts to link a Broker Provider with a companion Streaming and Historical Provider in various parts of the user interface. For example, the Order Manager shows a streaming quote using the companion Streaming Provider when a broker is selected and connected.

### public virtual string CompanionStreamingProviderName
Override this property to return the Name of a companion Streaming Provider associated with your Broker Provider, if any.

### public virtual string CompanionDataProviderName
Override this property to return the Name of a companion Historical Data Provider associated with your Broker Provider, if any. 