import React, { useEffect, useState } from 'react'
import { useShop } from '../hook/useShop'
import { toast } from 'react-toastify'
import ProductPrice from './product/ProductPrice'
import { 
  Search, 
  Trash2, 
  Filter, 
  AlertCircle,
  Package,
  Layers,
  ChevronRight,
  TrendingDown,
  Star,
  ChevronDown,
  Edit3,
  Box,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

const ListItems = () => {
  const { ListItemsFunc, products, setProducts, RemoveItemFunc, loading, UpdateBestsellerFunc, UpdateStockFunc } = useShop()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [deleteProductTarget, setDeleteProductTarget] = useState(null)
  const [stockEditTarget, setStockEditTarget] = useState(null)
  const [newStockVal, setNewStockVal] = useState("")
  const [loadingList, setLoadingList] = useState(true)
  const [savingStock, setSavingStock] = useState(false)

  const ListProducts = async () => {
    setLoadingList(true)
    try {
      const res = await ListItemsFunc()
      if (!res?.products) {
        toast.error("Error fetching products!")
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    ListProducts()
  }, [])

  const handleRemoveProduct = async () => {
    if (!deleteProductTarget) return

    const { _id, name } = deleteProductTarget
    try {
      const res = await RemoveItemFunc({ _id })
      if (res && res.message === "Product removed successfully") {
        toast.success(`"${name}" removed successfully!`)
      } else {
        toast.error(res?.message || "Failed to remove product")
      }
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || "Failed to remove product")
    } finally {
      setDeleteProductTarget(null)
    }
  }

  const handleToggleBestseller = async (item) => {
    const originalValue = item.bestseller;
    const newValue = !originalValue;
    
    // Optimistic UI state update
    setProducts(prev => prev.map(p => p._id === item._id ? { ...p, bestseller: newValue } : p));
    
    try {
      const res = await UpdateBestsellerFunc({ id: item._id, bestseller: newValue });
      if (res && res.message === "Bestseller status updated successfully!") {
        toast.success(`"${item.name}" bestseller updated successfully!`);
      } else {
        // Revert UI status on failure response
        setProducts(prev => prev.map(p => p._id === item._id ? { ...p, bestseller: originalValue } : p));
        toast.error(res?.message || "Failed to update bestseller status");
      }
    } catch (err) {
      console.error(err);
      // Revert UI status on error catch
      setProducts(prev => prev.map(p => p._id === item._id ? { ...p, bestseller: originalValue } : p));
      toast.error("Failed to update bestseller status");
    }
  }

  const handleOpenStockDialog = (item) => {
    setStockEditTarget(item)
    setNewStockVal(item.totalStock !== undefined ? item.totalStock : 10)
  }

  const handleSaveStock = async () => {
    if (!stockEditTarget) return
    const stockNum = Number(newStockVal)
    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      toast.error("Stock quantity must be a non-negative integer")
      return
    }

    setSavingStock(true)
    try {
      const res = await UpdateStockFunc({ id: stockEditTarget._id, totalStock: stockNum })
      if (res && res.product) {
        toast.success(`Stock for "${stockEditTarget.name}" updated successfully!`)
        setStockEditTarget(null)
      } else {
        toast.error(res?.message || "Failed to update product stock")
      }
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || "Error updating product stock")
    } finally {
      setSavingStock(false)
    }
  }

  // Client-side quick filter
  const filteredList = (products || []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 md:p-8 flex flex-col gap-5 font-sans min-h-screen">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/40 select-none">
        <div>
          <h1 className="text-xl sm:text-2xl font-display text-foreground tracking-normal uppercase">Inventory Catalog</h1>
          <p className="text-xs text-muted-foreground mt-1">Review store inventory, inspect reserved units, and manage product availability.</p>
        </div>
      </div>

      {/* Grid Filter Bar Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center bg-[#F1EDE6]/30 border border-border/50 p-4 rounded-xs">
        
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search products by title or description details..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-border bg-white rounded-xs focus:border-primary/50 outline-none transition-colors"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-44 select-none">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-full pl-9 pr-8 py-2 text-xs border border-border bg-white rounded-xs outline-none focus:border-primary/50 transition-colors cursor-pointer uppercase tracking-wider font-semibold text-foreground text-left relative flex items-center min-h-[34px]"
              >
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                <span className="truncate pr-1">
                  {categoryFilter === "All" ? "All Categories" : categoryFilter}
                </span>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-border/80 shadow-md max-h-52 overflow-y-auto flex flex-col p-1 z-50 rounded-xs">
              {[
                { value: "All", label: "All Categories" },
                { value: "Silk Sarees", label: "Silk Sarees" },
                { value: "Handloom Sarees", label: "Handloom Sarees" },
                { value: "Cotton Sarees", label: "Cotton Sarees" },
                { value: "Designer Sarees", label: "Designer Sarees" },
                { value: "Festive Sarees", label: "Festive Sarees" },
                { value: "Printed Sarees", label: "Printed Sarees" }
              ].map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setCategoryFilter(opt.value)}
                  className="cursor-pointer py-1.5 px-3 hover:bg-[#6F1D2B]/5 hover:text-[#6F1D2B] transition-colors focus:bg-[#6F1D2B]/5 focus:text-[#6F1D2B] rounded-none outline-none font-semibold uppercase tracking-wider text-[10px]"
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Primary catalog list view */}
      {loadingList || loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="border border-border/40 p-4 rounded-xs flex items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                <Skeleton className="w-10 aspect-[3/4] bg-border/50 rounded-sm" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-40 bg-border/50" />
                  <Skeleton className="h-3 w-16 bg-border/50" />
                </div>
              </div>
              <Skeleton className="h-8 w-16 bg-border/50" />
            </div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[#E5DED4] rounded-xs bg-[#FAF8F4]/40 select-none text-center">
          <Package className="size-10 text-muted-foreground/50 mb-3" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">No Products Found</h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">There are no items matching name filter "{searchQuery}" or category.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table Layout */}
          <div className="hidden md:block border border-border rounded-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F4] border-b border-border text-[10px] tracking-wider uppercase font-semibold text-muted-foreground select-none">
                  <th className="py-3.5 px-4 w-16">Image</th>
                  <th className="py-3.5 px-4">Product details</th>
                  <th className="py-3.5 px-4 w-28">Category</th>
                  <th className="py-3.5 px-4 w-24">Price</th>
                  <th className="py-3.5 px-4 w-44">Inventory (Avail / Res / Total)</th>
                  <th className="py-3.5 px-4 w-24">Bestseller</th>
                  <th className="py-3.5 px-4 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {filteredList.map((item) => {
                  const total = item.totalStock !== undefined ? item.totalStock : 10
                  const reserved = item.reservedStock !== undefined ? item.reservedStock : 0
                  const available = item.availableStock !== undefined ? item.availableStock : total - reserved

                  return (
                    <tr key={item._id} className="hover:bg-muted/15 transition-colors select-none">
                      <td className="py-3 px-4">
                        <div className="w-10 aspect-[3/4] bg-muted rounded-xs overflow-hidden border border-border/10">
                          <img 
                            src={item.images?.[0] || item.image?.[0]} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-sans max-w-xs">
                        <p className="font-semibold text-foreground truncate" title={item.name}>{item.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5" title={item.description}>
                          {item.description}
                        </p>
                      </td>
                      <td className="py-3 px-4 uppercase tracking-wider text-[10px] font-medium text-muted-foreground">
                        {item.category} / {item.subCategory}
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        <ProductPrice price={item.price} />
                      </td>
                      {/* Inventory Stock Breakdown */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-0.5">
                            <span className={`text-[10px] font-bold ${available === 0 ? 'text-destructive' : 'text-emerald-700'}`}>
                              Available: {available}
                            </span>
                            <span className="text-[9px] text-muted-foreground">
                              Reserved: {reserved} &bull; Total: {total}
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenStockDialog(item)}
                            type="button"
                            className="p-1 text-muted-foreground hover:text-primary hover:bg-muted rounded-xs transition-colors cursor-pointer ml-auto"
                            title="Edit Product Stock"
                          >
                            <Edit3 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleBestseller(item)}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-xs text-[10px] uppercase tracking-wider font-semibold border transition-all duration-300 cursor-pointer ${
                            item.bestseller
                              ? "bg-amber-50 text-amber-800 border-amber-200 font-bold"
                              : "bg-white text-muted-foreground/70 border-border hover:border-muted-foreground/40"
                          }`}
                        >
                          <Star className={`size-3 ${item.bestseller ? "fill-amber-600 text-amber-600" : ""}`} />
                          <span>{item.bestseller ? "ON" : "OFF"}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setDeleteProductTarget(item)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted/80 rounded-full transition-colors cursor-pointer outline-hidden"
                          title="Delete Product"
                          aria-label="Delete Product"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredList.map((item) => {
              const total = item.totalStock !== undefined ? item.totalStock : 10
              const reserved = item.reservedStock !== undefined ? item.reservedStock : 0
              const available = item.availableStock !== undefined ? item.availableStock : total - reserved

              return (
                <div 
                  key={item._id}
                  className="border border-border/55 rounded-xs p-4 bg-white hover:border-border/80 transition-colors flex flex-col justify-between"
                >
                  <div className="flex gap-4 items-start select-none">
                    {/* Thumbnail */}
                    <div className="w-12 aspect-[3/4] bg-muted rounded-xs overflow-hidden border border-border/10 shrink-0">
                      <img 
                        src={item.images?.[0] || item.image?.[0]} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    {/* Content details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground truncate" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                        {item.category} / {item.subCategory}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <ProductPrice price={item.price} className="text-xs font-bold text-foreground" />
                        <button
                          type="button"
                          onClick={() => handleToggleBestseller(item)}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[8px] font-bold border transition-all cursor-pointer ${
                            item.bestseller
                              ? "bg-amber-50 text-amber-800 border-amber-200 uppercase tracking-widest"
                              : "bg-white text-muted-foreground/60 border-border"
                          }`}
                        >
                          <Star className={`size-2.5 ${item.bestseller ? "fill-amber-600 text-amber-600" : ""}`} />
                          <span>{item.bestseller ? "BEST" : "OFF"}</span>
                        </button>
                      </div>

                      {/* Stock Info Mobile */}
                      <div className="mt-2 flex items-center justify-between bg-muted/30 p-1.5 rounded-xs">
                        <span className={`text-[10px] font-bold ${available === 0 ? 'text-destructive' : 'text-emerald-700'}`}>
                          Stock: {available} Avail / {total} Total
                        </span>
                        <button
                          onClick={() => handleOpenStockDialog(item)}
                          type="button"
                          className="text-[9px] uppercase font-bold text-primary hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Trigger */}
                  <div className="border-t border-border/20 pt-3 mt-3 flex justify-end">
                    <button
                      onClick={() => setDeleteProductTarget(item)}
                      type="button"
                      className="h-8 px-3 border border-destructive/20 hover:bg-destructive/5 text-destructive rounded-xs text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1 cursor-pointer outline-hidden"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Stock Editing Dialog Modal */}
      <Dialog open={!!stockEditTarget} onOpenChange={(open) => !open && setStockEditTarget(null)}>
        <DialogContent className="w-[90vw] max-w-sm bg-white border border-border rounded-xs p-6 font-sans">
          <DialogHeader className="select-none flex flex-col gap-1">
            <DialogTitle className="text-base uppercase tracking-widest text-[#6F1D2B] font-bold flex items-center gap-2">
              <Box className="size-4.5 text-primary" />
              <span>Manage Product Stock</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              Update total unsold stock for <span className="font-semibold text-foreground">"{stockEditTarget?.name}"</span>. Active reserved units will be preserved automatically.
            </DialogDescription>
          </DialogHeader>

          {stockEditTarget && (
            <div className="flex flex-col gap-4 my-2 select-none">
              <div className="flex items-center justify-between p-3 bg-muted/40 border border-border/50 rounded-xs text-xs">
                <span className="text-muted-foreground">Currently Reserved:</span>
                <span className="font-bold text-amber-800">{stockEditTarget.reservedStock || 0} units</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  New Total Unsold Inventory
                </label>
                <input
                  type="number"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(e.target.value)}
                  min={stockEditTarget.reservedStock || 0}
                  className="w-full px-3 py-2 text-sm border border-border rounded-xs outline-none focus:border-primary font-semibold"
                  placeholder="e.g. 15"
                />
                <span className="text-[10px] text-muted-foreground">
                  * Must be at least {stockEditTarget.reservedStock || 0} (active reservations).
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <DialogClose asChild>
              <button
                type="button"
                className="h-9 px-4 border border-border hover:bg-muted text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer outline-hidden select-none"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={handleSaveStock}
              disabled={savingStock}
              type="button"
              className="h-9 px-4 bg-primary hover:bg-[#591621] text-primary-foreground text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-all cursor-pointer outline-hidden select-none disabled:opacity-50"
            >
              {savingStock ? "Saving..." : "Update Stock"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog Modals */}
      <Dialog open={!!deleteProductTarget} onOpenChange={(open) => !open && setDeleteProductTarget(null)}>
        <DialogContent className="w-[90vw] max-w-sm bg-white border border-border rounded-xs p-6 font-sans">
          <DialogHeader className="select-none flex flex-col gap-2">
            <DialogTitle className="text-base uppercase tracking-widest text-[#6F1D2B] font-bold flex items-center gap-2">
              <AlertCircle className="size-4.5 text-destructive" />
              <span>Delete Product?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-2">
              Are you sure you want to remove <span className="font-semibold text-foreground">"{deleteProductTarget?.name}"</span> from the catalog database?
              <br />
              <span className="text-destructive font-medium mt-1 block">This action cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-5 flex gap-2 justify-end">
            <DialogClose asChild>
              <button
                type="button"
                className="h-9 px-4 border border-border hover:bg-muted text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer outline-hidden select-none"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={handleRemoveProduct}
              type="button"
              className="h-9 px-4 bg-destructive hover:bg-destructive/95 text-destructive-foreground text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-all cursor-pointer outline-hidden select-none"
            >
              Delete Saree
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ListItems