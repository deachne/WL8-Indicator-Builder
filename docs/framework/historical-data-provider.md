# Historical Data Provider API

This document details the API for building Historical Data Provider extensions for Wealth-Lab 8. A Historical Data Provider allows WealthLab 8 to consume historical price/volume data from a specific source. Examples of such sources are:

- Remote web services
- Scraped web pages
- Files in a specific format on the local file system

## Build Environment

You can create a Historical Data Provider in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Historical Data Provider will be a class in this library that descends from `DataProviderBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Data` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Historical Data Provider, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Configuration of a Historical Data Provider

`DataProviderBase` ultimately descends from the base class `Configurable`, which provides a way to allow the user to configure the Historical Data Provider. Consult the Configurable class reference for details.

By default, `DataProviderBase` assigns the enum value `ParameterList` to its `ConfigurableType` property, so the Historical Data Provider will use a `ParameterList` containing `Parameter` instances for configuration. You'll define these Parameters in the `GenerateParameters` method.

You can create Parameter instances to represent things like:
- User names
- Passwords
- API keys

When the user configures your Provider, WL8 will show a dialog box allowing them to enter appropriate, typed, values for each Parameter instance.

You are free to change the `ConfigurableType` to the alternate option of `VanillaString`, in which case you'll need to:
- Work directly with the Configuration string rather than the Parameters instances
- Create your own Editor (see the topic on Providing User Interfaces for WealthLab 8 Components for details)

## Important Descriptive Properties

The `Configurable` class provides descriptive properties that control how your Historical Data Provider appears in WL8. The most important ones to override are:
- `Name`
- `GlyphResource`
- `Description`
- `URL`

## Complete WL8 Data Subsystem Class Hierarchy

WL8's data subsystem has a hierarchy of several classes that derive from the `Configurable` base class. The `DataProviderBase` class follows a path that takes it from:
1. `Configurable`
2. `ProviderBase`
3. `BulkUpdatableProviderBase`
4. `DataProviderBase`

## Historical Data Provider Properties

Below are properties you can override to tell WL8 what features your Historical Data Provider supports.

### public virtual bool SupportsUpdate
Returns true by default, indicating that the Provider supports data updates from the source. Return false if your Provider will not be updatable from within WL8 (e.g., sourced from local files updated by an external mechanism).

### public virtual bool IsGeneralPurposeProvider
Returns true by default, indicating it can service ad-hoc symbol requests from Charts or Strategy windows. Return false to indicate your Provider cannot handle ad-hoc requests, but instead can provide data for only a fixed set of symbols.

Examples:
- Returns true: WealthData
- Returns false: MetaStock provider

### public virtual bool SupportsPartialBar
Returns the value of `IsGeneralPurposeProvider` by default. Indicates whether the Provider can return a "partial bar" of data. A partial bar consists of the trading session's open, high, low, volume and close up to the current point in time.

### public virtual bool ShowInNewDataSetList
Returns true by default, causing Providers that also returned true for `IsGeneralPurposeProvider` to appear in the list of available Providers in the New DataSet Wizard.

### public virtual bool NeedsNewInstancesForEachDataSet
Returns false by default. Return true if WL8 should create a new instance of your Provider for each DataSet that is created based on it.

Example: The ASCII Data Provider requires:
- User to define specific ASCII format
- Location of ASCII files to load
- New instance for each DataSet created
- These instances appear in general-purpose Data Provider list

### public virtual bool InjectNewProviderInstances
If a Provider returned true for `NeedsNewInstancesForEachDataSet`, instances typically appear in the Data Manager's list. Return false to prevent this.

Example: Stock Scanner Dynamic DataSet Provider returns false because:
- Returns symbols based on filter criteria
- DataSet appears in DataSets list
- Generated Data Providers shouldn't show in Data Manager/Providers list

### public string DSString
If `NeedsNewInstancesForEachDataSet` is true, contains the DSString describing the DataSet this Provider instance was based on.

### public DataSet DataSet
If `NeedsNewInstancesForEachDataSet` is true, contains the DataSet instance used when the Provider instance was created.

### public virtual bool ReadOnlySymbols
Returns false by default. Return true if users shouldn't modify symbols in a DataSet linked to your Provider.

### public virtual List<string> Symbols
Override if your Provider:
- Uses `ReadOnlySymbols`
- Has `NeedsNewInstancesForEachDataSet` true
- Symbols may change outside WL8 environment

### public virtual bool AllowConfigurationOfExistingDataSets
Returns true by default. Return false to disallow reconfiguring a DataSet after creation.

### public virtual bool LookForIntradayWhenNoDaily
Returns false by default. If true, WL8 attempts to load and compress intraday data when a daily/higher frequency request fails.

### public virtual bool Compress30MinuteBarsFor60Minute
Controls whether WL8 should compress 30-minute data for 60-minute requests. Default is true.

### public virtual void SymbolsChanged(DataSet ds)
Called when user changes DataSet symbols in DataSet panel or Data Manager.

## Initialization

### public virtual void Initialize()
Override to perform any required initialization before use.

## Returning Historical Data

The primary method of the Historical Data Provider returns historical data for a specified symbol, scale, and date range.

### protected abstract BarHistory GetHistoryInternal(string symbol, HistoryScale scale, DateTime startDate, DateTime endDate, int maxBars)

Parameters interpretation:
- If `maxBars` is non-zero: Return this many bars up to current date/time
- If `endDate` is DateTime.MaxValue: Return data up to current date/time
- If `startDate` is DateTime.MinValue: Return data from earliest possible date
- Otherwise: Use specified date range

Implementation steps:
1. Verify scale is supported (return null if not)
2. Verify symbol is supported (return null if not)
3. Create `BarHistory` instance with symbol and scale
4. Set `SecurityName` property if available
5. Get historical data from source
6. Add date, OHLCV data using `Add` method
7. Return `BarHistory` instance

> **Important:** Do not return incomplete partial bars! Either ignore them or call `RemovePartialBar`.

### public BarData RemovePartialBar(BarHistory bh)
Helper to remove potentially incomplete partial bar from end of BarHistory. Returns removed bar as `BarData` if one was removed.

### public virtual string GetSecurityName(string symbol)
Override to return security name if not available during `GetHistory`.

### public virtual bool SupportsScale(HistoryScale scale)
Return whether Provider natively supports specified scale. Don't consider compression capabilities.

### protected virtual BarData GetPartialBarInternal(string symbol, HistoryScale scale)
Return partial bar data for open markets. Return null if unavailable.

## Returning Symbol MetaData

### public virtual MarketDetails GetMarketForSymbol(string symbol)
Return `MarketDetails` instance for symbol's market. Defaults to US stock market.

### public virtual string GetSecurityName(string symbol)
Return security name (e.g., "Microsoft Corp" for MSFT).

### public virtual SymbolInfo GetSymbolInfoForSymbol(string symbol, double price = 0.0)
Return `SymbolInfo` with symbol properties (SecurityType, decimal settings, etc.).

### public virtual bool IsSymbolDelisted(string symbol)
Return true for delisted stocks.

### public virtual bool IsSymbolNonTradable(string symbol, bool excludeBroadMarketIndexes = true)
Return true for non-tradable symbols (indexes, indicators).

## Options Support

### public virtual string GetOptionsSymbol(BarHistory underlierBars, OptionType optionType, double price, DateTime currentDate, int minDaysAhead = 0, bool useWeeklies = false, bool allowExpired = false, bool closestStrike = true, double multiplier = 100)
Return option symbol based on parameters. Cache option chains if available.

Parameters:
| Parameter | Description |
|-----------|-------------|
| underlierBars | Underlier BarHistory for symbol/scale info |
| optionType | Call or Put |
| price | For strike identification |
| currentDate | Current backtest date |
| minDaysAhead | Minimum days to expiration |
| useWeeklies | Use weekly vs monthly expirations |
| allowExpired | Allow past contracts |
| closestStrike | Find closest vs next strike |
| multiplier | Contract multiplier |

### public virtual OptionChain GetOptionChain(string underlier)
Return `OptionChain` object. Return null if not implemented.

### public virtual List<OptionGreek> GetOptionChainSnapshot(string underlier, DateTime expiration, OptionType optionType = OptionType.Call, double lowStrike = 0, double highStrike = 0)
Return option chain snapshot. Return empty List if not implemented.

### public virtual DateTime GetSymbolExpiry(string optionSymbol)
Return option expiration date.

### public virtual double GetSymbolStrike(string optionSymbol)
Return option strike price.

### public virtual OptionGreek GetGreeks(string optionSymbol)
Return `OptionGreek` object with supported fields.

### public virtual OptionGreek GetGreeks(string optionSymbol, double impliedVolatility, double priceUnderlying)
Calculate Greeks based on IV and underlying price.

### public virtual double CalculateIV(string optionSymbol, double priceOption, double priceUnderlying)
Calculate implied volatility.

### public virtual double CalculateOptionPrice(string optionSymbol, double impliedVolatility, double priceUnderlying)
Calculate option price from IV and underlying price.

## Returning Quotes

### public virtual double GetQuote(string symbol)
Return current quote. Default implementation:
- If market open: Use `GetPartialBarInternal`
- If market closed: Get last daily close via `GetHistoryInternal`

## Persistent Storage Options

### public virtual bool UsesPersistentStorage
Return true to use built-in storage for downloaded data.

### public virtual BarHistory LoadFromStorage(string symbol, HistoryScale scale, DateTime? startDate = null, DateTime? endDate = null, int maxBars = 0)
### public virtual void SaveToStorage(BarHistory bh)
Override these to implement custom storage scheme instead of default .QX files.

### protected virtual string ConstructSymbolFileName(string symbol, HistoryScale scale)
Get/customize filename for symbol/scale combination.

### public virtual BarHistory ReloadHistory(string symbol, HistoryScale scale)
Called on "Reload Chart Data". Override to handle Provider-specific persistent data.

### public virtual void DeleteLocalData()
Called on "Delete all Local Data". Override to handle Provider-specific data.

### public virtual void ClearRequestLists()
Called on "Clear Internal Tracking Info". Override to handle Provider tracking data.

## Data Corrections

### public virtual bool SupportsDataCorrections
Return true if Provider supports correcting previously downloaded data.

### protected virtual ResponseWithCorrections GetHistoryInternalWithCorrections(string symbol, HistoryScale scale, DateTime startDate, DateTime endDate, int maxBars, DateTime lastRequestDate)
Return `ResponseWithCorrections` with:
- Bars: Historical data
- Corrections: Corrected data since lastRequestDate

### protected virtual string CompanionEventProviderName
Return corresponding Event Provider's Name for dividend/split handling.

### public virtual bool ReloadOnAnomaly(string symbol)
Control whether to reload on price gaps or new corporate actions.

## Provider Update Option

### public override bool SupportsBulkUpdate
Controls Provider-wide updates support. Defaults to `UsesPersistentStorage` value.

### public override void PerformBulkUpdate(IBulkUpdateHost updateHost)
Implement Provider-wide update logic.

### public override void CancelBulkUpdate()
Handle update cancellation.

### public virtual List<HistoryScale> ScalesWithData
Return scales with persisted data.

### public virtual List<string> GetSymbolsForScale(HistoryScale scale)
Return symbols persisted for given scale.

### public override bool SupportsParallelRequests()
Return false to restrict to single-threaded updates.

## Parallel Processing Considerations

WL8 uses parallel processing by default. To handle this:
- Avoid class-level variables in `GetHistoryInternal`
- Use method-level variables
- Use locking for non-parallel-safe sources

Example locking implementation:
```csharp
protected override BarHistory GetHistoryInternal(string symbol, HistoryScale scale, DateTime startDate, DateTime endDate, int maxBars)
{
    //_requestLock is defined as a private variable of type object
    lock(_requestLock)
    {
        //normal Provider processing
    }
}
```

## Tick Data Support

### public virtual List<Tick> GetTicks(string symbol, DateTime startDate, DateTime endDate)
Return tick data for symbol and date range.

### public virtual bool UsesTickDataStore
Return true to use built-in tick data storage.

## Customizing Configuration and New DataSet UI

See "Providing Editors for WealthLab 8 Components" for:
- Custom Settings Editor Panels
- New DataSet Wizard Pages

## Integrating with the Symbol Chooser

### public virtual List<SymbolChooserItem> GetChooserSymbols(string filter)
Return matching `SymbolChooserItem` instances for filter text.

`SymbolChooserItem` properties:
- Symbol (e.g., "AAPL")
- SecurityName (e.g., "Apple Computer")
- Source (DataProviderBase instance)
- ProviderName (Provider Name) 