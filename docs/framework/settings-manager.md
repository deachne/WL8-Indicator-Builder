# SettingsManager Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `SettingsManager` class provides a robust, thread-safe mechanism for managing application settings across various data types, with built-in automatic file persistence and optional encryption.

## Constructors

### SettingsManager
```csharp
public SettingsManager(string fileName, bool encrypt = false)
```
Creates a new `SettingsManager` instance with specified file storage and optional encryption.

**Parameters:**
- `fileName`: Path to the file where settings will be stored
- `encrypt`: Optional flag to enable encryption (default: `false`)

**Best Practice Example:**
```csharp
// Using WLHost to get appropriate data folder
string settingsPath = WLHost.Instance.DataFolder + "\\MyAppSettings.xml";
var settingsManager = new SettingsManager(settingsPath, encrypt: true);
```

## Data Access Methods

### Get Methods
Retrieve settings values with type-specific overloads:

```csharp
public string Get(string key, string defaultValue)
public bool Get(string key, bool defaultValue)
public int Get(string key, int defaultValue)
public double Get(string key, double defaultValue)
public DateTime Get(string key, DateTime defaultValue)
public WLColor Get(string key, WLColor value)
```

**Supported Types:**
- `string`
- `bool`
- `int`
- `double`
- `DateTime`
- `WLColor`

**Usage Example:**
```csharp
// Retrieve settings with default values
string username = settingsManager.Get("Username", "DefaultUser");
int maxItems = settingsManager.Get("MaxItems", 10);
bool darkMode = settingsManager.Get("DarkMode", false);
```

### Set Methods
Store settings values with type-specific overloads:

```csharp
public void Set(string key, string value)
public void Set(string key, bool value)
public void Set(string key, int value)
public void Set(string key, double value)
public void Set(string key, DateTime value)
public void Set(string key, WLColor value)
```

**Usage Example:**
```csharp
// Store various types of settings
settingsManager.Set("Username", "JohnDoe");
settingsManager.Set("MaxItems", 25);
settingsManager.Set("DarkMode", true);
settingsManager.Set("LastLoginDate", DateTime.Now);
```

## Properties

### FileName
```csharp
public string FileName
```
Returns the full path of the file where settings are stored.

### FullDictionary
```csharp
public Dictionary<string, string> FullDictionary
```
Provides direct access to the underlying settings dictionary.

### IsEncrypted
```csharp
public bool IsEncrypted
```
Indicates whether the settings are encrypted when saved to disk.

### SaveThrottleSeconds
```csharp
public int SaveThrottleSeconds
```
Controls the minimum time between disk writes (default: 1 second).

**Usage Example:**
```csharp
// Customize save throttling
settingsManager.SaveThrottleSeconds = 5; // Wait 5 seconds between saves
```

## Advanced Usage Patterns

### Configuration Management
```csharp
public class AppConfigManager
{
    private SettingsManager _settings;

    public AppConfigManager()
    {
        string configPath = WLHost.Instance.DataFolder + "\\AppConfig.xml";
        _settings = new SettingsManager(configPath, encrypt: true);
    }

    public void SaveUserPreferences(UserPreferences prefs)
    {
        _settings.Set("Theme", prefs.Theme);
        _settings.Set("Language", prefs.Language);
        _settings.Set("NotificationsEnabled", prefs.NotificationsEnabled);
    }

    public UserPreferences LoadUserPreferences()
    {
        return new UserPreferences
        {
            Theme = _settings.Get("Theme", "Light"),
            Language = _settings.Get("Language", "English"),
            NotificationsEnabled = _settings.Get("NotificationsEnabled", true)
        };
    }
}
```

### Secure Settings Storage
```csharp
public class SecureSettingsExample
{
    private SettingsManager _secureSettings;

    public SecureSettingsExample()
    {
        // Enable encryption for sensitive data
        string sensitiveConfigPath = WLHost.Instance.DataFolder + "\\SecureConfig.xml";
        _secureSettings = new SettingsManager(sensitiveConfigPath, encrypt: true);
    }

    public void StoreApiCredentials(string apiKey, string apiSecret)
    {
        _secureSettings.Set("APIKey", apiKey);
        _secureSettings.Set("APISecret", apiSecret);
    }
}
```

## Best Practices

1. **Encryption**
   - Use encryption for sensitive settings
   - Store sensitive data like API keys securely
   - Be cautious with encryption key management

2. **Performance**
   - Adjust `SaveThrottleSeconds` based on update frequency
   - Minimize frequent updates
   - Use batch updates when possible

3. **Type Safety**
   - Always provide default values
   - Handle potential type conversion issues
   - Validate settings before use

4. **Thread Safety**
   - `SettingsManager` is thread-safe
   - Can be used in multi-threaded environments
   - No additional synchronization required

## Notes

- Automatic file persistence
- Thread-safe implementation
- Supports multiple data types
- Built-in encryption option
- Lightweight and easy to use

## Requirements

- .NET Framework understanding
- Basic knowledge of file I/O
- Familiarity with dictionary and key-value storage concepts

## Cleanup

WealthLab 8 automatically calls the static `CleanUp` method during application shutdown, ensuring any pending saves are written to disk. 