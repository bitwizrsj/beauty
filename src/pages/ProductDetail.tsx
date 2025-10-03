import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, RotateCcw, ChevronLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CatalogAPI } from '../lib/api';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        const res = await CatalogAPI.getProduct(id);
        const p = res.data.product;
        setProduct({
          id: p._id,
          name: p.name,
          description: p.description,
          price: p.price,
          originalPrice: p.compareAtPrice,
          brand: p.brand || 'Brand',
          images: (p.images || []).map((img: any) => img.url).filter(Boolean),
          rating: p.rating || 0,
          reviews: p.numReviews || 0,
          category: p.category?.name || 'All',
          inStock: (p.stock || 0) > 0
        });
      } catch (e) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all font-medium"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        category: product.category,
      });
    }
  };

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      date: '2025-01-15',
      comment: 'Absolutely love this product! The quality is amazing and I can see visible results.',
    },
    {
      id: 2,
      name: 'Emily Chen',
      rating: 4,
      date: '2025-01-10',
      comment: 'Great product, but a bit pricey. However, the results are worth it.',
    },
    {
      id: 3,
      name: 'Jessica Williams',
      rating: 5,
      date: '2025-01-05',
      comment: 'This is now a staple in my beauty routine. Highly recommend!',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-rose-500 transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              <div className="aspect-square rounded-xl overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-rose-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <p className="text-sm text-rose-500 font-medium mb-2">{product.brand}</p>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-baseline space-x-3 mb-6">
                  <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-medium">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <div className="flex items-center space-x-4 mb-6">
                  <label className="text-gray-700 font-medium">Quantity:</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border border-gray-300 hover:border-rose-500 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border border-gray-300 hover:border-rose-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-medium flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>

                  <button className="px-6 py-4 border border-gray-300 rounded-full hover:border-rose-500 hover:text-rose-500 transition-all">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Truck className="w-5 h-5" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <RotateCcw className="w-5 h-5" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <ShieldCheck className="w-5 h-5" />
                  <span>100% authentic products</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="p-8">
              <div className="flex space-x-8 border-b border-gray-200 mb-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`pb-4 font-medium transition-colors ${
                    activeTab === 'description'
                      ? 'text-rose-500 border-b-2 border-rose-500'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-4 font-medium transition-colors ${
                    activeTab === 'ingredients'
                      ? 'text-rose-500 border-b-2 border-rose-500'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Ingredients
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-4 font-medium transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-rose-500 border-b-2 border-rose-500'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Reviews ({product.reviews})
                </button>
              </div>

              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Key Benefits</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>Clinically tested and dermatologist approved</li>
                    <li>Suitable for all skin types</li>
                    <li>Cruelty-free and vegan formula</li>
                    <li>Made with natural and organic ingredients</li>
                  </ul>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">
                    All our products are formulated with clean, effective ingredients:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Aqua, Glycerin, Niacinamide, Hyaluronic Acid, Vitamin C, Retinol,
                      Natural Botanical Extracts, Essential Oils, and other premium ingredients
                      carefully selected for maximum effectiveness.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{review.name}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
