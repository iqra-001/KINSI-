import React, { useState, useEffect } from 'react';
import { 
  User, Calendar, Users, CreditCard, Settings, Bell, 
  Camera, Edit3, Heart, Sparkles, ChevronRight, Plus,
  MapPin, Phone, Mail, Star, ArrowLeft, Upload,
  CheckCircle, Clock, DollarSign, Package, LogOut, X,
  Save, Trash2, Edit, AlertCircle, Filter, MessageCircle
} from 'lucide-react';
import LogoutButton from './LogOutButton';

const KinsiDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [profileImage, setProfileImage] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Profile data with saved state
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    bio: ''
  });

  // Temporary editing data
  const [editingData, setEditingData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    bio: ''
  });

  const [eventFormData, setEventFormData] = useState({
    event_name: '',
    event_type: '',
    date: '',
    budget: '',
    guests: '',
    description: '',
    vendor_types: [] // New: array of needed vendor types
  });

  const [paymentFormData, setPaymentFormData] = useState({
    card_number: '',
    expiry_date: '',
    cvv: '',
    card_name: '',
    mpesa_number: ''
  });

  // Data from backend
  const [savedEvents, setSavedEvents] = useState([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    events_count: 0,
    payment_methods_count: 0,
    profile_complete: false,
    happy_moments: false
  });

  // New: Vendors data
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorServices, setVendorServices] = useState([]);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [inquiryFormData, setInquiryFormData] = useState({
    message: '',
    service_id: null
  });

  // API Configuration
  const API_BASE_URL = 'http://localhost:5555/api'; // Adjust to your backend URL
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    }
    return {
      "Content-Type": "application/json",
    };
  };
  

  // API Functions
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      setError(error.message);
      throw error;
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all dashboard data
      await Promise.all([
        loadProfile(),
        loadEvents(),
        loadPaymentMethods(),
        loadDashboardOverview(),
        loadVendors() // New: load vendors
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await apiCall('/profile');
      if (response.profile) {
        setProfileData(response.profile);
        if (response.profile.profile_image) {
          setProfileImage(response.profile.profile_image);
        }
      }
    } catch (error) {
      // Profile might not exist yet, which is fine
      console.log('No profile found');
    }
  };

  const loadEvents = async () => {
    try {
      const response = await apiCall('/events');
      setSavedEvents(response.events || []);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const response = await apiCall('/payment-methods');
      setSavedPaymentMethods(response.payment_methods || []);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
  };

  const loadDashboardOverview = async () => {
    try {
      const response = await apiCall('/overview');
      setDashboardStats(response.stats || {});
    } catch (error) {
      console.error('Failed to load dashboard overview:', error);
    }
  };

  // New: Load vendors
  const loadVendors = async () => {
    try {
      const response = await apiCall('/vendors');
      setVendors(response.vendors || []);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    }
  };

  // New: Load vendor services
  const loadVendorServices = async (vendorId) => {
    try {
      const response = await apiCall(`/vendor/services/${vendorId}`);
      setVendorServices(response.services || []);
    } catch (error) {
      console.error('Failed to load vendor services:', error);
    }
  };

  // Check if profile has any data
  const hasProfileData = () => {
    return Object.values(profileData).some(value => value && value.trim() !== '');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    if (isEditingProfile) {
      setEditingData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleEventInputChange = (field, value) => {
    setEventFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // New: Handle vendor types multi-select
  const toggleVendorType = (type) => {
    setEventFormData(prev => ({
      ...prev,
      vendor_types: prev.vendor_types.includes(type)
        ? prev.vendor_types.filter(t => t !== type)
        : [...prev.vendor_types, type]
    }));
  };

  const handlePaymentInputChange = (field, value) => {
    setPaymentFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Profile CRUD operations
  const saveProfile = async () => {
    setLoading(true);
    try {
      const dataToSave = isEditingProfile ? editingData : profileData;
      const profilePayload = {
        ...dataToSave,
        profile_image: profileImage
      };
      
      const response = await apiCall('/profile', {
        method: 'PUT',
        body: JSON.stringify(profilePayload)
      });
      
      setProfileData(response.profile);
      if (isEditingProfile) {
        setIsEditingProfile(false);
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
      
      // Reload dashboard stats
      await loadDashboardOverview();
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditingProfile = () => {
    setEditingData(profileData);
    setIsEditingProfile(true);
  };

  const cancelEditingProfile = () => {
    setEditingData(profileData);
    setIsEditingProfile(false);
  };

  const deleteProfileField = async (field) => {
    if (window.confirm(`Are you sure you want to delete your ${field}?`)) {
      try {
        const updatedProfile = { ...profileData, [field]: '' };
        await apiCall('/profile', {
          method: 'PUT',
          body: JSON.stringify(updatedProfile)
        });
        setProfileData(updatedProfile);
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    }
  };

  const deleteEntireProfile = async () => {
    if (window.confirm('Are you sure you want to delete your entire profile? This action cannot be undone.')) {
      try {
        const emptyProfile = {
          first_name: '',
          last_name: '',
          phone: '',
          location: '',
          bio: '',
          profile_image: ''
        };
        await apiCall('/profile', {
          method: 'PUT',
          body: JSON.stringify(emptyProfile)
        });
        setProfileData(emptyProfile);
        setProfileImage(null);
        setIsEditingProfile(false);
      } catch (error) {
        console.error('Failed to delete profile:', error);
      }
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiCall('/events', {
        method: 'POST',
        body: JSON.stringify(eventFormData)
      });
      
      setSavedEvents(prev => [...prev, response.event]);
      setShowEventForm(false);
      setEventFormData({
        event_name: '',
        event_type: '',
        date: '',
        budget: '',
        guests: '',
        description: '',
        vendor_types: []
      });
      
      // Reload dashboard stats
      await loadDashboardOverview();
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await apiCall(`/events/${eventId}`, {
          method: 'DELETE'
        });
        setSavedEvents(prev => prev.filter(event => event.id !== eventId));
        await loadDashboardOverview();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const paymentPayload = {
        method_type: paymentMethod,
        ...(paymentMethod === 'card' ? {
          card_number: paymentFormData.card_number,
          card_name: paymentFormData.card_name,
          expiry_date: paymentFormData.expiry_date
        } : {
          mpesa_number: paymentFormData.mpesa_number
        })
      };
      
      const response = await apiCall('/payment-methods', {
        method: 'POST',
        body: JSON.stringify(paymentPayload)
      });
      
      setSavedPaymentMethods(prev => [...prev, response.payment_method]);
      setShowPaymentForm(false);
      setPaymentFormData({
        card_number: '',
        expiry_date: '',
        cvv: '',
        card_name: '',
        mpesa_number: ''
      });
      
      // Reload dashboard stats
      await loadDashboardOverview();
    } catch (error) {
      console.error('Failed to add payment method:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentMethod = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await apiCall(`/payment-methods/${paymentId}`, {
          method: 'DELETE'
        });
        setSavedPaymentMethods(prev => prev.filter(payment => payment.id !== paymentId));
        await loadDashboardOverview();
      } catch (error) {
        console.error('Failed to delete payment method:', error);
      }
    }
  };

  // New: Handle vendor selection
  const handleViewVendor = async (vendor) => {
    setSelectedVendor(vendor);
    await loadVendorServices(vendor.id);
    setShowVendorDetails(true);
  };

  // New: Handle inquiry submit
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        vendor_id: selectedVendor.id,
        service_id: inquiryFormData.service_id,
        message: inquiryFormData.message
      };
      await apiCall('/inquiries', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setInquiryFormData({ message: '', service_id: null });
      setError(''); // Clear error
      alert('Inquiry sent successfully!');
    } catch (error) {
      console.error('Failed to send inquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', icon: <Sparkles className="w-5 h-5" />, label: 'Overview', color: '#D97B29' },
    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'My Profile', color: '#8FB996' },
    { id: 'events', icon: <Calendar className="w-5 h-5" />, label: 'My Events', color: '#E69D4F' },
    { id: 'vendors', icon: <Users className="w-5 h-5" />, label: 'Find Vendors', color: '#D97B29' },
    { id: 'payments', icon: <CreditCard className="w-5 h-5" />, label: 'Payments', color: '#8FB996' }
  ];

  const renderOverview = () => {
    const userName = profileData.first_name || 'Creative';
    
    return (
      <div className="space-y-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <X className="w-6 h-6 text-red-600" />
            <span className="font-semibold text-red-800">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Personalized Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl p-8" style={{ 
          background: 'linear-gradient(135deg, #D97B29 0%, #E69D4F 100%)' 
        }}>
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white mb-4">
              Welcome back, {userName}! ✨
            </h1>
            <p className="text-white/90 text-lg">
              {hasProfileData() 
                ? "Ready to bring another Pinterest vision to life?" 
                : "Let's get started with your creative journey!"
              }
            </p>
          </div>
          <div className="absolute top-4 right-4 text-4xl opacity-30 animate-bounce">🎨</div>
          <div className="absolute bottom-4 right-12 text-3xl opacity-20 animate-pulse">💐</div>
          <div className="absolute top-1/2 right-20 text-2xl opacity-25 animate-bounce" style={{ animationDelay: '1s' }}>✨</div>
        </div>

        {/* Personalized Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'Events Planned', value: dashboardStats.events_count?.toString() || '0', icon: '🎉', color: '#D97B29' },
            { label: 'Payment Methods', value: dashboardStats.payment_methods_count?.toString() || '0', icon: '💳', color: '#8FB996' },
            { label: 'Profile Complete', value: dashboardStats.profile_complete ? '✓' : '○', icon: '👤', color: '#E69D4F' },
            { label: 'Happy Moments', value: dashboardStats.happy_moments ? '💕' : '○', icon: '💫', color: '#D97B29' }
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
            onClick={() => setActiveSection('profile')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#3D2914' }}>
                  {hasProfileData() ? 'Update Profile' : 'Complete Profile'}
                </h3>
                <p className="text-sm" style={{ color: '#7A5C38' }}>
                  {hasProfileData() ? 'Manage your information' : 'Tell us about yourself'}
                </p>
              </div>
            </div>
            <p className="leading-relaxed mb-4" style={{ color: '#7A5C38' }}>
              {hasProfileData() 
                ? 'Update your profile information and preferences.'
                : 'Complete your profile to get personalized recommendations.'
              }
            </p>
            <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
              {hasProfileData() ? 'Manage Profile' : 'Complete Profile'} <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {savedEvents.length > 0 && (
          <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#3D2914' }}>Recent Activity</h3>
            <div className="space-y-4">
              {savedEvents.slice(-3).map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl">
                  <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: '#3D2914' }}>{event.event_name}</p>
                    <p className="text-sm" style={{ color: '#7A5C38' }}>
                      {event.event_type} • {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProfile = () => {
    const currentData = isEditingProfile ? editingData : profileData;
    
    if (!hasProfileData() && !isEditingProfile) {
      // Show form for new users
      return (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
            <h2 className="text-3xl font-black mb-8" style={{ color: '#3D2914' }}>
              Create Your Creative Profile
            </h2>
            
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
                      value={currentData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                      placeholder="Your first name"
                      style={{ color: '#3D2914' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Last Name</label>
                    <input
                      type="text"
                      value={currentData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                      placeholder="Your last name"
                      style={{ color: '#3D2914' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Phone</label>
                  <input
                    type="tel"
                    value={currentData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                    placeholder="+254 123 456 789"
                    style={{ color: '#3D2914' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Location</label>
                  <input
                    type="text"
                    value={currentData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                    placeholder="City, County"
                    style={{ color: '#3D2914' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>About You</label>
                  <textarea
                    value={currentData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows="4"
                    className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg resize-none"
                    placeholder="Tell us about your event style and what inspires you..."
                    style={{ color: '#3D2914' }}
                  />
                </div>

                <button 
                  onClick={saveProfile}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-2xl font-bold text-lg hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // Show saved profile with edit/delete options
    return (
      <div className="space-y-8">
        {/* Success Message */}
        {profileSaved && (
          <div className="bg-green-100 border-2 border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-green-800">Profile saved successfully!</span>
          </div>
        )}

        {/* Profile Header with Actions */}
        <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-3xl font-black" style={{ color: '#3D2914' }}>
              {isEditingProfile ? 'Edit Profile' : 'Your Creative Profile'}
            </h2>
            
            <div className="flex gap-3">
              {isEditingProfile ? (
                <>
                  <button 
                    onClick={saveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={cancelEditingProfile}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={startEditingProfile}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={deleteEntireProfile}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Profile
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
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
              {isEditingProfile && (
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-700 transition-colors shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Profile Information */}
            <div className="flex-1 space-y-6">
              {isEditingProfile ? (
                // Edit Mode
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>First Name</label>
                      <input
                        type="text"
                        value={currentData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                        style={{ color: '#3D2914' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Last Name</label>
                      <input
                        type="text"
                        value={currentData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                        style={{ color: '#3D2914' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Phone</label>
                    <input
                      type="tel"
                      value={currentData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                      style={{ color: '#3D2914' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Location</label>
                    <input
                      type="text"
                      value={currentData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                      style={{ color: '#3D2914' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>About You</label>
                    <textarea
                      value={currentData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows="4"
                      className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg resize-none"
                      style={{ color: '#3D2914' }}
                    />
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-orange-50 p-4 rounded-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <label className="block text-sm font-semibold" style={{ color: '#3D2914' }}>First Name</label>
                        <button 
                          onClick={() => deleteProfileField('first_name')}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-lg font-medium" style={{ color: '#3D2914' }}>
                        {profileData.first_name || 'Not provided'}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <label className="block text-sm font-semibold" style={{ color: '#3D2914' }}>Last Name</label>
                        <button 
                          onClick={() => deleteProfileField('last_name')}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-lg font-medium" style={{ color: '#3D2914' }}>
                        {profileData.last_name || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                      <label className="block text-sm font-semibold" style={{ color: '#3D2914' }}>Phone</label>
                      <button 
                        onClick={() => deleteProfileField('phone')}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-lg font-medium" style={{ color: '#3D2914' }}>
                      {profileData.phone || 'Not provided'}
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                      <label className="block text-sm font-semibold" style={{ color: '#3D2914' }}>Location</label>
                      <button 
                        onClick={() => deleteProfileField('location')}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-lg font-medium" style={{ color: '#3D2914' }}>
                      {profileData.location || 'Not provided'}
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                      <label className="block text-sm font-semibold" style={{ color: '#3D2914' }}>About You</label>
                      <button 
                        onClick={() => deleteProfileField('bio')}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-lg font-medium" style={{ color: '#3D2914' }}>
                      {profileData.bio || 'Not provided'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEvents = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black" style={{ color: '#3D2914' }}>My Events</h2>
        <button 
          onClick={() => setShowEventForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-2xl font-bold hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          New Event
        </button>
      </div>

      {savedEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border-2 border-orange-100 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#3D2914' }}>No events yet</h3>
          <p className="mb-6" style={{ color: '#7A5C38' }}>Start planning your first event to bring your Pinterest visions to life!</p>
          <button 
            onClick={() => setShowEventForm(true)}
            className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-2xl font-bold hover:transform hover:-translate-y-1 transition-all duration-300"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl p-6 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#3D2914' }}>{event.event_name}</h3>
                <button 
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-orange-600" />
                  </div>
                  <span style={{ color: '#7A5C38' }}>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-3 h-3 text-orange-600" />
                  </div>
                  <span style={{ color: '#7A5C38' }}>Budget: KSh {Number(event.budget).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-3 h-3 text-orange-600" />
                  </div>
                  <span style={{ color: '#7A5C38' }}>{event.guests} guests</span>
                </div>
              </div>
              {event.description && (
                <div className="mt-4 pt-4 border-t border-orange-100">
                  <p className="text-sm" style={{ color: '#7A5C38' }}>{event.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderVendors = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-black" style={{ color: '#3D2914' }}>Find Vendors</h2>
      
      {showVendorDetails ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
          <button onClick={() => setShowVendorDetails(false)} className="flex items-center gap-2 mb-4 text-orange-600">
            <ArrowLeft className="w-5 h-5" />
            Back to Vendors
          </button>
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#3D2914' }}>{selectedVendor.business_name}</h3>
          <p className="mb-4" style={{ color: '#7A5C38' }}>{selectedVendor.description}</p>
          <h4 className="text-xl font-bold mb-4" style={{ color: '#3D2914' }}>Services</h4>
          <div className="space-y-4">
            {vendorServices.map((service) => (
              <div key={service.id} className="p-4 bg-orange-50 rounded-2xl">
                <h5 className="font-semibold" style={{ color: '#3D2914' }}>{service.service_name}</h5>
                <p style={{ color: '#7A5C38' }}>KSh {service.price} - {service.duration}</p>
                <p style={{ color: '#7A5C38' }}>{service.description}</p>
                <button 
                  onClick={() => setInquiryFormData({ ...inquiryFormData, service_id: service.id })}
                  className="mt-2 bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                  Inquire
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleInquirySubmit} className="mt-6 space-y-4">
            <textarea
              value={inquiryFormData.message}
              onChange={(e) => setInquiryFormData({ ...inquiryFormData, message: e.target.value })}
              rows="4"
              className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors resize-none"
              placeholder="Your inquiry message..."
              style={{ color: '#3D2914' }}
            />
            <button 
              type="submit"
              disabled={loading || !inquiryFormData.message}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-2xl font-bold text-lg hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#3D2914' }}>Available Vendors</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="bg-orange-50 rounded-2xl p-6 text-center cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300 group" onClick={() => handleViewVendor(vendor)}>
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏪</div>
                  <h3 className="font-semibold" style={{ color: '#3D2914' }}>{vendor.business_name}</h3>
                  <p className="text-sm" style={{ color: '#7A5C38' }}>{vendor.service_type}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current text-orange-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black" style={{ color: '#3D2914' }}>Payment Methods</h2>
        <button 
          onClick={() => setShowPaymentForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-2xl font-bold hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Payment Method
        </button>
      </div>

      {savedPaymentMethods.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border-2 border-orange-100 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#3D2914' }}>No payment methods</h3>
          <p className="mb-6" style={{ color: '#7A5C38' }}>Add a payment method to make booking vendors easier!</p>
          <button 
            onClick={() => setShowPaymentForm(true)}
            className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-2xl font-bold hover:transform hover:-translate-y-1 transition-all duration-300"
          >
            Add Payment Method
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {savedPaymentMethods.map((payment) => (
            <div key={payment.id} className="bg-white rounded-3xl p-6 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: '#3D2914' }}>
                      {payment.method_type === 'card' ? 'Credit/Debit Card' : 'M-Pesa'}
                    </h3>
                    <p className="text-sm" style={{ color: '#7A5C38' }}>
                      Added {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => deletePaymentMethod(payment.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {payment.method_type === 'card' ? (
                <div className="space-y-2">
                  <p className="font-mono text-lg" style={{ color: '#3D2914' }}>{payment.card_number}</p>
                  <div className="flex justify-between">
                    <span style={{ color: '#7A5C38' }}>{payment.card_name}</span>
                    <span style={{ color: '#7A5C38' }}>Exp: {payment.expiry_date}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-mono text-lg" style={{ color: '#3D2914' }}>{payment.mpesa_number}</p>
                  <span style={{ color: '#7A5C38' }}>M-Pesa Mobile Money</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#3D2914' }}>Payment History</h3>
        <div className="space-y-4">
          {savedEvents.slice(0, 3).map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#3D2914' }}>Deposit for {event.event_name}</p>
                  <p className="text-sm" style={{ color: '#7A5C38' }}>
                    {new Date(event.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold" style={{ color: '#3D2914' }}>KSh {(event.budget * 0.3).toLocaleString()}</p>
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Modal Components
  const EventFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black" style={{ color: '#3D2914' }}>Plan New Event</h2>
          <button onClick={() => setShowEventForm(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleEventSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Event Name</label>
              <input
                type="text"
                value={eventFormData.event_name}
                onChange={(e) => handleEventInputChange('event_name', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                placeholder="e.g., Wedding, Birthday"
                required
                style={{ color: '#3D2914' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Event Type</label>
              <select
                value={eventFormData.event_type}
                onChange={(e) => handleEventInputChange('event_type', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                required
                style={{ color: '#3D2914' }}
              >
                <option value="">Select type</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="Baby Shower">Baby Shower</option>
                <option value="Corporate">Corporate Event</option>
                <option value="Graduation">Graduation</option>
                <option value="Other">Other</option>
              </select>
            </div>
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
                style={{ color: '#3D2914' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Budget (KSh)</label>
              <input
                type="number"
                value={eventFormData.budget}
                onChange={(e) => handleEventInputChange('budget', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                placeholder="50000"
                required
                style={{ color: '#3D2914' }}
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
              placeholder="50"
              required
              style={{ color: '#3D2914' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Description</label>
            <textarea
              value={eventFormData.description}
              onChange={(e) => handleEventInputChange('description', e.target.value)}
              rows="4"
              className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors resize-none"
              placeholder="Describe your event vision, theme, or any special requirements..."
              style={{ color: '#3D2914' }}
            />
          </div>

          {/* New: Vendor Types Needed */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Vendor Types Needed</label>
            <div className="grid md:grid-cols-3 gap-2">
              {['Photography', 'Catering', 'Decoration', 'Venue', 'Music & Entertainment', 'Event Planning', 'Flowers', 'Transportation'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleVendorType(type)}
                  className={`p-2 rounded-xl font-semibold transition-colors ${
                    eventFormData.vendor_types.includes(type) ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-2xl font-bold text-lg hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );

  const PaymentFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black" style={{ color: '#3D2914' }}>Add Payment Method</h2>
          <button onClick={() => setShowPaymentForm(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
              paymentMethod === 'card' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            Credit/Debit Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('mpesa')}
            className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
              paymentMethod === 'mpesa' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-green-100 text-green-800'
            }`}
          >
            M-Pesa
          </button>
        </div>
        
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          {paymentMethod === 'card' ? (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Card Number</label>
                <input
                  type="text"
                  value={paymentFormData.card_number}
                  onChange={(e) => handlePaymentInputChange('card_number', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                  placeholder="1234 5678 9012 3456"
                  required
                  style={{ color: '#3D2914' }}
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Expiry Date</label>
                  <input
                    type="text"
                    value={paymentFormData.expiry_date}
                    onChange={(e) => handlePaymentInputChange('expiry_date', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                    placeholder="MM/YY"
                    required
                    style={{ color: '#3D2914' }}
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
                    style={{ color: '#3D2914' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Card Name</label>
                  <input
                    type="text"
                    value={paymentFormData.card_name}
                    onChange={(e) => handlePaymentInputChange('card_name', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                    placeholder="John Doe"
                    required
                    style={{ color: '#3D2914' }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>M-Pesa Phone Number</label>
              <input
                type="tel"
                value={paymentFormData.mpesa_number}
                onChange={(e) => handlePaymentInputChange('mpesa_number', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                placeholder="2547XX XXX XXX"
                required
                style={{ color: '#3D2914' }}
              />
              <p className="text-sm mt-2" style={{ color: '#7A5C38' }}>
                We'll send a confirmation prompt to this number
              </p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full text-white py-4 rounded-2xl font-bold text-lg hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
              paymentMethod === 'card' 
                ? 'bg-gradient-to-r from-orange-600 to-orange-700' 
                : 'bg-gradient-to-r from-green-600 to-green-700'
            }`}
          >
            {loading ? 'Adding...' : 'Add Payment Method'}
          </button>
        </form>
      </div>
    </div>
  );

  if (loading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold" style={{ color: '#3D2914' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-orange-100 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center text-white font-black text-xl">
              K
            </div>
            <h1 className="text-2xl font-black" style={{ color: '#3D2914' }}>Kinsi</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl hover:bg-orange-50 transition-colors">
              <Bell className="w-6 h-6" style={{ color: '#7A5C38' }} />
            </button>
            <button className="p-2 rounded-xl hover:bg-orange-50 transition-colors">
              <Settings className="w-6 h-6" style={{ color: '#7A5C38' }} />
            </button>
            <LogoutButton />

          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-3xl p-6 border-2 border-orange-100 sticky top-8">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-300 ${
                        activeSection === item.id
                          ? 'text-white shadow-lg'
                          : 'text-gray-700 hover:bg-orange-50'
                      }`}
                      style={{
                        backgroundColor: activeSection === item.id ? item.color : 'transparent'
                      }}
                    >
                      {item.icon}
                      <span className="font-semibold">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl">
                <h3 className="font-bold mb-2" style={{ color: '#3D2914' }}>Need help?</h3>
                <p className="text-sm mb-3" style={{ color: '#7A5C38' }}>Our team is here to assist you</p>
                <button className="w-full bg-orange-600 text-white py-2 rounded-xl font-semibold hover:bg-orange-700 transition-colors">
                  Contact Support
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeSection === 'overview' && renderOverview()}
            {activeSection === 'profile' && renderProfile()}
            {activeSection === 'events' && renderEvents()}
            {activeSection === 'vendors' && renderVendors()}
            {activeSection === 'payments' && renderPayments()}
          </main>
        </div>
      </div>

      {/* Modals */}
      {showEventForm && <EventFormModal />}
      {showPaymentForm && <PaymentFormModal />}
    </div>
  );
};

export default KinsiDashboard;