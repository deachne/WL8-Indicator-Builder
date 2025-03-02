# IBulkUpdateHost Interface

**Namespace:** WealthLab.Data

The `IBulkUpdateHost` interface is part of the Historical Data Provider extension API. It provides methods for communicating with WealthLab 8 during a Provider Update operation, allowing providers to report progress and completion status.

## Methods

### BulkUpdateCompleted
```csharp
void BulkUpdateCompleted()
```
Notifies WealthLab 8 that the Historical Provider update operation has completed.

### WriteToBulkUpdateLog
```csharp
void WriteToBulkUpdateLog(string msg)
```
Writes a message to the WealthLab 8 Data Manager Historical Provider update log.

**Parameters:**
- `msg`: The message to write to the update log

## Usage Examples

### Basic Provider Update
```csharp
public class MyHistoricalProvider : ProviderBase
{
    public override void Update(IBulkUpdateHost host)
    {
        try
        {
            // Log start of update
            host.WriteToBulkUpdateLog("Starting data update...");
            
            // Perform update operations
            UpdateSymbol("AAPL", host);
            UpdateSymbol("MSFT", host);
            
            // Log completion
            host.WriteToBulkUpdateLog("Update completed successfully");
            host.BulkUpdateCompleted();
        }
        catch (Exception ex)
        {
            host.WriteToBulkUpdateLog($"Error during update: {ex.Message}");
            throw;
        }
    }
    
    private void UpdateSymbol(string symbol, IBulkUpdateHost host)
    {
        host.WriteToBulkUpdateLog($"Updating {symbol}...");
        // Update implementation
    }
}
```

### Progress Reporting
```csharp
public class ProgressTrackingProvider : ProviderBase
{
    public override void Update(IBulkUpdateHost host)
    {
        var symbols = new[] { "AAPL", "MSFT", "GOOGL", "AMZN" };
        int total = symbols.Length;
        
        host.WriteToBulkUpdateLog($"Beginning update for {total} symbols");
        
        for (int i = 0; i < symbols.Length; i++)
        {
            string symbol = symbols[i];
            int percent = ((i + 1) * 100) / total;
            
            host.WriteToBulkUpdateLog($"Processing {symbol} ({percent}% complete)");
            
            // Update implementation
            
            if (i == symbols.Length - 1)
            {
                host.WriteToBulkUpdateLog("All symbols processed");
                host.BulkUpdateCompleted();
            }
        }
    }
}
```

### Error Handling
```csharp
public class RobustProvider : ProviderBase
{
    public override void Update(IBulkUpdateHost host)
    {
        var symbols = GetSymbols();
        var failedSymbols = new List<string>();
        
        foreach (string symbol in symbols)
        {
            try
            {
                host.WriteToBulkUpdateLog($"Processing {symbol}");
                UpdateSymbol(symbol);
            }
            catch (Exception ex)
            {
                host.WriteToBulkUpdateLog($"Error updating {symbol}: {ex.Message}");
                failedSymbols.Add(symbol);
                continue;
            }
        }
        
        // Report results
        if (failedSymbols.Any())
        {
            host.WriteToBulkUpdateLog($"Update completed with {failedSymbols.Count} failures:");
            foreach (var symbol in failedSymbols)
            {
                host.WriteToBulkUpdateLog($"- Failed: {symbol}");
            }
        }
        else
        {
            host.WriteToBulkUpdateLog("Update completed successfully");
        }
        
        host.BulkUpdateCompleted();
    }
}
```

This example demonstrates:
- Proper update flow control
- Progress reporting
- Error handling and logging
- Completion notification 