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
      
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="docs">Related Docs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
          <ScrollArea className="flex-1 p-4">
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
          
          <CardFooter className="p-4 pt-2 border-t">
            <form onSubmit={handleSubmit} className="w-full flex gap-2">
              <Input
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
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
