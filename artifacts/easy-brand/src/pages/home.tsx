import { useState } from "react";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Truck, ShieldCheck, Clock } from "lucide-react";

const heroBanner = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80";
const saleBanner = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80";

function ProductTab({ type }: { type: "all" | "bestSelling" | "featured" | "onSale" }) {
  const params = type === "all" ? {} : { [type]: true };
  const { data: products, isLoading } = useListProducts(params, { query: { queryKey: getListProductsQueryKey(params) } });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-muted animate-pulse border" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-24 text-center border mt-8 bg-muted/30">
        <p className="text-muted-foreground font-display uppercase tracking-widest">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
      {products.slice(0, 8).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("featured");

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
          <img 
            src={heroBanner} 
            alt="New Collection" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl text-white">
            <span className="inline-block py-1 px-3 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest mb-6">
              New Arrival
            </span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Rule The <br />
              <span className="text-primary">Streets.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg font-medium">
              Premium menswear engineered for confidence. Drop 001 is now live in Sylhet and online globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg uppercase tracking-wider font-bold h-14 px-8 rounded-none">
                <Link href="/shop">Shop Collection</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg uppercase tracking-wider font-bold h-14 px-8 rounded-none bg-transparent text-white border-white hover:bg-white hover:text-black">
                <Link href="/shop?category=hoodies">View Hoodies</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 bg-white flex items-center justify-center border shadow-sm shrink-0">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold uppercase text-sm tracking-wider">Free Shipping</h4>
                <p className="text-xs text-muted-foreground">On all orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-center">
              <div className="w-12 h-12 bg-white flex items-center justify-center border shadow-sm shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold uppercase text-sm tracking-wider">Secure Payment</h4>
                <p className="text-xs text-muted-foreground">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-end">
              <div className="w-12 h-12 bg-white flex items-center justify-center border shadow-sm shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold uppercase text-sm tracking-wider">24/7 Support</h4>
                <p className="text-xs text-muted-foreground">Dedicated team available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Products Section */}
      <section className="py-20 container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Latest <span className="text-primary">Drops</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover our premium selection of streetwear essentials.</p>
        </div>

        <Tabs defaultValue="featured" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center border-b">
            <TabsList className="bg-transparent h-auto p-0 rounded-none w-full max-w-3xl flex justify-between gap-0 sm:gap-4 overflow-x-auto overflow-y-hidden border-none no-scrollbar">
              <TabsTrigger 
                value="featured" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-2 sm:px-4 uppercase tracking-wider font-bold text-xs sm:text-sm whitespace-nowrap"
              >
                Featured
              </TabsTrigger>
              <TabsTrigger 
                value="bestSelling" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-2 sm:px-4 uppercase tracking-wider font-bold text-xs sm:text-sm whitespace-nowrap"
              >
                Best Sellers
              </TabsTrigger>
              <TabsTrigger 
                value="onSale" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-2 sm:px-4 uppercase tracking-wider font-bold text-xs sm:text-sm whitespace-nowrap"
              >
                On Sale
              </TabsTrigger>
              <TabsTrigger 
                value="all" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-2 sm:px-4 uppercase tracking-wider font-bold text-xs sm:text-sm whitespace-nowrap"
              >
                All Products
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="featured" className="mt-0 outline-none">
            <ProductTab type="featured" />
          </TabsContent>
          <TabsContent value="bestSelling" className="mt-0 outline-none">
            <ProductTab type="bestSelling" />
          </TabsContent>
          <TabsContent value="onSale" className="mt-0 outline-none">
            <ProductTab type="onSale" />
          </TabsContent>
          <TabsContent value="all" className="mt-0 outline-none">
            <ProductTab type="all" />
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 flex justify-center">
          <Button variant="outline" size="lg" asChild className="rounded-none uppercase tracking-wider font-bold border-2">
            <Link href="/shop" className="flex items-center gap-2">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="relative py-24 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src={saleBanner} alt="Sale" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Mid-Season <span className="text-primary">Blowout</span>
            </h2>
            <p className="text-xl opacity-90 mb-0 font-medium">
              Up to 50% off select hoodies, jackets, and accessories. Limited time only.
            </p>
          </div>
          <div>
            <Button size="lg" asChild className="text-lg uppercase tracking-wider font-bold h-14 px-10 rounded-none bg-white text-black hover:bg-primary hover:text-primary-foreground border-none">
              <Link href="/shop?onSale=true">Shop Sale</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
