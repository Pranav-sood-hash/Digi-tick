import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-nature-darkforest text-nature-mint/80 border-t border-nature-forest/30 py-12 md:py-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-nature-forest text-white flex items-center justify-center">
                <Leaf className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">Digitick</span>
            </Link>
            <p className="text-[11px] text-nature-mint/60 leading-relaxed">
              Your Shopping. Organized. Simplified.
            </p>
            <p className="text-[11px] text-nature-mint/60">
              Modern household shopping management powered by flat nature aesthetics and smart organization.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition-colors">
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="#discover" className="hover:text-white transition-colors">
                  Nearby Stores
                </a>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="hover:text-white transition-colors">
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Privacy & Trust</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-nature-mint/60">No advertising tracking</span>
              </li>
              <li>
                <span className="text-nature-mint/60">Encrypted user storage</span>
              </li>
              <li>
                <span className="text-nature-mint/60">Optional GPS location</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-nature-forest/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-nature-mint/60">
          <p>© {new Date().getFullYear()} Digitick ECO. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Built with nature-inspired care for organized living</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
