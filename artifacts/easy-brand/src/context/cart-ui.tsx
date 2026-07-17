import { createContext, useContext, useState, type ReactNode } from "react";

interface CartUIContextValue {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setIsOpen: (open: boolean) => void;
}

const CartUIContext = createContext<CartUIContextValue | null>(null);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <CartUIContext.Provider
      value={{
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        setIsOpen,
      }}
    >
      {children}
    </CartUIContext.Provider>
  );
}

export function useCartUI() {
  const ctx = useContext(CartUIContext);
  if (!ctx) throw new Error("useCartUI must be inside CartUIProvider");
  return ctx;
}
