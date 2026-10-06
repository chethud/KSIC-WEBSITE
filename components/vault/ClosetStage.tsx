"use client";
import React from 'react';
import { ChevronLeft, ChevronRight, Heart, Check, ArrowRight } from 'lucide-react';
import type { Product } from './types';
import { Product3DViewer } from './Product3DViewer';

interface ClosetStageProps {
  product: Product;
  isOwned: boolean;
  onToggleCloset: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onNextProduct: () => void;
  onPrevProduct: () => void;
}

export const ClosetStage: React.FC<ClosetStageProps> = ({
  product,
  isOwned,
  onToggleCloset,
  onOpenDetails,
  onNextProduct,
  onPrevProduct
}) => {
  return (
    <section 
      className="closet-center-stage" 
      aria-label="Active Silk Presentation Stage"
      data-testid="closet-stage"
    >
      {/* Editorial Product Information */}
      <header className="product-editorial-header">
        <span className="stage-eyebrow">YOUR VIRTUAL CLOSET</span>
        
        <h1 className="stage-product-title" key={`title-${product.id}`}>
          {product.name}
        </h1>
        
        <div className="stage-product-category" key={`cat-${product.id}`}>
          {product.category}
        </div>

        <div className="stage-product-price" key={`price-${product.id}`}>
          ₹{product.price.toLocaleString('en-IN')}
        </div>
        
        <p className="stage-product-desc" key={`desc-${product.id}`}>
          {product.description}
        </p>

        <button 
          className="stage-view-details-link"
          onClick={() => onOpenDetails(product)}
          aria-label={`View craftsmanship details for ${product.name}`}
        >
          <span>View Details</span>
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      </header>

      {/* Saree Presentation on Pedestal with Interactive 3D Viewer */}
      <div className="stage-drape-container">
        {/* Previous Product Arrow */}
        <button 
          className="stage-nav-arrow prev" 
          onClick={onPrevProduct}
          aria-label="View previous saree"
          title="Previous saree (Left Arrow)"
        >
          <ChevronLeft size={22} strokeWidth={1.8} />
        </button>

        {/* Real Interactive 3D Saree Model (360° rotation, pinch zoom, contact shadow) */}
        <div className="hero-3d-wrapper">
          <Product3DViewer product={product} />
        </div>

        {/* Next Product Arrow */}
        <button 
          className="stage-nav-arrow next" 
          onClick={onNextProduct}
          aria-label="View next saree"
          title="Next saree (Right Arrow)"
        >
          <ChevronRight size={22} strokeWidth={1.8} />
        </button>
      </div>

      {/* Bottom Action Pills */}
      <div className="stage-action-pills">
        <button 
          className={`btn-pill-primary ${isOwned ? 'owned-state' : ''}`}
          onClick={() => onToggleCloset(product)}
          aria-label={isOwned ? "In My Closet - Click to manage" : "Add to My Closet"}
        >
          {isOwned ? (
            <>
              <Check size={16} strokeWidth={2.2} />
              <span>In My Closet</span>
            </>
          ) : (
            <>
              <Heart size={16} strokeWidth={2} />
              <span>Add to Closet</span>
            </>
          )}
        </button>

        <button 
          className="btn-pill-secondary"
          onClick={() => onOpenDetails(product)}
          aria-label="View Details"
        >
          View Details
        </button>
      </div>
    </section>
  );
};
