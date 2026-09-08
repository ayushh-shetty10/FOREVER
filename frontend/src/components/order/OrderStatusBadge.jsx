import React from 'react'

const OrderStatusBadge = ({ status }) => {
  let styles = "bg-gray-50 text-gray-700 border-gray-200"

  switch (status) {
    case 'Order Placed':
      styles = "bg-slate-50 text-slate-700 border-slate-200/60"
      break
    case 'Processing':
    case 'Packing':
      styles = "bg-blue-50/40 text-blue-700 border-blue-200/30"
      break
    case 'Shipped':
      styles = "bg-amber-50/60 text-amber-700 border-amber-200/40"
      break
    case 'Out for Delivery':
      styles = "bg-purple-50/40 text-purple-700 border-purple-200/30"
      break
    case 'Delivered':
      styles = "bg-emerald-50/60 text-emerald-700 border-emerald-200/40"
      break
    case 'Cancelled':
    case 'Failed':
      styles = "bg-red-50/60 text-red-700 border-red-200/40"
      break
    default:
      break
  }

  const dotColors = {
    'Order Placed': 'bg-slate-400',
    'Processing': 'bg-blue-500',
    'Packing': 'bg-blue-400',
    'Shipped': 'bg-amber-500',
    'Out for Delivery': 'bg-purple-500',
    'Delivered': 'bg-emerald-500',
    'Cancelled': 'bg-red-500',
    'Failed': 'bg-red-500',
  }

  const dotColor = dotColors[status] || 'bg-slate-400'

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold border ${styles} select-none`}>
      <span className={`size-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  )
}

export default OrderStatusBadge
