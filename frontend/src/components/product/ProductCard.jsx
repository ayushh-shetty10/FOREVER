import React from 'react'
import { Link } from 'react-router-dom'
import ProductBadge from './ProductBadge'
import ProductPrice from './ProductPrice'

const ProductCard = ({ product }) => {
  if (!product) return null

  const id = product._id || product.id
  const name = product.name
  const price = product.price
  const images = product.images || []
  const bestseller = product.bestseller
  const availableStock = product.availableStock !== undefined ? product.availableStock : 10
  const isOutOfStock = availableStock === 0

  const primaryImage = images[0] || ''
  const secondaryImage = images[1] || null
  const hasSecondaryImage = !!secondaryImage

  return (
    <Link 
      to={`/product/${id}`} 
      className="group flex flex-col w-full outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted rounded-md border border-border/10">
        {/* Badges Container */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
          {bestseller && (
            <ProductBadge>
              Bestseller
            </ProductBadge>
          )}
          {isOutOfStock && (
            <span className="bg-destructive text-destructive-foreground text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-xs shadow-xs">
              Out of Stock
            </span>
          )}
        </div>

        {/* Fallback Image if none provided */}
        {!primaryImage ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F1EDE6] text-muted-foreground p-4">
            <span className="text-[10px] tracking-widest uppercase font-medium">No Image Available</span>
          </div>
        ) : (
          <>
            {/* Primary Image */}
            <img
              src={primaryImage}
              alt={name}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-[1.02] ${
                isOutOfStock ? 'opacity-60 grayscale-[30%]' : ''
              } ${hasSecondaryImage && !isOutOfStock ? 'group-hover:opacity-0' : ''}`}
            />
            
            {/* Secondary Hover Image */}
            {hasSecondaryImage && !isOutOfStock && (
              <img
                src={secondaryImage}
                alt={`${name} alternate view`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-[1.02] group-hover:opacity-100"
              />
            )}
          </>
        )}
      </div>

      {/* Product Information Details */}
      <div className="flex flex-col gap-1 pt-3 pb-2">
        <h3 className="text-xs sm:text-sm font-medium tracking-wide text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <ProductPrice price={price} />
          {isOutOfStock ? (
            <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">Out of Stock</span>
          ) : availableStock <= 3 ? (
            <span className="text-[9px] font-semibold text-amber-700 uppercase tracking-wider">Only {availableStock} Left</span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
