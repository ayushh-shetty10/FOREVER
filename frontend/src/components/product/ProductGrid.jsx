import React from 'react'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'

const ProductGrid = ({ 
  products = [], 
  isLoading = false, 
  skeletonCount = 8,
  columnsClassName = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4' 
}) => {
  if (isLoading) {
    return (
      <div className={`grid gap-x-4 gap-y-8 ${columnsClassName}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="w-full text-center py-20 flex flex-col items-center justify-center gap-4 bg-[#F1EDE6]/30 border border-border/30 rounded-md p-6 font-sans">
        <h3 className="font-display text-lg tracking-widest text-foreground uppercase">No Products Found</h3>
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
          We couldn't find any items matching your current filters. Please adjust your criteria or try searching for something else.
        </p>
      </div>
    )
  }

  return (
    <div className={`grid gap-x-4 gap-y-8 ${columnsClassName}`}>
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
