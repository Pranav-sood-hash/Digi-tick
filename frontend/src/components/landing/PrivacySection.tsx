import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, MapPin, Database, EyeOff } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  const points = [
    {
      icon: Lock,
      title: 'Per-User Account Isolation',
      description: 'Your lists and items are protected by PostgreSQL Row Level Security (RLS). Only your authenticated session can access your data.',
    },
    {
      icon: MapPin,
      title: 'Optional Location Access',
      description: 'Location is only requested if you use the Nearby Stores feature. You can decline location access and all list features work 100%.',
    },
    {
      icon: EyeOff,
      title: 'No Data Brokering',
      description: 'We do not sell your grocery habits, email address, or shopping patterns to third-party advertisers or data brokers.',
    },
    {
      icon: Database,
      title: 'Secure Cloud Infrastructure',
      description: 'Encrypted storage with industry-standard JWT sessions, HTTPS in transit, and database backups.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-nature-offwhite dark:bg-nature-darkforest relative overflow-hidden border-t border-nature-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-nature-forest dark:text-nature-mint px-3 py-1 rounded-full bg-nature-mint dark:bg-nature-deepgreen border border-nature-forest/20">
            Privacy & Trust
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
            Your shopping information stays yours.
          </h2>
          <p className="text-sm sm:text-base text-nature-muted dark:text-nature-mint/80 leading-relaxed">
            We believe household tools should respect your privacy. Here is our straightforward promise to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={pt.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-white dark:bg-nature-card border border-nature-border dark:border-nature-forest/50 shadow-2xs hover:shadow-xs hover:border-nature-primary/40 dark:hover:border-nature-fresh/60 dark:hover:bg-[#1E4230] transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-nature-mint text-nature-forest dark:bg-nature-forest dark:text-nature-mintgreen flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-bold text-nature-forest dark:text-white mb-2">
                  {pt.title}
                </h3>
                <p className="text-xs text-nature-muted dark:text-[#C5D9CC] leading-relaxed">
                  {pt.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
