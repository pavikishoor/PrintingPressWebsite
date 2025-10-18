import React, { useState, useEffect } from 'react';
import { Printer, Mail, Phone, MapPin, Clock, Award, Users, ChevronRight, Menu, X, LogOut } from 'lucide-react';
import './App.css';
import API_URL from './config';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [quotes, setQuotes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    quantity: '',
    description: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/user`, {
        credentials: 'include'
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        fetchQuotes();
      }
    } catch (err) {
      console.log('Not authenticated');
    }
  };

  const fetchQuotes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/quotes`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setQuotes(data);
      }
    } catch (err) {
      console.error('Error fetching quotes:', err);
    }
  };

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        credentials: 'include'
      });
      setUser(null);
      setActiveSection('home');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to request a quote');
      handleLogin();
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert('Quote request submitted successfully!');
        setFormData({ name: '', email: '', phone: '', serviceType: '', quantity: '', description: '' });
        fetchQuotes();
      }
    } catch (err) {
      alert('Error submitting quote request');
    }
  };

  const services = [
    { icon: '📄', name: 'Business Cards', desc: 'Premium quality business cards' },
    { icon: '📰', name: 'Brochures', desc: 'Eye-catching promotional materials' },
    { icon: '📋', name: 'Flyers & Posters', desc: 'Large format printing solutions' },
    { icon: '📖', name: 'Books & Magazines', desc: 'Professional binding services' },
    { icon: '🎨', name: 'Custom Printing', desc: 'Personalized printing solutions' },
    { icon: '📦', name: 'Packaging', desc: 'Custom branded packaging' }
  ];

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="logo">
              <Printer className="logo-icon" />
              <span className="logo-text">PrintPro Elite</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="desktop-menu">
              <button onClick={() => setActiveSection('home')} className="nav-link">Home</button>
              <button onClick={() => setActiveSection('services')} className="nav-link">Services</button>
              <button onClick={() => setActiveSection('about')} className="nav-link">About</button>
              <button onClick={() => setActiveSection('contact')} className="nav-link">Contact</button>
              
              {user ? (
                <div className="user-section">
                  <button onClick={() => setActiveSection('dashboard')} className="nav-link">Dashboard</button>
                  <div className="user-info">
                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                    <span className="user-name">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="logout-btn">
                    <LogOut className="icon-sm" />
                  </button>
                </div>
              ) : (
                <button onClick={handleLogin} className="signin-btn">
                  Sign In
                </button>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="mobile-menu-btn">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="icon-md" /> : <Menu className="icon-md" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <button onClick={() => { setActiveSection('home'); setIsMenuOpen(false); }} className="mobile-link">Home</button>
              <button onClick={() => { setActiveSection('services'); setIsMenuOpen(false); }} className="mobile-link">Services</button>
              <button onClick={() => { setActiveSection('about'); setIsMenuOpen(false); }} className="mobile-link">About</button>
              <button onClick={() => { setActiveSection('contact'); setIsMenuOpen(false); }} className="mobile-link">Contact</button>
              {user ? (
                <>
                  <button onClick={() => { setActiveSection('dashboard'); setIsMenuOpen(false); }} className="mobile-link">Dashboard</button>
                  <button onClick={handleLogout} className="mobile-link logout">Logout</button>
                </>
              ) : (
                <button onClick={handleLogin} className="mobile-link signin">Sign In</button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <div className="main-content">
        {activeSection === 'home' && (
          <>
            {/* Hero Section */}
            <div className="hero">
              <div className="hero-content">
                <h1 className="hero-title">Professional Printing Solutions</h1>
                <p className="hero-subtitle">Quality prints that make your business stand out</p>
                <button onClick={() => setActiveSection('contact')} className="cta-btn">
                  Get a Quote <ChevronRight className="icon-sm inline" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="features">
              <div className="container">
                <div className="features-grid">
                  <div className="feature-card">
                    <Award className="feature-icon" />
                    <h3 className="feature-title">Premium Quality</h3>
                    <p className="feature-desc">State-of-the-art printing technology</p>
                  </div>
                  <div className="feature-card">
                    <Clock className="feature-icon" />
                    <h3 className="feature-title">Fast Turnaround</h3>
                    <p className="feature-desc">Quick delivery without compromising quality</p>
                  </div>
                  <div className="feature-card">
                    <Users className="feature-icon" />
                    <h3 className="feature-title">Expert Support</h3>
                    <p className="feature-desc">Dedicated team to assist you</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'services' && (
          <div className="section">
            <div className="container">
              <h2 className="section-title">Our Services</h2>
              <div className="services-grid">
                {services.map((service, idx) => (
                  <div key={idx} className="service-card">
                    <div className="service-icon">{service.icon}</div>
                    <h3 className="service-title">{service.name}</h3>
                    <p className="service-desc">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="section">
            <div className="container-sm">
              <h2 className="section-title">About Us</h2>
              <div className="about-card">
                <p className="about-text">
                  PrintPro Elite has been serving businesses with premium printing solutions for over 15 years. Our commitment to quality and customer satisfaction has made us the trusted choice for thousands of businesses.
                </p>
                <p className="about-text">
                  We combine cutting-edge technology with traditional craftsmanship to deliver exceptional results every time. From small business cards to large-scale promotional materials, we handle every project with precision and care.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="section">
            <div className="container-sm">
              <h2 className="section-title">Request a Quote</h2>
              <div className="quote-form-card">
                <form onSubmit={handleSubmit} className="quote-form">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="form-input"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="form-input"
                      required
                    />
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                      className="form-input"
                      required
                    >
                      <option value="">Select Service</option>
                      <option value="business-cards">Business Cards</option>
                      <option value="brochures">Brochures</option>
                      <option value="flyers">Flyers & Posters</option>
                      <option value="books">Books & Magazines</option>
                      <option value="custom">Custom Printing</option>
                      <option value="packaging">Packaging</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="form-input full-width"
                    required
                  />
                  <textarea
                    placeholder="Project Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                    className="form-input full-width"
                    required
                  ></textarea>
                  <button type="submit" className="submit-btn">
                    Submit Quote Request
                  </button>
                </form>
              </div>
              
              <div className="contact-info">
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <p className="contact-label">Call Us</p>
                  <p className="contact-value">+1 (555) 123-4567</p>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <p className="contact-label">Email Us</p>
                  <p className="contact-value">info@printpro.com</p>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <p className="contact-label">Visit Us</p>
                  <p className="contact-value">123 Print Street, NY</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'dashboard' && user && (
          <div className="section">
            <div className="container">
              <h2 className="section-title">Your Dashboard</h2>
              <div className="dashboard-card">
                <h3 className="dashboard-subtitle">Your Quote Requests</h3>
                {quotes.length === 0 ? (
                  <p className="no-quotes">No quote requests yet. Submit one to get started!</p>
                ) : (
                  <div className="quotes-list">
                    {quotes.map((quote) => (
                      <div key={quote._id} className="quote-item">
                        <div className="quote-content">
                          <div className="quote-details">
                            <p className="quote-service">{quote.serviceType}</p>
                            <p className="quote-quantity">Quantity: {quote.quantity}</p>
                            <p className="quote-description">{quote.description}</p>
                          </div>
                          <span className={`quote-status ${quote.status}`}>
                            {quote.status}
                          </span>
                        </div>
                        <p className="quote-date">
                          Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 PrintPro Elite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;