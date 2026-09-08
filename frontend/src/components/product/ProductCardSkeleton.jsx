import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col w-full gap-3">
      {/* Image Skeleton */}
      <Skeleton className="aspect-[3/4] w-full rounded-md" />
      
      {/* Name and Price Skeletons */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4 rounded-sm" />
        <Skeleton className="h-4 w-1/4 rounded-sm" />
      </div>
    </div>
  )
}

export default ProductCardSkeleton
