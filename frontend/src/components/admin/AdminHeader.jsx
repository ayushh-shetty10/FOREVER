import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useShop } from '../../hook/useShop'
import { assets } from '../../assets/frontend_assets/assets'
import { LogOut, Store, User } from 'lucide-react'
import { toast } from 'react-toastify'

const AdminHeader = () => {
  const { user, LogoutFunc, setUser } = useShop()
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

  return (
    <header className="sticky top-0 z-35 w-full bg-white border-b border-[#E5DED4] py-4 px-6 md:px-8 flex items-center justify-between font-sans">
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2 outline-hidden">
        <img src={assets.logo} className="w-24 md:w-28 transition-all" alt="Forever Logo" />
        <span className="text-[10px] tracking-[0.25em] font-medium text-[#C6A15B] uppercase border-l border-[#E5DED4] pl-3 ml-1 select-none">
          Admin Portal
        </span>
      </Link>

      {/* Admin stats/actions */}
      <div className="flex items-center gap-4 md:gap-6">
        <Link 
          to="/" 
          className="hidden sm:flex items-center gap-2 text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors uppercase font-medium select-none"
        >
          <Store className="size-4" />
          <span>View Storefront</span>
        </Link>

        {user && (
          <div className="flex items-center gap-3 border-l border-[#E5DED4] pl-4 md:pl-6">
            <div className="size-8 rounded-full bg-muted flex items-center justify-center text-[#6F1D2B] font-semibold border border-border/10 select-none">
              <User className="size-4" />
            </div>
            <div className="hidden md:flex flex-col select-none">
              <span className="text-xs font-semibold text-foreground leading-none">
                {user.username || "Operator"}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 font-medium">
                {user.role}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-[#6F1D2B] hover:bg-muted/80 rounded-full transition-colors cursor-pointer outline-hidden"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default AdminHeader
