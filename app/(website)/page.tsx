
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ServicesSection from "@/components/home/ServicesSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import { db } from "@/lib/db";

export default async function HomePage() {
  const slides = await db.slider.findMany({
    where: { active: true },
    orderBy: [
      { sort: "asc" },
      { id: "asc" },
    ],
    select: {
      image: true,
      label: true,
      title: true,
    },
  });

  return (
    <main>
      <HeroSection slides={slides} />
      <CategoriesSection />
      <FeaturedProducts />
      <ServicesSection />
      <PortfolioSection />
    </main>
  );
}
