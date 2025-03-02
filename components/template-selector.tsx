"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChartBar, LineChart, Activity, TrendingUp, BarChart3, Code } from "lucide-react";

interface TemplateSelectorProps {
  onTemplateChange?: (template: string) => void;
  onSymbolChange?: (symbol: string) => void;
  selectedTemplate?: string;
  selectedSymbol?: string;
  availableSymbols?: string[];
}

export function TemplateSelector({ 
  onTemplateChange, 
  onSymbolChange, 
  selectedTemplate = "moving-average", 
  selectedSymbol = "MSFT",
  availableSymbols = ["MSFT", "AAPL", "GOOGL", "AMZN", "TSLA", "SPY"]
}: TemplateSelectorProps) {
  const handleTemplateChange = (value: string) => {
    if (onTemplateChange) {
      onTemplateChange(value);
    }
  };

  const handleSymbolChange = (value: string) => {
    if (onSymbolChange) {
      onSymbolChange(value);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="template" className="text-white whitespace-nowrap">Template:</Label>
        <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
          <SelectTrigger id="template" className="w-[200px] bg-gray-700 text-white border-gray-600 focus:ring-teal-500">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="moving-average" className="focus:bg-gray-700 focus:text-white">
              <div className="flex items-center">
                <LineChart className="mr-2 h-4 w-4 text-blue-400" />
                <span>Simple Moving Average</span>
              </div>
            </SelectItem>
            <SelectItem value="rsi" className="focus:bg-gray-700 focus:text-white">
              <div className="flex items-center">
                <Activity className="mr-2 h-4 w-4 text-purple-400" />
                <span>Relative Strength Index</span>
              </div>
            </SelectItem>
            <SelectItem value="macd" className="focus:bg-gray-700 focus:text-white">
              <div className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4 text-yellow-400" />
                <span>MACD</span>
              </div>
            </SelectItem>
            <SelectItem value="bollinger" className="focus:bg-gray-700 focus:text-white">
              <div className="flex items-center">
                <ChartBar className="mr-2 h-4 w-4 text-red-400" />
                <span>Bollinger Bands</span>
              </div>
            </SelectItem>
            <SelectItem value="custom" className="focus:bg-gray-700 focus:text-white">
              <div className="flex items-center">
                <Code className="mr-2 h-4 w-4 text-teal-400" />
                <span>Custom Indicator</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="symbol" className="text-white whitespace-nowrap">Symbol:</Label>
        <Select value={selectedSymbol} onValueChange={handleSymbolChange}>
          <SelectTrigger id="symbol" className="w-[120px] bg-gray-700 text-white border-gray-600 focus:ring-teal-500">
            <SelectValue placeholder="Select symbol" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            {availableSymbols.map(symbol => (
              <SelectItem key={symbol} value={symbol} className="focus:bg-gray-700 focus:text-white">
                {symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
