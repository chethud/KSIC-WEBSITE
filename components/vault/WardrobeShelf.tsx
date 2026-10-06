"use client";
import React from 'react';
import type { Product } from './types';

interface WardrobeShelfProps {
  product?: Product;
  isActive: boolean;
  onSelect: (product: Product) => void;
  onHover: (product: Product) => void;
  onHoverLeave: () => void;
  shelfNumber: number;
}

export const WardrobeShelf: React.FC<WardrobeShelfProps> = ({
  product,
  isActive,
  onSelect,
  onHover,
  onHoverLeave,
  shelfNumber
}) => {
  if (!product) {
    return (
      <div className="wardrobe-shelf empty-shelf" aria-label={`Empty shelf ${shelfNumber}`}>
        <div className="shelf-wooden-lip" />
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(product);
    }
  };

  return (
    <div
      className={`wardrobe-shelf ${isActive ? 'active-shelf' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`Select ${product.name} - ${product.category} - ₹${product.price.toLocaleString('en-IN')}`}
      aria-pressed={isActive}
      onClick={() => onSelect(product)}
      onMouseEnter={() => onHover(product)}
      onMouseLeave={onHoverLeave}
      onKeyDown={handleKeyDown}
      data-product-id={product.id}
    >
      {/* Saree sitting flat and naturally on the shelf */}
      <div 
        className="saree-shelf-item"
        data-flip-id={`shelf-item-${product.id}`}
      >
        <img
          src={product.foldedImage}
          alt={`Folded ${product.name} saree with pure gold zari`}
          className="saree-shelf-img"
          loading="lazy"
        />
      </div>

      {/* Built-in Dark Walnut Beveled Shelf Lip */}
      <div className="shelf-wooden-lip" />
    </div>
  );
};
