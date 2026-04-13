import { useState } from "react";
import { trpc } from "~/lib/trpc";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const { data, isLoading, refetch } = trpc.useQuery("get", "/orders/admin/all");
  const { mutate: updateStatus } = trpc.useMutation("patch", "/orders/admin/{id}/status");

  const orders = Array.isArray(data) ? data : [];

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatus(
      { params: { path: { id: orderId.toString() } }, body: { status: newStatus as any } },
      {
        onSuccess: () => {
          toast.success("Order status updated!");
          refetch();
        },
        onError: () => toast.error("Failed to update status"),
      }
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center"><Spinner /></div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer / Address</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Items</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 align-top">
                  <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-semibold mb-1">User ID: {order.userId}</div>
                    {order.city || order.district || order.address ? (
                      <div className="text-xs text-gray-500">
                        {order.city ? `${order.city}, ` : ''} {order.district ? `${order.district}` : ''} <br/>
                        {order.address} <br/>
                        {order.zipCode ? `ZIP: ${order.zipCode}` : ''}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No address provided</span>
                    )}
                    {order.phone && <div className="text-xs text-gray-500 mt-1">📞 {order.phone}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <ul className="text-xs space-y-1">
                      {order.items?.map((item: any, idx: number) => (
                        <li key={idx} className="flex gap-1">
                          <span className="font-medium">{item.quantity}x</span>
                          <span className="text-gray-600 line-clamp-1">{item.product?.name || `Product #${item.productId}`}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                    ${parseFloat(order.totalPrice || "0").toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-sm px-3 py-1 rounded-full outline-none border font-semibold ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" />;
}
