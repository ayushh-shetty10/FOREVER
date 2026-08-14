import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useShop } from "../hook/useShop";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products,currency,AddToCart } = useShop();
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size,setSize] = useState("");

  const fetchProductData = () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.images[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId,products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* --------Product Data-------- */}
      <div className="flex gap-8 sm:gap-12 flex-col sm:flex-row">

        {/* ------Product Images-------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* ----side images----- */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.images.map((item,index)=>(
              <img onClick={()=>setImage(item)}src={item} alt="" key={index} className="w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer " />
            ))}
          </div>
          {/* ----main image----- */}
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt=""></img>
          </div>
        </div>

        {/* ------Product details------ */}
        <div className="flex-1">
              <h1 className="font-medium mt-2 text-2xl">{productData.name}</h1>
              <div className="flex gap-1 mt-2 items-center">
                <img src={assets.star_icon} alt="" className="w-3"/>
                <img src={assets.star_icon} alt="" className="w-3"/>
                <img src={assets.star_icon} alt="" className="w-3"/>
                <img src={assets.star_icon} alt="" className="w-3"/>
                <img src={assets.star_dull_icon} alt="" className="w-3"/>
                <p className="pl-2">(122)</p>
              </div>
              <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
              <p className="mt-5 text-gray-500 md:w-3/4">{productData.description}</p>
              <div className="flex flex-col gap-4 my-8">
                <p>Select Size</p>
                <div className="flex gap-2 ">
                  {productData.sizes.map((item,index)=>(
                    <button onClick={()=>setSize(item)} key={index} className={`border bg-gray-300 px-4 py-2 ${size===item?"bg-gray-700 text-white":""} `}>{item}</button>
                  ))}
                </div>
              </div>
                <button onClick={()=>AddToCart(productData._id,size)}className="px-8 py-3 text-sm bg-black text-white active:bg-gray-700 ">ADD TO CART</button>
                <hr className="mt-8 sm:w-3/4"></hr>
              <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
                    <p>100% Original Product.</p>
                    <p>Cash on delivery is available on this product.</p>
                    <p>Easy return and exchange policy within 7 days.</p>
              </div>
        </div>
      </div>

      {/* ------Description and Review section------ */}
      <div className="mt-20 ">
        <div className="flex">
          <p className="px-5 py-3 border text-sm "> Description</p>
          <p className="px-5 py-3 border text-sm " >Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident iure molestias modi maiores cupiditate non nulla sequi vero, corrupti animi iste facere reiciendis quod cumque obcaecati blanditiis molestiae labore beatae.</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque, eligendi nemo minima hic voluptas, adipisci porro.</p>
        </div>
      </div>

      {/* -------Display related Products------ */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory}></RelatedProducts>

    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
