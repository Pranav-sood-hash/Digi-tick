import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Mail, ArrowLeft, CheckCircle2, Leaf } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-nature-offwhite dark:bg-darknature-bg font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-nature-forest dark:bg-darknature-primary text-white dark:text-darknature-bg mx-auto flex items-center justify-center mb-2.5">
            <Leaf className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
            Digitick
          </h1>
        </div>

        <div className="bg-nature-white dark:bg-darknature-card rounded-2xl p-6 border border-nature-border dark:border-darknature-border">
          <div className="mb-4">
            <h2 className="text-base font-bold text-nature-forest dark:text-darknature-text">
              Reset password
            </h2>
            <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
              Enter the email address registered with your account
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-3 space-y-2.5">
              <CheckCircle2 className="w-10 h-10 text-nature-primary mx-auto" />
              <h3 className="text-xs font-bold text-nature-forest dark:text-darknature-text">
                Password Reset Instructions Sent
              </h3>
              <p className="text-xs text-nature-muted dark:text-darknature-muted max-w-xs mx-auto">
                If an account exists for {email}, a recovery link has been delivered to your inbox.
              </p>
              <div className="pt-3">
                <Link to="/login">
                  <Button variant="outline" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
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

              <Button type="submit" variant="primary" size="md" className="w-full mt-2">
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center text-xs font-semibold text-nature-muted hover:text-nature-forest dark:hover:text-darknature-highlight space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
