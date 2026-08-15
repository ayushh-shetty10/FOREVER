import React from 'react'
import { useShop } from '../hook/useShop'
import { Navigate } from 'react-router-dom';

const Protected = ({children}) => {
    const {user, checkingAuth} = useShop();
   
    if(checkingAuth){
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if(user){
        return children;
    }
    else{
        return <Navigate to="/login" replace></Navigate>
    }

}

export default Protected