import React, { useEffect, useState } from 'react'
import { useShop } from '../hook/useShop'
import { toast } from 'react-toastify'
import OrderStatusBadge from './order/OrderStatusBadge'
import ProductPrice from './product/ProductPrice'
import { 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  ShoppingBag,
  RefreshCw,
  Info,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  AlertTriangle
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

const ListOrders = () => {
  const { GetAllOrdersFunc, UpdateOrderStatusFunc, currency, delivery_fee } = useShop()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const fetchOrders = async (showToast = false) => {
    setLoadingOrders(true)
    try {
      const res = await GetAllOrdersFunc()
      if (res && res.allOrders) {
        // Sort orders by date descending
        const sorted = res.allOrders.sort((a, b) => new Date(b.date) - new Date(a.date))
        setOrders(sorted)
        if (showToast) {
          toast.success("Order records updated successfully!")
        }
      } else {
        toast.error("Failed to load store order log")
      }
    } catch (err) {
      console.error(err)
      toast.error("Error fetching order logs")
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await UpdateOrderStatusFunc({ orderId, status: newStatus })
      if (res && res.message === 'Status updated successfully') {
        toast.success(`Order status updated to "${newStatus}"!`)
        // Update states
        setOrders(prev => 
          prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
        )
        // If the selected order is open in sheet drawer, update it too
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }))
        }
      } else {
        toast.error(res?.message || 'Failed to update order status')
      }
    } catch (err) {
      console.log(err)
      toast.error('Error updating order status')
    }
  }

  // Derive stats
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Failed').length
  const completedOrders = orders.filter(o => o.status === 'Delivered').length
  const requiredCheckCount = orders.filter(o => o.status === 'REQUIRED_CHECK').length
  const paidRevenue = orders.reduce((sum, o) => sum + (o.payment ? o.amount : 0), 0)

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(o => o.status === filterStatus)

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  const formatPrice = (val) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val)
    }
    return val
  }

  const statusCategories = ['All', 'REQUIRED_CHECK', 'Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered', 'Failed']

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 font-sans min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/40 select-none">
        <div>
          <h1 className="text-xl sm:text-2xl font-display text-foreground tracking-normal uppercase">Order Management</h1>
          <p className="text-xs text-[#756E67] mt-1">Track store transactions, resolve stock checks, or update fulfillment statuses.</p>
        </div>
        <button
          onClick={() => fetchOrders(true)}
          className="h-10 px-4 border border-border hover:bg-muted font-medium text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer select-none"
        >
          <RefreshCw className="size-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <div className="bg-white p-5 rounded-xs border border-[#E5DED4] flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#756E67] uppercase tracking-widest font-semibold">Total Orders</span>
            <span className="text-lg font-bold text-foreground font-sans">{totalOrders}</span>
          </div>
          <div className="p-2.5 bg-[#FAF8F4] text-primary border border-border rounded-sm">
            <ShoppingBag className="size-4.5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xs border border-[#E5DED4] flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#756E67] uppercase tracking-widest font-semibold font-sans">Required Check</span>
            <span className={`text-lg font-bold font-sans ${requiredCheckCount > 0 ? 'text-amber-700' : 'text-foreground'}`}>
              {requiredCheckCount}
            </span>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-800 rounded-sm">
            <AlertTriangle className="size-4.5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xs border border-[#E5DED4] flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#756E67] uppercase tracking-widest font-semibold">Delivered</span>
            <span className="text-lg font-bold text-foreground font-sans">{completedOrders}</span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-sm">
            <CheckCircle className="size-4.5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xs border border-[#E5DED4] flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#756E67] uppercase tracking-widest font-semibold">Paid Revenue</span>
            <span className="text-lg font-bold text-[#6F1D2B] font-sans">{currency}{formatPrice(paidRevenue)}</span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-sm">
            <TrendingUp className="size-4.5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs selection */}
      <div className="flex overflow-x-auto gap-2 border-b border-border pb-1 select-none scrollbar-none">
        {statusCategories.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 text-[10px] sm:text-xs uppercase tracking-widest font-bold border-b-2 whitespace-nowrap transition-all duration-300 cursor-pointer ${
              filterStatus === status 
                ? 'border-[#6F1D2B] text-[#6F1D2B]' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* List content / skeletons */}
      {loadingOrders ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(idx => (
            <div key={idx} className="border border-border/40 p-5 rounded-xs flex flex-col gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-border/30">
                <Skeleton className="h-4 w-32 bg-border/50" />
                <Skeleton className="h-6 w-24 bg-border/50 rounded-full" />
              </div>
              <Skeleton className="h-4 w-72 bg-border/50" />
              <Skeleton className="h-9 w-full bg-border/50" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[#E5DED4] rounded-xs bg-[#FAF8F4]/40 select-none text-center">
          <Info className="size-10 text-muted-foreground/50 mb-3" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">No Orders Logged</h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">There are no client orders currently with category status "{filterStatus}".</p>
        </div>
      ) : (
        /* Orders list grid card details */
        <div className="grid grid-cols-1 gap-4 font-sans">
          {filteredOrders.map((order) => {
            const truncatedId = String(order._id).substring(String(order._id).length - 8)

            return (
              <div
                key={order._id}
                className="border border-border/60 hover:border-border transition-colors duration-300 rounded-xs bg-white overflow-hidden flex flex-col justify-between"
              >
                {/* Order header row card */}
                <div className="bg-[#FAF8F4] border-b border-border/45 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-4 text-muted-foreground font-medium select-none">
                    <div>
                      <span className="uppercase tracking-widest text-[9px] block text-[#756E67] font-semibold mb-0.5">Order ID</span>
                      <span className="font-semibold text-foreground font-mono uppercase">#{truncatedId}</span>
                    </div>
                    <div>
                      <span className="uppercase tracking-widest text-[9px] block text-[#756E67] font-semibold mb-0.5">Transaction Date</span>
                      <span className="font-semibold text-foreground font-sans">{formatDate(order.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center shrink-0">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>

                {/* Items and client address details */}
                <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-12 gap-5 select-none">
                  {/* Left Column: Products purchased preview */}
                  <div className="md:col-span-6 flex flex-col gap-3">
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Ordered items</span>
                    <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <img 
                            src={item.images?.[0] || item.image?.[0]} 
                            alt={item.name} 
                            className="size-9 object-cover rounded-xs border border-border/20 bg-muted" 
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Size: {item.size} &bull; Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-[10px] text-muted-foreground italic pl-1">
                          + {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Customer details */}
                  <div className="md:col-span-6 flex flex-col gap-2 bg-muted/20 border border-border/25 p-3 rounded-xs text-xs">
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Billing Customer</span>
                    <div>
                      <p className="font-bold text-foreground">
                        {order.address?.firstName} {order.address?.lastName}
                      </p>
                      <p className="text-muted-foreground text-[10px] truncate mt-0.5">
                        {order.address?.email} &bull; {order.address?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final summary footer row */}
                <div className="border-t border-border/40 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none bg-[#FAF8F4]/30">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Payment:</span>
                      <span className={`font-semibold ml-1.5 ${order.payment ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {order.payment ? 'Paid' : 'COD/Pending'} ({order.paymentMethod})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Total Price:</span>
                      <span className="font-extrabold text-[#6F1D2B] ml-1.5">{currency}{formatPrice(order.amount)}</span>
                    </div>
                  </div>

                  {/* Action CTA triggers */}
                  <div className="flex items-center gap-2">
                    <div className="w-40 select-none leading-none">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="w-full h-8 px-2 border border-border bg-white rounded-xs text-[10px] uppercase tracking-wider font-semibold cursor-pointer outline-none focus:border-[#C6A15B]"
                      >
                        <option value="REQUIRED_CHECK">REQUIRED CHECK</option>
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      type="button"
                      className="h-8 px-4 bg-primary hover:bg-[#591621] text-primary-foreground text-[9px] uppercase tracking-wider font-sans font-semibold rounded-xs shadow-xs transition-colors cursor-pointer outline-hidden whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Slide-over sheet for order detailed items */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent side="right" className="w-[90vw] sm:max-w-md bg-white border-l border-border p-6 flex flex-col h-full font-sans overflow-y-auto">
          {selectedOrder && (
            <div className="flex flex-col gap-5 pb-8 selection:bg-primary/10">
              
              {/* Header */}
              <div>
                <h2 className="text-lg font-display uppercase tracking-widest text-[#6F1D2B] mb-1">Store Order Fulfillment</h2>
                <div className="h-[1.5px] w-12 bg-[#C6A15B] mb-4"></div>
                <div className="text-xs text-muted-foreground flex flex-col gap-1 select-none">
                  <span>Order ID: <span className="font-semibold text-foreground uppercase">{selectedOrder._id}</span></span>
                  <span>Date Placed: <span className="font-semibold text-foreground">{formatDate(selectedOrder.date)}</span></span>
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Status Selector */}
              <div className="flex flex-col gap-2 p-3 border border-border bg-[#FAF8F4]/30 rounded-xs select-none">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Update Order Status</span>
                <div className="flex items-center gap-3">
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className="flex-1 h-9 px-3 border border-border bg-white rounded-xs text-xs font-semibold uppercase tracking-wider cursor-pointer outline-none focus:border-[#C6A15B]"
                  >
                    <option value="REQUIRED_CHECK">REQUIRED CHECK</option>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Failed">Failed</option>
                  </select>
                  <OrderStatusBadge status={selectedOrder.status} />
                </div>
              </div>

              {/* Purchased Products Segment */}
              <div className="flex flex-col gap-3 font-sans select-none">
                <h3 className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Purchased Items</h3>
                <div className="flex flex-col gap-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4.5 items-start py-2 border-b border-border/10 last:border-b-0">
                      <div className="w-10 aspect-[3/4] shrink-0 bg-muted rounded-xs overflow-hidden border border-border/10">
                        <img 
                          src={item.images?.[0] || item.image?.[0]} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-grow min-w-0 pr-4">
                        <h4 className="text-xs font-semibold text-foreground truncate">{item.name}</h4>
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
              <div className="flex flex-col gap-2 font-sans select-none">
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                  <MapPin className="size-4 text-primary" />
                  <span>Fulfillment Destination</span>
                </div>
                {selectedOrder.address ? (
                  <div className="bg-[#FAF8F4]/50 border border-border/30 p-4 rounded-xs text-xs text-foreground leading-relaxed leading-5">
                    <p className="font-bold">{selectedOrder.address.firstName} {selectedOrder.address.lastName}</p>
                    <p className="text-muted-foreground mt-0.5">{selectedOrder.address.street}</p>
                    <p className="text-muted-foreground">{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.zipcode}</p>
                    <p className="text-muted-foreground">{selectedOrder.address.country}</p>
                    <div className="border-t border-border/20 pt-2 mt-2 flex flex-col gap-0.5">
                      <p className="text-muted-foreground">Phone: <span className="font-medium text-foreground">{selectedOrder.address.phone}</span></p>
                      {selectedOrder.address.email && <p className="text-muted-foreground">Email: <span className="font-medium text-foreground">{selectedOrder.address.email}</span></p>}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">No address files bound.</div>
                )}
              </div>

              <Separator className="bg-border/60 font-sans" />

              {/* Invoice breakdown Segment */}
              <div className="flex flex-col gap-4 font-sans select-none">
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                  <CreditCard className="size-4 text-primary" />
                  <span>Invoice Breakdown</span>
                </div>
                
                <div className="flex flex-col gap-3.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Payment Interface</span>
                    <span className="font-semibold text-foreground uppercase">{selectedOrder.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Payment Status</span>
                    <span className={`font-semibold ${selectedOrder.payment ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {selectedOrder.payment ? 'PAID / SETTLED' : 'DUE / UNPAID'}
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
                    <span>Delivery Charge</span>
                    <span className="font-medium text-foreground">
                      {selectedOrder.amount - delivery_fee === 0 ? "Free" : `${currency}${formatPrice(delivery_fee)}`}
                    </span>
                  </div>

                  <div className="border-b border-border/40 my-1"></div>

                  <div className="flex justify-between text-sm select-none pt-1">
                    <span className="font-display font-medium text-foreground uppercase tracking-widest text-[10px] self-center">Grand Invoice Total</span>
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

export default ListOrders