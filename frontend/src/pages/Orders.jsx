import React, { useState,useEffect } from 'react'
import Title from '../components/Title'
import { toast } from 'react-toastify';

import { useShop } from '../hook/useShop';

const Orders = () => {
  const {products,currency,GetUserOrdersFunc}=useShop();
  const [orderItems,setOrderItems]=useState([]);

  const fetchOrder = async(showToast = false) => {
    try{
      const res = await GetUserOrdersFunc();
      if(res){
        let allOrdersItem = [];
        res.userOrders.map((order)=>{
          order.items.map((item)=>{
            item["status"]=order.status;
            item["payment"]=order.payment;
            item["paymentMethod"]=order.paymentMethod;
            item["date"]=order.date;
            allOrdersItem.push(item);
          })
        })
        setOrderItems(allOrdersItem.reverse());
        if (showToast) {
          toast.success("Order status refreshed!");
        }
      }
    }catch(err){
      console.log(err);
    }
  }
  useEffect(()=>{ 
    fetchOrder();
  },[]);

  return (
    <div className="border-t pt-16 px-5">

      <div className='text-2xl'>
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orderItems?.map((item,index)=>(
          <div key={index} className='py-4 border-t text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-start gap-6 text-sm'>
              <img src={item.images[0]} className="w-16 sm:w-20"alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                  <p className='text-lg'>{currency}{item.price}</p>
                  <p>Quantity:{item.quantity}</p>
                  <p>Size:{item.size}</p>
                </div>
                <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(item.date).toLocaleDateString()}</span></p>
              </div>
            </div>
            <div className='md:w-1/2 flex justify-between '>
             <div className='flex items-center gap-2'>
              <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
              <p className='text-sm md:text-base'>{item.status}</p>
              </div>
              <button onClick={() => fetchOrder(true)} className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 active:bg-gray-100 transition-colors'>Track Order</button>
            </div>
            
          </div>

        ))}
      </div>
    </div>
  )
}

export default Orders