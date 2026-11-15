import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Sparkles,
  Camera,
  History,
  Store,
  RefreshCw,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

export const Introduction: React.FC = () => {
  const capabilities = [
    {
      icon: CheckSquare,
      title: 'Smart Multi-List System',
      description: 'Create distinct lists for weekly groceries, party supplies, hardware, or monthly pantry essentials.',
    },
    {
      icon: Sparkles,
      title: 'Instant Comma-Separated Input',
      description: 'Type "Milk, Bread, 2 Apples" and Digitick splits them into individual items with quantities.',
    },
    {
      icon: Camera,
      title: 'AI Paper Note Scanner',
      description: 'Snap a picture of your handwritten fridge note. Digitick transcribes and categorizes it automatically.',
    },
    {
      icon: History,
      title: 'Permanent Shopping Ledger',
      description: 'Completed lists never disappear — review dates, quantities, and items whenever you need.',
    },
    {
      icon: RefreshCw,
      title: '1-Click List Duplication',
      description: 'Never retype your weekly staples. Replicate any past trip into a fresh active list with one click.',
    },
    {
      icon: Store,
      title: 'Category-Based Store Radar',
      description: 'Matches unpurchased items to nearby specialty grocers, bakeries, and farmers markets.',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-nature-offwhite dark:bg-nature-darkforest relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-nature-forest dark:text-nature-mint px-3 py-1 rounded-full bg-nature-mint dark:bg-nature-deepgreen border border-nature-forest/20">
            Unified Platform
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight leading-tight">
            One place for everything on your shopping list.
          </h2>
          <p className="text-sm sm:text-base text-nature-muted dark:text-nature-mint/80 leading-relaxed">
            Digitick is a smart household shopping management platform designed to replace scattered
            notes, forgotten items, and messy paper lists with structured, beautiful convenience.
          </p>
        </div>

        {/* 6 Capabilities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-white dark:bg-nature-card border border-nature-border dark:border-nature-forest/50 shadow-2xs hover:shadow-xs hover:border-nature-primary/40 dark:hover:border-nature-fresh/60 dark:hover:bg-[#1E4230] transition-all duration-150 group"
              >
                <div className="w-10 h-10 rounded-xl bg-nature-mint text-nature-forest dark:bg-nature-forest dark:text-nature-mintgreen flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-bold text-nature-forest dark:text-white mb-2">
                  {cap.title}
                </h3>
                <p className="text-xs text-nature-muted dark:text-[#C5D9CC] leading-relaxed">
                  {cap.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Realistic Dashboard Showcase Card */}
        <div className="rounded-3xl bg-nature-forest text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-nature-mint bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                Intuitive Experience
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Designed for everyday clarity on desktop and mobile.
              </h3>
              <p className="text-xs sm:text-sm text-nature-mint/80 leading-relaxed">
                Clean flat aesthetics, generous spacing, high contrast for bright store aisles, and
                instant synchronisation with your Supabase account.
              </p>

              <div className="pt-2 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-nature-mint">
                  <ShieldCheck className="w-4 h-4 text-nature-fresh flex-shrink-0" />
                  <span>Private and encrypted per-user storage</span>
                </div>
                <div className="flex items-center space-x-2 text-nature-mint">
                  <ShieldCheck className="w-4 h-4 text-nature-fresh flex-shrink-0" />
                  <span>Automatic Starter "Weekly Essentials" list included</span>
                </div>
                <div className="flex items-center space-x-2 text-nature-mint">
                  <ShieldCheck className="w-4 h-4 text-nature-fresh flex-shrink-0" />
                  <span>Full Light and Dark Mode support</span>
                </div>
              </div>
            </div>

            {/* Dashboard Visual Representation */}
            <div className="lg:col-span-7 bg-nature-white dark:bg-nature-deepgreen rounded-2xl p-4 sm:p-6 text-nature-text dark:text-white border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between border-b border-nature-border pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4 text-nature-primary" />
                  <span className="font-bold text-xs text-nature-forest dark:text-nature-mint">
                    Household Dashboard
                  </span>
                </div>
                <span className="text-[10px] bg-nature-mint text-nature-forest px-2 py-0.5 rounded font-bold">
                  Active
                </span>
              </div>

              {/* Sample Mini Cards */}
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="p-2.5 rounded-xl bg-nature-offwhite dark:bg-nature-darkforest border border-nature-border">
                  <span className="text-[10px] text-nature-muted block">Active Lists</span>
                  <span className="text-base font-extrabold text-nature-forest dark:text-nature-mint">
                    2
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-nature-offwhite dark:bg-nature-darkforest border border-nature-border">
                  <span className="text-[10px] text-nature-muted block">Total Items</span>
                  <span className="text-base font-extrabold text-nature-primary">14</span>
                </div>
                <div className="p-2.5 rounded-xl bg-nature-offwhite dark:bg-nature-darkforest border border-nature-border">
                  <span className="text-[10px] text-nature-muted block">Completed Trips</span>
                  <span className="text-base font-extrabold text-nature-forest dark:text-nature-mint">
                    8
                  </span>
                </div>
              </div>

              {/* Sample Trip Row */}
              <div className="p-3 rounded-xl bg-nature-mint/60 dark:bg-nature-darkforest border border-nature-primary/30 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-nature-forest dark:text-white text-xs">
                    Weekly Grocery Essentials
                  </h4>
                  <p className="text-[10px] text-nature-muted dark:text-nature-mint/70">
                    6 of 8 items purchased (75%)
                  </p>
                </div>
                <div className="w-24 bg-nature-white h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-nature-primary w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
