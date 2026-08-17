import { useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import {toast} from "react-toastify"

import { AddItemApi, ListItemsApi, RegisterApi, RemoveItemApi ,LoginApi,LogoutApi, AddToCartApi, UpdateCartApi, GetMyCartApi,PlaceOrderCodApi,GetUserOrdersApi, GetAllOrdersApi, UpdateOrderStatusApi,PlaceOrderStripeApi} from "../api/api";

export const useShop = () =>{
   
    const context=useContext(ShopContext);
    const {currency,delivery_fee,products,search,setSearch,cartItems,setCartItems,GetCartCount,AddToCart,UpdateQuantity,GetCartAmount, loading,setLoading,list,setList,user,setUser,checkingAuth}=context;

   const AddItemFunc =async ({name,description,price,category,subCategory,sizes,bestseller,image1,image2,image3,image4}) => {
            setLoading(true);
            try{
                const response =await AddItemApi({name,description,price,category,subCategory,sizes,bestseller,image1,image2,image3,image4});
               
                return response;
            }catch(err){
                console.log(err);
                throw err;
            }finally{
                setLoading(false);
            }
   }

   const ListItemsFunc = async()=>{
     setLoading(true);
            try{
                const response =await ListItemsApi();
               
                setList(response.products);
               
                return response;
            }catch(err){
                console.log(err);
            }finally{
                setLoading(false);
            }
   }

   const RemoveItemFunc = async({_id}) => {
    setLoading(true);
    try{
        const response = await RemoveItemApi({_id});
        return response;
    }catch(err){
        console.log(err);
        throw err;
    }finally{
        setLoading(false);
    }
   }

//    const urlToFile = async (url, fileName) => {
//     const response = await fetch(url);
//     const blob = await response.blob();
//     return new File([blob], fileName, { type: blob.type || "image/png" });
//    }

//    const addItemstoDB = async() => {
//     for( let i = 0;i<products.length;i++){
//         const product = products[i];
//         try{
//            const imageFiles = await Promise.all(
//             product.image.map((imageUrl, imageIndex) =>
//                 urlToFile(imageUrl, `${product._id || product.name}-${imageIndex + 1}.png`)
//             )
//            );

//            const res = await AddItemFunc({
//             name:product.name,
//             description:product.description,
//             price:product.price,
//             category:product.category,
//             subCategory:product.subCategory,
//             sizes:product.sizes,
//             bestseller:product.bestseller,
//             image1:imageFiles[0],
//             image2:imageFiles[1],
//             image3:imageFiles[2],
//             image4:imageFiles[3],

//            });
           
//         }catch(err){
//             console.log(err);
//         }
//     }
// }

    const LoginFunc = async({email,password}) => {
        setLoading(true);
        try{
            const response = await LoginApi({email,password});
            return response;
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }

    }

    const RegisterFunc = async({username,email,password})=> {
         setLoading(true);
        try{
            const response = await RegisterApi({username,email,password});
           return response;
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const LogoutFunc = async() => {
        setLoading(true);
        try{
            const response = await LogoutApi();
            return response;
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }

    }

    const AddToCartFunc = async (itemId, size) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }
        setLoading(true);
        try {
            const response = await AddToCartApi({ itemId, size });
            if (response) {
                AddToCart(itemId, size);
            }
            return response;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const UpdateCartFunc = async (itemId, size, quantity) => {
        setLoading(true);
        try {
            const response = await UpdateCartApi({ itemId, size, quantity });
            if (response) {
                UpdateQuantity(itemId, size, quantity);
            }
            return response;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const GetMyCartFunc = async () => {
        setLoading(true);
        try {
            const response = await GetMyCartApi();
            if (response?.cartData) {
                setCartItems(response.cartData);
            }
            return response;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const PlaceOrderCODFunc = async(orderData) => {
        setLoading(true);
        try{
            const res = await PlaceOrderCodApi(orderData);
            return res;
        }
        catch(err){
            console.log(err);
           
        }
        finally{
            setLoading(false);
        }
    }

    const GetUserOrdersFunc = async() => {
        setLoading(true);
        try{
            const res = await GetUserOrdersApi();
            return res;
        }
        catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const GetAllOrdersFunc = async() => {
        setLoading(true);
        try {
            const res = await GetAllOrdersApi();
            return res;
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const UpdateOrderStatusFunc = async({orderId, status}) => {
        setLoading(true);
        try {
            const res = await UpdateOrderStatusApi({orderId, status});
            return res;
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const PlaceOrderStripeFunc = async(orderData)=> {
        setLoading(true);
        try{
            const res = await PlaceOrderStripeApi(orderData);
            return res;
        }
        catch(err){
            console.log(err);
           
        }
        finally{
            setLoading(false);
        }
    }

    return {currency,delivery_fee,products,search,setSearch,cartItems,setCartItems,AddToCart,GetCartCount,UpdateQuantity,GetCartAmount, loading,setLoading,user,setUser,AddItemFunc,ListItemsFunc,list,setList,RemoveItemFunc,LoginFunc,RegisterFunc,LogoutFunc,checkingAuth,AddToCartFunc,UpdateCartFunc,GetMyCartFunc,PlaceOrderCODFunc,GetUserOrdersFunc,GetAllOrdersFunc,UpdateOrderStatusFunc,PlaceOrderStripeFunc};


}