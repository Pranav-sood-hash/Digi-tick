import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileQuestion, MessageSquare, AlertTriangle, RefreshCcw, Layers, ArrowRight } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'paper' | 'digitick'>('paper');

  const problems = [
    {
      icon: FileQuestion,
      title: 'Lost Shopping Lists',
      description: 'Paper lists get misplaced, crumpled in pockets, or forgotten on the kitchen counter.',
    },
    {
      icon: MessageSquare,
      title: 'Scattered Messages',
      description: 'Household grocery needs get buried under dozens of unrelated WhatsApp chats and texts.',
    },
    {
      icon: AlertTriangle,
      title: 'Forgotten Products',
      description: 'Without real-time item tracking, shoppers miss crucial ingredients and make second trips.',
    },
    {
      icon: Layers,
      title: 'Disorganized Aisle Chaos',
      description: 'Random scribbles force you to crisscross supermarkets repeatedly instead of shop by aisle.',
    },
    {
      icon: RefreshCcw,
      title: 'Unnecessary Weekly Effort',
      description: 'Rewriting the same weekly milk, bread, and vegetable staples by hand every Saturday morning.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-nature-white dark:bg-nature-deepgreen relative overflow-hidden border-t border-nature-border/60 dark:border-nature-forest/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-nature-primary px-3 py-1 rounded-full bg-nature-mint dark:bg-nature-darkforest border border-nature-primary/20">
            The Everyday Reality
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
            Still managing your shopping on paper?
          </h2>
          <p className="text-sm sm:text-base text-nature-muted dark:text-nature-mint/80 leading-relaxed">
            Paper lists and fragmented WhatsApp messages were never built for modern household shopping.
            Here is why families waste hours every week.
          </p>
        </div>

        {/* 5 Problem Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <motion.div
                key={prob.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-nature-offwhite dark:bg-nature-darkforest/60 border border-nature-border dark:border-nature-forest/40 hover:border-nature-primary/40 transition-all duration-200 shadow-2xs hover:shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-nature-mint dark:bg-nature-forest/30 text-nature-forest dark:text-nature-fresh flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-bold text-nature-forest dark:text-white mb-2">
                  {prob.title}
                </h3>
                <p className="text-xs text-nature-muted dark:text-nature-mint/70 leading-relaxed">
                  {prob.description}
                </p>
              </motion.div>
            );
          })}

          {/* Callout Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-6 rounded-2xl bg-nature-forest text-white flex flex-col justify-between shadow-xs"
          >
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-nature-mint opacity-80 block mb-2">
                The Solution
              </span>
              <h3 className="text-lg font-bold leading-snug">
                One unified household system replaces the clutter.
              </h3>
              <p className="text-xs text-nature-mint/80 mt-2 leading-relaxed">
                Scan, type in comma-separated bulk, track live in aisles, and discover matching stores.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-nature-mint gap-1.5">
              <span>Explore the difference below</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        </div>

        {/* Interactive Before & After Transformation */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-nature-offwhite dark:bg-nature-darkforest border border-nature-border dark:border-nature-forest/40 p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-nature-border dark:border-nature-forest/40 pb-4 mb-6">
            <div>
              <h4 className="text-base font-bold text-nature-forest dark:text-white">
                Before & After Digitick
              </h4>
              <p className="text-xs text-nature-muted dark:text-nature-mint/70">
                Toggle below to see the transformation in household organization.
              </p>
            </div>
            <div className="flex items-center bg-nature-white dark:bg-nature-deepgreen p-1 rounded-xl border border-nature-border dark:border-nature-forest/40">
              <button
                onClick={() => setActiveTab('paper')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'paper'
                    ? 'bg-rose-100 text-rose-800 shadow-2xs'
                    : 'text-nature-muted hover:text-nature-text'
                }`}
              >
                The Old Way
              </button>
              <button
                onClick={() => setActiveTab('digitick')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'digitick'
                    ? 'bg-nature-forest text-white shadow-2xs'
                    : 'text-nature-muted hover:text-nature-text'
                }`}
              >
                The Digitick Way
              </button>
            </div>
          </div>

          {activeTab === 'paper' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 font-mono text-amber-900 text-xs space-y-1.5">
                <span className="font-bold text-[10px] uppercase text-amber-700 block">
                  Scattered Fridge Paper Note
                </span>
                <p className="line-through opacity-70">Eggs (which brand?)</p>
                <p>Bread (forgot to write whole wheat)</p>
                <p className="italic">Tomatoes (smudged ink...)</p>
                <p className="text-[10px] text-rose-600 mt-2 font-bold">⚠️ Left at home on counter</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <span className="font-bold text-[10px] uppercase text-emerald-800 block">
                  WhatsApp Family Group Chat
                </span>
                <div className="bg-white p-2 rounded-lg shadow-2xs text-[11px]">
                  "Please bring milk, butter, and laundry detergent if you pass the mart!"
                </div>
                <div className="bg-white p-2 rounded-lg shadow-2xs text-[11px] opacity-75">
                  "Also forgot coffee filters!!" (Sent 2 hours ago)
                </div>
                <p className="text-[10px] text-rose-600 font-bold">
                  ⚠️ Buried under 45 other conversation messages
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-nature-white dark:bg-nature-card border border-nature-primary/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-nature-forest dark:text-nature-mint bg-nature-mint dark:bg-nature-forest/40 px-2 py-0.5 rounded">
                  Weekly Essentials — Active Trip
                </span>
                <span className="text-xs font-bold text-nature-primary">
                  100% Synced Across Devices
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-nature-mint/50 dark:bg-nature-deepgreen flex items-center justify-between">
                  <span className="font-semibold text-nature-forest dark:text-white">Farm Eggs (12 pcs)</span>
                  <span className="text-[10px] text-nature-muted">Dairy</span>
                </div>
                <div className="p-2.5 rounded-lg bg-nature-mint/50 dark:bg-nature-deepgreen flex items-center justify-between">
                  <span className="font-semibold text-nature-forest dark:text-white">Sourdough (1 loaf)</span>
                  <span className="text-[10px] text-nature-muted">Bakery</span>
                </div>
                <div className="p-2.5 rounded-lg bg-nature-mint/50 dark:bg-nature-deepgreen flex items-center justify-between">
                  <span className="font-semibold text-nature-forest dark:text-white">Coffee Beans (250g)</span>
                  <span className="text-[10px] text-nature-muted">Pantry</span>
                </div>
              </div>
              <p className="text-[11px] text-nature-primary font-semibold pt-1">
                ✓ Auto-categorized • Checkboxes update progress live • Nearby stores suggested
              </p>
            </div>
          )}

          {/* Closing Punchline */}
          <div className="mt-8 text-center pt-6 border-t border-nature-border dark:border-nature-forest/40">
            <p className="text-base sm:text-lg font-bold text-nature-forest dark:text-nature-mint">
              "Your household shopping deserves something better."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
