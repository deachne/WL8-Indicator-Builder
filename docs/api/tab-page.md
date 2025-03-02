# TabPage Class

**Namespace:** WealthLab.WPF  
**Parent:** UserControl

The `TabPage` class is a specialized user interface component designed for creating custom tab pages within the WealthLab 8 Preferences tool. It provides a flexible framework for extensions to add custom configuration and settings pages.

## Overview

`TabPage` enables WL8 Extension developers to:
- Create custom preference pages
- Add dynamic tabs to the Preferences tool
- Implement custom initialization and cleanup logic
- Support expert mode toggles

## Methods and Properties

### Cleanup
```csharp
public virtual void Cleanup()
```
Performs cleanup operations when the tab page is closed.

**Use Cases:**
- Release resources
- Save unsaved settings
- Perform final configuration tasks

**Example:**
```csharp
public override void Cleanup()
{
    // Release any resources
    _configurationManager?.Dispose();
    
    // Save any pending changes
    SavePendingConfiguration();
}
```

### HelpToken
```csharp
public virtual string HelpToken
```
Specifies the help page to be opened when the user requests help from this tab page.

**Default Behavior:** Returns `TabText`

**Example:**
```csharp
public override string HelpToken => "CustomExtensionHelp";
```

### Initialize
```csharp
public virtual void Initialize()
```
Performs initialization tasks when the tab page is first opened.

**Use Cases:**
- Load initial configurations
- Set up UI components
- Prepare data sources

**Example:**
```csharp
public override void Initialize()
{
    // Load saved configurations
    LoadSavedSettings();
    
    // Initialize UI components
    SetupUserInterface();
    
    // Populate dropdown or list controls
    PopulateConfigurationOptions();
}
```

### SetExpertMode
```csharp
public virtual void SetExpertMode(bool expertModeOn)
```
Adjusts the user interface based on the current Expert Mode setting.

**Use Cases:**
- Show/hide advanced configuration options
- Enable/disable complex settings
- Modify UI complexity

**Example:**
```csharp
public override void SetExpertMode(bool expertModeOn)
{
    // Show advanced settings in expert mode
    advancedSettingsPanel.Visibility = expertModeOn 
        ? Visibility.Visible 
        : Visibility.Collapsed;
    
    // Enable/disable complex configuration options
    complexConfigurationOption.IsEnabled = expertModeOn;
}
```

### TabText
```csharp
public virtual string TabText
```
Defines the text displayed on the tab in the Preferences tool.

**Example:**
```csharp
public override string TabText => "My Extension Settings";
```

## Usage Example: Creating a Custom Preferences Tab

```csharp
public class MyExtensionPreferencesPage : TabPage
{
    private TextBox apiKeyTextBox;
    private CheckBox enableFeatureCheckBox;
    
    public MyExtensionPreferencesPage()
    {
        // Initialize UI components
        InitializeComponent();
    }
    
    public override string TabText => "My Extension";
    public override string HelpToken => "MyExtensionHelp";
    
    public override void Initialize()
    {
        // Load saved configuration
        apiKeyTextBox.Text = LoadSavedApiKey();
        enableFeatureCheckBox.IsChecked = LoadSavedFeatureState();
    }
    
    public override void Cleanup()
    {
        // Save configuration before closing
        SaveApiKey(apiKeyTextBox.Text);
        SaveFeatureState(enableFeatureCheckBox.IsChecked ?? false);
    }
    
    public override void SetExpertMode(bool expertModeOn)
    {
        // Show advanced settings in expert mode
        advancedSettingsPanel.Visibility = expertModeOn 
            ? Visibility.Visible 
            : Visibility.Collapsed;
    }
    
    private void InitializeComponent()
    {
        // WPF UI initialization logic
        apiKeyTextBox = new TextBox();
        enableFeatureCheckBox = new CheckBox();
        // ... additional UI setup
    }
}
```

## Best Practices

1. **Initialization**
   - Keep `Initialize()` method lightweight
   - Load configurations efficiently
   - Handle potential loading errors gracefully

2. **Expert Mode**
   - Provide meaningful UI changes
   - Don't hide critical configuration options
   - Maintain usability in both standard and expert modes

3. **Cleanup**
   - Always save important configurations
   - Release resources properly
   - Handle potential save failures

4. **Help Integration**
   - Provide clear, context-specific help tokens
   - Ensure help documentation is comprehensive

## Performance Considerations

- Minimize heavy processing in `Initialize()` and `Cleanup()`
- Use asynchronous loading for complex configurations
- Cache configuration data when possible

## Notes

- Part of WealthLab 8's extensible preferences system
- Enables rich, customizable extension configuration
- Supports dynamic UI adaptation
- Integrates seamlessly with WL8 Preferences tool

## Requirements

- Basic WPF knowledge
- Understanding of WealthLab 8 extension architecture
- Familiarity with user interface design principles 