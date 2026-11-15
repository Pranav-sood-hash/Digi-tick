import React from 'react';
import { Menu, Plus, ScanLine, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common/Button';

interface HeaderProps {
  title?: string;
  onOpenMobileMenu: () => void;
  onOpenNewListModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onOpenMobileMenu,
  onOpenNewListModal,
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 px-4 md:px-6 bg-nature-white dark:bg-darknature-sidebar border-b border-nature-border dark:border-darknature-border flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 rounded-lg text-nature-muted hover:text-nature-text hover:bg-nature-offwhite dark:hover:bg-darknature-card transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="text-base md:text-lg font-bold text-nature-forest dark:text-darknature-text tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {/* Prominent Theme Toggle in Header (Desktop & Mobile) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg border border-nature-border dark:border-darknature-border bg-nature-offwhite dark:bg-darknature-card text-nature-forest dark:text-darknature-highlight hover:bg-nature-mint dark:hover:bg-darknature-mint transition-colors flex items-center space-x-1.5 text-xs font-semibold"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-xs text-darknature-text">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-nature-forest" />
              <span className="hidden sm:inline text-xs text-nature-forest">Dark</span>
            </>
          )}
        </button>

        <Button
          variant="outline"
          size="sm"
          icon={<ScanLine className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" />}
          onClick={() => navigate('/scan')}
          className="hidden sm:inline-flex"
        >
          Scan Note
        </Button>

        {onOpenNewListModal && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={onOpenNewListModal}
          >
            New List
          </Button>
        )}
      </div>
    </header>
  );
};
