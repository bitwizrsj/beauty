import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Gift, Star, TrendingUp, Heart, Award, Clock } from 'lucide-react';
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
        
        const mappedFeatured = featured.data.products.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          images: (p.images || []).map((img: any) => img.url).filter(Boolean),
          brand: p.brand || 'Brand',
          rating: p.rating || 0,
          reviews: p.numReviews || 0,
          category: p.category?.name || 'All',
          description: p.description || '',
          originalPrice: p.compareAtPrice,
          inStock: (p.stock || 0) > 0,
          featured: p.isFeatured,
          trending: false
        }));
        
        const mappedTrending = allProducts.data.products
          .filter(p => !p.isFeatured)
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
            description: p.description || '',
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

  const categories = [
    { name: 'Skincare', image: '🧴', color: 'from-blue-400 to-cyan-400', link: '/shop?category=skincare' },
    { name: 'Makeup', image: '💄', color: 'from-pink-400 to-rose-400', link: '/shop?category=makeup' },
    { name: 'Haircare', image: '💇', color: 'from-purple-400 to-violet-400', link: '/shop?category=haircare' },
    { name: 'Fragrance', image: '🌸', color: 'from-amber-400 to-orange-400', link: '/shop?category=fragrance' },
    { name: 'Body Care', image: '🧼', color: 'from-green-400 to-emerald-400', link: '/shop?category=bodycare' },
    { name: 'Tools', image: '🪮', color: 'from-red-400 to-pink-400', link: '/shop?category=tools' },
  ];

  const offers = [
    { title: 'Buy 1 Get 1', subtitle: 'On Selected Items', discount: '50% OFF', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { title: 'New User Offer', subtitle: 'Extra Discount', discount: '25% OFF', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { title: 'Flash Sale', subtitle: 'Limited Time Only', discount: 'Up to 70%', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
  ];

  const brands = [
    { name: 'Lakme', logo: 'L' },
    { name: 'Maybelline', logo: 'M' },
    { name: 'LOreal', logo: 'L' },
    { name: 'MAC', logo: 'M' },
    { name: 'Nivea', logo: 'N' },
    { name: 'Dove', logo: 'D' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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

      {/* Features Bar */}
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

      {/* Offers Banner Section */}
      {/* <section className="py-12 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <Link
                key={index}
                to="/shop"
                className="group relative overflow-hidden rounded-2xl bg-white p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="relative">
                  <Gift className="w-12 h-12 text-rose-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.subtitle}</p>
                  <div className={`inline-block px-4 py-2 ${offer.color} text-white rounded-full font-bold text-lg`}>
                    {offer.discount}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Shop by Category */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden rounded-2xl aspect-square bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative h-full flex flex-col items-center justify-center p-6">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.image}</div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-lg text-gray-600">Curated selection of our best-selling items</p>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center space-x-2 text-rose-500 hover:text-rose-600 font-medium group"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
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
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Double Banner Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-12 text-white h-80">
              <div className="relative z-10">
                <Clock className="w-12 h-12 mb-4" />
                <h3 className="text-3xl font-bold mb-4">Flash Sale Ends Soon</h3>
                <p className="text-lg mb-6 text-white/90">Grab your favorites before they're gone!</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-orange-500 rounded-full hover:shadow-xl transition-all font-medium"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mb-32"></div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 p-12 text-white h-80">
              <div className="relative z-10">
                <Heart className="w-12 h-12 mb-4" />
                <h3 className="text-3xl font-bold mb-4">Best Sellers</h3>
                <p className="text-lg mb-6 text-white/90">Most loved by our community</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-purple-600 rounded-full hover:shadow-xl transition-all font-medium"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mb-32"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Brands */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Brand</h2>
            <p className="text-lg text-gray-600">Your favorite beauty brands in one place</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand, index) => (
              <Link
                key={index}
                to={`/shop?brand=${brand.name.toLowerCase()}`}
                className="group bg-gray-50 rounded-2xl p-8 hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md group-hover:shadow-xl transition-shadow">
                    <span className="text-2xl font-bold text-gray-900">{brand.logo}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-rose-500 mr-2" />
            <h2 className="text-4xl font-bold text-gray-900">Trending Now</h2>
          </div>
          <p className="text-lg text-gray-600 text-center mb-12">What everyone's loving this season</p>

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

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600">Experience the difference with our premium service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentic Products</h3>
              <p className="text-gray-600">100% genuine products from authorized distributors</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-violet-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Advice</h3>
              <p className="text-gray-600">Beauty experts ready to help you find your perfect match</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Rewards Program</h3>
              <p className="text-gray-600">Earn points on every purchase and get exclusive perks</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Returns</h3>
              <p className="text-gray-600">15-day return policy for your peace of mind</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
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
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-rose-50">Cruelty Free</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="text-4xl font-bold mb-2">85%</div>
                <div className="text-rose-50">Natural Ingredients</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="text-4xl font-bold mb-2">0%</div>
                <div className="text-rose-50">Harmful Chemicals</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-rose-50">Recyclable Packaging</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-16 h-16 text-rose-500 mx-auto mb-6" />
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