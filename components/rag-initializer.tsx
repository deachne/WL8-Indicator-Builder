"use client";

import { useEffect, useState } from "react";

interface RagStatus {
  status: "loading" | "success" | "error";
  message: string;
  documentCount?: number;
  usingChroma?: boolean;
  collectionName?: string;
}

export function RagInitializer() {
  const [ragStatus, setRagStatus] = useState<RagStatus>({
    status: "loading",
    message: "Initializing RAG system...",
  });

  useEffect(() => {
    const initializeRag = async () => {
      try {
        const response = await fetch("/api/init-rag");
        const data = await response.json();
        
        if (response.ok) {
          setRagStatus({
            status: "success",
            message: data.message,
            documentCount: data.documentCount,
            usingChroma: data.usingChroma,
            collectionName: data.collectionName,
          });
          
          // Log RAG system information to console
          console.log("RAG System Initialized:", {
            message: data.message,
            documentCount: data.documentCount,
            usingChroma: data.usingChroma,
            collectionName: data.collectionName,
          });
        } else {
          setRagStatus({
            status: "error",
            message: data.error || "Failed to initialize RAG system",
          });
        }
      } catch (error) {
        setRagStatus({
          status: "error",
          message: "An unexpected error occurred while initializing the RAG system",
        });
        console.error("Error initializing RAG system:", error);
      }
    };

    initializeRag();
  }, []);

  // This component doesn't render anything visible
  return null;
}
