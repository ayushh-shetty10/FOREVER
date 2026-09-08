import React from 'react'
import { useShop } from '../hook/useShop'

const CartTotal = ({ showTitle = true }) => {
  const { currency, delivery_fee, GetCartAmount } = useShop()

  const formatPrice = (val) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val)
    }
    return val
  }

  const subtotal = GetCartAmount()
  const shipping = subtotal === 0 ? 0 : delivery_fee
  const total = subtotal === 0 ? 0 : subtotal + shipping

  return (
    <div className="w-full font-sans text-sm">
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-lg font-display tracking-widest text-[#6F1D2B] uppercase">Order Summary</h2>
          <div className="h-[1px] w-12 bg-[#C6A15B] mt-2"></div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Subtotal */}
        <div className="flex justify-between text-muted-foreground select-none">
          <span className="font-light tracking-wide uppercase text-[11px]">Subtotal</span>
          <span className="font-medium text-foreground">
            {currency}{formatPrice(subtotal)}
          </span>
        </div>
        
        <div className="border-b border-border/40"></div>

        {/* Shipping */}
        <div className="flex justify-between text-muted-foreground select-none">
          <span className="font-light tracking-wide uppercase text-[11px]">Shipping Fee</span>
          <span className="font-medium text-foreground">
            {shipping === 0 ? 'Complimentary' : `${currency}${formatPrice(shipping)}`}
          </span>
        </div>

        <div className="border-b border-border/40"></div>

        {/* Total */}
        <div className="flex justify-between text-base select-none pt-2">
          <span className="font-display font-medium text-foreground uppercase tracking-widest text-[11px] self-center">Total</span>
          <span className="font-semibold text-lg text-primary tracking-wide">
            {currency}{formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartTotal