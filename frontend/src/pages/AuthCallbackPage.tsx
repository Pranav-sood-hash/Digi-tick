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

  useEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;
    let active = true;

    const handleOAuthCallback = async () => {
      try {
        // 1. Detect OAuth errors from query parameters or hash fragment
        const searchError = searchParams.get('error_description') || searchParams.get('error');
        const hash = window.location.hash;
        let hashError = '';
        if (hash) {
          const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
          hashError = hashParams.get('error_description') || hashParams.get('error') || '';
        }

        const oauthError = searchError || hashError;
        if (oauthError) {
          throw new Error(decodeURIComponent(oauthError.replace(/\+/g, ' ')));
        }

        if (!supabase) {
          throw new Error('Supabase client is not initialized');
        }
        const client = supabase;

        // 2. If PKCE authorization code is present in query, exchange it
        const code = searchParams.get('code');
        if (code) {
          try {
            await client.auth.exchangeCodeForSession(code);
          } catch (codeErr: any) {
            console.warn('PKCE code exchange error:', codeErr);
          }
        }

        // 3. Helper function to authenticate session with backend
        const processSession = async (session: any): Promise<boolean> => {
          if (!session?.user?.email) return false;

          const email = session.user.email;
          const fullName =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            email.split('@')[0];
          const avatarUrl =
            session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture;

          const result = await authApi.googleAuth({
            email,
            full_name: fullName,
            avatar_url: avatarUrl,
            sub: session.user.id,
            flow,
          });

          if (!active) return true;

          // Establish session in context and localStorage
          setSession(result.access_token, result.user);
          setStatus('success');

          // Smooth redirect to dashboard
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 300);
          return true;
        };

        // 4. Check initial session from getSession()
        const { data: { session: initialSession }, error: sessionError } = await client.auth.getSession();
        if (sessionError) throw sessionError;

        if (initialSession && (await processSession(initialSession))) {
          return;
        }

        // 5. If not immediately ready, listen for onAuthStateChange with timeout
        let resolved = false;
        const { data: authListener } = client.auth.onAuthStateChange(async (event, session) => {
          if (resolved) return;
          if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
            resolved = true;
            await processSession(session);
          }
        });

        // 6. Graceful timeout: wait up to 4 seconds for session resolution
        setTimeout(async () => {
          if (resolved || !active) return;
          authListener?.subscription?.unsubscribe();

          // Final attempt to get session
          const { data: { session: finalSession } } = await client.auth.getSession();
          if (finalSession && (await processSession(finalSession))) {
            return;
          }

          if (active) {
            setStatus('error');
            setErrorMessage('Unable to retrieve verified session from Google. Please try signing in again.');
          }
        }, 4000);

      } catch (err: any) {
        if (!active) return;
        setStatus('error');
        setErrorMessage(err.message || 'Authentication failed. Please try again.');
      }
    };

    handleOAuthCallback();

    return () => {
      active = false;
    };
  }, [flow, navigate, searchParams, setSession]);

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
          <p className="text-xs text-nature-muted dark:text-darknature-muted">
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
              Confirming credentials and synchronizing your shopping lists.
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

        {/* Error State */}
        {status === 'error' && (
          <div className="bg-nature-white dark:bg-darknature-card rounded-2xl p-6 border border-nature-border dark:border-darknature-border space-y-4 animate-fadeIn">
            <div className="flex items-start space-x-3 text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-nature-forest dark:text-darknature-text mb-1">
                  Authentication Issue
                </h3>
                <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-nature-border dark:border-darknature-border flex flex-col space-y-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Try Sign In Again
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/register')}
                className="w-full"
              >
                Create Account with Email
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
