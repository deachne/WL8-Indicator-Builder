"use client";

/**
 * Utility functions for generating realistic dummy stock data
 * for testing the TradingView Lightweight Charts implementation.
 */

// Define stock symbols and their base prices
const STOCK_SYMBOLS = {
  MSFT: { name: 'Microsoft', basePrice: 350 },
  AAPL: { name: 'Apple', basePrice: 180 },
  GOOGL: { name: 'Google', basePrice: 140 },
};

// Interface for OHLC data
export interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Generate a random price movement with a bias towards the trend
 * @param lastPrice - The previous price
 * @param trend - The trend direction (positive or negative)
 * @param volatility - The volatility factor
 * @returns The new price
 */
function generatePriceMovement(lastPrice: number, trend: number, volatility: number): number {
  // Random component with normal-like distribution
  const randomComponent = (Math.random() + Math.random() + Math.random() - 1.5) * volatility;
  
  // Trend component
  const trendComponent = trend * (Math.random() * 0.5);
  
  // Calculate new price with some mean reversion
  const change = randomComponent + trendComponent;
  const newPrice = lastPrice * (1 + change);
  
  // Ensure price doesn't go too low
  return Math.max(newPrice, lastPrice * 0.5);
}

/**
 * Generate a single day's OHLC data based on previous close
 * @param date - The date for the data point
 * @param prevClose - The previous day's closing price
 * @param trend - The trend direction
 * @param volatility - The volatility factor
 * @returns OHLC data for a single day
 */
function generateDailyOHLC(
  date: string, 
  prevClose: number, 
  trend: number, 
  volatility: number
): OHLCData {
  // Generate open price with a small gap from previous close
  const gapFactor = 1 + (Math.random() - 0.5) * 0.01;
  const open = prevClose * gapFactor;
  
  // Generate high, low, and close
  const rangePercent = Math.random() * volatility * 2;
  const highLowDiff = open * rangePercent;
  
  // Determine if it's an up or down day (biased by trend)
  const isUpDay = Math.random() < (0.5 + trend * 0.2);
  
  let high, low, close;
  
  if (isUpDay) {
    high = open * (1 + rangePercent);
    low = open * (1 - rangePercent * 0.5);
    close = open + (high - open) * (0.3 + Math.random() * 0.7);
  } else {
    high = open * (1 + rangePercent * 0.5);
    low = open * (1 - rangePercent);
    close = open - (open - low) * (0.3 + Math.random() * 0.7);
  }
  
  // Ensure high is always highest and low is always lowest
  high = Math.max(high, open, close);
  low = Math.min(low, open, close);
  
  return {
    time: date,
    open: parseFloat(open.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    close: parseFloat(close.toFixed(2)),
  };
}

/**
 * Generate a series of daily OHLC data for a given symbol
 * @param symbol - The stock symbol (MSFT, AAPL, GOOGL)
 * @param days - Number of days to generate data for
 * @param endDate - The end date for the data (defaults to current date)
 * @returns Array of OHLC data points
 */
export function generateDailyData(
  symbol: keyof typeof STOCK_SYMBOLS = 'MSFT',
  days: number = 180, // 6 months of daily data
  endDate: Date = new Date()
): OHLCData[] {
  const result: OHLCData[] = [];
  const basePrice = STOCK_SYMBOLS[symbol].basePrice;
  
  // Set initial price near the base price with some randomness
  let currentPrice = basePrice * (0.9 + Math.random() * 0.2);
  
  // Generate some market cycles (3-4 trend changes over the period)
  const trendCycles = Math.floor(days / 45) + 1;
  const trendPeriods: number[] = [];
  
  for (let i = 0; i < trendCycles; i++) {
    // Alternate between up and down trends
    const trendDirection = i % 2 === 0 ? 1 : -1;
    const trendLength = Math.floor(days / trendCycles) + Math.floor(Math.random() * 10) - 5;
    
    for (let j = 0; j < trendLength; j++) {
      trendPeriods.push(trendDirection);
    }
  }
  
  // Ensure we have enough trend periods
  while (trendPeriods.length < days) {
    trendPeriods.push(trendPeriods.length % 2 === 0 ? 1 : -1);
  }
  
  // Generate data for each day
  for (let i = days - 1; i >= 0; i--) {
    const currentDate = new Date(endDate);
    currentDate.setDate(currentDate.getDate() - i);
    
    // Skip weekends
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }
    
    // Format date as YYYY-MM-DD
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Get trend for this period
    const trend = trendPeriods[days - i - 1] || 0;
    
    // Volatility increases slightly during trend changes
    const trendChanging = i > 0 && trendPeriods[days - i - 1] !== trendPeriods[days - i];
    const volatility = 0.015 + (trendChanging ? 0.01 : 0);
    
    // Generate OHLC data
    const ohlc = generateDailyOHLC(dateStr, currentPrice, trend, volatility);
    result.push(ohlc);
    
    // Update current price for next iteration
    currentPrice = ohlc.close;
  }
  
  return result;
}

/**
 * Get dummy stock data for a specific symbol
 * @param symbol - The stock symbol (MSFT, AAPL, GOOGL)
 * @returns Array of OHLC data points
 */
export function getDummyStockData(symbol: keyof typeof STOCK_SYMBOLS = 'MSFT'): OHLCData[] {
  return generateDailyData(symbol);
}

/**
 * Get all available stock symbols
 * @returns Array of stock symbols
 */
export function getAvailableSymbols(): string[] {
  return Object.keys(STOCK_SYMBOLS);
}
