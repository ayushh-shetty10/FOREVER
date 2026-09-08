import React, { useEffect, useState } from 'react'
import { useShop } from '../hook/useShop'
import CartTotal from '../components/CartTotal'
import ProductPrice from '../components/product/ProductPrice'
import { useNavigate, Link } from 'react-router-dom'
import { Trash2, ShoppingBag } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const Cart = () => {
  const { products, cartItems, UpdateCartFunc, GetCartCount } = useShop()
  const [cartData, setCartData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let tempData = []
    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          tempData.push({
            _id: item,
            size: size,
            quantity: cartItems[item][size]
          })
        }
      }
    }
    setCartData(tempData)
  }, [cartItems])

  const handleQtyChange = (itemId, size, val) => {
    if (val < 1) return
    UpdateCartFunc(itemId, size, val)
  }

  const handleRemoveItem = (itemId, size) => {
    UpdateCartFunc(itemId, size, 0)
  }

  if (cartData.length === 0) {
    return (
      <div className="container-store py-16 min-h-[70vh] flex flex-col items-center justify-center text-center font-sans">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center text-primary/80 mb-6 select-none">
          <ShoppingBag className="size-8" />
        </div>
        <h2 className="text-2xl font-display text-foreground uppercase tracking-widest mb-3">Your bag is empty</h2>
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-8 select-none">
          Discover the timeless elegance of handcrafted Banarasi, Kanjivaram and Organza sarees. Add your favorites to start your styling story.
        </p>
        <Link 
          to="/collection" 
          className="px-8 py-3 bg-primary hover:bg-[#591621] text-primary-foreground text-xs uppercase tracking-widest font-sans font-medium rounded-xs shadow-subtle hover:shadow-elevated transition-all duration-300 active:scale-[0.98] select-none"
        >
          Explore Collection
        </Link>
      </div>
    )
  }

  const totalItems = GetCartCount()

  return (
    <div className="container-store py-8 min-h-screen font-sans">
      {/* Breadcrumb Section */}
      <div className="flex gap-2 items-center text-xs tracking-wider text-muted-foreground uppercase mb-6 select-none">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Shopping Bag</span>
      </div>

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-border/40 gap-4">
        <div>
          <h1 className="text-h2 font-display text-foreground tracking-normal uppercase">Your Shopping Bag</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review your premium selections ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </p>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id)
            if (!productData) return null

            return (
              <div 
                key={`${item._id}-${item.size}-${index}`}
                className="flex items-start justify-between gap-4 p-4 bg-card/40 border border-border/50 rounded-md hover:border-border transition-colors duration-300"
              >
                {/* Product Thumbnail and details block */}
                <div className="flex gap-4">
                  {/* Aspect Ratio 3:4 Box */}
                  <div className="w-20 md:w-24 aspect-[3/4] shrink-0 bg-muted rounded-sm overflow-hidden border border-border/10">
                    <img 
                      src={productData.images[0]} 
                      alt={productData.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      {/* Name */}
                      <h3 className="text-sm font-medium text-foreground tracking-wide mb-1.5 md:text-base">
                        {productData.name}
                      </h3>
                      {/* Category metadata */}
                      <p className="text-[10px] text-[#C6A15B] font-semibold tracking-wider uppercase mb-3">
                        {productData.category} &bull; {productData.subCategory}
                      </p>
                      {/* Size tag */}
                      <div className="inline-block bg-muted/60 text-muted-foreground text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-xs select-none">
                        SIZE: {item.size}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mt-3">
                      <ProductPrice price={productData.price} className="text-sm text-foreground font-semibold" />
                    </div>
                  </div>
                </div>

                {/* Steppers & actions */}
                <div className="flex flex-col items-end justify-between h-full min-h-[90px] min-w-[100px]">
                  {/* Trash action */}
                  <button 
                    onClick={() => handleRemoveItem(item._id, item.size)}
                    type="button" 
                    className="p-1 text-muted-foreground/80 hover:text-destructive transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="size-[18px]" />
                  </button>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-border/60 rounded-xs bg-[#FAF8F4] h-9 select-none overflow-hidden scale-90 md:scale-100">
                    <button
                      onClick={() => handleQtyChange(item._id, item.size, item.quantity - 1)}
                      type="button"
                      disabled={item.quantity <= 1}
                      className="px-3 h-full text-md font-light text-muted-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                    >
                      &minus;
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQtyChange(item._id, item.size, item.quantity + 1)}
                      type="button"
                      className="px-3 h-full text-md font-light text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Column: Order Summary card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-[#F1EDE6]/30 border border-border/40 p-6 rounded-md">
            <CartTotal showTitle={true} />
            
            <Separator className="bg-border/60 my-6" />

            <button
              onClick={() => navigate('/place-order')}
              type="button"
              className="w-full h-12 bg-primary hover:bg-[#591621] text-primary-foreground text-xs uppercase tracking-widest font-sans font-medium rounded-xs shadow-subtle hover:shadow-elevated transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-[0.98]"
            >
              Proceed to checkout
            </button>
            
            <p className="text-[10px] text-muted-foreground font-sans font-light leading-relaxed mt-4 text-center">
              Shipping & taxes calculated at checkout. Safe and secure checkout guaranteed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart