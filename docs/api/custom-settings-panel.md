# CustomSettingsPanel Class

**Namespace:** WealthLab.Data  
**Parent:** UserControl

The `CustomSettingsPanel` class enables Historical Data Provider extension authors to define their own configuration user interface for their Provider in the Data Manager.

## Members

### GetConfigFromUI
```csharp
public virtual string GetConfigFromUI
```
Override this method to return a single string that represents the configuration state of your `CustomSettingsPanel` user interface. This string should contain all necessary information to restore the UI state later.

### Provider
```csharp
public ProviderBase Provider
```
Contains the instance of the `DataProviderBase` that instantiated this `CustomSettingsPanel`. Use this to access the provider's properties and methods.

### SettingsHost
```csharp
public ICustomSettingsHost SettingsHost
```
Returns an instance of the `ICustomSettingsHost` interface, which allows the `CustomSettingsPanel` to communicate back to the WL8 Data Manager when the user changes something in the user interface. Call this whenever an input field in the `CustomSettingsPanel` UI is modified by the user.

### UpdateUIFromConfig
```csharp
public virtual void UpdateUIFromConfig(string config)
```
Override this method to take the incoming configuration string (config parameter) and populate the values of your `CustomSettingsPanel` user interface. This is called when the panel needs to restore its state from a saved configuration.

## Usage Example

```csharp
public class MyProviderSettingsPanel : CustomSettingsPanel
{
    private TextBox apiKeyTextBox;

    public MyProviderSettingsPanel()
    {
        // Create your UI elements
        apiKeyTextBox = new TextBox();
        apiKeyTextBox.TextChanged += (s, e) => 
        {
            // Notify WL8 of changes
            SettingsHost?.SettingsChanged();
        };
    }

    public override string GetConfigFromUI()
    {
        // Return configuration as string
        return apiKeyTextBox.Text;
    }

    public override void UpdateUIFromConfig(string config)
    {
        // Restore UI state from config
        apiKeyTextBox.Text = config;
    }
} 