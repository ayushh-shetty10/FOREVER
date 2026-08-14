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