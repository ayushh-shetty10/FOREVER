import React from 'react'

const NewsletterBox = () => {
    const handleSubSubmit = (e)=>{
        e.preventDefault();
    }
  return (
    <div className="text-center px-2">
        <p className='text-2xl font-medium text-gray-800'>Subscribe Now and get 20% off!</p>
        <p className="text-gray-400 mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde fugit quis hic veritatis impedit perferendis, recusandae fuga eligendi rem porro.
        </p>
        <form onSubmit={handleSubSubmit}className="w-[90%] sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3">
            <input type="email" placeholder='Enter your email' className="w-full sm:flex-1 outline-none"></input>
            <button type="submit" className="bg-gray-700 text-white text-xs px-10 py-4 active:bg-gray-400 transition">SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsletterBox