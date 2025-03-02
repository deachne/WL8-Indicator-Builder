# UI Elements for WL8 Extensions

This document details how to provide user interface elements for WL8 Extensions. WL8 enforces a separation of core logic components and user-interface (WPF) components to support cross-platform development.

## Architecture Overview

WL8 uses two main assemblies:
- `WealthLab.Core`: Platform-neutral core logic library
- `WealthLab.WPF`: Windows-specific UI components

The bridge between logical components and their editors is established through classes deriving from `ObjectEditorBase`. This provides several integration points:

1. Custom Settings panels for configurable components
2. New DataSet Wizard pages for Historical Data Providers
3. BarGlyphs for Event Providers to display Events uniquely
4. Platform Methods for cross-platform functionality

## Developing an ObjectEditorBase Class

If your components need custom configuration or WL8 UI interaction, create a class derived from `ObjectEditorBase`. The `Name` property must match exactly the `Name` of the component you're supporting.

Example:
```csharp
public class MyProviderEditor : ObjectEditorBase
{
    public override string Name => "My Provider";  // Must match component's Name
}
```

## Custom Editor Panels

### Configuration Modes

The `Configurable` base class supports two modes via `ConfigurableType`:

1. `ParameterList`:
   - Uses `Parameters` property containing `Parameter` instances
   - Parameters created in `GenerateParameters` method
   - Default Parameter Editor Panel provided by WL8

2. `VanillaString`:
   - Uses single `Configuration` string property
   - Requires custom Editor Panel implementation

### When to Create Custom Editor Panels

Create a custom Editor Panel when:
- Using `VanillaString` configuration mode
- Need specialized UI beyond standard Parameter Editor
- Want to provide enhanced user experience

### Implementing Custom Editor

```csharp
public override ICustomSettingsEditor GetCustomSettingsEditor()
{
    return new MyCustomEditorPanel();  // Your WPF UserControl implementing ICustomSettingsEditor
}
```

## New DataSet Wizard Pages

### Purpose
Allows Historical Data Providers to integrate with WL8's New DataSet Wizard for custom configuration.

### Key Methods

#### Initialization
```csharp
public override void InitializeNewDataSetWizard(DataSet ds = null)
{
    // Initialize wizard pages
    if (ds != null)
    {
        // Populate controls based on ds.DSString
    }
}
```

#### Page Navigation
```csharp
public override UserControl GetFirstWizardPage()
{
    return new MyFirstWizardPage();
}

public override bool CanAdvanceToNextPage(UserControl page, ref string errorMessage)
{
    // Validate current page
    if (!isValid)
    {
        errorMessage = "Please correct...";
        return false;
    }
    return true;
}

public override UserControl GetNextWizardPage(UserControl page)
{
    if (page is MyFirstWizardPage)
        return new MySecondWizardPage();
    return null;  // No more pages
}

public override bool IsLastWizardPage(UserControl page)
{
    return page is MyLastWizardPage;
}
```

#### Configuration String
```csharp
public override string GetWizardDSString()
{
    // Return configuration based on wizard page inputs
    return $"setting1={value1};setting2={value2}";
}
```

## BarGlyphs for Events

### Custom Event Visualization
Event Providers can customize event visualization on charts by implementing:

```csharp
public override object GetEventBarGlyph(EventDataPoint edp)
{
    switch (edp.Name)
    {
        case "CustomEvent":
            return new MyCustomBarGlyph();
        default:
            return null;  // Use default glyph
    }
}
```

## Platform Methods

### Cross-Platform Functionality
Enables platform-specific operations from platform-neutral code:

```csharp
public override object ExecutePlatformMethod(string methodName, object parameter)
{
    switch (methodName)
    {
        case "OpenDialog":
            return ShowCustomDialog(parameter as string);
        case "SaveFile":
            return HandleFileSave(parameter);
        default:
            return null;
    }
}
```

### Example Usage
From platform-neutral code:
```csharp
bool success = (bool)WLHost.Instance.ExecutePlatformMethod("OpenDialog", "Message");
```

## Example Implementation

Below is a complete example of a custom editor for a Historical Data Provider:

```csharp
public class MyProviderEditor : ObjectEditorBase
{
    private MyWizardPage _wizardPage;
    
    public override string Name => "My Provider";
    
    public override void InitializeNewDataSetWizard(DataSet ds = null)
    {
        _wizardPage = new MyWizardPage();
        if (ds != null)
        {
            // Parse ds.DSString and populate wizard page
            var settings = ParseDSString(ds.DSString);
            _wizardPage.PopulateControls(settings);
        }
    }
    
    public override UserControl GetFirstWizardPage()
    {
        return _wizardPage;
    }
    
    public override bool CanAdvanceToNextPage(UserControl page, ref string errorMessage)
    {
        if (!_wizardPage.ValidateInputs())
        {
            errorMessage = "Please enter required settings";
            return false;
        }
        return true;
    }
    
    public override string GetWizardDSString()
    {
        return _wizardPage.GenerateConfigString();
    }
    
    public override ICustomSettingsEditor GetCustomSettingsEditor()
    {
        return new MyCustomSettingsPanel();
    }
    
    public override object GetEventBarGlyph(EventDataPoint edp)
    {
        if (edp.Name == "SpecialEvent")
            return new MyCustomGlyph();
        return null;
    }
    
    public override object ExecutePlatformMethod(string methodName, object parameter)
    {
        switch (methodName)
        {
            case "ShowSettings":
                return ShowSettingsDialog();
            default:
                return null;
        }
    }
}
``` 