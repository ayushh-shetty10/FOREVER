import React, { useEffect,useState } from "react";
import { useShop } from "../hook/useShop";
import Title from "./Title";
import ProductItem from "./ProductItem.jsx";

const BestSellers = () => {
  const { products } = useShop();
  const [bestProducts,setBestProducts]=useState([]);
 
  useEffect(()=>{
    const bestProduct=products.filter((item)=>(item.bestseller));
    setBestProducts(bestProduct.slice(0,5));
  },[products]);


  return (
  // TITLE for BestProducts
    <div className="my-10 px-2">
      <div className="text-center py-8 text-3xl">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus soluta vero doloremque voluptatem alias, a blanditiis, possimus.</p>
      </div>

          {/*  list latest products: */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
    {bestProducts.map((product)=>(
      
        <ProductItem key={product._id}name={product.name} id={product._id} image={product.images} price={product.price}></ProductItem>
      
    )
    )}
    </div>
    </div>

  )
}

export default BestSellers