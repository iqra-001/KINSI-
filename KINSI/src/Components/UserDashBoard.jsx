import logo from '../assets/logo2.png';
import React, { useState } from 'react';
import { 
  User, Calendar, Users, CreditCard, Settings, Bell, 
  Camera, Edit3, Heart, Sparkles, ChevronRight, Plus,
  MapPin, Phone, Mail, Star, ArrowLeft, Upload,
  CheckCircle, Clock, DollarSign, Package, LogOut, X
} from 'lucide-react';

const KinsiDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [profileImage, setProfileImage] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'mpesa'
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  const [eventFormData, setEventFormData] = useState({
    eventName: '',
    eventType: '',
    date: '',
    budget: '',
    guests: '',
    description: ''
  });

  const [paymentFormData, setPaymentFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    mpesaNumber: ''
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEventInputChange = (field, value) => {
    setEventFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentInputChange = (field, value) => {
    setPaymentFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Event data:', eventFormData);
    setShowEventForm(false);
    // Reset form
    setEventFormData({
      eventName: '',
      eventType: '',
      date: '',
      budget: '',
      guests: '',
      description: ''
    });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the payment data to your backend
    console.log('Payment data:', paymentFormData);
    setShowPaymentForm(false);
    // Reset form
    setPaymentFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      mpesaNumber: ''
    });
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('User logged out');
    // Typically you would clear authentication tokens and redirect
  };

  const menuItems = [
    { id: 'overview', icon: <Sparkles className="w-5 h-5" />, label: 'Overview', color: '#D97B29' },
    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'My Profile', color: '#8FB996' },
    { id: 'events', icon: <Calendar className="w-5 h-5" />, label: 'My Events', color: '#E69D4F' },
    { id: 'vendors', icon: <Users className="w-5 h-5" />, label: 'Find Vendors', color: '#D97B29' },
    { id: 'payments', icon: <CreditCard className="w-5 h-5" />, label: 'Payments', color: '#8FB996' }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl p-8" style={{ 
        background: 'linear-gradient(135deg, #D97B29 0%, #E69D4F 100%)' 
      }}>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white mb-4">
            Welcome back to your creative space! ✨
          </h1>
          <p className="text-white/90 text-lg">
            Ready to bring another Pinterest vision to life?
          </p>
        </div>
        {/* Floating elements */}
        <div className="absolute top-4 right-4 text-4xl opacity-30 animate-bounce">🎨</div>
        <div className="absolute bottom-4 right-12 text-3xl opacity-20 animate-pulse">💐</div>
        <div className="absolute top-1/2 right-20 text-2xl opacity-25 animate-bounce" style={{ animationDelay: '1s' }}>✨</div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Events Planned', value: '0', icon: '🎉', color: '#D97B29' },
          { label: 'Vendors Connected', value: '0', icon: '🤝', color: '#8FB996' },
          { label: 'Dreams Realized', value: '0', icon: '💫', color: '#E69D4F' },
          { label: 'Happy Moments', value: '0', icon: '💕', color: '#D97B29' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 hover:transform hover:-translate-y-2 group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
            <div className="text-3xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm font-medium" style={{ color: '#7A5C38' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        <div 
          className="bg-white rounded-3xl p-8 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 cursor-pointer group hover:transform hover:-translate-y-1"
          onClick={() => setShowEventForm(true)}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#3D2914' }}>Plan New Event</h3>
              <p className="text-sm" style={{ color: '#7A5C38' }}>Start your next celebration</p>
            </div>
          </div>
          <p className="leading-relaxed mb-4" style={{ color: '#7A5C38' }}>
            Transform your Pinterest boards into reality with our expert planning team.
          </p>
          <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all">
            Start Planning <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          className="bg-white rounded-3xl p-8 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 cursor-pointer group hover:transform hover:-translate-y-1"
          onClick={() => setActiveSection('vendors')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#3D2914' }}>Browse Vendors</h3>
              <p className="text-sm" style={{ color: '#7A5C38' }}>Find your perfect partners</p>
            </div>
          </div>
          <p className="leading-relaxed mb-4" style={{ color: '#7A5C38' }}>
            Discover curated local vendors who understand your aesthetic vision.
          </p>
          <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
            Explore Vendors <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
        <h2 className="text-3xl font-black mb-8" style={{ color: '#3D2914' }}>
          Your Creative Profile
        </h2>
        
        {/* Profile Image Upload */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-200 group-hover:border-orange-300 transition-colors">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-700 transition-colors shadow-lg">
              <Camera className="w-5 h-5 text-white" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                  placeholder="Your first name"
                  style={{ color: '#3D2914' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                  placeholder="Your last name"
                  style={{ color: '#3D2914' }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                  placeholder="your.email@example.com"
                  style={{ color: '#3D2914' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                  placeholder="+1 (555) 123-4567"
                  style={{ color: '#3D2914' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Location</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                placeholder="City, State"
                style={{ color: '#3D2914' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>About You</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows="4"
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg resize-none"
                placeholder="Tell us about your event style and what inspires you..."
                style={{ color: '#3D2914' }}
              />
            </div>

            <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-2xl font-bold text-lg hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
              Save Profile Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black" style={{ color: '#3D2914' }}>
          My Events
        </h2>
        <button 
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-full font-semibold hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
          onClick={() => setShowEventForm(true)}
        >
          <Plus className="w-5 h-5" />
          Plan New Event
        </button>
      </div>

      {/* Event Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { 
            title: 'Wedding Planning', 
            description: 'Create your perfect day',
            icon: '💍',
            color: '#D97B29',
            gradient: 'from-orange-500 to-orange-600'
          },
          { 
            title: 'Birthday Parties', 
            description: 'Celebrate another year',
            icon: '🎂',
            color: '#8FB996',
            gradient: 'from-green-500 to-green-600'
          },
          { 
            title: 'Corporate Events', 
            description: 'Professional gatherings',
            icon: '🏢',
            color: '#E69D4F',
            gradient: 'from-amber-500 to-amber-600'
          },
          { 
            title: 'Baby Showers', 
            description: 'Welcome little ones',
            icon: '🍼',
            color: '#D97B29',
            gradient: 'from-pink-500 to-pink-600'
          },
          { 
            title: 'Anniversary', 
            description: 'Milestone celebrations',
            icon: '💕',
            color: '#8FB996',
            gradient: 'from-red-500 to-red-600'
          },
          { 
            title: 'Custom Events', 
            description: 'Your unique vision',
            icon: '✨',
            color: '#E69D4F',
            gradient: 'from-purple-500 to-purple-600'
          }
        ].map((event, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 hover:transform hover:-translate-y-2 cursor-pointer group"
            onClick={() => setShowEventForm(true)}
          >
            <div className={`w-12 h-12 bg-gradient-to-r Ksh{event.gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              <span className="text-2xl">{event.icon}</span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#3D2914' }}>{event.title}</h3>
            <p className="mb-4" style={{ color: '#7A5C38' }}>{event.description}</p>
            <div className="flex items-center gap-2 font-semibold group-hover:gap-3 transition-all" style={{ color: event.color }}>
              Start Planning <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#3D2914' }}>Recent Events</h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">📅</div>
          <p className="text-lg" style={{ color: '#7A5C38' }}>No events planned yet</p>
          <p className="text-sm mt-2" style={{ color: '#7A5C38' }}>Start planning your first event to see it here!</p>
        </div>
      </div>
    </div>
  );

  const renderVendors = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-black" style={{ color: '#3D2914' }}>
        Find Perfect Vendors
      </h2>

      {/* Vendor Categories */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { name: 'Photographers', icon: '📸', count: '0' },
          { name: 'Caterers', icon: '🍰', count: '0' },
          { name: 'Florists', icon: '🌸', count: '0' },
          { name: 'Venues', icon: '🏛️', count: '0' },
          { name: 'Musicians', icon: '🎵', count: '0' },
          { name: 'Decorators', icon: '🎨', count: '0' },
          { name: 'Bakers', icon: '🧁', count: '0' },
          { name: 'Planners', icon: '📋', count: '0' }
        ].map((category, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 hover:transform hover:-translate-y-1 cursor-pointer text-center group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
            <h3 className="font-bold mb-2" style={{ color: '#3D2914' }}>{category.name}</h3>
            <p className="text-sm" style={{ color: '#7A5C38' }}>{category.count} available</p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search vendors by name, service, or location..."
            className="flex-1 p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
            style={{ color: '#3D2914' }}
          />
          <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-2xl font-semibold hover:transform hover:-translate-y-1 transition-all duration-300">
            Search
          </button>
        </div>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">🔍</div>
          <p className="text-lg" style={{ color: '#7A5C38' }}>Start searching to find amazing vendors</p>
          <p className="text-sm mt-2" style={{ color: '#7A5C38' }}>Use the search above to discover vendors in your area</p>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-black" style={{ color: '#3D2914' }}>
        Payments & Billing
      </h2>

      {/* Payment Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Total Spent', amount: 'Ksh0.00', icon: <DollarSign className="w-6 h-6" />, color: '#D97B29' },
          { title: 'Pending Payments', amount: 'Ksh0.00', icon: <Clock className="w-6 h-6" />, color: '#8FB996' },
          { title: 'Completed', amount: 'Ksh0.00', icon: <CheckCircle className="w-6 h-6" />, color: '#E69D4F' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border-2 border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#7A5C38' }}>{stat.title}</p>
                <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.amount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold" style={{ color: '#3D2914' }}>Payment Methods</h3>
          <button 
            className="flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
            onClick={() => setShowPaymentForm(true)}
          >
            <Plus className="w-4 h-4" />
            Add Payment Method
          </button>
        </div>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">💳</div>
          <p className="text-lg" style={{ color: '#7A5C38' }}>No payment methods added</p>
          <p className="text-sm mt-2" style={{ color: '#7A5C38' }}>Add a payment method to easily pay for your events</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#3D2914' }}>Transaction History</h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">📊</div>
          <p className="text-lg" style={{ color: '#7A5C38' }}>No transactions yet</p>
          <p className="text-sm mt-2" style={{ color: '#7A5C38' }}>Your payment history will appear here</p>
        </div>
      </div>
    </div>
  );

  // Event Form Modal
  const renderEventForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black" style={{ color: '#3D2914' }}>Plan New Event</h2>
          <button 
            onClick={() => setShowEventForm(false)}
            className="p-2 rounded-full hover:bg-orange-100 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#3D2914' }} />
          </button>
        </div>
        
        <form onSubmit={handleEventSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Event Name</label>
            <input
              type="text"
              value={eventFormData.eventName}
              onChange={(e) => handleEventInputChange('eventName', e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
              placeholder="e.g., "
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Event Type</label>
            <select
              value={eventFormData.eventType}
              onChange={(e) => handleEventInputChange('eventType', e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
              required
            >
              <option value="">Select event type</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday Party</option>
              <option value="corporate">Corporate Event</option>
              <option value="babyShower">Baby Shower</option>
              <option value="anniversary">Anniversary</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Date</label>
              <input
                type="date"
                value={eventFormData.date}
                onChange={(e) => handleEventInputChange('date', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Budget (Ksh)</label>
              <input
                type="number"
                value={eventFormData.budget}
                onChange={(e) => handleEventInputChange('budget', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                placeholder="Estimated budget"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Number of Guests</label>
            <input
              type="number"
              value={eventFormData.guests}
              onChange={(e) => handleEventInputChange('guests', e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
              placeholder="Approximate number of guests"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Event Description</label>
            <textarea
              value={eventFormData.description}
              onChange={(e) => handleEventInputChange('description', e.target.value)}
              rows="4"
              className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors resize-none"
              placeholder="Describe your vision, theme, and any special requirements..."
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-2xl font-bold text-lg hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );

  // Payment Form Modal
  const renderPaymentForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black" style={{ color: '#3D2914' }}>Add Payment Method</h2>
          <button 
            onClick={() => setShowPaymentForm(false)}
            className="p-2 rounded-full hover:bg-orange-100 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#3D2914' }} />
          </button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <button
            className={`flex-1 py-3 rounded-2xl font-semibold transition-colors Ksh{
              paymentMethod === 'card' 
                ? 'bg-orange-600 text-white' 
                : 'bg-orange-100 text-orange-800'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            Credit Card
          </button>
          <button
            className={`flex-1 py-3 rounded-2xl font-semibold transition-colors Ksh{
              paymentMethod === 'mpesa' 
                ? 'bg-orange-600 text-white' 
                : 'bg-orange-100 text-orange-800'
            }`}
            onClick={() => setPaymentMethod('mpesa')}
          >
            M-Pesa
          </button>
        </div>
        
        <form onSubmit={handlePaymentSubmit}>
          {paymentMethod === 'card' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Card Number</label>
                <input
                  type="text"
                  value={paymentFormData.cardNumber}
                  onChange={(e) => handlePaymentInputChange('cardNumber', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Expiry Date</label>
                  <input
                    type="text"
                    value={paymentFormData.expiryDate}
                    onChange={(e) => handlePaymentInputChange('expiryDate', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>CVV</label>
                  <input
                    type="text"
                    value={paymentFormData.cvv}
                    onChange={(e) => handlePaymentInputChange('cvv', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Cardholder Name</label>
                <input
                  type="text"
                  value={paymentFormData.cardName}
                  onChange={(e) => handlePaymentInputChange('cardName', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>M-Pesa Phone Number</label>
              <input
                type="tel"
                value={paymentFormData.mpesaNumber}
                onChange={(e) => handlePaymentInputChange('mpesaNumber', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                placeholder="07XX XXX XXX"
                required
              />
              <p className="text-sm mt-2" style={{ color: '#7A5C38' }}>
                You will receive a prompt on your phone to confirm the payment method.
              </p>
            </div>
          )}
          
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-2xl font-bold text-lg mt-6 hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Add Payment Method
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #F5EBDA 0%, #E8D9C0 100%)' }}
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-orange-400 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center"
              >
                {/* Replace with your actual logo */}
               <a href="#" className="flex items-center hover:opacity-80 transition-opacity">
                 <img 
                   src={logo} // import logo from '../assets/logo2.png'
                   alt="KINSI - Event Planning"
                   className="h-20 w-auto object-contain"
                 />
               </a>
               
              </div>
              <div>
                <h1 className="text-2xl font-black" style={{ color: '#3D2914' }}>KINSI </h1>
                <p className="text-sm" style={{ color: '#7A5C38' }}>Your creative planning space</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-orange-100 transition-colors">
                <Bell className="w-5 h-5" style={{ color: '#7A5C38' }} />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-orange-100 transition-colors"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-5 h-5" style={{ color: '#7A5C38' }} />
              </button>
              <button 
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200"
                onClick={() => setActiveSection('profile')}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Navigation Menu */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border-2 border-orange-100 sticky top-8">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 hover:transform hover:translate-x-2 Ksh{
                      activeSection === item.id
                        ? 'text-white shadow-lg'
                        : 'hover:bg-orange-50'
                    }`}
                    style={{
                      backgroundColor: activeSection === item.id ? item.color : 'transparent',
                      color: activeSection === item.id ? 'white' : '#3D2914'
                    }}
                  >
                    <div className={`transition-colors Ksh{
                      activeSection === item.id ? 'text-white' : ''
                    }`}>
                      {item.icon}
                    </div>
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Quick Contact */}
              <div className="mt-8 pt-6 border-t border-orange-200">
                <p className="text-sm font-semibold mb-3" style={{ color: '#3D2914' }}>Need Help?</p>
                <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-2xl font-semibold hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg text-sm">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border-2 border-orange-100 min-h-[80vh]">
              {activeSection === 'overview' && renderOverview()}
              {activeSection === 'profile' && renderProfile()}
              {activeSection === 'events' && renderEvents()}
              {activeSection === 'vendors' && renderVendors()}
              {activeSection === 'payments' && renderPayments()}
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed bottom-8 right-8 pointer-events-none">
        <div className="text-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}>🌟</div>
      </div>
      <div className="fixed top-1/3 right-12 pointer-events-none">
        <div className="text-2xl opacity-20 animate-bounce" style={{ animationDelay: '2s' }}>✨</div>
      </div>

      {/* Modals */}
      {showEventForm && renderEventForm()}
      {showPaymentForm && renderPaymentForm()}
    </div>
  );
};

export default KinsiDashboard;