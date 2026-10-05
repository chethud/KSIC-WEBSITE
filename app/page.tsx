import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArtSection from "@/components/ArtSection";
import Categories from "@/components/Categories";
import MaharajaCollection from "@/components/MaharajaCollection";
import Heritage from "@/components/Heritage";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <ArtSection />
        <Categories />
        <MaharajaCollection />
        <Heritage />
      </main>
    </>
  );
}
