import React, { useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../hook/useShop'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  
  const [method,setMethod]= useState("cod");
  const navigate = useNavigate();
  const {cartItems,setCartItems,products,GetCartAmount,delivery_fee,PlaceOrderCODFunc}=useShop();


  const [formData,setFormData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  });

  const onChangeHandler = (e) => {
         const name = e.target.name;
         const value = e.target.value;

         setFormData(data=>({...data,[name]:value}));
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      let orderItems = [];

      for(const items in cartItems ){
        for(const size in cartItems[items]){
          if(cartItems[items][size]>0){
            const itemInfo = structuredClone(products.find(product => product._id ===items));

            if(itemInfo){
              itemInfo.size=size;
              itemInfo.quantity=cartItems[items][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address:formData,
        items:orderItems,
        amount:  GetCartAmount()+delivery_fee
      }

      switch(method){
        //if COD:
        case "cod":
            const response = await PlaceOrderCODFunc(orderData);
            if(response.message==="Order placed (COD) successfully!"){
              setCartItems({});
              toast.success("Order Placed successfully!");
              navigate("/orders");
            }
            break;
        case "razorpay": 
        break;
        case "stripe": 
        break;
        default:
        break;

      }
    }
    catch(err){
      console.log(err);
      toast.error(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 px-5 sm:pt-14 min-h-[80vh] border-t'>
      {/*---------- Left side ------------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>
          <div className='flex gap-3'>
            <input required type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full'placeholder="First Name" onChange={onChangeHandler} name="firstName" value={formData.firstName}/>
            <input required type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full' placeholder="Last Name" onChange={onChangeHandler} name="lastName" value={formData.lastName}/>
          </div>
          <input required type="email" className='border border-gray-500 rounded py-1.5 px-3.5 w-full'placeholder="Email"  onChange={onChangeHandler} name="email" value={formData.email}/>
          <input required type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full' placeholder="Street"  onChange={onChangeHandler} name="street" value={formData.street}/>
          <div className='flex gap-3'>
            <input required type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full'placeholder="City"  onChange={onChangeHandler} name="city" value={formData.city}/>
            <input required type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full' placeholder="State"  onChange={onChangeHandler} name="state" value={formData.state}/>
          </div>
          <div className='flex gap-3'>
            <input required type="number" className='border border-gray-500 rounded py-1.5 px-3.5 w-full'placeholder="Zipcode"  onChange={onChangeHandler} name="zipcode" value={formData.zipcode}/>
            <input required type="text" className='border border-gray-500 rounded py-1.5 px-3.5 w-full' placeholder="Country"  onChange={onChangeHandler} name="country" value={formData.country}/>
          </div>
          <input required  type="number" className='border border-gray-500 rounded py-1.5 px-3.5 w-full'placeholder="Phone Number"  onChange={onChangeHandler} name="phone" value={formData.phone}/>
      </div>

      {/* ----------RIGHT SIDE-------- */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className='flex gap-3 flex-col lg:flex-row'>
              <div  onClick={()=>setMethod("stripe") } className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='stripe'?"bg-blue-400":""}`}></p>
                <img src={assets.stripe_logo} alt="" className='h-5 mx-4' />
              </div>
              <div onClick={()=>setMethod("razorpay") } className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='razorpay'?"bg-blue-400":""}`}></p>
                <img src={assets.razorpay_logo} alt="" className='h-5 mx-4' />
              </div>
              <div  onClick={()=>setMethod("cod") }className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod'?"bg-blue-400":""}`}></p>
                <p className='text-gray-700 font-medium text-sm mx-4'>CASH ON DELIVERY</p>
              </div>
          </div>

          <div className='w-full text-end mt-5'>
            <button type="submit "className="px-5 py-2 text-sm bg-black text-white active:bg-gray-700 ">PLACE ORDER</button>
          </div>

        </div>
      </div>
    </form>
  )
}

export default PlaceOrder