import { Outlet, createBrowserRouter } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Collection from "./pages/Collection.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"
import Cart from "./pages/Cart.jsx"
import Login from "./pages/Login.jsx"
import Product from "./pages/Product.jsx"
import PlaceOrder from "./pages/PlaceOrder.jsx"
import Orders from "./pages/Orders.jsx"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import Admin from "./pages/Admin.jsx"
import Protected from "./components/Protected.jsx"
import Verify from "./pages/Verify.jsx"

const RootLayout = () => (
    <>
        <Navbar />
        <Outlet />
        <Footer />
    </>
)


export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "collection",
                element: <Collection />
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "contact",
                element: <Contact />
            },
            {
                path: "cart",
                element:<Protected> <Cart /></Protected>
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "product/:productId",
                element: <Protected><Product /></Protected>
            },
            {
                path: "place-order",
                element:<Protected><PlaceOrder /></Protected> 
            },
            {
                path: "orders",
                element:<Protected><Orders /></Protected> 
            },{
                path:"admin",
                element:<Protected><Admin /></Protected> 
            },
            {
                path:"verify",
                element:<Protected><Verify /></Protected> 
            }
        ]
    }
]);

 