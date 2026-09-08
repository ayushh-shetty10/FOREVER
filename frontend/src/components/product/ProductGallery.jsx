import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const ProductGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState('')

  // Set the first image by default when images are loaded/changed
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0])
    } else {
      setSelectedImage('')
    }
  }, [images])

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] w-full bg-[#F1EDE6] rounded-md border border-border/10 flex items-center justify-center text-muted-foreground p-4">
        <span className="text-xs tracking-widest uppercase font-medium">No Images Available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row w-full font-sans">
      {/* Thumbnails Sidebar / Horiz on mobile, Vert on desktop */}
      {images.length > 1 && (
        <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto gap-2.5 sm:w-[16%] w-full scrollbar-none max-h-[500px]">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`relative aspect-[3/4] w-[22%] sm:w-full shrink-0 rounded-sm overflow-hidden border transition-all duration-300 cursor-pointer focus:outline-hidden ${
                selectedImage === img 
                  ? 'border-primary ring-1 ring-primary' 
                  : 'border-border/60 hover:border-muted-foreground/60'
              }`}
              aria-label={`View product image ${index + 1}`}
            >
              <img 
                src={img} 
                alt="" 
                loading="lazy" 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display */}
      <div className={`flex-1 w-full bg-muted rounded-md overflow-hidden relative aspect-[3/4] border border-border/10 ${images.length <= 1 ? 'w-full' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={selectedImage}
            alt="Product view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProductGallery
