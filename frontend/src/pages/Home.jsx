import React from 'react'
import HeroSection from '../components/home/HeroSection'
//import CategoryShowcase from '../components/home/CategoryShowcase'
import LatestCollections from '../components/LatestCollections'
import EditorialSection from '../components/home/EditorialSection'
import BestSellers from '../components/BestSellers'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div className="flex flex-col gap-6 md:gap-10 pb-16">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Explore Collections (Category Showcase) */}
      {/* <CategoryShowcase /> */}

      {/* 3. Latest Collections */}
      <LatestCollections />

      {/* 4. Brand Editorial / Story Section */}
      <EditorialSection />

      {/* 5. Bestseller Section */}
      <BestSellers />

      {/* 6. Policy & Trust Items */}
      <OurPolicy />

      {/* 7. Final Newsletter CTA */}
      <NewsletterBox />
    </div>
  )
}

export default Home