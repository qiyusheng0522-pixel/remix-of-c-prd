import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  emoji?: string;
  tag?: string;
  qty: number;
};

const KEY = "station-cart-v1";
const EVT = "station-cart-change";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function useStationCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const onChange = () => setItems(read());
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = (item: Omit<CartItem, "qty">) => {
    const cur = read();
    const idx = cur.findIndex((c) => c.id === item.id);
    if (idx >= 0) cur[idx].qty += 1;
    else cur.push({ ...item, qty: 1 });
    write(cur);
  };

  const setQty = (id: string, qty: number) => {
    const cur = read()
      .map((c) => (c.id === id ? { ...c, qty } : c))
      .filter((c) => c.qty > 0);
    write(cur);
  };

  const remove = (id: string) => {
    write(read().filter((c) => c.id !== id));
  };

  const clear = () => write([]);

  const count = items.reduce((n, c) => n + c.qty, 0);
  const total = items.reduce((n, c) => n + c.qty * c.price, 0);

  return { items, add, setQty, remove, clear, count, total };
}