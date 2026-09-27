import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { ProductGrid } from '../components/product/ProductGrid';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ProductCategory } from '../types';
import { ArrowLeft } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const category = useMemo(() => {
    return CATEGORIES.find((c) => c.slug.toLowerCase() === slug?.toLowerCase());
  }, [slug]);

  const products = useMemo(() => {
    if (!category) return [];
    return PRODUCTS.filter((p) => p.category.toLowerCase() === category.name.toLowerCase());
  }, [category]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Category Not Found</h2>
        <p className="text-text-muted text-sm">The category you are looking for does not exist.</p>
        <Link to="/shop" className="text-indigo-500 font-semibold underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Category Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden py-12 sm:py-16 px-6 sm:px-12 border border-slate-800 shadow-lg">
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />

          <div className="relative space-y-4 max-w-3xl">
            <Breadcrumb
              items={[
                { label: 'Shop', href: '/shop' },
                { label: category.name },
              ]}
              className="[&_a]:text-slate-300 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-slate-400"
            />
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Product Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-6">
          <span className="text-xs font-semibold text-text-muted">
            {products.length} Products Available
          </span>
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Categories
          </Link>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
};
