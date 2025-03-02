"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface IndicatorSettingsProps {
  selectedIndicators: string[];
  onToggleIndicator: (indicator: string) => void;
  indicatorParams: {
    sma: { period: number };
    ema: { period: number };
    rsi: { period: number };
    macd: { fastPeriod: number; slowPeriod: number; signalPeriod: number };
    bb: { period: number; stdDev: number };
  };
  onUpdateParams: (indicator: string, params: any) => void;
}

export function IndicatorSettings({
  selectedIndicators,
  onToggleIndicator,
  indicatorParams,
  onUpdateParams
}: IndicatorSettingsProps) {
  // Handle period change for simple indicators
  const handlePeriodChange = (indicator: string, value: number) => {
    switch (indicator) {
      case "sma":
        onUpdateParams("sma", { period: value });
        break;
      case "ema":
        onUpdateParams("ema", { period: value });
        break;
      case "rsi":
        onUpdateParams("rsi", { period: value });
        break;
      case "bb":
        onUpdateParams("bb", { ...indicatorParams.bb, period: value });
        break;
    }
  };

  // Handle MACD parameter changes
  const handleMacdChange = (param: 'fastPeriod' | 'slowPeriod' | 'signalPeriod', value: number) => {
    onUpdateParams("macd", {
      ...indicatorParams.macd,
      [param]: value
    });
  };

  // Handle Bollinger Bands standard deviation change
  const handleBBStdDevChange = (value: number) => {
    onUpdateParams("bb", {
      ...indicatorParams.bb,
      stdDev: value
    });
  };

  return (
    <Card className="bg-gray-800 text-white border-gray-700">
      <CardHeader className="px-4 py-3 border-b border-gray-700">
        <CardTitle className="text-sm font-medium">Indicator Settings</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* SMA Settings */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sma-toggle" 
              checked={selectedIndicators.includes("SMA")}
              onCheckedChange={() => onToggleIndicator("SMA")}
              className="data-[state=checked]:bg-blue-500"
            />
            <Label htmlFor="sma-toggle" className="text-sm font-medium">Simple Moving Average (SMA)</Label>
          </div>
          
          {selectedIndicators.includes("SMA") && (
            <div className="pl-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sma-period" className="text-xs">Period: {indicatorParams.sma.period}</Label>
                <div className="w-32">
                  <Slider
                    id="sma-period"
                    min={5}
                    max={200}
                    step={1}
                    value={[indicatorParams.sma.period]}
                    onValueChange={(value) => handlePeriodChange("sma", value[0])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator className="bg-gray-700" />
        
        {/* EMA Settings */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ema-toggle" 
              checked={selectedIndicators.includes("EMA")}
              onCheckedChange={() => onToggleIndicator("EMA")}
              className="data-[state=checked]:bg-orange-500"
            />
            <Label htmlFor="ema-toggle" className="text-sm font-medium">Exponential Moving Average (EMA)</Label>
          </div>
          
          {selectedIndicators.includes("EMA") && (
            <div className="pl-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="ema-period" className="text-xs">Period: {indicatorParams.ema.period}</Label>
                <div className="w-32">
                  <Slider
                    id="ema-period"
                    min={5}
                    max={200}
                    step={1}
                    value={[indicatorParams.ema.period]}
                    onValueChange={(value) => handlePeriodChange("ema", value[0])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator className="bg-gray-700" />
        
        {/* RSI Settings */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rsi-toggle" 
              checked={selectedIndicators.includes("RSI")}
              onCheckedChange={() => onToggleIndicator("RSI")}
              className="data-[state=checked]:bg-purple-500"
            />
            <Label htmlFor="rsi-toggle" className="text-sm font-medium">Relative Strength Index (RSI)</Label>
          </div>
          
          {selectedIndicators.includes("RSI") && (
            <div className="pl-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="rsi-period" className="text-xs">Period: {indicatorParams.rsi.period}</Label>
                <div className="w-32">
                  <Slider
                    id="rsi-period"
                    min={2}
                    max={50}
                    step={1}
                    value={[indicatorParams.rsi.period]}
                    onValueChange={(value) => handlePeriodChange("rsi", value[0])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator className="bg-gray-700" />
        
        {/* MACD Settings */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="macd-toggle" 
              checked={selectedIndicators.includes("MACD")}
              onCheckedChange={() => onToggleIndicator("MACD")}
              className="data-[state=checked]:bg-green-500"
            />
            <Label htmlFor="macd-toggle" className="text-sm font-medium">MACD</Label>
          </div>
          
          {selectedIndicators.includes("MACD") && (
            <div className="pl-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="macd-fast" className="text-xs">Fast Period: {indicatorParams.macd.fastPeriod}</Label>
                <div className="w-32">
                  <Slider
                    id="macd-fast"
                    min={2}
                    max={50}
                    step={1}
                    value={[indicatorParams.macd.fastPeriod]}
                    onValueChange={(value) => handleMacdChange("fastPeriod", value[0])}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="macd-slow" className="text-xs">Slow Period: {indicatorParams.macd.slowPeriod}</Label>
                <div className="w-32">
                  <Slider
                    id="macd-slow"
                    min={5}
                    max={100}
                    step={1}
                    value={[indicatorParams.macd.slowPeriod]}
                    onValueChange={(value) => handleMacdChange("slowPeriod", value[0])}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="macd-signal" className="text-xs">Signal Period: {indicatorParams.macd.signalPeriod}</Label>
                <div className="w-32">
                  <Slider
                    id="macd-signal"
                    min={2}
                    max={50}
                    step={1}
                    value={[indicatorParams.macd.signalPeriod]}
                    onValueChange={(value) => handleMacdChange("signalPeriod", value[0])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator className="bg-gray-700" />
        
        {/* Bollinger Bands Settings */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="bb-toggle" 
              checked={selectedIndicators.includes("BB")}
              onCheckedChange={() => onToggleIndicator("BB")}
              className="data-[state=checked]:bg-slate-400"
            />
            <Label htmlFor="bb-toggle" className="text-sm font-medium">Bollinger Bands</Label>
          </div>
          
          {selectedIndicators.includes("BB") && (
            <div className="pl-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bb-period" className="text-xs">Period: {indicatorParams.bb.period}</Label>
                <div className="w-32">
                  <Slider
                    id="bb-period"
                    min={5}
                    max={50}
                    step={1}
                    value={[indicatorParams.bb.period]}
                    onValueChange={(value) => handlePeriodChange("bb", value[0])}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="bb-stddev" className="text-xs">Standard Deviation: {indicatorParams.bb.stdDev}</Label>
                <div className="w-32">
                  <Slider
                    id="bb-stddev"
                    min={0.5}
                    max={4}
                    step={0.1}
                    value={[indicatorParams.bb.stdDev]}
                    onValueChange={(value) => handleBBStdDevChange(value[0])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
