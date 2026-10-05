import Image from "next/image";

export default function Emblem() {
  return (
    <span className="brand-logo">
      <Image
        src="/logo.png"
        alt="Mysore Silk"
        width={220}
        height={72}
        priority
        className="brand-logo__img"
      />
    </span>
  );
}
