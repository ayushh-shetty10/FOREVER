import React from 'react'

const ProductBadge = ({ children, className = '' }) => {
  return (
    <span className={`inline-block bg-background/95 backdrop-blur-xs text-[9px] font-semibold tracking-widest text-primary uppercase px-2 py-0.5 rounded-xs border border-border/20 shadow-xs ${className}`}>
      {children}
    </span>
  )
}

export default ProductBadge
