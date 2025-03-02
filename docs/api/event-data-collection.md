# EventDataCollection Class

**Namespace:** WealthLab.Data  
**Parent:** Object

Contains a list of `EventDataPoint` instances read from persistent storage and passed to an Event Data Provider's `ConvertEventItems` method.

## Constructor

```csharp
public EventDataCollection(string symbol)
```
Creates a new instance of an `EventDataCollection` for the specified symbol.

## Members

### DataPoints
```csharp
public List<EventDataPoint> DataPoints
```
The List of `EventDataPoint` instances contained in this collection.

### RecentItemDate
```csharp
public DateTime RecentItemDate
```
Returns the most recent Date of the `EventDataPoint` instances in this collection.

### Symbol
```csharp
public string Symbol
```
The symbol associated with these `EventDataPoint` instances.

### UpdateDate
```csharp
public DateTime UpdateDate
```
Contains the date/time when the `EventDataCollection` was most recently saved to persistent storage.

## Usage Example

```csharp
// Create a new collection for AAPL events
var events = new EventDataCollection("AAPL");

// Add event data points
events.DataPoints.Add(new EventDataPoint
{
    Date = DateTime.Now,
    Name = "dividend",
    Value = 0.88
});

// Check most recent event date
DateTime lastEvent = events.RecentItemDate;

// Access symbol and last update time
string symbol = events.Symbol;
DateTime lastUpdate = events.UpdateDate;

// Process all events
foreach (var eventPoint in events.DataPoints)
{
    // Handle each event
    if (eventPoint.Name == "dividend")
    {
        // Process dividend event
        double dividendAmount = eventPoint.Value;
        // ...
    }
}
```

This example demonstrates:
- Creating an event collection
- Adding event data points
- Accessing collection properties
- Processing events in the collection 