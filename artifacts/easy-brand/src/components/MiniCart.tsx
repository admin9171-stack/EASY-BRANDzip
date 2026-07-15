import { useGetCart, getGetCartQueryKey, useRemoveCartItem, useUpdateCartItem } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function MiniCart() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: cart } = useGetCart({ query: { queryKey: getGetCartQueryKey() } });
  
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    updateItemMutation.mutate(
      { productId, data: { quantity } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        }
      }
    );
  };

  const handleRemove = (productId: number) => {
    removeItemMutation.mutate(
      { productId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        }
      }
    );
  };

  const itemCount = cart?.itemCount || 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 text-secondary hover:text-primary transition-colors">
          <ShoppingBag className="w-5 h-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground rounded-full border-none">
              {itemCount}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b text-left">
          <SheetTitle className="font-display uppercase tracking-wider flex items-center gap-2">
            Shopping Cart <Badge variant="secondary" className="rounded-none">{itemCount}</Badge>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1 p-6">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
              <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-display uppercase tracking-wide">Your cart is empty</p>
              <Button asChild variant="link" className="mt-2 text-primary">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-4 group">
                  <div className="w-20 h-24 bg-muted overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.image || "https://placehold.co/100x120/eeeeee/999999"} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/product/${item.productId}`} className="font-display font-semibold hover:text-primary text-sm transition-colors">
                          {item.product.name}
                        </Link>
                        <div className="text-sm font-bold mt-1 text-primary">${item.product.price.toFixed(2)}</div>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.productId)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center border">
                        <button 
                          className="px-2 py-1 hover:bg-muted transition-colors disabled:opacity-50"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateItemMutation.isPending}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 hover:bg-muted transition-colors disabled:opacity-50"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={updateItemMutation.isPending}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {cart && cart.items.length > 0 && (
          <div className="p-6 border-t bg-muted/30">
            <div className="flex items-center justify-between mb-4 text-sm font-medium">
              <span className="uppercase text-muted-foreground">Subtotal</span>
              <span className="font-bold text-lg">${cart.subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Shipping and taxes calculated at checkout.</p>
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full rounded-none" size="lg">
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-none" size="lg">
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
