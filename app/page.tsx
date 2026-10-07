import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArtSection from "@/components/ArtSection";
import Categories from "@/components/Categories";
import MaharajaCollection from "@/components/MaharajaCollection";
import Heritage from "@/components/Heritage";
import Footer from "@/components/home/Footer";
import { CloseBand, StudioBand } from "@/components/home/HomeBands";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <ArtSection />
        <StudioBand />
        <Categories />
        <MaharajaCollection />
        <Heritage />
        <CloseBand />
      </main>
      <Footer />
    </>
  );
}
