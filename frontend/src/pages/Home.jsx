import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import LatestCollections from '../components/LatestCollections'
import BestSellers from '../components/BestSellers'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'


const Home = () => {



  return (
    <div>
      <Hero/>
      <LatestCollections />
      <BestSellers />
      <OurPolicy />
      <NewsletterBox />

    </div>
  )
}

export default Home