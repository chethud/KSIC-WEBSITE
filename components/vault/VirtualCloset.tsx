"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { Check } from 'lucide-react';
import type { Product } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { ClosetHeader } from './ClosetHeader';
import { OwnedWardrobe } from './OwnedWardrobe';
import { LikedWardrobe } from './LikedWardrobe';
import { ClosetStage } from './ClosetStage';
import { MobileCloset } from './MobileCloset';
import { ProductDetailsModal } from './ProductDetailsModal';

// Register GSAP Flip Plugin
gsap.registerPlugin(Flip);

type VirtualClosetProps = {
  /** When true, skip the closet's own top nav (site Header is used instead). */
  embedded?: boolean;
};

export const VirtualCloset: React.FC<VirtualClosetProps> = ({ embedded = true }) => {
  // Master Product List (single source of truth)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Active / Selected State
  const [activeProductId, setActiveProductId] = useState<string>('KSIC-001');
  const [mobileTab, setMobileTab] = useState<'owned' | 'liked'>('owned');

  // Modal & Toast States
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // References
  const closetContainerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flipAnimationRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);

  // Derived Collections
  const ownedProducts = products.filter((p) => p.status === 'owned');
  const likedProducts = products.filter((p) => p.status === 'liked');

  // Active Product Object
  const activeProduct = products.find((p) => p.id === activeProductId) || products[0];
  const isCurrentOwned = activeProduct ? activeProduct.status === 'owned' : false;

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Show Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  };

  /**
   * Signature Product Switch with GSAP Flip
   */
  const transitionToProduct = useCallback((targetProduct: Product) => {
    if (targetProduct.id === activeProductId) return;

    if (flipAnimationRef.current) {
      flipAnimationRef.current.kill();
    }

    if (prefersReducedMotion) {
      setActiveProductId(targetProduct.id);
      return;
    }

    // 1. Capture current Flip state
    const flipElements = document.querySelectorAll(
      `.hero-draped-saree-img, [data-flip-id="stage-hero-${activeProductId}"], [data-flip-id="shelf-item-${targetProduct.id}"]`
    );
    const state = Flip.getState(flipElements);

    // 2. Update React State
    setActiveProductId(targetProduct.id);

    // 3. Animate transition in next frame with GSAP Flip
    requestAnimationFrame(() => {
      const heroEl = document.querySelector('.hero-draped-saree-img');
      if (heroEl) {
        gsap.fromTo(
          heroEl,
          { opacity: 0.6, scale: 0.94, filter: 'drop-shadow(0 10px 15px rgba(45,30,20,0.15))' },
          {
            opacity: 1,
            scale: 1,
            filter: 'drop-shadow(0 25px 25px rgba(45, 30, 20, 0.28))',
            duration: 0.75,
            ease: 'power3.inOut'
          }
        );
      }
      Flip.from(state, {
        duration: 0.75,
        ease: 'power3.inOut',
        absolute: true,
        fade: true
      });
    });
  }, [activeProductId, prefersReducedMotion]);

  /**
   * Hover preview with intentional delay (190ms)
   */
  const handleProductHover = (product: Product) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      transitionToProduct(product);
    }, 190);
  };

  const handleProductHoverLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  /**
   * Click locks product as the active hero
   */
  const handleSelectProduct = (product: Product) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    transitionToProduct(product);
  };

  /**
   * Signature LIKED → OWNED Transition (Right Shelf -> Center -> Left Shelf)
   */
  const handleToggleCloset = (targetProduct: Product) => {
    const isCurrentlyOwned = targetProduct.status === 'owned';
    const newStatus: 'owned' | 'liked' = isCurrentlyOwned ? 'liked' : 'owned';

    // Capture state before moving items across wardrobes
    const state = Flip.getState('.wardrobe-shelf, .saree-shelf-item, .hero-draped-saree-img');

    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === targetProduct.id) {
          return { ...item, status: newStatus };
        }
        return item;
      })
    );

    // Provide luxury feedback
    if (!isCurrentlyOwned) {
      triggerToast(`"${targetProduct.name}" moved to your Personal Heirloom Closet.`);
    } else {
      triggerToast(`"${targetProduct.name}" moved to Liked Pieces archive.`);
    }

    if (!prefersReducedMotion) {
      requestAnimationFrame(() => {
        Flip.from(state, {
          duration: 0.85,
          ease: 'power3.inOut',
          absolute: true,
          nested: true
        });
      });
    }
  };

  /**
   * Cycling through products with side chevrons / keyboard
   */
  const handleNextProduct = () => {
    const currentIndex = products.findIndex((p) => p.id === activeProductId);
    const nextIndex = (currentIndex + 1) % products.length;
    transitionToProduct(products[nextIndex]);
  };

  const handlePrevProduct = () => {
    const currentIndex = products.findIndex((p) => p.id === activeProductId);
    const prevIndex = (currentIndex - 1 + products.length) % products.length;
    transitionToProduct(products[prevIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (detailsProduct) return; // Modal open
      if (e.key === 'ArrowRight') {
        handleNextProduct();
      } else if (e.key === 'ArrowLeft') {
        handlePrevProduct();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProductId, detailsProduct, products]);

  return (
    <div className={`closet-app${embedded ? " closet-app--standalone" : ""}`} ref={closetContainerRef}>
      {/* Top Header — only when not embedded in the Mysore Silk site shell */}
      {!embedded ? (
        <ClosetHeader
          ownedCount={ownedProducts.length}
          likedCount={likedProducts.length}
        />
      ) : null}

      {/* Main Architectural Room Setting */}
      <main className="architectural-room">
        {/* Physical Room Architecture Elements */}
        <div className="room-wall-art" aria-hidden="true">
          {/* Dark Walnut Cornice along Ceiling */}
          <div className="showroom-cornice" />

          {/* Restrained Architectural Wall Framing */}
          <div className="showroom-wall-framing" />

          {/* Natural Morning Sunlight Streaming from Right */}
          <div className="sunlight-beam" />

          {/* Limestone Flooring with Tile Joints */}
          <div className="room-floor">
            <div className="floor-joint-lines" />
          </div>

          {/* Central Stepped Circular Display Platform */}
          <div className="pedestal-stage">
            <div className="pedestal-base" />
            <div className="pedestal-top" />
            <div className="pedestal-shadow" />
          </div>
        </div>

        {/* =======================================================
            DESKTOP THREE-COLUMN COMPOSITION (>= 1024px)
            ======================================================= */}
        <div className="closet-desktop-layout">
          {/* LEFT: "My Closet" (Owned pieces) */}
          <OwnedWardrobe
            products={ownedProducts}
            activeProductId={activeProductId}
            onSelectProduct={handleSelectProduct}
            onHoverProduct={handleProductHover}
            onHoverLeave={handleProductHoverLeave}
            onOpenAddModal={() => triggerToast("Direct heirloom intake portal: Register your family vintage KSIC silk with serial verification.")}
          />

          {/* CENTER: Selected Saree on Heritage Pedestal */}
          <ClosetStage
            product={activeProduct}
            isOwned={isCurrentOwned}
            onToggleCloset={handleToggleCloset}
            onOpenDetails={(p) => setDetailsProduct(p)}
            onNextProduct={handleNextProduct}
            onPrevProduct={handlePrevProduct}
          />

          {/* RIGHT: "Liked Products" (Saved for later) */}
          <LikedWardrobe
            products={likedProducts}
            activeProductId={activeProductId}
            onSelectProduct={handleSelectProduct}
            onHoverProduct={handleProductHover}
            onHoverLeave={handleProductHoverLeave}
            onOpenExploreModal={() => triggerToast("Catalog Browser: Exploring the complete 2026 KSIC Mysore Silk Collection.")}
          />
        </div>

        {/* =======================================================
            MOBILE EXPERIENCE (< 1024px)
            ======================================================= */}
        <MobileCloset
          products={mobileTab === 'owned' ? ownedProducts : likedProducts}
          activeProduct={activeProduct}
          activeTab={mobileTab}
          ownedCount={ownedProducts.length}
          likedCount={likedProducts.length}
          onTabChange={(tab) => setMobileTab(tab)}
          onSelectProduct={handleSelectProduct}
          onToggleCloset={handleToggleCloset}
          onOpenDetails={(p) => setDetailsProduct(p)}
          onNextProduct={handleNextProduct}
          onPrevProduct={handlePrevProduct}
        />
      </main>

      {/* Luxury Product Details Modal */}
      <ProductDetailsModal
        product={detailsProduct}
        isOwned={detailsProduct ? detailsProduct.status === 'owned' : false}
        onClose={() => setDetailsProduct(null)}
        onToggleCloset={handleToggleCloset}
      />

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="luxury-toast" role="status" aria-live="polite">
          <Check size={16} strokeWidth={2.4} className="toast-gold-check" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
