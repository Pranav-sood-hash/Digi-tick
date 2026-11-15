import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  const success = useCallback((msg: string) => toast(msg, 'success'), [toast]);
  const error = useCallback((msg: string) => toast(msg, 'error'), [toast]);
  const info = useCallback((msg: string) => toast(msg, 'info'), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className={`pointer-events-auto flex items-center justify-between p-3 rounded-xl border bg-nature-white dark:bg-darknature-card text-nature-text dark:text-darknature-text shadow-card ${
                t.type === 'success'
                  ? 'border-nature-primary/40 dark:border-darknature-primary/40'
                  : t.type === 'error'
                  ? 'border-rose-300 dark:border-rose-800'
                  : 'border-nature-border dark:border-darknature-border'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-nature-primary dark:text-darknature-highlight flex-shrink-0" />}
                {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                {t.type === 'info' && <Info className="w-4 h-4 text-nature-forest dark:text-darknature-primary flex-shrink-0" />}
                <span className="text-xs font-semibold">{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="ml-2.5 p-1 rounded-md text-nature-muted hover:text-nature-text dark:hover:text-darknature-text hover:bg-nature-offwhite dark:hover:bg-darknature-sidebar transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
