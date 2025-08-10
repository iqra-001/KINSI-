// VendorHub.jsx
import React, { useState, useEffect } from 'react';
// import '../App.css';

// ========================
// VENDOR DATA
// ========================
const VENDOR_CATEGORIES = [
  {
    icon: '🎨',
    title: 'Event Decorators & Party Planners',
    services: [
      {
        name: 'Wedding Decorators',
        description: 'Complete bridal decoration packages including mandap decoration, stage setup, floral arrangements, lighting design, and venue transformation'
      },
      {
        name: 'Birthday Party Specialists',
        description: 'Themed party decorations for children and adults, balloon arrangements, backdrop setups, and custom party props'
      },
      {
        name: 'Corporate Event Planners',
        description: 'Professional event management for conferences, product launches, team building events, and business celebrations'
      },
      {
        name: 'Seasonal Decorators',
        description: 'Holiday-specific decorations for Diwali, Christmas, Eid, New Year, and other cultural festivities'
      },
      {
        name: 'Anniversary & Milestone Celebrations',
        description: 'Romantic setups, golden jubilee decorations, and commemorative event planning'
      }
    ],
    description: 'Services include: venue scouting, theme development, color coordination, furniture rental, lighting arrangements, photography setup assistance, and complete event coordination from planning to cleanup.'
  },
  {
    icon: '🍰',
    title: 'Cake Vendors & Bakers',
    services: [
      {
        name: 'Wedding Cake Artists',
        description: 'Multi-tier wedding cakes, traditional designs, modern minimalist styles, fondant work, sugar flower decorations, and groom\'s cakes'
      },
      {
        name: 'Birthday Cake Specialists',
        description: 'Custom character cakes, number cakes, photo cakes, themed designs for all ages, cupcake towers, and cake pops'
      },
      {
        name: 'Corporate Cake Services',
        description: 'Logo cakes, achievement celebration cakes, retirement cakes, and bulk order catering for office events'
      },
      {
        name: 'Specialty Diet Bakers',
        description: 'Vegan cakes, gluten-free options, sugar-free varieties, keto-friendly desserts, and allergen-conscious baking'
      },
      {
        name: 'Traditional & Cultural Cakes',
        description: 'Regional specialties, festival cakes, religious ceremony cakes, and cultural celebration desserts'
      }
    ],
    description: 'Offerings include: custom flavor development, tiered cake construction, edible image printing, delivery and setup services, cake cutting ceremony coordination, and dessert table styling.'
  },
  {
    icon: '🌸',
    title: 'Flower Vendors & Florists',
    services: [
      {
        name: 'Wedding Florists',
        description: 'Bridal bouquets, groom boutonnieres, ceremony arches, centerpieces, aisle decorations, and reception floral arrangements'
      },
      {
        name: 'Event Flower Designers',
        description: 'Corporate arrangements, party centerpieces, stage decorations, entrance arrangements, and ambient floral installations'
      },
      {
        name: 'Daily Fresh Flower Suppliers',
        description: 'Temple flowers, home decoration flowers, office arrangements, and weekly flower subscription services'
      },
      {
        name: 'Seasonal Flower Specialists',
        description: 'Holiday arrangements, seasonal bouquets, festival decorations, and weather-appropriate floral designs'
      },
      {
        name: 'Sympathy & Memorial Florists',
        description: 'Funeral arrangements, sympathy bouquets, memorial wreaths, and respectful ceremonial flowers'
      }
    ],
    description: 'Services encompass: custom floral design consultation, seasonal flower sourcing, arrangement delivery, event setup, floral preservation services, and maintenance for long-term installations.'
  },
  {
    icon: '🎁',
    title: 'Gift Shops & Specialty Stores',
    services: [
      {
        name: 'Personalized Gift Specialists',
        description: 'Custom engraving services, photo gifts, monogrammed items, personalized jewelry, and bespoke gift creation'
      },
      {
        name: 'Corporate Gift Vendors',
        description: 'Branded merchandise, executive gifts, employee recognition items, client appreciation gifts, and bulk corporate ordering'
      },
      {
        name: 'Occasion-Specific Stores',
        description: 'Wedding gifts, baby shower presents, housewarming gifts, graduation gifts, and milestone celebration items'
      },
      {
        name: 'Handcraft & Artisan Shops',
        description: 'Local handicrafts, handmade items, traditional crafts, artisan jewelry, and unique cultural artifacts'
      },
      {
        name: 'Luxury & Premium Gift Boutiques',
        description: 'High-end gifts, imported items, luxury accessories, premium home decor, and exclusive collections'
      }
    ],
    description: 'Specialized services include: gift wrapping and presentation, custom packaging, gift consultation, bulk ordering, delivery services, and gift registry management.'
  },
  {
    icon: '🏠',
    title: 'Home Services & Maintenance',
    services: [
      {
        name: 'Cleaning Services',
        description: 'Regular house cleaning, deep cleaning, post-construction cleanup, carpet cleaning, and specialized sanitization services'
      },
      {
        name: 'Maintenance & Repair',
        description: 'Plumbing services, electrical work, carpentry, painting, appliance repair, and general handyman services'
      },
      {
        name: 'Gardening & Landscaping',
        description: 'Garden maintenance, landscaping design, plant care, lawn services, and outdoor space beautification'
      },
      {
        name: 'Interior Services',
        description: 'Interior design consultation, furniture arrangement, home organization, and space optimization solutions'
      },
      {
        name: 'Security & Safety',
        description: 'Home security installation, safety inspections, lock services, and emergency repair services'
      }
    ],
    description: 'Comprehensive offerings include: scheduled maintenance programs, emergency services, consultation and planning, quality guarantees, and ongoing support relationships.'
  },
  {
    icon: '👗',
    title: 'Fashion & Beauty Services',
    services: [
      {
        name: 'Custom Tailoring & Alterations',
        description: 'Wedding attire, formal wear, casual clothing alterations, traditional outfit creation, and quick repair services'
      },
      {
        name: 'Beauty & Salon Services',
        description: 'Bridal makeup, party styling, hair cutting and styling, skincare treatments, and beauty consultation services'
      },
      {
        name: 'Jewelry & Accessories',
        description: 'Custom jewelry design, traditional jewelry, fashion accessories, repair services, and rental options for special occasions'
      },
      {
        name: 'Fashion Consulting',
        description: 'Personal shopping, wardrobe styling, color consultation, and fashion advice for special events'
      },
      {
        name: 'Grooming Services',
        description: 'Men\'s grooming, beard styling, personal care services, and comprehensive beauty packages'
      }
    ],
    description: 'Specialized services include: style consultation, custom fitting, beauty trials, mobile services, group bookings, and special occasion packages.'
  }
];

const FEATURES_DATA = [
  {
    icon: '🔍',
    title: 'Smart Search',
    description: 'Advanced filtering and search capabilities help you find exactly the right vendor for your specific needs, budget, and timeline.'
  },
  {
    icon: '✅',
    title: 'Verified Vendors',
    description: 'All our vendors go through a comprehensive verification process to ensure quality, reliability, and professional standards.'
  },
  {
    icon: '🤖',
    title: 'AI Assistant',
    description: 'Our intelligent chatbot provides personalized recommendations and answers questions based on comprehensive vendor data.'
  },
  {
    icon: '🏘️',
    title: 'Community Focus',
    description: 'Supporting local businesses and fostering community connections through trusted, neighborhood-based service providers.'
  }
];

// ========================
// UTILITY FUNCTIONS
// ========================
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// ========================
// COMPONENTS
// ========================
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">VendorHub</div>
          <nav>
            <ul>
              <li><a href="#vendors" onClick={() => scrollToSection('vendors')}>Our Vendors</a></li>
              <li><a href="#about" onClick={() => scrollToSection('about')}>About Us</a></li>
              <li><a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

const Hero = () => (
  <section className="hero">
    <h1>Your Local Community Vendors</h1>
    <p>Connecting you with trusted local businesses for all your needs</p>
  </section>
);

const VendorCategory = ({ icon, title, services, description }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`category-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [title]);

  return (
    <div 
      id={`category-${title.replace(/\s+/g, '-').toLowerCase()}`}
      className={`vendor-category ${isVisible ? 'visible' : ''}`}
    >
      <h3>{icon} {title}</h3>
      <div className="vendor-details">
        <h4>Specialized Services Available:</h4>
        <ul className="vendor-list">
          {services.map((service, index) => (
            <li key={index}>
              <strong>{service.name}:</strong> {service.description}
            </li>
          ))}
        </ul>
        <p className="services">{description}</p>
      </div>
    </div>
  );
};

const Features = () => (
  <div className="features">
    {FEATURES_DATA.map((feature, index) => (
      <div key={index} className="feature">
        <div className="feature-icon">{feature.icon}</div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    ))}
  </div>
);

const VendorsSection = () => (
  <section id="vendors" className="section">
    <h2>Our Vendor Community</h2>
    <p>Our comprehensive directory features carefully vetted local vendors across multiple categories. Each vendor is a valued member of our community, offering quality services and products to meet your diverse needs.</p>
    
    <div className="vendors-grid">
      {VENDOR_CATEGORIES.map((category, index) => (
        <VendorCategory
          key={index}
          icon={category.icon}
          title={category.title}
          services={category.services}
          description={category.description}
        />
      ))}
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="section">
    <h2>About Our Vendor Directory</h2>
    <div className="about-content">
      <p>Our Local Community Vendors Directory serves as a comprehensive digital marketplace and information hub designed to bridge the gap between consumers and trusted local service providers. This platform operates as both a directory and a community resource, carefully curating and presenting detailed information about various local vendors across multiple service categories.</p>
      
      <p>The primary function of this website is to provide detailed, searchable information about local vendors, their services, specializations, and contact details. Unlike simple listing websites, our platform focuses on providing comprehensive descriptions of each vendor category, detailing the specific services offered, areas of expertise, and the unique value propositions that each type of vendor brings to the community.</p>
      
      <p>Our vendor verification process ensures that all listed businesses meet quality standards and maintain good standing within the community. Each vendor undergoes a thorough evaluation process that includes verification of business licenses, assessment of service quality through customer feedback, evaluation of pricing fairness, and confirmation of professional standards and reliability.</p>
      
      <p>The website functions as an educational resource, providing users with detailed information about what to expect from each type of service provider. For instance, when users explore our decorator section, they receive comprehensive information about different types of decorating services available, seasonal specializations, pricing considerations, and tips for selecting the right decorator for their specific needs.</p>
      
      <p>Our chatbot integration is powered by the extensive data present throughout this website. The artificial intelligence system has been trained on comprehensive information about each vendor category, including service descriptions, pricing insights, quality indicators, and frequently asked questions. This enables the chatbot to provide intelligent, contextual responses to user inquiries about local vendors and services.</p>
      
      <p>The platform serves multiple user types: individual consumers seeking personal services, families planning special events, business owners requiring corporate services, and newcomers to the area who need to establish relationships with reliable local service providers. Each user category can find tailored information and recommendations suited to their specific requirements.</p>
      
      <p>Data collection and presentation on this website follows a systematic approach. Information about vendors includes business background, years of experience, service portfolios, pricing structures, availability, customer testimonials, quality certifications, and community involvement. This comprehensive data collection enables users to make informed decisions and helps the chatbot provide accurate, detailed responses to queries.</p>
      
      <p>Our community-focused approach means that we prioritize local businesses that demonstrate commitment to community values, environmental responsibility, fair pricing, customer satisfaction, and continuous improvement. We regularly update vendor information, monitor service quality, and facilitate feedback collection to ensure the directory remains current and reliable.</p>
      
      <p>The website's search and filtering capabilities allow users to find vendors based on specific criteria such as service type, location, availability, budget range, and special requirements. This functionality is supported by detailed tagging and categorization of vendor information, making it easy for both human users and the AI chatbot to locate relevant information quickly.</p>
      
      <p>Future enhancements to the platform include expanded vendor categories, integration with booking systems, customer review platforms, seasonal service highlighting, and enhanced AI capabilities for the chatbot. Our commitment is to continuously evolve this platform to better serve both vendors and customers in our local community.</p>
    </div>
    
    <Features />
  </section>
);

const CallToAction = () => (
  <div className="cta">
    <h3>Ready to Connect with Local Vendors?</h3>
    <p>Start exploring our directory or chat with our AI assistant for personalized recommendations</p>
    <a href="#contact" className="cta-button">Get Started Today</a>
  </div>
);

const Footer = () => (
  <footer>
    <div className="container">
      <p>&copy; 2025 Local Community Vendors Directory. Supporting local businesses, strengthening communities.</p>
    </div>
  </footer>
);

// ========================
// MAIN COMPONENT
// ========================
const VendorHub = () => {
  return (
    <div className="App">
      <Header />
      
      <div className="container">
        <Hero />
        
        <main className="main-content">
          <VendorsSection />
          <AboutSection />
          <CallToAction />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

// ========================
// EXPORTS
// ========================
export default VendorHub;

// Named exports for individual components if needed
export {
  Header,
  Hero,
  VendorCategory,
  Features,
  VendorsSection,
  AboutSection,
  CallToAction,
  Footer,
  VENDOR_CATEGORIES,
  FEATURES_DATA
};