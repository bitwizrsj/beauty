import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CatalogAPI } from '../lib/api';

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [brands, setBrands] = useState<string[]>(['All']);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }

    let filtered = [...catalogProducts];
    console.log('Starting filter with', filtered.length, 'products');

    if (searchParam) {
      const searchLower = searchParam.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          (p.description || '').toLowerCase().includes(searchLower) ||
          (p.brand || '').toLowerCase().includes(searchLower) ||
          (p.category || '').toLowerCase().includes(searchLower)
      );
      console.log('After search filter:', filtered.length);
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => {
        const productCategory = p.category || '';
        return productCategory.toLowerCase() === selectedCategory.toLowerCase() ||
               productCategory.toLowerCase().includes(selectedCategory.toLowerCase());
      });
      console.log('After category filter:', filtered.length, 'selectedCategory:', selectedCategory);
    }

    if (selectedBrand !== 'All') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
      console.log('After brand filter:', filtered.length, 'selectedBrand:', selectedBrand);
    }

    filtered = filtered.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    console.log('After price filter:', filtered.length, 'priceRange:', priceRange);

    filtered = filtered.filter(p => p.rating >= minRating);
    console.log('After rating filter:', filtered.length, 'minRating:', minRating);

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    console.log('Final filtered products:', filtered.length);
    setFilteredProducts(filtered);
  }, [searchParams, selectedCategory, selectedBrand, priceRange, minRating, sortBy, catalogProducts]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          CatalogAPI.listProducts({ limit: 100 }),
          CatalogAPI.listCategories()
        ]);
        const items = prods.data.products;
        const mappedProducts = items.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          images: (p.images || []).map((img: any) => img.url).filter(Boolean),
          brand: p.brand || 'Brand',
          rating: p.rating || 0,
          reviews: p.numReviews || 0,
          category: p.category?.name || 'Uncategorized',
          description: p.description || '',
          originalPrice: p.compareAtPrice,
          inStock: (p.stock || 0) > 0
        }));

        console.log('Loaded products:', mappedProducts);
        setCatalogProducts(mappedProducts);

        const uniqueCategories = ['All', ...new Set(mappedProducts.map(p => p.category).filter(Boolean))];
        console.log('Categories:', uniqueCategories);
        setCategories(uniqueCategories);

        const brandNames = ['All', ...new Set(items.map((p: any) => p.brand).filter(Boolean))];
        console.log('Brands:', brandNames);
        setBrands(brandNames);

        const maxPrice = Math.max(...mappedProducts.map(p => p.price), 100);
        setPriceRange([0, maxPrice]);
      } catch (e) {
        console.error('Error loading products:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setPriceRange([0, 10000]);
    setMinRating(0);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop All Products</h1>
            <p className="text-gray-600">
              {loading ? 'Loading...' : `Showing ${filteredProducts.length} of ${catalogProducts.length} products`}
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="text-rose-500 focus:ring-rose-400"
                        />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map(brand => (
                      <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="brand"
                          checked={selectedBrand === brand}
                          onChange={() => setSelectedBrand(brand)}
                          className="text-rose-500 focus:ring-rose-400"
                        />
                        <span className="text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-rose-500"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1, 0].map(rating => (
                      <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="text-rose-500 focus:ring-rose-400"
                        />
                        <span className="text-gray-700">
                          {rating > 0 ? `${rating}+ Stars` : 'All Ratings'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {filteredProducts.length} Products
              </div>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <X className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to find what you're looking for
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
