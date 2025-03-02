# Client Extension API

This document details the API for building Client Extensions for Wealth-Lab 8. A Client Extension allows you to add custom menu items to the WL8 Extensions menu and create child windows with custom functionality.

## Architecture Overview

Client Extensions are implemented using two base classes:

1. `WL8ExtensionBase` (WealthLab.Core)
   - One-time initialization
   - Help System integration
   - Platform-neutral functionality

2. `WL8ClientExtensionBase` (WealthLab.WPF)
   - Extension menu items
   - Child window creation
   - Preference pages
   - Windows WPF-specific functionality

## Build Environment

You can create a Client Extension in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.WPF library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Client Extension will be a class that descends from `WL8ClientExtensionBase`, defined in the WealthLab.WPF library. After building, copy the assembly DLL to the WL8 installation folder for automatic discovery on next startup.

## Accessing the Host Environment

The `IHost` interface provides access to the WL8 environment:

```csharp
// Get user data folder
string folder = WLHost.Instance.DataFolder;
```

## WL8ExtensionBase Class

### Initialization
```csharp
public class MyExtension : WL8ExtensionBase
{
    public override string Name => "My Extension";
    
    public override void Initialize()
    {
        // Perform one-time initialization
        // Add help pages
        HelpManager.InsertPage("Extensions\\MyExtension");
        HelpManager.InsertPage("Extensions\\MyExtension\\Details");
    }
}
```

### Help System Integration

Help pages should be:
- Installed in WL8's "Help" folder
- Written in Markdown format (.md)
- Named to match the final page name in contents string

Example help page structure:
```
Help/
  └── Extensions/
      └── MyExtension/
          ├── MyExtension.md
          └── Details.md
```

## WL8ClientExtensionBase Class

### Menu Item Management

```csharp
public class MyClientExtension : WL8ClientExtensionBase
{
    public override string Name => "My Extension";
    
    public override List<MenuItem> GetMenuItems()
    {
        var menuItems = new List<MenuItem>();
        
        // Create menu item with icon
        var menuItem = CreateExtensionMenuItem(
            "My Tool",
            GetGlyphImage(),
            OnMenuItemClick,
            reversableImage: true
        );
        
        menuItems.Add(menuItem);
        return menuItems;
    }
    
    private void OnMenuItemClick(object sender, RoutedEventArgs e)
    {
        // Create and show child window
        var childWindow = new MyChildWindow();
        MyClientHost.ShowExtensionChildWindow(
            childWindow,
            "My Tool Window",
            GetGlyphImage()
        );
    }
}
```

### Child Window Support

```csharp
public override ChildWindow GetChildWindow(string token)
{
    // Support workspace save/restore
    if (token == "MyTool")
        return new MyChildWindow();
    return null;
}

public override bool ProcessHelpToken(string token)
{
    // Support help system links
    if (token == "MyTool")
    {
        var window = new MyChildWindow();
        MyClientHost.ShowExtensionChildWindow(window, "My Tool", GetGlyphImage());
        return true;
    }
    return false;
}
```

### Preference Pages

```csharp
public override List<TabPage> PreferencePages
{
    get
    {
        return new List<TabPage>
        {
            new MyPreferencePage()
        };
    }
}
```

## Complete Example Implementation

Here's a complete example of a Client Extension:

```csharp
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using WealthLab.Core;
using WealthLab.WPF;

namespace MyCompany.WL8Extension
{
    // Core extension functionality
    public class MyExtension : WL8ExtensionBase
    {
        public override string Name => "My Tool";
        
        public override void Initialize()
        {
            // Add help pages
            HelpManager.InsertPage("Extensions\\MyTool");
            HelpManager.InsertPage("Extensions\\MyTool\\Usage");
        }
    }
    
    // Client extension functionality
    public class MyClientExtension : WL8ClientExtensionBase
    {
        public override string Name => "My Tool";
        
        // Menu items
        public override List<MenuItem> GetMenuItems()
        {
            var menuItems = new List<MenuItem>();
            
            var menuItem = CreateExtensionMenuItem(
                "Launch My Tool",
                Glyph,
                OnMenuItemClick
            );
            
            menuItems.Add(menuItem);
            return menuItems;
        }
        
        // Child window management
        public override ChildWindow GetChildWindow(string token)
        {
            if (token == "MyTool")
                return CreateChildWindow();
            return null;
        }
        
        public override bool ProcessHelpToken(string token)
        {
            if (token == "MyTool")
            {
                CreateChildWindow();
                return true;
            }
            return false;
        }
        
        // Preferences
        public override List<TabPage> PreferencePages
        {
            get
            {
                return new List<TabPage>
                {
                    new MyToolPreferences()
                };
            }
        }
        
        // Private helpers
        private void OnMenuItemClick(object sender, RoutedEventArgs e)
        {
            CreateChildWindow();
        }
        
        private ChildWindow CreateChildWindow()
        {
            var window = new MyToolWindow();
            MyClientHost.ShowExtensionChildWindow(
                window,
                "My Tool",
                Glyph
            );
            return window;
        }
        
        private ImageSource Glyph =>
            GlyphManager.GetImageSource(
                "MyCompany.WL8Extension.Glyphs.MyTool.png",
                this
            );
    }
}
```

This example demonstrates:
1. Core extension initialization
2. Help system integration
3. Menu item creation
4. Child window management
5. Preference page integration
6. Workspace support
7. Help system action support

## Best Practices

1. **Initialization**
   - Keep initialization code minimal
   - Use `Initialize()` for one-time setup only
   - Add help pages during initialization

2. **Menu Items**
   - Use descriptive captions
   - Provide meaningful icons
   - Consider theme support for icons

3. **Child Windows**
   - Derive from `ChildWindow`
   - Support workspace save/restore
   - Handle theme changes

4. **Help Integration**
   - Organize help pages logically
   - Use markdown formatting
   - Include action links where appropriate

5. **Resource Management**
   - Cache glyph images
   - Clean up resources properly
   - Handle window disposal 