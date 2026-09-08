import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../../hook/useShop'

const CategoryShowcase = () => {
  const { products } = useShop()
  const navigate = useNavigate()

  const categories = [
    { name: 'Women', key: 'Women', label: 'Women' },
    { name: 'Men', key: 'Men', label: 'Men' },
    { name: 'Kids', key: 'Kids', label: 'Kids' }
  ]

  // Resolve representative images dynamically from database
  const getCategoryImage = (categoryKey) => {
    const matchedProduct = products.find(item => item.category === categoryKey)
    return matchedProduct?.images?.[0] || null
  }

  const handleCategoryClick = (categoryName) => {
    // Navigate to Collection page (safest route)
    navigate('/collection')
  }

  // Hide component if no products exist yet
  if (products.length === 0) return null

  return (
    <section className="container-store mt-20 font-sans">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="font-display text-2xl sm:text-3xl tracking-widest text-foreground uppercase">
          Explore Collections
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-sm mx-auto font-light leading-relaxed">
          Curated designer selections matching every contemporary silhouette.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const imgUrl = getCategoryImage(cat.key)

          return (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative aspect-[3/4] w-full overflow-hidden rounded-md bg-muted border border-border/10 cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={`Explore our ${cat.label} collection`}
            >
              {/* Category Image */}
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt={`${cat.label} Collection`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-102"
                />
              ) : (
                <div className="absolute inset-0 bg-[#F1EDE6] flex items-center justify-center text-muted-foreground p-4">
                  <span className="text-[10px] tracking-widest uppercase font-medium">Coming Soon</span>
                </div>
              )}

              {/* Editorial Overlay */}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-500 flex flex-col items-center justify-center p-4">
                <span className="font-display text-lg sm:text-xl tracking-[0.25em] text-white uppercase relative py-1">
                  {cat.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-white transition-all duration-300 group-hover:w-1/2"></span>
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryShowcase
