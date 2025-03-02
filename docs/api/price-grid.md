# PriceGrid Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `PriceGrid` class provides a powerful utility for mapping price data into a 2D grid, enabling advanced pattern matching and comparative analysis of price data.

## Constructors

### PriceGrid(Width, Height)
```csharp
public PriceGrid(int width, int height)
```
Creates an empty grid with specified dimensions, initially filled with '.' characters.

**Parameters:**
- `width`: Number of columns in the grid
- `height`: Number of rows in the grid

### PriceGrid(Width, Height, BarHistory)
```csharp
public PriceGrid(int width, int height, BarHistory bars, int startIndex, int endIndex)
```
Creates a grid populated with price data from a specified range of a `BarHistory`.

**Parameters:**
- `width`: Number of columns in the grid
- `height`: Number of rows in the grid
- `bars`: `BarHistory` containing price data
- `startIndex`: Starting index of data range
- `endIndex`: Ending index of data range

**Grid Filling Logic:**
- Cells with data are marked with 'X'
- Cells without data are marked with '.'

## Core Properties

### Width
```csharp
public int Width
```
Returns the width (number of columns) of the PriceGrid.

### Height
```csharp
public int Height
```
Returns the height (number of rows) of the PriceGrid.

### Pictogram
```csharp
public string Pictogram
```
Returns a string representation of the grid, visualizing '.' and 'X' data.

## Grid Manipulation Methods

### Fill
```csharp
public void Fill(char c)
public void Fill(BarHistory bars, int startIndex, int endIndex)
```
Two overloads for filling the grid:
1. Fill entire grid with a specified character
2. Fill grid with price data from a `BarHistory` range

## Comparison and Persistence

### Compare
```csharp
public double Compare(PriceGrid pg, bool legacyCompareLogic = false)
```
Compares two `PriceGrid` instances with matching dimensions.

**Return Value:**
- Percentage of matching cells (0-100)

**Comparison Modes:**
- **New Logic (default):** 
  - Compares only cells with data in the base grid
  - More accurate, generally lower scores
- **Legacy Logic:** 
  - Compares each cell, including empty spaces
  - Higher scores due to matching empty cells

### Persist
```csharp
public string Persist()
```
Returns a string representation of the grid for later reconstruction.

### Parse (Static Method)
```csharp
public static PriceGrid Parse(string s)
```
Reconstructs a `PriceGrid` from a persisted string.

**Persist String Format:**
`Width,Height,StartChar,{Count1, Count2, ..., CountN}`

## Usage Examples

### Basic Grid Creation and Comparison
```csharp
public class PricePatternAnalyzer
{
    public void AnalyzePricePatterns(BarHistory bars)
    {
        // Create price grids for different periods
        var recentGrid = new PriceGrid(10, 10, bars, 0, 100);
        var historicalGrid = new PriceGrid(10, 10, bars, 200, 300);

        // Compare grid patterns
        double similarityScore = recentGrid.Compare(historicalGrid);
        Console.WriteLine($"Pattern Similarity: {similarityScore}%");

        // Visualize grid
        Console.WriteLine(recentGrid.Pictogram);
    }
}
```

### Advanced Pattern Matching
```csharp
public class PatternMatcher
{
    public bool FindRepeatingPattern(BarHistory bars)
    {
        // Create multiple grids from different periods
        var grids = new List<PriceGrid>();
        for (int i = 0; i < bars.Count; i += 100)
        {
            var grid = new PriceGrid(10, 10, bars, i, i + 100);
            grids.Add(grid);
        }

        // Compare grids for similar patterns
        for (int i = 0; i < grids.Count; i++)
        {
            for (int j = i + 1; j < grids.Count; j++)
            {
                double similarity = grids[i].Compare(grids[j]);
                if (similarity > 75)
                {
                    Console.WriteLine($"Similar patterns found: {similarity}%");
                    return true;
                }
            }
        }

        return false;
    }
}
```

## Best Practices

1. **Grid Sizing**
   - Choose grid dimensions carefully
   - Ensure meaningful representation of price data

2. **Comparison Techniques**
   - Use default comparison logic for more accurate results
   - Consider legacy logic for specific use cases
   - Validate pattern matching across different market conditions

3. **Performance**
   - Limit grid size for large datasets
   - Cache and reuse grids when possible
   - Optimize comparison algorithms

## Notes

- Powerful tool for price pattern recognition
- Supports flexible grid-based price data analysis
- Useful in technical analysis and trading strategy development
- Provides both visual and numerical pattern comparison 