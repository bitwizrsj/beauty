import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, MapPin, Users, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { CatalogAPI } from '../lib/api';

const Navbar: React.FC = () => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await CatalogAPI.listProducts({ limit: 100 });
        setAllProducts(response.data.products.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          image: p.images?.[0]?.url || '',
          category: p.category?.name || '',
          brand: p.brand || ''
        })));
      } catch (e) {
        console.error('Error loading products:', e);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.mobile-menu-toggle')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const searchLower = searchQuery.toLowerCase();
      const filtered = allProducts
        .filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
        )
        .slice(0, 5);
      setSearchSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allProducts]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [navigate]);

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
      setShowSuggestions(false);
      setMobileSearchOpen(false);
    }
  };

  const handleSuggestionClick = (product: any) => {
    navigate(`/product/${product.id}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setMobileSearchOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (mobileSearchOpen) setMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
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
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="mobile-menu-toggle p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 lg:mx-0 mx-auto">
              <span className="text-xl md:text-2xl font-bold tracking-widest">BEAUTYBLOOM</span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8 relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </form>

              {/* Suggestions dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  {searchSuggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b last:border-b-0"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Search className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          {product.brand} • {product.category}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">${product.price}</div>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full px-4 py-3 text-sm font-medium text-center text-rose-600 hover:bg-gray-50 transition-colors"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Mobile Search Button */}
              <button 
                onClick={toggleMobileSearch}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Desktop Icons */}
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

              {/* Mobile Icons */}
              <div className="flex lg:hidden items-center space-x-4">
                <button className="hover:text-gray-600 relative">
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

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="lg:hidden pb-4" ref={searchRef}>
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setMobileSearchOpen(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </form>

              {/* Mobile Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b last:border-b-0"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <Search className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          {product.brand} • {product.category}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">${product.price}</div>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full px-4 py-3 text-sm font-medium text-center text-rose-600 hover:bg-gray-50 transition-colors"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Navigation Menu */}
        <div className="bg-black hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 text-white text-sm">
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
            className="absolute left-0 right-0 bg-white shadow-lg z-40 border-t hidden lg:block"
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

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="lg:hidden fixed inset-0 top-[calc(56px+45px)] bg-white z-40 overflow-y-auto"
          >
            <div className="p-4 border-b">
              {/* User Section */}
              {user ? (
                <div className="flex items-center space-x-3 py-2">
                  <User className="w-6 h-6" />
                  <div className="flex-1">
                    <div className="font-medium">Hi, {user.email?.split('@')[0]}</div>
                    <div className="text-sm text-gray-600">My Account</div>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center space-x-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-6 h-6" />
                  <div>
                    <div className="font-medium">Sign In</div>
                    <div className="text-sm text-gray-600">for FREE Shipping 🚚</div>
                  </div>
                </Link>
              )}
            </div>

            {/* Navigation Links */}
            <div className="p-4 space-y-1">
              {Object.keys(megaMenuData).map((menuItem) => (
                <Link
                  key={menuItem}
                  to={`/shop?category=${menuItem}`}
                  className="block py-3 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {menuItem}
                </Link>
              ))}
              <Link 
                to="/shop?category=Brands" 
                className="block py-3 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Brands
              </Link>
              <Link 
                to="/shop?category=Mini Size" 
                className="block py-3 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mini Size
              </Link>
              <Link 
                to="/shop?category=Gift Cards" 
                className="block py-3 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gift Cards
              </Link>
              <Link 
                to="/shop?category=Sale & Offers" 
                className="block py-3 px-2 text-lg font-medium text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sale & Offers
              </Link>
            </div>

            {/* Additional Links */}
            <div className="p-4 border-t">
              <button className="flex items-center space-x-3 w-full py-3 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors">
                <MapPin className="w-6 h-6" />
                <span>Stores & Services</span>
              </button>
              <button className="flex items-center space-x-3 w-full py-3 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors">
                <Users className="w-6 h-6" />
                <span>Community</span>
              </button>
              
              {user && (
                <>
                  <Link 
                    to="/profile" 
                    className="block py-3 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block py-3 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user && (user as any).role === 'admin' && (
                    <>
                      <div className="border-t my-2" />
                      <div className="text-sm font-semibold text-gray-500 px-2 py-1">Admin</div>
                      <Link 
                        to="/admin" 
                        className="block py-2 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                      <Link 
                        to="/admin/products" 
                        className="block py-2 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Manage Products
                      </Link>
                      <Link 
                        to="/admin/orders" 
                        className="block py-2 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Manage Orders
                      </Link>
                      <Link 
                        to="/admin/users" 
                        className="block py-2 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Manage Users
                      </Link>
                    </>
                  )}
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left py-3 px-2 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;