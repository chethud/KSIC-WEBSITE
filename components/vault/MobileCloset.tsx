"use client";
import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Check } from 'lucide-react';
import type { Product } from './types';
import { Product3DViewer } from './Product3DViewer';

interface MobileClosetProps {
  products: Product[];
  activeProduct: Product;
  activeTab: 'owned' | 'liked';
  ownedCount: number;
  likedCount: number;
  onTabChange: (tab: 'owned' | 'liked') => void;
  onSelectProduct: (product: Product) => void;
  onToggleCloset: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onNextProduct: () => void;
  onPrevProduct: () => void;
}

export const MobileCloset: React.FC<MobileClosetProps> = ({
  products,
  activeProduct,
  activeTab,
  ownedCount,
  likedCount,
  onTabChange,
  onSelectProduct,
  onToggleCloset,
  onOpenDetails,
  onNextProduct,
  onPrevProduct
}) => {
  const isOwned = activeProduct.status === 'owned';
  const currentIndex = products.findIndex((p) => p.id === activeProduct.id);
  const totalCount = products.length;
  const pageIndexFormatted = String(currentIndex >= 0 ? currentIndex + 1 : 1).padStart(2, '0');
  const totalCountFormatted = String(totalCount).padStart(2, '0');
  const progressPercent = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;

  // Touch swipe support (only when not interacting with 3D canvas)
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // If target is inside canvas, let Three.js OrbitControls handle it
    if ((e.target as HTMLElement).tagName === 'CANVAS') return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      onNextProduct();
    } else if (diff < -50) {
      onPrevProduct();
    }
    touchStartX.current = null;
  };

  // Scroll active item into view in horizontal shelf
  const shelfRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!shelfRef.current) return;
    const activeEl = shelfRef.current.querySelector('.mobile-shelf-card.active') as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeProduct.id]);

  return (
    <div 
      className="mobile-closet-layout"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Mobile Virtual Closet View"
    >
      {/* Product Top Header */}
      <div className="mobile-product-header">
        <div>
          <span className="stage-eyebrow">YOUR VIRTUAL CLOSET</span>
          <h1 className="stage-product-title" style={{ fontSize: '1.8rem' }}>
            {activeProduct.name}
          </h1>
          <div className="stage-product-category" style={{ fontSize: '0.9rem' }}>
            {activeProduct.category}
          </div>
          <div className="stage-product-price" style={{ fontSize: '1.1rem', marginTop: '4px' }}>
            ₹{activeProduct.price.toLocaleString('en-IN')}
          </div>
        </div>

        <button 
          className="action-icon-btn"
          onClick={() => onToggleCloset(activeProduct)}
          aria-label={isOwned ? "In your closet" : "Save saree to likes"}
        >
          <Heart 
            size={22} 
            strokeWidth={1.8} 
            fill={activeProduct.status === 'liked' ? '#A98955' : 'none'} 
            color={activeProduct.status === 'liked' ? '#A98955' : 'var(--text-primary)'} 
          />
        </button>
      </div>

      {/* Saree Stage on Mobile with Real 3D Saree Drape */}
      <div className="mobile-stage-area">
        <button 
          className="stage-nav-arrow prev" 
          onClick={onPrevProduct}
          aria-label="Previous saree"
          style={{ width: '38px', height: '38px', left: '4px' }}
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        <div className="mobile-3d-wrapper">
          <Product3DViewer product={activeProduct} />
        </div>

        <button 
          className="stage-nav-arrow next" 
          onClick={onNextProduct}
          aria-label="Next saree"
          style={{ width: '38px', height: '38px', right: '4px' }}
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Pagination Progress Indicator */}
      <div className="mobile-pagination-row">
        <span className="mobile-page-counter">
          {pageIndexFormatted} / {totalCountFormatted}
        </span>
        <div className="mobile-page-bar">
          <div 
            className="mobile-page-progress" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {/* Stacked Action Buttons */}
      <div className="mobile-actions-stack">
        <button 
          className={`btn-pill-primary ${isOwned ? 'owned-state' : ''}`}
          onClick={() => onToggleCloset(activeProduct)}
        >
          {isOwned ? (
            <>
              <Check size={18} strokeWidth={2.2} />
              <span>In My Closet</span>
            </>
          ) : (
            <>
              <Heart size={18} strokeWidth={2} />
              <span>Add to Closet</span>
            </>
          )}
        </button>

        <button 
          className="btn-pill-secondary"
          onClick={() => onOpenDetails(activeProduct)}
        >
          View Details
        </button>
      </div>

      {/* Segmented Tab Selector */}
      <div className="mobile-closet-tabs" role="tablist">
        <button
          className={`mobile-tab-btn ${activeTab === 'owned' ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'owned'}
          onClick={() => onTabChange('owned')}
        >
          My Closet ({ownedCount})
        </button>
        <button
          className={`mobile-tab-btn ${activeTab === 'liked' ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'liked'}
          onClick={() => onTabChange('liked')}
        >
          Liked ({likedCount})
        </button>
      </div>

      {/* Horizontal Scrollable Shelf Strip */}
      <div className="mobile-horizontal-shelf" ref={shelfRef} role="list">
        {products.map((item) => (
          <button
            key={`mobile-shelf-${item.id}`}
            role="listitem"
            className={`mobile-shelf-card ${item.id === activeProduct.id ? 'active' : ''}`}
            onClick={() => onSelectProduct(item)}
            aria-label={`Select ${item.name}`}
          >
            <img 
              src={item.thumbnail} 
              alt={item.name} 
              className="mobile-shelf-card-img" 
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
