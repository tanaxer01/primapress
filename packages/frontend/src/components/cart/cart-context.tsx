"use client";

import type React from "react";
import {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} from "@/lib/shopify/types";

type UpdateType = "plus" | "minus" | "delete";

type CartContextType = {
  cart: Cart;
  open: boolean;
  toggleSheet: () => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  setCart: (cart: Cart) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItemInList(
  item: CartItem,
  updateType: UpdateType,
): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString(),
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

function updateCartTotals(
  lines: CartItem[],
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "CLP";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "CLP" },
      totalAmount: { amount: "0", currencyCode: "CLP" },
      totalTaxAmount: { amount: "0", currencyCode: "CLP" },
    },
  };
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  // Unwrap server promise — safe because layout wraps this in <Suspense>
  const serverCart = use(cartPromise);

  // Single source of truth for cart state, shared by all consumers
  const [cart, setCartState] = useState<Cart>(
    () => serverCart || createEmptyCart(),
  );
  const [open, setOpen] = useState(false);

  // Sync from server when the resolved server cart changes (e.g. navigation)
  useEffect(() => {
    if (serverCart) {
      setCartState(serverCart);
    }
  }, [serverCart]);

  const toggleSheet = useCallback(() => setOpen((prev) => !prev), []);

  const addCartItem = useCallback(
    (variant: ProductVariant, product: Product) => {
      setCartState((currentCart) => {
        const existingItem = currentCart.lines.find(
          (item) => item.merchandise.id === variant.id,
        );
        const updatedItem = createOrUpdateCartItem(
          existingItem,
          variant,
          product,
        );

        const updatedLines = existingItem
          ? currentCart.lines.map((item) =>
              item.merchandise.id === variant.id ? updatedItem : item,
            )
          : [...currentCart.lines, updatedItem];

        return {
          ...currentCart,
          ...updateCartTotals(updatedLines),
          lines: updatedLines,
        };
      });
    },
    [],
  );

  const updateCartItem = useCallback(
    (merchandiseId: string, updateType: UpdateType) => {
      setCartState((currentCart) => {
        const updatedLines = currentCart.lines
          .map((item) =>
            item.merchandise.id === merchandiseId
              ? updateCartItemInList(item, updateType)
              : item,
          )
          .filter(Boolean) as CartItem[];

        if (updatedLines.length === 0) {
          return {
            ...currentCart,
            lines: [],
            totalQuantity: 0,
            cost: {
              ...currentCart.cost,
              totalAmount: { ...currentCart.cost.totalAmount, amount: "0" },
            },
          };
        }

        return {
          ...currentCart,
          ...updateCartTotals(updatedLines),
          lines: updatedLines,
        };
      });
    },
    [],
  );

  const setCart = useCallback((newCart: Cart) => {
    setCartState(newCart);
  }, []);

  const value = useMemo(
    () => ({
      cart,
      open,
      toggleSheet,
      addCartItem,
      updateCartItem,
      setCart,
    }),
    [cart, open, toggleSheet, addCartItem, updateCartItem, setCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
