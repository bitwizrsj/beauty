import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    brand?: string;
    rating?: number;
    reviews?: number;
    originalPrice?: number;
    inStock?: boolean;
    category?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {product.originalPrice && (
            <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Sale
            </div>
          )}

          {product.trending && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium">
              Trending
            </div>
          )}

          <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-6 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white flex items-center space-x-2 font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-500 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center mb-2">
            {typeof product.rating === 'number' && (
              <>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  ({product.reviews || 0})
                </span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {!product.inStock && (
              <span className="text-sm text-red-500 font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
