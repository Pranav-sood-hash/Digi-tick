import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { Mail, Lock, User, Leaf, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password.');
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password, fullName.trim());
      navigate('/', { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
            Smart Household Shopping Management Platform
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-nature-white dark:bg-darknature-card rounded-2xl p-6 border border-nature-border dark:border-darknature-border">
          <div className="mb-4">
            <h2 className="text-base font-bold text-nature-forest dark:text-darknature-text">
              Create your account
            </h2>
            <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
              Start replacing scattered WhatsApp messages and paper notes
            </p>
          </div>

          {/* Auto default list badge */}
          <div className="p-3 rounded-xl bg-nature-mint dark:bg-darknature-mint border border-nature-border dark:border-darknature-border text-xs text-nature-forest dark:text-darknature-highlight mb-4 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-nature-primary dark:text-darknature-primary flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[11px]">Instant Starter List Included</span>
              <span className="text-[11px] opacity-90">
                Your account is automatically provisioned with a default "Weekly Essentials" shopping list.
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400 mb-4 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Google Sign-Up Action */}
          <div className="mb-4">
            <GoogleAuthButton
              flow="signup"
              onError={(msg) => setErrorMsg(msg)}
            />

            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-nature-border dark:border-darknature-border"></div>
              <span className="flex-shrink mx-2 text-[10px] text-nature-muted uppercase tracking-wider font-semibold">
                Or sign up with email
              </span>
              <div className="flex-grow border-t border-nature-border dark:border-darknature-border"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              placeholder="e.g. Sarah Miller"
              icon={<User className="w-4 h-4" />}
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="sarah@household.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              loading={loading}
            >
              Sign Up & Get Started
            </Button>
          </form>

          <p className="text-center text-xs text-nature-muted dark:text-darknature-muted mt-5">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-nature-primary dark:text-darknature-highlight hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
