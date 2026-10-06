"use client";
import React from 'react';
import { Search, Heart, ShoppingBag, Menu } from 'lucide-react';

interface ClosetHeaderProps {
  ownedCount: number;
  likedCount: number;
  onOpenMobileMenu?: () => void;
}

export const ClosetHeader: React.FC<ClosetHeaderProps> = ({
  likedCount,
  onOpenMobileMenu
}) => {
  return (
    <header className="closet-header" role="banner">
      {/* Mobile Hamburger Menu Icon */}
      <button 
        className="action-icon-btn mobile-menu-toggle"
        onClick={onOpenMobileMenu}
        aria-label="Open navigation menu"
        style={{ display: 'none' }}
      >
        <Menu size={22} strokeWidth={1.5} />
      </button>

      {/* Brand Identity / Logo */}
      <div className="brand-identity" tabIndex={0} role="link" aria-label="KSIC Silk Home">
        {/* Intricate Royal Lotus Mandala Emblem */}
        <svg 
          className="brand-emblem" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5" />
          {/* 8-Petal Royal Lotus */}
          <path d="M50 15 C45 32 45 42 50 50 C55 42 55 32 50 15 Z" fill="currentColor" opacity="0.85" />
          <path d="M50 85 C45 68 45 58 50 50 C55 58 55 68 50 85 Z" fill="currentColor" opacity="0.85" />
          <path d="M15 50 C32 45 42 45 50 50 C42 55 32 55 15 50 Z" fill="currentColor" opacity="0.85" />
          <path d="M85 50 C68 45 58 45 50 50 C58 55 68 55 85 50 Z" fill="currentColor" opacity="0.85" />
          <path d="M25 25 C39 36 45 43 50 50 C43 45 36 39 25 25 Z" fill="currentColor" opacity="0.75" />
          <path d="M75 75 C61 64 55 57 50 50 C57 55 64 61 75 75 Z" fill="currentColor" opacity="0.75" />
          <path d="M75 25 C64 39 57 45 50 50 C55 43 61 36 75 25 Z" fill="currentColor" opacity="0.75" />
          <path d="M25 75 C36 61 43 55 50 50 C45 57 39 64 25 75 Z" fill="currentColor" opacity="0.75" />
          <circle cx="50" cy="50" r="6" fill="#C5A059" />
          <circle cx="50" cy="50" r="2.5" fill="#FAF6EE" />
        </svg>

        <span className="brand-title">KSIC SILK</span>
      </div>

      {/* Main Navigation Links */}
      <nav className="header-nav" aria-label="Main Navigation">
        <a href="#sarees" className="nav-link">Sarees</a>
        <a href="#collections" className="nav-link">Collections</a>
        <a href="#heritage" className="nav-link">Heritage</a>
        <a href="#virtual-closet" className="nav-link active" aria-current="page">Virtual Closet</a>
        <a href="#our-story" className="nav-link">Our Story</a>
      </nav>

      {/* Utilities & User Actions */}
      <div className="header-actions">
        <button className="action-icon-btn" aria-label="Search collection">
          <Search size={19} strokeWidth={1.5} />
        </button>

        <button className="action-icon-btn" aria-label={`View Liked Sarees (${likedCount})`}>
          <Heart size={19} strokeWidth={1.5} />
          {likedCount > 0 && <span className="badge-count">{likedCount}</span>}
        </button>

        <button className="action-icon-btn" aria-label="Shopping bag with 1 item">
          <ShoppingBag size={19} strokeWidth={1.5} />
          <span className="badge-count">1</span>
        </button>

        {/* User Account Avatar */}
        <div 
          className="user-avatar-badge" 
          tabIndex={0} 
          role="button" 
          aria-label="User profile: Hemanth"
          title="Curator Profile: Hemanth"
        >
          H
        </div>
      </div>
    </header>
  );
};
