"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const steps = [
  { n: "01", title: "The Silk", image: "/silk-threads.jpg", copy: "Raw purity — the beginning of every heirloom." },
  { n: "02", title: "The Zari", image: "/gold-thread.jpg", copy: "Metal becomes memory in every border." },
  { n: "03", title: "The Weave", image: "/loom-craft.jpg", copy: "Hands and loom in quiet conversation." },
  { n: "04", title: "The Finish", image: "/zari-macro.jpg", copy: "Precision where the eye rests longest." },
  { n: "05", title: "The Heirloom", image: "/heirloom.jpg", copy: "A saree ready to outlive the moment." },
];

export default function Craftsmanship() {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight)));
      setIndex(Math.min(steps.length - 1, Math.floor(progress * steps.length)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const step = steps[index];

  return (
    <section className="craftsmanship" id="craftsmanship" ref={ref}>
      <div className="craftsmanship__sticky">
        <div className="craftsmanship__media">
          <div className="media-fill">
            <Image src={step.image} alt={step.title} fill sizes="60vw" />
          </div>
        </div>
        <div className="craftsmanship__copy">
          <p className="eyebrow">Exhibition</p>
          <p className="craftsmanship__n">{step.n}</p>
          <h2 className="display display--light">{step.title}</h2>
          <p>{step.copy}</p>
          <div className="craftsmanship__progress" aria-hidden="true">
            <span style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
          </div>
          <ol>
            {steps.map((s, i) => (
              <li key={s.n} className={i === index ? "is-active" : undefined}>
                {s.n} {s.title}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
