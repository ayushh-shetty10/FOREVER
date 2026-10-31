import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { assets } from '../../assets/frontend_assets/assets'
import SareeHeroImage from "../../assets/SareeHeroimage.jpg"


const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <section className="container-store mt-4">
      <div className="flex flex-col md:flex-row border border-border/40 bg-card rounded-md overflow-hidden relative min-h-[400px] md:min-h-[500px]">
        {/* Left Editorial Text Area */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center md:items-start text-center md:text-left gap-4"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="h-[1.5px] w-8 bg-primary"></span>
              <span className="text-[10px] sm:text-xs tracking-[0.25em] font-semibold text-primary uppercase">
                OUR BEST SELLERS
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight tracking-wide text-balance py-2">
              Latest Arrivals
            </h1>
            
            {/* CTA Shop Now */}
            <button
              onClick={() => navigate('/collection')}
              className="group flex items-center gap-2 text-xs sm:text-sm tracking-[0.2em] font-semibold text-foreground mt-4 cursor-pointer outline-hidden"
              aria-label="Shop our latest arrivals collection"
            >
              <span>SHOP NOW</span>
              <span className="relative w-8 h-[2px] bg-foreground transition-all duration-300 group-hover:w-12 group-hover:bg-primary"></span>
            </button>
          </motion.div>
        </div>

        {/* Right Campaign Image Area */}
        <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full overflow-hidden">
          <motion.img 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            src={SareeHeroImage}
            alt="New Season fashion editorial campaign banner" 
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
