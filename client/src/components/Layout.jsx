import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Layout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || location.pathname !== '/'
            ? 'bg-white shadow-md py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <nav className="container mx-auto px-4 flex items-center justify-between">
          <Link
            to="/"
            className={`font-serif text-xl md:text-2xl font-bold transition-colors ${
              scrolled || location.pathname !== '/' ? 'text-gold-700' : 'text-white'
            }`}
          >
            Les Trois Palmiers
          </Link>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 ${scrolled || location.pathname !== '/' ? 'text-gray-800' : 'text-white'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm uppercase tracking-widest transition-colors hover:text-gold-500 ${
                  location.pathname === link.to
                    ? 'text-gold-600'
                    : scrolled || location.pathname !== '/'
                    ? 'text-gray-800'
                    : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/reservation"
              className={`btn-primary ${scrolled || location.pathname !== '/' ? '' : 'bg-white text-gold-700 hover:bg-gold-50'}`}
            >
              Book Now
            </Link>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-800 py-2 border-b border-gray-100"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/reservation" className="btn-primary text-center">
                Book Now
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="font-serif text-2xl mb-6">Les Trois Palmiers</h3>
              <p className="text-gray-400 leading-relaxed">
                Experience the epitome of luxury on the Mediterranean coast.
              </p>
            </div>
            <div>
              <h4 className="uppercase tracking-widest text-sm mb-6 text-gold-400">Quick Links</h4>
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="uppercase tracking-widest text-sm mb-6 text-gold-400">Contact</h4>
              <div className="flex flex-col gap-3 text-gray-400">
                <p>Mediterranean Avenue</p>
                <p>Côte d'Azur, France</p>
                <p>+33 4 93 12 34 56</p>
                <p>info@lestroispalmiers.com</p>
              </div>
            </div>
            <div>
              <h4 className="uppercase tracking-widest text-sm mb-6 text-gold-400">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe for exclusive offers.</p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border-none outline-none text-white"
                />
                <button type="submit" className="bg-gold-600 px-4 py-3 hover:bg-gold-700 transition-colors">
                  →
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 Les Trois Palmiers. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;