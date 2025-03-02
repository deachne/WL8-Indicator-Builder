# ICustomSettingsEditor Interface

**Namespace:** WealthLab.WPF

The `ICustomSettingsEditor` interface enables creation of custom settings editors for WealthLab 8 components such as Historical Data Providers or Broker Providers. To implement a custom editor:
1. Create a WPF `UserControl` that implements this interface
2. Create a class derived from `ObjectEditorBase` with the same name as your component
3. Return your editor instance from that class's `GetCustomSettingsEditor` method

## Properties

### ConfigString
```csharp
string ConfigString { get; set; }
```
Represents the persisted configuration state of the editor.

- **Get**: Should return a string representing the current UI state
- **Set**: Should initialize the UI based on the provided configuration string

### Host
```csharp
ICustomSettingsHost Host { get; }
```
Provides access to the host control containing the editor panel. Call `Host.ConfigChanged()` whenever the user modifies any UI element in your editor.

## Usage Examples

### Basic Settings Editor
```csharp
public class MyProviderSettingsEditor : UserControl, ICustomSettingsEditor
{
    private TextBox apiKeyBox;
    private CheckBox enableLoggingBox;
    
    public MyProviderSettingsEditor()
    {
        InitializeComponents();
        
        // Wire up change handlers
        apiKeyBox.TextChanged += (s, e) => Host?.ConfigChanged();
        enableLoggingBox.Checked += (s, e) => Host?.ConfigChanged();
    }
    
    public string ConfigString
    {
        get
        {
            // Serialize settings to string
            var config = new
            {
                ApiKey = apiKeyBox.Text,
                EnableLogging = enableLoggingBox.IsChecked
            };
            return JsonSerializer.Serialize(config);
        }
        set
        {
            if (string.IsNullOrEmpty(value))
                return;
                
            // Deserialize and populate UI
            var config = JsonSerializer.Deserialize<dynamic>(value);
            apiKeyBox.Text = config.ApiKey;
            enableLoggingBox.IsChecked = config.EnableLogging;
        }
    }
    
    public ICustomSettingsHost Host { get; private set; }
    
    private void InitializeComponents()
    {
        var panel = new StackPanel();
        
        // API Key input
        panel.Children.Add(new Label { Content = "API Key:" });
        apiKeyBox = new TextBox();
        panel.Children.Add(apiKeyBox);
        
        // Logging toggle
        enableLoggingBox = new CheckBox { Content = "Enable Logging" };
        panel.Children.Add(enableLoggingBox);
        
        Content = panel;
    }
}
```

### Editor Registration
```csharp
public class MyProviderEditor : ObjectEditorBase
{
    public override string Name => "MyProvider";
    
    public override FrameworkElement GetCustomSettingsEditor()
    {
        return new MyProviderSettingsEditor();
    }
}
```

### Advanced Settings Editor
```csharp
public class AdvancedProviderSettingsEditor : UserControl, ICustomSettingsEditor
{
    private readonly Dictionary<string, Control> _controls;
    private bool _isInitializing;
    
    public AdvancedProviderSettingsEditor()
    {
        _controls = new Dictionary<string, Control>();
        _isInitializing = false;
        
        InitializeComponents();
    }
    
    public string ConfigString
    {
        get
        {
            var settings = new Dictionary<string, object>();
            
            foreach (var kvp in _controls)
            {
                settings[kvp.Key] = GetControlValue(kvp.Value);
            }
            
            return JsonSerializer.Serialize(settings);
        }
        set
        {
            if (string.IsNullOrEmpty(value))
                return;
                
            try
            {
                _isInitializing = true;
                var settings = JsonSerializer.Deserialize<Dictionary<string, object>>(value);
                
                foreach (var kvp in settings)
                {
                    if (_controls.TryGetValue(kvp.Key, out var control))
                    {
                        SetControlValue(control, kvp.Value);
                    }
                }
            }
            finally
            {
                _isInitializing = false;
            }
        }
    }
    
    public ICustomSettingsHost Host { get; private set; }
    
    private void InitializeComponents()
    {
        var panel = new StackPanel();
        
        // Add various controls
        AddTextSetting(panel, "ApiKey", "API Key:");
        AddPasswordSetting(panel, "Secret", "API Secret:");
        AddComboSetting(panel, "Environment", "Environment:", 
            new[] { "Production", "Sandbox" });
        AddNumericSetting(panel, "Timeout", "Timeout (seconds):", 30);
        AddCheckboxSetting(panel, "EnableLogging", "Enable Logging");
        
        Content = panel;
    }
    
    private void AddTextSetting(Panel panel, string key, string label)
    {
        panel.Children.Add(new Label { Content = label });
        var textBox = new TextBox();
        textBox.TextChanged += (s, e) => 
        {
            if (!_isInitializing)
                Host?.ConfigChanged();
        };
        _controls[key] = textBox;
        panel.Children.Add(textBox);
    }
    
    private void AddPasswordSetting(Panel panel, string key, string label)
    {
        panel.Children.Add(new Label { Content = label });
        var passwordBox = new PasswordBox();
        passwordBox.PasswordChanged += (s, e) => 
        {
            if (!_isInitializing)
                Host?.ConfigChanged();
        };
        _controls[key] = passwordBox;
        panel.Children.Add(passwordBox);
    }
    
    private object GetControlValue(Control control)
    {
        return control switch
        {
            TextBox tb => tb.Text,
            PasswordBox pb => pb.Password,
            ComboBox cb => cb.SelectedItem,
            CheckBox chk => chk.IsChecked,
            NumericUpDown nud => nud.Value,
            _ => null
        };
    }
    
    private void SetControlValue(Control control, object value)
    {
        switch (control)
        {
            case TextBox tb:
                tb.Text = value?.ToString();
                break;
            case PasswordBox pb:
                pb.Password = value?.ToString();
                break;
            case ComboBox cb:
                cb.SelectedItem = value;
                break;
            case CheckBox chk:
                chk.IsChecked = value as bool?;
                break;
            case NumericUpDown nud:
                nud.Value = Convert.ToDecimal(value);
                break;
        }
    }
}
```

This example demonstrates:
- Creating a custom settings editor
- Managing multiple control types
- Serialization/deserialization of settings
- Change notification handling
- Proper editor registration

### Validation Example
```csharp
public class ValidatingSettingsEditor : UserControl, ICustomSettingsEditor
{
    private TextBox apiKeyBox;
    private TextBox endpointBox;
    private readonly ErrorProvider _errorProvider;
    
    public ValidatingSettingsEditor()
    {
        _errorProvider = new ErrorProvider();
        InitializeComponents();
    }
    
    public string ConfigString
    {
        get
        {
            if (!ValidateSettings())
                return null;
                
            var config = new
            {
                ApiKey = apiKeyBox.Text,
                Endpoint = endpointBox.Text
            };
            return JsonSerializer.Serialize(config);
        }
        set
        {
            if (string.IsNullOrEmpty(value))
                return;
                
            var config = JsonSerializer.Deserialize<dynamic>(value);
            apiKeyBox.Text = config.ApiKey;
            endpointBox.Text = config.Endpoint;
        }
    }
    
    private bool ValidateSettings()
    {
        bool isValid = true;
        
        // Validate API Key
        if (string.IsNullOrEmpty(apiKeyBox.Text))
        {
            _errorProvider.SetError(apiKeyBox, "API Key is required");
            isValid = false;
        }
        else
        {
            _errorProvider.SetError(apiKeyBox, null);
        }
        
        // Validate Endpoint
        if (!Uri.TryCreate(endpointBox.Text, UriKind.Absolute, out _))
        {
            _errorProvider.SetError(endpointBox, "Invalid endpoint URL");
            isValid = false;
        }
        else
        {
            _errorProvider.SetError(endpointBox, null);
        }
        
        return isValid;
    }
}
```

This example demonstrates:
- Input validation
- Error reporting
- Conditional configuration saving 