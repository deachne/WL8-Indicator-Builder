# Strategy Evolver Visualizer API

This document details the API for building Strategy Evolver Visualizer Extensions for Wealth-Lab 8. A Strategy Evolver Visualizer appears after you stop an evolution session of the Strategy Genetic Evolver tool. Each Visualizer adds a new tab to the Strategy Evolver window and portrays the results of the Evolver run in some distinct way.

## Build Environment

You can create a Strategy Evolver Visualizer in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.WPF library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Strategy Evolver Visualizer will be a class in this library that descends from `StrategyEvolverVisualizerBase`, which is defined in the WealthLab.WPF library, in the `WealthLab.WPF` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Strategy Evolver Visualizer, making it available in appropriate locations of the WL8 user interface.

## ResultViewerBase

`StrategyEvolverVisualizerBase` is derived from the `ResultViewerBase` base class, defined in WealthLab.WPF. `ResultViewerBase` is derived from the WPF `UserControl`. `ResultViewerBase` contains additional members useful for developing Visualizers, particularly:

- `ViewerName` property - Controls text in Visualizer's tab
- `GlyphResource` property - Controls image in Visualizer's tab

## Creating the Files in Visual Studio

1. Create a new UserControl in Visual Studio (generates boilerplate XAML and CS)
2. Modify CS file:
   - Change class to derive from `StrategyEvolverVisualizerBase`
   - Add `WealthLab.WPF` to using clause
3. Modify XAML file:
   - Add XMLNS reference to WealthLab.WPF library
   - Change base class from UserControl to StrategyEvolverVisualizerBase

Example XAML structure:
```xaml
<wl:StrategyEvolverVisualizerBase x:Class="YourNamespace.YourVisualizer"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:wl="clr-namespace:WealthLab.WPF;assembly=WealthLab.WPF">
    <!-- Your XAML content here -->
</wl:StrategyEvolverVisualizerBase>
```

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Accessing the Evolver Results

### public StrategyEvolverResults Results
The `Results` property returns an instance of the `StrategyEvolverResults` class, which contains the complete results of the Strategy Evolver session. This includes:
- The most recent run
- Any completed Apex runs

## Core Methods

### public virtual void Initialize()
Override this method to perform one-time initialization for your Visualizer.

### public virtual void Cleanup()
Override this method to perform any required cleanup for your Visualizer.

### public virtual void Populate(StrategyEvolverResults results)
Override this method to render the Strategy Evolver results passed in the results parameter to your Visualizer.

## Accessing Selected Metrics

### public List<string> MetricNames
Returns a List<string> containing the names of the performance metrics used during the Evolver session.

## Accessing the Parent Evolver Window

### public IStrategyEvolverHost Host
Returns an instance of the `IStrategyEvolverHost` interface that provides a way to interact with the Strategy Evolver window hosting your Visualizer.

## Example Implementation

Below is a simple example of a Strategy Evolver Visualizer that displays evolution metrics in a chart:

```csharp
public class MetricsChartVisualizer : StrategyEvolverVisualizerBase
{
    private CartesianChart _chart;
    
    public override string ViewerName => "Metrics Chart";
    public override string GlyphResource => "YourNamespace.Glyphs.ChartIcon.png";
    
    public MetricsChartVisualizer()
    {
        InitializeComponent();
        _chart = new CartesianChart();
        Content = _chart;
    }
    
    public override void Initialize()
    {
        // One-time initialization
        _chart.Series = new SeriesCollection();
        _chart.AxisX.Add(new Axis { Title = "Generation" });
        _chart.AxisY.Add(new Axis { Title = "Metric Value" });
    }
    
    public override void Populate(StrategyEvolverResults results)
    {
        var metrics = new List<LineSeries>();
        
        // Create a series for each metric
        foreach (var metricName in MetricNames)
        {
            var series = new LineSeries
            {
                Title = metricName,
                Values = new ChartValues<double>()
            };
            
            // Add values for each generation
            foreach (var generation in results.Generations)
            {
                var bestResult = generation.Results
                    .OrderByDescending(r => r.Metrics[metricName])
                    .First();
                series.Values.Add(bestResult.Metrics[metricName]);
            }
            
            metrics.Add(series);
        }
        
        _chart.Series = new SeriesCollection(metrics);
    }
    
    public override void Cleanup()
    {
        _chart?.Dispose();
        _chart = null;
    }
}
```

This example:
1. Creates a chart visualization of evolution metrics
2. Shows metric values across generations
3. Properly handles initialization and cleanup
4. Demonstrates interaction with the Evolver results
5. Uses the WPF-based LiveCharts library for visualization 