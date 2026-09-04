export type MerchCartItem = {
  productId: string;
  variantId: number;
  quantity: number;
  title: string;
  variantTitle: string;
  imageUrl?: string;
  unitAmount: number;
  artistId?: string;
  artistName?: string;
};

const STORAGE_KEY = "sdr-merch-cart";

function readCart(): MerchCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: MerchCartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("sdr-merch-cart"));
}

export function getMerchCart(): MerchCartItem[] {
  return readCart();
}

export function getMerchCartCount(): number {
  return readCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function addMerchCartItem(item: MerchCartItem) {
  const cart = readCart();
  const index = cart.findIndex(
    (entry) =>
      entry.productId === item.productId && entry.variantId === item.variantId,
  );
  if (index >= 0) {
    cart[index] = {
      ...cart[index],
      quantity: cart[index].quantity + item.quantity,
    };
  } else {
    cart.push(item);
  }
  writeCart(cart);
}

export function updateMerchCartQuantity(
  productId: string,
  variantId: number,
  quantity: number,
) {
  const cart = readCart()
    .map((item) =>
      item.productId === productId && item.variantId === variantId
        ? { ...item, quantity }
        : item,
    )
    .filter((item) => item.quantity > 0);
  writeCart(cart);
}

export function removeMerchCartItem(productId: string, variantId: number) {
  writeCart(
    readCart().filter(
      (item) => !(item.productId === productId && item.variantId === variantId),
    ),
  );
}

export function clearMerchCart() {
  writeCart([]);
}

export function formatMerchMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
