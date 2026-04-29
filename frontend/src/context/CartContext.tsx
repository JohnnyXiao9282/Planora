import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  template_id: string;
  name: string;
  description: string;
  price: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (template_id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch cart from backend on mount
  React.useEffect(() => {
    fetch("http://localhost:5050/cart", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCart(data || []))
      .catch(() => setCart([]));
  }, []);

  const addToCart = (item: CartItem) => {
    fetch("http://localhost:5050/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: item.template_id }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        // Always re-fetch cart from backend after add
        fetch("http://localhost:5050/cart", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => setCart(data || []))
          .catch(() => setCart([]));
      })
      .catch(() => setCart([]));
  };

  const removeFromCart = (template_id: string) => {
    fetch("http://localhost:5050/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        // Always re-fetch cart from backend after remove
        fetch("http://localhost:5050/cart", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => setCart(data || []))
          .catch(() => setCart([]));
      })
      .catch(() =>
        setCart((prev) => prev.filter((t) => t.template_id !== template_id))
      );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
