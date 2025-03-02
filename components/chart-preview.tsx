"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface ChartPreviewProps {
  symbol?: string;
  timeframe?: string;
}

export function ChartPreview({ symbol = "MSFT", timeframe = "Daily" }: ChartPreviewProps) {
  const [dateRange, setDateRange] = useState({ start: "Jan 1, 2025", end: "Mar 1, 2025" });
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="bg-gray-800 text-white px-4 py-3 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">Chart Visualization</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs">{symbol}</span>
            <Select defaultValue={selectedTimeframe} onValueChange={setSelectedTimeframe}>
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
      <CardContent className="flex-1 p-0 bg-slate-800">
        <div className="w-full h-[200px] flex flex-col items-center justify-center">
          {/* Mock chart visualization */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
                {/* Price line */}
                <path 
                  d="M0,150 C100,120 200,180 300,140 C400,100 500,160 600,130 C700,110 800,150 800,150" 
                  stroke="#ffffff" 
                  strokeWidth="2" 
                  fill="none" 
                />
                
                {/* Fast MA */}
                <path 
                  d="M0,170 C100,150 200,190 300,160 C400,130 500,170 600,150 C700,130 800,160 800,160" 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  fill="none" 
                />
                
                {/* Slow MA */}
                <path 
                  d="M0,190 C100,180 200,200 300,180 C400,160 500,180 600,170 C700,160 800,170 800,170" 
                  stroke="#f97316" 
                  strokeWidth="2" 
                  fill="none" 
                />
                
                {/* Crossover points */}
                <circle cx="250" cy="170" r="4" fill="#22c55e" />
                <circle cx="600" cy="160" r="4" fill="#22c55e" />
              </svg>
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-80 p-2 rounded text-xs">
              <div className="flex items-center mb-1">
                <div className="w-3 h-1 bg-white mr-2"></div>
                <span>Price</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-1 bg-blue-500 mr-2"></div>
                <span>Fast MA (10)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-1 bg-orange-500 mr-2"></div>
                <span>Slow MA (20)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="bg-gray-800 text-white px-4 py-2 text-sm">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">Current Value:</span> <span className="text-green-400">+2.45</span>
          </div>
          <div>
            <span className="font-medium">Signal:</span> <span className="text-green-400">Bullish</span>
          </div>
          <div>
            <span className="font-medium">Crossovers:</span> <span>2</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
