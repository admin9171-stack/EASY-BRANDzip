import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { useGetProduct, getGetProductQueryKey, useAddCartItem, getGetCartQueryKey, useGetWishlist, getGetWishlistQueryKey, useAddWishlistItem, useRemoveWishlistItem } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Heart, Share2, Ruler, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useGetProduct(productId, { 
    query: { queryKey: getGetProductQueryKey(productId), enabled: !isNaN(productId) } 
  });
  
  const { data: wishlist } = useGetWishlist({ query: { queryKey: getGetWishlistQueryKey() } });
  const isInWishlist = wishlist?.items.some((item) => item.productId === productId);

  const addCartMutation = useAddCartItem();
  const addWishlistMutation = useAddWishlistItem();
  const removeWishlistMutation = useRemoveWishlistItem();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 aspect-[3/4] bg-muted animate-pulse" />
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-8 bg-muted animate-pulse w-3/4" />
            <div className="h-6 bg-muted animate-pulse w-1/4" />
            <div className="h-32 bg-muted animate-pulse w-full" />
            <div className="h-12 bg-muted animate-pulse w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Product Not Found</h1>
          <Button asChild variant="outline" className="rounded-none">
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addCartMutation.mutate(
      { data: { productId, quantity } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({
            title: "Added to cart",
            description: `${quantity}x ${product.name} added to your cart.`,
          });
          setQuantity(1);
        }
      }
    );
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeWishlistMutation.mutate(
        { productId },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() }) }
      );
    } else {
      addWishlistMutation.mutate(
        { data: { productId } },
        { 
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
            toast({ title: "Added to wishlist" });
          }
        }
      );
    }
  };

  return (
    <Layout>
      <div className="bg-muted/30 py-4 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Image */}
          <div className="w-full md:w-1/2 relative bg-muted group">
            {product.isOnSale && (
              <Badge className="absolute left-6 top-6 z-10 bg-primary text-primary-foreground font-display font-bold uppercase pointer-events-none rounded-none text-sm px-3 py-1">
                Sale
              </Badge>
            )}
            {product.badge && !product.isOnSale && (
              <Badge className="absolute left-6 top-6 z-10 bg-secondary text-secondary-foreground font-display font-bold uppercase pointer-events-none rounded-none text-sm px-3 py-1">
                {product.badge}
              </Badge>
            )}
            <img 
              src={product.image || "https://placehold.co/800x1000/eeeeee/999999?text=No+Image"} 
              alt={product.name}
              className="w-full h-auto object-cover border"
            />
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 flex flex-col justify-start">
            <div className="mb-6">
              <Link href={`/shop?category=${product.category}`} className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-2 inline-block hover:text-primary transition-colors">
                {product.category}
              </Link>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-4 text-foreground">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-2xl">
                {product.originalPrice ? (
                  <>
                    <span className="font-black text-primary">${product.price.toFixed(2)}</span>
                    <span className="font-bold text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="font-black">${product.price.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="prose prose-sm md:prose-base prose-neutral dark:prose-invert mb-8 max-w-none">
              <p>{product.description}</p>
            </div>

            <div className="h-px w-full bg-border mb-8" />

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="font-display font-bold uppercase tracking-wider text-sm">Quantity</span>
                {!product.inStock && (
                  <span className="text-destructive font-bold text-sm uppercase tracking-wider">Out of Stock</span>
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex items-center border h-14 w-32">
                  <button 
                    className="flex-1 h-full flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || !product.inStock}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold">{quantity}</span>
                  <button 
                    className="flex-1 h-full flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <Button 
                  size="lg" 
                  className="flex-1 rounded-none uppercase tracking-wider font-bold h-14 text-lg"
                  onClick={handleAddToCart}
                  disabled={addCartMutation.isPending || !product.inStock}
                >
                  {addCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <Button 
                variant="outline" 
                className={`flex-1 rounded-none uppercase tracking-wider font-bold h-12 border-2 ${isInWishlist ? "border-primary text-primary" : ""}`}
                onClick={handleToggleWishlist}
                disabled={addWishlistMutation.isPending || removeWishlistMutation.isPending}
              >
                <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? "fill-primary" : ""}`} />
                {isInWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
              </Button>
              <Button variant="outline" size="icon" className="rounded-none border-2 h-12 w-12 shrink-0">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full" defaultValue="details">
              <AccordionItem value="details" className="border-b-2">
                <AccordionTrigger className="font-display font-bold uppercase tracking-wider hover:no-underline">
                  Product Details
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Premium quality materials</li>
                    <li>Designed in Sylhet, Bangladesh</li>
                    <li>Machine wash cold, do not tumble dry</li>
                    <li>Model is 6'1" wearing size L</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-b-2">
                <AccordionTrigger className="font-display font-bold uppercase tracking-wider hover:no-underline">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Shipping & Returns
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Free standard shipping on all orders over $100. Deliveries usually take 3-5 business days. 
                  Returns are accepted within 30 days of purchase for items in original condition with tags attached.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="size" className="border-b-2 border-b-transparent">
                <AccordionTrigger className="font-display font-bold uppercase tracking-wider hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Size Guide
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our products generally fit true to size. If you prefer an oversized fit, we recommend sizing up.
                  Refer to our comprehensive size chart for detailed measurements.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </Layout>
  );
}
