"use client";
import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ClosetEmptyStateProps {
  type: 'owned' | 'liked';
  onExplore: () => void;
}

export const ClosetEmptyState: React.FC<ClosetEmptyStateProps> = ({
  type,
  onExplore
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 16px',
        textAlign: 'center',
        height: '100%',
        color: 'var(--color-ivory)'
      }}
      role="region"
      aria-label={type === 'owned' ? "Empty Owned Closet" : "Empty Liked Collection"}
    >
      <div 
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(197, 160, 89, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          color: 'var(--gold-light)'
        }}
      >
        <Sparkles size={20} strokeWidth={1.5} />
      </div>

      <h3 
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.25rem',
          fontWeight: 500,
          marginBottom: '6px'
        }}
      >
        {type === 'owned' ? 'Your Wardrobe is Waiting' : 'Your Favourites Will Live Here'}
      </h3>

      <p 
        style={{
          fontSize: '0.82rem',
          color: 'var(--gold-light)',
          opacity: 0.85,
          maxWidth: '220px',
          lineHeight: 1.5,
          marginBottom: '20px'
        }}
      >
        {type === 'owned' 
          ? 'Explore our heritage silk weaves and make your first piece yours.' 
          : 'Save sarees you cherish to compare weaves and draping styles.'}
      </p>

      <button 
        className="stage-view-details-link"
        style={{ color: 'var(--gold-light)', borderBottomColor: 'var(--gold-light)' }}
        onClick={onExplore}
      >
        <span>Explore Collection</span>
        <ArrowRight size={13} strokeWidth={2} />
      </button>
    </div>
  );
};
