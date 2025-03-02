# Configurable Class

**Namespace:** WealthLab.Core  
**Parent:** Object  
**Descendants:** Many

Contains the functionality for an object to support configuration. A Configurable object has a `Name` property, implementing the `INamed` interface. Its configuration is automatically persisted as a string in WL8's settings file, and is contained in the `Configuration` parameter. The `ConfigurationType` property determines whether the configuration string is an object-specific, plain vanilla format, or represents a persisted `ParameterList`.

## Configuration Properties

### ConfigKey
```csharp
public virtual string ConfigKey
```
The key used when WL8 saves this item's Configuration to the settings file. By default, `ConfigKey` is composed of `ConfigPrefix + "_" + Name`. Override this property to specify a different `ConfigKey`, useful when multiple components must share the same configuration.

### ConfigPrefix
```csharp
public virtual string ConfigPrefix
```
Returns the prefix used when creating a key to store the item's Configuration in the WL8 settings file. Each class of item has a short two- or three-character prefix (e.g., Historical Providers are "HP", Streaming Providers are "SP").

### ConfigurableType
```csharp
public abstract ConfigurableType ConfigurableType
```
Determines whether the Configuration string is a plain vanilla string or a persisted instance of a `ParameterList`. For the latter case, the object's `Parameters` property will contain the parsed parameters. Possible values:
- `ConfigurableType.VanillaString`
- `ConfigurableType.ParameterList`

### Configuration
```csharp
public string Configuration
```
Contains the configuration expressed as a single string. If `ConfigurableType` is `ConfigurableType.ParameterList`, then this string is the persisted `Parameters` instance.

## Configuration Methods

### EditConfig
```csharp
public virtual string EditConfig()
```
Causes WL8 to display a configuration dialog for editing the object's configuration. For `ParameterList` configurations, WL8 shows a parameter editor dialog. For Windows/WPF WL8 extensions, provide a custom editor by creating a class descending from `ObjectEditorBase` in the WealthLab.WPF library.

### GenerateParameters
```csharp
public virtual void GenerateParameters()
```
Override to populate a Configurable object's `Parameters` property with `Parameter` class instances. Only relevant if the object's `ConfigurableType` is `ConfigurableType.ParameterList`.

### IsConfigurable
```csharp
public virtual bool IsConfigurable
```
Indicates whether the object supports configuration. Default returns true if object is `ConfigurableType.ParameterList` and contains parameters.

### IsConfigured
```csharp
public virtual bool IsConfigured
```
Default returns false if `IsConfigurable` is true but `Configuration` string is null/empty. Override for more fine-grained control. Unconfigured Data Providers cannot create DataSets.

### LoadConfig
```csharp
public virtual bool LoadConfig()
```
Called when WL8 loads the item's configuration upon initialization. Default loads from WL8 settings file.

### Parameters
```csharp
public ParameterList Parameters
```
Contains the `Parameter` instances comprising the configuration. Only relevant if `ConfigurableType` is `ConfigurableType.ParameterList`.

### ProcessConfig
```csharp
public virtual void ProcessConfig()
```
Override to perform special processing after configuration changes.

### SaveConfig
```csharp
public virtual void SaveConfig()
```
Called when configuration changes need persisting. Default stores in WL8 settings file.

## Descriptive Properties

### Description
```csharp
public virtual string Description
```
Optional short description used throughout WL8's UI.

### DisableGlyphReverse
```csharp
public virtual bool DisableGlyphReverse
```
Return true to prevent WL8 from reversing the item's `GlyphResource` image in Dark Theme.

### GlyphResource
```csharp
public virtual string GlyphResource
```
String describing an Embedded Resource for representing the item in lists. Format: "CompanyName.ProjectName.FolderPath.ImageName.png"

### Name
```csharp
public abstract string Name
```
Returns instance name. Configurable objects implement `INamed` interface, usable as target type for `FactoryBase<T>` classes.

### URL
```csharp
public virtual string URL
```
Optional URL to additional item information, used in WL8's UI.

## Helper Methods

### AddEnumParameter
```csharp
public Parameter AddEnumParameter(string label, System.Enum enumInstance)
```
Adds `StringChoice` Parameter to `Parameters` property with values from specified Enumerated Type.

### AddIndicatorParameter
```csharp
public Parameter AddIndicatorParameter(string label, string indicator = "RSI", ParameterType pt = ParameterType.Indicator)
```
Adds indicator-type Parameter, setting appropriate values for `IndicatorAbbreviation`, `IndicatorParameters` and `IndicatorInstance` properties.

### AddParameter
```csharp
public Parameter AddParameter(string label, ParameterType pt, object defaultValue)
```
Adds Parameter instance to `Parameters` property.

### AddValueCompareParameter
```csharp
public Parameter AddValueCompareParameter(string label = "is", string defaultValue = "equal to")
```
Adds `StringChoice` Parameter with comparison values:
- less than
- less than or equal to
- equal to
- not equal to
- greater than or equal to
- greater than 