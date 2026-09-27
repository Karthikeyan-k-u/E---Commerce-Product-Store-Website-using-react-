import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { PackageOpen } from 'lucide-react';
import { staggerContainer } from '../../lib/animations';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onResetFilters?: () => void;
  skeletonCount?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onResetFilters,
  skeletonCount = 8,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<PackageOpen className="w-8 h-8" />}
        title="No Products Found"
        description="We couldn't find any products matching your current filters or search term."
        actionLabel={onResetFilters ? 'Clear All Filters' : 'Browse All Products'}
        onAction={onResetFilters}
        className="py-16"
      />
    );
  }

  return (
    <motion.div
      variants={staggerContainer(0.06, 0.05)}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
};
