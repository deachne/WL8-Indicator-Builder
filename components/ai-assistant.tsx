"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, BookOpen, Code, ArrowRight, Trash, XCircle } from "lucide-react";
import Link from "next/link";
import { MarkdownContent } from "@/components/markdown-content";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Source {
  id: string;
  title: string;
  category: string;
  url: string;
}

interface AiAssistantProps {
  initialContext?: string;
  placeholder?: string;
  onApplyCode?: (code: string) => void;
  onClearEditor?: () => void;
  onReplaceEditor?: (code: string) => void;
}

export function AiAssistant({ 
  initialContext, 
  placeholder = "Ask about WL8...",
  onApplyCode,
  onClearEditor,
  onReplaceEditor
}: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [suggestions, setSuggestions] = useState<Source[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State for RAG system info
  const [ragInfo, setRagInfo] = useState<{
    usingSupabase: boolean;
    documentCount: number;
  }>({
    usingSupabase: false,
    documentCount: 0,
  });

  // Add system welcome message on first load and check RAG system
  useEffect(() => {
    // Check RAG system info
    const checkRagSystem = async () => {
      try {
        const response = await fetch("/api/init-rag");
        if (response.ok) {
          const data = await response.json();
          setRagInfo({
            usingSupabase: data.usingSupabase || false,
            documentCount: data.documentCount || 0,
          });
          
          // Set welcome message based on RAG system info
          const welcomeMessage = data.usingSupabase
            ? `Hello! I'm your WL8 assistant powered by Supabase with ${data.documentCount} documents. I can help you with questions about Wealth-Lab 8 indicators, strategies, and API usage. How can I help you today?`
            : "Hello! I'm your WL8 assistant. I can help you with questions about Wealth-Lab 8 indicators, strategies, and API usage. How can I help you today?";
          
          setMessages([
            {
              role: "assistant",
              content: welcomeMessage,
            },
          ]);
        } else {
          // Fallback welcome message
          setMessages([
            {
              role: "assistant",
              content: "Hello! I'm your WL8 assistant. I can help you with questions about Wealth-Lab 8 indicators, strategies, and API usage. How can I help you today?",
            },
          ]);
        }
      } catch (error) {
        console.error("Error checking RAG system:", error);
        // Fallback welcome message
        setMessages([
          {
            role: "assistant",
            content: "Hello! I'm your WL8 assistant. I can help you with questions about Wealth-Lab 8 indicators, strategies, and API usage. How can I help you today?",
          },
        ]);
      }
    };
    
    checkRagSystem();
    
    // Removed fetching suggestions based on initial context
  }, [initialContext]);

  // Extract code blocks from a markdown string
  const extractCodeBlocks = (markdown: string): { language: string; code: string }[] => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const codeBlocks: { language: string; code: string }[] = [];
    
    let match;
    while ((match = codeBlockRegex.exec(markdown)) !== null) {
      const [_, language, code] = match;
      codeBlocks.push({
        language: language || "csharp",
        code: code.trim()
      });
    }
    
    return codeBlocks;
  };

  // Apply code to the editor
  const handleApplyCode = (code: string) => {
    if (onApplyCode) {
      onApplyCode(code);
    }
  };

  // Clear the editor
  const handleClearEditor = () => {
    if (onClearEditor) {
      onClearEditor();
    }
  };

  // Replace editor content
  const handleReplaceEditor = (code: string) => {
    if (onReplaceEditor) {
      onReplaceEditor(code);
    }
  };

  // Handle AI actions
  const handleAiAction = (action: any) => {
    if (!action) return;
    
    switch (action.type) {
      case "clear":
        handleClearEditor();
        break;
      case "replace":
        if (action.code) {
          handleReplaceEditor(action.code);
        }
        break;
      default:
        break;
    }
  };

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 Form submission triggered");
    
    if (!input.trim() || isLoading) {
      console.log("⚠️ Form submission aborted: empty input or already loading");
      return;
    }
    
    const userInput = input.trim();
    console.log("📝 User input:", userInput);
    
    // Add user message to chat
    const userMessage = { role: "user" as const, content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    console.log("✅ Added user message to chat");
    
    // Clear input and set loading state
    setInput("");
    setIsLoading(true);
    console.log("⏳ Set loading state to true");
    
    try {
      // Removed fetching suggestions based on user query
      
      // Get API keys from localStorage
      const openaiKey = localStorage.getItem("openai_api_key");
      const anthropicKey = localStorage.getItem("anthropic_api_key");
      
      // Check if at least one API key is available
      if (!openaiKey && !anthropicKey) {
        console.log("⚠️ No API keys found in localStorage");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I need API keys to function. Please go to the [Settings](/settings) page to configure your API keys.",
          },
        ]);
        setIsLoading(false);
        return;
      }
      
      // Send query to RAG system
      console.log("🔄 Sending query to RAG system");
      
      // Ensure API keys are properly formatted
      // Sometimes keys can have extra whitespace from copy/paste
      const cleanOpenaiKey = openaiKey ? openaiKey.trim() : '';
      const cleanAnthropicKey = anthropicKey ? anthropicKey.trim() : '';
      
      const requestBody = JSON.stringify({ 
        query: userInput,
        openaiKey: cleanOpenaiKey,
        anthropicKey: cleanAnthropicKey
      });
      console.log("📤 Request body:", JSON.stringify({ 
        query: userInput,
        openaiKey: cleanOpenaiKey ? "present" : "missing",
        anthropicKey: cleanAnthropicKey ? "present" : "missing"
      }));
      
      const response = await fetch("/api/rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      
      console.log("📥 Response status:", response.status);
      
      if (!response.ok) {
        console.error("❌ Response not OK:", response.status, response.statusText);
        throw new Error(`Failed to get response from AI assistant: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("📥 Response data:", data);
      
      // Add assistant response to chat
      console.log("✅ Adding assistant response to chat");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "I'm sorry, I couldn't find an answer to your question." },
      ]);
      
      // Handle action if present
      if (data.action && data.action.type !== "none") {
        console.log("🔄 Handling AI action:", data.action);
        handleAiAction(data.action);
      }
      
      // Update sources
      if (data.sources && data.sources.length > 0) {
        console.log("📚 Updating sources:", data.sources.length, "sources found");
        setSources(data.sources);
      }
    } catch (error) {
      console.error("❌ Error querying AI assistant:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error while processing your request. Please try again later.",
        },
      ]);
    } finally {
      console.log("✅ Setting loading state to false");
      setIsLoading(false);
    }
  };

  // Fetch documentation suggestions based on query
  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error("Failed to get suggestions");
      }
      
      const data = await response.json();
      
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b flex flex-row justify-between items-center">
        <CardTitle className="text-lg">WL8 AI Assistant</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Keep the first welcome message and clear the rest
            if (messages.length > 0) {
              setMessages([messages[0]]);
            }
            // Clear sources and suggestions
            setSources([]);
            setSuggestions([]);
          }}
          className="h-8 px-2 text-gray-400 hover:text-white hover:bg-gray-700"
          title="Clear chat history"
        >
          <XCircle className="h-4 w-4 mr-1" />
          Clear Chat
        </Button>
      </CardHeader>
      
      <Tabs defaultValue="chat" className="flex-1 flex flex-col h-full">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 h-full">
          {/* Main container with flex layout */}
          <div className="flex flex-col h-full">
            {/* Chat messages area with flex-grow and scrolling */}
            <div className="flex-grow overflow-hidden h-[calc(100%-120px)]">
              <ScrollArea className="h-full p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
                <div className="space-y-4 pb-4 pr-2">
                  {messages.map((message, i) => {
                    // Extract code blocks for assistant messages
                    const codeBlocks = message.role === "assistant" 
                      ? extractCodeBlocks(message.content) 
                      : [];
                    
                    return (
                      <div
                        key={i}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-800 text-white"
                          }`}
                        >
                          <MarkdownContent 
                            content={message.content} 
                            className={message.role === "assistant" ? "text-white" : ""}
                          />
                          
                          {/* Add "Apply to Editor" buttons for code blocks */}
                          {message.role === "assistant" && codeBlocks.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-700">
                              {codeBlocks.map((block, blockIndex) => (
                                <div key={blockIndex} className="flex flex-wrap gap-2 mt-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleApplyCode(block.code)}
                                    className="text-xs bg-blue-900 hover:bg-blue-800 border-blue-700 text-white"
                                    disabled={!onApplyCode}
                                  >
                                    <Code className="h-3 w-3 mr-1" />
                                    Apply Code
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                  </Button>
                                  
                                  {onClearEditor && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        handleClearEditor();
                                        setTimeout(() => handleApplyCode(block.code), 100);
                                      }}
                                      className="text-xs bg-red-900 hover:bg-red-800 border-red-700 text-white"
                                      disabled={!onApplyCode || !onClearEditor}
                                    >
                                      <Trash className="h-3 w-3 mr-1" />
                                      Clear & Apply
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-lg p-3 bg-gray-800">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>
            
            {/* Input area - fixed at the bottom */}
            <div className="p-4 border-t bg-gray-900 sticky bottom-0 z-10">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 relative">
                    <textarea
                      placeholder={placeholder}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading}
                      className="w-full min-h-[60px] p-2 rounded-md border border-gray-600 bg-gray-800 text-white resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      id="ai-assistant-input"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading} 
                    className="bg-blue-600 hover:bg-blue-700 self-end h-10 w-10"
                    title="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="default" 
                      size="sm" 
                      className="text-xs h-7 px-2 flex items-center bg-gray-700 hover:bg-gray-600"
                      title="Attach an image to your message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                      Attach Image
                    </Button>
                  </div>
                  {isLoading && (
                    <div className="text-xs text-gray-400 flex items-center">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Processing...
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="docs" className="flex-1 flex flex-col p-0 m-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {sources.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Sources</h3>
                  <div className="space-y-2">
                    {sources.map((source, i) => (
                      <Link
                        key={i}
                        href={source.url}
                        className="block p-3 rounded-lg border hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{source.title}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {source.category}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {sources.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No sources found.</p>
                  <p>Try asking a question to see relevant sources.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
