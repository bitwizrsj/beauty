import React, { useEffect, useState } from 'react';
import { AdminAPI, CatalogAPI } from '../../lib/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

const CategoriesAdmin: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await CatalogAPI.listCategories();
      setCategories(res.data.categories);
    } catch (e) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive
    });
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await AdminAPI.updateCategory(editingCategory._id, formData);
      } else {
        await AdminAPI.createCategory(formData);
      }
      
      await load();
      resetForm();
    } catch (e) {
      console.error('Error saving category:', e);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await AdminAPI.deleteCategory(id);
      await load();
      setShowDeleteModal(null);
    } catch (e) {
      console.error('Error deleting category:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => onDelete(showDeleteModal)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Slug</th>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">Active</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c: any) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{c.name}</div>
                  </td>
                  <td className="p-3">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{c.slug}</code>
                  </td>
                  <td className="p-3">
                    <div className="text-gray-600 text-sm max-w-xs truncate">{c.description}</div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {c.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(c._id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export default CategoriesAdmin;
