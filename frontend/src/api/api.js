import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: import.meta.env.BACKEND_URL || "http://localhost:4000",
    withCredentials:true,
});

const getApiErrorMessage = (err) => {
    return err?.response?.data?.message || err?.message || "Something went wrong";
};

export const AddItemApi = async({name,description,price,category,subCategory,sizes,bestseller,image1,image2,image3,image4}) => {
try{
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("bestseller", bestseller);
    formData.append("image1",image1);
    formData.append("image2",image2);
    formData.append("image3",image3);
    formData.append("image4",image4);

    const response = await api.post("/api/product/addProduct",formData);

    return response.data;
}
catch(err){
    toast.error(getApiErrorMessage(err));
}

}

export const ListItemsApi = async()=> {
    try{
    const response = await api.get("api/product/listProducts");
    return response.data;
    }catch(err){
        toast.error(getApiErrorMessage(err));
    }
}

export const RemoveItemApi = async ({_id})=> {
    try{
    const response = await api.post("api/product/removeProduct",{id:_id});
    console.log(response.data.message);
    return response.data;
    }
    catch(err){
        toast.error(getApiErrorMessage(err));
    }
}

export const LoginApi = async({email,password})=>{
    try{
    const response  = await api.post("api/auth/login",{email,password});
    console.log(response.data.message);
    return response.data;
    }
    catch(err){
        toast.error(getApiErrorMessage(err));
        console.log(err);
    }
}

export const RegisterApi = async({username,email,password}) => {
    try{
    const response = await api.post("api/auth/register",{username,email,password});
    console.log(response.data.message);
    return response.data;
    }catch(err){
        toast.error(getApiErrorMessage(err));
        console.log(err);
    }
}

export const LogoutApi = async() => {
    try{
    const response = await api.post("api/auth/logout",{});
    console.log(response.data.message);
    return response.data;
    }
    catch(err){
        toast.error(getApiErrorMessage(err));
        console.log(err);
    }

 }

export const GetMeApi = async() => {
    try {
        const response = await api.get("api/auth/me");
        return response.data;
    } catch(err) {
        console.log("Session verification failed:", err?.response?.data?.message || err?.message);
        
    }
 }

export const GetMyCartApi = async() => {
    try {
        const response = await api.get("api/cart/getMyCart");
        return response.data;
    } catch(err) {
        toast.error(getApiErrorMessage(err));
        console.log(err);
       
    }
}

export const AddToCartApi = async({itemId,size}) => {
    try {
        const response = await api.post("api/cart/addToCart",{itemId,size});
        return response.data;
    } catch(err) {
        toast.error(getApiErrorMessage(err));
        console.log(err);
        
    }
}
export const UpdateCartApi  = async({itemId,size,quantity}) => {
    try {
        const response = await api.post("api/cart/updateCart",{itemId,size,quantity});
        return response.data;
    } catch(err) {
        toast.error(getApiErrorMessage(err));
        console.log(err);
    }
}

export const PlaceOrderCodApi = async(orderData) => {
    try{
        const response = await api.post("api/orders/place",orderData);
        return response.data;
    }
    catch(err){
    toast.error(getApiErrorMessage(err));
        console.log(err);
    }
}

export const GetUserOrdersApi = async() => {
    try {
        const response = await api.get("api/orders/userorders");
        return response.data;
    } catch(err) {
        toast.error(getApiErrorMessage(err));
        console.log(err);
       
    }
}

export const GetAllOrdersApi = async() => {
    try {
        const response = await api.get("api/orders/list");
        return response.data;
    } catch(err) {
        toast.error(getApiErrorMessage(err));
        console.log(err);
    }
}

export const UpdateOrderStatusApi = async({orderId, status}) => {
    try {
        const response = await api.post("api/orders/status", {orderId, status});
        return response.data;
    } catch(err) {
        toast.error(getApiErrorMessage(err));
        console.log(err);
    }
}

export const PlaceOrderStripeApi = async(orderData)=> {
    try{
        const response = await api.post("api/orders/stripe",orderData);
        return response.data;
    }
    catch(err){
    toast.error(getApiErrorMessage(err));
        console.log(err);
    }
}

export const PlaceOrderRazorpayApi = async(orderData)=>{
    try{
        const response = await api.post("api/orders/razorpay",orderData);
        return response.data;
    }
    catch(err){
    toast.error(getApiErrorMessage(err));
        console.log(err);
    }
}

export const verifyRazorpayApi = async(paymentData) => {
    try{
        const response = await api.post("api/orders/verifyRazorpay",paymentData);
        return response.data;
    }
    catch(err){
    toast.error(getApiErrorMessage(err));
        console.log(err);
    }
}

export const markOrderFailedApi = async(orderId) => {
    try{
        const response = await api.post("api/orders/markFailed",{orderId});
        return response.data;
    }
    catch(err){
        console.log(err);
    }
}


