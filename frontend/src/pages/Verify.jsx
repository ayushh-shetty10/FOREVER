import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useShop } from "../hook/useShop";



const Verify = () => {
    const navigate = useNavigate();
    const {setCartItems, VerifyStripeFunc} = useShop();

    const [searchParams,setSearchParams]=useSearchParams();

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const sessionId = searchParams.get("session_id");

    const verifyPayment = async () => {
            try{
                const res = await VerifyStripeFunc({ success, orderId, session_id: sessionId });
                if(res && res.success){
                    setCartItems({});
                    navigate("/orders");
                }else{
                    alert("Payment Failed");
                    navigate("/cart");
                }
            }catch(err){
                console.log(err);
                navigate("/");
            }
    }

    React.useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div></div>
    )
}

export default Verify;