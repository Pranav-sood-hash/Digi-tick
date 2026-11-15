import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { AlertCircle, CheckCircle2, Leaf, Loader2 } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const hasExecutedRef = useRef(false);

  const flow = (searchParams.get('flow') || 'login') as 'login' | 'signup';
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const [isNotRegistered, setIsNotRegistered] = useState(false);

  useEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;
    let active = true;

    const handleOAuthCallback = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session || !session.user || !session.user.email) {
          throw new Error('No verified email received from Google authentication.');
        }

        const email = session.user.email;
        const fullName =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          email.split('@')[0];
        const avatarUrl =
          session.user.user_metadata?.avatar_url ||
          session.user.user_metadata?.picture;

        // Verify with backend gatekeeper
        const result = await authApi.googleAuth({
          email,
          full_name: fullName,
          avatar_url: avatarUrl,
          sub: session.user.id,
          flow,
        });

        if (!active) return;

        // Immediately establish session in context
        setSession(result.access_token, result.user);
        setStatus('success');

        // Redirect directly to dashboard without bouncing back
        navigate('/dashboard', { replace: true });
      } catch (err: any) {
        if (!active) return;
        setStatus('error');
        const detail = err.message || 'Authentication failed';
        setErrorMessage(detail);

        if (
          detail.includes("doesn't exist") ||
          detail.includes('sign up first') ||
          detail.includes('No Google account found')
        ) {
          setIsNotRegistered(true);
        }

        // Clean up ephemeral Supabase session if rejected
        try {
          if (supabase) await supabase.auth.signOut();
        } catch {}
      }
    };

    handleOAuthCallback();

    return () => {
      active = false;
    };
  }, [flow, navigate, setSession]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-nature-offwhite dark:bg-darknature-bg font-sans">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-nature-forest dark:bg-darknature-primary text-white dark:text-darknature-bg mx-auto flex items-center justify-center mb-2.5">
            <Leaf className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
            Digitick
          </h1>
          <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
            Google Authentication Engine
          </p>
        </div>

        {/* Processing State */}
        {status === 'processing' && (
          <div className="bg-nature-white dark:bg-darknature-card rounded-2xl p-6 border border-nature-border dark:border-darknature-border text-center space-y-3">
            <Loader2 className="w-8 h-8 text-nature-primary dark:text-darknature-primary animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-nature-forest dark:text-darknature-text">
              Verifying Google Account...
            </h3>
            <p className="text-xs text-nature-muted dark:text-darknature-muted">
              Confirming registration credentials with Supabase security guard.
            </p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="bg-nature-white dark:bg-darknature-card rounded-2xl p-6 border border-nature-border dark:border-darknature-border text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-nature-forest dark:text-darknature-text">
              {flow === 'signup' ? 'Google Account Created!' : 'Authenticated with Google'}
            </h3>
            <p className="text-xs text-nature-muted dark:text-darknature-muted">
              Redirecting to your Digitick dashboard...
            </p>
          </div>
        )}

        {/* Error / Account Not Found State */}
        {status === 'error' && (
          <div className="bg-nature-white dark:bg-darknature-card rounded-2xl p-6 border border-nature-border dark:border-darknature-border space-y-4 animate-fadeIn">
            <div className="flex items-start space-x-3 text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-nature-forest dark:text-darknature-text mb-1">
                  {isNotRegistered ? 'Account Not Registered' : 'Authentication Rejected'}
                </h3>
                <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-nature-border dark:border-darknature-border flex flex-col space-y-2">
              {isNotRegistered ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/register')}
                  className="w-full"
                >
                  Create Account
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Go to Sign In
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
