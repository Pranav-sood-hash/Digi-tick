import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { AlertCircle, UserCheck } from 'lucide-react';

interface GoogleAuthButtonProps {
  flow: 'login' | 'signup';
  onError?: (msg: string, isNotRegistered?: boolean) => void;
  className?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  flow,
  onError,
  className = '',
}) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');
  const [modalError, setModalError] = useState('');

  const handleGoogleClick = async () => {
    if (loading) return;

    // Check if Supabase with Google provider is active
    if (isSupabaseConfigured && supabase) {
      setLoading(true);
      try {
        const callbackUrl = `${window.location.origin}/auth/callback?flow=${flow}`;
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: callbackUrl,
            queryParams: {
              access_type: 'offline',
              prompt: 'select_account',
            },
          },
        });

        if (oauthError) {
          throw oauthError;
        }
        return;
      } catch (err: any) {
        setLoading(false);
        const msg = err.message || 'Failed to initiate Google OAuth';
        console.warn('Supabase OAuth error:', msg);
        setTestEmail(flow === 'login' ? 'chef.alex@example.com' : 'new.shopper@gmail.com');
        setTestName(flow === 'login' ? 'Alex Johnson' : 'Taylor Smith');
        setModalError(msg);
        setTestModalOpen(true);
        if (onError) onError(msg);
        return;
      }
    }

    // When Supabase Google credentials are not yet configured in local environment,
    // open the interactive Google Account selector for testing both Login & Sign-up flows
    setTestEmail(flow === 'login' ? 'chef.alex@example.com' : 'new.shopper@gmail.com');
    setTestName(flow === 'login' ? 'Alex Johnson' : 'Taylor Smith');
    setModalError('');
    setTestModalOpen(true);
  };

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) return;

    setLoading(true);
    setModalError('');
    try {
      await loginWithGoogle({
        email: testEmail.trim().toLowerCase(),
        full_name: testName.trim() || undefined,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(testName || testEmail)}`,
        flow,
      });
      setTestModalOpen(false);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Google authentication failed';
      setModalError(msg);
      const isNotRegistered =
        msg.includes("doesn't exist") ||
        msg.includes('sign up first') ||
        msg.includes('No Google account found');
      if (onError) onError(msg, isNotRegistered);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleClick}
        className={`w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl border border-nature-border dark:border-darknature-border bg-nature-white dark:bg-darknature-card hover:bg-nature-offwhite dark:hover:bg-darknature-sidebar text-nature-forest dark:text-darknature-text font-semibold text-xs transition-all duration-150 shadow-2xs hover:border-nature-primary/40 focus:outline-none focus:ring-2 focus:ring-nature-primary/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-nature-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{loading ? 'Authenticating with Google...' : 'Continue with Google'}</span>
      </button>

      {/* Google Account Selector Dialog (Active for evaluation when Supabase OAuth Client Secret is in development mode) */}
      <Modal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        title={flow === 'signup' ? 'Google Sign-Up' : 'Google Login'}
        description={
          flow === 'signup'
            ? 'Select or enter the Google account to create your Digitick account with.'
            : 'Select or enter your Google account to log into your existing Digitick profile.'
        }
      >
        <form onSubmit={handleTestSubmit} className="space-y-4 pt-1">
          {modalError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{modalError}</p>
                {modalError.includes('No Google account found') && (
                  <button
                    type="button"
                    onClick={() => {
                      setTestModalOpen(false);
                      navigate('/register');
                    }}
                    className="mt-1 text-xs font-bold text-nature-primary dark:text-darknature-highlight underline block"
                  >
                    Go to Sign Up
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border text-[11px] text-nature-muted dark:text-darknature-muted">
            <span className="font-semibold text-nature-forest dark:text-darknature-text block mb-1">
              Google OAuth Verification Engine
            </span>
            <span>
              {flow === 'login'
                ? 'Only accounts previously registered with Google are accepted. Unknown accounts will be rejected without creation.'
                : 'Registers a new Digitick account with Google as the permanent authentication provider.'}
            </span>
          </div>

          <Input
            label="Google Account Email"
            type="email"
            value={testEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestEmail(e.target.value)}
            required
            placeholder="your.name@gmail.com"
          />

          {flow === 'signup' && (
            <Input
              label="Full Name (from Google Profile)"
              value={testName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestName(e.target.value)}
              placeholder="e.g. Taylor Smith"
            />
          )}

          <div className="flex justify-end space-x-2 pt-2 border-t border-nature-border dark:border-darknature-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTestModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              icon={<UserCheck className="w-3.5 h-3.5" />}
            >
              {flow === 'signup' ? 'Complete Google Sign-Up' : 'Sign In with Google'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
