# BarData Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The BarData class represents a single bar of data, comprised of open, high, low, close and volume values.

## Constructors

```csharp
public BarData()
public BarData(DateTime dt)
public BarData(BarHistory bars)
```

BarData has three constructors:
- The first parameterless constructor creates an uninitialized BarData instance
- The second, with a DateTime parameter, assigns the DateTime property that value
- The third, with a BarHistory parameter, assigns values based on the last bar of data in the BarHistory

## Members

### Ask
```csharp
public double Ask
```
The bar's current ask price value.

### Bid
```csharp
public double Bid
```
The bar's current bid price value.

### Close
```csharp
public double Close
```
The bar's closing price value.

### DataSource
```csharp
public string DataSource
```
Contains the name of the Historical Data Provider, or DataSet, that provided the data for this instance.

### DateTime
```csharp
public DateTime DateTime
```
The bar's date/time.

### High
```csharp
public double High
```
The bar's high price value.

### Low
```csharp
public double Low
```
The bar's low price value.

### Open
```csharp
public double Open
```
The bar's opening price value.

### Volume
```csharp
public double Volume
```
The bar's volume value. 