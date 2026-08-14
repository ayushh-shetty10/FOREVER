import React from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../hook/useShop'

const ProductItem = ({name,id,image,price}) => {

    const {currency}=useShop();
  return (
    <Link to={`/product/${id}`}>
    <div className="overflow-hidden">
        <img src={image[0]} alt="" className="hover:scale-110 transition ease-in-out"></img>
    </div>
    <p className="pt-3 pb-1 text-sm">{name}</p>
    <p className="text-sm font-medium">{currency}{price}</p>
    </Link>
   
  )
}

export default ProductItem