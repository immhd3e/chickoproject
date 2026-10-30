import { PrismaClient } from "@prisma/client";

import { categories } from "../data/categories";
import { collections } from "../data/collections";
import { products } from "../data/products";

const db = new PrismaClient();

async function main() {
  // اگر قبلاً محصولی هست، چیزی را رونویسی نمی‌کنیم (تغییرات پنل حفظ شود)
  if ((await db.product.count()) > 0) {
    console.log("دیتابیس خالی نیست؛ seed انجام نشد.");
    return;
  }

  for (const [i, c] of categories.entries()) {
    const cat = await db.category.create({
      data: { slug: c.slug, title: c.title, description: c.description, image: c.image, sort: i },
    });
    for (const t of c.items) {
      await db.productType.create({ data: { slug: t.slug, title: t.title, categoryId: cat.id } });
    }
  }

  for (const p of products) {
    const cat = await db.category.findUniqueOrThrow({ where: { slug: p.category } });
    const type = await db.productType.findUnique({
      where: { categoryId_slug: { categoryId: cat.id, slug: p.type } },
    });

    await db.product.create({
      data: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        price: p.price,
        image: p.image,
        images: JSON.stringify(p.images ?? []),
        description: p.description,
        features: JSON.stringify(p.features),
        categoryId: cat.id,
        typeId: type?.id ?? null,
      },
    });
  }

  for (const [i, c] of collections.entries()) {
    const cat = await db.category.findUniqueOrThrow({ where: { slug: c.category } });

    await db.collection.create({
      data: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        image: c.image,
        banner: c.banner ?? null,
        sort: i,
        categoryId: cat.id,
        items: {
          create: c.itemIds.map((productId, k) => ({
            productId,
            sort: k,
            image: c.partImages?.[productId] ?? null,
          })),
        },
      },
    });
  }

  console.log(`ثبت شد: ${products.length} محصول، ${collections.length} مجموعه.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());