import React, { useState, useEffect } from 'react';
import { 
  User, Store, BarChart3, Bell, Settings, LogOut, 
  Camera, Edit3, Plus, X, Star, Heart, MessageCircle,
  Package, DollarSign, Users, Calendar, TrendingUp,
  Eye, Clock, CheckCircle, Upload, MapPin, Phone,
  Mail, Award, ChevronRight, Filter, Send, ExternalLink,
  ImageIcon, Trash2, Edit, AlertCircle, Sparkles,
  ShoppingBag, Target, Zap, Briefcase, Loader
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from './LogOutButton';
const VendorDashboard = () => {
  // State management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [profileImage, setProfileImage] = useState(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock user ID - in real app, this would come from authentication
  const [currentUserId] = useState(1);
  const [vendorId, setVendorId] = useState(null);

  const [notifications, setNotifications] = useState([]); // Updated: dynamic notifications

  const [vendorProfile, setVendorProfile] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    description: '',
    experience: '',
    website: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  });

  const [serviceFormData, setServiceFormData] = useState({
    serviceName: '',
    category: '',
    price: '',
    duration: '',
    description: '',
    features: ['']
  });

  const [services, setServices] = useState([]);
  const [vendorStats, setVendorStats] = useState({
    total_services: 0,
    total_views: 0,
    total_inquiries: 0,
    total_bookings: 0
  });

  // API Base URL - adjust this to match your Flask server
  const API_BASE_URL = 'http://localhost:5555/api';

  // API utility functions
  const apiCall = async (endpoint, options = {}) => {
    try {
      const token = sessionStorage.getItem("access_token"); // or localStorage
  
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}), // attach token if it exists
          ...options.headers
        },
        ...options
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "API call failed");
      }
  
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };
  
  // Load vendor profile and data on component mount
  useEffect(() => {
    loadVendorData();
  }, [currentUserId]);

  const loadVendorData = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      // Load vendor profile
      const vendorData = await apiCall(`/vendor/profile`);
      if (vendorData) {
        setVendorId(vendorData.id);
        setVendorProfile({
          businessName: vendorData.business_name || '',
          ownerName: vendorData.owner_name || '',
          email: vendorData.email || '',
          phone: vendorData.contact_phone || '',
          address: vendorData.address || '',
          category: vendorData.service_type || '',
          description: vendorData.description || '',
          experience: vendorData.experience || '',
          website: vendorData.website || '',
          socialMedia: {
            instagram: vendorData.instagram || '',
            facebook: vendorData.facebook || '',
            twitter: vendorData.twitter || ''
          }
        });

        // Load services
        await loadVendorServices(vendorData.id);
        
        // Load stats
        await loadVendorStats(vendorData.id);
        
        // New: Load notifications
        await loadNotifications(vendorData.id);
      }
    } catch (error) {
      console.log('No existing vendor profile found');
    } finally {
      setLoading(false);
    }
  };

  const loadVendorServices = async (vendorId) => {
    try {
      const servicesData = await apiCall(`/vendor/services/${vendorId}`);
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadVendorStats = async (vendorId) => {
    try {
      const statsData = await apiCall(`/vendor/stats/${vendorId}`);
      setVendorStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // New: Load notifications/alerts
  const loadNotifications = async (vendorId) => {
    try {
      const notifs = await apiCall(`/vendor/notifications/${vendorId}`);
      setNotifications(notifs.notifications || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setVendorProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setVendorProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const saveVendorProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const profileData = {
        user_id: currentUserId,
        business_name: vendorProfile.businessName,
        service_type: vendorProfile.category,
        description: vendorProfile.description,
        contact_phone: vendorProfile.phone,
        address: vendorProfile.address,
        owner_name: vendorProfile.ownerName,
        email: vendorProfile.email,
        experience: vendorProfile.experience,
        website: vendorProfile.website,
        instagram: vendorProfile.socialMedia.instagram,
        facebook: vendorProfile.socialMedia.facebook,
        twitter: vendorProfile.socialMedia.twitter
      };

      const result = await apiCall('/vendor/profile', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });

      if (result.vendor_id) {
        setVendorId(result.vendor_id);
      }

      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError('Error saving profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceInputChange = (field, value) => {
    setServiceFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    
    if (!vendorId) {
      setError('Please save your vendor profile first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const serviceData = {
        vendor_id: vendorId,
        service_name: serviceFormData.serviceName,
        category: serviceFormData.category,
        price: parseFloat(serviceFormData.price),
        duration: serviceFormData.duration,
        description: serviceFormData.description,
        features: serviceFormData.features.filter(f => f.trim() !== '')
      };

      await apiCall('/vendor/services', {
        method: 'POST',
        body: JSON.stringify(serviceData)
      });

      // Reload services and stats
      await loadVendorServices(vendorId);
      await loadVendorStats(vendorId);

      setShowServiceForm(false);
      // Reset form
      setServiceFormData({
        serviceName: '',
        category: '',
        price: '',
        duration: '',
        description: '',
        features: ['']
      });

      setSuccess('Service added successfully!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      setError('Error adding service: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    setServiceFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index, value) => {
    setServiceFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index) => {
    if (serviceFormData.features.length > 1) {
      setServiceFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: <BarChart3 className="w-5 h-5" />, label: 'Dashboard', color: '#D97B29' },
    { id: 'profile', icon: <Store className="w-5 h-5" />, label: 'Business Profile', color: '#8FB996' },
    { id: 'services', icon: <Package className="w-5 h-5" />, label: 'My Services', color: '#E69D4F' },
    { id: 'sales', icon: <DollarSign className="w-5 h-5" />, label: 'Sales & Analytics', color: '#D97B29' },
    { id: 'customers', icon: <Users className="w-5 h-5" />, label: 'Customer Requests', color: '#8FB996' }
  ];

  // Error/Success notification component
  const Notification = () => {
    if (!error && !success) return null;

    return (
      <div className={`fixed top-4 right-4 p-4 rounded-2xl z-50 ${
        error ? 'bg-red-100 border-red-200 text-red-800' : 'bg-green-100 border-green-200 text-green-800'
      } border-2`}>
        <div className="flex items-center gap-2">
          {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span className="font-semibold">{error || success}</span>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl p-8" style={{ 
        background: 'linear-gradient(135deg, #8FB996 0%, #A8D5A8 100%)' 
      }}>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white mb-4">
            Welcome to Your Vendor Hub!
          </h1>
          <p className="text-white/90 text-lg">
            Manage your business, connect with customers, and grow your services
          </p>
        </div>
        <div className="absolute top-4 right-4 text-4xl opacity-30 animate-bounce">📈</div>
        <div className="absolute bottom-4 right-12 text-3xl opacity-20 animate-pulse">💼</div>
        <div className="absolute top-1/2 right-20 text-2xl opacity-25 animate-bounce" style={{ animationDelay: '1s' }}>⭐</div>
      </div>

      {/* Key Metrics */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        {[
          { 
            label: 'Total Services', 
            value: vendorStats.total_services.toString(), 
            icon: <Package className="w-6 h-6" />, 
            color: '#D97B29',
            trend: '+0%',
            trendUp: true
          },
          { 
            label: 'Total Views', 
            value: vendorStats.total_views.toString(), 
            icon: <Eye className="w-6 h-6" />, 
            color: '#8FB996',
            trend: '+0%',
            trendUp: true
          },
          { 
            label: 'Total Inquiries', 
            value: vendorStats.total_inquiries.toString(), 
            icon: <MessageCircle className="w-6 h-6" />, 
            color: '#E69D4F',
            trend: '+0%',
            trendUp: true
          },
          { 
            label: 'Total Bookings', 
            value: vendorStats.total_bookings.toString(), 
            icon: <CheckCircle className="w-6 h-6" />, 
            color: '#D97B29',
            trend: '+0%',
            trendUp: true
          }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 hover:transform hover:-translate-y-2 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform" style={{ backgroundColor: metric.color }}>
                {metric.icon}
              </div>
              <div className={`text-sm font-semibold ${metric.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                {metric.trend}
              </div>
            </div>
            <div className="text-3xl font-black mb-1" style={{ color: metric.color }}>{metric.value}</div>
            <div className="text-sm font-medium" style={{ color: '#7A5C38' }}>{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div 
          className="bg-white rounded-3xl p-6 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 cursor-pointer group hover:transform hover:-translate-y-1"
          onClick={() => vendorId ? setShowServiceForm(true) : setActiveSection('profile')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#3D2914' }}>
                {vendorId ? 'Add New Service' : 'Complete Profile'}
              </h3>
              <p className="text-sm" style={{ color: '#7A5C38' }}>
                {vendorId ? 'Expand your offerings' : 'Set up your business first'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all">
            {vendorId ? 'Create Service' : 'Setup Profile'} <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          className="bg-white rounded-3xl p-6 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 cursor-pointer group hover:transform hover:-translate-y-1"
          onClick={() => setActiveSection('profile')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#3D2914' }}>Update Profile</h3>
              <p className="text-sm" style={{ color: '#7A5C38' }}>Keep info current</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
            Edit Profile <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          className="bg-white rounded-3xl p-6 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 cursor-pointer group hover:transform hover:-translate-y-1"
          onClick={() => setActiveSection('services')}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#3D2914' }}>View Services</h3>
              <p className="text-sm" style={{ color: '#7A5C38' }}>Manage offerings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
            View Services <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#3D2914' }}>Recent Services</h3>
        {services.length > 0 ? (
          <div className="space-y-4">
            {services.slice(0, 5).map((service) => (
              <div key={service.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-2xl">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: '#3D2914' }}>{service.service_name}</p>
                  <p className="text-sm" style={{ color: '#7A5C38' }}>
                    {service.category} • Ksh {service.price} • {service.views} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-20">📊</div>
            <p className="text-lg" style={{ color: '#7A5C38' }}>No services added yet</p>
            <p className="text-sm mt-2" style={{ color: '#7A5C38' }}>
              {vendorId ? 'Add your first service to get started' : 'Complete your profile to add services'}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
        <h2 className="text-3xl font-black mb-8" style={{ color: '#3D2914' }}>
          Business Profile
        </h2>
        
        {/* Business Image and Basic Info */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="relative group">
            <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-orange-200 group-hover:border-orange-300 transition-colors">
              {profileImage ? (
                <img src={profileImage} alt="Business" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                  <Store className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-700 transition-colors shadow-lg">
              <Camera className="w-6 h-6 text-white" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Business Name</label>
                <input
                  type="text"
                  value={vendorProfile.businessName}
                  onChange={(e) => handleProfileChange('businessName', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                  placeholder="Your business name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Owner Name</label>
                <input
                  type="text"
                  value={vendorProfile.ownerName}
                  onChange={(e) => handleProfileChange('ownerName', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Email</label>
                <input
                  type="email"
                  value={vendorProfile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                  placeholder="business@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Phone</label>
                <input
                  type="tel"
                  value={vendorProfile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                  placeholder="+254 XXX XXX XXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Business Address</label>
              <input
                type="text"
                value={vendorProfile.address}
                onChange={(e) => handleProfileChange('address', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                placeholder="Full business address"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Service Category</label>
                <select
                  value={vendorProfile.category}
                  onChange={(e) => handleProfileChange('category', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                  style={{ color: '#3D2914' }}
                >
                  <option value="">Select category</option>
                  <option value="photography">Photography</option>
                  <option value="catering">Catering</option>
                  <option value="decoration">Decoration</option>
                  <option value="venue">Venue</option>
                  <option value="music">Music & Entertainment</option>
                  <option value="planning">Event Planning</option>
                  <option value="flowers">Flowers</option>
                  <option value="transport">Transportation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Years of Experience</label>
                <input
                  type="number"
                  value={vendorProfile.experience}
                  onChange={(e) => handleProfileChange('experience', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                  placeholder="Years in business"
                  style={{ color: '#3D2914' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Business Description</label>
              <textarea
                value={vendorProfile.description}
                onChange={(e) => handleProfileChange('description', e.target.value)}
                rows="4"
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg resize-none"
                placeholder="Tell customers about your business, specialties, and what makes you unique..."
                style={{ color: '#3D2914' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Website (Optional)</label>
              <input
                type="url"
                value={vendorProfile.website}
                onChange={(e) => handleProfileChange('website', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors text-lg"
                placeholder="https://yourbusiness.com"
                style={{ color: '#3D2914' }}
              />
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-bold mb-4" style={{ color: '#3D2914' }}>Social Media (Optional)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={vendorProfile.socialMedia.instagram}
                  onChange={(e) => handleProfileChange('socialMedia.instagram', e.target.value)}
                  className="p-3 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                  placeholder="Instagram handle"
                  style={{ color: '#3D2914' }}
                />
                <input
                  type="text"
                  value={vendorProfile.socialMedia.facebook}
                  onChange={(e) => handleProfileChange('socialMedia.facebook', e.target.value)}
                  className="p-3 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                  placeholder="Facebook page"
                  style={{ color: '#3D2914' }}
                />
                <input
                  type="text"
                  value={vendorProfile.socialMedia.twitter}
                  onChange={(e) => handleProfileChange('socialMedia.twitter', e.target.value)}
                  className="p-3 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                  placeholder="Twitter handle"
                  style={{ color: '#3D2914' }}
                />
              </div>
            </div>

            <button 
              onClick={saveVendorProfile}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-2xl font-bold text-lg hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : null}
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black" style={{ color: '#3D2914' }}>
          My Services
        </h2>
        <button 
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-full font-semibold hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg disabled:opacity-50"
          onClick={() => vendorId ? setShowServiceForm(true) : setActiveSection('profile')}
          disabled={!vendorId}
        >
          <Plus className="w-5 h-5" />
          {vendorId ? 'Add Service' : 'Complete Profile First'}
        </button>
      </div>

      {!vendorId && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-bold text-yellow-800">Complete Your Profile First</h3>
          </div>
          <p className="text-yellow-700 mb-4">You need to save your vendor profile before you can add services.</p>
          <button 
            className="bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-yellow-700 transition-colors"
            onClick={() => setActiveSection('profile')}
          >
            Go to Profile
          </button>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Services */}
        <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#3D2914' }}>Active Services ({services.length})</h3>
          {services.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {services.map((service) => (
                <div key={service.id} className="p-4 border-2 border-orange-100 rounded-2xl hover:border-orange-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold" style={{ color: '#3D2914' }}>{service.service_name}</h4>
                    <span className="text-lg font-bold" style={{ color: '#D97B29' }}>Ksh {service.price}</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#7A5C38' }}>{service.category}</p>
                  <p className="text-xs mb-3" style={{ color: '#7A5C38' }}>{service.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {service.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {service.inquiries} inquiries
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {service.bookings} bookings
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-20">📦</div>
              <p className="text-lg" style={{ color: '#7A5C38' }}>No services added yet</p>
              <p className="text-sm mt-2" style={{ color: '#7A5C38' }}>Add your first service to get started!</p>
              {vendorId && (
                <button 
                  className="mt-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-full font-semibold hover:transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => setShowServiceForm(true)}
                >
                  Add First Service
                </button>
              )}
            </div>
          )}
        </div>

        {/* Service Performance */}
        <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#3D2914' }}>Service Performance</h3>
          <div className="space-y-4">
            {[
              { 
                label: 'Most Popular', 
                value: services.length > 0 ? services.sort((a, b) => b.views - a.views)[0]?.service_name || 'None yet' : 'None yet', 
                icon: '🌟' 
              },
              { label: 'Total Views', value: vendorStats.total_views.toString(), icon: '👀' },
              { label: 'Inquiries', value: vendorStats.total_inquiries.toString(), icon: '💬' },
              { label: 'Bookings', value: vendorStats.total_bookings.toString(), icon: '✅' }
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl">
                <div className="text-2xl">{stat.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: '#3D2914' }}>{stat.label}</p>
                  <p className="text-lg font-bold" style={{ color: '#D97B29' }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-black" style={{ color: '#3D2914' }}>
        Sales & Analytics
      </h2>

      {/* Revenue Overview */}
      <div className="grid lg:grid-cols-4 gap-6">
        {[
          { title: 'This Month', amount: 'Ksh 0', change: '+0%', color: '#D97B29' },
          { title: 'Last Month', amount: 'Ksh 0', change: '+0%', color: '#8FB996' },
          { title: 'Total Earnings', amount: 'Ksh 0', change: '+0%', color: '#E69D4F' },
        ].map((revenue, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border-2 border-orange-100">
            <h4 className="text-sm font-medium mb-2" style={{ color: '#7A5C38' }}>{revenue.title}</h4>
            <p className="text-2xl font-black mb-1" style={{ color: revenue.color }}>{revenue.amount}</p>
            <p className="text-sm text-green-600">{revenue.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#3D2914' }}>Monthly Revenue</h3>
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-20">📈</div>
            <p className="text-lg" style={{ color: '#7A5C38' }}>Revenue chart will appear here</p>
            <p className="text-sm mt-2" style={{ color: '#7A5C38' }}>Start earning to see your analytics</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#3D2914' }}>Service Breakdown</h3>
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-20">📊</div>
            <p className="text-lg" style={{ color: '#7A5C38' }}>Service analytics will appear here</p>
            <p className="text-sm mt-2" style={{ color: '#7A5C38' }}>Add services to see breakdown</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-black" style={{ color: '#3D2914' }}>
        Customer Requests
      </h2>

      {/* Request Status */}
      <div className="grid lg:grid-cols-4 gap-6">
        {[
          { status: 'New Requests', count: notifications.filter(n => n.type === 'inquiry' && !n.read).length.toString(), color: '#D97B29', icon: <MessageCircle className="w-6 h-6" /> },
          { status: 'In Progress', count: '0', color: '#8FB996', icon: <Clock className="w-6 h-6" /> },
          { status: 'Completed', count: notifications.filter(n => n.type === 'booking').length.toString(), color: '#E69D4F', icon: <CheckCircle className="w-6 h-6" /> },
          { status: 'Favorites', count: notifications.filter(n => n.type === 'favorite').length.toString(), color: '#D97B29', icon: <Heart className="w-6 h-6" /> }
        ].map((request, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border-2 border-orange-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: request.color }}>
                {request.icon}
              </div>
              <h4 className="font-semibold" style={{ color: '#3D2914' }}>{request.status}</h4>
            </div>
            <p className="text-3xl font-black" style={{ color: request.color }}>{request.count}</p>
          </div>
        ))}
      </div>

      {/* Customer Inquiries */}
      <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold" style={{ color: '#3D2914' }}>Recent Inquiries</h3>
          <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center gap-4 p-4 border-2 border-orange-100 rounded-2xl hover:border-orange-200 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  notification.type === 'inquiry' ? 'bg-blue-600' : 
                  notification.type === 'favorite' ? 'bg-pink-600' : 'bg-green-600'
                }`}>
                  {notification.type === 'inquiry' ? <MessageCircle className="w-5 h-5" /> :
                   notification.type === 'favorite' ? <Heart className="w-5 h-5" /> :
                   <CheckCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: '#3D2914' }}>{notification.message}</p>
                  <p className="text-sm" style={{ color: '#7A5C38' }}>{notification.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  )}
                  <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:transform hover:-translate-y-1 transition-all duration-300">
                    Respond
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-20">👥</div>
            <p className="text-lg" style={{ color: '#7A5C38' }}>No customer requests yet</p>
            <p className="text-sm mt-2" style={{ color: '#7A5C38' }}>Customer inquiries will appear here once you start receiving them</p>
          </div>
        )}
      </div>
    </div>
  );

  // Service Form Modal
  const renderServiceForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black" style={{ color: '#3D2914' }}>Add New Service</h2>
          <button 
            onClick={() => setShowServiceForm(false)}
            className="p-2 rounded-full hover:bg-orange-100 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#3D2914' }} />
          </button>
        </div>
        
        <form onSubmit={handleServiceSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Service Name</label>
            <input
              type="text"
              value={serviceFormData.serviceName}
              onChange={(e) => handleServiceInputChange('serviceName', e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
              placeholder="e.g., Wedding Photography Package"
              style={{ color: '#3D2914' }}
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Category</label>
              <select
                value={serviceFormData.category}
                onChange={(e) => handleServiceInputChange('category', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                style={{ color: '#3D2914' }}
                required
              >
                <option value="">Select category</option>
                <option value="Photography">Photography</option>
                <option value="Catering">Catering</option>
                <option value="Decoration">Decoration</option>
                <option value="Venue">Venue</option>
                <option value="Music & Entertainment">Music & Entertainment</option>
                <option value="Event Planning">Event Planning</option>
                <option value="Flowers">Flowers</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Price (Ksh)</label>
              <input
                type="number"
                value={serviceFormData.price}
                onChange={(e) => handleServiceInputChange('price', e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                placeholder="Service price"
                style={{ color: '#3D2914' }}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Duration</label>
            <input
              type="text"
              value={serviceFormData.duration}
              onChange={(e) => handleServiceInputChange('duration', e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
              placeholder="e.g., 8 hours, 2 days, etc."
              style={{ color: '#3D2914' }}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#3D2914' }}>Service Description</label>
            <textarea
              value={serviceFormData.description}
              onChange={(e) => handleServiceInputChange('description', e.target.value)}
              rows="4"
              className="w-full p-4 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors resize-none"
              placeholder="Describe your service, what's included, and what makes it special..."
              style={{ color: '#3D2914' }}
              required
            />
          </div>

          {/* Service Features */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold" style={{ color: '#3D2914' }}>Service Features</label>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Feature
              </button>
            </div>
            <div className="space-y-3">
              {serviceFormData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 p-3 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none transition-colors"
                    placeholder={`Feature ${index + 1}`}
                    style={{ color: '#3D2914' }}
                  />
                  {serviceFormData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-2xl font-bold text-lg hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Adding Service...' : 'Add Service'}
          </button>
        </form>
      </div>
    </div>
  );

  // Notification Panel
  const renderNotificationPanel = () => (
    <div className="fixed top-16 right-6 bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-orange-100 shadow-2xl z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold" style={{ color: '#3D2914' }}>Notifications</h3>
        <button 
          onClick={() => setShowNotificationPanel(false)}
          className="p-1 rounded-full hover:bg-orange-100 transition-colors"
        >
          <X className="w-4 h-4" style={{ color: '#3D2914' }} />
        </button>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className={`p-3 rounded-2xl ${notification.read ? 'bg-gray-50' : 'bg-orange-50'}`}>
            <p className="text-sm font-medium" style={{ color: '#3D2914' }}>{notification.message}</p>
            <p className="text-xs mt-1" style={{ color: '#7A5C38' }}>{notification.time}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading && !vendorId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5EBDA 0%, #E8D9C0 100%)' }}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#D97B29' }} />
          <p className="text-xl font-semibold" style={{ color: '#3D2914' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #F5EBDA 0%, #E8D9C0 100%)' }}
    >
      {/* Notification Component */}
      <Notification />

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-400 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black" style={{ color: '#3D2914' }}>KINSI Vendor</h1>
                <p className="text-sm" style={{ color: '#7A5C38' }}>
                  {vendorProfile.businessName || 'Your business dashboard'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  className="p-2 rounded-full hover:bg-orange-100 transition-colors relative"
                  onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                >
                  <Bell className="w-5 h-5" style={{ color: '#7A5C38' }} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{notifications.filter(n => !n.read).length}</span>
                    </div>
                  )}
                </button>
                {showNotificationPanel && renderNotificationPanel()}
              </div>
              <LogoutButton />
              <button
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200"
                onClick={() => setActiveSection('profile')}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 hover:transform hover:translate-x-2 ${
                      activeSection === item.id
                        ? 'text-white shadow-lg'
                        : 'hover:bg-orange-50'
                    }`}
                    style={{
                      backgroundColor: activeSection === item.id ? item.color : 'transparent',
                      color: activeSection === item.id ? 'white' : '#3D2914'
                    }}
                  >
                    <div className={`transition-colors ${
                      activeSection === item.id ? 'text-white' : ''
                    }`}>
                      {item.icon}
                    </div>
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Vendor Support */}
              <div className="mt-8 pt-6 border-t border-orange-200">
                <p className="text-sm font-semibold mb-3" style={{ color: '#3D2914' }}>Vendor Support</p>
                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-2xl font-semibold hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg text-sm">
                  Get Help
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border-2 border-orange-100 min-h-[80vh]">
              {activeSection === 'dashboard' && renderDashboard()}
              {activeSection === 'profile' && renderProfile()}
              {activeSection === 'services' && renderServices()}
              {activeSection === 'sales' && renderSales()}
              {activeSection === 'customers' && renderCustomers()}
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed bottom-8 right-8 pointer-events-none">
        <div className="text-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}>🏪</div>
      </div>
      <div className="fixed top-1/3 right-12 pointer-events-none">
        <div className="text-2xl opacity-20 animate-bounce" style={{ animationDelay: '2s' }}>📈</div>
      </div>

      {/* Modals */}
      {showServiceForm && renderServiceForm()}
    </div>
  );
};

export default VendorDashboard;