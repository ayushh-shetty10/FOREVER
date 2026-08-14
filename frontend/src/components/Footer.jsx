import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Footer = () => {
  return (
    <div className="px-10 sm:px-20  ">
      
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 mb-10 mt-20 text-sm">
        
        <div>
          <img src={assets.logo} alt="" className="w-36 mb-5"></img>
          <p className="text-gray-600  w-full sm:w-2/3  ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore accusantium sint harum deleniti perspiciatis facilis ducimus quisquam veniam? Nam praesentium veritatis, soluta aut tenetur voluptatem aliquid repellat earum eligendi nulla!</p>
        </div>
        <div >
          <p className="text-xl mb-5 font-medium">COMPANY</p>
          <ul className="flex flex-col text-gray-600 gap-1 ">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div >
          <p className="text-xl mb-5 font-medium">GET IN TOUCH</p>
          <ul className="flex flex-col text-gray-600 gap-1 ">
            <li>+91-9845695247</li>
            <li>radom@gmail.com</li>
            <li>Lorem ipsum,Bheem ke ghar ke samne, Dholakpur,Bangalore. </li>
          </ul>
        </div>
      </div>

      <hr></hr>
      <p className="py-5 text-sm text-center">Copyright 2026@ forever.com-ALL RIGHTS RESERVED.</p>
    </div>
  )
}

export default Footer