import React, { useEffect, useState } from 'react'
import { useShop } from '../hook/useShop'
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

    const {products,currency,cartItems,UpdateCartFunc}=useShop();
    const [cartData,setCartData]=useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
      let tempData = [];
      for(const item in cartItems){
        for(const size in cartItems[item]){
          if(cartItems[item][size]>0){
            tempData.push({
              _id:item,
              size:size,
              quantity:cartItems[item][size],

            })
          }
        }
      }
       setCartData(tempData);
    },[cartItems]);

  return (
    <div className='border-t pt-14 px-5'>
      <div className='text-2xl mb-3 '>
        <Title text1={'YOUR'} text2={'CART'}></Title>
      </div>

      <div>
        {
          cartData.map((item,index)=>{
            const productData=products.find((product)=>product._id===item._id);

            return(
              <div key={index} className='py-4 border-t text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 '>
                <div className='flex items-start gap-6'>
                  <img src={productData.images[0]} className='w-16 sm:w-20' alt="" />
                  <div className='flex flex-col gap-2 text-sm'>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2 '>
                         <p> {item.size}</p>

                         <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50 '>{currency}{productData.price}</p>
                    </div>
                   
                  </div>


                </div>

                
                <input type="number"  onChange={(e)=>e.target.value==="" || e.target.value==="0" ?null:UpdateCartFunc(item._id,item.size,Number(e.target.value))} min={1} defaultValue={item.quantity} className='max-w-10 border sm:max-w-20 px-1 sm:px-2 sm:py-1 '/>
                  
                <img onClick={()=>{UpdateCartFunc(item._id,item.size,0)}} src={assets.bin_icon} alt="" className='w-4 cursor-pointer sm:w-5 mr-4'/>

              </div>
            )
          })
        }
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end' >
            <button onClick={()=>navigate("/place-order")} className="px-8 py-3 my-8 text-sm bg-black text-white active:bg-gray-700 ">PROCEED TO CHECKOUT</button>
          </div>
        </div>
      
      </div>
       
    </div>
  )
}


export default Cart