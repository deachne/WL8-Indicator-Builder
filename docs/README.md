# WL8 Documentation

This directory contains the imported documentation for the WL8 Indicator Builder project. The documentation is imported from the [WL8-pkm](https://github.com/deachne/WL8-pkm) GitHub repository.

## Directory Structure

```
docs/
├── index.json                # Documentation index
├── api/                      # API reference documentation
│   ├── [id].json             # Metadata for API documentation
│   └── [id].md               # Content for API documentation
└── framework/                # Framework documentation
    ├── [id].json             # Metadata for framework documentation
    └── [id].md               # Content for framework documentation
```

## Importing Documentation

To import or update the documentation, run the following command:

```bash
npm run import-docs
```

This will:

1. Clone or update the WL8-pkm repository
2. Process the markdown files
3. Generate the documentation index
4. Save the processed documentation to this directory

## Using the Documentation

The documentation is automatically used by the RAG system if it exists. If the documentation has not been imported, the system will fall back to using mock data.

## Documentation Format

Each documentation item consists of two files:

1. A JSON metadata file with the following structure:
   ```json
   {
     "id": "unique-id",
     "title": "Document Title",
     "description": "Document description",
     "category": "api-reference or framework",
     "source": "Original source path"
   }
   ```

2. A markdown file containing the documentation content.

The `index.json` file contains a list of all documentation categories and items:

```json
{
  "categories": [
    {
      "id": "api-reference",
      "title": "API Reference",
      "description": "Comprehensive reference for the Wealth-Lab 8 API",
      "items": [...]
    },
    {
      "id": "framework",
      "title": "Framework",
      "description": "Documentation for the Wealth-Lab 8 framework",
      "items": [...]
    }
  ]
}
```

## Customizing the Import Process

If you need to customize the import process, you can modify the `scripts/import-docs.js` file. This script handles the cloning of the repository, processing of markdown files, and generation of the documentation index.
