import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DocumentationLayout } from "@/components/documentation-layout";
import { DocumentationNav } from "@/components/documentation-nav";
import { fetchDocCategories, fetchDocNavItems } from "@/lib/documentation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function DocumentationPage() {
  const categories = await fetchDocCategories();
  const navItems = await fetchDocNavItems();
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Documentation Page Header */}
      <div className="bg-gradient-to-br from-[#1a365d] to-[#0d9488] text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">WL8 Documentation</h1>
          <p className="text-xl max-w-3xl">
            Explore the complete Wealth-Lab 8 API documentation, frameworks, and examples to help build your custom indicators.
          </p>
        </div>
      </div>
      
      {/* Documentation Content */}
      <DocumentationLayout
        sidebar={<DocumentationNav items={navItems} />}
      >
        <div className="grid gap-6">
          <h2 className="text-2xl font-bold">Documentation Categories</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category) => (
              <Link key={category.id} href={`/documentation/${category.id}`} className="block">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{category.title}</CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.items.length} {category.items.length === 1 ? 'document' : 'documents'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </DocumentationLayout>
      
      <Footer />
    </main>
  );
}
