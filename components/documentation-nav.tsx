"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/documentation/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="p-4 border-b">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input 
            placeholder="Search documentation..." 
            className="w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
          />
          <Button type="submit" size="sm" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>
        </form>
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
