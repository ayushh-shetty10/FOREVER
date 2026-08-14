import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { useShop } from '../hook/useShop'

const SearchBar = () => {
    const {search,setSearch}=useShop();
  return (
    <div className="  mb-5 text-center  ">
        <div className="border border-gray-400 rounded-full inline-flex justify-center items-center mx-3 my-5 px-5 py-3 w-[80%] sm:w-3/4 ">
            <input type="text" placeholder="Search.." value={search} onChange={(e)=>{setSearch(e.target.value)}}className='outline-none flex-1 text-xl '></input>
            <img src={assets.search_icon} alt="" className='w-5 ' />
        </div>
    </div>
  )
}

export default SearchBar