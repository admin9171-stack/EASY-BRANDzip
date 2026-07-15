import { Link, useLocation } from "wouter";
import { Search, Menu, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniCart } from "../MiniCart";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetWishlist, getGetWishlistQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: wishlist } = useGetWishlist({ query: { queryKey: getGetWishlistQueryKey() } });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Contact Us", href: "#contact", onClick: () => {
        if (location !== "/") setLocation("/");
        setTimeout(() => {
          document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } 
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      {/* Top Bar */}
      <div className="bg-secondary text-secondary-foreground py-2 px-4 text-xs font-semibold text-center tracking-wider uppercase">
        Free shipping on all orders over $100! Shop Now
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4 md:gap-8">
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full py-6">
                <Link href="/" className="font-display font-black text-2xl tracking-tighter uppercase mb-8">
                  Easy<span className="text-primary">-</span>Brand
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    link.onClick ? (
                      <button key={link.label} onClick={link.onClick} className="text-lg font-display uppercase font-bold text-left hover:text-primary transition-colors">
                        {link.label}
                      </button>
                    ) : (
                      <Link key={link.label} href={link.href} className="text-lg font-display uppercase font-bold hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    )
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="font-display font-black text-2xl md:text-3xl tracking-tighter uppercase text-foreground">
              Easy<span className="text-primary">-</span>Brand
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-display uppercase font-bold text-sm tracking-widest">
            {navLinks.map((link) => (
              link.onClick ? (
                <button key={link.label} onClick={link.onClick} className="text-foreground hover:text-primary transition-colors">
                  {link.label}
                </button>
              ) : (
                <Link key={link.label} href={link.href} className={`text-foreground hover:text-primary transition-colors ${location === link.href ? "text-primary" : ""}`}>
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none justify-end">
            <form onSubmit={handleSearch} className="hidden lg:flex relative group items-center">
              <Input 
                type="search" 
                placeholder="Search..." 
                className="w-[200px] rounded-none bg-muted border-transparent focus-visible:ring-primary h-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 text-muted-foreground group-hover:text-primary transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </form>

            <button className="p-2 text-secondary hover:text-primary transition-colors lg:hidden">
              <Search className="h-5 w-5" />
            </button>
            
            <button className="relative p-2 text-secondary hover:text-primary transition-colors hidden sm:block">
              <Heart className="h-5 w-5" />
              {wishlist && wishlist.itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-secondary text-secondary-foreground rounded-full border-none">
                  {wishlist.itemCount}
                </Badge>
              )}
            </button>
            
            <button className="p-2 text-secondary hover:text-primary transition-colors hidden sm:block">
              <User className="h-5 w-5" />
            </button>
            
            <MiniCart />
          </div>
        </div>
      </div>
    </header>
  );
}
