import React, { useEffect, useState } from 'react'
import { useShop } from '../../hook/useShop'
import { toast } from 'react-toastify'
import OrderStatusBadge from '../order/OrderStatusBadge'
import ProductPrice from '../product/ProductPrice'
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  Award,
  RefreshCw,
  Clock,
  ArrowUpRight
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

const AdminDashboard = ({ onTabChange }) => {
  const { GetAllOrdersFunc, products, currency, loading } = useShop()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  const fetchDashboardData = async () => {
    setLoadingOrders(true)
    try {
      const res = await GetAllOrdersFunc()
      if (res && res.allOrders) {
        // Sort orders by date descending
        const sorted = res.allOrders.sort((a, b) => new Date(b.date) - new Date(a.date))
        setOrders(sorted)
      } else {
        toast.error("Failed to load business orders")
      }
    } catch (err) {
      console.log(err)
      toast.error("Error loading dashboard data")
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + (order.payment ? order.amount : 0), 0)
  const totalOrders = orders.length
  const productsCount = products.length
  const bestsellerCount = products.filter(p => p.bestseller).length
  const recentOrders = orders.slice(0, 5)

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

  if (loadingOrders || loading) {
    return (
      <div className="p-6 md:p-8 flex flex-col gap-6 font-sans">
        {/* Title skeleton */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <Skeleton className="h-8 w-44 bg-border/50 mb-2" />
            <Skeleton className="h-4 w-72 bg-border/50" />
          </div>
          <Skeleton className="h-10 w-24 bg-border/50" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="bg-white border border-border p-5 rounded-xs flex flex-col gap-3">
              <Skeleton className="h-4 w-20 bg-border/50" />
              <Skeleton className="h-7 w-32 bg-border/50" />
            </div>
          ))}
        </div>

        {/* Feed skeleton */}
        <div className="bg-white border border-[#E5DED4] rounded-xs p-6 flex flex-col gap-4 mt-4">
          <Skeleton className="h-5 w-40 bg-border/50" />
          <Separator />
          {[1,2,3].map((idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div className="flex gap-4">
                <Skeleton className="size-10 bg-border/50 rounded-xs" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32 bg-border/50" />
                  <Skeleton className="h-3 w-20 bg-border/50" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 bg-border/50 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-xl sm:text-2xl font-display text-foreground tracking-normal uppercase">Operations Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Realtime high-level summaries derived from active catalog items and orders.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="h-10 px-4 border border-border hover:bg-muted font-medium text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer select-none"
        >
          <RefreshCw className="size-3.5" />
          <span>Refresh Stats</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white p-5 rounded-xs border border-[#E5DED4] flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1 select-none">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Total Revenue</span>
            <span className="text-lg sm:text-xl font-bold text-foreground font-sans">
              {currency}{formatPrice(totalRevenue)}
            </span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-sm">
            <TrendingUp className="size-5" />
          </div>
        </div>

        {/* Orders */}
        <button
          onClick={() => onTabChange && onTabChange('orders')}
          className="bg-white p-5 rounded-xs border border-[#E5DED4] hover:border-primary/45 transition-colors flex items-center justify-between shadow-xs text-left cursor-pointer outline-hidden"
        >
          <div className="flex flex-col gap-1 select-none">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Total Orders</span>
            <span className="text-lg sm:text-xl font-bold text-foreground font-sans">{totalOrders}</span>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-800 rounded-sm">
            <ShoppingBag className="size-5" />
          </div>
        </button>

        {/* Catalog */}
        <button
          onClick={() => onTabChange && onTabChange('items')}
          className="bg-white p-5 rounded-xs border border-[#E5DED4] hover:border-primary/45 transition-colors flex items-center justify-between shadow-xs text-left cursor-pointer outline-hidden"
        >
          <div className="flex flex-col gap-1 select-none">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Collection Size</span>
            <span className="text-lg sm:text-xl font-bold text-foreground font-sans">{productsCount}</span>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-800 rounded-sm">
            <Package className="size-5" />
          </div>
        </button>

        {/* Bestsellers */}
        <div className="bg-white p-5 rounded-xs border border-[#E5DED4] flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1 select-none">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Bestsellers</span>
            <span className="text-lg sm:text-xl font-bold text-foreground font-sans">{bestsellerCount}</span>
          </div>
          <div className="p-2.5 bg-rose-50 text-[#6F1D2B] rounded-sm">
            <Award className="size-5" />
          </div>
        </div>
      </div>

      {/* Recent Activity Rows */}
      <div className="bg-white border border-[#E5DED4] rounded-xs p-6 flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between select-none">
          <h3 className="text-xs uppercase tracking-widest text-[#6F1D2B] font-bold">Recent Store Sales</h3>
          <button 
            onClick={() => onTabChange && onTabChange('orders')}
            className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>
        
        <Separator className="bg-border/60" />

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-xs text-muted-foreground select-none">
            No sales recorded yet. When a customer orders, it will appear here.
          </div>
        ) : (
          <div className="flex flex-col gap-3 font-sans">
            {recentOrders.map((order, orderIdx) => {
              const orderIdTrunc = String(order._id).substring(String(order._id).length - 8)
              const firstItem = order.items?.[0]
              
              return (
                <div 
                  key={order._id || orderIdx}
                  className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/20 last:border-b-0 pb-3 last:pb-0 gap-3"
                >
                  {/* Left block information */}
                  <div className="flex gap-4 items-center">
                    <div className="size-10 bg-muted/65 rounded-xs flex items-center justify-center text-primary/80 shrink-0 select-none">
                      <Clock className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wide">#{orderIdTrunc}</span>
                        <span className="text-[10px] text-muted-foreground select-none">&bull; {formatDate(order.date)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground select-none mt-0.5">
                        Customer: <span className="font-semibold text-foreground">{order.address?.firstName} {order.address?.lastName}</span>
                        {firstItem && (
                          <span> &bull; Bought: <span className="text-[#C6A15B] font-medium">{firstItem.name}</span> {order.items.length > 1 ? `+ ${order.items.length - 1} more` : ''}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right block figures/statuses */}
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-left md:text-right">
                      <ProductPrice price={order.amount} className="text-xs font-semibold text-foreground" />
                      <span className="text-[9px] text-muted-foreground block uppercase mt-0.5 select-none font-medium">
                        Payment: {order.payment ? "Paid" : "Pending"}
                      </span>
                    </div>
                    <div className="shrink-0">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
