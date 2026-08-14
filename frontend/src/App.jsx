import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from "./app.router.jsx"
import { ToastContainer } from 'react-toastify';
import { useShop } from './hook/useShop.js';

const App = () => {
  const {addItemstoDB} = useShop();



  return (
    <div>
    <ToastContainer />
    <RouterProvider router={router} />
    
    </div>
  )
}

export default App
