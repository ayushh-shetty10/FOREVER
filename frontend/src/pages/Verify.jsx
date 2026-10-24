import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useShop } from "../hook/useShop";
import { toast } from "react-toastify";

const Verify = () => {
    const navigate = useNavigate();
    const { setCartItems, VerifyStripeFunc } = useShop();

    const [searchParams] = useSearchParams();

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const sessionId = searchParams.get("session_id");

    const verifyPayment = async () => {
        try {
            const res = await VerifyStripeFunc({ success, orderId, session_id: sessionId });
            if (res && res.success) {
                setCartItems({});
                if (res.isRequiredCheck) {
                    toast.warning("Payment received! Order placed under REQUIRED_CHECK due to expired reservation.");
                } else {
                    toast.success("Payment verified successfully!");
                }
                navigate("/orders");
            } else {
                toast.error("Payment Verification Failed");
                navigate("/cart");
            }
        } catch (err) {
            console.log(err);
            navigate("/");
        }
    };

    React.useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div className="container-store min-h-[60vh] flex flex-col items-center justify-center font-sans">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Verifying payment with bank...
            </p>
        </div>
    );
};

export default Verify;