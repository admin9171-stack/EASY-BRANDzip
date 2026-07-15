import { Layout } from "@/components/layout/Layout";
import { Link, useLocation } from "wouter";
import { useGetCart, getGetCartQueryKey, usePlaceOrder } from "@workspace/api-client-react";
type OrderInputPaymentMethod = "bank_transfer" | "check" | "cash_on_delivery";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, CheckCircle2 } from "lucide-react";

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  company: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Region is required"),
  zipCode: z.string().min(3, "ZIP/Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(5, "Phone number is required"),
  note: z.string().optional(),
  paymentMethod: z.enum(["bank_transfer", "check", "cash_on_delivery"]),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useGetCart({ query: { queryKey: getGetCartQueryKey() } });
  
  const placeOrderMutation = usePlaceOrder();

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phone: "",
      note: "",
      paymentMethod: "cash_on_delivery", // Default selected
    },
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

  if (!cart || cart.items.length === 0) {
    return (
      <Layout>
        <div className="py-32 text-center border-b bg-muted/30">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
          <h1 className="font-display font-black text-3xl uppercase tracking-tighter mb-4">Checkout Unavailable</h1>
          <p className="text-muted-foreground mb-8">Your cart is empty. Please add items before checking out.</p>
          <Button asChild size="lg" className="rounded-none uppercase tracking-wider font-bold">
            <Link href="/shop">Return to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const onSubmit = (data: CheckoutValues) => {
    placeOrderMutation.mutate(
      {
        data: {
          email: data.email,
          billingAddress: {
            firstName: data.firstName,
            lastName: data.lastName,
            company: data.company || null,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country,
            phone: data.phone,
          },
          paymentMethod: data.paymentMethod as OrderInputPaymentMethod,
          note: data.note || null,
          items: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }
      },
      {
        onSuccess: (order) => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          setLocation(`/order-confirmation/${order.orderNumber}`);
        }
      }
    );
  };

  return (
    <Layout>
      <div className="bg-muted py-10 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">Checkout</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-foreground">Checkout</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Form Section */}
            <div className="flex-1 w-full space-y-12">
              
              {/* Contact */}
              <section>
                <h2 className="font-display font-black text-2xl uppercase tracking-tighter mb-6 border-b pb-4">Contact Information</h2>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase tracking-wider text-xs font-bold">Email Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" className="rounded-none h-12 bg-muted/30 focus-visible:bg-transparent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Billing Address */}
              <section>
                <h2 className="font-display font-black text-2xl uppercase tracking-tighter mb-6 border-b pb-4">Billing Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-wider text-xs font-bold">First Name *</FormLabel>
                        <FormControl>
                          <Input className="rounded-none h-12 bg-muted/30 focus-visible:bg-transparent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-wider text-xs font-bold">Last Name *</FormLabel>
                        <FormControl>
                          <Input className="rounded-none h-12 bg-muted/30 focus-visible:bg-transparent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="uppercase tracking-wider text-xs font-bold">Company Name (Optional)</FormLabel>
                        <FormControl>
                          <Input className="rounded-none h-12 bg-muted/30 focus-visible:bg-transparent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="uppercase tracking-wider text-xs font-bold">Country / Region *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Bangladesh" className="rounded-none h-12 bg-muted/30 focus-visible:bg-transparent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="uppercase tracking-wider text-xs font-bold">Street Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="House number and street name" className="rounded-none h-12 bg-muted/30 focus-visible:bg-transparent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-wider text-xs font-bold">Town / City *</FormLabel>
                        <FormControl>
                          <Input className="rounded-none h-12 bg-muted/30 focus-visible:bg-transparent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-wider text-xs font-bold">State / County *</FormLabel>
                        <FormControl>
                          <Input className="rounded-none h-12 bg-muted/30 focus-visible:bg-transparent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-wider text-xs font-bold">Postcode / ZIP *</FormLabel>
                        <FormControl>
                          <Input className="rounded-none h-12 bg-muted/30 focus-visible:bg-transparent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-wider text-xs font-bold">Phone *</FormLabel>
                        <FormControl>
                          <Input className="rounded-none h-12 bg-muted/30 focus-visible:bg-transparent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Additional Information */}
              <section>
                <h2 className="font-display font-black text-2xl uppercase tracking-tighter mb-6 border-b pb-4">Additional Info</h2>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase tracking-wider text-xs font-bold">Order Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Notes about your order, e.g. special notes for delivery." 
                          className="rounded-none min-h-[120px] bg-muted/30 focus-visible:bg-transparent resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            </div>

            {/* Sidebar Summary & Payment */}
            <div className="w-full lg:w-[420px] shrink-0 space-y-8">
              
              <div className="border border-border p-6 md:p-8 bg-card shadow-sm relative">
                {/* Decorative cut corners logic could go here via CSS, keeping it sharp */}
                <h2 className="font-display font-black text-2xl uppercase tracking-tighter mb-6 border-b pb-4">Your Order</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <div className="flex gap-2 text-muted-foreground">
                        <span>{item.product.name}</span>
                        <span className="font-bold text-foreground">× {item.quantity}</span>
                      </div>
                      <span className="font-bold text-foreground">${item.lineTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3 text-sm mb-6 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-foreground">${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-primary font-bold">Free</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-display font-bold uppercase tracking-wider">Total</span>
                    <span className="font-black text-3xl text-primary">${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg uppercase tracking-wider mb-4">Payment Method</h3>
                
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-0 mb-8">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-start space-x-3 p-4 border relative data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 transition-colors">
                            <RadioGroupItem value="bank_transfer" id="bank" className="mt-1" />
                            <div className="grid gap-1.5">
                              <Label htmlFor="bank" className="font-bold uppercase tracking-wider cursor-pointer">Direct Bank Transfer</Label>
                              <p className="text-xs text-muted-foreground">Make your payment directly into our bank account. Your order will not be shipped until the funds have cleared.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-4 border relative data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 transition-colors">
                            <RadioGroupItem value="check" id="check" className="mt-1" />
                            <div className="grid gap-1.5">
                              <Label htmlFor="check" className="font-bold uppercase tracking-wider cursor-pointer">Check Payments</Label>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-4 border relative data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 transition-colors">
                            <RadioGroupItem value="cash_on_delivery" id="cod" className="mt-1" />
                            <div className="grid gap-1.5">
                              <Label htmlFor="cod" className="font-bold uppercase tracking-wider cursor-pointer">Cash on Delivery</Label>
                              <p className="text-xs text-muted-foreground">Pay with cash upon delivery.</p>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full rounded-none uppercase tracking-widest font-black h-16 text-lg relative overflow-hidden group"
                  disabled={placeOrderMutation.isPending}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {placeOrderMutation.isPending ? "Processing..." : "Place Order"}
                    {!placeOrderMutation.isPending && <CheckCircle2 className="w-5 h-5" />}
                  </span>
                  <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                </Button>
                
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                </p>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
