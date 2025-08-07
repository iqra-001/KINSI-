
import logo from '../assets/logo2.png';
import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Users, Calendar, Heart, MessageCircle, Menu, X } from 'lucide-react';

const KinsiLandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-white" />,
      title: "Pinterest to Reality",
      description: "Transform your Pinterest boards into stunning real-life events with our expert planning team."
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Local Vendors",
      description: "Connect with curated local vendors who understand your vision and deliver exceptional quality."
    },
    {
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: "Seamless Planning",
      description: "From concept to celebration, we handle every detail to make your dream event come alive."
    }
  ];

  const moodItems = ['🌸', '✨', '🎨', '🌿', '💐', '🕯️'];
  const steps = [
    {
      number: "01",
      title: "Share Your Vision",
      description: "Upload your Pinterest boards and tell us about your dream event"
    },
    {
      number: "02", 
      title: "Get Matched",
      description: "We connect you with local vendors who align with your style"
    },
    {
      number: "03",
      title: "Bring It to Life", 
      description: "Watch your Pinterest vision transform into an unforgettable event"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" style={{
      background: 'linear-gradient(135deg, #F5F1E8 0%, #E8E0D4 100%)'
    }}>
      {/* Navigation */}
      {/* Navigation */}
<nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
  isScrolled 
    ? 'bg-amber-50/95 backdrop-blur-lg shadow-lg border-b border-amber-900/10' 
    : 'bg-transparent'
}`}>
  <div className="max-w-6xl mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      <a href="#" className="flex items-center hover:opacity-80 transition-opacity">
        <img 
          src="/src/assets/logo2.png" 
          alt="KINSI - Event Planning" 
          className="h-20 w-auto"
        />
      </a>
      
      <div className={`md:flex items-center space-x-8 ${
        isMobileMenuOpen ? 'flex absolute top-16 left-0 right-0 bg-amber-50/95 backdrop-blur-lg p-6 flex-col space-y-4 shadow-lg rounded-b-2xl' : 'hidden'
      }`}>
        <a href="#vendors" className={`font-medium hover:text-orange-500 transition-all duration-300 relative group ${
          isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
        }`}>
          Local Vendors
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#about" className={`font-medium hover:text-orange-500 transition-all duration-300 relative group ${
          isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
        }`}>
          About Us
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#contact" className={`font-medium hover:text-orange-500 transition-all duration-300 relative group ${
          isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
        }`}>
          Contact
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a 
          href="#signup" 
          className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 hover:transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#FF8A47' }}
        >
          Sign Up
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
      <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-300 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-fade-in-left">
            <h1 className="text-5xl md:text-6xl font-black leading-tight" style={{ color: '#3D2914' }}>
              Bring Your
              <span className="bg-gradient-to-r from-orange-500 to-green-400 bg-clip-text text-transparent block">
                Pinterest Visions
              </span>
              to Life
            </h1>
            
            <p className="text-xl font-medium" style={{ color: '#8B6F47' }}>
              The Event Planning Revolution You've Been Waiting For
            </p>
            
            <p className="text-lg leading-relaxed opacity-90" style={{ color: '#3D2914' }}>
              KINSI bridges the gap between your Pinterest dreams and reality. 
              We connect you with local vendors and expert planners who understand 
              your aesthetic and bring your vision board to life, one event at a time.
            </p>
            
            <button 
              className="group inline-flex items-center gap-3 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:transform hover:-translate-y-2 shadow-xl hover:shadow-2xl relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, #FF8A47 0%, #FF6B2B 100%)',
                boxShadow: '0 8px 30px rgba(255, 138, 71, 0.3)'
              }}
            >
              <span className="relative z-10">Start Planning Your Dream Event</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>

          <div className="relative animate-fade-in-right">
            {/* Vision Board */}
            <div 
              className="bg-white p-8 rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 relative border-4"
              style={{ 
                borderColor: 'rgba(168, 213, 168, 0.3)',
                animation: 'float 6s ease-in-out infinite'
              }}
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-green-200 to-orange-200 rounded-3xl opacity-20 -z-10"></div>
              
              <h3 className="text-2xl font-bold text-center mb-6" style={{ color: '#3D2914' }}>
                Your Vision Board
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {moodItems.map((item, index) => (
                  <div 
                    key={index}
                    className="aspect-square bg-gradient-to-br from-green-200 to-amber-100 rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform duration-300 animate-pulse"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between text-center">
                <div>
                  <div className="text-2xl font-black" style={{ color: '#FF8A47' }}>500+</div>
                  <div className="text-sm" style={{ color: '#8B6F47' }}>Events Planned</div>
                </div>
                <div>
                  <div className="text-2xl font-black" style={{ color: '#FF8A47' }}>98%</div>
                  <div className="text-sm" style={{ color: '#8B6F47' }}>Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-black" style={{ color: '#FF8A47' }}>200+</div>
                  <div className="text-sm" style={{ color: '#8B6F47' }}>Vendors</div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>💕</div>
            <div className="absolute top-1/2 -left-6 text-4xl animate-bounce" style={{ animationDelay: '1s' }}>✨</div>
            <div className="absolute -bottom-4 right-8 text-4xl animate-bounce" style={{ animationDelay: '2s' }}>🌿</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16 animate-fade-in-up" style={{ color: '#3D2914' }}>
            Why Choose KINSI?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-3xl text-center transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-2xl border border-green-200 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div 
                  className="w-20 h-20 bg-gradient-to-r from-orange-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #FF8A47, #A8D5A8)' }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#3D2914' }}>
                  {feature.title}
                </h3>
                <p className="leading-relaxed" style={{ color: '#8B6F47' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #E8E0D4 100%)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16" style={{ color: '#3D2914' }}>
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div 
                  className="w-16 h-16 bg-gradient-to-r from-orange-500 to-green-400 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'linear-gradient(135deg, #FF8A47, #A8D5A8)' }}
                >
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#3D2914' }}>
                  {step.title}
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#8B6F47' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center text-amber-50" style={{ backgroundColor: '#3D2914' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-black mb-6">
            Ready to Make Your Vision Reality?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Join thousands of satisfied clients who trusted KINSI with their special moments
          </p>
          <button className="inline-flex items-center gap-3 bg-white text-amber-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-50 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl">
            Get Started Today
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Chatbot */}
      <div className="fixed bottom-24 right-8 z-50">
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
          <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-green-200 animate-slide-up">
            <div className="bg-amber-900 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <h4 className="font-semibold">Chat with KINSI</h4>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 h-48 overflow-y-auto">
              <div className="bg-gradient-to-br from-green-200 to-amber-100 p-3 rounded-2xl text-sm leading-relaxed mb-4">
                Hi! 👋 I'm here to help you plan your dream event. What's your vision?
              </div>
            </div>
            <div className="p-4 border-t border-green-200 flex gap-2">
              <input 
                type="text" 
                placeholder="Type your message..." 
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
                <li><a href="#" className="hover:text-orange-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Contact</a></li>
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
            <p>&copy; 2024 KINSI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: rotate(-5deg) translateY(0px); }
          50% { transform: rotate(-5deg) translateY(-10px); }
        }
        
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-left { animation: fade-in-left 1s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default KinsiLandingPage;
