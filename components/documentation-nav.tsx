"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocNavItem {
  title: string;
  href: string;
  items?: DocNavItem[];
}

interface DocumentationNavProps {
  items: DocNavItem[];
  onSearch?: (query: string) => void;
}

export function DocumentationNav({ items, onSearch }: DocumentationNavProps) {
  const pathname = usePathname();
  
  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="p-4 border-b">
        <Input 
          placeholder="Search documentation..." 
          className="w-full"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>
      
      {/* Navigation items */}
      <ScrollArea className="flex-1 p-4">
        <Accordion type="multiple" className="w-full">
          {items.map((item, index) => (
            <div key={index} className="pb-4">
              {item.items ? (
                <AccordionItem value={`item-${index}`} className="border-none">
                  <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 border-l">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={cn(
                            "block py-2 text-sm transition-colors hover:text-foreground/80",
                            pathname === subItem.href
                              ? "font-medium text-foreground"
                              : "text-foreground/60"
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "block py-2 text-sm font-medium transition-colors hover:text-foreground/80",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
