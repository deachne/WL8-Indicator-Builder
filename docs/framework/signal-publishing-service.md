# Signal Publishing Service API

This document details the API for building Signal Publishing Service extensions for Wealth-Lab 8. These extensions represent remote services that can be selected in the WL8 Signals Publisher tool. You can publish trading Signals to a publishing service by linking a WL8 Strategy to a Remote Strategy that's defined on the service.

## Build Environment

You can create a Signal Publishing Service in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Signal Publishing Service will be a class in this library that descends from `SignalPublishingServiceBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Core` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Signal Publishing Service, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Descriptive Properties

The `Configurable` class, which `SignalPublishingServiceBase` descends from, provides descriptive properties that control how your Signals Publishing Service appears in WL8. The most important ones to override are:
- `Name`
- `GlyphResource`
- `Description`
- `URL`

### public virtual string ManageSignalsURL(RemoteStrategyInfo rsi)
Override this method to return a URL on the remote publishing service that will allow the user to manage the signals on-site for the indicated Remote Strategy.

## Login Credentials

### public virtual bool RequiresLogin
Indicates that the Signal Publishing Service requires a login and returns true by default. When true, causes User Name and Password inputs to become enabled in the Linked Strategy configuration dialog.

### public string UserName
Accesses the User Name that the user entered when creating a Linked Strategy.

### public string Password
Accesses the Password that the user entered when creating a Linked Strategy.

### public virtual string CheckLogin()
Override this method to perform an authentication check with the remote publishing service using the `UserName` and `Password`. If the login was successful, return null, otherwise return an appropriate error message.

## Getting Remote Strategies

Remote Strategies are the Signal Publishing Service API's way of referring to the publishable "slots" that a remote publishing service offers. A service might provide:
- Only a single slot (like Wealth$im on WealthLab.com)
- Multiple user-created slots (like WealthSignals)

Each slot is represented as an instance of the `RemoteStrategyInfo` class with these properties:
- `RemoteStrategyName`: The Remote Strategy name as it appears on the service
- `RemoteStrategyID`: A string representation of the Remote Strategy's unique ID
- `Tag`: An object that you can assign implementation-specific details

### public abstract List<RemoteStrategyInfo> GetPublishedStrategies()
Override this method to return a list of `RemoteStrategyInfo` instances that represent the available publishing slots.

> **Note:** When WL8 loads persisted Signals Publisher data on startup, the Tag values will not be available. If they are required, you'll need to re-assign them as needed if they are null.

### public virtual bool AllowMultipleLinks
Return a bool indicating whether the Publishing Service should allow multiple WL8 Strategies to link to the same Remote Strategy. Examples:
- WealthSignals returns false (each Strategy links to only one WL8 Strategy)
- WealthSim returns true (multiple WL8 Strategies can link to a single account)

## Getting Current Equity and Positions

### public abstract (double, double) GetEquityAndCash(RemoteStrategyInfo rsi)
Override this method to return the current account equity and cash values from the publishing service, for the indicated Remote Strategy.

### public abstract List<PositionPayload> GetOpenPositions(RemoteStrategyInfo rsi)
Override this method to return a list of open positions that are held at the publishing service, for the indicated Remote Strategy. The `PositionPayload` lightweight class contains:
- `PositionType` (Long or Short)
- `Symbol`
- `Quantity` (double)
- `EntryDate`

## Publishing Signals

### public virtual bool CanPublishSignals
Return a boolean value indicating if Signal publishing is currently allowed. The default implementation returns true if the US stock market is currently closed.

### public abstract OrderSubmissionPayload SubmitSignals(RemoteStrategyInfo rsi, List<OrderPayload> signals)
Override this method to publish a list of Signals to the publishing service, for the indicated Remote Strategy. 

The signals are represented by a List of `OrderPayload` instances with these properties:
- `TransactionType` (Buy, Sell, Short, Cover)
- `Quantity` (double)
- `Symbol`
- `OrderType` (Market, Limit, Stop)
- `OrderPrice` (double)
- `Weight` (double) - transaction weight, higher values = higher priority

The method returns an `OrderSubmissionPayload` instance with these properties:
- `OrdersSubmitted` (int) - count of successfully published Signals
- `InfoMsg`
- `ErrorMsg` - assigning a value indicates an error

## Publishing Backtest Results

### public virtual bool CanPublishBacktestData(RemoteStrategyInfo rsi)
Some signal publishing services (notably WealthSignals) allow you to publish Strategy backtest results. Override this property to return true if the facility is available for the specified Remote Strategy.

### public virtual void PublishBacktestData(RemoteStrategyInfo rsi, Backtester bt)
Override this method to implement the actual publishing of backtest data for the specified Remote Strategy. The `Backtester` instance contains:
- All available backtest performance metrics
- An `EquityCurve` TimeSeries
- A dynamic `Metrics` property for accessing all ScoreCard metrics

## Example Implementation

Below is a simplified example of a Signal Publishing Service:

```csharp
public class SimplePublishingService : SignalPublishingServiceBase
{
    public override string Name => "Simple Publisher";
    public override string Description => "Basic signal publishing service example";
    
    private readonly Dictionary<string, RemoteStrategyInfo> _strategies = new();
    
    public override List<RemoteStrategyInfo> GetPublishedStrategies()
    {
        // In a real implementation, fetch strategies from remote service
        var strategies = new List<RemoteStrategyInfo>();
        var rsi = new RemoteStrategyInfo
        {
            RemoteStrategyName = "Demo Strategy",
            RemoteStrategyID = "DEMO-001",
            Tag = new { ApiKey = "demo-key" }
        };
        _strategies[rsi.RemoteStrategyID] = rsi;
        strategies.Add(rsi);
        return strategies;
    }
    
    public override (double, double) GetEquityAndCash(RemoteStrategyInfo rsi)
    {
        // Fetch current equity and cash from remote service
        return (100000.0, 50000.0);  // Example values
    }
    
    public override List<PositionPayload> GetOpenPositions(RemoteStrategyInfo rsi)
    {
        var positions = new List<PositionPayload>();
        positions.Add(new PositionPayload
        {
            PositionType = PositionType.Long,
            Symbol = "AAPL",
            Quantity = 100,
            EntryDate = DateTime.Now.AddDays(-5)
        });
        return positions;
    }
    
    public override OrderSubmissionPayload SubmitSignals(
        RemoteStrategyInfo rsi, 
        List<OrderPayload> signals)
    {
        var result = new OrderSubmissionPayload();
        
        try
        {
            // Submit signals to remote service
            foreach (var signal in signals)
            {
                // Process signal
                result.OrdersSubmitted++;
            }
            
            result.InfoMsg = $"Successfully submitted {result.OrdersSubmitted} signals";
        }
        catch (Exception ex)
        {
            result.ErrorMsg = $"Error submitting signals: {ex.Message}";
        }
        
        return result;
    }
    
    public override string CheckLogin()
    {
        // Verify credentials with remote service
        if (string.IsNullOrEmpty(UserName) || string.IsNullOrEmpty(Password))
            return "Username and password are required";
            
        // Authenticate with service
        return null;  // Return null for successful login
    }
    
    public override bool CanPublishBacktestData(RemoteStrategyInfo rsi)
    {
        return true;  // This service supports backtest data publishing
    }
    
    public override void PublishBacktestData(RemoteStrategyInfo rsi, Backtester bt)
    {
        // Upload backtest results to remote service
        var equityCurve = bt.EquityCurve;
        var metrics = bt.Metrics;
        
        // Process and upload data...
    }
} 