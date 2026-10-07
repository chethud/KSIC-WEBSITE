"use client";
import React from 'react';
import { Plus } from 'lucide-react';
import type { Product } from './types';
import { WardrobeShelf } from './WardrobeShelf';

interface LikedWardrobeProps {
  products: Product[];
  activeProductId: string;
  onSelectProduct: (product: Product) => void;
  onHoverProduct: (product: Product) => void;
  onHoverLeave: () => void;
  onOpenExploreModal?: () => void;
}

export const LikedWardrobe: React.FC<LikedWardrobeProps> = ({
  products,
  activeProductId,
  onSelectProduct,
  onHoverProduct,
  onHoverLeave,
  onOpenExploreModal
}) => {
  // Always maintain 4 shelves visually to match architectural built-in reference
  const shelves = Array.from({ length: 4 }, (_, idx) => products[idx]);

  // Bottom swatch samples from liked products
  const swatches = products.slice(0, 3);

  return (
    <aside 
      className="wardrobe-cabinet liked-closet" 
      aria-label="Liked Products - Saved for later"
    >
      {/* Architectural Arched Header */}
      <div className="wardrobe-header">
        <div className="wardrobe-header-text">
          <h2 className="wardrobe-title">Set aside</h2>
          <span className="wardrobe-meta">
            Studio only · {String(products.length).padStart(2, '0')}
          </span>
        </div>

        <button 
          className="wardrobe-add-btn" 
          aria-label="Explore more sarees to save"
          onClick={onOpenExploreModal}
          title="Explore sarees to like"
        >
          <Plus size={16} strokeWidth={2} />
        </button>
      </div>

      {/* 4 Built-In Recessed Wooden Shelves */}
      <div className="wardrobe-shelves" role="region" aria-label="Liked silk shelves">
        {shelves.map((product, index) => (
          <WardrobeShelf
            key={product ? product.id : `empty-liked-${index}`}
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
      <div className="wardrobe-cubbies" aria-label="Liked silk weave swatches">
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
