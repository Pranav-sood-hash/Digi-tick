import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  ScanLine,
  Archive,
  MapPin,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Leaf
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'My Lists', path: '/lists', icon: CheckSquare },
    { label: 'Scan a List', path: '/scan', icon: ScanLine },
    { label: 'Completed Lists', path: '/completed', icon: Archive },
    { label: 'Nearby Stores', path: '/stores', icon: MapPin },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 h-full flex flex-col justify-between bg-nature-white dark:bg-darknature-sidebar border-r border-nature-border dark:border-darknature-border select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 pb-4 flex items-center justify-between border-b border-nature-border/60 dark:border-darknature-border/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-nature-forest dark:bg-darknature-primary flex items-center justify-center text-white dark:text-darknature-bg">
              <Leaf className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-nature-forest dark:text-darknature-text flex items-center gap-1.5">
                Digitick
                <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.2 rounded bg-nature-mint text-nature-forest dark:bg-darknature-mint dark:text-darknature-highlight border border-nature-fresh/30 dark:border-transparent">
                  ECO
                </span>
              </span>
              <p className="text-[10px] text-nature-muted dark:text-darknature-muted font-medium">
                Household Shopping Platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-nature-mint dark:bg-darknature-mint text-nature-forest dark:text-darknature-highlight border-l-3 border-nature-primary dark:border-darknature-primary'
                      : 'text-nature-muted dark:text-darknature-muted hover:bg-nature-offwhite dark:hover:bg-darknature-card hover:text-nature-text dark:hover:text-darknature-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-nature-primary dark:text-darknature-primary'
                          : 'text-nature-muted dark:text-darknature-muted'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Card & Controls */}
      <div className="p-3.5 m-3 rounded-xl bg-nature-offwhite dark:bg-darknature-card border border-nature-border dark:border-darknature-border">
        <div className="flex items-center space-x-2.5 mb-2.5">
          <div className="w-7 h-7 rounded-lg bg-nature-mint dark:bg-darknature-mint text-nature-forest dark:text-darknature-highlight font-bold text-xs flex items-center justify-center flex-shrink-0 border border-nature-border dark:border-darknature-border">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name || 'User'}
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              (user?.full_name || user?.email || 'U')[0].toUpperCase()
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-nature-text dark:text-darknature-text truncate">
              {user?.full_name || 'My Household'}
            </p>
            <p className="text-[10px] text-nature-muted dark:text-darknature-muted truncate">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-nature-border dark:border-darknature-border">
          <button
            onClick={toggleTheme}
            className="p-1 rounded-md text-nature-muted hover:text-nature-forest dark:hover:text-darknature-highlight hover:bg-nature-white dark:hover:bg-darknature-sidebar transition-colors flex items-center space-x-1 text-xs font-medium"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-nature-forest" />
                <span className="text-[11px]">Dark</span>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="p-1 rounded-md text-nature-muted hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center space-x-1 text-xs font-medium"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[11px]">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
