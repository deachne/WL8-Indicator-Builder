"use client";

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, LineSeries } from 'lightweight-charts';

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface IndicatorData {
  time: string;
  value: number;
}

interface TradingViewChartProps {
  data: ChartData[];
  indicators?: {
    name: string;
    data: IndicatorData[];
    color: string;
  }[];
  width?: number;
  height?: number;
  darkTheme?: boolean;
}

export function TradingViewChart({
  data,
  indicators = [],
  width = 600,
  height = 300,
  darkTheme = true,
}: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const indicatorSeriesRefs = useRef<Map<string, ISeriesApi<"Line">>>(new Map());

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Get container dimensions for responsive sizing
    const containerWidth = chartContainerRef.current.clientWidth;
    const containerHeight = chartContainerRef.current.clientHeight;

    // Define chart options based on theme
    const chartOptions = {
      width: containerWidth || width,
      height: containerHeight || height,
      layout: {
        background: {
          type: ColorType.Solid,
          color: darkTheme ? '#151924' : '#FFFFFF',
        },
        textColor: darkTheme ? '#D9D9D9' : '#191919',
      },
      grid: {
        vertLines: {
          color: darkTheme ? '#2B2B43' : '#E6E6E6',
        },
        horzLines: {
          color: darkTheme ? '#2B2B43' : '#E6E6E6',
        },
      },
      crosshair: {
        mode: 0, // CrosshairMode.Normal
      },
      rightPriceScale: {
        borderColor: darkTheme ? '#2B2B43' : '#E6E6E6',
      },
      timeScale: {
        borderColor: darkTheme ? '#2B2B43' : '#E6E6E6',
        timeVisible: true,
        secondsVisible: false,
      },
    };

    // Create chart
    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    candlestickSeriesRef.current = candlestickSeries;

    // Set data
    candlestickSeries.setData(data);

    // Add indicator series
    indicators.forEach((indicator) => {
      const lineSeries = chart.addSeries(LineSeries, {
        color: indicator.color,
        lineWidth: 2,
        title: indicator.name,
      });
      lineSeries.setData(indicator.data);
      indicatorSeriesRefs.current.set(indicator.name, lineSeries);
    });

    // Fit content to container
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, indicators, width, height, darkTheme]);

  // Update chart when data changes
  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current) return;

    // Update candlestick data
    candlestickSeriesRef.current.setData(data);

    // Update indicator data
    indicators.forEach((indicator) => {
      const series = indicatorSeriesRefs.current.get(indicator.name);
      if (series) {
        series.setData(indicator.data);
      } else {
        // Create new series if it doesn't exist
        const newSeries = chartRef.current!.addSeries(LineSeries, {
          color: indicator.color,
          lineWidth: 2,
          title: indicator.name,
        });
        newSeries.setData(indicator.data);
        indicatorSeriesRefs.current.set(indicator.name, newSeries);
      }
    });

    // Remove series that are no longer in the indicators array
    indicatorSeriesRefs.current.forEach((series, name) => {
      if (!indicators.some(indicator => indicator.name === name) && chartRef.current && series) {
        try {
          chartRef.current.removeSeries(series);
        } catch (error) {
          console.error("Error removing series:", error);
        }
        indicatorSeriesRefs.current.delete(name);
      }
    });

    // Fit content to container
    chartRef.current.timeScale().fitContent();
  }, [data, indicators]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-full"
      style={{ position: 'relative' }}
    />
  );
}
