import React, { useState } from 'react'
import CartTotal from '../components/CartTotal'
import ProductPrice from '../components/product/ProductPrice'
import { assets } from '../assets/frontend_assets/assets'
import { useNavigate, Link } from 'react-router-dom'
import { useShop } from '../hook/useShop'
import { toast } from 'react-toastify'
import { Separator } from '@/components/ui/separator'
import { Banknote, CreditCard, ChevronRight, AlertCircle, Trash2, RefreshCw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod")
  const navigate = useNavigate()
  const {
    cartItems,
    setCartItems,
    products,
    GetCartAmount,
    delivery_fee,
    PlaceOrderCODFunc,
    PlaceOrderStripeFunc,
    PlaceOrderRazorpayFunc,
    VerifyRazorpayFunc,
    MarkOrderFailedFunc,
    UpdateCartFunc,
    loading
  } = useShop()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  // Stock issue modal state
  const [stockIssuesModal, setStockIssuesModal] = useState({
    open: false,
    message: "",
    stockIssues: []
  })

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFormData((data) => ({ ...data, [name]: value }))
  }

  const handleStockError = (response) => {
    const issues = response?.stockIssues || []
    setStockIssuesModal({
      open: true,
      message: response?.message || "Some items in your cart are no longer available in the requested quantities.",
      stockIssues: issues
    })
  }

  const handleRemoveUnavailableItems = () => {
    if (!stockIssuesModal.stockIssues || stockIssuesModal.stockIssues.length === 0) {
      setStockIssuesModal({ open: false, message: "", stockIssues: [] })
      return
    }

    // Iterate through stockIssues and remove or adjust quantities in cart
    stockIssuesModal.stockIssues.forEach(issue => {
      const { productId, availableQuantity } = issue
      // Find matching size in cartItems for this productId
      if (cartItems[productId]) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            if (availableQuantity === 0) {
              UpdateCartFunc(productId, size, 0)
            } else {
              UpdateCartFunc(productId, size, availableQuantity)
            }
          }
        }
      }
    })

    toast.info("Updated bag to available quantities. Please retry placing your order.")
    setStockIssuesModal({ open: false, message: "", stockIssues: [] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prevent double submission if currently loading
    if (loading) return

    try {
      let orderItems = []

      for (const items in cartItems) {
        for (const size in cartItems[items]) {
          if (cartItems[items][size] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))

            if (itemInfo) {
              itemInfo.size = size
              itemInfo.quantity = cartItems[items][size]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your checkout bag is empty")
        return
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: GetCartAmount() + delivery_fee
      }

      switch (method) {
        case "cod": {
          const response = await PlaceOrderCODFunc(orderData)
          if (response && response.success === false && response.stockIssues) {
            handleStockError(response)
            return
          }
          if (response && response.message === "Order placed (COD) successfully!") {
            setCartItems({})
            toast.success("Order Placed successfully!")
            navigate("/orders")
          }
          break
        }
        case "razorpay": {
          const responseRazorpay = await PlaceOrderRazorpayFunc(orderData)
          if (responseRazorpay && responseRazorpay.success === false && responseRazorpay.stockIssues) {
            handleStockError(responseRazorpay)
            return
          }
          if (responseRazorpay && responseRazorpay.message === "Order placed (Razorpay) successfully!") {
            const { order } = responseRazorpay
            const options = {
              "key": import.meta.env.VITE_RAZORPAY_API_KEY,
              "amount": order.amount,
              "currency": order.currency,
              "order_id": order.id,
              "name": "Forever",
              "description": "Test Payment",
              "receipt": order.receipt,
              "image": assets.logo_light,
              "handler": async function (response) {
                const verify = await VerifyRazorpayFunc(response)
                if (verify && verify.success === true) {
                  setCartItems({})
                  navigate("/orders")
                }
              },
              "modal": {
                "ondismiss": async function () {
                  await MarkOrderFailedFunc(order.receipt)
                }
              },
              "prefill": {
                "name": formData.firstName + " " + formData.lastName,
                "email": formData.email,
                "contact": formData.phone
              },
              "notes": {
                "address": "test Address"
              },
              "theme": {
                "color": "#6F1D2B"
              }
            }
            const rzp2 = new window.Razorpay(options)
            rzp2.open()
          }
          break
        }
        case "stripe": {
          const responseStripe = await PlaceOrderStripeFunc(orderData)
          if (responseStripe && responseStripe.success === false && responseStripe.stockIssues) {
            handleStockError(responseStripe)
            return
          }
          if (responseStripe && responseStripe.message === "Order placed (Stripe) successfully!") {
            const { session_url } = responseStripe
            window.location.replace(session_url)
          }
          break
        }
        default:
          break
      }
    } catch (err) {
      console.log(err)
    }
  }

  // Filter out checkout items for the order review list
  const checkoutItems = []
  for (const item in cartItems) {
    for (const size in cartItems[item]) {
      if (cartItems[item][size] > 0) {
        const prod = products.find((p) => p._id === item)
        if (prod) {
          checkoutItems.push({
            ...prod,
            size,
            quantity: cartItems[item][size]
          })
        }
      }
    }
  }

  return (
    <div className="container-store py-8 min-h-screen font-sans">
      {/* Breadcrumb section & Progress Steps */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex gap-2 items-center text-xs tracking-wider text-muted-foreground uppercase select-none">
          <Link to="/cart" className="hover:text-primary transition-colors">Bag</Link>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span className="text-foreground font-medium">Checkout</span>
        </div>

        {/* Visual Progress Stepper */}
        <div className="flex items-center gap-4 text-xs font-semibold tracking-widest uppercase select-none mt-2">
          <span className="text-muted-foreground font-light">01 Bag</span>
          <span className="text-muted-foreground/40">&mdash;</span>
          <span className="text-primary border-b border-primary pb-0.5 font-bold">02 Details</span>
          <span className="text-muted-foreground/40">&mdash;</span>
          <span className="text-muted-foreground/50 font-light">03 Confirmation</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Delivery Details Form */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div>
            <h2 className="text-h2 font-display text-foreground tracking-normal uppercase mb-1">Shipping Details</h2>
            <p className="text-xs text-muted-foreground">Please tell us where you'd like your luxury saree delivered.</p>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium select-none">First Name *</label>
                <input
                  required
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onChangeHandler}
                  className="h-11 px-3 border border-border bg-card/10 text-foreground font-sans text-sm rounded-xs focus-visible:outline-hidden focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all duration-200"
                  placeholder="Ayush"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium select-none">Last Name *</label>
                <input
                  required
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onChangeHandler}
                  className="h-11 px-3 border border-border bg-card/10 text-foreground font-sans text-sm rounded-xs focus-visible:outline-hidden focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all duration-200"
                  placeholder="Shetty"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium select-none">Email Address *</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChangeHandler}
                  className="h-11 px-3 border border-border bg-card/10 text-foreground font-sans text-sm rounded-xs focus-visible:outline-hidden focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all duration-200"
                  placeholder="ayush@me.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium select-none">Phone Number *</label>
                <input
                  required
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={onChangeHandler}
                  className="h-11 px-3 border border-border bg-card/10 text-foreground font-sans text-sm rounded-xs focus-visible:outline-hidden focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <Separator className="bg-border/40 my-2" />

            {/* Address Details */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium select-none">Street Address *</label>
              <input
                required
                type="text"
                name="street"
                value={formData.street}
                onChange={onChangeHandler}
                className="h-11 px-3 border border-border bg-card/10 text-foreground font-sans text-sm rounded-xs focus-visible:outline-hidden focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all duration-200"
                placeholder="Flat No, Wing, Building Name, Street Name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium select-none">City *</label>
                <input
                  required
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={onChangeHandler}
                  className="h-11 px-3 border border-border bg-card/10 text-foreground font-sans text-sm rounded-xs focus-visible:outline-hidden focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all duration-200"
                  placeholder="Mumbai"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium select-none">State *</label>
                <input
                  required
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={onChangeHandler}
                  className="h-11 px-3 border border-border bg-card/10 text-foreground font-sans text-sm rounded-xs focus-visible:outline-hidden focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all duration-200"
                  placeholder="Maharashtra"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium select-none">Pincode *</label>
                <input
                  required
                  type="number"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={onChangeHandler}
                  className="h-11 px-3 border border-border bg-card/10 text-foreground font-sans text-sm rounded-xs focus-visible:outline-hidden focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="400001"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium select-none">Country *</label>
                <input
                  required
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={onChangeHandler}
                  className="h-11 px-3 border border-border bg-card/10 text-foreground font-sans text-sm rounded-xs focus-visible:outline-hidden focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 transition-all duration-200"
                  placeholder="India"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Review, payment cards, CTA */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-[#F1EDE6]/30 border border-border/40 p-6 rounded-md h-fit">
          
          {/* Order Review List */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Bag Contents</h3>
            <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin select-none">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-b-0">
                  <div className="w-10 aspect-[3/4] shrink-0 bg-muted rounded-xs overflow-hidden border border-border/10">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-foreground truncate">{item.name}</h4>
                    <p className="text-[10px] text-[#C6A15B] font-semibold mt-0.5">Size: {item.size} &bull; Qty: {item.quantity}</p>
                  </div>
                  <ProductPrice price={item.price * item.quantity} className="text-xs font-semibold text-foreground shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Pricing Totals Component */}
          <CartTotal showTitle={false} />

          <Separator className="bg-border/60 font-sans" />

          {/* Payment Card Selectors */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3">Payment Method</h3>
            <div className="flex flex-col gap-3">
              {/* Stripe Card */}
              <button
                type="button"
                onClick={() => setMethod("stripe")}
                className={`flex items-center justify-between p-3 border rounded-xs transition-all duration-300 cursor-pointer ${
                  method === 'stripe'
                    ? 'bg-muted border-primary shadow-xs'
                    : 'bg-[#FAF8F4] border-border/80 hover:border-primary/45'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${method === 'stripe' ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
                    {method === 'stripe' && <span className="size-2 rounded-full bg-primary" />}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Stripe</span>
                </div>
                <img src={assets.stripe_logo} alt="Stripe" className="h-4 object-contain select-none" />
              </button>

              {/* Razorpay Card */}
              <button
                type="button"
                onClick={() => setMethod("razorpay")}
                className={`flex items-center justify-between p-3 border rounded-xs transition-all duration-300 cursor-pointer ${
                  method === 'razorpay'
                    ? 'bg-muted border-primary shadow-xs'
                    : 'bg-[#FAF8F4] border-border/80 hover:border-primary/45'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${method === 'razorpay' ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
                    {method === 'razorpay' && <span className="size-2 rounded-full bg-primary" />}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Razorpay</span>
                </div>
                <img src={assets.razorpay_logo} alt="Razorpay" className="h-4 object-contain select-none" />
              </button>

              {/* Cash on Delivery Card */}
              <button
                type="button"
                onClick={() => setMethod("cod")}
                className={`flex items-center justify-between p-3 border rounded-xs transition-all duration-300 cursor-pointer ${
                  method === 'cod'
                    ? 'bg-muted border-primary shadow-xs'
                    : 'bg-[#FAF8F4] border-border/80 hover:border-primary/45'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${method === 'cod' ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
                    {method === 'cod' && <span className="size-2 rounded-full bg-primary" />}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Cash on Delivery (COD)</span>
                </div>
                <Banknote className="size-5 text-primary shrink-0" />
              </button>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Place Order submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-[#591621] disabled:bg-primary/50 text-primary-foreground text-xs uppercase tracking-widest font-sans font-medium rounded-xs shadow-subtle hover:shadow-elevated transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-[0.98] disabled:pointer-events-none"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </form>

      {/* Stock Reservation Failure Dialog Modal */}
      <Dialog open={stockIssuesModal.open} onOpenChange={(open) => !open && setStockIssuesModal(prev => ({ ...prev, open: false }))}>
        <DialogContent className="w-[90vw] max-w-md bg-white border border-border rounded-xs p-6 font-sans">
          <DialogHeader className="select-none flex flex-col gap-2">
            <DialogTitle className="text-base uppercase tracking-widest text-destructive font-bold flex items-center gap-2">
              <AlertCircle className="size-5 text-destructive" />
              <span>Inventory Reservation Error</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              {stockIssuesModal.message}
            </DialogDescription>
          </DialogHeader>

          {/* List of Problematic Items */}
          <div className="flex flex-col gap-3 my-4 max-h-[180px] overflow-y-auto">
            {stockIssuesModal.stockIssues.map((issue, idx) => {
              const prod = products.find(p => p._id === issue.productId)
              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-xs text-xs">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-semibold text-foreground truncate">{prod ? prod.name : issue.productId}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Requested: {issue.requestedQuantity}</span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-xs font-bold text-destructive">
                      {issue.availableQuantity === 0 ? "Out of Stock" : `Only ${issue.availableQuantity} available`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-end">
            <button
              onClick={handleRemoveUnavailableItems}
              type="button"
              className="w-full sm:w-auto h-10 px-5 bg-primary hover:bg-[#591621] text-primary-foreground text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
            >
              <Trash2 className="size-3.5" />
              <span>Update Bag & Continue</span>
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PlaceOrder