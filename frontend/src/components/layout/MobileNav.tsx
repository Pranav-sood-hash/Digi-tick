import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  ScanLine,
  MapPin,
  User
} from 'lucide-react';

interface MobileNavProps {
  onOpenNewListModal?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-nature-white dark:bg-darknature-sidebar border-t border-nature-border dark:border-darknature-border px-2 py-1.5 flex items-center justify-around select-none">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive
              ? 'text-nature-primary dark:text-darknature-highlight'
              : 'text-nature-muted dark:text-darknature-muted'
          }`
        }
      >
        <LayoutDashboard className="w-4 h-4 mb-0.5" />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/lists"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive
              ? 'text-nature-primary dark:text-darknature-highlight'
              : 'text-nature-muted dark:text-darknature-muted'
          }`
        }
      >
        <CheckSquare className="w-4 h-4 mb-0.5" />
        <span>Lists</span>
      </NavLink>

      {/* Flat Center Scan Button */}
      <NavLink
        to="/scan"
        className="flex flex-col items-center justify-center -mt-4"
      >
        <div className="w-10 h-10 rounded-xl bg-nature-primary dark:bg-darknature-primary text-white dark:text-darknature-bg flex items-center justify-center border-2 border-nature-white dark:border-darknature-sidebar active:scale-95 transition-transform">
          <ScanLine className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[10px] font-bold text-nature-forest dark:text-darknature-highlight mt-0.5">
          Scan
        </span>
      </NavLink>

      <NavLink
        to="/stores"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive
              ? 'text-nature-primary dark:text-darknature-highlight'
              : 'text-nature-muted dark:text-darknature-muted'
          }`
        }
      >
        <MapPin className="w-4 h-4 mb-0.5" />
        <span>Stores</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive
              ? 'text-nature-primary dark:text-darknature-highlight'
              : 'text-nature-muted dark:text-darknature-muted'
          }`
        }
      >
        <User className="w-4 h-4 mb-0.5" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};
