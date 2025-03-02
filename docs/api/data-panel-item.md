# DataPanelItem Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object

Contains the information to be displayed in a row in the WL8 Data Panel. When building a Data Panel ScoreCard Extension, you'll create instances of `DataPanelItem` objects and add them to the List returned in the `GetItems` method.

## Constructors

```csharp
public DataPanelItem()
public DataPanelItem(string header, string stringValue)
public DataPanelItem(string header, double numberValue, int? dec = null, bool colorize = false, string suffix = null)
public DataPanelItem(string header, double numberValue, WLColor color)
```

`DataPanelItem` provides several constructors for flexibility:
- Default constructor creates an empty item
- String-based constructor for text values
- Numeric constructor with optional formatting parameters:
  - `dec`: Number of decimal places
  - `colorize`: Enable color coding based on value
  - `suffix`: Text to append to the value
- Numeric constructor with explicit color specification

## Properties

### Color
```csharp
public WLColor Color
```
If assigned a non-null `WLColor` value, determines the color to use when rendering the item in the Data Panel.

### Colorize
```csharp
public bool Colorize
```
When true, the text will be colored based on its `NumberValue`:
- Green for positive values
- Red for negative values

### Decimals
```csharp
public int? Decimals
```
If assigned a non-null integer value, determines the number of decimal places to use when rendering the item's `NumberValue` in the "Value" column.

### Header
```csharp
public string Header
```
Contains the header text that will be displayed in the "Item" column of the Data Panel.

### NumberValue
```csharp
public double NumberValue
```
If `StringValue` is null, this numeric value will be used as the content of the item's "Value" in the Data Panel.

### StringValue
```csharp
public string StringValue
```
If assigned a non-null string value, it will be used as the content of the item's "Value" in the Data Panel.

### Suffix
```csharp
public string Suffix
```
If assigned a non-null string, it will be appended to the text of the item's "Value" column.

## Usage Example

```csharp
public List<DataPanelItem> GetItems()
{
    var items = new List<DataPanelItem>();
    
    // String-based item
    items.Add(new DataPanelItem("Status", "Active"));
    
    // Numeric item with 2 decimal places and % suffix
    items.Add(new DataPanelItem("Return", 15.7532, 2, true, "%"));
    
    // Numeric item with custom color
    items.Add(new DataPanelItem("Risk Score", 7.5, WLColor.Orange));
    
    return items;
}
``` 