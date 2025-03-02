# DataSet Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `DataSet` class represents a DataSet in WL8, which can be created either by users through the New DataSet Wizard or by a DataSet Provider. DataSet Providers can return instances of classes that derive from `DataSet`, in addition to plain vanilla DataSets. The class contains several properties and methods that can be overridden when creating a derived class.

## Core Properties

### DSString
```csharp
public string DSString
```
Contains configuration information about the DataSet. Interpretation depends on creation context. Historical Data Providers and DataSet Providers use this to configure the DataSet as it's read from the local file system, determining the contained Symbols.

### IsDynamic
```csharp
public bool IsDynamic
```
Returns true if the DataSet has any entries defined in its `DynamicDateRanges` property.

### IsUserCreated
```csharp
public bool IsUserCreated
```
Returns true if the DataSet was created by the user via the New DataSet Wizard, false if created by a DataSet Provider.

### Name
```csharp
public string Name
```
Contains the DataSet name, either user-entered in the New DataSet Wizard or assigned by a DataSet Provider.

### Symbols
```csharp
public List<string> Symbols
```
A List of strings containing the symbols in the DataSet.

### SymbolString
```csharp
public string SymbolString
```
Accesses the Symbols as a single, comma-delimited string.

## Members for Derived Classes

### DynamicDateRanges
```csharp
public Dictionary<string, DateRange> DynamicDateRanges
```
Dictionary of `DateRange` instances, keyed by symbol, representing when specific symbols should be considered part of the DataSet. Absence of an entry means the symbol is always part of the DataSet. Used by the WL8 backtester to restrict trades to specified date ranges, enabling modeling of actual stock market indices.

### GetHistory
```csharp
public virtual BarHistory GetHistory(string symbol, HistoryScale scale, DateTime startDate, DateTime endDate, int maxBars, GetHistoryControlBlock cb)
```
Override this method (when `ShouldReturnOwnData` is true) to return historical data as a `BarHistory` instance for the specified parameters. If `maxBars` is non-zero, return that many bars; otherwise use the date range parameters.

### Glyph
```csharp
public Bitmap Glyph
```
Optional `System.Drawing.Bitmap` to represent the DataSet in the WL8 DataSet tree. Defaults to the associated Historical Data Provider's Glyph or a generic image.

### PostDataLoad
```csharp
public virtual void PostDataLoad(BarHistory bh)
```
Called after `GetHistory`. Default implementation assigns `DynamicDateRanges` to the `BarHistory` instance. Override for additional processing, but call `base.PostDataLoad` to retain base functionality.

### PreferredDataProviderName
```csharp
public string PreferredDataProviderName
```
Associates the DataSet with a specific Historical Data Provider. WL8 will prioritize this provider when getting data for this DataSet.

### ReadOnlySymbols
```csharp
public bool ReadOnlySymbols
```
Determines if users can modify the DataSet's symbols.

### ShouldReturnOwnData
```csharp
public virtual bool ShouldReturnOwnData
```
Override to return true if the DataSet should handle its own historical data retrieval. If false (default), WL8 uses its built-in Historical Data Providers mechanism. If true, implement `SupportsScale` and `GetHistory`.

### SupportsScale
```csharp
public virtual bool SupportsScale(HistoryScale scale)
```
When `ShouldReturnOwnData` is true, override to indicate support for the specified scale.

### TradableSymbols
```csharp
public virtual List<string> TradableSymbols
```
By default returns the same as `Symbols`. Override to return a subset of currently tradable symbols (e.g., excluding decommissioned stocks). Used by WL8 Strategy Monitor for symbol activation.

## Usage Example

```csharp
public class CustomDataSet : DataSet
{
    public CustomDataSet()
    {
        Name = "Custom Market Index";
        PreferredDataProviderName = "MyDataProvider";
        ReadOnlySymbols = true;
        
        // Add symbols with their active date ranges
        Symbols = new List<string> { "AAPL", "MSFT", "GOOGL" };
        DynamicDateRanges = new Dictionary<string, DateRange>
        {
            { "AAPL", new DateRange(new DateTime(2000, 1, 1), DateTime.Now) },
            { "MSFT", new DateRange(new DateTime(1990, 1, 1), DateTime.Now) }
            // GOOGL has no range, so it's always considered active
        };
    }

    public override bool ShouldReturnOwnData => true;

    public override bool SupportsScale(HistoryScale scale)
    {
        return scale.Frequency == Frequency.Daily;
    }

    public override BarHistory GetHistory(string symbol, HistoryScale scale, 
        DateTime startDate, DateTime endDate, int maxBars, GetHistoryControlBlock cb)
    {
        // Implement custom historical data retrieval
        var history = new BarHistory(symbol, scale);
        // ... populate history
        return history;
    }
}
``` 