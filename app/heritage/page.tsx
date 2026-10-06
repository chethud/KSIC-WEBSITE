import Header from "@/components/Header";
import HeritageJourney from "@/components/home/HeritageJourney";

export const metadata = {
  title: "The Heritage of Mysore Silk — A Saree Beyond Time",
  description:
    "A journey of excellence — from a royal beginning in 1912 to a timeless Mysore silk legacy.",
};

export default function HeritagePage() {
  return (
    <>
      <Header variant="heritage" current="heritage" />
      <main>
        <HeritageJourney />
      </main>
    </>
  );
}
