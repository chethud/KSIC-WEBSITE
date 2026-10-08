import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BetweenHero from "@/components/home/BetweenHero";
import Categories from "@/components/Categories";
import MaharajaCollection from "@/components/MaharajaCollection";
import Heritage from "@/components/Heritage";
import Footer from "@/components/home/Footer";
import { CloseBand } from "@/components/home/HomeBands";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <BetweenHero />
        <Categories />
        <MaharajaCollection />
        <Heritage />
        <CloseBand />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
