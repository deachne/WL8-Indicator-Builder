# WLFont Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `WLFont` class represents a platform-independent font with support for customizing font family, size, bold, and italic properties. It provides a flexible way to define and manipulate fonts across different rendering contexts.

## Constructors

### Parameterless Constructor
```csharp
public WLFont()
```
Creates a default font instance with standard settings.

### Customizable Font Constructor
```csharp
public WLFont(
    string fontName, 
    int fontSize = 8, 
    bool isBold = false, 
    bool isItalic = false
)
```
Creates a font with specified properties.

**Parameters:**
- `fontName`: Font family name (e.g., "Arial", "Tahoma")
- `fontSize`: Font size in points (default: 8)
- `isBold`: Whether the font should be bold (default: false)
- `isItalic`: Whether the font should be italic (default: false)

## Properties

### FontName
```csharp
public string FontName
```
Specifies the font's family name.

**Examples:**
- "Arial"
- "Tahoma"
- "Consolas"
- "Helvetica"

### FontSize
```csharp
public int FontSize
```
Specifies the size of the font in points.

**Range:** Typically 6-72, but can vary based on platform

### IsBold
```csharp
public bool IsBold
```
Indicates whether the font should be rendered in bold text.

**Values:**
- `true`: Render bold text
- `false`: Standard weight text

### IsItalic
```csharp
public bool IsItalic
```
Specifies whether the font should be rendered in italic text.

**Values:**
- `true`: Render italic text
- `false`: Standard upright text

## Static Methods

### Parse
```csharp
public static WLFont Parse(string s)
```
Returns a `WLFont` instance by parsing a string representation of the font.

**Notes:**
- Uses the same format as the font's `ToString()` method
- Allows recreation of a font from its string representation

## Usage Examples

```csharp
public class FontUtilities
{
    public void DemonstrateFontUsage()
    {
        // Create fonts using different constructors
        WLFont defaultFont = new WLFont();
        
        // Custom font with specific properties
        WLFont customFont = new WLFont(
            fontName: "Arial", 
            fontSize: 12, 
            isBold: true, 
            isItalic: false
        );
        
        // Chart annotation font
        WLFont annotationFont = new WLFont("Tahoma", 10);
        
        // Bold and italic font
        WLFont emphasizedFont = new WLFont("Consolas", 9, true, true);
        
        // Parse font from string
        string fontString = customFont.ToString();
        WLFont parsedFont = WLFont.Parse(fontString);
    }
}
```

## Best Practices

1. **Font Selection**
   - Choose fonts that are widely available across platforms
   - Consider readability and context
   - Use system-standard fonts for maximum compatibility

2. **Font Styling**
   - Use bold and italic sparingly
   - Ensure text remains legible
   - Consider color contrast and background

3. **Performance**
   - Font instances are lightweight
   - Reuse font instances when possible
   - Avoid creating excessive font variations

## Compatibility Notes

- Platform-independent font representation
- Works across different rendering contexts in WealthLab 8
- Supports basic font customization
- Designed for chart annotations, UI elements, and data visualization

## Potential Limitations

- Does not support advanced typography features
- Limited to basic font properties
- Actual rendering may vary slightly between platforms

## Recommended Fonts

- Sans-serif fonts for charts and UI: Arial, Tahoma, Helvetica
- Monospaced fonts for code or precise data: Consolas, Courier
- Serif fonts for detailed reports: Times New Roman, Georgia

## Notes

- Essential for consistent font rendering in WealthLab 8
- Provides a simple, cross-platform font representation
- Useful for customizing chart annotations and UI elements 