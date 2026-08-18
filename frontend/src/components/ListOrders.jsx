import React, { useEffect, useState } from 'react';
import { useShop } from '../hook/useShop';
import { toast } from 'react-toastify';
import { 
  FiBox, 
  FiUser, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiCreditCard, 
  FiClock, 
  FiTrendingUp, 
  FiCheckCircle, 
  FiAlertCircle,
  FiShoppingBag,
  FiRefreshCw
} from 'react-icons/fi';

const ListOrders = () => {
  const { GetAllOrdersFunc, UpdateOrderStatusFunc, currency } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoadingLocal] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  // Stats calculation
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Failed').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment ? o.amount : 0), 0);

  const fetchAllOrders = async () => {
    setLoadingLocal(true);
    try {
      const res = await GetAllOrdersFunc();
      if (res && res.allOrders) {
        // Sort orders by date descending
        const sorted = res.allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sorted);
      } else {
        toast.error('Failed to load orders.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching orders.');
    } finally {
      setLoadingLocal(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await UpdateOrderStatusFunc({ orderId, status: newStatus });
      if (res && res.message === 'Status updated successfully') {
        toast.success(`Status updated to "${newStatus}"!`);
        // Update state locally
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(res?.message || 'Failed to update status.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Packing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Out for Delivery':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="flex flex-col gap-5 mt-5 px-3 sm:px-5 w-full max-w-full h-full overflow-y-auto overflow-x-hidden pb-16 bg-gray-50/10">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 prata-regular">Manage Orders</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Track and update store delivery statuses.</p>
        </div>
        <button 
          onClick={fetchAllOrders}
          disabled={loading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors bg-white shadow-xs cursor-pointer disabled:opacity-50"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] sm:text-xs text-gray-400 font-semibold tracking-wider uppercase">Total Orders</span>
            <span className="text-base sm:text-xl font-extrabold text-gray-800">{totalOrders}</span>
          </div>
          <div className="p-1.5 sm:p-2.5 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
            <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] sm:text-xs text-gray-400 font-semibold tracking-wider uppercase">In Progress</span>
            <span className="text-base sm:text-xl font-extrabold text-gray-800">{pendingOrders}</span>
          </div>
          <div className="p-1.5 sm:p-2.5 bg-amber-50 text-amber-600 rounded-lg flex-shrink-0">
            <FiClock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] sm:text-xs text-gray-400 font-semibold tracking-wider uppercase">Completed</span>
            <span className="text-base sm:text-xl font-extrabold text-gray-800">{completedOrders}</span>
          </div>
          <div className="p-1.5 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-lg flex-shrink-0">
            <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] sm:text-xs text-gray-400 font-semibold tracking-wider uppercase">Paid Revenue</span>
            <span className="text-base sm:text-xl font-extrabold text-gray-800">{currency}{totalRevenue.toLocaleString()}</span>
          </div>
          <div className="p-1.5 sm:p-2.5 bg-indigo-50 text-indigo-600 rounded-lg flex-shrink-0">
            <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-row overflow-x-auto gap-1 border-b border-gray-200 pb-0.5 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-none">
        {['All', 'Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered', 'Failed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-2.5 py-1.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              filterStatus === status 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-black"></div>
          <p className="text-gray-500 text-xs">Loading orders list...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <FiAlertCircle className="w-9 h-9 text-gray-300 mb-2" />
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700">No orders found</h3>
          <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5">There are no orders with status "{filterStatus}".</p>
        </div>
      ) : (
        /* Orders list */
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-3.5 sm:p-5 shadow-xs transition-all duration-300 flex flex-col lg:grid lg:grid-cols-12 gap-3.5 lg:gap-5 items-stretch"
            >
              {/* Order Info Card Header (Only visible / structured nicely across all screen sizes) */}
              <div className="col-span-12 flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100 text-[11px] sm:text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-800 font-bold">#{order._id.substring(order._id.length - 8)}</span>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1">
                    <FiClock />
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                    order.payment 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {order.payment ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-gray-100 text-gray-700 border border-gray-200">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Product Info Left Column (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-gray-50/80 rounded-xl p-3 border border-gray-200/50 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200/30 pb-1.5 mb-0.5">
                  <FiBox className="w-3.5 h-3.5 text-gray-500" />
                  <span>Order Items</span>
                </div>
                
                <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <img 
                        src={item.images?.[0] || item.image?.[0]} 
                        alt={item.name} 
                        className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-lg border border-gray-200 bg-white flex-shrink-0" 
                      />
                      <div className="text-xs flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate" title={item.name}>{item.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                          Size: <span className="font-medium text-gray-700">{item.size}</span> &bull; 
                          Qty: <span className="font-medium text-gray-700">{item.quantity}</span> &bull; 
                          Price: <span className="font-medium text-gray-700">{currency}{item.price}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Details Middle Column (lg:col-span-3) */}
              <div className="lg:col-span-3 sm:bg-gray-50/40 lg:bg-gray-50/80 rounded-xl p-0 sm:p-3 border-0 sm:border border-gray-200/50 flex flex-col gap-2 justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200/30 pb-1.5 mb-0.5">
                    <FiUser className="w-3.5 h-3.5 text-gray-500" />
                    <span>Customer Info</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600">
                    <FiMail className="flex-shrink-0" />
                    <span className="truncate" title={order.address.email}>{order.address.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600">
                    <FiPhone className="flex-shrink-0" />
                    <span>{order.address.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-[11px] sm:text-xs text-gray-600 border-t border-gray-200/30 pt-2 mt-2">
                  <FiMapPin className="flex-shrink-0 mt-0.5 text-gray-500" />
                  <span className="line-clamp-2" title={`${order.address.street}, ${order.address.city}`}>
                    {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}, {order.address.country}
                  </span>
                </div>
              </div>

              {/* Payment Details Column (lg:col-span-2) */}
              <div className="lg:col-span-2 sm:bg-gray-50/40 lg:bg-gray-50/80 rounded-xl p-0 sm:p-3 border-0 sm:border border-gray-200/50 flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200/30 pb-1.5 mb-0.5">
                    <FiCreditCard className="w-3.5 h-3.5 text-gray-500" />
                    <span>Payment Status</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      order.paymentMethod === 'COD' 
                        ? 'bg-zinc-200/70 text-zinc-800' 
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {order.paymentMethod}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      order.payment 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {order.payment ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200/30 pt-2">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Grand Total</span>
                  <p className="text-base sm:text-lg font-black text-gray-900 mt-0.5">{currency}{order.amount}</p>
                </div>
              </div>

              {/* Status Update Column (lg:col-span-2) */}
              <div className="lg:col-span-2 sm:bg-gray-50/40 lg:bg-gray-50/80 rounded-xl p-0 sm:p-3 border-0 sm:border border-gray-200/50 flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200/30 pb-1.5 mb-0.5">Order Status</span>
                  
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-center border mt-0.5 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1 border-t border-gray-200/30 pt-2">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Update Status</span>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs bg-white hover:border-gray-400 active:border-black focus:outline-none focus:ring-1 focus:ring-black cursor-pointer font-semibold mt-0.5 shadow-xs"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListOrders;

