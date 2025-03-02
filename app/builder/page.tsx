"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AiAssistant } from "@/components/ai-assistant";
import { CodeDisplay } from "@/components/code-display";
import { ChartPreview } from "@/components/chart-preview";
import { TemplateSelector } from "@/components/template-selector";
import { IndicatorSettings } from "@/components/indicator-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { getAvailableSymbols } from "@/lib/stock-data";
import { fetchStockData } from "@/lib/data-fetcher";

// Define template types
type TemplateType = 'moving-average' | 'rsi' | 'macd' | 'bollinger' | 'custom';

// Sample indicator code templates
const codeTemplates: Record<TemplateType, string> = {
  "moving-average": `using WealthLab;
using WealthLab.Indicators;

// My Custom Moving Average Crossover Indicator
namespace MyIndicators
{
  public class MACrossover : IndicatorBase
  {
    public override DataSeries Series(BarHistory bars)
    {
      DataSeries fastMA = SMA.Series(bars.Close, 10);
      DataSeries slowMA = SMA.Series(bars.Close, 20);
      return fastMA - slowMA;
    }
  }
}`,
  "rsi": `using WealthLab;
using WealthLab.Indicators;

// My Custom RSI Indicator
namespace MyIndicators
{
  public class MyRSI : IndicatorBase
  {
    public override DataSeries Series(BarHistory bars)
    {
      DataSeries rsi = RSI.Series(bars.Close, 14);
      return rsi;
    }
  }
}`,
  "macd": `using WealthLab;
using WealthLab.Indicators;

// My Custom MACD Indicator
namespace MyIndicators
{
  public class MyMACD : IndicatorBase
  {
    public override DataSeries Series(BarHistory bars)
    {
      DataSeries macdLine = MACD.Series(bars.Close, 12, 26, 9);
      DataSeries signalLine = EMA.Series(macdLine, 9);
      return macdLine - signalLine; // MACD Histogram
    }
  }
}`,
  "bollinger": `using WealthLab;
using WealthLab.Indicators;

// My Custom Bollinger Bands Indicator
namespace MyIndicators
{
  public class MyBollingerBands : IndicatorBase
  {
    public override DataSeries Series(BarHistory bars)
    {
      DataSeries middle = SMA.Series(bars.Close, 20);
      DataSeries upper = BBandUpper.Series(bars.Close, 20, 2);
      DataSeries lower = BBandLower.Series(bars.Close, 20, 2);
      
      // Return distance from price to upper band normalized
      return (upper - bars.Close) / (upper - lower) * 100;
    }
  }
}`,
  "custom": `using WealthLab;
using WealthLab.Indicators;

// My Custom Indicator
namespace MyIndicators
{
  public class CustomIndicator : IndicatorBase
  {
    public override DataSeries Series(BarHistory bars)
    {
      // Your custom indicator logic here
      return bars.Close;
    }
  }
}`
};

// Convert WL8 code to JavaScript equivalent
function convertWL8ToJS(wl8Code: string): string {
  // This is a simplified conversion for demonstration
  // In a real implementation, this would be more sophisticated
  
  let jsCode = "// JavaScript equivalent of the WL8 indicator\n\n";
  
  if (wl8Code.includes("SMA.Series")) {
    jsCode += `function calculateIndicator(data) {
  // Extract close prices
  const closePrices = data.map(bar => bar.close);
  
  // Calculate SMA
  function calculateSMA(prices, period) {
    const result = [];
    for (let i = period - 1; i < prices.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += prices[i - j];
      }
      result.push(sum / period);
    }
    return result;
  }
  
  // Calculate indicator values
  const fastMA = calculateSMA(closePrices, 10);
  const slowMA = calculateSMA(closePrices, 20);
  
  // Calculate the difference (crossover indicator)
  const result = fastMA.map((fast, i) => fast - slowMA[i]);
  
  return result;
}`;
  } else if (wl8Code.includes("RSI.Series")) {
    jsCode += `function calculateIndicator(data) {
  // Extract close prices
  const closePrices = data.map(bar => bar.close);
  
  // Calculate RSI
  function calculateRSI(prices, period) {
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }
    
    const result = [];
    let avgGain = 0;
    let avgLoss = 0;
    
    // Calculate first average gain and loss
    for (let i = 0; i < period; i++) {
      if (changes[i] > 0) avgGain += changes[i];
      else avgLoss += Math.abs(changes[i]);
    }
    
    avgGain /= period;
    avgLoss /= period;
    
    // Calculate RSI for each point
    for (let i = period; i < changes.length; i++) {
      // Update average gain and loss
      avgGain = ((avgGain * (period - 1)) + (changes[i - 1] > 0 ? changes[i - 1] : 0)) / period;
      avgLoss = ((avgLoss * (period - 1)) + (changes[i - 1] < 0 ? Math.abs(changes[i - 1]) : 0)) / period;
      
      // Calculate RS and RSI
      const rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss);
      const rsi = 100 - (100 / (1 + rs));
      
      result.push(rsi);
    }
    
    return result;
  }
  
  return calculateRSI(closePrices, 14);
}`;
  } else if (wl8Code.includes("MACD.Series")) {
    jsCode += `function calculateIndicator(data) {
  // Extract close prices
  const closePrices = data.map(bar => bar.close);
  
  // Calculate EMA
  function calculateEMA(prices, period) {
    const k = 2 / (period + 1);
    const result = [];
    
    // First EMA is SMA
    let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;
    result.push(ema);
    
    // Calculate EMA for remaining prices
    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * k + ema;
      result.push(ema);
    }
    
    return result;
  }
  
  // Calculate MACD
  const fastEMA = calculateEMA(closePrices, 12);
  const slowEMA = calculateEMA(closePrices, 26);
  
  // Calculate MACD line
  const macdLine = [];
  for (let i = 0; i < fastEMA.length && i < slowEMA.length; i++) {
    macdLine.push(fastEMA[i] - slowEMA[i]);
  }
  
  // Calculate signal line
  const signalLine = calculateEMA(macdLine, 9);
  
  // Calculate histogram
  const histogram = [];
  for (let i = 0; i < macdLine.length && i < signalLine.length; i++) {
    histogram.push(macdLine[i] - signalLine[i]);
  }
  
  return histogram;
}`;
  } else if (wl8Code.includes("BBand")) {
    jsCode += `function calculateIndicator(data) {
  // Extract close prices
  const closePrices = data.map(bar => bar.close);
  
  // Calculate SMA
  function calculateSMA(prices, period) {
    const result = [];
    for (let i = period - 1; i < prices.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += prices[i - j];
      }
      result.push(sum / period);
    }
    return result;
  }
  
  // Calculate standard deviation
  function calculateStdDev(prices, period, sma) {
    const result = [];
    for (let i = period - 1; i < prices.length; i++) {
      let sumSquaredDiff = 0;
      for (let j = 0; j < period; j++) {
        sumSquaredDiff += Math.pow(prices[i - j] - sma[i - period + 1], 2);
      }
      result.push(Math.sqrt(sumSquaredDiff / period));
    }
    return result;
  }
  
  // Calculate Bollinger Bands
  const period = 20;
  const multiplier = 2;
  const sma = calculateSMA(closePrices, period);
  const stdDev = calculateStdDev(closePrices, period, sma);
  
  const upperBand = [];
  const lowerBand = [];
  
  for (let i = 0; i < sma.length; i++) {
    upperBand.push(sma[i] + (stdDev[i] * multiplier));
    lowerBand.push(sma[i] - (stdDev[i] * multiplier));
  }
  
  // Calculate normalized distance from price to upper band
  const result = [];
  for (let i = 0; i < upperBand.length; i++) {
    const price = closePrices[i + period - 1];
    result.push((upperBand[i] - price) / (upperBand[i] - lowerBand[i]) * 100);
  }
  
  return result;
}`;
  }
  
  return jsCode;
}

export default function IndicatorBuilderPage() {
  // State for template and symbol selection
  const [template, setTemplate] = useState<TemplateType>("moving-average");
  const [symbol, setSymbol] = useState("MSFT");
  
  // State for code display
  const [wl8Code, setWL8Code] = useState(codeTemplates["moving-average"]);
  const [jsCode, setJSCode] = useState(convertWL8ToJS(codeTemplates["moving-average"]));
  
  // State for indicator settings
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(["SMA"]);
  const [indicatorParams, setIndicatorParams] = useState({
    sma: { period: 20 },
    ema: { period: 10 },
    rsi: { period: 14 },
    macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
    bb: { period: 20, stdDev: 2 }
  });
  
  // State for API key (for real data fetching)
  const [apiKey, setApiKey] = useState("");
  const [useRealData, setUseRealData] = useState(false);
  
  // Update code when template changes
  useEffect(() => {
    if (codeTemplates[template]) {
      setWL8Code(codeTemplates[template]);
      setJSCode(convertWL8ToJS(codeTemplates[template]));
      
      // Update selected indicators based on template
      switch (template) {
        case "moving-average":
          setSelectedIndicators(["SMA", "EMA"]);
          break;
        case "rsi":
          setSelectedIndicators(["RSI"]);
          break;
        case "macd":
          setSelectedIndicators(["MACD"]);
          break;
        case "bollinger":
          setSelectedIndicators(["BB"]);
          break;
      }
    }
  }, [template]);
  
  // Handle template change
  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate as TemplateType);
  };

  // Handle symbol change
  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
  };

  // Handle WL8 code change
  const handleWL8CodeChange = (newCode: string) => {
    setWL8Code(newCode);
    setJSCode(convertWL8ToJS(newCode));
  };
  
  // Handle indicator toggle
  const handleToggleIndicator = (indicator: string) => {
    if (selectedIndicators.includes(indicator)) {
      setSelectedIndicators(selectedIndicators.filter(i => i !== indicator));
    } else {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };
  
  // Handle indicator parameter updates
  const handleUpdateParams = (indicator: string, params: any) => {
    setIndicatorParams({
      ...indicatorParams,
      [indicator]: params
    });
  };
  
  // Handle real data toggle
  const handleRealDataToggle = () => {
    setUseRealData(!useRealData);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      
      {/* Indicator Builder Header with Template Selector */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">WL8 Indicator Builder</h1>
          <TemplateSelector 
            onTemplateChange={handleTemplateChange} 
            onSymbolChange={handleSymbolChange} 
            selectedTemplate={template}
            selectedSymbol={symbol}
            availableSymbols={getAvailableSymbols()}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-6 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-220px)]">
          {/* Left Column: Code and Chart */}
          <div className="lg:col-span-3 flex flex-col gap-6 h-full">
            {/* Code Display with Tabs - takes up 50% of the left column */}
            <div className="h-[50%]">
              <Tabs defaultValue="wl8" className="w-full h-full">
                <div className="flex justify-between items-center mb-2">
                  <TabsList className="bg-gray-800">
                    <TabsTrigger value="wl8" className="data-[state=active]:bg-gray-700">WL8 Code</TabsTrigger>
                    <TabsTrigger value="js" className="data-[state=active]:bg-gray-700">JavaScript</TabsTrigger>
                  </TabsList>
                  
                  {/* API Key Input for Real Data */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <input 
                        type="checkbox" 
                        id="use-real-data" 
                        checked={useRealData}
                        onChange={handleRealDataToggle}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="use-real-data" className="text-xs">Use Real Data</Label>
                    </div>
                    
                    {useRealData && (
                      <div className="flex items-center gap-1">
                        <Input 
                          type="text" 
                          placeholder="Alpha Vantage API Key" 
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="h-7 text-xs bg-gray-800 border-gray-700 w-40"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <TabsContent value="wl8" className="h-[calc(100%-40px)] m-0">
                  <CodeDisplay 
                    code={wl8Code} 
                    onChange={handleWL8CodeChange} 
                    language="csharp"
                  />
                </TabsContent>
                <TabsContent value="js" className="h-[calc(100%-40px)] m-0">
                  <CodeDisplay 
                    code={jsCode} 
                    onChange={() => {}} // Read-only
                    language="javascript"
                    readOnly={true}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Chart Preview - takes up 50% of the left column */}
            <div className="h-[50%]">
              <ChartPreview 
                symbol={symbol} 
                template={template}
              />
            </div>
          </div>
          
          {/* Right Column: AI Assistant */}
          <div className="lg:col-span-2 h-full">
            <AiAssistant 
              initialContext={`WL8 indicator development for ${template} template with ${symbol}`} 
              placeholder="Describe the indicator you want to create..." 
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
