import React from 'react'

const NewsletterBox = () => {
  const handleSubSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <section className="container-store mt-24 mb-16 font-sans">
      <div className="max-w-2xl mx-auto text-center px-4 py-12 rounded-md bg-[#F1EDE6]/40 border border-border/20">
        <span className="text-[10px] tracking-[0.25em] font-semibold text-primary uppercase">
          Newsletter
        </span>
        <h2 className="font-display text-2xl sm:text-3xl text-foreground mt-1 tracking-wide">
          Stay in the Know
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto font-light leading-relaxed">
          Be the first to discover new arrivals, collections, and exclusive brand statements.
        </p>

        {/* Subscribe Form */}
        <form 
          onSubmit={handleSubSubmit}
          className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-md mx-auto mt-8"
        >
          <input 
            type="email" 
            placeholder="Enter your email address" 
            required
            className="flex-1 px-4 py-3 text-xs bg-background border border-border rounded-xs focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button 
            type="submit" 
            className="px-8 py-3 text-xs tracking-widest font-semibold text-white bg-primary hover:bg-primary/95 rounded-xs transition-colors duration-300 cursor-pointer uppercase outline-hidden"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterBox