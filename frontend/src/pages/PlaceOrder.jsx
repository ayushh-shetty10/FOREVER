import React, { useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  
  const [method,setMethod]= useState("cod");
  const navigate = useNavigate();

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 px-5 sm:pt-14 min-h-[80vh] border-t'>
      {/*---------- Left side ------------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>
          <div className='flex gap-3'>
            <input type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full'placeholder="First Name"/>
            <input type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full' placeholder="Last Name"/>
          </div>
          <input type="email" className='border border-gray-500 rounded py-1.5 px-3.5 w-full'placeholder="Email"/>
          <input type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full' placeholder="Street"/>
          <div className='flex gap-3'>
            <input type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full'placeholder="City"/>
            <input type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full' placeholder="State"/>
          </div>
          <div className='flex gap-3'>
            <input type="number" className='border border-gray-500 rounded py-1.5 px-3.5 w-full'placeholder="PinCode"/>
            <input type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full' placeholder="Country"/>
          </div>
          <input type="number" className='border border-gray-500 rounded py-1.5 px-3.5 w-full'placeholder="Phone Number"/>
      </div>

      {/* ----------RIGHT SIDE-------- */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className='flex gap-3 flex-col lg:flex-row'>
              <div  onClick={()=>setMethod("stripe") } className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='stripe'?"bg-blue-400":""}`}></p>
                <img src={assets.stripe_logo} alt="" className='h-5 mx-4' />
              </div>
              <div onClick={()=>setMethod("razorpay") } className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='razorpay'?"bg-blue-400":""}`}></p>
                <img src={assets.razorpay_logo} alt="" className='h-5 mx-4' />
              </div>
              <div  onClick={()=>setMethod("cod") }className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod'?"bg-blue-400":""}`}></p>
                <p className='text-gray-700 font-medium text-sm mx-4'>CASH ON DELIVERY</p>
              </div>
          </div>

          <div className='w-full text-end mt-5'>
            <button onClick={()=>navigate("/orders")}className="px-5 py-2 text-sm bg-black text-white active:bg-gray-700 ">PLACE ORDER</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PlaceOrder