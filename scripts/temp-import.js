
    // This is a temporary script to import documents to ChromaDB
    const { importDocumentsToChroma } = require('../lib/chroma-client');
    
    async function runImport() {
      try {
        const result = await importDocumentsToChroma();
        if (result.success) {
          console.log(result.message);
          process.exit(0);
        } else {
          console.error(result.message);
          process.exit(1);
        }
      } catch (error) {
        console.error('Error importing documents:', error);
        process.exit(1);
      }
    }
    
    runImport();
    