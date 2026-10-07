"use client";
import React from 'react';
import { Plus } from 'lucide-react';
import type { Product } from './types';
import { WardrobeShelf } from './WardrobeShelf';

interface OwnedWardrobeProps {
  products: Product[];
  activeProductId: string;
  onSelectProduct: (product: Product) => void;
  onHoverProduct: (product: Product) => void;
  onHoverLeave: () => void;
  onOpenAddModal?: () => void;
}

export const OwnedWardrobe: React.FC<OwnedWardrobeProps> = ({
  products,
  activeProductId,
  onSelectProduct,
  onHoverProduct,
  onHoverLeave,
  onOpenAddModal
}) => {
  // Always maintain 4 shelves visually to match architectural built-in reference
  const shelves = Array.from({ length: 4 }, (_, idx) => products[idx]);

  // Bottom swatch samples from owned products
  const swatches = products.slice(0, 3);

  return (
    <aside 
      className="wardrobe-cabinet owned-closet" 
      aria-label="House silks to explore in the studio"
    >
      {/* Architectural Arched Header */}
      <div className="wardrobe-header">
        <div className="wardrobe-header-text">
          <h2 className="wardrobe-title">House silks</h2>
          <span className="wardrobe-meta">
            Explore · {String(products.length).padStart(2, '0')}
          </span>
        </div>

        <button 
          className="wardrobe-add-btn" 
          aria-label="Add new heirloom saree to my closet"
          onClick={onOpenAddModal}
          title="Add owned heirloom to closet"
        >
          <Plus size={16} strokeWidth={2} />
        </button>
      </div>

      {/* 4 Built-In Recessed Wooden Shelves */}
      <div className="wardrobe-shelves" role="region" aria-label="Owned silk shelves">
        {shelves.map((product, index) => (
          <WardrobeShelf
            key={product ? product.id : `empty-owned-${index}`}
            shelfNumber={index + 1}
            product={product}
            isActive={product ? product.id === activeProductId : false}
            onSelect={onSelectProduct}
            onHover={onHoverProduct}
            onHoverLeave={onHoverLeave}
          />
        ))}
      </div>

      {/* Bottom Swatch Inset Cubbies */}
      <div className="wardrobe-cubbies" aria-label="Silk weave swatches">
        {swatches.map((item) => (
          <button
            key={`swatch-${item.id}`}
            className={`swatch-cubby ${item.id === activeProductId ? 'active' : ''}`}
            onClick={() => onSelectProduct(item)}
            title={`View ${item.name} silk swatch`}
            aria-label={`View ${item.name} silk swatch`}
          >
            <img 
              src={item.thumbnail} 
              alt={`${item.name} weave swatch`} 
              className="swatch-cubby-img"
              loading="lazy" 
            />
          </button>
        ))}
      </div>
    </aside>
  );
};
