import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, MapPin, Users } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const megaMenuData = {
    'Gifts & Value Sets': {
      columns: [
        {
          title: 'All Gifts',
          links: ['Gift Card', 'Value & Gift Sets']
        },
        {
          title: 'By Category',
          links: ['Makeup', 'Skincare', 'Hair', 'Fragrance', 'Candles & Home Scents', 'Tools', 'Brush Sets & Accessories', 'Bath & Body']
        },
        {
          title: 'By Recipient',
          links: ['For Her', 'For Mom', 'For Him', 'For Them']
        },
        {
          title: 'Top Rated Gifts',
          links: ['Mini Size', 'Only at BeautyBloom', 'Luxury Gifts', 'The Luxury Guide']
        },
        {
          title: 'By Price',
          links: ['$10 and under', '$15 and under', '$25 and under', '$50 and under', '$75 and under', '$100 and under']
        }
      ]
    },
    'New': {
      columns: [
        {
          title: 'New Arrivals',
          links: ['All New Products', 'Just Dropped', 'Coming Soon']
        },
        {
          title: 'By Category',
          links: ['Makeup', 'Skincare', 'Hair Care', 'Fragrance', 'Tools & Brushes']
        }
      ]
    },
    'Makeup': {
      columns: [
        {
          title: 'Face',
          links: ['Foundation', 'BB & CC Cream', 'Concealer', 'Face Primer', 'Powder', 'Blush', 'Bronzer', 'Highlighter']
        },
        {
          title: 'Eyes',
          links: ['Eyeshadow', 'Eyeliner', 'Mascara', 'Eyebrow', 'Eye Primer']
        },
        {
          title: 'Lips',
          links: ['Lipstick', 'Lip Gloss', 'Lip Liner', 'Lip Balm', 'Lip Stain']
        },
        {
          title: 'Tools & Brushes',
          links: ['Face Brushes', 'Eye Brushes', 'Makeup Sponges', 'Brush Sets']
        }
      ]
    },
    'Skincare': {
      columns: [
        {
          title: 'By Type',
          links: ['Moisturizers', 'Cleansers', 'Serums', 'Treatments', 'Eye Care', 'Masks', 'Exfoliators', 'Toners']
        },
        {
          title: 'By Concern',
          links: ['Acne & Blemishes', 'Anti-Aging', 'Dark Spots', 'Pores', 'Dryness', 'Dullness', 'Fine Lines']
        },
        {
          title: 'Collections',
          links: ['Clean Beauty', 'K-Beauty', 'Natural & Organic', 'Mini Size']
        }
      ]
    },
    'Fragrance': {
      columns: [
        {
          title: 'Women',
          links: ['Perfume', 'Rollerball', 'Travel Size', 'Gift Sets']
        },
        {
          title: 'Men',
          links: ['Cologne', 'Travel Size', 'Gift Sets']
        },
        {
          title: 'Home',
          links: ['Candles', 'Diffusers', 'Room Sprays']
        }
      ]
    },
    'Hair': {
      columns: [
        {
          title: 'Hair Care',
          links: ['Shampoo', 'Conditioner', 'Hair Masks', 'Leave-In Treatment', 'Hair Oil', 'Dry Shampoo']
        },
        {
          title: 'Hair Styling',
          links: ['Hair Spray', 'Hair Gel', 'Hair Mousse', 'Heat Protection', 'Hair Serum']
        },
        {
          title: 'Tools',
          links: ['Hair Dryers', 'Flat Irons', 'Curling Irons', 'Hair Brushes']
        }
      ]
    },
    'Tools & Brushes': {
      columns: [
        {
          title: 'Makeup Tools',
          links: ['Face Brushes', 'Eye Brushes', 'Lip Brushes', 'Brush Sets', 'Makeup Sponges', 'Eyelash Curlers']
        },
        {
          title: 'Skincare Tools',
          links: ['Facial Rollers', 'Gua Sha', 'Cleansing Brushes', 'LED Devices']
        },
        {
          title: 'Hair Tools',
          links: ['Hair Dryers', 'Straighteners', 'Curling Tools']
        }
      ]
    },
    'Bath & Body': {
      columns: [
        {
          title: 'Body Care',
          links: ['Body Wash', 'Body Lotion', 'Body Oil', 'Body Scrub', 'Hand Cream', 'Deodorant']
        },
        {
          title: 'Sun Care',
          links: ['Sunscreen Face', 'Sunscreen Body', 'Self Tanner', 'After Sun']
        }
      ]
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 text-black text-center py-3 px-4 text-sm">
        <span className="font-medium">Pick up to 6 FREE* Trial Sizes</span> with $105 Spend. Online only. *Terms apply. Use code <span className="font-bold">BEAUTYSMGM</span> ▸
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b sticky top-0 z-50">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold tracking-widest">BEAUTYBLOOM</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </form>

            {/* Right Icons */}
            <div className="hidden lg:flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-sm hover:text-gray-600">
                <MapPin className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-gray-600">Stores & Services</div>
                  <div className="text-xs font-medium">Choose Your Store</div>
                </div>
              </button>

              <button className="flex items-center space-x-2 text-sm hover:text-gray-600">
                <Users className="w-5 h-5" />
                <span>Community</span>
              </button>

              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-sm hover:text-gray-600">
                    <User className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-xs font-medium">Hi, {user.email?.split('@')[0]}</div>
                      <div className="text-xs text-gray-600">My Account</div>
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">
                      My Orders
                    </Link>
                    {user && (user as any).role === 'admin' && (
                      <>
                        <div className="border-t my-1" />
                        <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-gray-50">Admin Dashboard</Link>
                        <Link to="/admin/products" className="block px-4 py-2 text-sm hover:bg-gray-50">Manage Products</Link>
                        <Link to="/admin/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">Manage Orders</Link>
                        <Link to="/admin/users" className="block px-4 py-2 text-sm hover:bg-gray-50">Manage Users</Link>
                      </>
                    )}
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center space-x-2 text-sm hover:text-gray-600">
                  <User className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-xs font-medium">Sign In</div>
                    <div className="text-xs text-gray-600">for FREE Shipping 🚚</div>
                  </div>
                </Link>
              )}

              <button className="hover:text-gray-600">
                <Heart className="w-6 h-6" />
              </button>

              <Link to="/cart" className="relative hover:text-gray-600">
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="hidden lg:flex items-center justify-between h-12 text-white text-sm">
              {Object.keys(megaMenuData).map((menuItem) => (
                <div
                  key={menuItem}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveMegaMenu(menuItem)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    to={`/shop?category=${menuItem}`}
                    className="px-3 h-full flex items-center hover:bg-gray-800 transition-colors"
                  >
                    {menuItem}
                  </Link>
                </div>
              ))}
              <Link to="/shop?category=Brands" className="px-3 hover:bg-gray-800 transition-colors h-full flex items-center">
                Brands
              </Link>
              <Link to="/shop?category=Mini Size" className="px-3 hover:bg-gray-800 transition-colors h-full flex items-center">
                Mini Size
              </Link>
              <Link to="/shop?category=Gift Cards" className="px-3 hover:bg-gray-800 transition-colors h-full flex items-center">
                Gift Cards
              </Link>
              <Link to="/shop?category=Sale & Offers" className="px-3 text-red-400 hover:bg-gray-800 transition-colors h-full flex items-center">
                Sale & Offers
              </Link>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {activeMegaMenu && (
          <div
            className="absolute left-0 right-0 bg-white shadow-lg z-40 border-t"
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-5 gap-8">
                {megaMenuData[activeMegaMenu as keyof typeof megaMenuData].columns.map((column, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-sm mb-3">{column.title}</h3>
                    <ul className="space-y-2">
                      {column.links.map((link) => (
                        <li key={link}>
                          <Link
                            to={`/shop?category=${link}`}
                            className="text-sm text-gray-600 hover:text-black transition-colors"
                          >
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <div className="lg:hidden px-4 py-3 border-t">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </form>
          
          <div className="flex items-center justify-around py-2">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <button><Heart className="w-6 h-6" /></button>
            {user ? (
              <Link to="/profile"><User className="w-6 h-6" /></Link>
            ) : (
              <Link to="/login" className="text-sm font-medium">Sign In</Link>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {Object.keys(megaMenuData).map((menuItem) => (
              <Link
                key={menuItem}
                to={`/shop?category=${menuItem}`}
                className="block py-2 text-sm font-medium hover:text-gray-600"
              >
                {menuItem}
              </Link>
            ))}
            <Link to="/shop?category=Brands" className="block py-2 text-sm font-medium hover:text-gray-600">
              Brands
            </Link>
            <Link to="/shop?category=Mini Size" className="block py-2 text-sm font-medium hover:text-gray-600">
              Mini Size
            </Link>
            <Link to="/shop?category=Gift Cards" className="block py-2 text-sm font-medium hover:text-gray-600">
              Gift Cards
            </Link>
            <Link to="/shop?category=Sale & Offers" className="block py-2 text-sm font-medium text-red-500">
              Sale & Offers
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;