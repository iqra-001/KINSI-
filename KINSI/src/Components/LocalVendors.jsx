import React, { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Phone, Mail, Star, Filter, Search, Heart, MessageCircle, X, Award, Clock, Verified, Loader } from 'lucide-react';
import logo from '../assets/logo2.png';

const LocalVendorsPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5555/api/vendor';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch vendors from backend
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }
      
      const vendorsData = await response.json();
      setVendors(vendorsData);
    } catch (err) {
      setError('Error loading vendors: ' + err.message);
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Vendors', icon: '🎯' },
    { id: 'Photography', name: 'Photography', icon: '📸' },
    { id: 'Catering', name: 'Catering', icon: '🍽️' },
    { id: 'Decoration', name: 'Decorations', icon: '🎨' },
    { id: 'Venue', name: 'Venues', icon: '🏛️' },
    { id: 'Music & Entertainment', name: 'Music', icon: '🎵' },
    { id: 'Event Planning', name: 'Planning', icon: '📋' },
    { id: 'Flowers', name: 'Florists', icon: '💐' },
    { id: 'Transportation', name: 'Transport', icon: '🚗' }
  ];

  // Map backend data to frontend format
  const mapVendorToDisplay = (vendor) => {
    const categoryMap = {
      'Photography': 'photography',
      'Catering': 'catering',
      'Decoration': 'decorations',
      'Venue': 'locations',
      'Music & Entertainment': 'music',
      'Event Planning': 'planning',
      'Flowers': 'florists',
      'Transportation': 'transport',
      'Other': 'other'
    };

    const mainService = vendor.services && vendor.services.length > 0 
      ? vendor.services[0] 
      : null;

    return {
      id: vendor.id,
      category: categoryMap[vendor.service_type] || 'other',
      name: vendor.business_name,
      rating: 4.8, // Default rating for new vendors
      reviews: Math.floor(Math.random() * 100) + 20, // Random reviews for demo
      image: getCategoryIcon(vendor.service_type),
      location: vendor.address || 'Nairobi, Kenya',
      phone: vendor.contact_phone || '+254 XXX XXX XXX',
      email: vendor.email || 'contact@vendor.com',
      specialties: mainService ? [mainService.service_name] : [vendor.service_type],
      description: vendor.description || 'Professional service provider',
      priceRange: mainService ? `KSh ${mainService.price.toLocaleString()}` : 'KSh 5,000 - 50,000',
      verified: true,
      featured: Math.random() > 0.7, // Random featured status
      vendorData: vendor // Keep original data
    };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Photography': '📸',
      'Catering': '🍽️',
      'Decoration': '🎨',
      'Venue': '🏛️',
      'Music & Entertainment': '🎵',
      'Event Planning': '📋',
      'Flowers': '💐',
      'Transportation': '🚗',
      'Other': '🏢'
    };
    return icons[category] || '🏢';
  };

  const filteredVendors = vendors
    .map(mapVendorToDisplay)
    .filter(vendor => {
      const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vendor.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

  const VendorModal = ({ vendor, onClose }) => {
    if (!vendor) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-green-200 p-6 rounded-t-3xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{vendor.image}</div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: '#3D2914' }}>{vendor.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{vendor.rating}</span>
                    <span className="text-gray-600">({vendor.reviews} reviews)</span>
                  </div>
                  {vendor.verified && <Verified className="w-5 h-5 text-blue-500" />}
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#3D2914' }}>About</h4>
              <p className="text-gray-700 leading-relaxed">{vendor.description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#3D2914' }}>Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {vendor.specialties.map((specialty, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: '#3D2914' }}>Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{vendor.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2" style={{ color: '#3D2914' }}>Pricing</h4>
                <p className="text-lg font-semibold" style={{ color: '#FF8A47' }}>{vendor.priceRange}</p>
              </div>
            </div>

            {vendor.vendorData.services && vendor.vendorData.services.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2" style={{ color: '#3D2914' }}>Services Offered</h4>
                <div className="space-y-2">
                  {vendor.vendorData.services.slice(0, 3).map((service, index) => (
                    <div key={index} className="p-3 bg-orange-50 rounded-lg">
                      <h5 className="font-semibold" style={{ color: '#3D2914' }}>{service.service_name}</h5>
                      <p className="text-sm" style={{ color: '#7A5C38' }}>KSh {service.price} • {service.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button 
                className="flex-1 bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
                style={{ backgroundColor: '#FF8A47' }}
              >
                Contact Vendor
              </button>
              <button className="flex-1 border border-green-300 text-green-700 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors">
                Save to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #E8E0D4 100%)' }}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#D97B29' }} />
          <p className="text-xl font-semibold" style={{ color: '#3D2914' }}>Loading vendors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #E8E0D4 100%)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-xl font-semibold mb-2" style={{ color: '#3D2914' }}>Error Loading Vendors</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchVendors}
            className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
            style={{ backgroundColor: '#FF8A47' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #E8E0D4 100%)' }}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        isScrolled 
          ? 'bg-amber-50/95 backdrop-blur-lg shadow-lg border-b border-amber-900/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src={logo}
                alt="KINSI - Event Planning"
                className="h-20 w-auto object-contain"
              />
            </a>
            
            <div className={`md:flex items-center space-x-8 ${
              isMobileMenuOpen ? 'flex absolute top-16 left-0 right-0 bg-amber-50/95 backdrop-blur-lg p-6 flex-col space-y-4 shadow-lg rounded-b-2xl' : 'hidden'
            }`}>
              <a href="/localvendors" 
                className={`cursor-pointer font-medium text-orange-500 relative ${
                  isScrolled ? '' : 'drop-shadow-sm'
                }`}>
                Local Vendors
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500"></span>
              </a>

              <a href="/aboutus" 
                className={`cursor-pointer font-medium hover:text-orange-500 transition-all duration-300 relative group ${
                  isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
                }`}>
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>

              <a href="/visionspage" 
                className={`cursor-pointer font-medium hover:text-orange-500 transition-all duration-300 relative group ${
                  isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
                }`}>
                Visions
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>

              <a href="/signup">
                <button 
                  className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: '#FF8A47' }}
                >
                  Sign Up
                </button>
              </a>
            </div>

            <button 
              className={`md:hidden p-2 transition-colors ${
                isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6" style={{ color: '#3D2914' }}>
            Discover Amazing
            <span className="bg-gradient-to-r from-orange-500 to-green-400 bg-clip-text text-transparent block">
              Local Vendors
            </span>
          </h1>
          
          <p className="text-xl mb-12" style={{ color: '#8B6F47' }}>
            Curated professionals ready to bring your Pinterest visions to life
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vendors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-green-200 focus:outline-none focus:border-orange-400 text-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-orange-50'
                }`}
                style={selectedCategory === category.id ? { backgroundColor: '#FF8A47' } : {}}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {filteredVendors.filter(v => selectedCategory === 'all' || v.category === category.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Vendors Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-green-200 group cursor-pointer"
                onClick={() => setSelectedVendor(vendor)}
              >
                <div className="p-6 text-center relative">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {vendor.image}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="text-xl font-bold" style={{ color: '#3D2914' }}>
                      {vendor.name}
                    </h3>
                    {vendor.verified && <Verified className="w-4 h-4 text-blue-500" />}
                  </div>

                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{vendor.rating}</span>
                    <span className="text-gray-600">({vendor.reviews})</span>
                  </div>

                  <div className="flex items-center justify-center gap-1 mb-4 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{vendor.location}</span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {vendor.specialties.slice(0, 2).map((specialty, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                    {vendor.specialties.length > 2 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{vendor.specialties.length - 2} more
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {vendor.description}
                  </p>

                  <div className="text-lg font-bold mb-4" style={{ color: '#FF8A47' }}>
                    {vendor.priceRange}
                  </div>

                  <button 
                    className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#FF8A47' }}
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredVendors.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#3D2914' }}>
                No vendors found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Vendor Modal */}
      <VendorModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />

      {/* Footer and other components */}
      {/* ... your footer code ... */}
    </div>
  );
};

export default LocalVendorsPage;