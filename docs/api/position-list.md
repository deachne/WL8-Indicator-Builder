# PositionList Class

**Namespace:** WealthLab.Backtest  
**Parent:** List<Position>

The `PositionList` class extends the standard .NET `List<Position>` to provide additional utility methods for analyzing and aggregating position-related metrics.

## Aggregate Metrics

### AvgBarsHeld
```csharp
public double AvgBarsHeld
```
Calculates and returns the average number of bars held across all Position instances in the list.

### AvgProfit
```csharp
public double AvgProfit
```
Calculates and returns the average profit of all Position instances in the list.

### AvgProfitPct
```csharp
public double AvgProfitPct
```
Calculates and returns the average percentage profit of all Position instances in the list.

### Profit
```csharp
public double Profit
```
Calculates and returns the total profit of all Position instances in the list.

### ProfitPct
```csharp
public double ProfitPct
```
Calculates and returns the total percentage profit of all Position instances in the list.

### TotalSize
```csharp
public double TotalSize
```
Calculates and returns the total CostBasis plus Profit for all Position instances in the list.

## Usage Examples

```csharp
public class PositionAnalyzer
{
    public void AnalyzePositionList(PositionList positions)
    {
        // Basic performance metrics
        Console.WriteLine($"Total Positions: {positions.Count}");
        Console.WriteLine($"Total Profit: {positions.Profit:C2}");
        Console.WriteLine($"Average Profit %: {positions.AvgProfitPct:P2}");
        Console.WriteLine($"Average Bars Held: {positions.AvgBarsHeld:F2}");
        
        // Detailed position analysis
        foreach (var position in positions)
        {
            Console.WriteLine($"Position Profit: {position.Profit:C2}");
            Console.WriteLine($"Bars Held: {position.BarsHeld}");
        }
    }
}
```

## Best Practices

1. **Performance Analysis**
   - Use aggregate methods for quick performance insights
   - Combine with individual Position analysis for detailed understanding

2. **Metric Interpretation**
   - Consider context when interpreting average metrics
   - Look at both total and average performance
   - Account for outliers in the position list

3. **Filtering and Sorting**
   - Use LINQ or custom methods to filter positions
   - Analyze subsets of positions for more granular insights

## Example: Advanced Position List Analysis

```csharp
public class AdvancedPositionAnalysis
{
    public void AnalyzePositionPerformance(PositionList positions)
    {
        // Filter and analyze long positions
        var longPositions = positions
            .Where(p => p.PositionType == PositionType.Long)
            .ToList();
        
        // Filter and analyze short positions
        var shortPositions = positions
            .Where(p => p.PositionType == PositionType.Short)
            .ToList();
        
        Console.WriteLine("Long Positions Analysis:");
        PrintPositionAnalysis(longPositions);
        
        Console.WriteLine("\nShort Positions Analysis:");
        PrintPositionAnalysis(shortPositions);
    }
    
    private void PrintPositionAnalysis(List<Position> positions)
    {
        if (!positions.Any())
        {
            Console.WriteLine("No positions to analyze.");
            return;
        }
        
        Console.WriteLine($"Total Positions: {positions.Count}");
        Console.WriteLine($"Total Profit: {positions.Sum(p => p.Profit):C2}");
        Console.WriteLine($"Average Profit %: {positions.Average(p => p.ProfitPercent):P2}");
        Console.WriteLine($"Winning Trades: {positions.Count(p => p.Profit > 0)}");
        Console.WriteLine($"Losing Trades: {positions.Count(p => p.Profit <= 0)}");
    }
}
```

## Notes

- Provides convenient aggregation of Position metrics
- Useful for performance visualization and analysis
- Extends standard List functionality with trading-specific methods
- Supports both equity and futures trading modes 