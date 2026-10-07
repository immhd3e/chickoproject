export type CategoryItem = { title: string; slug: string };

export type Category = {
  title: string;
  slug: string;
  description: string;
  image: string;
  items: CategoryItem[];
};

export const categories: Category[] = [
  {
    title: "کمد و کمد دیواری",
    slug: "wardrobe",
    description: "انواع کمد دیواری، ریلی و سفارشی",
    image: "/images/categories/wardrobe.jpg",
    items: [
      { title: "کمد سفارشی", slug: "custom-wardrobe" },
      { title: "کمد ریلی", slug: "sliding-wardrobe" },
      { title: "کمد اتاق خواب", slug: "bedroom-wardrobe" },
      { title: "کمد دیواری", slug: "built-in-wardrobe" },
    ],
  },
  {
    title: "اتاق نوزاد و کودک",
    slug: "kids-room",
    description: "طراحی و اجرای اتاق نوزاد و کودک",
    image: "/images/categories/kids-room.jpg",
    items: [
      { title: "سرویس نوزاد", slug: "baby-set" },
      { title: "تخت کودک", slug: "kids-bed" },
      { title: "میز تحریر", slug: "study-desk" },
      { title: "کتابخانه کودک", slug: "kids-bookcase" },
    ],
  },
  {
    title: "سرویس خواب",
    slug: "bedroom-set",
    description: "سرویس خواب مدرن و سفارشی",
    image: "/images/categories/bedroom-set.jpg",
    items: [
      { title: "تخت خواب", slug: "bed" },
      { title: "دراور", slug: "dresser" },
      { title: "پاتختی", slug: "nightstand" },
      { title: "میز آرایش", slug: "vanity" },
    ],
  },
  {
    title: "میز و کتابخانه",
    slug: "desk-bookcase",
    description: "میز، کتابخانه و تجهیزات کاربردی",
    image: "/images/categories/desk-bookcase.jpg",
    items: [
      { title: "میز تلویزیون", slug: "tv-stand" },
      { title: "کتابخانه", slug: "bookcase" },
      { title: "میز تحریر", slug: "desk" },
      { title: "میز کار", slug: "work-desk" },
    ],
  },
];