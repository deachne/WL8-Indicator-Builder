# WL8 Indicator Builder

A platform for creating, testing, and sharing indicators for Wealth-Lab 8. It combines documentation browsing, AI-assisted indicator development, and a Q&A platform to provide a comprehensive tool for WL8 developers.

## Features

- **Documentation Browser**: Browse and search WL8 API and framework documentation
- **Indicator Builder**: Create and test indicators with a Monaco code editor and TradingView charts
- **AI Assistant**: Get help with indicator development using the AI assistant
- **Q&A Platform**: Ask questions and get answers about WL8 development

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **RAG System**: ChromaDB for vector storage and retrieval
- **Code Editor**: Monaco Editor
- **Chart Visualization**: TradingView Lightweight Charts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/deachne/WL8-Indicator-Builder.git
   cd WL8-Indicator-Builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

4. Import WL8 documentation:
   ```bash
   npm run import-docs
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Enhanced RAG System

The project includes an enhanced RAG (Retrieval-Augmented Generation) system that uses ChromaDB for vector storage and retrieval. This system provides better search results and more relevant responses from the AI assistant.

### Using ChromaDB

To use ChromaDB for the RAG system, follow these steps:

1. Start the ChromaDB server:
   ```bash
   npm run chroma
   ```

2. Import the documentation into ChromaDB:
   ```bash
   npm run import-chroma
   ```

   Alternatively, you can start the ChromaDB server and import the documentation in one command:
   ```bash
   npm run chroma:import
   ```

3. The system will automatically use ChromaDB if it's available, otherwise it will fall back to the enhanced in-memory RAG system.

### Code-Aware Document Processing

The RAG system uses code-aware document processing to ensure that code examples are preserved and associated with their explanatory text. This allows the AI assistant to provide more accurate and helpful responses when asked about code examples.

Key features of the code-aware processing:

- Code blocks are extracted and stored separately with their context
- Each code block is tagged with metadata about its language and purpose
- The system can retrieve code examples based on their relevance to the query
- Code examples are presented with their explanatory text for better understanding

## AI Task Routing

The project now includes an intelligent AI task routing system that selects the most appropriate AI model based on the type of query:

- **Code Generation Tasks**: Uses Anthropic's Claude 3.5 Sonnet, which excels at writing and modifying code
- **Conceptual Questions**: Uses Anthropic's Claude 3 Sonnet/Opus, which provides better explanations and reasoning

This ensures that users get the best possible responses for their specific needs. The system automatically detects the intent of the query and routes it to the appropriate model.

### Setting Up API Keys

The project requires API keys for both OpenAI and Anthropic:

1. **OpenAI API Key**: Get one from [OpenAI's platform](https://platform.openai.com/api-keys)
2. **Anthropic API Key**: Get one from [Anthropic's console](https://console.anthropic.com/)

Add both keys to your `.env` file:
```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

For detailed instructions on setting up the Anthropic API key, see the [ANTHROPIC_SETUP.md](./ANTHROPIC_SETUP.md) file.

### Testing API Connections

To verify that your API keys are working correctly, run:
```bash
npm run test-api-keys
```

This will test the connections to both OpenAI and Anthropic APIs and provide feedback on any issues.

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the project for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run import-docs`: Import WL8 documentation from GitHub
- `npm run chroma`: Start the ChromaDB server
- `npm run chroma:import`: Start the ChromaDB server and import documentation
- `npm run import-chroma`: Import documentation into ChromaDB (requires the ChromaDB server to be running)
- `npm run test-api-keys`: Test connections to OpenAI and Anthropic APIs

## Project Structure

```
wl8-indicator-builder/
├── app/                    # Next.js app router
│   ├── page.tsx            # Homepage
│   ├── documentation/      # Documentation browser
│   ├── builder/            # Indicator builder
│   └── qa/                 # Q&A platform
├── components/             # Reusable components
│   ├── ui/                 # UI components
│   ├── feature-card.tsx    # Feature card component
│   ├── footer.tsx          # Footer component
│   ├── hero-section.tsx    # Hero section component
│   ├── navbar.tsx          # Navigation bar component
│   └── step-item.tsx       # Step item component
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
│   ├── chroma-client.ts    # ChromaDB client
│   ├── documentation.ts    # Documentation utilities
│   ├── enhanced-rag.ts     # Enhanced RAG system
│   └── rag.ts              # Original RAG system
├── scripts/                # Utility scripts
│   ├── import-docs.js      # Import documentation from GitHub
│   ├── run-chroma.js       # Run ChromaDB server
│   └── import-chroma.js    # Import documentation into ChromaDB
└── docs/                   # Imported documentation
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
