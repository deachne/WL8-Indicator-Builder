"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Edit, Lock } from "lucide-react";
import Editor, { OnMount, useMonaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface CodeDisplayProps {
  code: string;
  language?: string;
  title?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onClear?: (clearFn: () => void) => void;
  onReplace?: (replaceFn: (code: string) => void) => void;
}

// C# snippets and completions
const csharpSnippets = [
  {
    label: 'class',
    kind: 'snippet',
    insertText: 'public class ${1:ClassName} : ${2:IndicatorBase}\n{\n\tpublic override DataSeries Series(BarHistory bars)\n\t{\n\t\t${0}\n\t\treturn null;\n\t}\n}',
    documentation: 'Create a new indicator class',
  },
  {
    label: 'sma',
    kind: 'snippet',
    insertText: 'DataSeries ${1:sma} = SMA.Series(${2:bars.Close}, ${3:20});',
    documentation: 'Create a Simple Moving Average',
  },
  {
    label: 'ema',
    kind: 'snippet',
    insertText: 'DataSeries ${1:ema} = EMA.Series(${2:bars.Close}, ${3:20});',
    documentation: 'Create an Exponential Moving Average',
  },
  {
    label: 'rsi',
    kind: 'snippet',
    insertText: 'DataSeries ${1:rsi} = RSI.Series(${2:bars.Close}, ${3:14});',
    documentation: 'Create a Relative Strength Index',
  },
  {
    label: 'macd',
    kind: 'snippet',
    insertText: 'DataSeries ${1:macd} = MACD.Series(${2:bars.Close}, ${3:12}, ${4:26}, ${5:9});',
    documentation: 'Create a MACD indicator',
  }
];

// C# keywords and types for IntelliSense
const csharpKeywords = [
  'using', 'namespace', 'class', 'public', 'private', 'protected', 'internal',
  'static', 'readonly', 'const', 'override', 'virtual', 'abstract', 'sealed',
  'new', 'this', 'base', 'void', 'return', 'if', 'else', 'for', 'foreach',
  'while', 'do', 'switch', 'case', 'break', 'continue', 'default', 'try',
  'catch', 'finally', 'throw', 'get', 'set'
];

const csharpTypes = [
  'DataSeries', 'IndicatorBase', 'BarHistory', 'int', 'double', 'string',
  'bool', 'object', 'decimal', 'float', 'long', 'short', 'byte', 'char'
];

const wealthLabFunctions = [
  'SMA', 'EMA', 'WMA', 'DEMA', 'TEMA', 'HMA', 'ZLEMA', 'RSI', 'MACD',
  'Stochastic', 'BollingerBands', 'ATR', 'ADX', 'CCI', 'ROC', 'OBV'
];

export function CodeDisplay({ 
  code, 
  language = "csharp", 
  title = "MyIndicator.cs",
  readOnly = true,
  onChange,
  onClear,
  onReplace
}: CodeDisplayProps) {
  const [isEditable, setIsEditable] = React.useState(!readOnly);
  const [codeValue, setCodeValue] = React.useState(code);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  
  // Update editor content when code prop changes
  useEffect(() => {
    if (code !== codeValue) {
      setCodeValue(code);
      if (editorRef.current) {
        // Only update if the editor value is different to avoid cursor position reset
        const currentValue = editorRef.current.getValue();
        if (currentValue !== code) {
          editorRef.current.setValue(code);
        }
      }
    }
  }, [code]);
  
  // Clear editor function
  const clearEditor = () => {
    if (editorRef.current) {
      editorRef.current.setValue("");
      setCodeValue("");
      if (onChange) onChange("");
    }
  };

  // Replace editor content function
  const replaceEditorContent = (newCode: string) => {
    if (editorRef.current) {
      editorRef.current.setValue(newCode);
      setCodeValue(newCode);
      if (onChange) onChange(newCode);
    }
  };

  // Expose methods via props
  useEffect(() => {
    if (onClear) onClear(clearEditor);
    if (onReplace) onReplace(replaceEditorContent);
  }, [onClear, onReplace]);
  
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

  // This function is no longer needed as Monaco Editor handles changes directly

  // Monaco editor options
  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 12,
    automaticLayout: true,
    lineNumbers: "on" as const,
    folding: true,
    wordWrap: "on" as const,
    renderLineHighlight: "all" as const,
    scrollbar: {
      vertical: "auto" as const,
      horizontal: "auto" as const,
    },
    suggestOnTriggerCharacters: true,
    formatOnPaste: true,
    formatOnType: true,
    autoIndent: "full" as const,
    snippetSuggestions: "inline" as const,
    codeLens: true,
    contextmenu: true,
    quickSuggestions: true,
  };
  
  // Get Monaco instance
  const monaco = useMonaco();
  
  // Configure Monaco editor with C# language features
  useEffect(() => {
    if (monaco && language === "csharp") {
      // Register C# completions provider for IntelliSense
      const completionDisposable = monaco.languages.registerCompletionItemProvider('csharp', {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };
          
          // Create completion items
          const suggestions = [
            // Add snippets
            ...csharpSnippets.map(snippet => ({
              label: snippet.label,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: snippet.insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: snippet.documentation,
              range
            })),
            
            // Add keywords
            ...csharpKeywords.map(keyword => ({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              range
            })),
            
            // Add types
            ...csharpTypes.map(type => ({
              label: type,
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: type,
              range
            })),
            
            // Add WealthLab functions
            ...wealthLabFunctions.map(func => ({
              label: func,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: func,
              range
            }))
          ];
          
          return { suggestions };
        }
      });
      
      // Set up basic C# validation
      const validateCSharpCode = () => {
        if (!editorRef.current) return;
        
        const model = editorRef.current.getModel();
        if (!model) return;
        
        const value = model.getValue();
        const markers: editor.IMarkerData[] = [];
        
        // Check for basic syntax errors
        const lines = value.split('\n');
        lines.forEach((line, lineIndex) => {
          // Check for missing semicolons in statements
          if (line.trim() && 
              !line.trim().endsWith('{') && 
              !line.trim().endsWith('}') && 
              !line.trim().endsWith(';') && 
              !line.trim().startsWith('//') &&
              !line.trim().startsWith('using') &&
              !line.trim().startsWith('namespace')) {
            markers.push({
              severity: monaco.MarkerSeverity.Error,
              message: 'Missing semicolon',
              startLineNumber: lineIndex + 1,
              startColumn: line.length + 1,
              endLineNumber: lineIndex + 1,
              endColumn: line.length + 1
            });
          }
          
          // Check for unbalanced braces
          const openBraces = (line.match(/{/g) || []).length;
          const closeBraces = (line.match(/}/g) || []).length;
          if (openBraces > closeBraces) {
            markers.push({
              severity: monaco.MarkerSeverity.Warning,
              message: 'Unbalanced braces - missing closing brace',
              startLineNumber: lineIndex + 1,
              startColumn: 1,
              endLineNumber: lineIndex + 1,
              endColumn: line.length + 1
            });
          }
          
          // Check for missing namespace
          if (lineIndex === 0 && !line.includes('using') && !value.includes('namespace')) {
            markers.push({
              severity: monaco.MarkerSeverity.Warning,
              message: 'Missing namespace declaration',
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: line.length + 1
            });
          }
        });
        
        // Set markers on the model
        monaco.editor.setModelMarkers(model, 'csharp', markers);
      };
      
      // Set up model change listener for validation
      let changeDisposable: any = null;
      if (editorRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          changeDisposable = model.onDidChangeContent(() => {
            validateCSharpCode();
          });
          
          // Initial validation
          validateCSharpCode();
        }
      }
      
      // Clean up
      return () => {
        completionDisposable.dispose();
        if (changeDisposable) {
          changeDisposable.dispose();
        }
      };
    }
  }, [monaco, language, editorRef.current]);
  
  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // Focus editor if editable
    if (isEditable) {
      editor.focus();
    }
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
      <CardContent className="flex-1 p-0 overflow-hidden bg-[#1E1E1E]" style={{ minHeight: '300px' }}>
        <Editor
          height="100%"
          defaultLanguage={language === "csharp" ? "csharp" : language}
          value={codeValue}
          theme="vs-dark"
          options={{
            ...editorOptions,
            readOnly: !isEditable,
          }}
          onChange={(value) => {
            if (value !== undefined) {
              setCodeValue(value);
              if (onChange) {
                onChange(value);
              }
            }
          }}
          onMount={handleEditorDidMount}
          className="min-h-[300px]"
        />
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
