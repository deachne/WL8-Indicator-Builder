# SavedOptimizationResults Class

**Namespace:** WealthLab.Backtest  
**Parent:** Object

The `SavedOptimizationResults` class encapsulates comprehensive information about a saved optimization run, providing detailed insights into the optimization process, settings, and results.

## Constructors

### Default Constructor
```csharp
public SavedOptimizationResults()
```
Creates an empty `SavedOptimizationResults` instance.

### Standard Optimization Constructor
```csharp
public SavedOptimizationResults(Strategy s, OptimizerBase opt)
```
Creates an instance for a standard optimization run.

**Parameters:**
- `s`: The `Strategy` that was optimized
- `opt`: The `OptimizerBase` used for optimization

### Walk Forward Optimization Constructor
```csharp
public SavedOptimizationResults(Strategy s, OptimizerBase opt, WFOOptimizer wfo)
```
Creates an instance for a Walk Forward Optimization (WFO) run.

**Parameters:**
- `s`: The `Strategy` that was optimized
- `opt`: The `OptimizerBase` used for optimization
- `wfo`: The `WFOOptimizer` used for Walk Forward Optimization

## Persistence Methods

### Persist
```csharp
public string Persist()
```
Converts the optimization results into an encoded string format that can be stored or transmitted.

**Returns:** A string representation of the optimization results.

### Parse (Static Method)
```csharp
public static SavedOptimizationResults Parse(string s)
```
Reconstructs a `SavedOptimizationResults` instance from a previously persisted string.

**Parameters:**
- `s`: The encoded string representation of optimization results

**Returns:** A new `SavedOptimizationResults` instance

## Key Properties

### Optimization Metadata

#### RunType
```csharp
public OptimizationRunType RunType
```
Indicates the type of optimization:
- `Standard`
- `WFO` (Walk Forward Optimization)
- `SymbolBySymbol`

#### IsComplete
```csharp
public bool IsComplete
```
Indicates whether the optimization run was fully completed or paused.

### Strategy and Optimization Details

#### Strategy
```csharp
public Strategy Strategy
```
The `Strategy` instance that was optimized.

#### StrategyParameters
```csharp
public ParameterList StrategyParameters
```
Strategy parameters at the time of optimization, with `IsChecked` property reflecting enabled parameter checkboxes.

#### Optimizer
```csharp
public OptimizerBase Optimizer
```
The optimization method used.

#### OptimizerParameters
```csharp
public ParameterList OptimizerParameters
```
Parameters used for the optimizer.

### Backtest Configuration

#### BacktestSettings
```csharp
public BacktestSettings BacktestSettings
```
Backtest settings used during optimization runs.

#### PositionSize
```csharp
public PositionSize PositionSize
```
Position sizing configuration used during optimization.

#### DataRange
```csharp
public DataRange DataRange
```
The date range used for optimization.

#### Scale
```csharp
public HistoryScale Scale
```
The data scale (e.g., daily, weekly) used during optimization.

### Symbol and Dataset Properties

#### SingleSymbol
```csharp
public bool SingleSymbol
```
Indicates whether optimization was performed on a single symbol or a dataset.

#### Symbol
```csharp
public string Symbol
```
The symbol used if `SingleSymbol` is true.

#### DataSetName
```csharp
public string DataSetName
```
The name of the dataset used if `SingleSymbol` is false.

#### BenchmarkSymbol
```csharp
public string BenchmarkSymbol
```
The benchmark symbol used during optimization.

### Results Properties

#### Results
```csharp
public OptimizationResultList Results
```
Contains optimization results for standard or WFO runs.

#### SymBySym
```csharp
public Dictionary<string, OptimizationResultList> SymBySym
```
Contains optimization results by symbol for Symbol-by-Symbol runs.

#### WFOOptimizer
```csharp
public WFOOptimizer WFOOptimizer
```
The Walk Forward Optimizer used (if applicable).

## Usage Examples

### Saving and Restoring Optimization Results
```csharp
public class OptimizationResultManager
{
    public void SaveOptimizationResults(SavedOptimizationResults results)
    {
        // Persist results to a file or database
        string encodedResults = results.Persist();
        File.WriteAllText("optimization_results.txt", encodedResults);
    }

    public SavedOptimizationResults LoadOptimizationResults()
    {
        // Restore results from a file
        string encodedResults = File.ReadAllText("optimization_results.txt");
        return SavedOptimizationResults.Parse(encodedResults);
    }
}
```

### Analyzing Optimization Results
```csharp
public class OptimizationAnalyzer
{
    public void AnalyzeResults(SavedOptimizationResults savedResults)
    {
        Console.WriteLine($"Optimization Type: {savedResults.RunType}");
        Console.WriteLine($"Strategy: {savedResults.Strategy.Name}");
        Console.WriteLine($"Is Complete: {savedResults.IsComplete}");

        // Analyze results based on run type
        switch (savedResults.RunType)
        {
            case OptimizationRunType.Standard:
                AnalyzeStandardResults(savedResults.Results);
                break;
            case OptimizationRunType.WFO:
                AnalyzeWFOResults(savedResults.Results, savedResults.WFOOptimizer);
                break;
            case OptimizationRunType.SymbolBySymbol:
                AnalyzeSymbolResults(savedResults.SymBySym);
                break;
        }
    }

    private void AnalyzeStandardResults(OptimizationResultList results)
    {
        // Implement standard result analysis
    }

    private void AnalyzeWFOResults(OptimizationResultList results, WFOOptimizer wfoOptimizer)
    {
        // Implement WFO result analysis
    }

    private void AnalyzeSymbolResults(Dictionary<string, OptimizationResultList> symbolResults)
    {
        // Implement symbol-by-symbol result analysis
    }
}
```

## Best Practices

1. **Result Persistence**
   - Use `Persist()` and `Parse()` for saving and loading results
   - Store results in a secure, version-controlled manner

2. **Result Analysis**
   - Check `RunType` before processing results
   - Handle different optimization scenarios
   - Validate results before further processing

3. **Performance Considerations**
   - Be mindful of memory usage with large result sets
   - Use efficient data structures for result storage
   - Implement lazy loading if necessary

## Notes

- Comprehensive snapshot of an optimization run
- Supports multiple optimization types
- Provides detailed metadata and results
- Enables result persistence and analysis
- Flexible design for various optimization scenarios

## Requirements

- Understanding of WealthLab optimization processes
- Familiarity with strategy and optimization concepts
- Knowledge of .NET collections and serialization 