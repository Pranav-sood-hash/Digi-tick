import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'features', 'how-it-works', 'discover', 'about'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Discover', id: 'discover' },
    { label: 'About', id: 'about' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-nature-white/90 dark:bg-nature-darkforest/90 backdrop-blur-md border-b border-nature-border/80 dark:border-nature-forest/30 shadow-xs py-3'
          : 'bg-transparent py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-nature-forest text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
              <Leaf className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-bold text-xl tracking-tight text-nature-forest dark:text-nature-mint">
                Digitick
              </span>
              <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.2 rounded bg-nature-mint text-nature-forest border border-nature-fresh/30 uppercase">
                ECO
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation */}
          <nav className="hidden md:flex items-center space-x-1 p-1 rounded-full bg-nature-offwhite/80 dark:bg-nature-darkforest/60 border border-nature-border/70 dark:border-nature-forest/40 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-nature-forest text-white shadow-xs'
                      : 'text-nature-muted hover:text-nature-text dark:text-nature-mint/70 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/login"
              className="text-xs font-bold text-nature-forest dark:text-nature-mint hover:text-nature-primary transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-nature-forest hover:bg-nature-primary text-white text-xs font-bold transition-all duration-150 shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/login"
              className="text-xs font-bold text-nature-forest dark:text-nature-mint px-2.5 py-1.5"
            >
              Sign In
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-nature-forest dark:text-nature-mint hover:bg-nature-mint/50 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-nature-white dark:bg-nature-darkforest border-b border-nature-border dark:border-nature-forest/40 px-4 pt-3 pb-5 space-y-3"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeSection === link.id
                      ? 'bg-nature-mint text-nature-forest font-bold'
                      : 'text-nature-muted hover:text-nature-text'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-nature-border dark:border-nature-forest/30 flex flex-col space-y-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/register')}
                className="w-full flex items-center justify-center space-x-2 bg-nature-forest hover:bg-nature-primary text-white font-bold"
              >
                <span>Get Started — Free</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
