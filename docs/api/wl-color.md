# WLColor Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `WLColor` class represents a platform-independent color with support for alpha, red, green, and blue color components. It provides methods for color manipulation and brightness adjustment.

## Constructors

### Parameterless Constructor
```csharp
public WLColor()
```
Creates a default color instance.

### RGB Constructor
```csharp
public WLColor(byte r, byte g, byte b)
```
Creates a color with specified red, green, and blue components. Alpha is set to 255 (fully opaque).

**Parameters:**
- `r`: Red component (0-255)
- `g`: Green component (0-255)
- `b`: Blue component (0-255)

### ARGB Constructor
```csharp
public WLColor(byte a, byte r, byte g, byte b)
```
Creates a color with specified alpha, red, green, and blue components.

**Parameters:**
- `a`: Alpha component (0-255)
- `r`: Red component (0-255)
- `g`: Green component (0-255)
- `b`: Blue component (0-255)

### Copy Constructor
```csharp
public WLColor(WLColor c)
```
Creates a new `WLColor` instance based on an existing `WLColor`.

**Parameters:**
- `c`: Source `WLColor` to copy

## Properties

### A (Alpha)
```csharp
public byte A
```
The alpha component of the color. 
- 0: Fully transparent
- 255: Fully opaque

### R (Red)
```csharp
public byte R
```
The red color component (0-255).

### G (Green)
```csharp
public byte G
```
The green color component (0-255).

### B (Blue)
```csharp
public byte B
```
The blue color component (0-255).

### Brightness
```csharp
public double Brightness
```
Returns the brightness of the color, ranging from 0 to 1.

## Color Manipulation Methods

### Brighten
```csharp
public WLColor Brighten(double? min = null)
```
Returns a brightened version of the color.

**Parameters:**
- `min`: Optional minimum brightness value

### Darken
```csharp
public WLColor Darken(double? max = null)
```
Returns a darkened version of the color.

**Parameters:**
- `max`: Optional maximum brightness value

### SetAlpha
```csharp
public WLColor SetAlpha(byte a)
```
Returns a new color with the specified alpha value.

**Parameters:**
- `a`: New alpha value (0-255)

## Static Methods

### FromArgb
```csharp
public static WLColor FromArgb(byte a, byte r, byte g, byte b)
public static WLColor FromArgb(byte a, WLColor baseColor)
```
Creates a `WLColor` instance with specified color components.

### FromRgb
```csharp
public static WLColor FromRgb(byte r, byte g, byte b)
```
Creates a `WLColor` instance with specified RGB components and full opacity.

### Parse
```csharp
public static WLColor Parse(string s)
```
Parses a color from a string representation.

## Usage Examples

```csharp
public class ColorUtilities
{
    public void DemonstrateColorUsage()
    {
        // Create colors using different constructors
        WLColor red = new WLColor(255, 0, 0);
        WLColor transparentBlue = new WLColor(128, 0, 0, 255);
        
        // Manipulate colors
        WLColor brighterRed = red.Brighten();
        WLColor darkerRed = red.Darken();
        
        // Set alpha
        WLColor semiTransparent = red.SetAlpha(128);
        
        // Use static methods
        WLColor fromRgb = WLColor.FromRgb(0, 255, 0);
        WLColor fromArgb = WLColor.FromArgb(255, 0, 0, 255);
        
        // Check brightness
        double brightness = red.Brightness;
    }
}
```

## Best Practices

1. **Color Creation**
   - Use appropriate constructors based on your color needs
   - Consider alpha transparency for advanced rendering

2. **Color Manipulation**
   - Use `Brighten()` and `Darken()` for dynamic color adjustments
   - Leverage `SetAlpha()` for transparency effects

3. **Performance**
   - Color instances are lightweight
   - Reuse color instances when possible

## Notes

- Platform-independent color representation
- Supports full alpha channel manipulation
- Provides utility methods for color adjustment
- Compatible with WealthLab 8's charting and visualization systems 