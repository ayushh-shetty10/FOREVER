import React from 'react'
import { useShop } from '../hook/useShop'
import { Navigate } from 'react-router-dom';

const Protected = ({children}) => {
    const {user} = useShop();
   

    if(user){
        return children;
    }
    else{
        
        return <Navigate to="/login"></Navigate>
    }
 
    return(
        <></>
    );

}

export default Protected