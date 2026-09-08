import React, { useState, useEffect } from 'react'
import { useShop } from '../hook/useShop'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import OrderStatusBadge from '../components/order/OrderStatusBadge'
import ProductPrice from '../components/product/ProductPrice'
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Compass, 
  ChevronRight,
  Info
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

const Orders = () => {
  const { currency, GetUserOrdersFunc, delivery_fee } = useShop()
  const [ordersList, setOrdersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const fetchOrders = async (showToast = false) => {
    setLoading(true)
    try {
      const res = await GetUserOrdersFunc()
      if (res && res.userOrders) {
        // Keep newest orders at the top
        setOrdersList(res.userOrders.reverse())
        if (showToast) {
          toast.success("Order status refreshed!")
        }
      }
    } catch (err) {
      console.log(err)
      toast.error("Failed to load order history")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  const formatPrice = (val) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val)
    }
    return val
  }

  if (loading) {
    return (
      <div className="container-store py-8 min-h-screen font-sans">
        {/* Skeleton Breadcrumbs */}
        <div className="flex gap-2 items-center mb-6">
          <Skeleton className="h-4 w-12 bg-border/50" />
          <Skeleton className="h-4 w-4 bg-border/50 rounded-full" />
          <Skeleton className="h-4 w-20 bg-border/50" />
        </div>

        {/* Skeleton Header */}
        <div className="mb-8 pb-4 border-b border-border/40">
          <Skeleton className="h-8 w-48 bg-border/50 mb-2" />
          <Skeleton className="h-4 w-72 bg-border/50" />
        </div>

        {/* Skeleton Order Cards List */}
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="border border-border/45 rounded-md p-6 bg-card/10 flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-border/30 pb-4">
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-32 bg-border/50" />
                  <Skeleton className="h-4 w-24 bg-border/50" />
                </div>
                <Skeleton className="h-6 w-24 bg-border/50 rounded-full" />
              </div>
              <div className="flex gap-4 py-2">
                <Skeleton className="w-12 aspect-[3/4] bg-border/50 rounded-sm" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-48 bg-border/50" />
                  <Skeleton className="h-3.5 w-24 bg-border/50" />
                </div>
              </div>
              <div className="border-t border-border/30 pt-4 flex justify-between items-center">
                <Skeleton className="h-4 w-40 bg-border/50" />
                <Skeleton className="h-9 w-28 bg-border/50 rounded-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (ordersList.length === 0) {
    return (
      <div className="container-store py-16 min-h-[70vh] flex flex-col items-center justify-center text-center font-sans">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center text-primary/80 mb-6 select-none">
          <Package className="size-8" />
        </div>
        <h2 className="text-2xl font-display text-foreground uppercase tracking-widest mb-3">No orders yet</h2>
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-8 select-none">
          Your purchase history is currently empty. Explore our collection of premium handloom sarees to make your first order.
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

  return (
    <div className="container-store py-8 min-h-screen font-sans">
      {/* Breadcrumb section */}
      <div className="flex gap-2 items-center text-xs tracking-wider text-muted-foreground uppercase mb-6 select-none">
        <Link to="/" className="hover:text-primary transition-colors flex items-center">Home</Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">My Orders</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-border/40 gap-4">
        <div>
          <h1 className="text-h2 font-display text-foreground tracking-normal uppercase">My Orders</h1>
          <p className="text-xs text-muted-foreground mt-1">
            View and manage your recent purchase history.
          </p>
        </div>
        <button 
          onClick={() => fetchOrders(true)}
          className="h-10 px-5 border border-border hover:bg-muted text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer select-none"
        >
          Refresh Status
        </button>
      </div>

      {/* Grouped Order Cards List */}
      <div className="flex flex-col gap-6">
        {ordersList.map((order, orderIndex) => {
          const totalItemsCount = order.items.reduce((acc, curr) => acc + curr.quantity, 0)
          
          return (
            <div 
              key={order._id || orderIndex}
              className="border border-border/50 rounded-md bg-card/25 hover:border-border transition-colors duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Card Top Row Header */}
              <div className="bg-[#F1EDE6]/30 border-b border-border/45 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap gap-4 text-muted-foreground select-none">
                  <div>
                    <span className="uppercase tracking-wider text-[10px] block mb-0.5 font-medium">Order Number</span>
                    <span className="font-semibold text-foreground font-sans uppercase">
                      #{String(order._id).substring(String(order._id).length - 8)}
                    </span>
                  </div>
                  <div>
                    <span className="uppercase tracking-wider text-[10px] block mb-0.5 font-medium">Date Placed</span>
                    <span className="font-semibold text-foreground font-sans">
                      {formatDate(order.date)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center shrink-0">
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              {/* Card Middle: Products Preview */}
              <div className="px-6 py-4 flex flex-col gap-4">
                {order.items.slice(0, 2).map((item, itemIdx) => (
                  <div key={itemIdx} className="flex gap-4 items-start py-2 border-b border-border/20 last:border-0 last:pb-0">
                    <div className="w-12 aspect-[3/4] shrink-0 bg-muted rounded-sm overflow-hidden border border-border/10">
                      <img 
                        src={item.images[0]} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-4 select-none">
                      <h4 className="text-sm font-medium text-foreground tracking-wide truncate">{item.name}</h4>
                      <p className="text-[10px] text-[#C6A15B] font-semibold uppercase tracking-wider mt-0.5">
                        Size: {item.size} &bull; Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <ProductPrice price={item.price} className="text-xs font-semibold text-foreground" />
                    </div>
                  </div>
                ))}

                {/* More items indicator */}
                {order.items.length > 2 && (
                  <div className="text-xs text-muted-foreground select-none pt-2 italic">
                    + {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''} in this order.
                  </div>
                )}
              </div>

              {/* Card Bottom Row Footer */}
              <div className="border-t border-border/35 px-6 py-3 bg-[#FAF8F4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground select-none">
                    <CreditCard className="size-3.5" />
                    <span className="text-[11px] font-light">Method: {order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground select-none">
                    <Info className="size-3.5" />
                    <span className="text-[11px] font-light">
                      Payment Status: <span className={order.payment ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                        {order.payment ? "Paid" : "Pending"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground select-none">
                    <span className="text-[11px] font-light text-muted-foreground">Order Total:</span>
                    <span className="font-semibold text-primary">{currency}{formatPrice(order.amount)}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    type="button"
                    className="w-full sm:w-auto h-9 px-4 bg-primary hover:bg-[#591621] text-primary-foreground text-[10px] uppercase tracking-widest font-sans font-semibold rounded-xs shadow-xs hover:shadow-subtle transition-all duration-300 cursor-pointer"
                  >
                    View Order Details
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Side Slide-Over Sheet Drawer: Detailed View */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent side="right" className="w-[90vw] sm:max-w-md bg-background border-l border-border p-6 flex flex-col h-full font-sans overflow-y-auto">
          {selectedOrder && (
            <div className="flex flex-col gap-6 pb-8">
              {/* Header */}
              <div>
                <h2 className="text-xl font-display uppercase tracking-widest text-[#6F1D2B] mb-2 leading-tight">Order Details</h2>
                <div className="h-[1.5px] w-12 bg-[#C6A15B] mb-4"></div>
                <div className="text-xs text-muted-foreground flex flex-col gap-1 select-none">
                  <span>Order ID: <span className="font-semibold text-foreground uppercase">{selectedOrder._id}</span></span>
                  <span>Placed On: <span className="font-semibold text-foreground">{formatDate(selectedOrder.date)}</span></span>
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Status Section */}
              <div className="flex justify-between items-center bg-card/30 border border-border/40 p-3 rounded-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground select-none">Current Status</span>
                <OrderStatusBadge status={selectedOrder.status} />
              </div>

              {/* Products List Segment */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground select-none mb-1">Purchased Products</h3>
                <div className="flex flex-col gap-4">
                  {selectedOrder.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex gap-4 items-start py-2 border-b border-border/10 last:border-b-0">
                      <div className="w-12 aspect-[3/4] shrink-0 bg-muted rounded-xs overflow-hidden border border-border/10">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-grow min-w-0 pr-4 select-none">
                        <h4 className="text-xs font-medium text-foreground tracking-wide truncate">{item.name}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Size: {item.size} &bull; Qty: {item.quantity}
                        </p>
                        <div className="mt-1">
                          <ProductPrice price={item.price} className="text-xs text-foreground font-semibold" />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <ProductPrice price={item.price * item.quantity} className="text-xs font-semibold text-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Shipping Address Segment */}
              <div className="flex flex-col gap-3 font-sans select-none">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-foreground">
                  <MapPin className="size-4 text-primary" />
                  <span>Delivery Address</span>
                </div>
                {selectedOrder.address ? (
                  <div className="bg-card/10 border border-border/20 p-4 rounded-xs text-xs text-foreground leading-relaxed">
                    <p className="font-semibold">{selectedOrder.address.firstName} {selectedOrder.address.lastName}</p>
                    <p className="text-muted-foreground mt-1">{selectedOrder.address.street}</p>
                    <p className="text-muted-foreground">{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.zipcode}</p>
                    <p className="text-muted-foreground">{selectedOrder.address.country}</p>
                    <p className="text-muted-foreground mt-2 font-medium">Phone: {selectedOrder.address.phone}</p>
                    {selectedOrder.address.email && <p className="text-muted-foreground">Email: {selectedOrder.address.email}</p>}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">No address data associated with order.</div>
                )}
              </div>

              <Separator className="bg-border/60 font-sans" />

              {/* Payment details Segment */}
              <div className="flex flex-col gap-4 font-sans select-none">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-foreground">
                  <CreditCard className="size-4 text-primary" />
                  <span>Payment Invoice</span>
                </div>
                
                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Payment Method</span>
                    <span className="font-semibold text-foreground uppercase">{selectedOrder.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Invoice Status</span>
                    <span className={`font-semibold ${selectedOrder.payment ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {selectedOrder.payment ? 'PAYMENT SUCCESS' : 'PENDING PAYMENT'}
                    </span>
                  </div>

                  <div className="border-b border-border/20 my-1"></div>

                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">
                      {currency}{formatPrice(selectedOrder.amount - delivery_fee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Shipping Fee</span>
                    <span className="font-medium text-foreground">
                      {selectedOrder.amount - delivery_fee === 0 ? "Complimentary" : `${currency}${formatPrice(delivery_fee)}`}
                    </span>
                  </div>

                  <div className="border-b border-border/40 my-1"></div>

                  <div className="flex justify-between text-sm select-none pt-1">
                    <span className="font-display font-medium text-foreground uppercase tracking-widest text-[11px] self-center">Grand Total</span>
                    <span className="font-semibold text-base text-primary tracking-wide">
                      {currency}{formatPrice(selectedOrder.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Orders