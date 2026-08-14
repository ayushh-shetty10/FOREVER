import React, { useState } from 'react'
import { useShop } from '../hook/useShop';
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify";

const Login = () => {
  const [currState,setCurrState]=useState("Sign Up");
  const [email,setEmail]=useState("");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const {LoginFunc,RegisterFunc,setUser,user}=useShop();
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      if(currState==="Sign Up"){
       const response = await RegisterFunc({username,email,password});
         if(response.message==="User registered successfully!"){
                toast.success("User Registered Successfully!");
                setUser(response.user);
                navigate("/");
            }else{
                toast.error(response.message);
            }
      }else if(currState==="Login"){
       const response= await LoginFunc({email,password});
        if(response.message==="User logged in successfully!"){
                toast.success("Login Successful!");
                setUser(response.user);
                navigate("/");
            }else{
                toast.error(response.message);
            }

      }
    }
    catch(err){
      console.log(err+"Failed to Login/Singup");
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      {currState === "Sign Up"?<input value={username} onChange={(e)=>setUsername(e.target.value)}type="text" className='w-full px-2 py-2 border border-gray-800 ' placeholder="Name"  required/>:""}
      <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className='w-full px-2 py-2 border border-gray-800 ' placeholder="Email" required/>
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}className='w-full px-2 py-2 border border-gray-800 ' placeholder="Password" required/>
      <div className='flex justify-between w-full text-sm mt-[-8px]'>
        {
          currState==="Login"? <><p className='cursor-pointer'>Forgot Password?</p>
          <p className='cursor-pointer' onClick={()=>setCurrState("Sign Up")}>Create New Account</p></>:<p className='cursor-pointer inline-block w-full text-end' onClick={()=>setCurrState("Login")}>Login to existing Account</p>
        }
      </div>
      <button type="submit" className="px-12 py-2 text-sm bg-black text-white active:bg-gray-700 ">{currState==="Login"?"SIGN IN":"SIGN UP"}</button>

    </form>
  )
}

export default Login