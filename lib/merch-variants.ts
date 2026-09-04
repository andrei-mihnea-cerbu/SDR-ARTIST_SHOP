import type { PrintifyProduct, PrintifyProductOption } from "@/types";

export type MerchColor = {
  key: string;
  title: string;
  colors: string[];
  variantIds: number[];
};

export type MerchSize = {
  key: string;
  title: string;
  variantIds: number[];
};

const SIZE_RANK = [
  "xxs",
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "2xl",
  "xxl",
  "3xl",
  "xxxl",
  "4xl",
  "5xl",
  "6xl",
];

function optionByType(
  options: PrintifyProductOption[] | undefined,
  type: string,
): PrintifyProductOption | undefined {
  return (options ?? []).find(
    (option) => (option.type ?? "").toLowerCase() === type,
  );
}

function parseTitleParts(title: string): { color: string; size: string } {
  const parts = title
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return {
      color: parts.slice(0, -1).join(" / "),
      size: parts[parts.length - 1],
    };
  }
  return { color: title.trim() || "Default", size: "" };
}

function sizeRank(title: string): number {
  const key = title.trim().toLowerCase().replace(/\s+/g, "");
  const index = SIZE_RANK.indexOf(key);
  return index === -1 ? 1000 + title.length : index;
}

export function groupMerchVariants(product: PrintifyProduct): {
  colors: MerchColor[];
  sizes: MerchSize[];
} {
  const enabled = (product.variants ?? []).filter(
    (variant) => variant.is_enabled !== false,
  );
  const colorOption = optionByType(product.options, "color");
  const sizeOption = optionByType(product.options, "size");

  const colors = new Map<string, MerchColor>();
  const sizes = new Map<string, MerchSize>();

  for (const variant of enabled) {
    const colorValue = colorOption?.values?.find((value) =>
      variant.options?.includes(value.id),
    );
    const sizeValue = sizeOption?.values?.find((value) =>
      variant.options?.includes(value.id),
    );
    const parsed = parseTitleParts(variant.title ?? "");

    const colorTitle = colorValue?.title || parsed.color || "Default";
    const sizeTitle = sizeValue?.title || parsed.size || "One size";
    const colorKey = String(colorValue?.id ?? colorTitle.toLowerCase());
    const sizeKey = String(sizeValue?.id ?? sizeTitle.toLowerCase());

    const color = colors.get(colorKey) ?? {
      key: colorKey,
      title: colorTitle,
      colors: colorValue?.colors?.filter(Boolean) ?? [],
      variantIds: [],
    };
    color.variantIds.push(variant.id);
    colors.set(colorKey, color);

    const size = sizes.get(sizeKey) ?? {
      key: sizeKey,
      title: sizeTitle,
      variantIds: [],
    };
    size.variantIds.push(variant.id);
    sizes.set(sizeKey, size);
  }

  return {
    colors: [...colors.values()],
    sizes: [...sizes.values()].sort(
      (a, b) => sizeRank(a.title) - sizeRank(b.title),
    ),
  };
}

export function sizesForColor(
  sizes: MerchSize[],
  color: MerchColor | undefined,
): MerchSize[] {
  if (!color) return sizes;
  return sizes.filter((size) =>
    size.variantIds.some((id) => color.variantIds.includes(id)),
  );
}

export function variantIdForSelection(
  color: MerchColor | undefined,
  size: MerchSize | undefined,
): number | null {
  if (color && size) {
    return color.variantIds.find((id) => size.variantIds.includes(id)) ?? null;
  }
  return color?.variantIds[0] ?? size?.variantIds[0] ?? null;
}

export function imagesForColor(
  images: { src: string; variantIds: number[] }[],
  color: MerchColor | undefined,
): { src: string; variantIds: number[] }[] {
  if (!color) return [];
  const colorIds = new Set(color.variantIds);
  return images.filter((image) =>
    image.variantIds.some((id) => colorIds.has(id)),
  );
}
