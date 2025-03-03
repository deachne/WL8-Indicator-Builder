import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DocumentationLayout } from "@/components/documentation-layout";
import { DocumentationNav } from "@/components/documentation-nav";
import { searchDocs, fetchDocNavItems } from "@/lib/documentation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { MarkdownContent } from "@/components/markdown-content";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const results = query ? await searchDocs(query) : [];
  const navItems = await fetchDocNavItems();
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Documentation Page Header */}
      <div className="bg-gradient-to-br from-[#1a365d] to-[#0d9488] text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Documentation Search</h1>
          <p className="text-xl max-w-3xl">
            Search results for: <span className="font-semibold">{query}</span>
          </p>
        </div>
      </div>
      
      {/* Documentation Content */}
      <DocumentationLayout
        sidebar={<DocumentationNav items={navItems} />}
      >
        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Search Results</h2>
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </p>
          </div>
          
          {results.length > 0 ? (
            <div className="grid gap-6">
              {results.map((item) => (
                <Link key={item.id} href={`/documentation/${item.category}/${item.id}`}>
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      {item.description && (
                        <CardDescription>{item.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm prose-slate line-clamp-3 dark:prose-invert">
                        <MarkdownContent content={item.content.substring(0, 200) + '...'} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try a different search term or browse the documentation categories.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Enter a search term</h3>
              <p className="text-muted-foreground">
                Use the search box above to find documentation.
              </p>
            </div>
          )}
        </div>
      </DocumentationLayout>
      
      <Footer />
    </main>
  );
}
