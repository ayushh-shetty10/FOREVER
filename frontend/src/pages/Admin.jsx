import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { IoMdAddCircleOutline } from "react-icons/io";
import { CiDeliveryTruck } from "react-icons/ci";
import { AiFillProduct } from "react-icons/ai";
import { useState } from 'react';
import AddItem from '../components/AddItem';
import ListItems from '../components/ListItems';
import ListOrders from '../components/ListOrders';
import { useShop } from '../hook/useShop';
import { Navigate } from 'react-router-dom';

const Admin = () => {
 const {user} = useShop();
    const [tab,setTab]=useState("add");
   if(user && user.role==="ADMIN") {return (
    <div className='border-t flex  '>
        {/* SideBar */}
        <div className="w-[18%] sm:min-w-[160px] md:min-w-[200px] flex-shrink-0 min-h-screen border-r-2">
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                <div onClick={() => setTab('add')} className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1 cursor-pointer ${tab === 'add' ? 'bg-gray-400' : ''}`}>
                    <IoMdAddCircleOutline className=' h-8 w-8 sm:h-5 sm:w-5 text-gray-800'/>
                    <p className='hidden md:block'>Add Items</p>
                </div>
                <div onClick={() => setTab('items')} className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1 cursor-pointer ${tab === 'items' ? 'bg-gray-400' : ''}`}>
                    <AiFillProduct className=' h-8 w-8 sm:h-5 sm:w-5 text-gray-800'/>
                    <p className='hidden md:block'>List Items</p>
                </div>
                <div onClick={() => setTab('orders')} className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1 cursor-pointer ${tab === 'orders' ? 'bg-gray-400' : ''}`}>
                    <CiDeliveryTruck className=' h-8 w-8 sm:h-5 sm:w-5 text-gray-800 font-bold'/>
                    <p className='hidden md:block'>Orders</p>
                </div>

            </div>
        </div>

        <div className='flex-1 min-w-0 h-screen w-full'>
            {tab === 'add' && <AddItem />}
            {tab === 'items' && <ListItems />}
            {tab === 'orders' && <ListOrders />}
        </div>
    </div>
  )}else return (
    <Navigate to="/" replace />
  )
}

export default Admin