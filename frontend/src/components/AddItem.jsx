import React from "react";
import { FaCloudArrowDown } from "react-icons/fa6";
import { useShop } from "../hook/useShop";
import { useState } from "react";
import { toast } from "react-toastify";

const AddItem = () => {
  const [image1, setImage1] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image2, setImage2] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const {AddItemFunc} = useShop();

  const handleSubmit = async(e) => {
   e.preventDefault();
   
   try{
    const response = await AddItemFunc({name,description,price,category,subCategory,sizes,bestseller,image1,image2,image3,image4});
    if(response?.message !== "Product added successfully!"){
      toast.error(response?.message || "Failed to add product");
      return;
    }
   

   toast.success("Product Added Successfully!");
    setName("");
    setDescription("");
    setPrice("");
    setBestseller(false);
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    setSizes([]);
    setCategory("Men");
    setSubCategory("Topwear");
   
   return;

   }catch(err){
    toast.error(err?.response?.data?.message || err.message || "Failed to add product");
   }
   
  }


  return (
    <div className="p-5  ml-2 sm:ml-5">
      <form className="max-w-75 pr-7 sm:max-w-125" onSubmit={handleSubmit}>
        <p>Upload Image</p>
        {/* upload images */}
        <div className="flex gap-3 mt-2 text-gray-500">
          <label htmlFor="image1">
            {!image1 ? (
              <div className="flex flex-col items-center justify-center w-15 h-15 sm:w-20 sm:h-20 border">
                <FaCloudArrowDown className="w-5 h-5" />
                <p>Upload</p>
              </div>
            ) : (
              <img
                src={URL.createObjectURL(image1)}
                alt=""
                className="w-15 h-15 sm:w-20 sm:h-20"
              ></img>
            )}

            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>

          <label htmlFor="image2">
            {!image2 ? (
              <div className="flex flex-col items-center justify-center w-15 h-15 sm:w-20 sm:h-20 border">
                <FaCloudArrowDown className="w-5 h-5" />
                <p>Upload</p>
              </div>
            ) : (
              <img
                src={URL.createObjectURL(image2)}
                alt=""
                className="w-15 h-15 sm:w-20 sm:h-20"
              ></img>
            )}

            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>

          <label htmlFor="image3">
            {!image3 ? (
              <div className="flex flex-col items-center justify-center w-15 h-15 sm:w-20 sm:h-20 border">
                <FaCloudArrowDown className="w-5 h-5" />
                <p>Upload</p>
              </div>
            ) : (
              <img
                src={URL.createObjectURL(image3)}
                alt=""
                className="w-15 h-15 sm:w-20 sm:h-20"
              ></img>
            )}

            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>

          <label htmlFor="image4">
            {!image4 ? (
              <div className="flex flex-col items-center justify-center w-15 h-15 sm:w-20 sm:h-20 border">
                <FaCloudArrowDown className="w-5 h-5" />
                <p>Upload</p>
              </div>
            ) : (
              <img
                src={URL.createObjectURL(image4)}
                alt=""
                className="w-15 h-15 sm:w-20 sm:h-20"
              ></img>
            )}

            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>

        <div className="relative flex flex-col mt-7">
          <label className="absolute -top-3.25 left-2.5 bg-white px-2">
            Product name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter here"
            className="px-3 py-2  text-sm border rounded outline-0 "
          ></input>
        </div>

        <div className="relative flex flex-col mt-7">
          <label className="absolute -top-3.25 left-2.5 bg-white px-2">
            Product Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write content here"
            className="px-3 py-2  text-sm border rounded outline-0 h-25"
          ></textarea>
        </div>

        <div className="flex gap-3 justify-between  mt-5 ">
          <div className="flex-1">
            <p>Product Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-500 px-2 py-1 text-sm w-full mt-2 outline-0"
            >
                <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div className="flex-1">
            <p>Sub Category</p>
            <select
                value={subCategory}
              className="border border-gray-500 px-2 py-1 text-sm w-full mt-2 outline-0"
              onChange={(e) => setSubCategory(e.target.value)}
            >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div className="flex-1">
            <p>Product Price</p>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              className="border border-gray-500  px-2 py-1 w-[80%] mt-2 text-sm outline-0"
              placeholder={`10`}
            ></input>
          </div>
        </div>

        <p className="pt-3">Product Sizes</p>
        <div className="flex flex-wrap gap-3 mt-2">
          <div onClick={()=>sizes.includes("S")?setSizes(prev=>prev.filter((size)=>size!=="S")):setSizes([...sizes,"S"])}>
            <p
              className={`px-4 py-1 bg-gray-400 text-gray-900 cursor-pointer ${sizes.includes("S") ? "bg-gray-700 text-white" : ""} `}
            >
              S
            </p>
          </div>
          <div onClick={()=>sizes.includes("M")?setSizes(prev=>prev.filter((size)=>size!=="M")):setSizes([...sizes,"M"])}>
            <p  className={`px-4 py-1 bg-gray-400 text-gray-900 cursor-pointer ${sizes.includes("M") ? "bg-gray-700 text-white" : ""} `}>M</p>
          </div>
          <div onClick={()=>sizes.includes("L")?setSizes(prev=>prev.filter((size)=>size!=="L")):setSizes([...sizes,"L"])}>
            <p  className={`px-4 py-1 bg-gray-400 text-gray-900 cursor-pointer ${sizes.includes("L") ? "bg-gray-700 text-white" : ""} `}>L</p>
          </div>
          <div onClick={()=>sizes.includes("XL")?setSizes(prev=>prev.filter((size)=>size!=="XL")):setSizes([...sizes,"XL"])}>
            <p  className={`px-4 py-1 bg-gray-400 text-gray-900 cursor-pointer ${sizes.includes("XL") ? "bg-gray-700 text-white" : ""} `}>XL</p>
          </div>
          <div onClick={()=>sizes.includes("XXL")?setSizes(prev=>prev.filter((size)=>size!=="XXL")):setSizes([...sizes,"XXL"])}>
            <p  className={`px-4 py-1 bg-gray-400 text-gray-900 cursor-pointer ${sizes.includes("XXL") ? "bg-gray-700 text-white" : ""} `}>XXL</p>
          </div>
        </div>

        <div className="mt-3 ">
          <label className="cursor-pointer" htmlFor="bestseller">
            <input  onChange = {()=>setBestseller(!bestseller)} checked={bestseller} type="checkbox" id="bestseller" /> Add to Bestseller
          </label>
        </div>

        <button type="submit"  className="px-5 py-2 mt-4 active:bg-gray-500 active:text-gray-800 cursor-pointer bg-gray-800 text-white rounded-1">Add Product</button>
      </form>
    </div>
  );
};

export default AddItem;
