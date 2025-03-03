"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle2, KeyRound, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ApiKeysFormProps {
  onSave?: (keys: { openai: string; anthropic: string }) => void;
}

export function ApiKeysForm({ onSave }: ApiKeysFormProps) {
  const [openaiKey, setOpenaiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    openai: { success: boolean; message: string } | null;
    anthropic: { success: boolean; message: string } | null;
  }>({
    openai: null,
    anthropic: null,
  });
  
  // Load keys from localStorage on component mount
  useEffect(() => {
    const savedOpenaiKey = localStorage.getItem("openai_api_key");
    const savedAnthropicKey = localStorage.getItem("anthropic_api_key");
    
    if (savedOpenaiKey) {
      setOpenaiKey(savedOpenaiKey);
    }
    
    if (savedAnthropicKey) {
      setAnthropicKey(savedAnthropicKey);
    }
  }, []);
  
  const handleSave = () => {
    // Save keys to localStorage (trim to remove any accidental whitespace)
    if (openaiKey) {
      localStorage.setItem("openai_api_key", openaiKey.trim());
    }
    
    if (anthropicKey) {
      localStorage.setItem("anthropic_api_key", anthropicKey.trim());
    }
    
    // Call the onSave callback if provided
    if (onSave) {
      onSave({ openai: openaiKey, anthropic: anthropicKey });
    }
    
    // Test the keys
    testApiKeys();
  };
  
  const testApiKeys = async () => {
    setIsLoading(true);
    setTestResults({ openai: null, anthropic: null });
    
    try {
      // Test OpenAI API key
      if (openaiKey) {
        try {
          const openaiResponse = await fetch("/api/test-keys", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: "openai",
              key: openaiKey,
            }),
          });
          
          const openaiData = await openaiResponse.json();
          
          setTestResults(prev => ({
            ...prev,
            openai: {
              success: openaiData.success,
              message: openaiData.message,
            },
          }));
        } catch (error) {
          setTestResults(prev => ({
            ...prev,
            openai: {
              success: false,
              message: "Failed to test OpenAI API key",
            },
          }));
        }
      }
      
      // Test Anthropic API key
      if (anthropicKey) {
        try {
          const anthropicResponse = await fetch("/api/test-keys", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: "anthropic",
              key: anthropicKey,
            }),
          });
          
          const anthropicData = await anthropicResponse.json();
          
          setTestResults(prev => ({
            ...prev,
            anthropic: {
              success: anthropicData.success,
              message: anthropicData.message,
            },
          }));
        } catch (error) {
          setTestResults(prev => ({
            ...prev,
            anthropic: {
              success: false,
              message: "Failed to test Anthropic API key",
            },
          }));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">API Keys Configuration</CardTitle>
        <CardDescription>
          Configure your API keys for OpenAI and Anthropic to use the AI assistant.
          These keys are stored locally in your browser and are not sent to our servers.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="anthropic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="anthropic">Anthropic (Claude)</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="anthropic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="anthropic-key" className="text-base font-medium">
                  Anthropic API Key
                </Label>
                <Badge variant="outline" className="ml-2">
                  Recommended for Code Generation
                </Badge>
              </div>
              <Input
                id="anthropic-key"
                type="password"
                placeholder="sk-ant-..."
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                The WL8 Indicator Builder uses Claude 3.5 Sonnet for code generation tasks.
              </p>
            </div>
            
            {testResults.anthropic && (
              <Alert variant={testResults.anthropic.success ? "default" : "destructive"}>
                {testResults.anthropic.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {testResults.anthropic.success ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription>
                  {testResults.anthropic.message}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-4">
              <Link 
                href="https://console.anthropic.com/" 
                target="_blank"
                className="flex items-center text-sm text-blue-500 hover:text-blue-700"
              >
                <KeyRound className="h-4 w-4 mr-1" />
                Get an Anthropic API key
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
              <Link 
                href="/ANTHROPIC_SETUP.md" 
                target="_blank"
                className="flex items-center text-sm text-blue-500 hover:text-blue-700 mt-1"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View detailed setup instructions
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="openai" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key" className="text-base font-medium">
                OpenAI API Key
              </Label>
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                Used as a fallback if Anthropic API is unavailable.
              </p>
            </div>
            
            {testResults.openai && (
              <Alert variant={testResults.openai.success ? "default" : "destructive"}>
                {testResults.openai.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {testResults.openai.success ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription>
                  {testResults.openai.message}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-4">
              <Link 
                href="https://platform.openai.com/api-keys" 
                target="_blank"
                className="flex items-center text-sm text-blue-500 hover:text-blue-700"
              >
                <KeyRound className="h-4 w-4 mr-1" />
                Get an OpenAI API key
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Your API keys are stored locally in your browser.
        </p>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>Save & Test Keys</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
