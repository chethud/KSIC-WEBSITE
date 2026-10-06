import Image from "next/image";

const categories = [
  {
    title: "Sarees",
    copy: "The heart\nof our house",
    image: "/cat-sarees.jpg?v=2",
    alt: "Woman wearing a Mysore silk saree",
  },
  {
    title: "Bridal",
    copy: "Ceremonial silk\nfor forever.",
    image: "/cat-bridal.jpg",
    alt: "Bridal Mysore silk saree with gold zari",
  },
  {
    title: "Accessories",
    copy: "A touch\nof heritage",
    image: "/gold-thread.jpg",
    alt: "Premium silk accessories and fabric detail",
  },
];

export default function Categories() {
  return (
    <section className="categories" id="categories" aria-label="Shop by category">
      {categories.map((cat) => (
        <a key={cat.title} className="cat" href="#collection">
          <div className="media-fill">
            <Image src={cat.image} alt={cat.alt} fill sizes="(max-width: 900px) 100vw, 33vw" />
          </div>
          <div className="cat__copy">
            <h3>{cat.title}</h3>
            <p>
              {cat.copy.split("\n").map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <span className="cat__cta">
              Explore <span aria-hidden="true">→</span>
            </span>
          </div>
        </a>
      ))}
    </section>
  );
}
