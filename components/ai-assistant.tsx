"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, BookOpen } from "lucide-react";
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
}

export function AiAssistant({ initialContext, placeholder = "Ask about WL8..." }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [suggestions, setSuggestions] = useState<Source[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add system welcome message on first load
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm your WL8 assistant. I can help you with questions about Wealth-Lab 8 indicators, strategies, and API usage. How can I help you today?",
      },
    ]);
    
    // If there's initial context, get suggestions based on it
    if (initialContext) {
      fetchSuggestions(initialContext);
    }
  }, [initialContext]);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input and set loading state
    setInput("");
    setIsLoading(true);
    
    try {
      // Get suggestions based on user query
      fetchSuggestions(input);
      
      // Send query to RAG system
      const response = await fetch("/api/rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response from AI assistant");
      }
      
      const data = await response.json();
      
      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "I'm sorry, I couldn't find an answer to your question." },
      ]);
      
      // Update sources
      if (data.sources && data.sources.length > 0) {
        setSources(data.sources);
      }
    } catch (error) {
      console.error("Error querying AI assistant:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error while processing your request. Please try again later.",
        },
      ]);
    } finally {
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
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg">WL8 AI Assistant</CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="chat" className="flex-1 flex flex-col h-full">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="docs">Related Docs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 h-full">
          {/* Main container with flex to push chat input to bottom */}
          <div className="flex flex-col h-full relative">
            {/* Chat messages area - takes up all available space */}
            <ScrollArea className="flex-grow p-4 pb-20">
              <div className="space-y-4">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <MarkdownContent content={message.content} />
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input area - fixed at the bottom */}
            <div className="p-4 border-t bg-gray-900 absolute bottom-0 left-0 right-0 z-10">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex gap-2 mb-2">
                  <textarea
                    placeholder={placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 min-h-[60px] p-2 rounded-md border border-gray-600 bg-gray-800 text-white resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
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
              
              {suggestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Related Documentation</h3>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, i) => (
                      <Link
                        key={i}
                        href={suggestion.url}
                        className="block p-3 rounded-lg border hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{suggestion.title}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.category}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {sources.length === 0 && suggestions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No related documentation found.</p>
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
