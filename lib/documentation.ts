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

// Mock data for initial development or fallback
const mockDocCategories: DocCategory[] = [
  {
    id: 'api-reference',
    title: 'API Reference',
    description: 'Comprehensive reference for the Wealth-Lab 8 API',
    items: [
      {
        id: 'api-overview',
        title: 'API Overview',
        category: 'api-reference',
        content: '# Wealth-Lab 8 API Overview\n\nMock content for API overview.',
      },
      {
        id: 'dataseries',
        title: 'DataSeries',
        category: 'api-reference',
        content: '# DataSeries\n\nMock content for DataSeries.',
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
        content: '# Wealth-Lab 8 Framework Overview\n\nMock content for framework overview.',
      },
      {
        id: 'creating-indicators',
        title: 'Creating Indicators',
        category: 'framework',
        content: '# Creating Custom Indicators\n\nMock content for creating indicators.',
      },
    ],
  },
];

// Helper function to get the base URL
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return '';
  }
  // SSR should use the full URL
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`;
}

// Function to fetch documentation categories from the API
export async function fetchDocCategories(): Promise<DocCategory[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/documentation`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      console.error('Error fetching documentation categories:', response.statusText);
      return mockDocCategories;
    }
    
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error fetching documentation categories:', error);
    return mockDocCategories;
  }
}

// Function to fetch a specific category from the API
export async function fetchDocCategory(categoryId: string): Promise<DocCategory | undefined> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/documentation/${categoryId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      console.error('Error fetching documentation category:', response.statusText);
      return mockDocCategories.find(cat => cat.id === categoryId);
    }
    
    const data = await response.json();
    return data.category;
  } catch (error) {
    console.error('Error fetching documentation category:', error);
    return mockDocCategories.find(cat => cat.id === categoryId);
  }
}

// Function to fetch a specific documentation item from the API
export async function fetchDocItem(itemId: string): Promise<DocItem | undefined> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/documentation/item/${itemId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      console.error('Error fetching documentation item:', response.statusText);
      
      // Fall back to mock data
      for (const category of mockDocCategories) {
        const item = category.items.find(item => item.id === itemId);
        if (item) {
          return item;
        }
      }
      return undefined;
    }
    
    const data = await response.json();
    return data.item;
  } catch (error) {
    console.error('Error fetching documentation item:', error);
    
    // Fall back to mock data
    for (const category of mockDocCategories) {
      const item = category.items.find(item => item.id === itemId);
      if (item) {
        return item;
      }
    }
    return undefined;
  }
}

// Function to search documentation via the API
export async function searchDocs(query: string): Promise<DocItem[]> {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/documentation/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      console.error('Error searching documentation:', response.statusText);
      return [];
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching documentation:', error);
    return [];
  }
}

// Function to get navigation items for the sidebar
export async function fetchDocNavItems(): Promise<{ title: string; href: string; items?: { title: string; href: string }[] }[]> {
  try {
    const categories = await fetchDocCategories();
    
    return categories.map(category => ({
      title: category.title,
      href: `/documentation/${category.id}`,
      items: category.items.map(item => ({
        title: item.title,
        href: `/documentation/${category.id}/${item.id}`,
      })),
    }));
  } catch (error) {
    console.error('Error fetching documentation navigation items:', error);
    
    // Fall back to mock data
    return mockDocCategories.map(category => ({
      title: category.title,
      href: `/documentation/${category.id}`,
      items: category.items.map(item => ({
        title: item.title,
        href: `/documentation/${category.id}/${item.id}`,
      })),
    }));
  }
}

// For backward compatibility with existing code
// These functions will be deprecated in favor of the async versions
export function getDocCategories(): DocCategory[] {
  console.warn('getDocCategories is deprecated. Use fetchDocCategories instead.');
  return mockDocCategories;
}

export function getDocItem(id: string): DocItem | undefined {
  console.warn('getDocItem is deprecated. Use fetchDocItem instead.');
  for (const category of mockDocCategories) {
    const item = category.items.find(item => item.id === id);
    if (item) {
      return item;
    }
  }
  return undefined;
}

export function getDocNavItems(): { title: string; href: string; items?: { title: string; href: string }[] }[] {
  console.warn('getDocNavItems is deprecated. Use fetchDocNavItems instead.');
  return mockDocCategories.map(category => ({
    title: category.title,
    href: `/documentation/${category.id}`,
    items: category.items.map(item => ({
      title: item.title,
      href: `/documentation/${category.id}/${item.id}`,
    })),
  }));
}
