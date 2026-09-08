import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/frontend_assets/assets'

const EditorialSection = () => {
  const navigate = useNavigate()

  return (
    <section className="container-store mt-24 font-sans">
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
        
        {/* Left Side Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-5">
          <span className="text-[10px] tracking-[0.25em] font-semibold text-primary uppercase">
            Our Story
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground leading-tight tracking-wide">
            Where Tradition Meets Contemporary Elegance
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md font-light">
            FOREVER blends the richness of traditional Indian luxury with contemporary silhouettes. From select weaves to daily drapes, we craft products designed to stay relevant for generations.
          </p>
          <button
            onClick={() => navigate('/about')}
            className="px-6 py-2.5 rounded-xs border border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs tracking-widest font-semibold uppercase transition-all duration-300 cursor-pointer mt-2 outline-hidden"
            aria-label="Discover our story on the about page"
          >
            Discover Our Story
          </button>
        </div>

        {/* Right Side Image */}
        <div className="w-full md:w-1/2 aspect-[4/3] rounded-md overflow-hidden bg-muted border border-border/10">
          <img
            src={assets.about_img}
            alt="Craftsman working on traditional Indian textile weaves"
            loading="lazy"
            className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-700 ease-in-out"
          />
        </div>
      </div>
    </section>
  )
}

export default EditorialSection
