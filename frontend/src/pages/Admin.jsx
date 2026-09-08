import React, { useState } from 'react'
import { useShop } from '../hook/useShop'
import { Navigate } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminDashboard from '../components/admin/AdminDashboard'
import AddItem from '../components/AddItem'
import ListItems from '../components/ListItems'
import ListOrders from '../components/ListOrders'

const Admin = () => {
  const { user } = useShop()
  const [tab, setTab] = useState("dashboard")

  if (user && user.role === "ADMIN") {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col selection:bg-[#6F1D2B]/10 selection:text-[#6F1D2B]">
        {/* Horizontal Top Header */}
        <AdminHeader />

        {/* Workspace Layout */}
        <div className="flex-1 flex flex-col md:flex-row relative">
          {/* Vertical Navigation Side Rails */}
          <AdminSidebar activeTab={tab} onTabChange={setTab} />

          {/* Main Context Stage */}
          <main className="flex-1 bg-white min-h-[calc(100vh-70px)] w-full overflow-x-hidden">
            {tab === 'dashboard' && <AdminDashboard onTabChange={setTab} />}
            {tab === 'add' && <AddItem />}
            {tab === 'items' && <ListItems />}
            {tab === 'orders' && <ListOrders />}
          </main>
        </div>
      </div>
    )
  }

  // Redirect client back if role is unauthorized or unauthenticated
  return <Navigate to="/" replace />
}

export default Admin