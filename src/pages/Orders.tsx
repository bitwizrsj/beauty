import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { OrdersAPI } from '../lib/api';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        const res = await OrdersAPI.myOrders();
        // map to UI structure
        const mapped = res.data.orders.map((o: any) => ({
          id: o._id,
          date: o.createdAt,
          status: o.orderStatus,
          total: o.totalPrice,
          products: o.orderItems.map((i: any) => ({ name: i.name, image: i.image, quantity: i.quantity, price: i.price }))
        }));
        setOrders(mapped);
      } catch (e) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">View and track your order history</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loading your orders...</h2>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-medium"
            >
              <span>Start Shopping</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-8">
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="font-semibold text-gray-900">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                        <Package className="w-4 h-4 mr-2" />
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {order.products.map((product: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${(product.price * product.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium">
                      View Details
                    </button>

                    <button className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all font-medium">
                      Buy Again
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
