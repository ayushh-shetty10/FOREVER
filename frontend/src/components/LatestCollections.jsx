import React, { useEffect, useState } from "react"
import { useShop } from "../hook/useShop"
import ProductGrid from "./product/ProductGrid"

const LatestCollections = () => {
  const { products, loading } = useShop()
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10))
    }
  }, [products])

  return (
    <section className="container-store mt-20 font-sans">
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="text-[10px] tracking-[0.25em] font-semibold text-primary uppercase">
          New Arrivals
        </span>
        <h2 className="font-display text-2xl sm:text-3xl tracking-widest text-foreground uppercase mt-1">
          Latest Collections
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-sm mx-auto font-light leading-relaxed">
          Discover our newest creations designed for contemporary wardrobes.
        </p>
      </div>

      {/* Product Grid Integration */}
      <ProductGrid 
        products={latestProducts} 
        isLoading={loading && latestProducts.length === 0} 
        skeletonCount={10}
        columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      />
    </section>
  )
}

export default LatestCollections
