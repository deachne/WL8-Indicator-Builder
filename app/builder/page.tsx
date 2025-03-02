"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AiAssistant } from "@/components/ai-assistant";
import { CodeDisplay } from "@/components/code-display";
import { ChartPreview } from "@/components/chart-preview";
import { TemplateSelector } from "@/components/template-selector";

// Sample indicator code for demonstration
const sampleCode = `using WealthLab;
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
}`;

export default function IndicatorBuilderPage() {
  const [template, setTemplate] = useState("moving-average");
  const [symbol, setSymbol] = useState("MSFT");
  const [code, setCode] = useState(sampleCode);
  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate);
    // In a real implementation, we would update the code based on the template
  };

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    // In a real implementation, we would update the chart data based on the symbol
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
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
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-6 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-220px)]">
          {/* Left Column: Code and Chart */}
          <div className="lg:col-span-3 flex flex-col gap-6 h-full">
            {/* Code Display - takes up 60% of the left column */}
            <div className="h-[60%]">
              <CodeDisplay 
                code={code} 
                onChange={handleCodeChange} 
              />
            </div>
            
            {/* Chart Preview - takes up 40% of the left column */}
            <div className="h-[40%]">
              <ChartPreview symbol={symbol} />
            </div>
          </div>
          
          {/* Right Column: AI Assistant */}
          <div className="lg:col-span-2 h-full flex">
            <div className="w-full h-full flex flex-col">
              <AiAssistant 
                initialContext={`WL8 indicator development for ${template} template with ${symbol}`} 
                placeholder="Describe the indicator you want to create..." 
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
