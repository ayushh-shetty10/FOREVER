import React, { useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useShop } from '../hook/useShop'
import { toast } from 'react-toastify'

const Navbar = () => {
     const [visible,setVisible] = useState(false);
     const {GetCartCount,LogoutFunc,setUser} = useShop();
     const navigate=useNavigate();
     
const handleLogout= async() => {
    try{
        const response = await LogoutFunc();
        if(response.message==="User logged out successfully!"){
            toast("Logout Successfull!");
            setUser(null);
            navigate("/login");
        }else{
            toast.error(response.message);
        }
    }catch(err){
        console.log(err+"Failed to Logout");

    }
}


  return (
    <div className="flex items-center justify-between py-5 px-2 font-medium ">
       <Link to="/" ><img src={assets.logo} className="w-36" alt="" /></Link>

        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
            <Link to="/" className="flex flex-col items-center gap-1" >
                <p>HOME</p>
                <hr className="w-2/4 border-none bg-gray-700 h-[1.5px]  hidden "/>
            </Link>
             <Link to="/collection" className="flex flex-col items-center gap-1" >
                <p>COLLECTIONS</p>
                <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden "/>
            </Link>
             <Link to="/about" className="flex flex-col items-center gap-1" >
                <p>ABOUT</p>
                <hr className="w-2/4 border-none bg-gray-700 h-[1.5px]  hidden"/>
            </Link>
            <Link to="/contact" className="flex flex-col items-center gap-1" >
                <p>CONTACT</p>
                <hr className="w-2/4 border-none bg-gray-700 h-[1.5px]  hidden"/>
            </Link>
            <Link to="/admin" className="flex flex-col items-center gap-1" >
                <p>ADMIN</p>
                <hr className="w-2/4 border-none bg-gray-700 h-[1.5px]  hidden"/>
            </Link>
        </ul>

        <div className="flex items-center z-1 gap-6">
            <img src={assets.search_icon} alt="" className="w-5 cursor-pointer"/>
            <div className="group relative">
               <Link to={"/login"} ><img src={assets.profile_icon} alt="" className="w-5 cursor-pointer"/></Link> 
                <div className="absolute right-0 pt-4 dropdown-menu hidden group-hover:block ">
                    <div className="flex flex-col rounded gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500">
                        <p className="cursor-pointer hover:text-black">My Profile</p>
                        <p className="cursor-pointer hover:text-black">Orders</p>
                        <p onClick={handleLogout}className="cursor-pointer hover:text-black">Logout</p>
                    </div>

                </div>
            </div>
            <Link to="/cart" className="relative ">
                <img src={assets.cart_icon} alt="" className="w-5"/>
                <p className="absolute -right-1.25 -bottom-1.25 w-4 rounded-full aspect-square leading-4 text-center text-white text-[8px] bg-black">{GetCartCount()}</p>
            </Link>
            <img onClick={()=>{setVisible(true)}} src={assets.menu_icon} className='w-5 cursor-pointer  sm:hidden' alt="" />
        </div>
            {/* <div className={ `absolute ${visible?"block":"hidden" }top-0 bottom-0 right-0 blur-2xl bg-amber-400 h-full w-full z-0 sm:hidden`}></div> */}
         {visible ? (<div onClick={()=>setVisible(false)}  className=" h-screen w-screen fixed z-1 bg-blue-300 blur-2xl top-0 left-0 "></div>) : ("")}

        {/* sidebar menu for small screens */}
        <div  className={`absolute top-0 right-0 bottom-0 z-2 ${visible? "w-[80%]" : "w-0"} bg-white transition-all  `}>
            <div className="flex flex-col text-gray-600">
                <div onClick={()=>setVisible(false)} className="flex items-center gap-4 p-3">
                    <img src={assets.dropdown_icon} className="rotate-180 h-4 text-black " alt=""/>
                    <p>Back</p>
                </div>
                <Link className="py-3 px-6 border-b border-gray-400" to="/">HOME</Link>
                <Link className="py-3 px-6 border-b border-gray-400" to="/collection">COLLECTIONS</Link>
                <Link className="py-3 px-6 border-b border-gray-400" to="/about">ABOUT</Link>
                <Link className="py-3 px-6 border-b border-gray-400" to="/contact">CONTACT</Link>
                 <Link className="py-3 px-6 border-b border-gray-400" to="/admin">ADMIN</Link>
            </div>
        </div>
    </div>
  )
}

export default Navbar