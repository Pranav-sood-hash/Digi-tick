import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { Mail, Lock, Sparkles, Leaf, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAccountNotFound, setIsAccountNotFound] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsAccountNotFound(false);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Invalid email or password';
      setErrorMsg(msg);
      if (
        msg.includes('No account found') ||
        msg.includes("doesn't exist") ||
        msg.includes('sign up first')
      ) {
        setIsAccountNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@digitick.com');
    setPassword('Digitick2026!');
    setLoading(true);
    try {
      try {
        await login('demo@digitick.com', 'Digitick2026!');
      } catch {
        await authApi.register('demo@digitick.com', 'Digitick2026!', 'Demo Shopper');
        await login('demo@digitick.com', 'Digitick2026!');
      }
      navigate('/');
    } catch (err: any) {
      setErrorMsg('Could not start demo session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-nature-offwhite dark:bg-darknature-bg font-sans">
      <div className="w-full max-w-sm">
        {/* Brand Logo & Title */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-nature-forest dark:bg-darknature-primary text-white dark:text-darknature-bg mx-auto flex items-center justify-center mb-2.5">
            <Leaf className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
            Digitick
          </h1>
          <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
            Your Shopping. Organized. Simplified.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-nature-white dark:bg-darknature-card rounded-2xl p-6 border border-nature-border dark:border-darknature-border">
          <div className="mb-5">
            <h2 className="text-base font-bold text-nature-forest dark:text-darknature-text">
              Welcome back
            </h2>
            <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
              Enter your household credentials to sign in
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 mb-4 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="font-semibold">{errorMsg}</p>
              </div>
              {isAccountNotFound && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="w-full mt-1"
                >
                  Create Account
                </Button>
              )}
            </div>
          )}

          {/* Google Sign-In Action */}
          <div className="mb-4">
            <GoogleAuthButton
              flow="login"
              onError={(msg, notRegistered) => {
                setErrorMsg(msg);
                setIsAccountNotFound(Boolean(notRegistered));
              }}
            />

            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-nature-border dark:border-darknature-border"></div>
              <span className="flex-shrink mx-2 text-[10px] text-nature-muted uppercase tracking-wider font-semibold">
                Or sign in with email
              </span>
              <div className="flex-grow border-t border-nature-border dark:border-darknature-border"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@household.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-nature-forest dark:text-darknature-highlight">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-nature-primary dark:text-darknature-highlight hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-4 pt-4 border-t border-nature-border dark:border-darknature-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full"
              icon={<Sparkles className="w-4 h-4 text-nature-primary dark:text-darknature-primary" />}
              onClick={handleDemoLogin}
              loading={loading}
            >
              1-Click Demo Evaluation Login
            </Button>
          </div>

          <p className="text-center text-xs text-nature-muted dark:text-darknature-muted mt-5">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-nature-primary dark:text-darknature-highlight hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
