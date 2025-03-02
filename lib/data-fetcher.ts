"use client";

import { OHLCData } from './stock-data';

/**
 * Data fetching utilities for the WL8 Indicator Builder
 * These functions allow fetching real market data from external APIs
 */

// Cache for storing fetched data to minimize API calls
interface CacheEntry {
  data: OHLCData[];
  timestamp: number;
  expiresIn: number; // Expiration time in milliseconds
}

const dataCache: Record<string, CacheEntry> = {};

// Cache expiration time (default: 1 hour)
const DEFAULT_CACHE_EXPIRATION = 60 * 60 * 1000;

/**
 * Check if cached data is still valid
 * @param cacheKey - The cache key
 * @returns Boolean indicating if cache is valid
 */
function isCacheValid(cacheKey: string): boolean {
  if (!dataCache[cacheKey]) return false;
  
  const now = Date.now();
  const { timestamp, expiresIn } = dataCache[cacheKey];
  
  return now - timestamp < expiresIn;
}

/**
 * Get data from cache
 * @param cacheKey - The cache key
 * @returns Cached data or null if not found/expired
 */
function getFromCache(cacheKey: string): OHLCData[] | null {
  if (!isCacheValid(cacheKey)) return null;
  return dataCache[cacheKey].data;
}

/**
 * Store data in cache
 * @param cacheKey - The cache key
 * @param data - The data to cache
 * @param expiresIn - Cache expiration time in milliseconds
 */
function storeInCache(cacheKey: string, data: OHLCData[], expiresIn: number = DEFAULT_CACHE_EXPIRATION): void {
  dataCache[cacheKey] = {
    data,
    timestamp: Date.now(),
    expiresIn
  };
}

/**
 * Clear specific cache entry
 * @param cacheKey - The cache key to clear
 */
export function clearCache(cacheKey: string): void {
  if (dataCache[cacheKey]) {
    delete dataCache[cacheKey];
  }
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
  Object.keys(dataCache).forEach(key => {
    delete dataCache[key];
  });
}

/**
 * Fetch historical stock data from Alpha Vantage API
 * @param symbol - The stock symbol
 * @param apiKey - Alpha Vantage API key
 * @param outputSize - 'compact' (100 data points) or 'full' (20+ years of data)
 * @param interval - Time interval between data points
 * @returns Promise resolving to array of OHLC data
 */
export async function fetchAlphaVantageData(
  symbol: string,
  apiKey: string,
  outputSize: 'compact' | 'full' = 'compact',
  interval: 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<OHLCData[]> {
  // Create cache key
  const cacheKey = `alphavantage_${symbol}_${interval}_${outputSize}`;
  
  // Check cache first
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;
  
  // Determine the API function based on interval
  const timeSeries = 
    interval === 'daily' ? 'TIME_SERIES_DAILY' :
    interval === 'weekly' ? 'TIME_SERIES_WEEKLY' : 'TIME_SERIES_MONTHLY';
  
  // Build API URL
  const url = `https://www.alphavantage.co/query?function=${timeSeries}&symbol=${symbol}&outputsize=${outputSize}&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle API errors
    if (data['Error Message']) {
      throw new Error(`Alpha Vantage API error: ${data['Error Message']}`);
    }
    
    if (data['Note']) {
      console.warn(`Alpha Vantage API note: ${data['Note']}`);
      // If we hit rate limits, still return cached data if available
      if (cachedData) return cachedData;
    }
    
    // Extract time series data
    const timeSeriesKey = 
      interval === 'daily' ? 'Time Series (Daily)' :
      interval === 'weekly' ? 'Weekly Time Series' : 'Monthly Time Series';
    
    const timeSeries = data[timeSeriesKey];
    
    if (!timeSeries) {
      throw new Error('No time series data found in API response');
    }
    
    // Convert to our OHLC format
    const ohlcData: OHLCData[] = Object.entries(timeSeries)
      .map(([date, values]: [string, any]) => ({
        time: date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close'])
      }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()); // Sort by date ascending
    
    // Cache the result
    storeInCache(cacheKey, ohlcData);
    
    return ohlcData;
  } catch (error) {
    console.error('Error fetching data from Alpha Vantage:', error);
    throw error;
  }
}

/**
 * Fetch historical stock data from Yahoo Finance API
 * @param symbol - The stock symbol
 * @param period1 - Start timestamp (Unix timestamp in seconds)
 * @param period2 - End timestamp (Unix timestamp in seconds)
 * @param interval - Time interval between data points
 * @returns Promise resolving to array of OHLC data
 */
export async function fetchYahooFinanceData(
  symbol: string,
  period1: number = Math.floor((Date.now() - 180 * 24 * 60 * 60 * 1000) / 1000), // 180 days ago
  period2: number = Math.floor(Date.now() / 1000), // Now
  interval: '1d' | '1wk' | '1mo' = '1d'
): Promise<OHLCData[]> {
  // Create cache key
  const cacheKey = `yahoo_${symbol}_${period1}_${period2}_${interval}`;
  
  // Check cache first
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;
  
  // Build API URL
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${interval}&includePrePost=false`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle API errors
    if (data.chart.error) {
      throw new Error(`Yahoo Finance API error: ${data.chart.error.description}`);
    }
    
    const result = data.chart.result[0];
    
    if (!result || !result.timestamp || !result.indicators.quote[0]) {
      throw new Error('Invalid data format in Yahoo Finance API response');
    }
    
    const { timestamp, indicators } = result;
    const quote = indicators.quote[0];
    
    // Convert to our OHLC format
    const ohlcData: OHLCData[] = timestamp.map((time: number, i: number) => {
      const date = new Date(time * 1000);
      return {
        time: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        open: quote.open[i] || 0,
        high: quote.high[i] || 0,
        low: quote.low[i] || 0,
        close: quote.close[i] || 0
      };
    }).filter((item: OHLCData) => 
      // Filter out entries with missing data
      item.open !== 0 && item.high !== 0 && item.low !== 0 && item.close !== 0
    );
    
    // Cache the result
    storeInCache(cacheKey, ohlcData);
    
    return ohlcData;
  } catch (error) {
    console.error('Error fetching data from Yahoo Finance:', error);
    throw error;
  }
}

/**
 * Fetch stock data with automatic fallback between providers
 * @param symbol - The stock symbol
 * @param apiKey - Alpha Vantage API key (optional)
 * @param interval - Time interval between data points
 * @returns Promise resolving to array of OHLC data
 */
export async function fetchStockData(
  symbol: string,
  apiKey?: string,
  interval: 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<OHLCData[]> {
  try {
    // Try Alpha Vantage first if API key is provided
    if (apiKey) {
      try {
        return await fetchAlphaVantageData(symbol, apiKey, 'compact', interval);
      } catch (error) {
        console.warn('Alpha Vantage fetch failed, falling back to Yahoo Finance:', error);
      }
    }
    
    // Fall back to Yahoo Finance
    const yahooInterval = interval === 'daily' ? '1d' : interval === 'weekly' ? '1wk' : '1mo';
    return await fetchYahooFinanceData(symbol, undefined, undefined, yahooInterval);
  } catch (error) {
    console.error('All data fetching methods failed:', error);
    throw new Error(`Failed to fetch data for ${symbol}: ${error}`);
  }
}
