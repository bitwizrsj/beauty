import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../../lib/api';

const UsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await AdminAPI.listUsers({ limit: 100 });
      setUsers(res.data.users);
    } catch (e) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onRole = async (id: string, role: 'user' | 'admin') => {
    await AdminAPI.updateUserRole(id, role);
    await load();
  };

  const onDelete = async (id: string) => {
    await AdminAPI.deleteUser(id);
    await load();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => onRole(u._id, u.role === 'admin' ? 'user' : 'admin')} className="px-3 py-1 bg-gray-100 rounded">Toggle Role</button>
                    <button onClick={() => onDelete(u._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded">Delete</button>
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

export default UsersAdmin;


