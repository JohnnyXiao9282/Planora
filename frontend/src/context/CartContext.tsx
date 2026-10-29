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
  removeFromCart: (ids: string | string[]) => void;
  refreshCart: () => void;
  checkoutIds: string[];
  moveToCheckout: (ids: string[]) => void;
  moveBackToCart: (ids: string | string[]) => void;
}

const CHECKOUT_KEY = "checkoutIds";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // IDs of cart items currently placed in checkout. They stay in the server
  // cart but are hidden from the Cart page until moved back or purchased.
  const [checkoutIds, setCheckoutIds] = useState<string[]>(() => {
    try {
      const v = JSON.parse(localStorage.getItem(CHECKOUT_KEY) || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(checkoutIds));
  }, [checkoutIds]);

  const moveToCheckout = React.useCallback((ids: string[]) => {
    setCheckoutIds((prev) => Array.from(new Set([...prev, ...ids])));
  }, []);

  const moveBackToCart = React.useCallback((ids: string | string[]) => {
    const list = Array.isArray(ids) ? ids : [ids];
    setCheckoutIds((prev) => prev.filter((id) => !list.includes(id)));
  }, []);

  const refreshCart = React.useCallback(() => {
    fetch("http://localhost:5050/cart", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCart(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

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

  const removeFromCart = (ids: string | string[]) => {
    const template_ids = Array.isArray(ids) ? ids : [ids];
    if (!template_ids.length) return;
    fetch("http://localhost:5050/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_ids }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.cart)) setCart(data.cart);
        else throw new Error(data.error);
      })
      .catch(() =>
        setCart((prev) =>
          prev.filter((t) => !template_ids.includes(t.template_id))
        )
      );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        refreshCart,
        checkoutIds,
        moveToCheckout,
        moveBackToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
