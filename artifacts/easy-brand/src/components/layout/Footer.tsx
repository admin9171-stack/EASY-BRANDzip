import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="footer" className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <Link href="/" className="font-display font-black text-3xl tracking-tighter uppercase text-white mb-6 inline-block">
              Easy<span className="text-primary">-</span>Brand
            </Link>
            <p className="text-secondary-foreground/70 mb-6 text-sm leading-relaxed max-w-sm">
              Premium men's fashion based in Sylhet, Bangladesh. Confident, fashion-forward, and direct. Shop the latest streetwear trends today.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold uppercase tracking-wider mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-4 text-sm text-secondary-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Zindabazar, Sylhet,<br />Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+880-456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>easybrand@support.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold uppercase tracking-wider mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/80 font-medium">
              <li><Link href="/shop" className="hover:text-primary transition-colors inline-block">Shop All</Link></li>
              <li><Link href="/shop?category=hoodies" className="hover:text-primary transition-colors inline-block">Hoodies & Sweatshirts</Link></li>
              <li><Link href="/shop?category=jackets" className="hover:text-primary transition-colors inline-block">Jackets</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors inline-block">Shopping Cart</Link></li>
              <li><Link href="/shop?onSale=true" className="hover:text-primary transition-colors inline-block">Sale Items</Link></li>
            </ul>
          </div>

          {/* Download App / Payments */}
          <div>
            <h4 className="font-display font-bold uppercase tracking-wider mb-6 text-lg">Download App</h4>
            <p className="text-sm text-secondary-foreground/70 mb-4">Get access to exclusive offers and drops.</p>
            <div className="flex flex-wrap gap-3 mb-8">
              <button className="bg-black border border-white/20 px-4 py-2 flex items-center gap-2 hover:border-primary transition-colors">
                <div className="w-5 h-5 bg-white/20 rounded-full shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] leading-none text-white/70">Download on the</div>
                  <div className="text-xs font-bold leading-tight">App Store</div>
                </div>
              </button>
              <button className="bg-black border border-white/20 px-4 py-2 flex items-center gap-2 hover:border-primary transition-colors">
                <div className="w-5 h-5 bg-white/20 rounded-full shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] leading-none text-white/70">GET IT ON</div>
                  <div className="text-xs font-bold leading-tight">Google Play</div>
                </div>
              </button>
            </div>
            
            <h4 className="font-display font-bold uppercase tracking-wider mb-4 text-sm">Secure Payments</h4>
            <div className="flex flex-wrap gap-2">
              {['Visa', 'MasterCard', 'PayPal', 'Stripe', 'Amex'].map((brand) => (
                <div key={brand} className="bg-white text-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-white/20">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary-foreground/60 font-medium">
          <p>© {new Date().getFullYear()} Easy-Brand. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
