import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-500 mx-2'>
        {/* left side  */}
        <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
             <div className='text-black '>
                <div className='flex items-center gap-2'>
                    <p className='h-[2px] w-8 bg-black md:w-11  '></p>
                    <p className='font-medium text-sm md:text-base  '>OUR BEST SELLERS</p>
                </div>
                <h1 className="text-3xl prata-regular lg:text-5xl sm:py-3  leading-relaxed">Latest Arrivals</h1>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold text-sm md:text-base '>SHOP NOW</p>
                     <p className='h-[2px] w-8 bg-black md:w-11  '></p>
                </div>
             </div>
        </div>
        
            <img className='w-full sm:w-1/2' src={assets.hero_img} alt="" />
        
    </div>
  )
}

export default Hero