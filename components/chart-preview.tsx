"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { TradingViewChart } from "@/components/ui/tradingview-chart";
import { getDummyStockData, getAvailableSymbols, OHLCData } from "@/lib/stock-data";
import { 
  calculateSMA, 
  calculateEMA, 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  IndicatorData
} from "@/lib/indicators";

interface ChartPreviewProps {
  symbol?: string;
  timeframe?: string;
  template?: string;
}

export function ChartPreview({ 
  symbol = "MSFT", 
  timeframe = "Daily",
  template = "moving-average"
}: ChartPreviewProps) {
  // State for chart data and settings
  const [stockData, setStockData] = useState<OHLCData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState(symbol);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [selectedTemplate, setSelectedTemplate] = useState(template);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(["SMA"]);
  const [indicatorParams, setIndicatorParams] = useState({
    sma: { period: 20 },
    ema: { period: 10 },
    rsi: { period: 14 },
    macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
    bb: { period: 20, stdDev: 2 }
  });
  
  // Date range for display
  const dateRange = useMemo(() => {
    if (stockData.length === 0) return { start: "Jan 1, 2025", end: "Mar 1, 2025" };
    
    const startDate = new Date(stockData[0].time);
    const endDate = new Date(stockData[stockData.length - 1].time);
    
    return {
      start: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      end: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }, [stockData]);
  
  // Load stock data when symbol changes
  useEffect(() => {
    const data = getDummyStockData(selectedSymbol as any);
    setStockData(data);
    setSelectedSymbol(symbol);
  }, [symbol, selectedSymbol]);
  
  // Update selected template and indicators when template prop changes
  useEffect(() => {
    setSelectedTemplate(template);
    
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
      case "custom":
        // Keep current indicators for custom template
        break;
      default:
        setSelectedIndicators(["SMA"]);
    }
  }, [template]);
  
  // Calculate indicators based on stock data and selected indicators
  const indicators = useMemo(() => {
    if (!stockData.length) return [];
    
    const result = [];
    
    if (selectedIndicators.includes("SMA")) {
      const smaData = calculateSMA(stockData, indicatorParams.sma.period);
      result.push({
        name: `SMA (${indicatorParams.sma.period})`,
        data: smaData,
        color: "#3b82f6" // blue
      });
    }
    
    if (selectedIndicators.includes("EMA")) {
      const emaData = calculateEMA(stockData, indicatorParams.ema.period);
      result.push({
        name: `EMA (${indicatorParams.ema.period})`,
        data: emaData,
        color: "#f97316" // orange
      });
    }
    
    if (selectedIndicators.includes("RSI")) {
      const rsiData = calculateRSI(stockData, indicatorParams.rsi.period);
      // Transform RSI to be in the same scale as price for visualization
      const scaledRsiData = rsiData.map(item => {
        const avgPrice = (stockData.find(d => d.time === item.time)?.close || 0);
        // Scale RSI from 0-100 to a range around the average price
        const scaledValue = avgPrice * (0.8 + (item.value / 500)); // This puts RSI in a range of ±10% of price
        return {
          time: item.time,
          value: scaledValue
        };
      });
      
      result.push({
        name: `RSI (${indicatorParams.rsi.period})`,
        data: scaledRsiData,
        color: "#a855f7" // purple
      });
    }
    
    if (selectedIndicators.includes("MACD")) {
      const macdData = calculateMACD(
        stockData, 
        indicatorParams.macd.fastPeriod,
        indicatorParams.macd.slowPeriod,
        indicatorParams.macd.signalPeriod
      );
      
      // Scale MACD to be visible on the price chart
      const avgPrice = stockData.reduce((sum, item) => sum + item.close, 0) / stockData.length;
      const scaleFactor = avgPrice / 50; // Adjust this factor based on your data
      
      const scaledMacdLine = macdData.macdLine.map(item => ({
        time: item.time,
        value: avgPrice + (item.value * scaleFactor)
      }));
      
      const scaledSignalLine = macdData.signalLine.map(item => ({
        time: item.time,
        value: avgPrice + (item.value * scaleFactor)
      }));
      
      result.push({
        name: `MACD Line`,
        data: scaledMacdLine,
        color: "#22c55e" // green
      });
      
      result.push({
        name: `MACD Signal`,
        data: scaledSignalLine,
        color: "#ef4444" // red
      });
    }
    
    if (selectedIndicators.includes("BB")) {
      const bbData = calculateBollingerBands(stockData, indicatorParams.bb.period, indicatorParams.bb.stdDev);
      
      result.push({
        name: `BB Upper`,
        data: bbData.upper,
        color: "#94a3b8" // slate
      });
      
      result.push({
        name: `BB Lower`,
        data: bbData.lower,
        color: "#94a3b8" // slate
      });
    }
    
    return result;
  }, [stockData, selectedIndicators, indicatorParams]);
  
  // Toggle indicator selection
  const toggleIndicator = (indicator: string) => {
    if (selectedIndicators.includes(indicator)) {
      setSelectedIndicators(selectedIndicators.filter(i => i !== indicator));
    } else {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };
  
  // Calculate current indicator values for display
  const currentValues = useMemo(() => {
    if (!stockData.length) return { value: 0, signal: "Neutral", crossovers: 0 };
    
    const lastPrice = stockData[stockData.length - 1].close;
    let signal = "Neutral";
    let crossovers = 0;
    
    // Simple signal based on SMA crossover
    if (selectedIndicators.includes("SMA") && selectedIndicators.includes("EMA")) {
      const smaData = calculateSMA(stockData, indicatorParams.sma.period);
      const emaData = calculateEMA(stockData, indicatorParams.ema.period);
      
      if (smaData.length && emaData.length) {
        const lastSma = smaData[smaData.length - 1].value;
        const lastEma = emaData[emaData.length - 1].value;
        
        // Count crossovers
        let prevSmaBelowEma = false;
        for (let i = 0; i < Math.min(smaData.length, emaData.length); i++) {
          const smaBelowEma = smaData[i].value < emaData[i].value;
          if (i > 0 && smaBelowEma !== prevSmaBelowEma) {
            crossovers++;
          }
          prevSmaBelowEma = smaBelowEma;
        }
        
        // Determine signal
        if (lastEma > lastSma) {
          signal = "Bullish";
        } else if (lastEma < lastSma) {
          signal = "Bearish";
        }
      }
    }
    
    return {
      value: lastPrice,
      signal,
      crossovers
    };
  }, [stockData, selectedIndicators, indicatorParams]);
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="bg-gray-800 text-white px-4 py-3 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">Chart Visualization</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="h-7 w-24 bg-gray-700 text-white border-gray-600 text-xs">
                <SelectValue placeholder="Symbol" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {getAvailableSymbols().map(sym => (
                  <SelectItem key={sym} value={sym}>{sym}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="h-7 w-24 bg-gray-700 text-white border-gray-600 text-xs">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="1min">1 Minute</SelectItem>
                <SelectItem value="5min">5 Minutes</SelectItem>
                <SelectItem value="15min">15 Minutes</SelectItem>
                <SelectItem value="1hour">1 Hour</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <div className="bg-gray-800 text-white px-4 py-2 text-xs flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-6 w-6 p-0">
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <span>{dateRange.start} - {dateRange.end}</span>
          <Button variant="outline" size="icon" className="h-6 w-6 p-0">
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-6 w-6 p-0">
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="h-6 w-6 p-0">
            <ZoomIn className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <CardContent className="flex-1 p-0 bg-slate-800" style={{ minHeight: '200px' }}>
        {stockData.length > 0 ? (
          <TradingViewChart 
            data={stockData}
            indicators={indicators}
            darkTheme={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            Loading chart data...
          </div>
        )}
      </CardContent>
      <div className="bg-gray-800 text-white px-4 py-2 text-sm">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">Current Value:</span> 
            <span className={currentValues.signal === "Bullish" ? "text-green-400" : currentValues.signal === "Bearish" ? "text-red-400" : "text-white"}>
              {" "}{currentValues.value.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="font-medium">Signal:</span> 
            <span className={currentValues.signal === "Bullish" ? "text-green-400" : currentValues.signal === "Bearish" ? "text-red-400" : "text-white"}>
              {" "}{currentValues.signal}
            </span>
          </div>
          <div>
            <span className="font-medium">Crossovers:</span> <span>{currentValues.crossovers}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
