# Strategy Gene API

This document details the API for building Strategy Genes for Wealth-Lab 8 Strategy Genetic Evolver. The Genetic Evolver uses these Genes to randomly generate and mutate trading Strategies over a number of generations.

## Build Environment

You can create a Strategy Gene in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Strategy Gene will be a class in this library that descends from `StrategyGeneBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Backtest` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Strategy Gene, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Gene Name and Code

### public abstract string Name
Override the Name property to return a descriptive name for your Gene.

### public abstract string ShortCode
Return a short string code to identify the Gene. The Evolver displays all of a Genetic Strategy's Genes as a concatenation of their Codes.

## Gene Parameters

### public virtual string GeneData
You can use standard .NET class properties to store the values of your Gene's parameters. Override the GeneData property getter and setter method to package your Gene's properties into a single string. WL8 uses this string to persist the Gene's information.

Example:
```csharp
public override string GeneData
{
    get
    {
        return Value.ToString(CultureInfo.InvariantCulture) + ";" + Lookback.ToString();
    }
    set
    {
        string[] tokens = value.Split(';');
        Value = Double.Parse(tokens[0], CultureInfo.InvariantCulture);
        Lookback = Int32.Parse(tokens[1]);
    }
}
```

## Gene's Relation to Building Block

### public abstract BuildingBlockBase GetBuildingBlock()
Each Strategy Gene will ultimately inject a single Building Block into the Genetic Strategy. The injected Building Blocks can be either Entry/Exit or Condition Blocks. The Building Block inserted is determined by the return value of GetBuildingBlock.

Example:
```csharp
public override BuildingBlockBase GetBuildingBlock()
{
    SellAfterNBars bb = new SellAfterNBars(); //This is the WL8 Building Block
    bb.Parameters[0].Value = NumBars;
    AddConditionsBlocks(bb); //See Entry and Exit Genes below for explanation
    return bb;
}
```

## Randomization and Mutation

### public virtual void Initialize()
WL8 calls this method when the Gene is being initialized in a new Genetic Strategy.

### public virtual void Randomize()
Override this method to completely randomize the parameter property values of your Gene.

### public virtual void Mutate(GeneticStrategy gs)
Override this method to mutate the Gene, meaning to change one (or at least a small number) of its property parameter values.

### protected internal static Random RNG
A static instance of the .NET Random class for generating random numbers.

Example:
```csharp
public override void Mutate(GeneticStrategy gs)
{
    NumBars = RandomizeValue(NumBars);
}
```

## Entry and Exit Genes

### public virtual bool IsEntry
### public virtual bool IsExit
Override one of these properties and return true to indicate that your Gene is an Entry or Exit.

### public bool IsEntryExit 
This property resolves to true if either IsEntry or IsExit returns true.

### public virtual PositionType PositionType
Override this property to return the PositionType that your Entry/Exit handles (Long or Short).

### protected void AddConditionsBlocks(BuildingBlockBase bb)
Call this method to cause randomized Condition Genes to be injected.

### public virtual bool CanAddExit(List<StrategyGeneBase> exits)
For Exit Blocks, optionally override this method to control if the Exit Gene should be added.

Example:
```csharp
public override bool CanAddExit(List<StrategyGeneBase> exits)
{
    if (exits.Count == 0)
        return false;
    foreach (StrategyGeneBase exit in exits)
        if (exit is SellAtStopLossGene)
            return false;
    return true;
}
```

## Inserting Conditions

### protected void InsertConditions(int max, StrategyGeneBase parentGene, StrategyGeneConditionTypes conditionType)
Call this method in your Randomize implementation to add random Condition Genes.

## Condition Genes

### public bool IsCondition
Resolves to true for Condition Genes.

### public virtual StrategyGeneConditionTypes ConditionType
Override to specify the type of Condition Gene:
- `StrategyGeneConditionTypes.Signal`
- `StrategyGeneConditionTypes.Filter`
- `StrategyGeneConditionTypes.Both`

### public virtual bool CanIncludeCondition
Override to control if the Condition Gene should be included.

## Restricting Genes

### public virtual bool IsValid(GeneticStrategy gs, StrategyGeneBase parent)
Override to indicate whether the Gene would be valid given the current state.

## Working with Indicator Parameters

Example:
```csharp
//Create an instance of the Building Block
IndicatorValue bb = new IndicatorValue();

//parameter 0 - indicator
Parameter p = bb.Parameters[0];
p.IndicatorAbbreviation = OscillatorAbbreviation;
p.IndicatorParameters = OscillatorParameters;
```

## Coordinating Genes

### public GeneticStrategy ParentStrategy
Access to the current Genetic Strategy being constructed.

### public StrategyGeneBase ParentGene
For Condition Genes, returns the parent Entry/Exit Gene.

### public List<StrategyGeneBase> ChildGenes
Returns the Conditions already added to an Entry/Exit Gene.

## Helper Methods

### public static double RandomizeValue(double value, double pct = 10.0)
Returns a randomized double value.

### public static int RandomizeValue(int value)
Returns a randomized int value.

### public static void RandomizeParameters(ParameterList pl)
Randomizes Parameter values in a ParameterList.

### public static PriceComponent RandomPriceComponent
Returns a random PriceComponent.

### public string RandomIndexSymbol
Returns a random market index symbol.

## Example Implementation

See the complete example of the PriceCompareIndicatorGene at the end of this document for a full working implementation that demonstrates all these concepts. 