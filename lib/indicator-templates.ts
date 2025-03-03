/**
 * Indicator Templates for WL8 Indicator Builder
 * 
 * This file contains templates for common indicators that can be generated
 * by the AI Assistant based on user requests.
 */

export interface IndicatorParams {
  [key: string]: any;
}

/**
 * Generate an indicator template based on type and parameters
 */
export function generateIndicatorTemplate(type: string, params: IndicatorParams = {}): string {
  switch (type.toLowerCase()) {
    case "sma":
    case "sma crossover":
    case "moving average crossover":
      return generateSMACrossoverTemplate(params);
    case "rsi":
      return generateRSITemplate(params);
    case "macd":
      return generateMACDTemplate(params);
    case "bollinger":
    case "bollinger bands":
      return generateBollingerBandsTemplate(params);
    case "custom":
    default:
      return generateCustomTemplate(params);
  }
}

/**
 * Generate a Simple Moving Average (SMA) Crossover indicator
 */
function generateSMACrossoverTemplate(params: IndicatorParams = {}): string {
  const fastPeriod = params.fast || params.fastPeriod || 10;
  const slowPeriod = params.slow || params.slowPeriod || 20;
  
  return `using WealthLab;
using WealthLab.Indicators;

// SMA Crossover Indicator
namespace MyIndicators
{
  public class SMACrossover : IndicatorBase
  {
    [Parameter]
    public int FastPeriod { get; set; }
    
    [Parameter]
    public int SlowPeriod { get; set; }
    
    public SMACrossover()
    {
      // Default parameters
      FastPeriod = ${fastPeriod};
      SlowPeriod = ${slowPeriod};
    }
    
    public override DataSeries Series(BarHistory bars)
    {
      // Calculate fast and slow moving averages
      DataSeries fastMA = SMA.Series(bars.Close, FastPeriod);
      DataSeries slowMA = SMA.Series(bars.Close, SlowPeriod);
      
      // Return the difference (crossover indicator)
      return fastMA - slowMA;
    }
  }
}`;
}

/**
 * Generate a Relative Strength Index (RSI) indicator
 */
function generateRSITemplate(params: IndicatorParams = {}): string {
  const period = params.period || 14;
  const overbought = params.overbought || 70;
  const oversold = params.oversold || 30;
  
  return `using WealthLab;
using WealthLab.Indicators;

// RSI Indicator
namespace MyIndicators
{
  public class MyRSI : IndicatorBase
  {
    [Parameter]
    public int Period { get; set; }
    
    [Parameter]
    public double Overbought { get; set; }
    
    [Parameter]
    public double Oversold { get; set; }
    
    public MyRSI()
    {
      // Default parameters
      Period = ${period};
      Overbought = ${overbought};
      Oversold = ${oversold};
    }
    
    public override DataSeries Series(BarHistory bars)
    {
      // Calculate RSI
      DataSeries rsi = RSI.Series(bars.Close, Period);
      
      // Return the RSI series
      return rsi;
    }
  }
}`;
}

/**
 * Generate a Moving Average Convergence Divergence (MACD) indicator
 */
function generateMACDTemplate(params: IndicatorParams = {}): string {
  const fastPeriod = params.fast || params.fastPeriod || 12;
  const slowPeriod = params.slow || params.slowPeriod || 26;
  const signalPeriod = params.signal || params.signalPeriod || 9;
  
  return `using WealthLab;
using WealthLab.Indicators;

// MACD Indicator
namespace MyIndicators
{
  public class MyMACD : IndicatorBase
  {
    [Parameter]
    public int FastPeriod { get; set; }
    
    [Parameter]
    public int SlowPeriod { get; set; }
    
    [Parameter]
    public int SignalPeriod { get; set; }
    
    public MyMACD()
    {
      // Default parameters
      FastPeriod = ${fastPeriod};
      SlowPeriod = ${slowPeriod};
      SignalPeriod = ${signalPeriod};
    }
    
    public override DataSeries Series(BarHistory bars)
    {
      // Calculate MACD line
      DataSeries macdLine = MACD.Series(bars.Close, FastPeriod, SlowPeriod, SignalPeriod);
      
      // Calculate signal line
      DataSeries signalLine = EMA.Series(macdLine, SignalPeriod);
      
      // Return the MACD histogram
      return macdLine - signalLine;
    }
  }
}`;
}

/**
 * Generate a Bollinger Bands indicator
 */
function generateBollingerBandsTemplate(params: IndicatorParams = {}): string {
  const period = params.period || 20;
  const stdDev = params.stdDev || params.deviations || 2;
  
  return `using WealthLab;
using WealthLab.Indicators;

// Bollinger Bands Indicator
namespace MyIndicators
{
  public class MyBollingerBands : IndicatorBase
  {
    [Parameter]
    public int Period { get; set; }
    
    [Parameter]
    public double StdDev { get; set; }
    
    public MyBollingerBands()
    {
      // Default parameters
      Period = ${period};
      StdDev = ${stdDev};
    }
    
    public override DataSeries Series(BarHistory bars)
    {
      // Calculate Bollinger Bands
      DataSeries middle = SMA.Series(bars.Close, Period);
      DataSeries upper = BBandUpper.Series(bars.Close, Period, StdDev);
      DataSeries lower = BBandLower.Series(bars.Close, Period, StdDev);
      
      // Return distance from price to upper band normalized
      return (upper - bars.Close) / (upper - lower) * 100;
    }
  }
}`;
}

/**
 * Generate a custom indicator template
 */
function generateCustomTemplate(params: IndicatorParams = {}): string {
  return `using WealthLab;
using WealthLab.Indicators;

// Custom Indicator
namespace MyIndicators
{
  public class CustomIndicator : IndicatorBase
  {
    [Parameter]
    public int Period { get; set; }
    
    public CustomIndicator()
    {
      // Default parameters
      Period = 14;
    }
    
    public override DataSeries Series(BarHistory bars)
    {
      // Implement your indicator logic here
      DataSeries result = new DataSeries(bars);
      
      // Your calculation code
      
      return result;
    }
  }
}`;
}
