import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DocumentationLayout } from "@/components/documentation-layout";
import { DocumentationNav } from "@/components/documentation-nav";
import { getDocCategories, getDocNavItems } from "@/lib/documentation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = params;
  const categories = getDocCategories();
  const category = categories.find((cat) => cat.id === categoryId);
  
  if (!category) {
    notFound();
  }
  
  const navItems = getDocNavItems();
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Documentation Page Header */}
      <div className="bg-gradient-to-br from-[#1a365d] to-[#0d9488] text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.title}</h1>
          {category.description && (
            <p className="text-xl max-w-3xl">
              {category.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Documentation Content */}
      <DocumentationLayout
        sidebar={<DocumentationNav items={navItems} />}
      >
        <div className="grid gap-6">
          <h2 className="text-2xl font-bold">{category.title} Documentation</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {category.items.map((item) => (
              <Link key={item.id} href={`/documentation/${categoryId}/${item.id}`} className="block">
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    {item.description && (
                      <CardDescription>{item.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View documentation
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

// Generate static paths for all categories
export function generateStaticParams() {
  const categories = getDocCategories();
  return categories.map((category) => ({
    categoryId: category.id,
  }));
}
