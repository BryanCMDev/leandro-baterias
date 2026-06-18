"use client";

import React from "react";
import Link from "next/link";

interface ProductFiltersProps {
  brands: { slug: string; name: string }[];
  categories: { slug: string; name: string }[];
  currentBrand?: string;
  currentCategory?: string;
}

export function ProductFilters({ brands, categories, currentBrand, currentCategory }: ProductFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/products"
        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
          !currentBrand && !currentCategory
            ? "bg-primary-100 text-primary-700"
            : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
        }`}
      >
        Todos
      </Link>
      {brands.map((brand) => (
        <Link
          key={brand.slug}
          href={`/products?brand=${brand.slug}`}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
            currentBrand === brand.slug
              ? "bg-primary-100 text-primary-700"
              : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
          }`}
        >
          {brand.name}
        </Link>
      ))}
    </div>
  );
}
