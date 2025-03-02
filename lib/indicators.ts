"use client";

import { OHLCData } from './stock-data';

/**
 * Technical indicators implementation for WL8 Indicator Builder
 * These functions replicate the behavior of WL8 indicators in JavaScript
 */

export interface IndicatorData {
  time: string;
  value: number;
}

/**
 * Extract close prices from OHLC data
 * @param data - Array of OHLC data
 * @returns Array of close prices
 */
export function getClosePrices(data: OHLCData[]): number[] {
  return data.map(item => item.close);
}

/**
 * Extract timestamps from OHLC data
 * @param data - Array of OHLC data
 * @returns Array of timestamps
 */
export function getTimestamps(data: OHLCData[]): string[] {
  return data.map(item => item.time);
}

/**
 * Calculate Simple Moving Average (SMA)
 * @param data - Array of OHLC data
 * @param period - Period for SMA calculation
 * @param priceType - Price type to use (default: 'close')
 * @returns Array of SMA values with timestamps
 */
export function calculateSMA(
  data: OHLCData[], 
  period: number = 14,
  priceType: 'open' | 'high' | 'low' | 'close' = 'close'
): IndicatorData[] {
  if (data.length < period) {
    return [];
  }

  const prices = data.map(item => item[priceType]);
  const timestamps = getTimestamps(data);
  const result: IndicatorData[] = [];

  // Calculate SMA for each point where we have enough data
  for (let i = period - 1; i < prices.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += prices[i - j];
    }
    const sma = parseFloat((sum / period).toFixed(2));
    result.push({
      time: timestamps[i],
      value: sma
    });
  }

  return result;
}

/**
 * Calculate Exponential Moving Average (EMA)
 * @param data - Array of OHLC data
 * @param period - Period for EMA calculation
 * @param priceType - Price type to use (default: 'close')
 * @returns Array of EMA values with timestamps
 */
export function calculateEMA(
  data: OHLCData[], 
  period: number = 14,
  priceType: 'open' | 'high' | 'low' | 'close' = 'close'
): IndicatorData[] {
  if (data.length < period) {
    return [];
  }

  const prices = data.map(item => item[priceType]);
  const timestamps = getTimestamps(data);
  const result: IndicatorData[] = [];
  
  // Multiplier: (2 / (period + 1))
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;
  
  // Calculate EMA for each point where we have enough data
  for (let i = period - 1; i < prices.length; i++) {
    if (i > period - 1) {
      // EMA = (Close - EMA(previous)) * multiplier + EMA(previous)
      ema = (prices[i] - ema) * multiplier + ema;
    }
    
    result.push({
      time: timestamps[i],
      value: parseFloat(ema.toFixed(2))
    });
  }

  return result;
}

/**
 * Calculate Relative Strength Index (RSI)
 * @param data - Array of OHLC data
 * @param period - Period for RSI calculation (default: 14)
 * @param priceType - Price type to use (default: 'close')
 * @returns Array of RSI values with timestamps
 */
export function calculateRSI(
  data: OHLCData[], 
  period: number = 14,
  priceType: 'open' | 'high' | 'low' | 'close' = 'close'
): IndicatorData[] {
  if (data.length < period + 1) {
    return [];
  }

  const prices = data.map(item => item[priceType]);
  const timestamps = getTimestamps(data);
  const result: IndicatorData[] = [];
  
  // Calculate price changes
  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  
  // Calculate initial average gains and losses
  let avgGain = 0;
  let avgLoss = 0;
  
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      avgGain += changes[i];
    } else {
      avgLoss += Math.abs(changes[i]);
    }
  }
  
  avgGain /= period;
  avgLoss /= period;
  
  // Calculate RSI for each point
  for (let i = period; i < changes.length; i++) {
    // Update average gain and loss using Wilder's smoothing method
    if (i > period) {
      avgGain = ((avgGain * (period - 1)) + (changes[i - 1] > 0 ? changes[i - 1] : 0)) / period;
      avgLoss = ((avgLoss * (period - 1)) + (changes[i - 1] < 0 ? Math.abs(changes[i - 1]) : 0)) / period;
    }
    
    // Calculate RS and RSI
    const rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss); // Avoid division by zero
    const rsi = 100 - (100 / (1 + rs));
    
    result.push({
      time: timestamps[i],
      value: parseFloat(rsi.toFixed(2))
    });
  }

  return result;
}

/**
 * Calculate Moving Average Convergence Divergence (MACD)
 * @param data - Array of OHLC data
 * @param fastPeriod - Fast EMA period (default: 12)
 * @param slowPeriod - Slow EMA period (default: 26)
 * @param signalPeriod - Signal EMA period (default: 9)
 * @param priceType - Price type to use (default: 'close')
 * @returns Object containing MACD line, signal line, and histogram values
 */
export function calculateMACD(
  data: OHLCData[], 
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9,
  priceType: 'open' | 'high' | 'low' | 'close' = 'close'
): {
  macdLine: IndicatorData[],
  signalLine: IndicatorData[],
  histogram: IndicatorData[]
} {
  if (data.length < Math.max(fastPeriod, slowPeriod, signalPeriod)) {
    return { macdLine: [], signalLine: [], histogram: [] };
  }

  const timestamps = getTimestamps(data);
  
  // Calculate fast and slow EMAs
  const fastEMA = calculateEMA(data, fastPeriod, priceType);
  const slowEMA = calculateEMA(data, slowPeriod, priceType);
  
  // Calculate MACD line (fast EMA - slow EMA)
  const macdLine: IndicatorData[] = [];
  
  // Start from the point where both EMAs are available
  const startIndex = Math.max(fastPeriod, slowPeriod) - 1;
  
  for (let i = 0; i < slowEMA.length; i++) {
    const slowIndex = timestamps.findIndex(t => t === slowEMA[i].time);
    const fastIndex = fastEMA.findIndex(item => item.time === slowEMA[i].time);
    
    if (fastIndex !== -1) {
      macdLine.push({
        time: slowEMA[i].time,
        value: parseFloat((fastEMA[fastIndex].value - slowEMA[i].value).toFixed(2))
      });
    }
  }
  
  // Calculate signal line (EMA of MACD line)
  const signalLine: IndicatorData[] = [];
  
  if (macdLine.length >= signalPeriod) {
    // Convert MACD line to OHLC format for EMA calculation
    const macdOHLC: OHLCData[] = macdLine.map(item => ({
      time: item.time,
      open: item.value,
      high: item.value,
      low: item.value,
      close: item.value
    }));
    
    const signalEMA = calculateEMA(macdOHLC, signalPeriod);
    signalLine.push(...signalEMA);
  }
  
  // Calculate histogram (MACD line - signal line)
  const histogram: IndicatorData[] = [];
  
  for (let i = 0; i < signalLine.length; i++) {
    const macdIndex = macdLine.findIndex(item => item.time === signalLine[i].time);
    
    if (macdIndex !== -1) {
      histogram.push({
        time: signalLine[i].time,
        value: parseFloat((macdLine[macdIndex].value - signalLine[i].value).toFixed(2))
      });
    }
  }
  
  return { macdLine, signalLine, histogram };
}

/**
 * Calculate Bollinger Bands
 * @param data - Array of OHLC data
 * @param period - Period for SMA calculation (default: 20)
 * @param stdDev - Number of standard deviations (default: 2)
 * @param priceType - Price type to use (default: 'close')
 * @returns Object containing middle, upper, and lower bands
 */
export function calculateBollingerBands(
  data: OHLCData[],
  period: number = 20,
  stdDev: number = 2,
  priceType: 'open' | 'high' | 'low' | 'close' = 'close'
): {
  middle: IndicatorData[],
  upper: IndicatorData[],
  lower: IndicatorData[]
} {
  if (data.length < period) {
    return { middle: [], upper: [], lower: [] };
  }

  const prices = data.map(item => item[priceType]);
  const timestamps = getTimestamps(data);
  
  const middle: IndicatorData[] = [];
  const upper: IndicatorData[] = [];
  const lower: IndicatorData[] = [];
  
  // Calculate for each point where we have enough data
  for (let i = period - 1; i < prices.length; i++) {
    // Calculate SMA
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += prices[i - j];
    }
    const sma = sum / period;
    
    // Calculate standard deviation
    let sumSquaredDiff = 0;
    for (let j = 0; j < period; j++) {
      sumSquaredDiff += Math.pow(prices[i - j] - sma, 2);
    }
    const standardDeviation = Math.sqrt(sumSquaredDiff / period);
    
    // Calculate bands
    const middleValue = parseFloat(sma.toFixed(2));
    const upperValue = parseFloat((sma + (standardDeviation * stdDev)).toFixed(2));
    const lowerValue = parseFloat((sma - (standardDeviation * stdDev)).toFixed(2));
    
    middle.push({ time: timestamps[i], value: middleValue });
    upper.push({ time: timestamps[i], value: upperValue });
    lower.push({ time: timestamps[i], value: lowerValue });
  }
  
  return { middle, upper, lower };
}
