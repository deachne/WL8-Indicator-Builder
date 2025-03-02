# Parameter Class

**Namespace:** WealthLab.Core  
**Parent:** Object

The `Parameter` class represents a configurable parameter used in WealthLab strategies, indicators, and other extensible components. It provides a flexible mechanism for defining, optimizing, and managing parameter values across different types of WealthLab extensions.

## Constructors

### Parameter
```csharp
public Parameter(string name, ParameterTypes type, object value)
public Parameter(string name, ParameterTypes type, object value, double minValue, double maxValue)
public Parameter(string name, Type enumType)
```

Three constructor overloads provide flexibility in parameter creation:
- Basic constructor with name, type, and initial value
- Extended constructor allowing optimization range specification
- Enum-based constructor for creating string choice parameters

## Core Properties

### Name
```csharp
public string Name
```
The descriptive name of the parameter.

### Type
```csharp
public ParameterTypes Type
```
Defines the data type of the parameter (e.g., Double, Int32, TimeSeries).

### Value
```csharp
public object Value
```
The current value of the parameter.

### DefaultValue
```csharp
public object DefaultValue
```
The initial value established when the parameter was created.

## Optimization Properties

### MinValue
```csharp
public double MinValue
```
Minimum value for parameter optimization.

### MaxValue
```csharp
public double MaxValue
```
Maximum value for parameter optimization.

### StepValue
```csharp
public double StepValue
```
Increment value used during optimization.

### Values
```csharp
public List<double> Values
```
List of possible parameter values based on MinValue, MaxValue, and StepValue.

## Type Conversion Helper Properties

### AsDouble, AsInt, AsBoolean, etc.
```csharp
public double AsDouble
public int AsInt
public bool AsBoolean
// ... and many more
```
Provides type-safe access to parameter values for specific types.

## Methods

### AssignExplicitValues
```csharp
public void AssignExplicitValues(IEnumerable<double> values)
public void AssignExplicitValues(params object[] vals)
```
Allows manual specification of optimization values.

### AssignFibonacciValues
```csharp
public void AssignFibonacciValues()
```
Generates Fibonacci sequence values within the parameter's range.

### AssignPercentageValues
```csharp
public void AssignPercentageValues(double percentageGain)
```
Generates logarithmic optimization values.

## Usage Examples

### Strategy Parameter Configuration
```csharp
public class MyTradingStrategy : UserStrategyBase
{
    protected override void GenerateParameters()
    {
        // Basic parameter
        AddParameter("RSI Period", ParameterType.Int32, 14)
            .Hint("Length of RSI calculation");
        
        // Optimization-ready parameter
        AddParameter("Stop Loss", ParameterType.Double, 0.02, 0.01, 0.05)
        {
            StepValue = 0.01,
            Hint("Percentage stop loss")
        };
        
        // Enum-based parameter
        AddParameter("Trade Direction", typeof(TradeDirection))
            .Hint("Direction of trades to execute");
    }
}
```

### Custom Indicator Parameter Management
```csharp
public class CustomIndicator : IndicatorBase
{
    protected override void GenerateParameters()
    {
        // Fibonacci-based optimization
        var periodParam = AddParameter("Period", ParameterType.Int32, 14, 10, 50);
        periodParam.AssignFibonacciValues();
        
        // Percentage-based optimization
        var smoothingParam = AddParameter("Smoothing", ParameterType.Double, 0.5, 0.1, 1.0);
        smoothingParam.AssignPercentageValues(0.2);
        
        // Explicit value assignment
        var thresholdParam = AddParameter("Threshold", ParameterType.Double, 0.5);
        thresholdParam.AssignExplicitValues(0.3, 0.5, 0.7, 1.0);
    }
}
```

### Enum Parameter with Choices
```csharp
public enum TradeMode 
{
    Conservative,
    Aggressive,
    Balanced
}

public class StrategyWithEnumParam : UserStrategyBase
{
    protected override void GenerateParameters()
    {
        // Automatically creates StringChoice parameter
        AddParameter(typeof(TradeMode))
            .Hint("Select trading aggressiveness");
    }
}
```

## Best Practices

1. **Parameter Naming**
   - Use clear, descriptive names
   - Provide meaningful hints
   - Follow consistent naming conventions

2. **Optimization Configuration**
   - Define realistic min/max ranges
   - Use appropriate step values
   - Consider logarithmic or Fibonacci distributions

3. **Type Safety**
   - Use type-specific accessor methods
   - Validate parameter types
   - Handle type conversion carefully

4. **Performance**
   - Minimize complex parameter generation
   - Cache parameter values when possible
   - Use explicit values for small optimization sets

## Notes

- Supports various parameter types
- Enables strategy and indicator customization
- Provides flexible optimization mechanisms
- Integrates with WealthLab's optimization framework
- Supports both manual and algorithmic parameter configuration 