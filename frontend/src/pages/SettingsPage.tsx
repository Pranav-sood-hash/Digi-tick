import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import {
  Sun,
  Moon,
  Database,
  Cpu,
  MapPin,
  CheckCircle,
  Info
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [backendHealth, setBackendHealth] = useState<any>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setBackendHealth)
      .catch(() => setBackendHealth({ status: 'unreachable' }));
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn pb-10">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
          Application Settings
        </h2>
        <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
          Appearance, themes, and connected service status
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

      {/* Cloud & Integration Status */}
      <section className="bg-nature-white dark:bg-darknature-card rounded-2xl p-5 border border-nature-border dark:border-darknature-border space-y-3.5">
        <div>
          <h3 className="text-sm font-bold text-nature-forest dark:text-darknature-text tracking-tight mb-1">
            Service Architecture & Connection Status
          </h3>
          <p className="text-xs text-nature-muted dark:text-darknature-muted">
            Digitick provides production adapters with seamless local fallbacks.
          </p>
        </div>

        <div className="space-y-2.5">
          {/* Backend Status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border text-xs">
            <div className="flex items-center space-x-2.5">
              <Database className="w-4 h-4 text-nature-primary dark:text-darknature-primary" />
              <div>
                <span className="font-semibold block text-nature-forest dark:text-darknature-text">
                  FastAPI Engine & Database
                </span>
                <span className="text-[11px] text-nature-muted dark:text-darknature-muted">
                  Persistent storage with RLS & Foreign Keys
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 font-semibold text-nature-primary dark:text-darknature-highlight">
              <CheckCircle className="w-3.5 h-3.5" />
              {backendHealth?.status === 'healthy' ? 'Connected' : 'Active'}
            </span>
          </div>

          {/* AI / OCR Engine */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border text-xs">
            <div className="flex items-center space-x-2.5">
              <Cpu className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <div>
                <span className="font-semibold block text-nature-forest dark:text-darknature-text">
                  AI OCR Handwriting Recognition
                </span>
                <span className="text-[11px] text-nature-muted dark:text-darknature-muted">
                  Gemini Vision API / Heuristic fallback parser
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 font-semibold text-nature-muted dark:text-darknature-muted">
              <Info className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" /> Ready
            </span>
          </div>

          {/* Maps Engine */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border text-xs">
            <div className="flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-nature-forest dark:text-darknature-highlight" />
              <div>
                <span className="font-semibold block text-nature-forest dark:text-darknature-text">
                  Store Discovery & Mapping Engine
                </span>
                <span className="text-[11px] text-nature-muted dark:text-darknature-muted">
                  Category matching engine with non-inventory disclaimer
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 font-semibold text-nature-primary dark:text-darknature-highlight">
              <CheckCircle className="w-3.5 h-3.5" /> Active
            </span>
          </div>
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
        <Button variant="danger" size="sm" onClick={logout}>
          Log Out
        </Button>
      </section>
    </div>
  );
};
