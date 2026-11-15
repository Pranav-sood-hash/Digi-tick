import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Sun, Moon } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn pb-10">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
          Application Settings
        </h2>
        <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
          Appearance, themes, and account session preferences
        </p>
      </div>

      {/* Theme Appearance */}
      <section className="bg-nature-white dark:bg-darknature-card rounded-2xl p-5 border border-nature-border dark:border-darknature-border">
        <h3 className="text-sm font-bold text-nature-forest dark:text-darknature-text tracking-tight mb-1">
          Interface Theme
        </h3>
        <p className="text-xs text-nature-muted dark:text-darknature-muted mb-4">
          Switch between nature-inspired clean Light Mode and deep forest Dark Mode.
        </p>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              theme === 'light'
                ? 'border-nature-primary bg-nature-mint text-nature-forest ring-1 ring-nature-primary'
                : 'border-nature-border dark:border-darknature-border text-nature-muted dark:text-darknature-muted hover:bg-nature-offwhite'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Mode</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              theme === 'dark'
                ? 'border-darknature-primary bg-darknature-mint text-darknature-highlight ring-1 ring-darknature-primary'
                : 'border-nature-border dark:border-darknature-border text-nature-muted dark:text-darknature-muted hover:bg-darknature-sidebar'
            }`}
          >
            <Moon className="w-4 h-4 text-emerald-400" />
            <span>Dark Mode</span>
          </button>
        </div>
      </section>

      {/* Account Session Actions */}
      <section className="bg-nature-white dark:bg-darknature-card rounded-2xl p-5 border border-nature-border dark:border-darknature-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-nature-forest dark:text-darknature-text">
            Sign Out of Digitick
          </h3>
          <p className="text-xs text-nature-muted dark:text-darknature-muted">
            Currently logged in as {user?.email}
          </p>
        </div>
        <Button variant="danger" size="sm" onClick={handleLogout}>
          Log Out
        </Button>
      </section>
    </div>
  );
};
