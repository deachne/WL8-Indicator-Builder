"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Edit, Lock } from "lucide-react";

interface CodeDisplayProps {
  code: string;
  language?: string;
  title?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export function CodeDisplay({ 
  code, 
  language = "csharp", 
  title = "MyIndicator.cs",
  readOnly = true,
  onChange
}: CodeDisplayProps) {
  const [isEditable, setIsEditable] = React.useState(!readOnly);
  const [codeValue, setCodeValue] = React.useState(code);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(codeValue);
    // You could add a toast notification here
  };

  const handleExport = () => {
    const blob = new Blob([codeValue], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleToggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCodeValue(newCode);
    if (onChange) {
      onChange(newCode);
    }
  };

  // Make sure the textarea is properly editable
  React.useEffect(() => {
    if (isEditable) {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
        textarea.setAttribute('spellcheck', 'false');
      }
    }
  }, [isEditable]);

  // Apply syntax highlighting styles
  const codeStyle = {
    fontFamily: 'monospace',
    fontSize: '12px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap' as const,
    color: '#D4D4D4', // Default text color
  };

  return (
    <Card className="flex flex-col h-full border-0 shadow-md overflow-hidden">
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-medium flex items-center justify-between border-b border-gray-700">
        <span className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          {title}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleToggleEdit} 
          className="text-white hover:bg-gray-700"
          title={isEditable ? "Lock the editor to prevent changes" : "Enable editing of the code"}
        >
          {isEditable ? (
            <><Lock className="h-4 w-4 mr-2" /> Lock Editor</>
          ) : (
            <><Edit className="h-4 w-4 mr-2" /> Enable Editing</>
          )}
        </Button>
      </div>
      <CardContent className="flex-1 p-0 overflow-auto bg-[#1E1E1E]">
        {isEditable ? (
          <textarea
            value={codeValue}
            onChange={handleCodeChange}
            className="w-full h-full bg-[#1E1E1E] text-white p-4 font-mono text-sm resize-none focus:outline-none"
            style={{ minHeight: '300px' }}
          />
        ) : (
          <div className="p-4 h-full overflow-auto">
            <pre style={codeStyle}>
              <code>
                {codeValue.split('\n').map((line, i) => (
                  <div key={i} className="flex">
                    <span className="text-gray-500 select-none w-8 mr-4 text-right">{i + 1}</span>
                    <span className="flex-1" dangerouslySetInnerHTML={{ 
                      __html: line
                        .replace(/\/\/(.*)/g, '<span style="color: #6A9955; font-style: italic;">$&</span>') // Comments
                        .replace(/\b(using|namespace|public|class|override|return)\b/g, '<span style="color: #569CD6; font-weight: bold;">$&</span>') // Keywords
                        .replace(/\b(DataSeries|IndicatorBase|BarHistory)\b/g, '<span style="color: #4EC9B0;">$&</span>') // Types
                        .replace(/\b(Series|SMA)\b/g, '<span style="color: #DCDCAA;">$&</span>') // Functions
                        .replace(/\b(MyIndicators|MACrossover|bars|fastMA|slowMA)\b/g, '<span style="color: #9CDCFE;">$&</span>') // Variables
                        .replace(/(".*?")/g, '<span style="color: #CE9178;">$&</span>') // Strings
                        .replace(/\b(\d+)\b/g, '<span style="color: #B5CEA8;">$&</span>') // Numbers
                    }} />
                  </div>
                ))}
              </code>
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-3 p-2 bg-gray-800 border-t border-gray-700">
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleCopy} 
          className="bg-gray-700 hover:bg-gray-600 text-white flex items-center"
          title="Copy code to clipboard"
        >
          <Copy className="h-4 w-4 mr-2" /> Copy Code
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleExport} 
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
          title="Export code to a file for use in WL8"
        >
          <Download className="h-4 w-4 mr-2" /> Export to WL8
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="bg-gray-700 hover:bg-gray-600 text-white flex items-center"
          title="Share this indicator with others"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
