import React, { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Phone, Mail, Star, Filter, Search, Heart, MessageCircle, X, Award, Clock, Verified } from 'lucide-react';

const LocalVendorsPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'all', name: 'All Vendors', icon: '🎯', count: 48 },
    { id: 'bakers', name: 'Bakers', icon: '🧁', count: 12 },
    { id: 'florists', name: 'Florists', icon: '💐', count: 8 },
    { id: 'decorations', name: 'Decorations', icon: '🎨', count: 15 },
    { id: 'locations', name: 'Venues', icon: '🏛️', count: 13 }
  ];

  const vendors = [
    // Bakers
    {
      id: 1,
      category: 'bakers',
      name: 'Sweet Dreams Bakery',
      rating: 4.9,
      reviews: 127,
      image: '🧁',
      location: 'Westlands, Nairobi',
      phone: '+254 712 345 678',
      email: 'info@sweetdreams.co.ke',
      specialties: ['Wedding Cakes', 'Cupcakes', 'Custom Desserts'],
      description: 'Award-winning bakery specializing in custom wedding cakes and artisanal desserts. Known for Instagram-worthy designs.',
      priceRange: 'KSh 5,000 - 50,000',
      verified: true,
      featured: true
    },
    {
      id: 2,
      category: 'bakers',
      name: 'The Cake Studio',
      rating: 4.8,
      reviews: 89,
      image: '🎂',
      location: 'Karen, Nairobi',
      phone: '+254 722 456 789',
      email: 'hello@cakestudio.ke',
      specialties: ['Birthday Cakes', 'Theme Cakes', 'Pastries'],
      description: 'Creative cake designers bringing your Pinterest visions to life with edible art.',
      priceRange: 'KSh 3,000 - 35,000',
      verified: true
    },
    {
      id: 3,
      category: 'bakers',
      name: 'Artisan Bakes',
      rating: 4.7,
      reviews: 156,
      image: '🥐',
      location: 'Kilimani, Nairobi',
      phone: '+254 733 567 890',
      email: 'orders@artisanbakes.co.ke',
      specialties: ['Artisan Breads', 'Macarons', 'French Pastries'],
      description: 'French-inspired bakery offering elegant pastries and custom celebration cakes.',
      priceRange: 'KSh 2,500 - 40,000',
      verified: true
    },

    // Florists
    {
      id: 4,
      category: 'florists',
      name: 'Bloom & Blossom',
      rating: 4.9,
      reviews: 203,
      image: '🌸',
      location: 'Runda, Nairobi',
      phone: '+254 744 678 901',
      email: 'info@bloomblossom.ke',
      specialties: ['Bridal Bouquets', 'Event Arrangements', 'Tropical Flowers'],
      description: 'Premier florist creating stunning arrangements that capture the essence of your Pinterest inspiration.',
      priceRange: 'KSh 8,000 - 80,000',
      verified: true,
      featured: true
    },
    {
      id: 5,
      category: 'florists',
      name: 'Petal Perfect',
      rating: 4.6,
      reviews: 92,
      image: '🌹',
      location: 'Lavington, Nairobi',
      phone: '+254 755 789 012',
      email: 'hello@petalperfect.co.ke',
      specialties: ['Rose Arrangements', 'Garden Parties', 'Corporate Events'],
      description: 'Elegant floral designs for sophisticated events. Specialists in luxury rose arrangements.',
      priceRange: 'KSh 6,000 - 60,000',
      verified: true
    },

    // Decorations
    {
      id: 6,
      category: 'decorations',
      name: 'Dream Decor Studio',
      rating: 4.8,
      reviews: 174,
      image: '🎨',
      location: 'Upperhill, Nairobi',
      phone: '+254 766 890 123',
      email: 'create@dreamdecor.ke',
      specialties: ['Backdrop Design', 'Lighting', 'Theme Decorations'],
      description: 'Transform any space into your Pinterest dream with our creative decoration services.',
      priceRange: 'KSh 15,000 - 150,000',
      verified: true,
      featured: true
    },
    {
      id: 7,
      category: 'decorations',
      name: 'Elegant Affairs',
      rating: 4.7,
      reviews: 128,
      image: '✨',
      location: 'Gigiri, Nairobi',
      phone: '+254 777 901 234',
      email: 'info@elegantaffairs.co.ke',
      specialties: ['Wedding Decor', 'Luxury Events', 'Balloon Arrangements'],
      description: 'Sophisticated decoration company specializing in luxury wedding and corporate events.',
      priceRange: 'KSh 20,000 - 200,000',
      verified: true
    },

    // Locations/Venues
    {
      id: 8,
      category: 'locations',
      name: 'The Garden Estate',
      rating: 4.9,
      reviews: 245,
      image: '🏛️',
      location: 'Karen, Nairobi',
      phone: '+254 788 012 345',
      email: 'events@gardenestate.ke',
      specialties: ['Outdoor Weddings', 'Garden Parties', 'Corporate Events'],
      description: 'Beautiful garden venue perfect for Pinterest-inspired outdoor celebrations.',
      priceRange: 'KSh 50,000 - 300,000',
      verified: true,
      featured: true
    },
    {
      id: 9,
      category: 'locations',
      name: 'Skyline Rooftop',
      rating: 4.8,
      reviews: 189,
      image: '🌆',
      location: 'Westlands, Nairobi',
      phone: '+254 799 123 456',
      email: 'book@skylinerooftop.co.ke',
      specialties: ['Rooftop Events', 'City Views', 'Cocktail Parties'],
      description: 'Stunning rooftop venue with panoramic city views for unforgettable celebrations.',
      priceRange: 'KSh 40,000 - 250,000',
      verified: true
    }
  ];

  const filteredVendors = vendors.filter(vendor => {
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
            <a href="#" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="text-3xl font-black" style={{ color: '#FF8A47' }}>KINSI</div>
            </a>
            
            <div className={`md:flex items-center space-x-8 ${
              isMobileMenuOpen ? 'flex absolute top-16 left-0 right-0 bg-amber-50/95 backdrop-blur-lg p-6 flex-col space-y-4 shadow-lg rounded-b-2xl' : 'hidden'
            }`}>
              <span className={`cursor-pointer font-medium hover:text-orange-500 transition-all duration-300 relative group ${
                isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
              }`}>
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </span>

              <span className={`cursor-pointer font-medium text-orange-500 relative ${
                isScrolled ? '' : 'drop-shadow-sm'
              }`}>
                Local Vendors
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500"></span>
              </span>

              <span className={`cursor-pointer font-medium hover:text-orange-500 transition-all duration-300 relative group ${
                isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
              }`}>
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </span>

              <span className={`cursor-pointer font-medium hover:text-orange-500 transition-all duration-300 relative group ${
                isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
              }`}>
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </span>

              <button 
                className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#FF8A47' }}
              >
                Sign Up
              </button>
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
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-300 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>

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
                  {category.count}
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
                {vendor.featured && (
                  <div className="bg-gradient-to-r from-orange-500 to-green-400 text-white text-xs font-semibold px-3 py-1 absolute top-4 left-4 rounded-full z-10">
                    <Award className="w-3 h-3 inline mr-1" />
                    Featured
                  </div>
                )}

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

      {/* Chatbot */}
      <div className="fixed bottom-8 right-8 z-30">
        <button 
          className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-xl hover:scale-110 transition-all duration-300 animate-pulse"
          onClick={() => setIsChatOpen(!isChatOpen)}
          title="Chat with us"
          style={{ 
            background: 'linear-gradient(135deg, #FF8A47, #FF6B2B)',
            boxShadow: '0 8px 25px rgba(255, 138, 71, 0.4)'
          }}
        >
          <MessageCircle size={24} className="mx-auto" />
        </button>
        
        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-green-200">
            <div className="bg-amber-900 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <h4 className="font-semibold">Vendor Assistant</h4>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 h-48 overflow-y-auto">
              <div className="bg-gradient-to-br from-green-200 to-amber-100 p-3 rounded-2xl text-sm leading-relaxed mb-4">
                Hi! 👋 I can help you find the perfect vendors for your event. What are you planning?
              </div>
            </div>
            <div className="p-4 border-t border-green-200 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about vendors..." 
                className="flex-1 p-2 border border-green-200 rounded-full outline-none focus:border-orange-400 text-sm"
              />
              <button 
                className="text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
                style={{ backgroundColor: '#FF8A47' }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalVendorsPage;