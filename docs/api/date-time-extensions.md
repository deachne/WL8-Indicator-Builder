# DateTime Extension Methods

**Namespace:** WealthLab.Core

A collection of DateTime extension methods that assist with typical trading functions related to date and time. These methods can be called using standard method syntax on DateTime objects.

## Calendar Methods

### CalendarDaysBetweenDates
```csharp
public static int CalendarDaysBetweenDates(this DateTime fromDate, DateTime toDate)
public static int CalendarDaysBetweenDates(this int fromDate, int toDate)
public static int CalendarDaysBetweenDates(this string fromDate, string toDate)
```
Returns the number of calendar days between dates. Result is positive if `toDate` is in the future, zero for same date, or negative.

**Notes:**
- String dates must use "yyyyMMdd" format (e.g., "20210416")
- Integer dates must use yyyyMMdd format (e.g., 20210416)

### WeekOfYear
```csharp
public static int WeekOfYear(this DateTime dte)
```
Returns the week number (1-52/53) for the year.

**Notes:**
- Week #1 is the first full week in January (Sunday to Saturday)
- Early January dates may belong to the last week of the previous year unless January 1st is a Sunday

## Trading Day Methods

### GetNextTradingDate
```csharp
public static DateTime GetNextTradingDate(this DateTime dt1, BarHistory bars)
public static DateTime GetNextTradingDate(this DateTime dt, MarketDetails mkt)
```
Returns the DateTime of the next trading day. Time component is preserved if present. Useful for determining week/month end signals.

### IsTradingDay
```csharp
public static bool IsTradingDay(this DateTime dt, BarHistory bars)
```
Returns true if the market trades on the specified day (time is ignored).

### IsHoliday
```csharp
public static bool IsHoliday(this DateTime dt, BarHistory bars)
```
Returns true if the date is a holiday for the specified `BarHistory`.

### IsWeekend
```csharp
public static bool IsWeekend(this DateTime dt)
```
Returns true if the date falls on Saturday or Sunday. Used in trading day calculations.

### PreviousTradingDay
```csharp
public static DateTime PreviousTradingDay(this DateTime dt, MarketDetails md)
```
Returns the DateTime of the previous trading day. Time component is preserved if present.

## Trading Period Methods

### IsLastTradingDayOfMonth
```csharp
public static bool IsLastTradingDayOfMonth(this DateTime dt, BarHistory bars)
```
Returns true if the date is the last trading day of a calendar month.

### IsLastTradingDayOfWeek
```csharp
public static bool IsLastTradingDayOfWeek(this DateTime dt, BarHistory bars)
```
Returns true if the date is the last trading day of a calendar week.

## Options-Related Methods

### IsOptionExpiry
```csharp
public static bool IsOptionExpiry(this DateTime date)
public static bool IsOptionExpiry(this DateTime date, BarHistory bars)
```
Returns true if the date is a monthly option expiration day:
- Base version checks if date is third Friday of month
- `BarHistory` version accounts for holidays (returns true for Thursday if Friday is a holiday)

### NextOptionExpiryDate
```csharp
public static DateTime NextOptionExpiryDate(this DateTime date, BarHistory bars)
```
Returns DateTime of next monthly options expiration date.

**Notes:**
- Returns current date if it's an expiry date
- Returns Thursday's date if expiry Friday is a holiday

## Time Methods

### GetTime
```csharp
public static int GetTime(this DateTime dt)
```
Returns 24-hour 'HHmm' integer from time component (seconds ignored). Useful for time-of-day trading filters.

Examples:
- 9:35 am → 935
- 12:00 pm → 1200
- 3:50 pm → 1550

## Usage Examples

```csharp
// Calendar days calculation
DateTime start = DateTime.Now;
DateTime end = start.AddDays(10);
int days = start.CalendarDaysBetweenDates(end); // Returns 10

// Trading day checks
var bars = GetBarHistory(); // Your BarHistory instance
DateTime today = DateTime.Now;
if (today.IsTradingDay(bars) && !today.IsHoliday(bars))
{
    // Execute trading logic
}

// Options expiry
if (today.IsOptionExpiry(bars))
{
    // Handle options expiration
}

// Time-based trading
int currentTime = DateTime.Now.GetTime();
if (currentTime >= 930 && currentTime <= 1600)
{
    // Regular trading hours logic
}

// Period end signals
if (today.IsLastTradingDayOfMonth(bars))
{
    // Execute end-of-month strategy
}
``` 