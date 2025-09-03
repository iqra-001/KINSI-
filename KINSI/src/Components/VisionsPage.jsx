import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles, Users, Calendar, Heart, MessageCircle, X, Filter, Search, Bookmark, Share2, Eye, ArrowLeft, ArrowRight, Palette, Star } from 'lucide-react';
import logo from '../assets/logo2.png';

const VisionsPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVision, setSelectedVision] = useState(null);
  const [savedVisions, setSavedVisions] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'all', name: 'All Visions', icon: '✨' },
    { id: 'weddings', name: 'Weddings', icon: '💒' },
    { id: 'birthdays', name: 'Birthdays', icon: '🎂' },
    { id: 'corporate', name: 'Corporate', icon: '💼' },
    { id: 'baby-shower', name: 'Baby Showers', icon: '🍼' },
    { id: 'bridal-shower', name: 'Bridal Showers', icon: '👰' },
    { id: 'graduations', name: 'Graduations', icon: '🎓' },
    { id: 'anniversaries', name: 'Anniversaries', icon: '💕' },
    { id: 'holiday', name: 'Holiday Parties', icon: '🎄' },
  ];

  const visions = [
    // Weddings
    {
      id: 1,
      title: "Rustic Garden Romance",
      category: "weddings",
      aesthetic: "Rustic Chic",
      colors: ["#DEB887", "#8FBC8F", "#F5F5DC", "#CD853F"],
      tags: ["outdoor", "rustic", "vintage", "garden"],
      description: "Enchanting outdoor celebration with vintage charm and natural elements",
      images: ["🌿", "🕊️", "🌸", "🕯️"],
      elements: ["Mason jar centerpieces", "Fairy lights", "Wooden signage", "Wildflower bouquets"],
      popularity: 95,
      season: "Spring/Summer",
      budget: "$$"
    },
    {
      id: 2,
      title: "Modern Minimalist Elegance",
      category: "weddings",
      aesthetic: "Contemporary",
      colors: ["#FFFFFF", "#F8F8FF", "#E6E6FA", "#C0C0C0"],
      tags: ["modern", "minimal", "elegant", "clean"],
      description: "Sophisticated celebration with clean lines and understated luxury",
      images: ["⚪", "💎", "🤍", "✨"],
      elements: ["Geometric designs", "Acrylic accents", "Monochrome palette", "Statement florals"],
      popularity: 88,
      season: "Year-round",
      budget: "$$$"
    },
    // Birthdays
    {
      id: 3,
      title: "Boho Dreamscape Birthday",
      category: "birthdays",
      aesthetic: "Bohemian",
      colors: ["#DEB887", "#CD853F", "#F4A460", "#D2691E"],
      tags: ["boho", "dreamy", "earthy", "macrame"],
      description: "Free-spirited celebration with earthy tones and whimsical details",
      images: ["🌙", "🦋", "🌻", "🕊️"],
      elements: ["Macrame backdrops", "Pampas grass", "Terracotta accents", "Dried flowers"],
      popularity: 92,
      season: "Summer/Fall",
      budget: "$$"
    },
    {
      id: 4,
      title: "Neon Glow Party",
      category: "birthdays",
      aesthetic: "Modern Fun",
      colors: ["#FF1493", "#00FFFF", "#ADFF2F", "#FFD700"],
      tags: ["neon", "glow", "party", "vibrant"],
      description: "Electric celebration with glow-in-the-dark elements and vibrant colors",
      images: ["🌈", "⚡", "🎆", "💫"],
      elements: ["LED lighting", "Glow sticks", "Neon signage", "Blacklight effects"],
      popularity: 85,
      season: "Year-round",
      budget: "$$"
    },
    // Corporate
    {
      id: 5,
      title: "Executive Excellence Gala",
      category: "corporate",
      aesthetic: "Luxury Professional",
      colors: ["#000000", "#FFD700", "#FFFFFF", "#C0C0C0"],
      tags: ["luxury", "professional", "gala", "elegant"],
      description: "Sophisticated corporate gathering with gold accents and premium finishes",
      images: ["👔", "🏆", "🥂", "💼"],
      elements: ["Gold accents", "Crystal centerpieces", "Premium linens", "Professional lighting"],
      popularity: 90,
      season: "Year-round",
      budget: "$$$"
    },
    // Baby Showers
    {
      id: 6,
      title: "Cloud Nine Baby Shower",
      category: "baby-shower",
      aesthetic: "Dreamy Soft",
      colors: ["#E6E6FA", "#B0C4DE", "#F0F8FF", "#FFFFFF"],
      tags: ["clouds", "dreamy", "soft", "heavenly"],
      description: "Heavenly celebration with cloud-themed decorations and soft pastels",
      images: ["☁️", "👶", "🌙", "⭐"],
      elements: ["Cloud balloons", "Angel wings", "Soft lighting", "Pastel accents"],
      popularity: 94,
      season: "Year-round",
      budget: "$"
    },
    {
      id: 7,
      title: "Safari Adventure Baby Shower",
      category: "baby-shower",
      aesthetic: "Adventure Theme",
      colors: ["#DEB887", "#8FBC8F", "#F4A460", "#CD853F"],
      tags: ["safari", "adventure", "animals", "jungle"],
      description: "Wild adventure theme with jungle animals and earthy tones",
      images: ["🦁", "🐘", "🌿", "🌍"],
      elements: ["Animal prints", "Jungle foliage", "Safari hats", "Earth tones"],
      popularity: 87,
      season: "Year-round",
      budget: "$$"
    },
    // Bridal Showers
    {
      id: 8,
      title: "Garden Tea Party Bridal",
      category: "bridal-shower",
      aesthetic: "Vintage Tea Party",
      colors: ["#FFB6C1", "#FFC0CB", "#F0FFF0", "#FFFAF0"],
      tags: ["tea-party", "vintage", "garden", "feminine"],
      description: "Elegant tea party with vintage china and garden florals",
      images: ["🌹", "🫖", "🧁", "🦋"],
      elements: ["Vintage teacups", "Tiered stands", "Lace details", "Rose arrangements"],
      popularity: 91,
      season: "Spring/Summer",
      budget: "$$"
    },
    // More diverse options
    {
      id: 9,
      title: "Midnight Galaxy Graduation",
      category: "graduations",
      aesthetic: "Celestial",
      colors: ["#191970", "#4169E1", "#FFD700", "#FFFFFF"],
      tags: ["galaxy", "stars", "celestial", "achievement"],
      description: "Reach for the stars celebration with cosmic elements and gold accents",
      images: ["🌌", "⭐", "🎓", "🌟"],
      elements: ["Star projections", "Galaxy balloons", "Gold diplomas", "Cosmic backdrop"],
      popularity: 86,
      season: "Year-round",
      budget: "$$"
    },
    {
      id: 10,
      title: "Tropical Sunset Anniversary",
      category: "anniversaries",
      aesthetic: "Tropical Romance",
      colors: ["#FF6347", "#FFD700", "#FF69B4", "#FFA500"],
      tags: ["tropical", "sunset", "romantic", "paradise"],
      description: "Romantic tropical escape with sunset colors and island vibes",
      images: ["🌺", "🌅", "🥥", "🍹"],
      elements: ["Palm leaves", "Sunset lighting", "Tropical flowers", "Tiki torches"],
      popularity: 89,
      season: "Summer",
      budget: "$$"
    }
  ];

  const filteredVisions = visions.filter(vision => {
    const matchesCategory = selectedCategory === 'all' || vision.category === selectedCategory;
    const matchesSearch = vision.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vision.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleSaveVision = (visionId) => {
    const newSavedVisions = new Set(savedVisions);
    if (newSavedVisions.has(visionId)) {
      newSavedVisions.delete(visionId);
    } else {
      newSavedVisions.add(visionId);
    }
    setSavedVisions(newSavedVisions);
  };

  const openVisionModal = (vision) => {
    setSelectedVision(vision);
    setCurrentImageIndex(0);
  };

  const closeVisionModal = () => {
    setSelectedVision(null);
  };

  const nextImage = () => {
    if (selectedVision) {
      setCurrentImageIndex((prev) => 
        prev === selectedVision.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedVision) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedVision.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50">
      {/* Navigation - Same as landing page */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-amber-50/95 backdrop-blur-lg shadow-lg border-b border-amber-900/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" onClick={() => navigate("/")} className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src={logo}
                alt="KINSI - Event Planning" 
                className="h-20 w-auto"
              />
            </a>
            
            <div className={`md:flex items-center space-x-8 ${
              isMobileMenuOpen ? 'flex absolute top-16 left-0 right-0 bg-amber-50/95 backdrop-blur-lg p-6 flex-col space-y-4 shadow-lg rounded-b-2xl' : 'hidden'
            }`}>
              <span 
                onClick={() => navigate("/localvendors")}
                className={`cursor-pointer font-medium hover:text-orange-500 transition-all duration-300 relative group ${
                  isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
                }`}
              >
                Local Vendors
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </span>

              <span 
                onClick={() => navigate("/aboutus")}
                className={`cursor-pointer font-medium hover:text-orange-500 transition-all duration-300 relative group ${
                  isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
                }`}
              >
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </span>

              <span 
                className={`cursor-pointer font-medium text-orange-500 transition-all duration-300 relative group ${
                  isScrolled ? 'text-orange-500' : 'text-orange-500 drop-shadow-sm'
                }`}
              >
                Visions
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500"></span>
              </span>

              <button 
                className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#FF8A47' }} 
                onClick={() => navigate("/signup")}
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

      {/* Header Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-300 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-6" style={{ color: '#3D2914' }}>
            Vision
            <span className="bg-gradient-to-r from-orange-500 to-green-400 bg-clip-text text-transparent"> Gallery</span>
          </h1>
          <p className="text-xl mb-8" style={{ color: '#8B6F47' }}>
            Discover endless inspiration for your perfect event
          </p>
          
          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-green-200">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search visions, themes, or styles..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-green-200 outline-none focus:border-orange-400 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {categories.slice(0, 5).map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-orange-500 to-green-400 text-white shadow-lg'
                        : 'bg-white/60 text-amber-900 hover:bg-white/80'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Extended Categories */}
            <div className="flex gap-2 flex-wrap justify-center mt-4">
              {categories.slice(5).map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-orange-500 to-green-400 text-white'
                      : 'bg-white/40 text-amber-800 hover:bg-white/60'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visions Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVisions.map((vision, index) => (
              <div 
                key={vision.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Vision Preview */}
                <div className="relative h-64 bg-gradient-to-br from-amber-50 to-white overflow-hidden">
                  {/* Color Palette */}
                  <div className="absolute top-4 right-4 flex gap-1 z-10">
                    {vision.colors.map((color, colorIndex) => (
                      <div 
                        key={colorIndex}
                        className="w-4 h-4 rounded-full shadow-lg"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Mood Images */}
                  <div className="grid grid-cols-2 gap-2 p-6 h-full">
                    {vision.images.map((image, imgIndex) => (
                      <div 
                        key={imgIndex}
                        className="bg-gradient-to-br from-green-100 to-amber-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500"
                        style={{ animationDelay: `${imgIndex * 0.2}s` }}
                      >
                        {image}
                      </div>
                    ))}
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button 
                      onClick={() => openVisionModal(vision)}
                      className="bg-white text-amber-900 px-4 py-2 rounded-full font-semibold hover:bg-amber-50 transition-colors flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    <button 
                      onClick={() => toggleSaveVision(vision.id)}
                      className={`p-2 rounded-full transition-colors ${
                        savedVisions.has(vision.id) 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-white text-amber-900 hover:bg-amber-50'
                      }`}
                    >
                      <Bookmark size={16} />
                    </button>
                  </div>

                  {/* Popularity Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-amber-900 flex items-center gap-1">
                    <Star size={12} className="text-orange-500" />
                    {vision.popularity}%
                  </div>
                </div>

                {/* Vision Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold" style={{ color: '#3D2914' }}>
                      {vision.title}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-orange-100 to-green-100 rounded-full text-amber-800 font-medium">
                      {vision.aesthetic}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-4" style={{ color: '#8B6F47' }}>
                    {vision.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {vision.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex justify-between items-center text-xs" style={{ color: '#8B6F47' }}>
                    <span>{vision.season}</span>
                    <span className="font-semibold">{vision.budget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVisions.length === 0 && (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#3D2914' }}>
                No visions found
              </h3>
              <p style={{ color: '#8B6F47' }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Vision Detail Modal */}
      {selectedVision && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-green-100 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold" style={{ color: '#3D2914' }}>
                  {selectedVision.title}
                </h2>
                <p className="text-lg" style={{ color: '#8B6F47' }}>
                  {selectedVision.aesthetic}
                </p>
              </div>
              <button 
                onClick={closeVisionModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image Gallery */}
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-amber-50 to-green-50 rounded-2xl p-8 text-center">
                  <div className="text-8xl mb-4">
                    {selectedVision.images[currentImageIndex]}
                  </div>
                  <div className="flex justify-center gap-2 mb-4">
                    {selectedVision.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-orange-500' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {selectedVision.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Color Palette */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#3D2914' }}>
                  Color Palette
                </h3>
                <div className="flex gap-4">
                  {selectedVision.colors.map((color, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="w-16 h-16 rounded-full shadow-lg mb-2"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs font-mono text-gray-600">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Elements */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#3D2914' }}>
                  Key Elements
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedVision.elements.map((element, index) => (
                    <div key={index} className="bg-gradient-to-br from-amber-50 to-green-50 p-4 rounded-2xl">
                      <span className="font-medium" style={{ color: '#3D2914' }}>
                        {element}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#3D2914' }}>
                  Style Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVision.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-orange-100 to-green-100 text-amber-800 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => toggleSaveVision(selectedVision.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    savedVisions.has(selectedVision.id)
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gradient-to-r from-orange-500 to-green-400 text-white hover:shadow-lg'
                  }`}
                >
                  <Bookmark size={16} />
                  {savedVisions.has(selectedVision.id) ? 'Saved' : 'Save Vision'}
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-green-200 text-amber-900 rounded-full font-semibold hover:bg-amber-50 transition-colors">
                  <Share2 size={16} />
                  Share Vision
                </button>
                <button 
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-900 to-amber-800 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                >
                  <Sparkles size={16} />
                  Start Planning
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-24 text-center text-amber-50" style={{ backgroundColor: '#3D2914' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-black mb-6">
            Found Your Perfect Vision?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Let our expert team bring your chosen vision to life with local vendors who understand your style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-3 bg-white text-amber-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-50 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Start Planning Now
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate("/localvendors")}
              className="inline-flex items-center gap-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-amber-900 transition-all duration-300"
            >
              Browse Vendors
              <Users className="w-5 h-5" />
            </button>
          </div>
          
          {/* Saved Visions Count */}
          {savedVisions.size > 0 && (
            <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Bookmark className="w-5 h-5 text-orange-400" />
              <span className="font-semibold">
                {savedVisions.size} vision{savedVisions.size !== 1 ? 's' : ''} saved
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-amber-50" style={{ backgroundColor: '#3D2914' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#FF8A47' }}>KINSI</h3>
              <p className="opacity-90">Bringing Pinterest visions to life, one event at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#A8D5A8' }}>Services</h4>
              <ul className="space-y-2 opacity-90">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Wedding Planning</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Corporate Events</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Birthday Parties</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Baby Showers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#A8D5A8' }}>Company</h4>
              <ul className="space-y-2 opacity-90">
                <li><a href="#" onClick={() => navigate("/aboutus")} className="hover:text-orange-400 transition-colors cursor-pointer">About Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
                <li><a href="#" onClick={() => navigate("/Visions")} className="hover:text-orange-400 transition-colors cursor-pointer">Visions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#A8D5A8' }}>Connect</h4>
              <ul className="space-y-2 opacity-90">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Pinterest</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-amber-800/30 opacity-70">
            <p>&copy; 2025 KINSI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VisionsPage;