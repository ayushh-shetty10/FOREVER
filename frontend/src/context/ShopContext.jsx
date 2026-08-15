import React, { createContext, useEffect, useState } from 'react'
//import { products } from '../assets/frontend_assets/assets';

import { ListItemsApi, GetMeApi, GetMyCartApi } from '../api/api';

export const ShopContext=createContext();

export const ShopContextProvider = ({children}) => {

    const currency="$";
    const delivery_fee=10;
    const [search,setSearch]=useState("");
    const [cartItems,setCartItems]=useState({});
    const[user,setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    
    const [ loading,setLoading] = useState(false);
    const [list,setList] = useState([]);
    const [products,setProducts] = useState([]);
  
    

    const AddToCart = (itemId,size)=>{

            if(!size){
                toast.error("Select Product Size");
                return;
            }
    
          let cartData = structuredClone(cartItems);
    
          if(cartData[itemId]){
            if(cartData[itemId][size])cartData[itemId][size]++;
            else cartData[itemId][size]=1;
          }
          else{
            cartData[itemId]={};
            cartData[itemId][size]=1;
          }
          setCartItems(cartData);
        }

    const GetCartCount = () => {
        let totalCount = 0;
        for(const item in cartItems){
            for(const size in cartItems[item]){
                totalCount+=cartItems[item][size];
            }
        }
        return totalCount;
    }
    
    const UpdateQuantity= (id,size,quantity)=>{
          const cartItemsCopy=structuredClone(cartItems);
          cartItemsCopy[id][size]=quantity;
          setCartItems(cartItemsCopy);
    }

    const GetCartAmount=()=>{
      let totalCount=0;
      for(const item in cartItems){
        let itemInfo=products.find((product)=>product._id===item);
        for(const size in cartItems[item]){
          try{
              totalCount+=itemInfo.price*cartItems[item][size];
          }catch(error){}

          
        }
      }
      return totalCount;
    }

    const GetAllProducts = async()=>{
      try{
        const res = await ListItemsApi();
        if(res?.products){
          setProducts(res.products);
        }else{
          console.log("Error fetching products!");
        }
      }catch(err){
        console.log(err);
      }
    }

    const checkUserSession = async () => {
      try {
        const res = await GetMeApi();
        if (res?.user) {
          setUser(res.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    useEffect(()=>{
      GetAllProducts();
      checkUserSession();
    },[]);

    useEffect(() => {
      const fetchCart = async () => {
        if (user) {
          try {
            const res = await GetMyCartApi();
            if (res?.cartData) {
              setCartItems(res.cartData);
            }
          } catch (err) {
            console.log("Error fetching cart data:", err);
          }
        } else {
          setCartItems({});
        }
      };
      fetchCart();
    }, [user]);

    const values={
    products,currency,delivery_fee,search,setSearch,cartItems,setCartItems,AddToCart,GetCartCount,UpdateQuantity,GetCartAmount, loading,setLoading,list,setList,user,setUser,checkingAuth
     }

  return (
    <ShopContext.Provider value={values}>
        {children}
    </ShopContext.Provider>
  )
}

