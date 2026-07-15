import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { CheckCircle2, ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmation({ params }: { params: { orderNumber: string } }) {
  const orderNum = parseInt(params.orderNumber);
  
  const { data: order, isLoading } = useGetOrder(orderNum, {
    query: { queryKey: getGetOrderQueryKey(orderNum), enabled: !isNaN(orderNum) }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">We couldn't find an order matching that number.</p>
          <Button asChild variant="outline" className="rounded-none">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const paymentMethods: Record<string, string> = {
    bank_transfer: "Direct Bank Transfer",
    check: "Check Payment",
    cash_on_delivery: "Cash on Delivery"
  };

  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-16 lg:py-24 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Order <span className="text-primary">Received</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-lg mx-auto">
            Thank you. Your order has been received and is now being processed.
          </p>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y py-8 mb-12">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Number</span>
            <span className="font-display font-black text-lg">#{order.orderNumber}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</span>
            <span className="font-display font-black text-lg">{formattedDate}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total</span>
            <span className="font-display font-black text-lg text-primary">${order.total.toFixed(2)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Method</span>
            <span className="font-display font-black text-lg truncate" title={paymentMethods[order.paymentMethod] || order.paymentMethod}>
              {paymentMethods[order.paymentMethod] || order.paymentMethod}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Order Details */}
          <div className="md:col-span-2">
            <h2 className="font-display font-black text-2xl uppercase tracking-tighter mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" /> Order Details
            </h2>
            <div className="border border-border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <div className="col-span-8">Product</div>
                <div className="col-span-4 text-right">Total</div>
              </div>
              
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.productId} className="grid grid-cols-12 gap-4 p-4 items-center">
                    <div className="col-span-8">
                      <Link href={`/product/${item.productId}`} className="font-bold hover:text-primary transition-colors">
                        {item.productName}
                      </Link>
                      <span className="text-muted-foreground font-bold ml-2">× {item.quantity}</span>
                    </div>
                    <div className="col-span-4 text-right font-bold">
                      ${item.lineTotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-muted/10 border-t space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span className="font-bold text-foreground">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping:</span>
                  <span className="font-bold text-foreground">Free shipping</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Payment method:</span>
                  <span className="font-bold text-foreground">{paymentMethods[order.paymentMethod] || order.paymentMethod}</span>
                </div>
                <div className="pt-3 mt-3 border-t flex justify-between items-center text-lg">
                  <span className="font-display font-black uppercase tracking-wider">Total:</span>
                  <span className="font-black text-primary">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-black text-xl uppercase tracking-tighter mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Billing Address
              </h2>
              <div className="p-5 border bg-muted/5 text-sm space-y-1">
                <p className="font-bold text-base">{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                {order.billingAddress.company && <p>{order.billingAddress.company}</p>}
                <p>{order.billingAddress.address}</p>
                <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                <p>{order.billingAddress.country}</p>
                <p className="pt-3 mt-3 border-t font-medium"><span className="text-muted-foreground">Phone:</span> {order.billingAddress.phone}</p>
                <p className="font-medium"><span className="text-muted-foreground">Email:</span> {order.email}</p>
              </div>
            </div>
            
            {order.note && (
              <div>
                <h2 className="font-display font-black text-xl uppercase tracking-tighter mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Order Notes
                </h2>
                <div className="p-5 border bg-muted/5 text-sm italic text-muted-foreground">
                  "{order.note}"
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" className="rounded-none uppercase tracking-wider font-bold">
            <Link href="/shop" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </Button>
        </div>

      </div>
    </Layout>
  );
}
