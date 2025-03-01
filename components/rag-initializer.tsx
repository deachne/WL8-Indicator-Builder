"use client";

import { useEffect, useState } from "react";

export function RagInitializer() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const initializeRag = async () => {
      try {
        const response = await fetch("/api/init-rag");
        const data = await response.json();
        
        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to initialize RAG system");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred while initializing the RAG system");
        console.error("Error initializing RAG system:", error);
      }
    };

    initializeRag();
  }, []);

  // This component doesn't render anything visible
  return null;
}
