# Building Block Extension API

This document details the API for creating Building Block Extensions for Wealth-Lab 8, which users can drag and drop to compose a Building Block Strategy.

## Build Environment

You can create a BuildingBlock in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your BuildingBlock will be a class in this library that descends from `BuildingBlockBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Backtest` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your BuildingBlock, making it available in appropriate locations of the WL8 user interface.

Your Blocks will appear in a node in the Building Block tree labelled with the name of your assembly. You can change this name by assigning a value to the `LibraryName` of your Building Block.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Building Block Types

Although `BuildingBlockBase` is the ultimate base class, your Blocks will descend from one of three descendant classes of `BuildingBlockBase`:

- Entry/Exit Blocks - `EntryExitBuildingBlock` class
- Condition Blocks - `ConditionBuildingBlock` class
- Qualifier Blocks - `QualiferBuildingBlock` class

## Configuration of a Building Block

`BuildingBlockBase` descends from the base class `Configurable`, which provides a way to allow the user to configure the Broker Adapter. Consult the Configurable class reference for details. BuildingBlocks use a `ConfigurableType` of `ParameterList`, which should not be changed. This means that you can add `Parameter` instances to the Building Block's Parameters property, doing so in the `GenerateParameters` method. The user can configure these Parameter instances to configure the Building Block.

The `Configurable` type provides properties you will override to describe the Building Block, such as `Name` and `GlyphResource`.

## Code Generation

Building Blocks work by generating C# code. The generated code is assembled together by WL8 and ultimately compiled, just like a C# Coded Strategy. If you select Open as C# Coded Strategy in a Building Block Strategy window, you can see the C# code that WL8 generates for a Building Block Strategy.

Building Blocks need to inject code into the Strategy in three different places. Each of these injection sites is represented by a different property of `BuildingBlockBase`.

### public virtual void Initialize()
Override this method to perform one-time initialization in your Building Block. Here you can change the `LibraryName`, which determines the name of the node that your Building Block appears under in the WL8 Building Blocks list.

### public List<string> VarCode
This List of strings contains the lines of code that will be injected into the private variables section of the C# Strategy code. It consists of a number of C# variable declarations. The Building Block architecture has some features that make sure variable names remain unique, even if multiple Building Blocks of the same type are used in a Strategy.

### public virtual void GenerateVarCode()
The Building Block code generate calls this method in your Building Block to generate the code for the private variables section. You typically don't need to override this method, as the default implementation goes through the variables that you registered using `RegisterVariable` (described below) and generates the appropriate lines of code. If you do override this method, call the base method first, `base.GenerateVarCode();`, before adding VarCode strings.

### public List<string> InitCode
This List of strings contains the lines of code that will be injected into the Initialize method of the generated `UserStrategyBase` class source code. Here, indicators and other variables can be initialized, either by calling their constructors using the new operator or calling the `IndicatorBase` static Series method. Your injected code can make use of the passed `BarHistory` instance (bars parameter).

### public virtual void GenerateInitCode()
Override this method to add lines of code to be injected into the Strategy's Initialize method. The lines should be added to the `InitCode` property.

### public List<string> MainCode
This List of strings contains the lines of code that will be injected into the Execute method of the `UserStrategyBase` class. The code contained here depends on the type of Building Block being implemented. Your injected code can make use of the passed `BarHistory` instance (bars parameter), and the current index being processed.

### public abstract void GenerateMainCode()
Override this method to add lines of code to be injected into the Strategy's Execute method. The lines should be added to the `MainCode` property.

### public List<string> PreExecCode
This List of strings contains the lines of code that will be injected into the PreExecute method of the generated `UserStrategyBase` class source code. A PreExecute override will be generated only if there are any lines of code added to this property. If so, it will use the standard method signature of the PreExecute method, including the dt DateTime parameter and the participants List<BarHistory> parameter.

### public virtual void GeneratePreExecCode()
Override this method to add lines of code to be injected into the Strategy's PreExecute method. The lines should be added to the `PreExecCode` property.

### public List<string> PostExecCode
This List of strings contains the lines of code that will be injected into the PostExecute method of the generated `UserStrategyBase` class source code. A PostExecute method will be generated only if there are any lines of code added to this property. If so, it will use the standard method signature of the PostExecute method, including the dt DateTime parameter and the participants List<BarHistory> parameter.

### public virtual void GeneratePostExecCode()
Override this method to add lines of code to be injected into the Strategy's PostExecute method. The lines should be added to the `PostExecCode` property.

### public List<string> BacktestCompleteCode
This List of strings contains the lines of code that will be injected into the BacktestComplete method of the generated `UserStrategyBase` class source code. A BacktestComplete method will be generated only if there are any lines of code added to this property.

### public virtual void GenerateBacktestCompleteCode()
Override this method to add lines of code to be injected into the Strategy's BacktestComplete method. The lines should be added to the `BacktestCompleteCode` property.

## Using Clause

### public List<string> UsingClauseLibs
This List of strings contains the namespaces that will be added to the using clause of the `UserStrategyBase` class being generated. If your Building Block uses classes and methods particular to an assembly that is not referenced by default, such as your extension's assembly, you'll need to ensure that the assembly is added to the generated code's using clause. Rather than add it directly to this List, use the helper method described below.

### public void AddToUsingClause(string libraryName)
Call this method to add a namespace to the generated code's using clause. This method ensures that each namespace is only added once to the generated code.

## Building Block Parameters

### public ParameterList Parameters
This property is a `ParameterList` instance that contains `Parameter` instances, which allow the user to change different settings of the Building Block. A plethora of different parameter types are available, see the Parameter class reference for a full list and description.

### public virtual void GenerateParameters()
Override this method to add `Parameter` instances to the Building Block's Parameters property. See the Configurable reference, which includes a number of helper methods that make it easier to add certain kinds of Parameter instances. Specifically, `AddParameter`, `AddIndicatorParameter`, `AddValueCompareParameter`, and `AddEnumParameter` are most helpful.

The `Parameter` class has a property called `BuildingBlockTextOutput` that you should use whenever you need to inject a parameter's value into generated code. In the example below, we create an int parameter representing a day of the week. A second comparison parameter is used to compare the current date with our first parameter:

```csharp
public override GenerateParameters()
{
   AddParameter("Day of Week", ParameterType.Int32, 1);
   AddValueCompareParameter();
}

public override GenerateMainCode()
{
   string day = Parameters[0].BuildingBlockTextOutput;
   string operand = Parameters[0].AsCompareOperation; //helper property of Parameter class
   MainCode.Add("if (bars.DateTimes[index].Day " + operand + " " + day + ")");
   MainCode.Add("   SetBackgroundColor(index, Colors.LightGreen);");
}
```

## Building Block Description

Override the `Description` property to return a brief description of the configured Building Block. This Description is used in the Building Block design surface to represent your Building Block. For Entries and Exits, WL8 will prepend the Description with "Buy", "Sell", "Short", or "Cover", so return the remainder of what the final Description should resolve to.

## Defining Variables

### public void RegisterVariable(string varName, string varType, int parameterNum = -1)
Call this from within your Initialize method to register a C# variable name with the Building Block. When you add lines of code to the injection points (InitCode and MainCode), you should put angle brackets around the variable names. WL8 uses these brackets variable names to ensure that each variable you register winds up with a unique variable name in the generated C# Strategy code.

If your variable should be based on the value of one of your Building Block Parameters, pass the parameter index number in the parameterNum parameter.

Example:
```csharp
public override void Initialize()
{
   RegisterVariable("n", "int");
}

public override GenerateInitCode()
{
   InitCode.Add("<n> = bars.Count;");
}

public override GenerateMainCode()
{
   MainCode.Add("<n>--;");
}
```

## Working with Indicators

### public void GenerateIndicatorInitCode(int paramNum, string paramName, string parentIndicator = "")
Call this helper method within your `GenerateInitCode` to generate the initialization code for variables based on indicator parameters. Indicator parameters are Parameter instances in your Building Block Parameters that were created using the `AddIndicatorParameter` method, and they have a Type of `ParameterType.Indicator` or `ParameterType.Smoother`.

Example:
```csharp
public override Initialize()
{
   AddIndicatorParameter("slowMA", "SMA");
   AddIndicatorParameter("fastMA", "SMA");
   RegisterVariable("slowMA", "IndicatorBase", 0);
   RegisterVariable("fastMA", "IndicatorBase", 1);
}

public override GenerateInitCode()
{
   GenerateIndicatorInitCode(0, "slowMA");
   GenerateIndicatorInitCode(1, "fastMA");
}
```

## Entry/Exit Building Blocks

Building Blocks that represent market entries and exits are handled by the `EntryExitBuildingBlock` base class. The primary job here is to override the `GenerateMainCode` method to add the code for entering or exiting a position.

### public virtual bool IsEntry => false;
### public virtual bool IsExit => false; 
Override one of these properties to return true, depending on whether you are implementing an entry or an exit building block.

### public virtual PositionType? PositionType
Override this property to return whether your entry/exit handles long (`PositionType.Long`, Buy/Sell) or short (`PositionType.Short`, Short/Cover) positions.

### public int GroupCode
This property stores a behind-the-scenes value that helps the code generator track entry/exit blocks. For entry Building Blocks, your injected code should issue a `PlaceTrade` call, assigning the result of the call to a variable named `_transaction`.

Example of a BuyAtMarket entry block:
```csharp
public override void GenerateMainCode()
{
    MainCode.Add("_transaction = PlaceTrade(bars, TransactionType.Buy, OrderType.Market, 0, " + GroupCode + ");");
    base.GenerateMainCode();
}
```

For exit Building Blocks:
```csharp
public override void GenerateMainCode()
{
    MainCode.Add("ClosePosition(foundPosition" + GroupCode + ", OrderType.Market);");
}
```

## Condition Building Blocks

Building Blocks that represent conditions are implemented by the `ConditionBuildingBlock` base class. They typically examine the Building Block Parameters and generate if/then statements based on their values.

### public abstract void GenerateConditionCode()
Implement the injection of code lines into MainCode here, instead of the ancestor's `GenerateMainCode` method. Example:

```csharp
public override void GenerateConditionCode()
{
    string operand = Parameters[1].AsOperand;
    string barsBack = Parameters[3].BuildingBlockTextOutput;
    MainCode.Add("if (index - " + barsBack + " >= 0 && <indicator1>[index] " + operand + " <indicator2>[index - " + barsBack + "])");
}
```

## Qualifier Building Blocks

Qualifier Building Blocks can be added to Condition Building Blocks to add additional logic. They are implemented as instances of the `QualifierBuildingBlock` base class.

Example implementation of NBarsAgo Qualifier:
```csharp
using WealthLab.Core;

namespace WealthLab.Backtest
{
    public class NBarsAgo : QualifierBuildingBlock
    {
        public override void GenerateParameters()
        {
            Parameter p = AddParameter("How many bars ago", ParameterType.Int32, 1);
            p.MinValue = 1.0;
        }

        public override void Initialize()
        {
            RegisterVariable("savedIndex", "int");
            RegisterVariable("flag", "bool");
        }

        public override string Name => "N Bars Ago";
        
        public override void GenerateMainCode()
        {
            string numBars = Parameters[0].BuildingBlockTextOutput;
            MainCode.Add("<savedIndex> = index;");
            MainCode.Add("<flag> = false;");
            MainCode.Add("index = index - " + numBars + ";");
            MainCode.Add("if (index >= 0)");
            MainCode.Add("{");
            MainCode.Add("\t<Condition>");
            MainCode.Add("\t\t<flag> = true;");
            MainCode.Add("}");
            MainCode.Add("index = <savedIndex>;");
            MainCode.Add("if (<flag>)");
        }

        public override string Description
        {
            get
            {
                int bars = Parameters[0].AsInt;
                return bars.ToString() + (bars == 1 ? " bar" : " bars") + " ago";
            }
        }
    }
}
```

## Enabling Same Bar Exits

### public virtual bool SupportsSameBarExit
Override this property to return true if you want your Exit Building Block to support same-bar exits.

### public virtual void GenerateSameBarExitCode()
In this method you'll inject lines of code into the `SameBarExitCode` property of your Building Block.

Example implementation for Sell at Profit Target Building Block:
```csharp
public override void GenerateSameBarExitCode()
{
   double mult = Parameters[0].AsDouble / 100.0 + 1.0;
   SameBarExitCode.Add("\t\t\tprice = executionPrice * " + mult + ";");
   SameBarExitCode.Add("\t\t\tt.AssignAutoProfitTargetPrice(price);");
}
```

## Associating a Building Block with a Strategy Gene

### public virtual StrategyGeneBase GetGene()
If your Building Block can be represented by a Strategy Gene, either one already defined in WL8, or one of your own creation, override this method to make the association. Create an instance of the `StrategyGeneBase` derived class here, and assign appropriate values to its property parameters, based on the Building Block's current Parameters values. 