# VolumeProfileItem Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `VolumeProfileItem` class represents a single horizontal line in a Volume Profile, providing detailed information about volume distribution at a specific price range.

## Properties

### DownVolume
```csharp
public double DownVolume
```
Contains the volume traded when the closing price is less than the closing price of the previous bar.

### InValueArea
```csharp
public bool InValueArea
```
Indicates whether this Volume Profile bar is within the "Value Area" of the Volume Profile.

**Notes:**
- `true` if the bar is among those making up the specified percentage of total volume
- Percentage determined by the Volume Profile's `ValueRangePct` (default: 70%)

### IsPOC
```csharp
public bool IsPOC
```
Indicates whether this Volume Profile bar is the "Point of Control".

**Notes:**
- `true` if this bar has the largest total volume in the Volume Profile

### RangeMax
```csharp
public double RangeMax
```
The inclusive upper range of values represented by this Volume Profile bar.

### RangeMin
```csharp
public double RangeMin
```
The exclusive lower range of values represented by this Volume Profile bar.

### TotalVolume
```csharp
public double TotalVolume
```
The total volume of this Volume Profile bar (UpVolume + DownVolume).

### UpVolume
```csharp
public double UpVolume
```
Contains the volume traded when the closing price is greater than or equal to the closing price of the previous bar.

### WidthPct
```csharp
public double WidthPct
```
The percentage width of this Volume Profile bar compared to the Point of Control bar.

**Notes:**
- Returns a value between 0.0 and 1.0
- Compares to the bar with the largest total volume

### WidthPctDown
```csharp
public double WidthPctDown
```
The percentage width of this bar's down volume compared to the Point of Control bar's total volume.

**Notes:**
- Returns a value between 0.0 and 1.0

### WidthPctUp
```csharp
public double WidthPctUp
```
The percentage width of this bar's up volume compared to the Point of Control bar's total volume.

**Notes:**
- Returns a value between 0.0 and 1.0

## Methods

### IsValueInRange
```csharp
public bool IsValueInRange(double value)
public bool IsValueInRange(double high, double low)
```
Determines whether a single value or a value range is within the Volume Profile bar's range.

**Overloads:**
1. Check if a single value is within the bar's range
2. Check if a high-low range intersects with the bar's range

## Usage Examples

### Volume Profile Item Analysis
```csharp
public class VolumeProfileItemAnalyzer
{
    public void AnalyzeVolumeProfileItems(BarHistory bars)
    {
        // Create Volume Profile
        var volumeProfile = new VolumeProfile(bars, lookback: 100, barCount: 30);
        
        foreach (var item in volumeProfile.Items)
        {
            Console.WriteLine("Volume Profile Item Details:");
            Console.WriteLine($"Range: {item.RangeMin} - {item.RangeMax}");
            Console.WriteLine($"Total Volume: {item.TotalVolume}");
            Console.WriteLine($"Up Volume: {item.UpVolume}");
            Console.WriteLine($"Down Volume: {item.DownVolume}");
            Console.WriteLine($"Is Point of Control: {item.IsPOC}");
            Console.WriteLine($"In Value Area: {item.InValueArea}");
            Console.WriteLine($"Width Percentage: {item.WidthPct:P2}");
            
            // Check if a specific price is in range
            double checkPrice = bars.Close[bars.Count - 1];
            bool inRange = item.IsValueInRange(checkPrice);
            Console.WriteLine($"Current price {checkPrice} in range: {inRange}");
        }
    }
}
```

### Trading Strategy with Volume Profile Items
```csharp
public class VolumeProfileItemStrategy : UserStrategyBase
{
    public override void Execute(BarHistory bars, int idx)
    {
        var volumeProfile = new VolumeProfile(bars, lookback: 100, barCount: 30, idx: idx);
        
        // Find Point of Control item
        var pocItem = volumeProfile.Items.FirstOrDefault(item => item.IsPOC);
        
        if (pocItem != null)
        {
            // Entry near Point of Control with volume confirmation
            if (bars.Close[idx] < pocItem.RangeMax && 
                bars.Close[idx] > pocItem.RangeMin && 
                pocItem.TotalVolume > GetAverageVolume(volumeProfile))
            {
                Buy();
            }
            
            // Exit if price moves outside Value Area
            var valueAreaItems = volumeProfile.Items.Where(item => item.InValueArea);
            bool outsideValueArea = !valueAreaItems.Any(item => 
                item.IsValueInRange(bars.Close[idx]));
            
            if (outsideValueArea)
            {
                SellAll();
            }
        }
    }
    
    private double GetAverageVolume(VolumeProfile volumeProfile)
    {
        return volumeProfile.Items.Average(item => item.TotalVolume);
    }
}
```

## Best Practices

1. **Volume Analysis**
   - Understand the significance of Up and Down volume
   - Use Point of Control as a key reference point
   - Consider Value Area for trading decisions

2. **Range Interpretation**
   - Use `IsValueInRange` for precise price level analysis
   - Compare volume distribution across different bars
   - Look for volume concentration and divergences

3. **Performance Considerations**
   - Avoid excessive iterations through Volume Profile items
   - Cache Volume Profile results when possible
   - Use LINQ efficiently

## Notes

- Provides granular insights into volume distribution
- Useful for identifying support, resistance, and trading zones
- Helps understand market sentiment and price action
- Part of advanced technical analysis toolkit 