# IHost Interface

**Namespace:** WealthLab.Core

The `IHost` interface provides access to core WealthLab 8 environment services and utilities. You can access the singleton instance through `WLHost.Instance`.

## Logging and Messaging Methods

### AddLogItem
```csharp
void AddLogItem(
    string senderName, 
    string msg, 
    WLColor color, 
    Exception ex = null, 
    object sender = null
)
```
Logs a status update or exception to WealthLab's status bar and log viewer.

**Parameters:**
- `senderName`: Name of the extension or component
- `msg`: Message to log
- `color`: Color indicator for the log entry
- `ex`: Optional exception details
- `sender`: Optional sender instance (used primarily for streaming providers)

### AddLogItemOrders
```csharp
void AddLogItemOrders(
    string senderName, 
    string msg, 
    WLColor color, 
    Exception ex = null
)
```
Logs broker-related messages to the Order Manager and log viewer.

## Environment and System Information

### AppFolder
```csharp
string AppFolder
```
Returns the WealthLab 8 installation directory.

### DataFolder
```csharp
string DataFolder
```
Returns the WealthLab 8 user data directory.

### LocalUserName
```csharp
string LocalUserName
```
Returns the current user's name.

### WLBuildNumber
```csharp
int WLBuildNumber
```
Returns the current WealthLab 8 build number.

## Configuration and Settings

### ExpertMode
```csharp
bool ExpertMode
```
Indicates if WealthLab is running in Expert Mode.

### OfflineMode
```csharp
bool OfflineMode
```
Indicates if WealthLab is running in offline mode.

### Settings
```csharp
SettingsManager Settings
```
Provides access to WealthLab settings management.

## Data and Resource Management

### DataSets
```csharp
List<DataSet> DataSets
```
Returns a list of available DataSets.

### FindDataSet
```csharp
DataSet FindDataSet(string name)
```
Searches for a DataSet by name.

### FindMarket
```csharp
MarketDetails FindMarket(string symbol)
```
Returns market details for a given symbol.

## Historical Data Retrieval

### GetHistory
```csharp
BarHistory GetHistory(
    string symbol, 
    HistoryScale scale, 
    DateTime startDate, 
    DateTime endDate, 
    int maxBars, 
    DataRequestOptions cb
)
```
Retrieves historical price data for a symbol.

### GetHistories
```csharp
List<BarHistory> GetHistories(
    List<string> symbols, 
    HistoryScale scale, 
    DateTime start, 
    DateTime end, 
    int maxBars, 
    DataRequestOptions hcb
)
```
Retrieves historical price data for multiple symbols.

## User Interaction Methods

### DisplayMessage
```csharp
void DisplayMessage(string msg)
```
Displays a message box to the user.

### ConfigureItem
```csharp
bool ConfigureItem(Configurable c)
```
Shows a configuration dialog for a configurable object.

### ConfigureParameters
```csharp
bool ConfigureParameters(ParameterList pl, string title)
```
Shows a configuration dialog for a parameter list.

### ShowWaitStatus
```csharp
void ShowWaitStatus(bool wait)
```
Toggles hourglass/arrow cursor.

## Extension and Platform Support

### ExecutePlatformMethod
```csharp
object ExecutePlatformMethod(
    string callerName, 
    string methodName, 
    object parameter
)
```
Executes platform-specific methods for cross-platform extensions.

### InjectSourceCodeCompilerReferences
```csharp
void InjectSourceCodeCompilerReferences(UniqueList<string> asmRef)
```
Adds assembly references for dynamic source code compilation.

## Usage Examples

### Logging
```csharp
public class MyExtension : Extension
{
    public void ProcessData()
    {
        try 
        {
            // Processing logic
            WLHost.Instance.AddLogItem(
                "MyExtension", 
                "Data processed successfully", 
                WLColor.Green
            );
        }
        catch (Exception ex)
        {
            WLHost.Instance.AddLogItem(
                "MyExtension", 
                "Error processing data", 
                WLColor.Red, 
                ex
            );
        }
    }
}
```

### Data Retrieval
```csharp
public class StrategyHelper
{
    public BarHistory GetSymbolData(string symbol)
    {
        return WLHost.Instance.GetHistory(
            symbol, 
            HistoryScale.Daily, 
            DateTime.Now.AddYears(-1), 
            DateTime.Now, 
            0, 
            null
        );
    }
}
```

### Configuration
```csharp
public class ProviderConfig
{
    public void ConfigureProvider()
    {
        var myProvider = new MyDataProvider();
        
        // Show configuration dialog
        if (WLHost.Instance.ConfigureItem(myProvider))
        {
            // Configuration was modified
            myProvider.SaveConfig();
        }
    }
}
```

### Cross-Platform Method Execution
```csharp
public class CoreLogic
{
    public void InitializePlatformSpecificUI()
    {
        // Execute a method in the platform-specific assembly
        WLHost.Instance.ExecutePlatformMethod(
            "MyExtension", 
            "InitializeUI", 
            null
        );
    }
}
```

## Best Practices

1. Use `WLHost.Instance` for accessing system services
2. Log important events and errors
3. Handle exceptions gracefully
4. Use platform-specific methods carefully
5. Respect user's Expert and Offline mode settings 