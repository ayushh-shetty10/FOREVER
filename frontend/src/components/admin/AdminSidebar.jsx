import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingBag, 
  Store, 
  LogOut,
  Menu
} from 'lucide-react'
import { useShop } from '../../hook/useShop'
import { toast } from 'react-toastify'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet'

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const { LogoutFunc, setUser } = useShop()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await LogoutFunc()
      if (response && response.message === "User logged out successfully!") {
        toast.success("Logout Successful!")
        setUser(null)
        navigate("/login")
      } else {
        toast.error(response?.message || "Failed to logout")
      }
    } catch (err) {
      console.log(err)
      toast.error("Logout failed")
    }
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'items', label: 'Products', icon: Package },
    { id: 'add', label: 'Add Product', icon: PlusCircle },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ]

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col justify-between h-full py-4 text-sans select-none">
      {/* Top Menu Links */}
      <div className="flex flex-col gap-1">
        {isMobile && (
          <div className="px-3 pb-6 mb-4 border-b border-border/40">
            <span className="text-[10px] tracking-[0.25em] font-medium text-[#C6A15B] uppercase block">
              FOREVER
            </span>
            <span className="text-xs font-semibold text-foreground mt-0.5 block">
              Store Operations
            </span>
          </div>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          const itemContent = (
            <button
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xs text-xs tracking-wider uppercase font-medium transition-all duration-300 w-full text-left cursor-pointer outline-hidden ${
                isActive
                  ? 'bg-[#6F1D2B]/5 text-[#6F1D2B] border-l-2 border-[#6F1D2B] font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-2 border-transparent'
              }`}
            >
              <Icon className={`size-4.5 transition-colors ${isActive ? 'text-[#6F1D2B]' : 'text-muted-foreground/80'}`} />
              <span>{item.label}</span>
            </button>
          )

          return isMobile ? (
            <SheetClose asChild key={item.id}>
              {itemContent}
            </SheetClose>
          ) : (
            <div key={item.id}>{itemContent}</div>
          )
        })}
      </div>

      {/* Bottom Option Links */}
      <div className="flex flex-col gap-1 border-t border-[#E5DED4] pt-4 mt-auto">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xs text-xs tracking-wider uppercase font-medium text-muted-foreground hover:text-foreground hover:bg-muted/55 transition-all duration-300 pointer-events-auto"
        >
          <Store className="size-4.5 text-muted-foreground/80" />
          <span>Storefront</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xs text-xs tracking-wider uppercase font-medium text-destructive hover:bg-destructive/5 hover:text-destructive transition-all duration-300 w-full text-left cursor-pointer outline-hidden mt-1"
        >
          <LogOut className="size-4.5 text-destructive/80" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside className="hidden md:flex flex-col w-60 border-r border-[#E5DED4] p-5 bg-white min-h-[calc(100vh-70px)] shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Header Block */}
      <div className="md:hidden w-full flex items-center justify-between border-b border-[#E5DED4] bg-white py-3 px-6 sticky top-[0px] z-30 font-sans">
        <Sheet>
          <SheetTrigger asChild>
            <button 
              className="p-2 border border-border rounded-md text-foreground bg-white hover:bg-muted/50 cursor-pointer outline-hidden"
              aria-label="Open Sidebar Menu"
            >
              <Menu className="size-4.5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-white border-r border-border p-6 flex flex-col h-full font-sans">
            <SidebarContent isMobile />
          </SheetContent>
        </Sheet>

        <span className="text-xs uppercase tracking-widest text-[#6F1D2B] font-semibold select-none">
          {menuItems.find(o => o.id === activeTab)?.label || "Operations"}
        </span>

        <div className="size-8 rounded-full bg-[#6F1D2B]/5 border border-[#6F1D2B]/10 flex items-center justify-center text-xs text-[#6F1D2B] select-none font-bold">
          AD
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
