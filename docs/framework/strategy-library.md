# Strategy Library API

This document details the API for building Compiled Strategies for Wealth-Lab 8. A Strategy Library is simply a collection of Wealth-Lab 8 Strategies packaged and compiled in a .NET library assembly. WL8 displays these libraries as separate nodes in the Strategies tree. If your Strategy exposes Parameters, these will be exposed as sliders in the Strategy Settings tab, just like they are for a C#-Coded or a Building Block Strategy.

## Build Environment

You can create a Compiled Strategy in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Compiled Strategy will be a class in this library that descends from `UserStrategyBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Backtest` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Compiled Strategy, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## UserStrategyBase

Since custom Strategies are classes that descend from the `UserStrategyBase` class, consult the UserStrategyBase class reference for more information about coding a Strategy.

## Descriptive Properties

You should override the following descriptive properties in your Strategy classes:

### public virtual string StrategyName
Return a descriptive name for the Strategy. The default implementation returns the .NET class name.

### public virtual string Author
Return a name that indicates how you'd like to see the Strategy attributed in WL8.

### public virtual string Description
Return a short description of your Strategy.

### public virtual DateTime CreationDate
Return the date that you created the Strategy.

## Visual Studio Development Setup

### Enabling "Edit and Continue" Feature

To streamline development and enable the "Edit and Continue" feature in Visual Studio, follow these steps:

1. **Modify Project File**
   - Close solution in Visual Studio
   - Find your project file (e.g., `Strategies.csproj`)
   - Add the following lines to the PropertyGroup section:
   ```xml
   <Project Sdk="Microsoft.NET.Sdk.WindowsDesktop">
     <PropertyGroup>
       <TargetFramework>net8.0</TargetFramework>
       <UseWPF>true</UseWPF>
       <AppendTargetFrameworkToOutputPath>false</AppendTargetFrameworkToOutputPath>
       <AppendRuntimeIdentifierToOutputPath>false</AppendRuntimeIdentifierToOutputPath>
     </PropertyGroup>
     ...
   </Project>
   ```

2. **Configure Visual Studio**
   - Launch Visual Studio as administrator
   - Open your project
   - Go to Project > Properties
   - On Build tab:
     - Set Output path to: `C:\Program Files\Quantacula, LLC\WealthLab 8`
   - On Debug tab:
     - Set Executable to: `C:\Program Files\Quantacula, LLC\WealthLab 8\WealthLab8.exe`

3. **Setup Debug Profile (for newer VS versions)**
   - Go to Project Properties > Debug > General
   - Click "Open Debug Launch Profile UI"
   - Click "Create New Profile" (type: Executable)
   - Change the Launch Profile to the newly created one

With this setup:
- Your DLL will automatically be copied to the WL8 folder when debugging
- WL8 will launch automatically when you start debugging
- You can set breakpoints and edit code while debugging
- Changes take effect without restarting WL8

## Example Implementation

Here's a simple example of a compiled Strategy:

```csharp
using WealthLab.Core;
using WealthLab.Indicators;

namespace MyStrategyLibrary
{
    public class SimpleMovingAverageCrossover : UserStrategyBase
    {
        // Descriptive properties
        public override string StrategyName => "SMA Crossover";
        public override string Author => "Your Name";
        public override string Description => "Simple Moving Average Crossover Strategy";
        public override DateTime CreationDate => new DateTime(2024, 1, 1);

        // Strategy parameters
        private Parameter _fastPeriod;
        private Parameter _slowPeriod;

        public SimpleMovingAverageCrossover()
        {
            // Create parameters
            _fastPeriod = CreateParameter("Fast SMA", 10, 5, 50, 1);
            _slowPeriod = CreateParameter("Slow SMA", 20, 10, 100, 1);
        }

        protected override void Execute()
        {
            // Calculate indicators
            var fastSMA = SMA.Series(Bars.Close, _fastPeriod.AsInt);
            var slowSMA = SMA.Series(Bars.Close, _slowPeriod.AsInt);

            // Generate signals
            for (int bar = GetTradingStartBar(fastSMA, slowSMA); bar < Bars.Count; bar++)
            {
                if (CrossOver(fastSMA, slowSMA, bar))
                    BuyAtMarket(bar + 1, "SMA Cross Up");
                else if (CrossUnder(fastSMA, slowSMA, bar))
                    SellAtMarket(bar + 1, "SMA Cross Down");
            }
        }
    }
}
```

This example demonstrates:
1. Basic Strategy structure
2. Parameter creation and management
3. Indicator calculation
4. Signal generation
5. Order placement 