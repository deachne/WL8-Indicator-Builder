import fs from 'fs';
import path from 'path';

// Types for documentation data
export interface DocCategory {
  id: string;
  title: string;
  description?: string;
  items: DocItem[];
}

export interface DocItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  content: string;
  tags?: string[];
}

// Path to the documentation index
const DOCS_INDEX_PATH = path.join(process.cwd(), 'docs', 'index.json');

// Check if imported documentation exists
export function hasImportedDocs(): boolean {
  try {
    return fs.existsSync(DOCS_INDEX_PATH);
  } catch (error) {
    console.error('Error checking for imported docs:', error);
    return false;
  }
}

// Load documentation from imported files
export function loadImportedDocs(): DocCategory[] {
  try {
    const indexContent = fs.readFileSync(DOCS_INDEX_PATH, 'utf8');
    const index = JSON.parse(indexContent);
    return index.categories;
  } catch (error) {
    console.error('Error loading imported docs:', error);
    return [];
  }
}

// Mock data for initial development or fallback
export const mockDocCategories: DocCategory[] = [
  {
    id: 'api-reference',
    title: 'API Reference',
    description: 'Comprehensive reference for the Wealth-Lab 8 API',
    items: [
      {
        id: 'api-overview',
        title: 'API Overview',
        category: 'api-reference',
        content: `
# Wealth-Lab 8 API Overview

Wealth-Lab 8 provides a comprehensive API for developing trading indicators, strategies, and more.

## Key Components

- **DataSeries** - Time series data for prices, indicators, etc.
- **Bars** - OHLCV price data
- **Indicator** - Base class for technical indicators
- **Strategy** - Base class for trading strategies

## Getting Started

To create a custom indicator, you'll typically:

1. Create a class that inherits from \`Indicator\`
2. Implement the required methods
3. Register your indicator with the system

\`\`\`csharp
public class MyIndicator : Indicator
{
    public MyIndicator()
    {
        // Initialize your indicator
    }
    
    protected override void Calculate(int index)
    {
        // Calculation logic here
    }
}
\`\`\`
`,
      },
      {
        id: 'dataseries',
        title: 'DataSeries',
        category: 'api-reference',
        content: `
# DataSeries

The \`DataSeries\` class is a fundamental component in Wealth-Lab 8, representing time series data.

## Properties

- **Count**: Gets the number of elements in the DataSeries
- **Description**: Gets or sets the description of the DataSeries
- **Name**: Gets or sets the name of the DataSeries

## Methods

- **Add(double value)**: Adds a value to the end of the DataSeries
- **Clear()**: Removes all values from the DataSeries
- **GetValue(int index)**: Gets the value at the specified index
- **SetValue(int index, double value)**: Sets the value at the specified index

## Example

\`\`\`csharp
// Create a new DataSeries
DataSeries mySeries = new DataSeries("My Series");

// Add values
mySeries.Add(100.5);
mySeries.Add(101.2);
mySeries.Add(99.8);

// Access values
double value = mySeries.GetValue(1); // Gets 101.2
\`\`\`
`,
      },
    ],
  },
  {
    id: 'framework',
    title: 'Framework',
    description: 'Documentation for the Wealth-Lab 8 framework',
    items: [
      {
        id: 'framework-overview',
        title: 'Framework Overview',
        category: 'framework',
        content: `
# Wealth-Lab 8 Framework Overview

The Wealth-Lab 8 framework provides a comprehensive set of tools and components for developing trading systems.

## Key Components

- **Indicators** - Technical analysis indicators
- **Strategies** - Trading strategy implementation
- **Position Sizing** - Methods for determining position size
- **Risk Management** - Tools for managing trading risk

## Architecture

The framework follows a modular architecture that allows for easy extension and customization.

\`\`\`
┌─────────────────┐
│  Wealth-Lab     │
│  Core           │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Extensions     │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  User Indicators│
│  & Strategies   │
└─────────────────┘
\`\`\`
`,
      },
      {
        id: 'creating-indicators',
        title: 'Creating Indicators',
        category: 'framework',
        content: `
# Creating Custom Indicators

This guide explains how to create custom indicators in Wealth-Lab 8.

## Basic Structure

A custom indicator in Wealth-Lab 8 is a class that inherits from the \`Indicator\` base class.

\`\`\`csharp
using WealthLab;

public class MyCustomIndicator : Indicator
{
    // Parameters
    [Parameter]
    public int Period { get; set; }
    
    // Constructor
    public MyCustomIndicator() : base()
    {
        // Default parameter values
        Period = 14;
    }
    
    // Calculation method
    protected override void Calculate(int index)
    {
        // Your calculation logic here
    }
}
\`\`\`

## Parameters

Parameters allow users to customize the behavior of your indicator. Use the \`[Parameter]\` attribute to expose properties as parameters.

## Calculation

The \`Calculate\` method is called for each bar in the data series. Use this method to implement your indicator's calculation logic.

## Example: Simple Moving Average

\`\`\`csharp
public class MySMA : Indicator
{
    [Parameter]
    public int Period { get; set; }
    
    public MySMA() : base()
    {
        Period = 14;
    }
    
    protected override void Calculate(int index)
    {
        if (index < Period - 1)
            return;
            
        double sum = 0;
        for (int i = 0; i < Period; i++)
        {
            sum += Price.GetValue(index - i);
        }
        
        Values[index] = sum / Period;
    }
}
\`\`\`
`,
      },
    ],
  },
];

// Get the documentation categories (imported or mock)
export function getDocCategories(): DocCategory[] {
  // Check if imported documentation exists
  if (hasImportedDocs()) {
    const importedDocs = loadImportedDocs();
    if (importedDocs.length > 0) {
      console.log(`Using ${importedDocs.length} imported documentation categories`);
      return importedDocs;
    }
  }
  
  // Fall back to mock data
  console.log('Using mock documentation data');
  return mockDocCategories;
}

// Function to get a specific documentation item by ID
export function getDocItem(id: string): DocItem | undefined {
  const categories = getDocCategories();
  
  for (const category of categories) {
    const item = category.items.find(item => item.id === id);
    if (item) {
      return item;
    }
  }
  
  return undefined;
}

// Function to search documentation
export function searchDocs(query: string): DocItem[] {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const lowerQuery = query.toLowerCase();
  const results: DocItem[] = [];
  const categories = getDocCategories();
  
  for (const category of categories) {
    for (const item of category.items) {
      if (
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
        item.content.toLowerCase().includes(lowerQuery) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      ) {
        results.push(item);
      }
    }
  }
  
  return results;
}

// Function to get navigation items for the sidebar
export function getDocNavItems(): { title: string; href: string; items?: { title: string; href: string }[] }[] {
  const categories = getDocCategories();
  
  return categories.map(category => ({
    title: category.title,
    href: `/documentation/${category.id}`,
    items: category.items.map(item => ({
      title: item.title,
      href: `/documentation/${category.id}/${item.id}`,
    })),
  }));
}
