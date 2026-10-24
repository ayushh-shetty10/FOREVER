import { useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import { toast } from "react-toastify"

import { 
    AddItemApi, 
    ListItemsApi, 
    RegisterApi, 
    RemoveItemApi, 
    LoginApi, 
    LogoutApi, 
    AddToCartApi, 
    UpdateCartApi, 
    GetMyCartApi, 
    PlaceOrderCodApi, 
    GetUserOrdersApi, 
    GetAllOrdersApi, 
    UpdateOrderStatusApi, 
    PlaceOrderStripeApi, 
    PlaceOrderRazorpayApi, 
    verifyRazorpayApi, 
    verifyStripeApi, 
    markOrderFailedApi, 
    UpdateBestsellerApi, 
    UpdateStockApi 
} from "../api/api";

export const useShop = () => {
   
    const context = useContext(ShopContext);
    const {
        currency,
        delivery_fee,
        products,
        setProducts,
        GetAllProducts,
        search,
        setSearch,
        cartItems,
        setCartItems,
        GetCartCount,
        AddToCart,
        UpdateQuantity,
        GetCartAmount,
        loading,
        setLoading,
        user,
        setUser,
        checkingAuth
    } = context;

    const AddItemFunc = async ({ name, description, price, category, subCategory, sizes, bestseller, image1, image2, image3, image4 }) => {
        setLoading(true);
        try {
            const response = await AddItemApi({ name, description, price, category, subCategory, sizes, bestseller, image1, image2, image3, image4 });
            if (response) {
                await GetAllProducts();
            }
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const ListItemsFunc = async () => {
        setLoading(true);
        try {
            const response = await ListItemsApi();
            if (response?.products) {
                setProducts(response.products);
            }
            return response;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const RemoveItemFunc = async ({ _id }) => {
        setLoading(true);
        try {
            const response = await RemoveItemApi({ _id });
            if (response && response.message === "Product removed successfully") {
                setProducts(prev => prev.filter(item => item._id !== _id));
            }
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const LoginFunc = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await LoginApi({ email, password });
            return response;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const RegisterFunc = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const response = await RegisterApi({ username, email, password });
            return response;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const LogoutFunc = async () => {
        setLoading(true);
        try {
            const response = await LogoutApi();
            return response;
        } catch (err) {
            console.log(err);
        } finally {
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
                toast.success("Added to bag");
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

    const PlaceOrderCODFunc = async (orderData) => {
        setLoading(true);
        try {
            const res = await PlaceOrderCodApi(orderData);
            if (res && (res.success || res.message === "Order placed (COD) successfully!")) {
                await GetAllProducts();
            }
            return res;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const GetUserOrdersFunc = async () => {
        setLoading(true);
        try {
            const res = await GetUserOrdersApi();
            return res;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const GetAllOrdersFunc = async () => {
        setLoading(true);
        try {
            const res = await GetAllOrdersApi();
            return res;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const UpdateOrderStatusFunc = async ({ orderId, status }) => {
        setLoading(true);
        try {
            const res = await UpdateOrderStatusApi({ orderId, status });
            return res;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const PlaceOrderStripeFunc = async (orderData) => {
        setLoading(true);
        try {
            const res = await PlaceOrderStripeApi(orderData);
            return res;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const PlaceOrderRazorpayFunc = async (orderData) => {
        setLoading(true);
        try {
            const res = await PlaceOrderRazorpayApi(orderData);
            return res;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const VerifyRazorpayFunc = async (paymentData) => {
        setLoading(true);
        try {
            const res = await verifyRazorpayApi(paymentData);
            if (res && res.success) {
                await GetAllProducts();
            }
            return res;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const MarkOrderFailedFunc = async (orderId) => {
        setLoading(true);
        try {
            await markOrderFailedApi(orderId);
            await GetAllProducts();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const VerifyStripeFunc = async (paymentData) => {
        setLoading(true);
        try {
            const res = await verifyStripeApi(paymentData);
            if (res && res.success) {
                await GetAllProducts();
            }
            return res;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const UpdateBestsellerFunc = async ({ id, bestseller }) => {
        setLoading(true);
        try {
            const res = await UpdateBestsellerApi({ id, bestseller });
            const updatedProd = res?.product;
            if (updatedProd) {
                setProducts(prev => prev.map(p => p._id === id ? updatedProd : p));
            } else {
                setProducts(prev => prev.map(p => p._id === id ? { ...p, bestseller } : p));
            }
            return res;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const UpdateStockFunc = async ({ id, totalStock }) => {
        setLoading(true);
        try {
            const res = await UpdateStockApi({ id, totalStock });
            if (res && res.product) {
                setProducts(prev => prev.map(p => p._id === id ? res.product : p));
            }
            return res;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return {
        currency,
        delivery_fee,
        products,
        setProducts,
        GetAllProducts,
        search,
        setSearch,
        cartItems,
        setCartItems,
        AddToCart,
        GetCartCount,
        UpdateQuantity,
        GetCartAmount,
        loading,
        setLoading,
        user,
        setUser,
        AddItemFunc,
        ListItemsFunc,
        list: products,
        setList: setProducts,
        RemoveItemFunc,
        LoginFunc,
        RegisterFunc,
        LogoutFunc,
        checkingAuth,
        AddToCartFunc,
        UpdateCartFunc,
        GetMyCartFunc,
        PlaceOrderCODFunc,
        GetUserOrdersFunc,
        GetAllOrdersFunc,
        UpdateOrderStatusFunc,
        PlaceOrderStripeFunc,
        PlaceOrderRazorpayFunc,
        VerifyRazorpayFunc,
        VerifyStripeFunc,
        MarkOrderFailedFunc,
        UpdateBestsellerFunc,
        UpdateStockFunc
    };
}