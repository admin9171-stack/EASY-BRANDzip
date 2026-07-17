import { Product } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useAddCartItem, getGetCartQueryKey, useAddWishlistItem, useRemoveWishlistItem, useGetWishlist, getGetWishlistQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useCartUI } from "@/context/cart-ui";

export function ProductCard({ product }: { product: Product }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { openCart } = useCartUI();

  const { data: wishlist } = useGetWishlist({ query: { queryKey: getGetWishlistQueryKey() } });
  const isInWishlist = wishlist?.items.some((item) => item.productId === product.id);

  const addCartMutation = useAddCartItem();
  const addWishlistMutation = useAddWishlistItem();
  const removeWishlistMutation = useRemoveWishlistItem();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addCartMutation.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          openCart();
        },
        onError: () => {
          toast({
            title: "Couldn't add to cart",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeWishlistMutation.mutate(
        { productId: product.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
          },
        }
      );
    } else {
      addWishlistMutation.mutate(
        { data: { productId: product.id } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
            toast({
              title: "Added to wishlist",
              description: `${product.name} was added to your wishlist.`,
            });
          },
        }
      );
    }
  };

  return (
    <div className="group relative flex flex-col block overflow-hidden bg-card transition-all duration-300 hover:shadow-lg border border-transparent hover:border-border">
      {/* Full-card link — lowest layer */}
      <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
        <span className="sr-only">View {product.name}</span>
      </Link>

      {/* Badges */}
      {product.isOnSale && (
        <Badge className="absolute left-3 top-3 z-10 bg-primary text-primary-foreground font-display font-bold uppercase pointer-events-none rounded-none">
          Sale
        </Badge>
      )}
      {product.badge && !product.isOnSale && (
        <Badge className="absolute left-3 top-3 z-10 bg-secondary text-secondary-foreground font-display font-bold uppercase pointer-events-none rounded-none">
          {product.badge}
        </Badge>
      )}

      {/* Wishlist button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute right-3 top-3 z-20 p-2 bg-background/80 backdrop-blur hover:bg-primary hover:text-primary-foreground transition-colors border shadow-sm text-foreground disabled:opacity-50"
        disabled={addWishlistMutation.isPending || removeWishlistMutation.isPending}
        aria-label="Toggle wishlist"
      >
        <Heart className={`w-4 h-4 ${isInWishlist ? "fill-primary text-primary hover:text-primary-foreground hover:fill-primary-foreground" : ""}`} />
      </button>

      {/*
        Image area — two layers:
          1. Inner div with overflow-hidden handles the zoom-on-hover crop
          2. The Add-to-Cart overlay sits OUTSIDE the overflow-hidden so it is
             never clipped and always receives pointer events
      */}
      <div className="aspect-[3/4] w-full relative">
        {/* Image with its own clip so object-cover + scale works */}
        <div className="absolute inset-0 overflow-hidden bg-muted pointer-events-none">
          <img
            src={product.image || "https://placehold.co/600x800/eeeeee/999999?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Add-to-Cart overlay — outside overflow-hidden, always clickable */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
          <Button
            className="w-full font-display font-bold uppercase tracking-wider disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={addCartMutation.isPending || !product.inStock}
          >
            {addCartMutation.isPending ? "Adding..." : (product.inStock ? "Add to Cart" : "Out of Stock")}
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-1 pointer-events-none">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">{product.category}</div>
        <h3 className="font-display font-semibold text-base mb-2 group-hover:text-primary transition-colors flex-1">{product.name}</h3>

        <div className="flex items-center gap-2 mt-auto">
          {product.originalPrice ? (
            <>
              <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-bold">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
