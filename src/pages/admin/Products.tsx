import React, { useEffect, useState } from 'react';
import { AdminAPI, CatalogAPI, uploadImage } from '../../lib/api';
import { Plus, Edit, Trash2, Eye, Upload, X } from 'lucide-react';

const ProductsAdmin: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    brand: '',
    category: '',
    isFeatured: false,
    isActive: true,
    tags: '',
    specifications: ''
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [prodsRes, catsRes] = await Promise.all([
        CatalogAPI.listProducts({ limit: 100 }),
        CatalogAPI.listCategories()
      ]);
      setProducts(prodsRes.data.products);
      setCategories(catsRes.data.categories);
    } catch (e) {
      setProducts([]);
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
      price: '',
      compareAtPrice: '',
      stock: '',
      brand: '',
      category: '',
      isFeatured: false,
      isActive: true,
      tags: '',
      specifications: ''
    });
    setImages([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || '',
      stock: product.stock.toString(),
      brand: product.brand || '',
      category: product.category?._id || '',
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      tags: product.tags?.join(', ') || '',
      specifications: JSON.stringify(product.specifications || {})
    });
    setImages(product.images?.map((img: any) => img.url) || []);
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate files before upload
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not an image. Please select only image files.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadingImages(true);
    try {
      // Upload files one by one to avoid overwhelming the server
      const urls: string[] = [];
      for (const file of validFiles) {
        try {
          const url = await uploadImage(file);
          urls.push(url);
        } catch (error: any) {
          console.error(`Error uploading ${file.name}:`, error);
          alert(`Failed to upload ${file.name}: ${error.message}`);
        }
      }
      
      if (urls.length > 0) {
        setImages(prev => [...prev, ...urls]);
      }
    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert(`Image upload failed: ${error.message}`);
    } finally {
      setUploadingImages(false);
      // Reset the input
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        stock: parseInt(formData.stock),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        specifications: formData.specifications ? JSON.parse(formData.specifications) : {},
        images: images.map(url => ({ url }))
      };

      if (editingProduct) {
        await AdminAPI.updateProduct(editingProduct._id, payload);
      } else {
        await AdminAPI.createProduct(payload);
      }
      
      await load();
      resetForm();
    } catch (e) {
      console.error('Error saving product:', e);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await AdminAPI.deleteProduct(id);
      await load();
      setShowDeleteModal(null);
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Compare At Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({...formData, compareAtPrice: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="skincare, serum, vitamin-c"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Specifications (JSON)</label>
                <textarea
                  value={formData.specifications}
                  onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                  placeholder='{"Size": "30ml", "Type": "Serum"}'
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center space-x-2 cursor-pointer text-gray-600 hover:text-gray-800"
                  >
                    <Upload className="w-5 h-5" />
                    <span>{uploadingImages ? 'Uploading...' : 'Upload Images'}</span>
                  </label>
                </div>
                
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    className="mr-2"
                  />
                  Featured Product
                </label>
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
                  {editingProduct ? 'Update' : 'Create'} Product
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
              Are you sure you want to delete this product? This action cannot be undone.
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
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Featured</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0].url} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-gray-500 text-xs">{p.brand}</div>
                    </div>
                  </td>
                  <td className="p-3">${Number(p.price).toFixed(2)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{p.category?.name || ''}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${p.isFeatured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {p.isFeatured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(p._id)}
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

export default ProductsAdmin;


