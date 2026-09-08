import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useShop } from '../hook/useShop'
import { toast } from 'react-toastify'
import { assets } from '../assets/frontend_assets/assets'
import { Search, User, ShoppingBag, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { GetCartCount, LogoutFunc, setUser, user } = useShop()
  const navigate = useNavigate()
  const location = useLocation()

  // Track scroll position to update sticky styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      const response = await LogoutFunc()
      if (response.message === "User logged out successfully!") {
        toast("Logout Successful!")
        setUser(null)
        navigate("/login")
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      console.log(err + " Failed to Logout")
    }
  }

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'COLLECTIONS', path: '/collection' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ]

  // Add Admin option if logged-in user is an administrator
  if (user && user.role === "ADMIN") {
    navLinks.push({ name: 'ADMIN', path: '/admin' })
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Announcement Bar */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-foreground text-background py-1.5 text-center text-[10px] tracking-[0.18em] font-medium uppercase overflow-hidden"
          >
            Complimentary standard shipping on all orders
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-background/90 backdrop-blur-md shadow-subtle border-b border-border/40 py-3'
            : 'bg-background py-5'
        }`}
      >
        <div className="container-store flex items-center justify-between">
          {/* Brand/Logo Section */}
          <Link to="/" className="flex items-center outline-hidden">
            <img src={assets.logo} className="w-28 sm:w-32 transition-all" alt="Forever Logo" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-xs tracking-[0.2em] font-medium py-1 hover:text-primary transition-colors outline-hidden ${
                  isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Icons Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Icon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate('/collection')}
                  className="p-2 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer outline-hidden"
                  aria-label="Search Catalog"
                >
                  <Search className="size-4.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>

            {/* Profile Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer outline-hidden"
                    aria-label="User Account"
                  >
                    <User className="size-4.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border border-border rounded-md shadow-md p-1 font-sans">
                  <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                    Signed in as <span className="font-semibold text-foreground truncate block">{user.username || user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer w-full text-left block text-sm px-2 py-1.5 rounded-sm hover:bg-muted transition-colors">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer w-full text-left block text-sm px-2 py-1.5 rounded-sm transition-colors"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate('/login')}
                    className="p-2 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer outline-hidden"
                    aria-label="Login"
                  >
                    <User className="size-4.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Login</TooltipContent>
              </Tooltip>
            )}

            {/* Cart Link */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/cart"
                  className="relative p-2 rounded-full hover:bg-muted text-foreground transition-colors outline-hidden"
                  aria-label="Shopping Cart"
                >
                  <ShoppingBag className="size-4.5" />
                  {GetCartCount() > 0 && (
                    <motion.span
                      key={GetCartCount()}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-1.5 right-1.5 size-4.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center translate-x-1/4 -translate-y-1/4"
                    >
                      {GetCartCount()}
                    </motion.span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>Cart</TooltipContent>
            </Tooltip>

            {/* Mobile Sheet Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-full hover:bg-muted text-foreground transition-colors sm:hidden cursor-pointer outline-hidden"
                  aria-label="Toggle Navigation Drawer"
                >
                  <Menu className="size-4.5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:max-w-xs bg-background border-l border-border p-6 flex flex-col justify-between font-sans">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <span className="font-display text-lg tracking-widest text-foreground">FOREVER</span>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.name}>
                        <Link
                          to={link.path}
                          className={`text-xs tracking-[0.2em] font-medium py-2 border-b border-border/40 hover:text-primary transition-colors ${
                            isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>

                <div className="border-t border-border pt-4 mt-auto flex flex-col gap-4">
                  {user ? (
                    <>
                      <div className="flex flex-col gap-1 px-1">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Signed in as</span>
                        <span className="text-xs font-semibold text-foreground truncate block">{user.username || user.email}</span>
                      </div>
                      <SheetClose asChild>
                        <Link to="/orders" className="text-xs uppercase tracking-widest font-medium py-2 hover:text-primary transition-colors">
                          My Orders
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <button
                          onClick={handleLogout}
                          className="text-xs uppercase tracking-widest font-medium py-2 text-destructive hover:text-destructive/80 transition-colors text-left cursor-pointer"
                        >
                          Logout
                        </button>
                      </SheetClose>
                    </>
                  ) : (
                    <SheetClose asChild>
                      <Link
                        to="/login"
                        className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-center hover:bg-primary/95 transition-colors block text-xs tracking-widest uppercase"
                      >
                        Login
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Navbar