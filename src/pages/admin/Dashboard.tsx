import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../../lib/api';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, Tag, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await AdminAPI.stats();
        setStats(res.data);
      } catch (e) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/admin/products"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-gray-600 text-sm">Manage Products</div>
              <div className="font-semibold">Products CRUD</div>
            </div>
          </div>
        </Link>
        
        <Link
          to="/admin/categories"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <Tag className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-gray-600 text-sm">Manage Categories</div>
              <div className="font-semibold">Categories CRUD</div>
            </div>
          </div>
        </Link>
        
        <Link
          to="/admin/users"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-gray-600 text-sm">Manage Users</div>
              <div className="font-semibold">Users CRUD</div>
            </div>
          </div>
        </Link>
        
        <Link
          to="/admin/orders"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-8 h-8 text-orange-600" />
            <div>
              <div className="text-gray-600 text-sm">Manage Orders</div>
              <div className="font-semibold">Orders CRUD</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Statistics */}
      <h2 className="text-2xl font-bold mb-4">Statistics</h2>
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="w-6 h-6 text-blue-600" />
              <div className="text-gray-600 text-sm">Total Users</div>
            </div>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Package className="w-6 h-6 text-green-600" />
              <div className="text-gray-600 text-sm">Total Products</div>
            </div>
            <div className="text-3xl font-bold">{stats.totalProducts}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-2">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
              <div className="text-gray-600 text-sm">Total Orders</div>
            </div>
            <div className="text-3xl font-bold">{stats.totalOrders}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="w-6 h-6 text-orange-600" />
              <div className="text-gray-600 text-sm">Total Revenue</div>
            </div>
            <div className="text-3xl font-bold">${Number(stats.totalRevenue).toFixed(2)}</div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">Failed to load stats.</div>
      )}
    </div>
  );
};

export default Dashboard;


