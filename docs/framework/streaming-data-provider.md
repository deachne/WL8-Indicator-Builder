# Streaming Data Provider API

This document details the API for building Streaming Data Provider extensions for Wealth-Lab 8. A Streaming Data Provider allows WL8 to subscribe to symbol updates and get notified live whenever trades (ticks) occur for the subscribed symbol(s).

## Build Environment

You can create a Streaming Data Provider in a .NET development tool such as Visual Studio 2022. Create a class library project that targets .NET8, then reference the WealthLab.Core library DLL that you'll find in the WL8 installation folder.

> **Note:** If you are using Visual Studio 2022, it will need to be updated to at least version 17.8.6 to use .NET8.

Your Streaming Data Provider will be a class in this library that descends from `StreamingProviderBase`, which is defined in the WealthLab.Core library, in the `WealthLab.Data` namespace. After you implement and build your library, simply copy the resulting assembly DLL into the WL8 installation folder. The next time WL8 starts up, it will discover your Streaming Data Provider, making it available in appropriate locations of the WL8 user interface.

## Accessing the Host (WL8) Environment

The `IHost` interface allows your extension to access information about the user's WealthLab environment. For example, the location of the user data folder, or obtaining a list of DataSets defined by the user. At any point in your extension's code base, you can access an instance of the `IHost` interface using the singleton class `WLHost` and its `Instance` property. Example:

```csharp
//get user data folder
string folder = WLHost.Instance.DataFolder;
```

## Configuration of a Streaming Data Provider

`StreamingProviderBase` ultimately descends from the base class `Configurable`, which provides a way to allow the user to configure the provider. By default, it uses `ParameterList` type configuration, but you can change to `VanillaString` if needed.

### Parameter-Based Configuration
```csharp
protected override void GenerateParameters()
{
    Parameters.Add(new Parameter("API Key", ParameterType.String));
    Parameters.Add(new Parameter("Server URL", ParameterType.String, "wss://stream.example.com"));
}
```

## Important Descriptive Properties

Override these properties to control how your provider appears in WL8:
- `Name`
- `GlyphResource`
- `Description`
- `URL`

## Connection Management

### protected abstract bool Connect()
Override to establish connection to streaming source:

```csharp
protected override bool Connect()
{
    try
    {
        _webSocket = new WebSocket(_serverUrl);
        _webSocket.OnMessage += HandleMessage;
        _webSocket.Connect();
        return true;
    }
    catch (Exception ex)
    {
        DisconnectStreaming("Connection failed", ex);
        return false;
    }
}
```

### public bool IsConnected
Returns connection status.

### public void DisconnectStreaming(string reason, Exception ex = null)
Call when connection is lost:
```csharp
DisconnectStreaming("Connection lost", exception);
```

### Auto-Reconnect Support
```csharp
public override bool SupportsAutoReconnect => true;

protected override bool Reconnect()
{
    if (ReconnectInProgress)
    {
        // Skip heartbeat subscription during reconnect
        return base.Reconnect();
    }
    return false;
}
```

## Symbol Subscriptions

### protected abstract void SubscribeTo(string symbol)
Override to subscribe to symbol updates:
```csharp
protected override void SubscribeTo(string symbol)
{
    var request = new
    {
        type = "subscribe",
        symbol = symbol
    };
    _webSocket.Send(JsonSerializer.Serialize(request));
}
```

### protected abstract void UnsubscribeFrom(string symbol)
Override to unsubscribe from symbol updates:
```csharp
protected override void UnsubscribeFrom(string symbol)
{
    var request = new
    {
        type = "unsubscribe",
        symbol = symbol
    };
    _webSocket.Send(JsonSerializer.Serialize(request));
}
```

## Updating WL8 with Market Data

### Trade Updates
```csharp
public void UpdateTick(string symbol, DateTime dt, double price, double size, double prevClose)
{
    // Call when trade data received
}

public void UpdateTicksHighLow(string symbol, DateTime dt, double high, double low, double close, double size, double prevClose)
{
    // Call when aggregate tick data received
}
```

### Quote Updates
```csharp
public void UpdateBidAsk(string symbol, double bid, double ask)
{
    // Call when quote data received
}
```

### Heartbeat Updates
```csharp
public void UpdateHeartbeat(DateTime dt)
{
    // Call for connection health monitoring
}
```

## Streaming Bar Support

### Bar Interval Support
```csharp
public override bool SupportsStreamingBarInterval(int interval)
{
    // Return true for supported intervals (in minutes)
    return interval == 1 || interval == 5 || interval == 15;
}
```

### Bar Subscriptions
```csharp
protected override void SubscribeToStreamingBar(string symbol, HistoryScale scale)
{
    var request = new
    {
        type = "subscribe_bars",
        symbol = symbol,
        interval = scale.Interval
    };
    _webSocket.Send(JsonSerializer.Serialize(request));
}

protected override void UnsubscribeFromStreamingBar(string symbol, HistoryScale scale)
{
    var request = new
    {
        type = "unsubscribe_bars",
        symbol = symbol,
        interval = scale.Interval
    };
    _webSocket.Send(JsonSerializer.Serialize(request));
}
```

### Bar Updates
```csharp
public void UpdateStreamingBar(string symbol, HistoryScale scale, BarData barData)
{
    // Call when complete bar received
}
```

## Example Implementation

Here's a simple example using WebSocket-based streaming:

```csharp
public class WebSocketStreamingProvider : StreamingProviderBase
{
    private WebSocket _webSocket;
    private string _apiKey;
    private string _serverUrl;
    
    public override string Name => "WebSocket Streaming";
    public override string Description => "Real-time data via WebSocket";
    
    protected override void GenerateParameters()
    {
        Parameters.Add(new Parameter("API Key", ParameterType.String));
        Parameters.Add(new Parameter("Server URL", ParameterType.String, "wss://stream.example.com"));
    }
    
    public override void Initialize()
    {
        _apiKey = Parameters[0].AsString;
        _serverUrl = Parameters[1].AsString;
    }
    
    protected override bool Connect()
    {
        try
        {
            _webSocket = new WebSocket(_serverUrl);
            _webSocket.OnMessage += HandleMessage;
            _webSocket.OnClose += HandleDisconnect;
            _webSocket.Connect();
            
            // Authenticate
            var auth = new { type = "auth", apiKey = _apiKey };
            _webSocket.Send(JsonSerializer.Serialize(auth));
            
            return true;
        }
        catch (Exception ex)
        {
            DisconnectStreaming("Connection failed", ex);
            return false;
        }
    }
    
    private void HandleMessage(string message)
    {
        var data = JsonSerializer.Deserialize<StreamingData>(message);
        
        switch (data.type)
        {
            case "trade":
                UpdateTick(data.symbol, data.timestamp, data.price, data.size, data.prevClose);
                break;
                
            case "quote":
                UpdateBidAsk(data.symbol, data.bid, data.ask);
                break;
                
            case "bar":
                var bar = new BarData(data.timestamp, data.open, data.high, 
                                   data.low, data.close, data.volume);
                UpdateStreamingBar(data.symbol, new HistoryScale(data.interval), bar);
                break;
        }
    }
    
    private void HandleDisconnect()
    {
        DisconnectStreaming("WebSocket connection closed");
    }
    
    protected override void SubscribeTo(string symbol)
    {
        var sub = new { type = "subscribe", symbol = symbol };
        _webSocket.Send(JsonSerializer.Serialize(sub));
    }
    
    protected override void UnsubscribeFrom(string symbol)
    {
        var unsub = new { type = "unsubscribe", symbol = symbol };
        _webSocket.Send(JsonSerializer.Serialize(unsub));
    }
    
    public override bool SupportsAutoReconnect => true;
    
    public override bool SupportsStreamingBarInterval(int interval)
    {
        return interval == 1 || interval == 5;
    }
}
```

This example demonstrates:
1. WebSocket connection management
2. Authentication
3. Message handling
4. Trade and quote updates
5. Streaming bar support
6. Auto-reconnect capability 