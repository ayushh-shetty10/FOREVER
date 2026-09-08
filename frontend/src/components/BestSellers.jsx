import React, { useEffect, useState } from "react"
import { useShop } from "../hook/useShop"
import ProductGrid from "./product/ProductGrid"

const BestSellers = () => {
  const { products, loading } = useShop()
  const [bestProducts, setBestProducts] = useState([])

  useEffect(() => {
    if (products && products.length > 0) {
      const bestProduct = products.filter((item) => item.bestseller)
      setBestProducts(bestProduct.slice(0, 5))
    }
  }, [products])

  // Hide the section if there are genuinely no bestseller products
  if (!loading && bestProducts.length === 0) return null

  return (
    <section className="container-store mt-24 font-sans">
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="text-[10px] tracking-[0.25em] font-semibold text-primary uppercase">
          Curated Favourites
        </span>
        <h2 className="font-display text-2xl sm:text-3xl tracking-widest text-foreground uppercase mt-1">
          Bestsellers
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-sm mx-auto font-light leading-relaxed">
          Pieces our customers keep coming back to.
        </p>
      </div>

      {/* Product Grid Integration */}
      <ProductGrid 
        products={bestProducts} 
        isLoading={loading && bestProducts.length === 0} 
        skeletonCount={5}
        columnsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
      />
    </section>
  )
}

export default BestSellers