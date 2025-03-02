# BarHistorySynchronizer Class

**Namespace:** WealthLab.Core  
**Parent:** None (Static Class)

BarHistorySynchronizer is a static utility class containing the Synchronize method, allowing you to synchronize a BarHistory instance with another time series (either a TimeSeries or BarHistory instance). It is useful when you want to plot time series in one scale on a chart based on another scale (for example, weekly to daily).

## Static Methods

### Synchronize
```csharp
public static BarHistory Synchronize(BarHistory source, TimeSeriesBase master)
```
Synchronizes the source BarHistory instance with the master TimeSeriesBase instance. The master parameter can be either a TimeSeries or a BarHistory instance, as both descend from TimeSeriesBase. The method returns a new BarHistory instance that is synchronized with the master. 