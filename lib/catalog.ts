import { connection } from "next/server";
import type { Prisma } from "@prisma/client";

import type { Collection } from "@/data/collections";
import type { Product } from "@/data/products";
import { db } from "./db";
import { parseList } from "./json-list";

const productInclude = { category: true, type: true } as const;
const collectionInclude = {
  category: true,
  items: { orderBy: { sort: "asc" as const } },
} as const;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;
type CollectionRow = Prisma.CollectionGetPayload<{ include: typeof collectionInclude }>;

function toProduct(p: ProductRow): Product {
  const images = parseList(p.images);

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    image: p.image,
    images: images.length ? images : undefined,
    category: p.category.slug,
    type: p.type?.slug ?? "",
    description: p.description,
    features: parseList(p.features),
  };
}

function toCollection(c: CollectionRow): Collection {
  const partImages: Record<number, string> = {};
  for (const it of c.items) if (it.image) partImages[it.productId] = it.image;

  return {
    slug: c.slug,
    title: c.title,
    category: c.category.slug,
    image: c.image,
    banner: c.banner ?? undefined,
    description: c.description,
    itemIds: c.items.map((i) => i.productId),
    partImages: Object.keys(partImages).length ? partImages : undefined,
  };
}

// connection(): صفحه‌هایی که از دیتابیس می‌خوانند هیچ‌وقت موقع build ثابت نمی‌شوند
export async function getProducts(): Promise<Product[]> {
  await connection();
  const rows = await db.product.findMany({
    where: { active: true },
    include: productInclude,
    orderBy: { id: "asc" },
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await connection();
  const row = await db.product.findFirst({ where: { slug, active: true }, include: productInclude });
  return row ? toProduct(row) : null;
}

export async function getCollections(): Promise<Collection[]> {
  await connection();
  const rows = await db.collection.findMany({
    where: { active: true },
    include: collectionInclude,
    orderBy: [{ sort: "asc" }, { id: "asc" }],
  });
  return rows.map(toCollection);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  await connection();
  const row = await db.collection.findFirst({ where: { slug, active: true }, include: collectionInclude });
  return row ? toCollection(row) : null;
}