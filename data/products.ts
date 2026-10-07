
import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "کمد دیواری مدرن",
    slug: "modern-wall-wardrobe",
    description:
      "کمد دیواری مدرن با طراحی مینیمال و قابلیت اجرای سفارشی",
    image: "/images/products/wardrobe-1.jpg",
    category: "wardrobes",
    material: "MDF",
    isFeatured: true,
  },

  {
    id: "2",
    name: "سرویس خواب کودک",
    slug: "kids-bedroom-set",
    description:
      "سرویس خواب کودک با طراحی کاربردی و قابل شخصی‌سازی",
    image: "/images/products/kids-room-1.jpg",
    category: "kids-room",
    material: "MDF",
    isFeatured: true,
  },

  {
    id: "3",
    name: "میز تحریر مدرن",
    slug: "modern-study-desk",
    description:
      "میز تحریر مدرن مناسب اتاق کودک، نوجوان و فضای کاری",
    image: "/images/products/study-desk-1.jpg",
    category: "tables-bookcases",
    material: "MDF",
    isFeatured: false,
  },

  {
    id: "4",
    name: "تخت خواب مینیمال",
    slug: "minimal-bed",
    description:
      "تخت خواب مینیمال با قابلیت تولید در ابعاد مختلف",
    image: "/images/products/bed-1.jpg",
    category: "bedroom",
    material: "MDF",
    isFeatured: true,
  },

  {
    id: "5",
    name: "کتابخانه دیواری",
    slug: "wall-bookcase",
    description:
      "کتابخانه دیواری مدرن مناسب خانه و فضای اداری",
    image: "/images/products/bookcase-1.jpg",
    category: "tables-bookcases",
    material: "MDF",
    isFeatured: false,
  },

  {
    id: "6",
    name: "کمد ریلی",
    slug: "sliding-wardrobe",
    description:
      "کمد ریلی با طراحی مدرن و استفاده بهینه از فضای اتاق",
    image: "/images/products/wardrobe-2.jpg",
    category: "wardrobes",
    material: "MDF",
    isFeatured: true,
  },
];

