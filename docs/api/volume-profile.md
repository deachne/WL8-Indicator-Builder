# VolumeProfile Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `VolumeProfile` class generates a Volume Profile, which is a distribution of horizontal lines representing the volume traded at different price levels over a specified lookback period.

## Constructors

### VolumeProfile
```csharp
public VolumeProfile(
    BarHistory bars, 
    int lookback, 
    int barCount, 
    double valueRange = 70.0, 
    int? idx = null
)
```
Creates a Volume Profile for the specified `BarHistory` instance.

**Parameters:**
- `bars`: The source `BarHistory` to analyze
- `lookback`: The number of bars to use in generating the Volume Profile
- `barCount`: Desired number of Volume Profile horizontal lines
- `valueRange`: Percentage of volume considered the "High Value Range" (default: 70.0)
- `idx`: Optional specific index to generate the Volume Profile (defaults to last bar)

**Notes:**
- The actual number of Volume Profile lines may vary slightly from `barCount`
- Volume Profile bars outside the High Value Range are plotted in a dimmer color

## Properties

### Bars
```csharp
public BarHistory Bars
```
Returns the `BarHistory` instance used to generate the Volume Profile.

### Items
```csharp
public List<VolumeProfileItem> Items
```
Returns a list of `VolumeProfileItem` instances representing the Volume Profile horizontal bars.

### Lookback
```csharp
public int Lookback
```
Returns the lookback period used to generate the Volume Profile.

### LowVolNodeLower
```csharp
public double LowVolNodeLower
```
Returns the value of the Volume Profile bar with the lowest volume below the Point of Control, but within the High Value Area.

### LowVolNodeUpper
```csharp
public double LowVolNodeUpper
```
Returns the value of the Volume Profile bar with the lowest volume above the Point of Control, but within the High Value Area.

### PointOfControl
```csharp
public double PointOfControl
```
Returns the price level corresponding to the Volume Profile's "Point of Control" - the bar with the most total volume.

### PointOfControlItem
```csharp
public VolumeProfileItem PointOfControlItem
```
Returns the `VolumeProfileItem` with the largest total volume.

### ProfileBarsDesired
```csharp
public int ProfileBarsDesired
```
Contains the desired number of Volume Profile bars to generate.

### ValueRangePct
```csharp
public double ValueRangePct
```
Percentage of total volume considered the "High Value Range".

## Methods

### GenerateVolumeProfile
```csharp
public void GenerateVolumeProfile(int idx)
```
Generates the Volume Profile as of a specific index in the source `BarHistory`.

## Usage Examples

### Basic Volume Profile Creation
```csharp
public class VolumeProfileAnalyzer
{
    public void AnalyzeVolumeProfile(BarHistory bars)
    {
        // Create Volume Profile with 50-bar lookback, 20 desired bars
        var volumeProfile = new VolumeProfile(bars, lookback: 50, barCount: 20);
        
        // Access key volume profile metrics
        Console.WriteLine($"Point of Control: {volumeProfile.PointOfControl}");
        Console.WriteLine($"Low Volume Node Lower: {volumeProfile.LowVolNodeLower}");
        Console.WriteLine($"Low Volume Node Upper: {volumeProfile.LowVolNodeUpper}");
        
        // Iterate through Volume Profile items
        foreach (var item in volumeProfile.Items)
        {
            Console.WriteLine(
                $"Range: {item.RangeMin}-{item.RangeMax}, " +
                $"Volume: {item.TotalVolume}, " +
                $"In Value Range: {item.InValueRange}"
            );
        }
    }
}
```

### Trading Strategy with Volume Profile
```csharp
public class VolumeProfileStrategy : UserStrategyBase
{
    public override void Execute(BarHistory bars, int idx)
    {
        // Create Volume Profile at current index
        var volumeProfile = new VolumeProfile(bars, lookback: 100, barCount: 30, idx: idx);
        
        // Use Point of Control as potential support/resistance
        double poc = volumeProfile.PointOfControl;
        
        // Example entry logic near Point of Control
        if (bars.Close[idx] < poc && bars.Close[idx] > poc * 0.99)
        {
            Buy();
        }
        
        // Example exit logic
        if (bars.Close[idx] > poc * 1.01)
        {
            SellAll();
        }
    }
}
```

## Best Practices

1. **Volume Profile Analysis**
   - Use appropriate lookback periods
   - Consider market context and timeframe
   - Combine with other technical indicators

2. **Performance Considerations**
   - Volume Profiles can be computationally intensive
   - Use reasonable lookback and bar count values
   - Cache results when possible

3. **Interpretation**
   - Point of Control represents the most significant price level
   - High Value Range shows key trading areas
   - Low Volume Nodes can indicate potential support/resistance

## Notes

- Powerful tool for understanding volume distribution
- Helps identify key price levels and trading zones
- Useful in both technical analysis and trading strategy development 