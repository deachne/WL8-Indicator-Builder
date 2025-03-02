# ICustomSettingsHost Interface

**Namespace:** WealthLab.Data

The `ICustomSettingsHost` interface enables communication between a `CustomSettingsPanel` and the WealthLab 8 Data Manager. It provides a mechanism for notifying the host about configuration changes made in the user interface.

## Methods

### ConfigChanged
```csharp
void ConfigChanged(string config)
```
Notifies the WealthLab 8 Data Manager that the configuration has been modified.

**Parameters:**
- `config`: A string representing the current configuration state

## Usage Examples

### Basic Usage in CustomSettingsPanel
```csharp
public class MyProviderSettingsPanel : CustomSettingsPanel
{
    private TextBox apiKeyTextBox;
    private CheckBox enableLoggingCheckBox;
    
    public MyProviderSettingsPanel()
    {
        // Create UI components
        apiKeyTextBox = new TextBox();
        enableLoggingCheckBox = new CheckBox();
        
        // Wire up change events
        apiKeyTextBox.TextChanged += OnConfigurationChanged;
        enableLoggingCheckBox.Checked += OnConfigurationChanged;
        enableLoggingCheckBox.Unchecked += OnConfigurationChanged;
    }
    
    private void OnConfigurationChanged(object sender, EventArgs e)
    {
        // Notify host of configuration change
        SettingsHost?.ConfigChanged(GetConfigFromUI());
    }
    
    public override string GetConfigFromUI()
    {
        // Serialize current UI state to configuration string
        var config = new
        {
            ApiKey = apiKeyTextBox.Text,
            EnableLogging = enableLoggingCheckBox.IsChecked
        };
        
        return JsonSerializer.Serialize(config);
    }
}
```

### Advanced Configuration Management
```csharp
public class ComplexProviderSettingsPanel : CustomSettingsPanel
{
    private Dictionary<string, Control> _configControls;
    
    public ComplexProviderSettingsPanel()
    {
        _configControls = new Dictionary<string, Control>();
        InitializeComponents();
    }
    
    private void InitializeComponents()
    {
        // Create and wire up various configuration controls
        AddTextBoxSetting("ApiKey", "API Key");
        AddComboBoxSetting("Environment", "Environment", 
            new[] { "Production", "Staging", "Development" });
        AddNumericSetting("Timeout", "Connection Timeout");
        
        // Add change handlers to all controls
        foreach (var control in _configControls.Values)
        {
            if (control is TextBox tb)
                tb.TextChanged += OnConfigurationChanged;
            else if (control is ComboBox cb)
                cb.SelectionChanged += OnConfigurationChanged;
            // Add more control type handlers as needed
        }
    }
    
    private void OnConfigurationChanged(object sender, EventArgs e)
    {
        // Validate and notify host
        string config = GetConfigFromUI();
        if (!string.IsNullOrEmpty(config))
        {
            SettingsHost?.ConfigChanged(config);
        }
    }
    
    public override string GetConfigFromUI()
    {
        var config = new Dictionary<string, object>();
        
        foreach (var kvp in _configControls)
        {
            config[kvp.Key] = GetControlValue(kvp.Value);
        }
        
        return JsonSerializer.Serialize(config);
    }
    
    private object GetControlValue(Control control)
    {
        return control switch
        {
            TextBox tb => tb.Text,
            ComboBox cb => cb.SelectedItem,
            NumericUpDown nud => nud.Value,
            CheckBox chk => chk.IsChecked,
            _ => null
        };
    }
}
```

### Validation and Conditional Notification
```csharp
public class SecureProviderSettingsPanel : CustomSettingsPanel
{
    private TextBox apiKeyTextBox;
    private TextBox endpointTextBox;
    
    public SecureProviderSettingsPanel()
    {
        InitializeComponents();
    }
    
    private void InitializeComponents()
    {
        apiKeyTextBox = new TextBox();
        endpointTextBox = new TextBox();
        
        // Add change handlers
        apiKeyTextBox.TextChanged += ValidateAndNotify;
        endpointTextBox.TextChanged += ValidateAndNotify;
    }
    
    private void ValidateAndNotify(object sender, EventArgs e)
    {
        // Perform validation before notifying
        if (ValidateSettings())
        {
            string config = GetConfigFromUI();
            SettingsHost?.ConfigChanged(config);
        }
    }
    
    private bool ValidateSettings()
    {
        bool isValid = true;
        
        // Validate API Key
        if (string.IsNullOrWhiteSpace(apiKeyTextBox.Text))
        {
            // Show error or set validation state
            isValid = false;
        }
        
        // Validate Endpoint
        if (!Uri.TryCreate(endpointTextBox.Text, UriKind.Absolute, out _))
        {
            // Show error or set validation state
            isValid = false;
        }
        
        return isValid;
    }
    
    public override string GetConfigFromUI()
    {
        return JsonSerializer.Serialize(new
        {
            ApiKey = apiKeyTextBox.Text,
            Endpoint = endpointTextBox.Text
        });
    }
}
```

## Best Practices

1. Always validate configuration before calling `ConfigChanged()`
2. Use a consistent serialization method (e.g., JSON)
3. Handle different control types appropriately
4. Provide clear feedback for invalid configurations
5. Minimize unnecessary notifications

## Potential Pitfalls

- Avoid calling `ConfigChanged()` during initialization
- Be careful with recursive event handling
- Ensure thread-safety in complex scenarios
- Handle null or empty configuration strings 