"use client";

import Image from "next/image";
import { useState } from "react";

const steps = [
  { id: "01", title: "Silk", image: "/silk-threads.jpg", copy: "Pure mulberry silk, chosen for lustre and longevity." },
  { id: "02", title: "Zari", image: "/gold-thread.jpg", copy: "Gold and silver wound into thread that catches light like jewellery." },
  { id: "03", title: "Weave", image: "/loom-craft.jpg", copy: "A discipline of the loom — measured in patience, not speed." },
  { id: "04", title: "Finish", image: "/zari-macro.jpg", copy: "Borders set with precision. Every piece inspected by hand." },
];

export default function CraftSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="craft" id="craft">
      <div className="craft__media">
        <div className="media-fill">
          <Image src={steps[active].image} alt={steps[active].title} fill sizes="55vw" />
        </div>
      </div>
      <div className="craft__panel">
        <p className="eyebrow">The Art of the Weave</p>
        <h2 className="display display--light">
          Crafted
          <br />
          by Hand.
        </h2>
        <p className="body">
          Mysore silk is not ornamented after the fact. Colour, zari and border are woven into the
          cloth — a craft perfected in Mysuru and passed through generations of makers.
        </p>
        <ul className="craft__steps">
          {steps.map((step, i) => (
            <li key={step.id}>
              <button
                type="button"
                className={i === active ? "is-active" : undefined}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
              >
                <span>{step.id}</span>
                <em>{step.title}</em>
              </button>
              {i === active ? <p>{step.copy}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
