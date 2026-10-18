export type Focus = {
  x: number; // فقط اگر بخواهید جزء، برشی از عکس کلی باشد
  y: number;
  zoom?: number;
};

export type Collection = {
  slug: string;
  title: string;
  category: string; // slug دسته
  image: string; // عکس کلی طرح
  banner?: string; // عکس عریض بالای صفحه (اگر نباشد از image استفاده می‌شود)
  description: string;
  itemIds: number[]; // شناسهٔ محصولات داخل مجموعه
  // عکس مخصوص هر جزء در همین مجموعه، مثلاً { 1: "/images/collections/x/wardrobe.jpg" }
  // اگر نباشد، عکس خود محصول (data/products.ts) نشان داده می‌شود
  partImages?: Record<number, string>;
  // اختیاری: به‌جای عکس جدا، برشی از عکس کلی نشان بده
  focus?: Record<number, Focus>;
};

export const collections: Collection[] = [
  // {
  //   slug: "wardrobe-2door-set",
  //   title: "ست کمد دیواری دو درب",
  //   category: "wardrobe",
  //   image: "/images/categories/wardrobe.jpg",
  //   description: "کمد دیواری دو درب همراه با آینه قدی و جالباسی؛ مجموعه‌ای کامل برای اتاق خواب یا ورودی.",
  //   itemIds: [1, 9, 10],
    // partImages: {
    //   1: "/images/collections/wardrobe-2door/wardrobe.jpg",
    //   9: "/images/collections/wardrobe-2door/mirror.jpg",
    //   10: "/images/collections/wardrobe-2door/coat-rack.jpg",
    // },
  // },
  // {
  //   slug: "sliding-wardrobe-set",
  //   title: "ست کمد ریلی سه درب",
  //   category: "wardrobe",
  //   image: "/images/categories/wardrobe.jpg",
  //   description: "کمد ریلی سه درب به‌همراه جاکفشی هماهنگ، مناسب فضاهای کوچک.",
  //   itemIds: [2, 11],
  // },
  {
    slug: "bedroom-wardrobe-set",
    title: "ست کمد اتاق خواب",
    category: "wardrobe",
    image: "/images/categories/kol-kid/فتومنتاژ/6.jpg",
    description: "کمد اتاق خواب با آینه قدی و جالباسی دیواری برای یک اتاق مرتب.",
    itemIds: [3, 10],
  },
  {
    slug: "baby-room-set",
    title: "اتاق نوزاد کامل",
    category: "kids-room",
    image: "/images/categories/kol-kid/فتومنتاژ/2.jpg",
    description: "سرویس کامل نوزاد به‌همراه تخت کودک برای رشد بچه در یک اتاق هماهنگ.",
    itemIds: [4, 5],
    partImages: {
      4: "/images/categories/kol-kid/کلاسیک/اسلاید 2.jpg",
      5: "/images/categories/kol-kid/کلاسیک/اسلاید 1.jpg",
    },
  },
  {
    slug: "modern-bedroom-set",
    title: "سرویس خواب مدرن",
    category: "bedroom-set",
    image: "/images/categories/kol-kid/فتومنتاژ/1.jpg",
    description: "تخت خواب مدرن و دراور هماهنگ، با طراحی ساده و رنگ‌های قابل‌انتخاب.",
    itemIds: [6, 7],
  },
  {
    slug: "tv-bookcase-set",
    title: "ست میز تخت خواب و کتابخانه",
    category: "desk-bookcase",
    image: "/images/categories/kol-kid/فتومنتاژ/5.jpg",
    description: "میز تخت خواب و کتابخانهٔ دیواری هماهنگ برای اتاق پذیرایی یا نشیمن.",
    itemIds: [8, 12],
      partImages: {
    8: "/images/categories/kol-kid/مارتیس/اسلاید 1.jpg",
    12:"/images/categories/kol-kid/مارتیس/اسلاید 2.jpg",

  },
  },
];