import React from 'react'
import { useShop } from '../../hook/useShop'

const ProductPrice = ({ price, className = '' }) => {
  const { currency } = useShop()

  const formatPrice = (val) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val)
    }
    return val
  }

  return (
    <span className={`text-xs sm:text-sm font-semibold text-foreground ${className}`}>
      {currency}{formatPrice(price)}
    </span>
  )
}

export default ProductPrice
