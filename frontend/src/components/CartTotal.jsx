import React, { useContext } from 'react'
import { useShop } from '../hook/useShop'
import Title from "./Title.jsx"

const CartTotal = () => {

    const {currency,delivery_fee,GetCartAmount} = useShop();

  return (
    <div className='w-full'>
        <div className='text-2xl'> 
            <Title text1="CART" text2="TOTAL" />
        </div>

        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>SubTotal</p>
                <p>{currency}{GetCartAmount()}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency}{delivery_fee}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{currency}{GetCartAmount()===0?0:GetCartAmount()+delivery_fee}.00</b>
            </div>

        </div>

    </div>
  )
}

export default CartTotal