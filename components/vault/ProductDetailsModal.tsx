"use client";
import React, { useEffect } from 'react';
import { X, Check, Heart, Award } from 'lucide-react';
import type { Product } from './types';

interface ProductDetailsModalProps {
  product: Product | null;
  isOwned: boolean;
  onClose: () => void;
  onToggleCloset: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOwned,
  onClose,
  onToggleCloset
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-saree-title"
    >
      <div 
        className="detail-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close product details"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {/* Visual Presentation Pane */}
        <div className="modal-visual-pane">
          <img 
            src={product.image} 
            alt={`Full drape view of ${product.name}`} 
            className="modal-saree-img" 
          />
        </div>

        {/* Heritage Information Pane */}
        <div className="modal-info-pane">
          <span className="stage-eyebrow">ARTICLE {product.articleNumber}</span>
          <h2 id="modal-saree-title" className="stage-product-title" style={{ fontSize: '2.1rem' }}>
            {product.name}
          </h2>
          <div className="stage-product-category" style={{ marginBottom: '8px' }}>
            {product.category}
          </div>

          <div style={{ 
            fontSize: '1.4rem', 
            fontWeight: 600, 
            color: 'var(--text-primary)', 
            margin: '12px 0 16px',
            fontFamily: 'var(--font-serif)'
          }}>
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          <p className="stage-product-desc" style={{ maxWidth: '100%' }}>
            {product.description}
          </p>

          {/* Heritage Specifications Grid */}
          <div className="modal-spec-grid">
            <div className="spec-item">
              <span className="spec-label">Weave Technique</span>
              <span className="spec-value">{product.details.weave}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">Zari Authenticity</span>
              <span className="spec-value">{product.details.zari}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">Yarn Specification</span>
              <span className="spec-value">{product.details.fabric}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">Provenance</span>
              <span className="spec-value">{product.details.origin}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">Dimensions</span>
              <span className="spec-value">{product.details.length}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">Pure Silk Weight</span>
              <span className="spec-value">{product.details.weight}</span>
            </div>
          </div>

          {/* Authenticity Hallmark */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '12px 16px', 
            background: 'rgba(197, 160, 89, 0.12)', 
            borderRadius: '6px',
            marginBottom: '24px'
          }}>
            <Award size={20} color="var(--gold-rich)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {product.details.certification}
            </span>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
            <button 
              className={`btn-pill-primary ${isOwned ? 'owned-state' : ''}`}
              style={{ flex: 1 }}
              onClick={() => onToggleCloset(product)}
            >
              {isOwned ? (
                <>
                  <Check size={16} strokeWidth={2.2} />
                  <span>In My Closet</span>
                </>
              ) : (
                <>
                  <Heart size={16} strokeWidth={2} />
                  <span>Add to My Closet</span>
                </>
              )}
            </button>

            <button 
              className="btn-pill-secondary"
              style={{ flex: 1 }}
              onClick={() => alert(`Direct inquiry opened for ${product.name} (Art. ${product.articleNumber}). KSIC Concierge notified.`)}
            >
              Request Concierge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
