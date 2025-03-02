# Optimization Visualizer API

This document details the API for building Optimization Visualizer Extensions for Wealth-Lab 8. An Optimization Visualizer occupies a tab in the Optimization Results section of the Strategy window's Optimization section, and lets you present the results of an optimization in a particular way.

## Build Environment

You can create an Optimization Visualizer in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.WPF library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Optimization Visualizer will be a class in this library that descends from `OptimizationVisualizerBase`, which is defined in the WealthLab.WPF library, in the `WealthLab.WPF` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Optimization Visualizer, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## ResultViewerBase

`OptimizationVisualizerBase` is derived from the `ResultViewerBase` base class, defined in WealthLab.WPF. `ResultViewerBase` is derived from the WPF `UserControl`. `ResultViewerBase` contains additional members useful for developing Visualizers, particularly:

- `ViewerName` property - Controls text in Visualizer's tab
- `GlyphResource` property - Controls image in Visualizer's tab

## Creating the Files in Visual Studio

1. Create a new UserControl in Visual Studio (generates boilerplate XAML and CS)
2. Modify CS file:
   - Change class to derive from `OptimizationVisualizerBase`
   - Add `WealthLab.WPF` to using clause
3. Modify XAML file:
   - Add XMLNS reference to WealthLab.WPF library
   - Change base class from UserControl to OptimizationVisualizerBase

Example XAML structure:
```xaml
<wl:OptimizationVisualizerBase x:Class="YourNamespace.YourVisualizer"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:wl="clr-namespace:WealthLab.WPF;assembly=WealthLab.WPF">
    <!-- Your XAML content here -->
</wl:OptimizationVisualizerBase>
```

## Type of Optimization Supported

### public virtual bool ForStandardOptimizations
Return:
- `true` for standard optimizations
- `false` for walk-forward (WFO) optimizations

## Visualizing Optimization Results

### public virtual void Clear()
Called at start of optimization. Clear any previous visual information.

### public List<string> MetricNames
Returns list of selected performance metrics. These metrics are returned in the `OptimizationResult` instances stored in `StrategyOptimizer.Results`.

### public OptimizerBase OptimizationMethod
Returns instance of selected `OptimizerBase`-derived class.

## Visualizing Standard Optimizations

### public virtual void Populate(StrategyOptimizer stratOpt)
Called when optimization completes. Visualize results from:
- `stratOpt.Results` property (type: `OptimizationResultList`)
- Contains list of `OptimizationResult` instances to visualize

### public StrategyOptimizer StrategyOptimizer
Returns `StrategyOptimizer` instance that conducted optimization.

### public virtual bool SupportsInterimUpdates
Return true if visualizer supports partial updates during optimization.

### public virtual void InterimPopulate(StrategyOptimizer stratOpt, List<OptimizationResult> newResults)
Called if `SupportsInterimUpdates` is true. Integrate new results into existing visualization.

### public virtual void PopulateWithTheseValues(OptimizationResult or)
Called when user pushes selected run's values to other visualizers. Update visualization to reflect specified run.

## Visualizing Walk-Forward Optimizations

### public virtual void PopulateWFO(WFOOptimizer wfoOpt)
Called when Walk-Forward optimization completes. Visualize results from WFOOptimizer instance.

### public WFOOptimizer WFOOptimizer
Returns `WFOOptimizer` instance that conducted optimization.

## Interacting with the Strategy Window

### public IOptimizationHost ParentOptimizationWindow
Returns `IOptimizationHost` interface for interacting with optimization section. Contains:
- `StrategyHost` property (type: `IStrategyHost`)
- Additional hooks into Strategy window

### protected void SaveParameterDefaults(OptimizationResult or, FrameworkElement confirmElement = null)
Sets Strategy Parameters default values from OptimizationResult. Parameters:
- `or`: OptimizationResult containing values to set
- `confirmElement`: Optional FrameworkElement for animated confirmation

Example usage in Optimization Tabular Visualizer:
- Right-click menu option
- Sets Strategy parameter defaults to selected optimization run values 