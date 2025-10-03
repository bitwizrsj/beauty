import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CatalogAPI } from '../lib/api';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const [featured, allProducts] = await Promise.all([
          CatalogAPI.featured(),
          CatalogAPI.listProducts({ limit: 20 })
        ]);
        
        // Map featured products
        const mappedFeatured = featured.data.products.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          images: (p.images || []).map((img: any) => img.url).filter(Boolean),
          brand: p.brand || 'Brand',
          rating: p.rating || 0,
          reviews: p.numReviews || 0,
          category: p.category?.name || 'All',
          originalPrice: p.compareAtPrice,
          inStock: (p.stock || 0) > 0,
          featured: p.isFeatured,
          trending: false
        }));
        
        // Map trending products (use top rated products as trending)
        const mappedTrending = allProducts.data.products
          .filter(p => !p.isFeatured) // Don't include featured products
          .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4)
          .map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            images: (p.images || []).map((img: any) => img.url).filter(Boolean),
            brand: p.brand || 'Brand',
            rating: p.rating || 0,
            reviews: p.numReviews || 0,
            category: p.category?.name || 'All',
            originalPrice: p.compareAtPrice,
            inStock: (p.stock || 0) > 0,
            featured: false,
            trending: true
          }));
        
        setFeaturedProducts(mappedFeatured);
        setTrendingProducts(mappedTrending);
      } catch (e) {
        setFeaturedProducts([]);
        setTrendingProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">New Collection 2025</span>
            </div>

            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                Natural Beauty
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Premium beauty products crafted with natural ingredients to enhance your radiance and confidence.
            </p>

            <div className="flex space-x-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-medium flex items-center space-x-2 group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/about"
                className="px-8 py-4 bg-white text-gray-900 rounded-full hover:shadow-lg transition-all font-medium border border-gray-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
                <p className="text-gray-600">On orders over $50</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
                <p className="text-gray-600">100% secure transactions</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600">Only the finest ingredients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Curated selection of our best-selling items</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="text-center">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
            >
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-rose-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Commitment to Sustainability</h2>
              <p className="text-lg text-rose-50 mb-6">
                We believe in beauty that doesn't harm the planet. Our products are cruelty-free,
                ethically sourced, and packaged with eco-friendly materials.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-rose-500 rounded-full hover:shadow-xl transition-all font-medium"
              >
                <span>Learn About Our Values</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-rose-50">Cruelty Free</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">85%</div>
                <div className="text-rose-50">Natural Ingredients</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">0%</div>
                <div className="text-rose-50">Harmful Chemicals</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-rose-50">Recyclable Packaging</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Now</h2>
            <p className="text-lg text-gray-600">What everyone's loving this season</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))
            ) : (
              trendingProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Join Our Beauty Community</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get exclusive offers, beauty tips, and early access to new products
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-medium whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
