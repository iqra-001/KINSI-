import React, { useState, useEffect } from 'react';
import logo from '../assets/logo2.png';

import { 
  Heart, Star, 
  Users, 
  Target, 
  Award, 
  Sparkles,
  MessageCircle,
  X,
  ChevronRight,
  MapPin,
  Calendar,
  Palette} from 'lucide-react';

const AboutUsPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleNavigation = (path) => {
    // Navigation logic here
    console.log(`Navigate to: ${path}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & Creative Director",
      image: "👩‍💼",
      bio: "Former Pinterest designer with 8+ years in event planning. Sarah's vision brought KINSI to life.",
      specialty: "Vision Translation"
    },
    {
      name: "Marcus Chen", 
      role: "Tech Lead",
      image: "👨‍💻",
      bio: "AI specialist who built our smart planning assistant. Makes complex planning feel effortless.",
      specialty: "AI Innovation"
    },
    {
      name: "Isabella Rivera",
      role: "Vendor Relations Manager", 
      image: "👩‍🤝‍👩",
      bio: "Connects with local artisans and vendors. Ensures every partner meets our quality standards.",
      specialty: "Community Building"
    },
    {
      name: "David Park",
      role: "Customer Experience Lead",
      image: "👨‍💼", 
      bio: "Former hospitality expert who ensures every client journey is seamless and delightful.",
      specialty: "User Experience"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      title: "Passion-Driven",
      description: "We believe every event tells a story. Our passion is bringing your unique story to life with authenticity and care."
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Community First",
      description: "Supporting local vendors isn't just business—it's building stronger communities one celebration at a time."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-white" />,
      title: "Innovation Meets Tradition",
      description: "We combine cutting-edge AI technology with time-honored event planning expertise for the best of both worlds."
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      title: "Vision Focused",
      description: "Your Pinterest board isn't just inspiration—it's our roadmap. We're obsessed with getting every detail right."
    }
  ];

  const stats = [
    { number: "2,500+", label: "Dreams Realized", icon: "✨" },
    { number: "350+", label: "Local Partners", icon: "🤝" },
    { number: "98%", label: "Happy Clients", icon: "😊" },
    { number: "50+", label: "Cities Served", icon: "🌍" }
  ];

  const journey = [
    {
      year: "2021",
      title: "The Pinterest Problem",
      description: "Sarah noticed the gap between Pinterest dreams and event reality. The idea for KINSI was born.",
      image: "💡"
    },
    {
      year: "2022", 
      title: "Building the Foundation",
      description: "Partnered with first 50 local vendors and developed our vision-to-reality process.",
      image: "🏗️"
    },
    {
      year: "2023",
      title: "AI Revolution",
      description: "Launched our AI planning assistant, making personalized event planning accessible to everyone.",
      image: "🤖"
    },
    {
      year: "2024",
      title: "Community Growth",
      description: "Expanded to 50+ cities with 350+ vendor partners, helping thousands realize their event visions.",
      image: "🌱"
    }
  ];

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #F5F1E8 0%, #E8E0D4 100%)'
    }}>
      {/* Navigation - Same as landing page */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-amber-50/95 backdrop-blur-lg shadow-lg border-b border-amber-900/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
          <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
  <img 
    src={logo} // import logo from '../assets/logo2.png'
    alt="KINSI - Event Planning"
    className="h-20 w-auto object-contain"
  />
</a>

            
            <div className={`md:flex items-center space-x-8 ${
              isMobileMenuOpen ? 'flex absolute top-16 left-0 right-0 bg-amber-50/95 backdrop-blur-lg p-6 flex-col space-y-4 shadow-lg rounded-b-2xl' : 'hidden'
            }`}>
              <a 
                href="/localvendors" 
                className={`font-medium hover:text-orange-500 transition-all duration-300 relative group ${
                  isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
                }`}
              >
                Local Vendors
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <span className={`font-medium text-orange-500 relative ${
                isScrolled ? 'text-orange-500' : 'text-orange-500 drop-shadow-sm'
              }`}>
                About Us
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500"></span>
              </span>
              <a href="/visionspage" className={`font-medium hover:text-orange-500 transition-all duration-300 relative group ${
                isScrolled ? 'text-amber-900' : 'text-amber-900 drop-shadow-sm'
              }`}>
                Visions
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <button 
                onClick={() => handleNavigation("/signup")}
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
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-300 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-8" style={{ color: '#3D2914' }}>
            The Story Behind
            <span className="bg-gradient-to-r from-orange-500 to-green-400 bg-clip-text text-transparent block">
              KINSI
            </span>
          </h1>
          
          <p className="text-xl font-medium mb-6" style={{ color: '#8B6F47' }}>
            From Pinterest Inspiration to Unforgettable Celebrations
          </p>
          
          <p className="text-lg leading-relaxed max-w-4xl mx-auto opacity-90" style={{ color: '#3D2914' }}>
            KINSI was born from a simple frustration: the gap between Pinterest perfection and event reality. 
            We're here to bridge that gap, connecting your vision with local artisans who bring dreams to life, 
            one celebration at a time.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black mb-2" style={{ color: '#FF8A47' }}>
                  {stat.number}
                </div>
                <div className="text-sm font-medium" style={{ color: '#8B6F47' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8" style={{ color: '#3D2914' }}>
                Our Story
              </h2>
              <div className="space-y-6 text-lg leading-relaxed" style={{ color: '#3D2914' }}>
                <p>
                  It started with a Pinterest board and a wedding that almost went wrong. Our founder Iqra
                  had the perfect vision—rustic elegance with sage green accents and cascading florals. 
                  But finding vendors who understood that vision? Nearly impossible.
                </p>
                <p>
                  After countless conversations that began with "It's hard to explain, but imagine..." 
                  Iqra realized there had to be a better way. What if technology could help translate 
                  visual inspiration into actionable plans? What if local vendors could see exactly 
                  what clients envisioned?
                </p>
                <p>
                  KINSI was born from that frustration and fueled by the belief that every celebration 
                  deserves to be as beautiful as the dream that inspired it.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div 
                className="bg-white p-8 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 relative border-4"
                style={{ 
                  borderColor: 'rgba(168, 213, 168, 0.3)',
                }}
              >
                <div className="absolute -inset-3 bg-gradient-to-r from-green-200 to-orange-200 rounded-3xl opacity-20 -z-10"></div>
                
                <h3 className="text-2xl font-bold text-center mb-6" style={{ color: '#3D2914' }}>
                  The KINSI Difference
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="aspect-square bg-gradient-to-br from-green-200 to-amber-100 rounded-2xl flex items-center justify-center text-3xl">
                    🎨
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-orange-200 to-green-100 rounded-2xl flex items-center justify-center text-3xl">
                    🤖
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-amber-200 to-green-200 rounded-2xl flex items-center justify-center text-3xl">
                    🤝
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-orange-200 rounded-2xl flex items-center justify-center text-3xl">
                    ✨
                  </div>
                </div>
                
                <p className="text-center text-sm" style={{ color: '#8B6F47' }}>
                  Vision + Technology + Community + Magic
                </p>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>💝</div>
              <div className="absolute top-1/2 -left-6 text-4xl animate-bounce" style={{ animationDelay: '1s' }}>🌟</div>
              <div className="absolute -bottom-4 right-8 text-4xl animate-bounce" style={{ animationDelay: '2s' }}>🎪</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16" style={{ color: '#3D2914' }}>
            What Drives Us
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-3xl transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-2xl border border-green-200 group"
              >
                <div 
                  className="w-20 h-20 bg-gradient-to-r from-orange-500 to-green-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #FF8A47, #A8D5A8)' }}
                >
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#3D2914' }}>
                  {value.title}
                </h3>
                <p className="leading-relaxed" style={{ color: '#8B6F47' }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #E8E0D4 100%)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16" style={{ color: '#3D2914' }}>
            Our Journey
          </h2>
          
          <div className="space-y-12">
            {journey.map((milestone, index) => (
              <div key={index} className={`flex items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-16 h-16 bg-gradient-to-r from-orange-500 to-green-400 text-white rounded-full flex items-center justify-center text-lg font-black"
                      style={{ background: 'linear-gradient(135deg, #FF8A47, #A8D5A8)' }}
                    >
                      {milestone.year}
                    </div>
                    <h3 className="text-2xl font-bold" style={{ color: '#3D2914' }}>
                      {milestone.title}
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed" style={{ color: '#8B6F47' }}>
                    {milestone.description}
                  </p>
                </div>
                
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center text-6xl hover:scale-110 transition-transform duration-300">
                    {milestone.image}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16" style={{ color: '#3D2914' }}>
            Meet the Dream Team
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-3xl text-center transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-2xl border border-green-200 group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-200 to-orange-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#3D2914' }}>
                  {member.name}
                </h3>
                <p className="text-orange-500 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#8B6F47' }}>
                  {member.bio}
                </p>
                <div className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  {member.specialty}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center text-amber-50" style={{ backgroundColor: '#3D2914' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-black mb-6">
            Ready to Join Our Story?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Let's turn your Pinterest dreams into unforgettable memories
          </p>
          <button 
            onClick={() => handleNavigation("/signup")}
            className="inline-flex items-center gap-3 bg-white text-amber-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-50 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Start Your Journey
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Chatbot - Same as landing page */}
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
                Hi! 👋 I'm here to help you learn more about KINSI and how we can bring your event vision to life. What would you like to know?
              </div>
            </div>
            <div className="p-4 border-t border-green-200 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about our story..." 
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

      {/* Footer - Same as landing page */}
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
                <li><a href="/about" className="hover:text-orange-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Visions</a></li>
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

export default AboutUsPage;