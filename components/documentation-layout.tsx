"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface DocumentationLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  className?: string;
}

export function DocumentationLayout({
  children,
  sidebar,
  className,
}: DocumentationLayoutProps) {
  return (
    <div className={cn("flex min-h-screen", className)}>
      {/* Sidebar */}
      <div className="w-64 border-r bg-white">
        {sidebar}
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container py-6 px-4 md:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
