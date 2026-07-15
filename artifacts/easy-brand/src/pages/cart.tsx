import { Layout } from "@/components/layout/Layout";
import { Link, useLocation } from "wouter";
import { useGetCart, getGetCartQueryKey, useUpdateCartItem, useRemoveCartItem } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Cart() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useGetCart({ query: { queryKey: getGetCartQueryKey() } });
  
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

  return (
    <Layout>
      <div className="bg-muted py-12 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Shopping Cart
          </h1>
          <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground font-medium uppercase tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Cart</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20">
        {isLoading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="py-24 text-center border bg-muted/30 max-w-3xl mx-auto flex flex-col items-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-6 opacity-20" />
            <h2 className="font-display font-black text-3xl uppercase tracking-tighter mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild size="lg" className="rounded-none uppercase tracking-wider font-bold h-14 px-8">
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Cart Items */}
            <div className="flex-1 w-full">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <div className="flex flex-col gap-6 md:gap-0">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex flex-col md:grid md:grid-cols-12 items-center gap-4 py-6 border-b relative group">
                    {/* Mobile Remove (absolute top right) */}
                    <button 
                      onClick={() => handleRemove(item.productId)}
                      className="md:hidden absolute top-6 right-0 text-muted-foreground hover:text-destructive p-2 z-10"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Product Info */}
                    <div className="col-span-6 flex gap-4 w-full md:w-auto items-center">
                      <div className="w-24 h-32 md:w-20 md:h-24 bg-muted shrink-0 overflow-hidden">
                        <img 
                          src={item.product.image || "https://placehold.co/100x120/eeeeee/999999"} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
                          {item.product.category}
                        </span>
                        <Link href={`/product/${item.productId}`} className="font-display font-bold text-lg md:text-base hover:text-primary transition-colors">
                          {item.product.name}
                        </Link>
                        {/* Mobile Price */}
                        <div className="md:hidden mt-2 font-bold text-primary">
                          ${item.product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop Price */}
                    <div className="col-span-2 hidden md:block text-center font-bold">
                      ${item.product.price.toFixed(2)}
                    </div>
                    
                    {/* Quantity */}
                    <div className="col-span-12 md:col-span-2 flex justify-start md:justify-center w-full md:w-auto">
                      <div className="flex items-center border">
                        <button 
                          className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateItemMutation.isPending}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold">{item.quantity}</span>
                        <button 
                          className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={updateItemMutation.isPending}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Total & Desktop Remove */}
                    <div className="col-span-12 md:col-span-2 flex justify-between md:justify-end items-center w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-4 md:mt-0">
                      <span className="md:hidden text-sm font-bold uppercase text-muted-foreground">Subtotal:</span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg text-primary">${item.lineTotal.toFixed(2)}</span>
                        <button 
                          onClick={() => handleRemove(item.productId)}
                          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Form (UI Only) */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md">
                <Input placeholder="Coupon code" className="rounded-none h-12 bg-muted/50 border-border focus-visible:ring-primary" />
                <Button variant="outline" className="rounded-none h-12 uppercase tracking-wider font-bold border-2">
                  Apply Coupon
                </Button>
              </div>
            </div>

            {/* Cart Totals Sidebar */}
            <div className="w-full lg:w-[380px] shrink-0 border bg-muted/10 p-6 md:p-8">
              <h2 className="font-display font-black text-2xl uppercase tracking-tighter mb-6 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-display font-bold uppercase tracking-wider">Estimated Total</span>
                  <span className="font-black text-2xl text-primary">${cart.total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button asChild size="lg" className="w-full rounded-none uppercase tracking-wider font-bold h-14 group">
                <Link href="/checkout" className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <div className="mt-6 flex flex-wrap gap-2 justify-center opacity-50 grayscale">
                {['Visa', 'MasterCard', 'PayPal', 'Stripe'].map((brand) => (
                  <div key={brand} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider border">
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
