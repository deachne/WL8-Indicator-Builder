# Event Provider API

This document details the API for building Event Provider extensions for Wealth-Lab 8. An Event Provider provides data points that are based on events that occur on specific dates. Some examples of appropriate events are:

- Fundamental items such as dividends, splits, and earnings
- Analyst ratings
- Chart or candlestick patterns
- News

## Build Environment

You can create an Event Provider in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Event Provider will be a class in this library that descends from `EventProviderBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Data` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Event Provider, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Configuration of an Event Provider

`EventProviderBase` ultimately descends from the base class `Configurable`, which provides a way to allow the user to configure the Historical Data Provider. Consult the Configurable class reference for details.

By default, `EventProviderBase` assigns the enum value `ParameterList` to its `ConfigurableType` property, so the Event Provider will use a `ParameterList` containing `Parameter` instances for configuration. You'll define these Parameters in the `GenerateParameters` method.

You can create Parameter instances to represent things like:
- User names
- Passwords
- API keys

When the user configures your Provider, WL8 will show a dialog box allowing them to enter appropriate, typed, values for each Parameter instance.

You are free to change the `ConfigurableType` to the alternate option of `VanillaString`, in which case you'll need to:
- Work directly with the Configuration string rather than the Parameters instances
- Create your own Editor (see the topic on Providing User Interfaces for WealthLab 8 Components for details)

## Important Descriptive Properties

The `Configurable` class provides descriptive properties that control how your Event Provider appears in WL8. The most important ones to override are:
- `Name`
- `GlyphResource`
- `Description`
- `URL`

## Initialization

### public virtual void Initialize()
If your Event Provider requires any kind of initialization before use, you can override this method and implement it here.

## Returning Event Data

### public abstract List<string> ItemNames
Override this property to return a List containing the names of each type of event your Event Provider supports. These values should correspond to the `Name` property of the `EventDataPoint` instances that your EDP will eventually create and return in `GetNewEventData` below.

Example: If your Event Provider will return stock split and dividends, you might return a list containing the strings "Split" and "Dividend".

### protected abstract void GetNewEventData(BarHistory bh, DateTime lastUpdateDate)
WL8 calls this method when it attempts to download fresh events from your Event Provider. 

Parameters:
- `lastUpdateDate`: Contains the most recent DateTime for which data is already available
  - Only contains a value if your Event Provider uses persistent storage
  - If not DateTime.MinValue, add only new events that occurred after this date

Implementation:
1. Collect events from your source
2. Create instances of the `EventDataPoint` class (or a derived class) for each event
3. Add these `EventDataPoint` instances to the BarHistory instance using its `EventDataPoints.Add` method

> **Important:** WL8 will call your Event Provider's `GetNewEventData` method from multiple threads in parallel processing mode. Avoid accessing class level variables in `GetNewEventData`. Use variables defined in the method itself.

## Persistent Storage Option

### public virtual bool UsesPersistentStorage
Returns false by default. Override this and return true to utilize the built-in persistent storage mechanism in your Event Provider. Typically used if your Event Provider:
- Procures data from a remote service
- Needs to keep a local copy to avoid redundant requests

### protected abstract List<EventDataPoint> ConvertEventItems(EventDataCollection fdc)
If your Event Provider uses persistent storage:
- WL8 stores collected event data locally as `EventDataPoint` instances
- When requesting updates, WL8 reads these into an `EventDataCollection` instance
- Your Provider may use custom classes derived from `EventDataPoint`
- In this method:
  1. Enumerate through all `EventDataPoint` instances in the `fdc` parameter
  2. Examine their `Name` property
  3. Create instances of the correct derived class
  4. Add them to the returned List

### public virtual EventDataCollection ReadFromStorage(string symbol, bool metaDataOnly)
### public virtual void WriteToStorage(string symbol, List<EventDataPoint> lst)
By default, WL8 stores event data in binary files with the QF extension. Override these methods to implement your own storage mechanism.

## Provider Update Option

### public override bool SupportsBulkUpdate
This property determines whether your Event Provider supports Provider-wide updates from within the WL8 Data Manager, allowing updates for all symbols at once.

By default:
- Returns the value of `UsesPersistentStorage`
- If using built-in persistent storage, keep default for built-in Provider Update behavior
- If not using built-in mechanism but want Provider Update support, override the methods below

### public override void PerformBulkUpdate(IBulkUpdateHost updateHost)
Implement the logic to update all symbols for your Event Provider here. Communicate update status through callbacks to the `updateHost` instance.

### public override void CancelBulkUpdate()
WL8 calls this when the user cancels a Provider Update. Override to cancel your Provider-specific update routine.

### public virtual List<string> GetSymbols()
Returns symbols that already have some event data persisted. If you override the default persistent storage mechanism (`ReadFromStorage` and `WriteToStorage`), also override this to return symbols with event data. 