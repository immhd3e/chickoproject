import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts"; 
import ServicesSection from "@/components/home/ServicesSection";
import PortfolioSection from "@/components/home/PortfolioSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <ServicesSection />
      <PortfolioSection />
    </main>
  );
}