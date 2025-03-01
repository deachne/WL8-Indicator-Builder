"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DocumentationLayout } from "@/components/documentation-layout";
import { DocumentationNav } from "@/components/documentation-nav";
import { getDocNavItems, searchDocs } from "@/lib/documentation";
import { MarkdownContent } from "@/components/markdown-content";
import { AiAssistant } from "@/components/ai-assistant";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState(searchDocs(query));
  const navItems = getDocNavItems();
  
  useEffect(() => {
    setResults(searchDocs(query));
  }, [query]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/documentation/search?q=${encodeURIComponent(searchQuery)}`);
  };
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Documentation Page Header */}
      <div className="bg-gradient-to-br from-[#1a365d] to-[#0d9488] text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Documentation Search</h1>
          <p className="text-xl max-w-3xl">
            Search through the Wealth-Lab 8 documentation to find what you need.
          </p>
        </div>
      </div>
      
      {/* Documentation Content */}
      <DocumentationLayout
        sidebar={<DocumentationNav items={navItems} onSearch={(q) => setSearchQuery(q)} />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid gap-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search documentation..."
                  className="flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit">Search</Button>
              </form>
              
              {query && (
                <h2 className="text-2xl font-bold">
                  Search Results for "{query}"
                </h2>
              )}
              
              {results.length > 0 ? (
                <div className="grid gap-6">
                  {results.map((item) => (
                    <Link key={item.id} href={`/documentation/${item.category}/${item.id}`} className="block">
                      <Card className="transition-all hover:shadow-md">
                        <CardHeader>
                          <CardTitle>{item.title}</CardTitle>
                          {item.description && (
                            <CardDescription>{item.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground mb-2">
                            Category: {item.category}
                          </div>
                          <div className="line-clamp-3 text-sm">
                            {item.content.substring(0, 200)}...
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : query ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try a different search term or browse the documentation categories.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
          <div className="lg:col-span-1">
            <AiAssistant initialContext={query} placeholder="Ask about WL8..." />
          </div>
        </div>
      </DocumentationLayout>
      
      <Footer />
    </main>
  );
}
