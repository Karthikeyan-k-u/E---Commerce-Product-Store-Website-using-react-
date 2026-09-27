import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { RevealOnScroll } from '../motion/RevealOnScroll';
import { Sparkles } from 'lucide-react';

interface RelatedProductsProps {
  currentProduct: Product;
  allProducts: Product[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, allProducts }) => {
  const related = allProducts
    .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-12 border-t border-surface-border">
      <RevealOnScroll variant="fade-up">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
            You May Also Like
          </h3>
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {related.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
};
