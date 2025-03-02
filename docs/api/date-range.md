# DateRange Class

**Namespace:** WealthLab.Core  
**Parent:** Object

Represents a range of date/time values.

## Constructors

```csharp
public DateRange()
public DateRange(DateTime sd, DateTime ed)
```

`DateRange` provides two constructors:
- A parameterless constructor
- A constructor that assigns values to the `StartDate` and `EndDate` properties

## Members

### EndDate
```csharp
public DateTime EndDate
```
The ending date of the date range.

### StartDate
```csharp
public DateTime StartDate
```
The starting date of the date range.

### IsDateInRange
```csharp
public bool IsDateInRange(DateTime dt)
```
Returns true if the specified `DateTime` lies within the start and end date range.

## Usage Example

```csharp
// Create a date range for the year 2023
var range = new DateRange(
    new DateTime(2023, 1, 1),
    new DateTime(2023, 12, 31)
);

// Check if a date falls within the range
DateTime testDate = new DateTime(2023, 6, 15);
bool isInRange = range.IsDateInRange(testDate); // Returns true

// Check a date outside the range
DateTime outsideDate = new DateTime(2024, 1, 1);
bool isOutside = range.IsDateInRange(outsideDate); // Returns false

// Use in a DataSet for symbol date ranges
var dataSet = new DataSet();
dataSet.DynamicDateRanges = new Dictionary<string, DateRange>
{
    { "AAPL", new DateRange(
        new DateTime(2000, 1, 1),
        DateTime.Now
    )}
};
``` 