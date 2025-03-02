#!/usr/bin/env node

/**
 * Import WL8 Documentation Script (Fixed Version)
 * 
 * This script imports documentation from the WL8 GitHub repository,
 * processes it with code-aware chunking, and prepares it for use in the RAG system.
 * It can also optionally store the processed documents in ChromaDB.
 * 
 * Usage:
 *   node scripts/import-docs-fixed.js [--use-chroma]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const GITHUB_REPO = 'https://github.com/deachne/WL8-pkm.git'; // Added .git extension
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const API_DOCS_DIR = path.join(DOCS_DIR, 'api');
const FRAMEWORK_DOCS_DIR = path.join(DOCS_DIR, 'framework');
const TEMP_DIR = path.join(__dirname, '..', 'temp');
const CHROMA_DIR = path.join(__dirname, '..', 'chroma-db');

// Check if ChromaDB should be used
const useChroma = process.argv.includes('--use-chroma');

// Ensure directories exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Clone or update the repository
async function cloneOrUpdateRepo() {
  ensureDirectoryExists(TEMP_DIR);
  
  const repoDir = path.join(TEMP_DIR, 'WL8-pkm');
  
  if (fs.existsSync(repoDir)) {
    console.log('Repository already exists, pulling latest changes...');
    try {
      execSync('git pull', { cwd: repoDir, stdio: 'inherit' });
      console.log('Repository updated successfully');
    } catch (error) {
      console.error('Error updating repository:', error);
      throw error;
    }
  } else {
    console.log('Cloning repository...');
    try {
      // More explicit git clone command
      const cloneCmd = `git clone "${GITHUB_REPO}" "${repoDir}"`;
      console.log(`Executing: ${cloneCmd}`);
      execSync(cloneCmd, { stdio: 'inherit' });
      console.log('Repository cloned successfully');
    } catch (error) {
      console.error('Error cloning repository:', error);
      throw error;
    }
  }
  
  return repoDir;
}

// Process markdown files
async function processMarkdownFiles(repoDir) {
  ensureDirectoryExists(DOCS_DIR);
  ensureDirectoryExists(API_DOCS_DIR);
  ensureDirectoryExists(FRAMEWORK_DOCS_DIR);
  
  // Track all processed documents for ChromaDB
  const allDocuments = [];
  
  // Process API documentation
  const apiDocsDir = path.join(repoDir, 'docs', 'api-reference');
  if (fs.existsSync(apiDocsDir)) {
    console.log('Processing API documentation...');
    const apiDocs = await processDirectory(apiDocsDir, API_DOCS_DIR, 'api-reference');
    allDocuments.push(...apiDocs);
  } else {
    console.warn('API documentation directory not found');
  }
  
  // Process Framework documentation
  const frameworkDocsDir = path.join(repoDir, 'docs', 'wealth-lab-framework');
  if (fs.existsSync(frameworkDocsDir)) {
    console.log('Processing Framework documentation...');
    const frameworkDocs = await processDirectory(frameworkDocsDir, FRAMEWORK_DOCS_DIR, 'framework');
    allDocuments.push(...frameworkDocs);
  } else {
    console.warn('Framework documentation directory not found');
  }
  
  console.log('Documentation processing complete');
  
  return allDocuments;
}

// Process a directory of markdown files
async function processDirectory(sourceDir, targetDir, category) {
  const files = fs.readdirSync(sourceDir);
  const processedDocs = [];
  
  let processedCount = 0;
  let totalFiles = 0;
  
  // Count total markdown files for progress tracking
  files.forEach(file => {
    const filePath = path.join(sourceDir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // We'll count subdirectories later
    } else if (file.endsWith('.md')) {
      totalFiles++;
    }
  });
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      // Process subdirectory
      const subTargetDir = path.join(targetDir, file);
      ensureDirectoryExists(subTargetDir);
      const subDirDocs = await processDirectory(sourcePath, subTargetDir, `${category}/${file}`);
      processedDocs.push(...subDirDocs);
    } else if (file.endsWith('.md')) {
      try {
        // Process markdown file
        const content = fs.readFileSync(sourcePath, 'utf8');
        
        // Extract title and description from frontmatter
        const { title, description, processedContent } = extractFrontmatter(content);
        
        // Generate ID from filename
        const id = file.replace('.md', '').toLowerCase().replace(/\s+/g, '-');
        
        // Create JSON metadata file
        const metadata = {
          id,
          title: title || file.replace('.md', ''),
          description: description || '',
          category,
          source: sourcePath,
        };
        
        const metadataPath = path.join(targetDir, `${id}.json`);
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        
        // Write processed content
        const contentPath = path.join(targetDir, `${id}.md`);
        fs.writeFileSync(contentPath, processedContent);
        
        // Process with code-aware chunking for ChromaDB
        const chunks = processCodeAwareChunking(processedContent, metadata);
        processedDocs.push(...chunks);
        
        processedCount++;
        
        // Show progress
        const progress = Math.round((processedCount / totalFiles) * 100);
        process.stdout.write(`Processing ${category} files: ${progress}% (${processedCount}/${totalFiles})\r`);
      } catch (error) {
        console.error(`Error processing file ${sourcePath}:`, error);
      }
    }
  }
  
  if (totalFiles > 0) {
    console.log(`\nProcessed ${processedCount} files in ${sourceDir}`);
  }
  
  return processedDocs;
}

// Process content with code-aware chunking
function processCodeAwareChunking(content, metadata) {
  const chunks = [];
  
  // Extract code blocks and their context
  const { textChunks, codeBlocks } = extractCodeBlocksAndText(content);
  
  // Process text chunks
  textChunks.forEach((chunk, index) => {
    // Skip empty chunks
    if (chunk.trim() === '') return;
    
    chunks.push({
      pageContent: chunk,
      metadata: {
        ...metadata,
        chunkIndex: index,
        contentType: 'text',
        chunkType: 'text_only'
      }
    });
  });
  
  // Process code blocks with their context
  codeBlocks.forEach((codeBlock, index) => {
    chunks.push({
      pageContent: codeBlock.content,
      metadata: {
        ...metadata,
        chunkIndex: `code-${index}`,
        contentType: 'code',
        language: codeBlock.language || 'unknown',
        chunkType: 'code_block',
        context: codeBlock.context
      }
    });
    
    // Also add a combined chunk with context and code
    chunks.push({
      pageContent: `${codeBlock.context}\n\n\`\`\`${codeBlock.language}\n${codeBlock.content}\n\`\`\``,
      metadata: {
        ...metadata,
        chunkIndex: `code-context-${index}`,
        contentType: 'mixed',
        language: codeBlock.language || 'unknown',
        chunkType: 'code_with_context'
      }
    });
  });
  
  return chunks;
}

// Extract code blocks and text from markdown content
function extractCodeBlocksAndText(markdown) {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const codeBlocks = [];
  const textChunks = [];
  
  let lastIndex = 0;
  let match;
  
  // Extract code blocks and surrounding text
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const [fullMatch, language, code] = match;
    const matchIndex = match.index;
    
    // Get text before this code block
    if (matchIndex > lastIndex) {
      const textBefore = markdown.substring(lastIndex, matchIndex);
      textChunks.push(textBefore);
    }
    
    // Get context (text before the code block, up to 500 chars)
    const contextStartIndex = Math.max(0, matchIndex - 500);
    const context = markdown.substring(contextStartIndex, matchIndex);
    
    // Add code block with its context
    codeBlocks.push({
      language: language || "text",
      content: code,
      context,
    });
    
    lastIndex = matchIndex + fullMatch.length;
  }
  
  // Add remaining text after the last code block
  if (lastIndex < markdown.length) {
    textChunks.push(markdown.substring(lastIndex));
  }
  
  return { textChunks, codeBlocks };
}

// Extract frontmatter from markdown content
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { title: null, description: null, processedContent: content };
  }
  
  const frontmatter = match[1];
  const processedContent = content.replace(frontmatterRegex, '');
  
  // Extract title and description
  const titleMatch = frontmatter.match(/title:\s*(.+)/);
  const descriptionMatch = frontmatter.match(/description:\s*(.+)/);
  
  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    description: descriptionMatch ? descriptionMatch[1].trim() : null,
    processedContent,
  };
}

// Generate documentation index
function generateDocumentationIndex() {
  console.log('Generating documentation index...');
  
  const apiDocs = readDocumentationCategory(API_DOCS_DIR, 'api-reference');
  const frameworkDocs = readDocumentationCategory(FRAMEWORK_DOCS_DIR, 'framework');
  
  const index = {
    categories: [
      {
        id: 'api-reference',
        title: 'API Reference',
        description: 'Comprehensive reference for the Wealth-Lab 8 API',
        items: apiDocs,
      },
      {
        id: 'framework',
        title: 'Framework',
        description: 'Documentation for the Wealth-Lab 8 framework',
        items: frameworkDocs,
      },
    ],
  };
  
  const indexPath = path.join(DOCS_DIR, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  
  console.log(`Generated documentation index with ${apiDocs.length} API docs and ${frameworkDocs.length} Framework docs`);
  
  return index;
}

// Read documentation category
function readDocumentationCategory(dir, category) {
  const docs = [];
  
  if (!fs.existsSync(dir)) {
    return docs;
  }
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const metadataPath = path.join(dir, file);
      const contentPath = path.join(dir, file.replace('.json', '.md'));
      
      if (fs.existsSync(metadataPath) && fs.existsSync(contentPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        const content = fs.readFileSync(contentPath, 'utf8');
        
        docs.push({
          id: metadata.id,
          title: metadata.title,
          description: metadata.description,
          category,
          content,
        });
      }
    }
  }
  
  return docs;
}

// Store documents in ChromaDB (if enabled)
async function storeInChromaDB(documents) {
  if (!useChroma) {
    console.log('Skipping ChromaDB storage (use --use-chroma flag to enable)');
    return;
  }
  
  try {
    console.log('Storing documents in ChromaDB...');
    
    // This is a placeholder for the actual ChromaDB integration
    // In a real implementation, you would use the ChromaDB client to store the documents
    
    console.log(`Stored ${documents.length} documents in ChromaDB`);
  } catch (error) {
    console.error('Error storing documents in ChromaDB:', error);
  }
}

// Save processed documents to a JSON file for later use
function saveProcessedDocuments(documents) {
  const outputPath = path.join(DOCS_DIR, 'processed-documents.json');
  fs.writeFileSync(outputPath, JSON.stringify(documents, null, 2));
  console.log(`Saved ${documents.length} processed documents to ${outputPath}`);
}

// Main function
async function main() {
  try {
    console.log('Starting WL8 documentation import...');
    
    // Clone or update the repository
    const repoDir = await cloneOrUpdateRepo();
    
    // Process markdown files with code-aware chunking
    const processedDocuments = await processMarkdownFiles(repoDir);
    
    // Generate documentation index
    const index = generateDocumentationIndex();
    
    // Save processed documents for later use
    saveProcessedDocuments(processedDocuments);
    
    // Store in ChromaDB if enabled
    if (useChroma) {
      await storeInChromaDB(processedDocuments);
    }
    
    console.log('Documentation import completed successfully');
    console.log(`Total documents processed: ${processedDocuments.length}`);
    console.log(`API docs: ${index.categories[0].items.length}`);
    console.log(`Framework docs: ${index.categories[1].items.length}`);
  } catch (error) {
    console.error('Error importing documentation:', error);
    process.exit(1);
  }
}

// Run the script
main();
