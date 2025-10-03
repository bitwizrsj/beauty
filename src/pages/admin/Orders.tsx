import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../../lib/api';

const OrdersAdmin: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await AdminAPI.listOrders({ limit: 100 });
      setOrders(res.data.orders);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onStatus = async (id: string, status: string) => {
    await AdminAPI.updateOrderStatus(id, { orderStatus: status });
    await load();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Order</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o._id} className="border-t">
                  <td className="p-3">{o._id}</td>
                  <td className="p-3">{o.user?.name} ({o.user?.email})</td>
                  <td className="p-3">${Number(o.totalPrice).toFixed(2)}</td>
                  <td className="p-3">{o.orderStatus}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => onStatus(o._id, 'processing')} className="px-3 py-1 bg-gray-100 rounded">Processing</button>
                    <button onClick={() => onStatus(o._id, 'shipped')} className="px-3 py-1 bg-blue-100 text-blue-700 rounded">Shipped</button>
                    <button onClick={() => onStatus(o._id, 'delivered')} className="px-3 py-1 bg-green-100 text-green-700 rounded">Delivered</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;


