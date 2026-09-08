import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useShop } from "../hook/useShop";
import RelatedProducts from "../components/RelatedProducts";
import ProductGallery from "../components/product/ProductGallery";
import ProductPrice from "../components/product/ProductPrice";
import ProductBadge from "../components/product/ProductBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

// Product Details Loading Skeleton
const ProductSkeleton = () => (
  <div className="container-store py-8 min-h-screen font-sans animate-pulse">
    {/* Breadcrumbs Skeleton */}
    <Skeleton className="h-4 w-48 mb-8" />

    {/* Main columns */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Left Gallery Skeleton */}
      <div className="lg:col-span-7 flex flex-col-reverse gap-4 sm:flex-row w-full">
        {/* Thumbnails */}
        <div className="flex sm:flex-col gap-2.5 sm:w-[16%] w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-[22%] sm:w-full rounded-sm" />
          ))}
        </div>
        {/* Main image */}
        <div className="flex-1 w-full relative aspect-[3/4]">
          <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
        </div>
      </div>

      {/* Right Details Skeleton */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div>
          <Skeleton className="h-5 w-24 mb-3" />
          <Skeleton className="h-9 w-3/4 mb-3" />
          <Skeleton className="h-5.5 w-32" />
        </div>

        <Separator className="bg-border/40" />

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <Separator className="bg-border/40" />

        <div>
          <Skeleton className="h-4 w-24 mb-3" />
          <div className="flex gap-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-16 rounded-xs" />
            ))}
          </div>
        </div>

        <Skeleton className="h-12 w-full sm:w-[260px] rounded-xs mt-2" />

        <div className="flex flex-col gap-3.5 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Product = () => {
  const { productId } = useParams();
  const { products, AddToCartFunc } = useShop();
  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState("");

  const fetchProductData = () => {
    const item = products.find((p) => p._id === productId);
    if (item) {
      setProductData(item);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  // Set default size (e.g. if Free Size exists or first available size)
  useEffect(() => {
    if (productData && productData.sizes.length > 0) {
      setSize(productData.sizes[0]);
    } else {
      setSize("");
    }
  }, [productData]);

  if (!productData) {
    return <ProductSkeleton />;
  }

  return (
    <div className="container-store py-8 min-h-screen transition-opacity duration-500 ease-in opacity-100 font-sans">
      {/* Breadcrumbs Section */}
      <div className="flex gap-2 items-center text-xs tracking-wider text-muted-foreground uppercase mb-8 select-none font-sans">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/collection" className="hover:text-primary transition-colors">Collection</Link>
        <span>/</span>
        <span className="text-foreground font-medium select-none truncate max-w-[200px]">{productData.name}</span>
      </div>

      {/* Main product columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={productData.images} />
        </div>

        {/* Right Column: Product details and action */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          {/* Saree Badge and Category Details */}
          <div className="flex items-center gap-3.5 mb-2 select-none">
            {productData.bestseller && (
              <ProductBadge>BESTSELLER</ProductBadge>
            )}
            <span className="text-[10px] font-semibold tracking-widest text-[#C6A15B] uppercase">
              {productData.category} &bull; {productData.subCategory}
            </span>
          </div>

          {/* Saree Name */}
          <h1 className="text-h2 font-display text-foreground leading-tight tracking-normal mb-3">
            {productData.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <ProductPrice price={productData.price} className="text-3xl text-primary font-semibold font-sans tracking-wide" />
          </div>

          <Separator className="bg-border/60 my-2" />

          {/* Description */}
          <div className="my-4">
            <p className="text-body text-muted-foreground leading-relaxed font-sans font-light">
              {productData.description}
            </p>
          </div>

          <Separator className="bg-border/60 my-2" />

          {/* Size Selection */}
          <div className="flex flex-col gap-3 my-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-sans tracking-wide font-medium text-foreground">Select Size</span>
              <span className="text-[11px] text-muted-foreground font-sans font-light uppercase tracking-wider font-semibold">Traditional Drape</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  type="button"
                  className={`min-w-[80px] h-11 px-4 border text-xs tracking-wider font-sans font-medium uppercase rounded-xs transition-all duration-300 cursor-pointer ${
                    size === item
                      ? "bg-muted border-primary border-[1.5px] text-primary font-semibold"
                      : "bg-[#FAF8F4] border-border/80 text-foreground hover:border-primary/50 hover:text-primary hover:bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="my-6">
            <button
              onClick={() => AddToCartFunc(productData._id, size)}
              type="button"
              className="w-full sm:w-[260px] h-12 bg-primary hover:bg-[#591621] text-primary-foreground text-xs uppercase tracking-widest font-sans font-medium rounded-xs shadow-subtle hover:shadow-elevated transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/45"
            >
              Add to Bag
            </button>
          </div>

          <Separator className="bg-border/60 my-2" />

          {/* Delivery & Customer Guarantee Details */}
          <div className="flex flex-col gap-3.5 my-4 font-sans text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-primary/80 shrink-0" />
              <span className="tracking-wide">100% Genuine premium handcrafted saree</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="size-5 text-primary/80 shrink-0" />
              <span className="tracking-wide">Complimentary shipping across India & Cash on Delivery available</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="size-5 text-primary/80 shrink-0" />
              <span className="tracking-wide">Easy exchange policy within 7 days of delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specs Tabs Section */}
      <div className="mt-20 border-t border-border/40 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left spec info */}
          <div className="lg:col-span-4">
            <h3 className="text-h4 font-sans text-foreground mb-4 uppercase tracking-widest">PRODUCT DETAILS</h3>
            <div className="flex flex-col gap-4 text-xs font-sans">
              <div className="flex justify-between py-2.5 border-b border-border/40">
                <span className="text-muted-foreground font-light uppercase tracking-wider">Category</span>
                <span className="text-foreground font-medium">{productData.category}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-border/40">
                <span className="text-muted-foreground font-light uppercase tracking-wider">Weave & Style</span>
                <span className="text-foreground font-medium">{productData.subCategory}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-border/40">
                <span className="text-muted-foreground font-light uppercase tracking-wider">Sizes Available</span>
                <span className="text-foreground font-medium">{productData.sizes.join(", ")}</span>
              </div>
            </div>
          </div>

          {/* Right product story */}
          <div className="lg:col-span-8">
            <h3 className="text-h4 font-sans text-foreground mb-4 uppercase tracking-widest">PRODUCT STORY</h3>
            <p className="text-body text-muted-foreground leading-relaxed font-sans font-light mb-4">
              Our {productData.name} captures the rich, artistic history of traditional Indian handloom drapes. Carefully constructed with high-quality fabrics, it showcases intricate detailing and premium craftsmanship.
            </p>
            <p className="text-body text-muted-foreground leading-relaxed font-sans font-light">
              Perfect for weddings, festive occasions, and cultural ceremonies, this product brings together the absolute best of historic elegance and modern, premium lifestyle drape comforts.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
        currentProductId={productData._id}
      />
    </div>
  );
};

export default Product;
