const { userModel } =require("../models/userModel");


/**
 * @router POST:api/cart/addToCart
 * @description 
 * adds cartItems to user in DB
 */
 const addToCart=async(req,res)=>{
    try{
        const userId = req.user.id;
        const {itemId,size} =req.body
        const userData =await userModel.findById(userId);
        
        if(!userData)return res.status(404).json({
            message:"User not found.",
        })

        let cartData= userData.cartData;

        if(cartData[itemId]){
            if(cartData[itemId ][size]){
                cartData[itemId][size]+=1;

            }
            else{
                cartData[itemId][size]=1;
            }
        }
        else{
            cartData[itemId]={}
            cartData[itemId][size]=1;
        }

        const newCartData = await userModel.findByIdAndUpdate(userId,{cartData});
        if(newCartData)return res.status(200).json({
            message:"Item added to cart successfully!",

        })
    }catch(err){
        console.log(err);
        return res.status(400).json({
            message:"Failed to add Item to Cart"
        })
    }
}
/**
 * @router POST:api/cart/updateCart
 * @description 
 * update cart items in DB
 */
 const updateCart=async(req,res)=>{
    try{
        const userId=req.user.id;
        const {itemId,size,quantity}=req.body;
        const userData =await userModel.findById(userId);
        
        if(!userData)return res.status(404).json({
            message:"User not found.",
        })

        let cartData= userData.cartData || {};

        if (quantity === 0) {
            if (cartData[itemId]) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        } else {
            if (!cartData[itemId]) {
                cartData[itemId] = {};
            }
            cartData[itemId][size] = quantity;
        }

        // Use markModified and save to ensure mixed type updates are saved correctly,
        // or findByIdAndUpdate with a new object clone to force MongoDB to overwrite.
        // We will clone cartData to be sure mongoose doesn't think it is unchanged.
        const updatedCartData = { ...cartData };
        const newUserData = await userModel.findByIdAndUpdate(
            userId,
            { cartData: updatedCartData },
            { new: true }
        );

        if(newUserData){
              return res.status(201).json({
                 message:"Cart updated successfully. "
              })
        }
        

    }catch(err){
        console.error(err);
        return res.status(401).json({
            message:"Failed to update cart. "
        })
    }
}
/**
 * @router GET:api/cart/getMyCart
 * @description 
 * fetches user cart
 */
 const getMyCart=async(req,res)=>{
    try{
        const userId=req.user.id;
        const userData = await userModel.findById(userId);
        const cartData= userData.cartData;
        return res.status(201).json({
            message:"Cart fetched successfully",
            cartData
        })
    }catch(err){
        return res.status(401).json({
            message:"Failed to fetch cart. "
        })
    }
}

module.exports = {addToCart,updateCart,getMyCart};