import Header from "@/components/Header";
import SareeConfigurator from "@/components/your-saree/SareeConfigurator";
import "./your-saree.css";

export const metadata = {
  title: "Your Saree — Craft Your Own | Mysore Silk",
  description: "Design your own Mysore silk saree — colour, weave, zari, border, pallu and motifs.",
};

export default function YourSareePage() {
  return (
    <>
      <Header variant="atelier" current="your-saree" />
      <SareeConfigurator />
    </>
  );
}
