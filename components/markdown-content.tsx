"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("prose prose-slate max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold tracking-tight mt-2 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold tracking-tight mt-10 mb-4" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-bold tracking-tight mt-8 mb-4" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-bold tracking-tight mt-6 mb-4" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="leading-7 mb-4" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-6 ml-6 list-disc" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-6 ml-6 list-decimal" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mt-2" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="font-medium text-blue-600 underline underline-offset-4" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
          ),
          code: ({ node, className, ...props }) => (
            <code
              className={cn(
                "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
                className
              )}
              {...props}
            />
          ),
          pre: ({ node, ...props }) => (
            <pre className="mb-4 mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="my-6 w-full overflow-y-auto">
              <table className="w-full" {...props} />
            </div>
          ),
          tr: ({ node, ...props }) => (
            <tr className="m-0 border-t p-0 even:bg-muted" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border px-4 py-2 text-left font-bold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border px-4 py-2 text-left" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
