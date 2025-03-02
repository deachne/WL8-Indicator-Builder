/**
 * Re-ranking module for improving retrieval quality
 * 
 * This module implements a hybrid re-ranking approach that combines
 * vector similarity with keyword matching to improve retrieval quality.
 */

interface Document {
  pageContent: string;
  metadata: any;
  score?: number;
}

interface RerankerOptions {
  keywordWeight?: number;
  vectorWeight?: number;
  titleBoost?: number;
  codeBoost?: number;
}

/**
 * Re-rank documents based on a hybrid scoring approach
 */
export function rerank(
  query: string,
  documents: Document[],
  options: RerankerOptions = {}
): Document[] {
  // Set default options
  const keywordWeight = options.keywordWeight ?? 0.3;
  const vectorWeight = options.vectorWeight ?? 0.7;
  const titleBoost = options.titleBoost ?? 1.5;
  const codeBoost = options.codeBoost ?? 1.2;
  
  // Normalize query for keyword matching
  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 2);
  
  // Re-rank documents
  const scoredDocuments = documents.map((doc, index) => {
    // Start with the vector similarity score (inverse of position)
    // This assumes documents are already sorted by vector similarity
    const vectorScore = 1 - (index / documents.length);
    
    // Calculate keyword match score
    const keywordScore = calculateKeywordScore(doc, queryTerms);
    
    // Apply boosts based on document type
    let boost = 1.0;
    
    // Boost code examples for code-related queries
    if (
      doc.metadata.type === 'code' || 
      doc.metadata.contentType === 'code' ||
      doc.metadata.language
    ) {
      if (isCodeRelatedQuery(normalizedQuery)) {
        boost *= codeBoost;
      }
    }
    
    // Boost documents whose titles match the query
    if (doc.metadata.title && doc.metadata.title.toLowerCase().includes(normalizedQuery)) {
      boost *= titleBoost;
    }
    
    // Calculate final score
    const finalScore = (
      (vectorScore * vectorWeight) + 
      (keywordScore * keywordWeight)
    ) * boost;
    
    // Return document with score
    return {
      ...doc,
      score: finalScore
    };
  });
  
  // Sort by score (descending)
  return scoredDocuments.sort((a, b) => (b.score || 0) - (a.score || 0));
}

/**
 * Calculate keyword match score based on term frequency
 */
function calculateKeywordScore(doc: Document, queryTerms: string[]): number {
  if (!doc.pageContent || queryTerms.length === 0) {
    return 0;
  }
  
  const content = doc.pageContent.toLowerCase();
  
  // Count term matches
  let matchCount = 0;
  for (const term of queryTerms) {
    // Use a regex to find all occurrences
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      matchCount += matches.length;
    }
  }
  
  // Normalize by content length
  const contentLength = content.length;
  const normalizedScore = matchCount / (contentLength / 100);
  
  // Cap at 1.0
  return Math.min(normalizedScore, 1.0);
}

/**
 * Determine if a query is code-related
 */
function isCodeRelatedQuery(query: string): boolean {
  const codeKeywords = [
    'code', 'example', 'function', 'method', 'class', 'implement',
    'syntax', 'parameter', 'return', 'value', 'object', 'array',
    'variable', 'const', 'let', 'var', 'interface', 'type',
    'import', 'export', 'async', 'await', 'promise', 'callback',
    'loop', 'for', 'while', 'if', 'else', 'switch', 'case',
    'try', 'catch', 'throw', 'error', 'exception', 'debug',
    'compile', 'build', 'run', 'execute', 'performance', 'optimize',
    'algorithm', 'data structure', 'pattern', 'design', 'architecture',
    'framework', 'library', 'package', 'module', 'component',
    'api', 'rest', 'http', 'request', 'response', 'server', 'client',
    'database', 'query', 'sql', 'nosql', 'schema', 'model',
    'authentication', 'authorization', 'security', 'encryption',
    'testing', 'unit test', 'integration test', 'mock', 'stub', 'spy',
    'logging', 'debugging', 'profiling', 'tracing', 'monitoring',
    'deployment', 'ci/cd', 'pipeline', 'container', 'docker', 'kubernetes',
    'git', 'version control', 'branch', 'merge', 'pull request', 'commit',
    'indicator', 'strategy', 'backtest', 'trading', 'market', 'stock',
    'chart', 'candle', 'bar', 'price', 'volume', 'technical', 'analysis',
    'moving average', 'sma', 'ema', 'rsi', 'macd', 'bollinger', 'bands',
    'stochastic', 'oscillator', 'momentum', 'trend', 'signal', 'alert',
    'buy', 'sell', 'entry', 'exit', 'position', 'order', 'fill', 'execution',
    'portfolio', 'risk', 'management', 'optimization', 'parameter', 'sweep',
    'monte carlo', 'simulation', 'backtest', 'forward test', 'live trading',
    'paper trading', 'demo', 'account', 'broker', 'api', 'connection',
    'data feed', 'historical', 'real-time', 'tick', 'bar', 'candle', 'ohlc',
    'open', 'high', 'low', 'close', 'volume', 'time', 'date', 'timestamp',
    'timeframe', 'period', 'interval', 'daily', 'weekly', 'monthly', 'intraday',
    'minute', 'hour', 'day', 'week', 'month', 'year'
  ];
  
  // Check if query contains any code-related keywords
  return codeKeywords.some(keyword => query.includes(keyword));
}

/**
 * Integrate re-ranking with ChromaDB results
 */
export function rerankChromaResults(
  query: string,
  results: any[],
  options: RerankerOptions = {}
): any[] {
  // Format ChromaDB results to match Document interface
  const documents = results.map(result => ({
    pageContent: result.pageContent,
    metadata: result.metadata,
  }));
  
  // Apply re-ranking
  return rerank(query, documents, options);
}
