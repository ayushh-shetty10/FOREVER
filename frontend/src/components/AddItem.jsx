import React, { useState } from 'react'
import { useShop } from '../hook/useShop'
import { toast } from 'react-toastify'
import { 
  Upload, 
  Trash2, 
  Tag, 
  Grid, 
  Layers, 
  Coins, 
  Check,
  Loader2,
  ChevronDown
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

const AddItem = () => {
  const { AddItemFunc, loading } = useShop()

  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Silk Sarees")
  const [subCategory, setSubCategory] = useState("Kanjivaram")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState(["Free Size"])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Quick frontend validations
    if (!name.trim()) return toast.error("Product name is required")
    if (!price || parseFloat(price) <= 0) return toast.error("Please enter a valid price")
    if (!image1 && !image2 && !image3 && !image4) return toast.error("At least one product image is required")

    try {
      const response = await AddItemFunc({
        name,
        description,
        price,
        category,
        subCategory,
        sizes,
        bestseller,
        image1,
        image2,
        image3,
        image4
      })

      if (response && response.message === "Product added successfully!") {
        toast.success("Product Added Successfully!")
        // Clear all fields
        setName("")
        setDescription("")
        setPrice("")
        setBestseller(false)
        setImage1(null)
        setImage2(null)
        setImage3(null)
        setImage4(null)
        setSizes(["Free Size"])
        setCategory("Silk Sarees")
        setSubCategory("Kanjivaram")
      } else {
        toast.error(response?.message || "Failed to add product")
      }
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || err.message || "Failed to add product")
    }
  }

  const handleSizeToggle = (size) => {
    if (sizes.includes(size)) {
      setSizes(prev => prev.filter(s => s !== size))
    } else {
      setSizes(prev => [...prev, size])
    }
  }

  const availableSizes = ["Free Size"]

  // Simple state rendering for image upload cards
  const ImageUploadSlot = ({ id, file, setter }) => {
    return (
      <div className="relative group aspect-[3/4] bg-muted/30 border border-border border-dashed rounded-xs hover:border-[#C6A15B] transition-colors duration-300 flex items-center justify-center overflow-hidden">
        {file ? (
          <>
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            {/* Delete/Replace overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setter(null)}
                className="p-1 px-2.5 bg-destructive text-destructive-foreground rounded-xs text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Trash2 className="size-3" />
                <span>Remove</span>
              </button>
            </div>
          </>
        ) : (
          <label htmlFor={id} className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-3 select-none">
            <Upload className="size-4.5 text-muted-foreground/80 group-hover:text-primary transition-colors" />
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-2 font-medium text-center">
              Add Photo
            </span>
            <input 
              type="file" 
              id={id} 
              accept="image/*" 
              onChange={(e) => setter(e.target.files[0])} 
              className="hidden" 
            />
          </label>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl font-sans">
      <div className="mb-6 select-none">
        <h1 className="text-xl sm:text-2xl font-display text-foreground tracking-normal uppercase">Add New Product</h1>
        <p className="text-xs text-muted-foreground mt-1">Upload editorial catalog photo sets and configure descriptions, sizing, and pricing models.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Section A: Photo Gallery Slots */}
        <div className="bg-white border border-[#E5DED4] p-5 rounded-xs">
          <h3 className="text-xs uppercase tracking-widest text-[#6F1D2B] font-bold mb-3 select-none">
            Product Gallery (Max 4 Photos)
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <ImageUploadSlot id="image1" file={image1} setter={setImage1} />
            <ImageUploadSlot id="image2" file={image2} setter={setImage2} />
            <ImageUploadSlot id="image3" file={image3} setter={setImage3} />
            <ImageUploadSlot id="image4" file={image4} setter={setImage4} />
          </div>
          <span className="text-[10px] text-muted-foreground leading-normal mt-3 block select-none">
            * The first slot is designated as the primary display cover photo.
          </span>
        </div>

        {/* Section B: Product Specifications */}
        <div className="bg-white border border-[#E5DED4] p-5 rounded-xs flex flex-col gap-4 font-sans">
          <h3 className="text-xs uppercase tracking-widest text-[#6F1D2B] font-bold select-none">
            Product details
          </h3>

          <div className="flex flex-col gap-1.5 relatve">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold select-none">
              Product Title/Name
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="e.g. Royal Maroon Kanjivaram Silk Saree"
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-border rounded-xs outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold select-none">
              Detailed Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the fabric purity, handloom type, zari weaving patterns details, and accessories instructions..."
              className="w-full p-3 text-xs border border-border rounded-xs outline-none focus:border-primary/50 transition-colors min-h-[100px] resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold select-none">
                Category
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full pl-9 pr-8 py-2.5 text-xs border border-border bg-white rounded-xs outline-none focus:border-primary/50 transition-colors cursor-pointer font-semibold text-foreground uppercase tracking-wider text-left relative flex items-center min-h-[38px] select-none"
                  >
                    <Grid className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                    <span>{category}</span>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-border/80 shadow-md max-h-52 overflow-y-auto flex flex-col p-1 z-50 rounded-xs">
                  {["Silk Sarees", "Handloom Sarees", "Cotton Sarees", "Designer Sarees", "Festive Sarees", "Printed Sarees"].map((cat) => (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className="cursor-pointer py-2 px-3 hover:bg-[#6F1D2B]/5 hover:text-[#6F1D2B] transition-colors focus:bg-[#6F1D2B]/5 focus:text-[#6F1D2B] rounded-none outline-none font-medium uppercase tracking-wider text-[10px]"
                    >
                      {cat}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold select-none">
                Sub-Category
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-full pl-9 pr-8 py-2.5 text-xs border border-border bg-white rounded-xs outline-none focus:border-primary/50 transition-colors cursor-pointer font-semibold text-foreground uppercase tracking-wider text-left relative flex items-center min-h-[38px] select-none"
                  >
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                    <span>{subCategory}</span>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-border/80 shadow-md max-h-52 overflow-y-auto flex flex-col p-1 z-50 rounded-xs">
                  {[
                    "Kanjivaram",
                    "Banarasi",
                    "Mysore Silk",
                    "Handloom Cotton",
                    "Chanderi",
                    "Mulmul Cotton",
                    "Bengal Cotton",
                    "Kota Cotton",
                    "Embroidered",
                    "Party Wear",
                    "Contemporary",
                    "Festive",
                    "Wedding",
                    "Occasion Wear",
                    "Floral",
                    "Block Print",
                    "Digital Print"
                  ].map((sub) => (
                    <DropdownMenuItem
                      key={sub}
                      onClick={() => setSubCategory(sub)}
                      className="cursor-pointer py-2 px-3 hover:bg-[#6F1D2B]/5 hover:text-[#6F1D2B] transition-colors focus:bg-[#6F1D2B]/5 focus:text-[#6F1D2B] rounded-none outline-none font-medium uppercase tracking-wider text-[10px]"
                    >
                      {sub}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold select-none">
                Price
              </label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  placeholder="Price in INR"
                  className="w-full pl-9 pr-4 py-2.5 text-xs border border-border rounded-xs outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section C: Sizing & Flag Config */}
        <div className="bg-white border border-[#E5DED4] p-5 rounded-xs flex flex-col gap-4 font-sans select-none">
          <h3 className="text-xs uppercase tracking-widest text-[#6F1D2B] font-bold">
            Options & Sizing
          </h3>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              Available Sizes
            </span>
            <div className="flex flex-wrap gap-2.5 mt-1">
              {availableSizes.map((size) => {
                const isSelected = sizes.includes(size)
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`h-9 min-w-10 px-3 flex items-center justify-center border text-xs font-semibold rounded-xs shadow-xs tracking-wider transition-all duration-300 cursor-pointer outline-hidden ${
                      isSelected
                        ? "bg-[#6F1D2B] border-[#6F1D2B] text-white"
                        : "bg-white border-border text-foreground hover:border-primary/60"
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Bestseller checkbox card */}
          <div className="flex items-center gap-3">
            <label className="relative flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center size-5 border border-border rounded-xs bg-white group-hover:border-primary/60 transition-colors duration-300">
                <input 
                  type="checkbox" 
                  checked={bestseller} 
                  onChange={() => setBestseller(!bestseller)} 
                  className="sr-only"
                />
                {bestseller && (
                  <div className="absolute inset-0 bg-[#6F1D2B] flex items-center justify-center text-white scale-[1.05] rounded-xs">
                    <Check className="size-3.5 stroke-[2.5]" />
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-foreground tracking-wide select-none group-hover:text-primary transition-colors">
                Flag Product as <span className="font-semibold text-[#C6A15B]">Bestseller</span>
              </span>
            </label>
          </div>
        </div>

        {/* Section D: Add CTA Submission */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-h-11 px-8 bg-[#6F1D2B] hover:bg-[#591621] text-primary-foreground text-xs uppercase tracking-widest font-sans font-semibold rounded-xs shadow-subtle hover:shadow-elevated transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer outline-hidden"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Uploading Product...</span>
              </>
            ) : (
              <span>Add Product</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddItem
