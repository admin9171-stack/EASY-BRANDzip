import { Layout } from "@/components/layout/Layout";
import { useListProducts, useListCategories, getListProductsQueryKey, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Link, useSearch } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Filter, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Shop() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCategory = searchParams.get("category");
  const initialSearch = searchParams.get("search");
  const initialOnSale = searchParams.get("onSale") === "true";

  const [category, setCategory] = useState<string | undefined>(initialCategory || undefined);
  const [search, setSearch] = useState<string>(initialSearch || "");
  const [onSale, setOnSale] = useState<boolean>(initialOnSale);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    ...(category && { category }),
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(onSale && { onSale }),
  };

  const { data: products, isLoading: isLoadingProducts } = useListProducts(queryParams, { 
    query: { queryKey: getListProductsQueryKey(queryParams) } 
  });
  
  const { data: categories, isLoading: isLoadingCategories } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() }
  });

  const clearFilters = () => {
    setCategory(undefined);
    setSearch("");
    setDebouncedSearch("");
    setOnSale(false);
  };

  const FiltersContent = () => (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <div className="space-y-3">
        <h3 className="font-display font-bold uppercase tracking-wider">Search</h3>
        <div className="relative">
          <Input 
            type="search" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-none"
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-display font-bold uppercase tracking-wider">Categories</h3>
        {isLoadingCategories ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-5 bg-muted animate-pulse w-2/3" />)}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cat-all" 
                checked={category === undefined} 
                onCheckedChange={() => setCategory(undefined)}
                className="rounded-none"
              />
              <Label htmlFor="cat-all" className="cursor-pointer">All Categories</Label>
            </div>
            {categories?.map((c) => (
              <div key={c.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cat-${c.id}`} 
                  checked={category === c.slug} 
                  onCheckedChange={() => setCategory(c.slug)}
                  className="rounded-none"
                />
                <Label htmlFor={`cat-${c.id}`} className="cursor-pointer">{c.name}</Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <h3 className="font-display font-bold uppercase tracking-wider">Filter By</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="filter-sale" 
              checked={onSale} 
              onCheckedChange={(c) => setOnSale(c as boolean)}
              className="rounded-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <Label htmlFor="filter-sale" className="cursor-pointer flex items-center gap-2">
              On Sale Items <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded uppercase leading-none">Sale</span>
            </Label>
          </div>
        </div>
      </div>

      {(category || search || onSale) && (
        <Button variant="outline" onClick={clearFilters} className="w-full rounded-none border-2">
          <X className="w-4 h-4 mr-2" /> Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-muted py-12 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            {category ? categories?.find(c => c.slug === category)?.name : "Shop All"}
          </h1>
          <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground font-medium uppercase tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Shop</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full flex items-center justify-between mb-4">
          <div className="text-sm font-semibold uppercase tracking-wider">
            {products?.length || 0} Products
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-none uppercase tracking-wider font-bold">
                <Filter className="w-4 h-4 mr-2" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader className="mb-6 border-b pb-4">
                <SheetTitle className="font-display uppercase tracking-wider text-left">Filters</SheetTitle>
              </SheetHeader>
              <FiltersContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
          <FiltersContent />
        </aside>

        {/* Product Grid */}
        <main className="flex-1 w-full">
          <div className="hidden lg:flex justify-between items-center mb-8 border-b pb-4">
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Showing <span className="text-foreground font-bold">{products?.length || 0}</span> results
            </div>
            {/* Could add sorting dropdown here if API supported it */}
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-muted animate-pulse border" />
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="py-24 text-center border bg-muted/30 flex flex-col items-center">
              <Search className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="font-display font-bold text-xl uppercase tracking-wider mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
              <Button onClick={clearFilters} className="rounded-none uppercase tracking-wider font-bold">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
