import React, { useEffect, useState } from 'react'
import { useShop } from '../hook/useShop'
import { SlidersHorizontal, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import ProductGrid from '../components/product/ProductGrid'

const Collection = () => {
  const { products, search, setSearch } = useShop()
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    "Silk Sarees",
    "Handloom Sarees",
    "Cotton Sarees",
    "Designer Sarees",
    "Festive Sarees",
    "Printed Sarees"
  ]

  const subCategories = [
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
  ]

  const handleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(category.filter((item) => item !== e.target.value))
    } else {
      setCategory([...category, e.target.value])
    }
  }

  const handleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(subCategory.filter((item) => item !== e.target.value))
    } else {
      setSubCategory([...subCategory, e.target.value])
    }
  }

  // Handle Initial Loading state
  useEffect(() => {
    if (products && products.length > 0) {
      setIsLoading(false)
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [products])

  useEffect(() => {
    let filteredProducts = products.slice()

    if (search) {
      filteredProducts = filteredProducts.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category.length > 0) {
      filteredProducts = filteredProducts.filter((item) =>
        category.includes(item.category)
      )
    }

    if (subCategory.length > 0) {
      filteredProducts = filteredProducts.filter((item) =>
        subCategory.includes(item.subCategory)
      )
    }

    switch (sortType) {
      case 'low-high':
        filteredProducts.sort((a, b) => a.price - b.price)
        break

      case 'high-low':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilterProducts(filteredProducts)
  }, [products, category, subCategory, sortType, search])

  return (
    <div className="container-store py-8 min-h-screen ">
      {/* Header and Search section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-border/40 gap-6">
        <div>
          <h1 className="text-display text-foreground font-display mb-2 select-none">
            THE COLLECTION
          </h1>
          <p className="text-small text-muted-foreground max-w-lg leading-relaxed font-sans">
            Discover our curated collection of premium Indian sarees. Handcrafted textures, rich heritage silk weaves, and contemporary designer drapes tailored for every celebration.
          </p>
        </div>

        {/* Inline Search Input using UI primitives */}
        <div className="w-full md:w-80 relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search collections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 w-full bg-card/50 border-border/80 focus-visible:border-primary text-sm font-sans placeholder:text-muted-foreground/60 rounded-xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 text-muted-foreground hover:text-foreground text-xs font-sans"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Filter Section (Desktop only) */}
        <div className="hidden lg:block lg:w-64 shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto pr-3 scrollbar-thin flex flex-col gap-8">
            <div>
              <h2 className="text-caption font-semibold tracking-wider text-muted-foreground border-b border-border/40 pb-2 mb-4">
                FILTERS
              </h2>

              {/* Category Selection Checklist */}
              <div className="flex flex-col gap-3">
                <h3 className="text-label text-foreground font-semibold">CATEGORIES</h3>
                <div className="flex flex-col gap-2.5">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 text-sm cursor-pointer select-none text-muted-foreground hover:text-foreground transition-colors font-sans">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-xs border-border text-primary focus:ring-primary/40 focus:ring-offset-background"
                        onChange={handleCategory}
                        value={cat}
                        checked={category.includes(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-category selection checklist */}
            <div className="flex flex-col gap-3">
              <h3 className="text-label text-foreground font-semibold">WEAVES & STYLE</h3>
              <div className="flex flex-col gap-2.5">
                {subCategories.map((sub) => (
                  <label key={sub} className="flex items-center gap-3 text-sm cursor-pointer select-none text-muted-foreground hover:text-foreground transition-colors font-sans">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-xs border-border text-primary focus:ring-primary/40 focus:ring-offset-background"
                      onChange={handleSubCategory}
                      value={sub}
                      checked={subCategory.includes(sub)}
                    />
                    <span>{sub}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sort dropdown + grid list */}
        <div className="flex-1 min-h-[80vh]">
          <div className="flex items-center justify-between mb-6 gap-4">
            {/* Mobile Filter Sheet menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 border border-border bg-card hover:bg-muted text-sm font-sans tracking-wide text-foreground rounded-xs cursor-pointer">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filters ({category.length + subCategory.length})</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-background border-r border-border p-6 flex flex-col gap-6 overflow-y-auto">
                  <SheetHeader className="border-b border-border/40 pb-4">
                    <SheetTitle className="font-display text-lg tracking-wider">FILTERS</SheetTitle>
                  </SheetHeader>

                  {/* Categories */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-label text-foreground font-semibold">CATEGORIES</h3>
                    <div className="flex flex-col gap-2.5">
                      {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 text-sm cursor-pointer select-none text-muted-foreground font-sans">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-xs border-border text-primary focus:ring-primary/40 focus:ring-offset-background"
                            onChange={handleCategory}
                            value={cat}
                            checked={category.includes(cat)}
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sub categories */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-label text-foreground font-semibold">WEAVES & STYLE</h3>
                    <div className="flex flex-col gap-2.5">
                      {subCategories.map((sub) => (
                        <label key={sub} className="flex items-center gap-3 text-sm cursor-pointer select-none text-muted-foreground font-sans">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-xs border-border text-primary focus:ring-primary/40 focus:ring-offset-background"
                            onChange={handleSubCategory}
                            value={sub}
                            checked={subCategory.includes(sub)}
                          />
                          <span>{sub}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Total Results Summary description (Desktop display only) */}
            <div className="hidden lg:block text-xs sm:text-sm text-muted-foreground font-sans select-none">
              Showing {filterProducts.length} of {products.length} Products
            </div>

            {/* Sort selectors dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground font-sans hidden sm:block whitespace-nowrap">Sort by</label>
              <select
                onChange={(e) => setSortType(e.target.value)}
                value={sortType}
                className="bg-card text-foreground border border-border px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:border-primary rounded-xs cursor-pointer font-sans"
              >
                <option value="relevant">Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid render component */}
          <ProductGrid
            products={filterProducts}
            isLoading={isLoading}
            columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4"
            skeletonCount={8}
          />
        </div>
      </div>
    </div>
  )
}

export default Collection