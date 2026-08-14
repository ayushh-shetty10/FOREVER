import React, { useEffect, useState } from 'react'
import { useShop } from '../hook/useShop';
import { toast } from 'react-toastify';
//import { products } from '../assets/frontend_assets/assets';

const ListItems = () => {
 
 const {ListItemsFunc,list,setList,currency,RemoveItemFunc,products} = useShop();

   const ListProducts = async()=> {
   try{
    
     const res = await ListItemsFunc();
     if(!res.products){
       
       toast.error("Error fetching products!")
       return;
     }
   
    
   }catch(err){
     console.log(err);
   }
     
  }
 
 
 
  useEffect (()=>{
  
   ListProducts();
 
  },[]);
 const handleRemoveProduct = async(_id) => {

  try{
    const res = await RemoveItemFunc({_id});
    if(res?.message !== "Product removed successfully"){
     toast.error(res?.message || "Failed to remove product");
     return;
  }
   toast.success("Product removed successfully!");
    const updatedList = list.filter((item) => item._id !== _id);
    setList(updatedList);
  }catch(err){
    toast.error(err?.response?.data?.message || "Failed to remove product");
  }

 }
 

  return (
    <div className='flex flex-col gap-3 mt-5 px-5 h-full overflow-y-scroll'>
      <h1 className='text-center '>List of Products:</h1>
        <div className='hidden sm:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] border bg-gray-300 rounded items-center px-2 py-1'> 

          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        
        </div>
         
         {
         list? list.map((item,index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] sm:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 text-sm border border-gray-400' key={index}>
                <img className="w-12 h-12"src={item.images[0]} alt=""></img>
                <p className='hidden sm:block' >{item.name}</p>
                <p className='hidden sm:block'>{item.category}</p>
                <p className="hidden sm:block">{currency}{item.price}</p>

                <div className="flex flex-col gap-1 px-2 py-1 sm:hidden">
                   <p >{item.name}</p>
                <p >{item.category}</p>
                <p >{currency}{item.price}</p>
                </div>
                <div onClick={()=>handleRemoveProduct(item._id)}><p className='text-right sm:text-center cursor-pointer text-lg'>X</p></div>
            </div>
          )):""
         }

         
    </div>
  )
}

export default ListItems