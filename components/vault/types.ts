export interface Product {
  id: string;
  name: string;
  articleNumber: string;
  category: string;
  description: string;
  price: number;
  modelUrl?: string; // Optional 3D GLB model path
  cutoutImage: string; // Transparent PNG cutout of authentic draped saree
  image: string; // High-res draped saree image
  foldedImage: string; // Folded on wooden shelf
  thumbnail: string;
  colorName: string;
  hexColor: string;
  accentColor: string;
  status: 'owned' | 'liked';
  details: {
    weave: string;
    zari: string;
    fabric: string;
    origin: string;
    length: string;
    weight: string;
    certification: string;
  };
}

export interface UserClosetState {
  activeProductId: string;
  hoveredProductId: string | null;
  selectedProductId: string;
  ownedIds: string[];
  likedIds: string[];
  isTransitioning: boolean;
  filterView?: 'all' | 'owned' | 'liked';
}
