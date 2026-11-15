import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Sliders, ShoppingCart, Archive, ArrowRight, Check } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Create',
      tagline: 'Start fresh or scan paper',
      description: 'Create a new shopping list with individual items, comma-separated bulk text, or snap a photo of your fridge notes.',
      icon: PlusCircle,
      detail: 'Supports typing, camera upload, or 1-click starter template.',
    },
    {
      number: '02',
      title: 'Organize',
      tagline: 'Quantities & aisle groupings',
      description: 'Adjust quantities, set units (kg, L, pack, loaf), and organize items into standard store categories.',
      icon: Sliders,
      detail: 'Auto-categorization saves walking back and forth across supermarket aisles.',
    },
    {
      number: '03',
      title: 'Shop',
      tagline: 'Track purchases in real time',
      description: 'Visit nearby recommended stores and check items off as you place them into your basket.',
      icon: ShoppingCart,
      detail: 'Real-time progress bar shows remaining items and percent complete.',
    },
    {
      number: '04',
      title: 'Complete',
      tagline: 'Automated history ledger',
      description: 'The moment your final item is marked as purchased, your trip automatically archives into Completed Lists.',
      icon: Archive,
      detail: 'Replicate anytime for future weekly trips with a single click.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-nature-offwhite dark:bg-nature-darkforest relative overflow-hidden border-t border-nature-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-nature-forest dark:text-nature-mint px-3 py-1 rounded-full bg-nature-mint dark:bg-nature-deepgreen border border-nature-forest/20">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
            From shopping idea to shopping done.
          </h2>
          <p className="text-sm sm:text-base text-nature-muted dark:text-nature-mint/80 leading-relaxed">
            Digitick streamlines your entire grocery routine into an intuitive, satisfying journey.
          </p>
        </div>

        {/* Connected Horizontal Timeline Stepper */}
        <div className="relative mb-12 hidden md:block">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-nature-border dark:bg-nature-forest/40 -translate-y-1/2 z-0" />
          {/* Active Filled Line */}
          <div
            className="absolute top-1/2 left-0 h-1 bg-nature-primary -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />

          <div className="relative z-10 flex justify-between">
            {steps.map((step, idx) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-200 cursor-pointer ${
                  activeStep >= idx
                    ? 'bg-nature-forest text-white shadow-md scale-105 ring-4 ring-nature-mint dark:ring-nature-deepgreen'
                    : 'bg-nature-white dark:bg-nature-card text-nature-muted border border-nature-border'
                }`}
              >
                {activeStep > idx ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.number}
              </button>
            ))}
          </div>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-3xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-nature-white dark:bg-nature-card border-nature-primary ring-2 ring-nature-primary/20 shadow-md scale-[1.02]'
                    : 'bg-nature-white/70 dark:bg-nature-card/60 border-nature-border dark:border-nature-forest/30 hover:border-nature-primary/40'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-nature-primary bg-nature-mint dark:bg-nature-deepgreen px-2 py-0.5 rounded-md">
                    {step.number}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-nature-mint text-nature-forest flex items-center justify-center">
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-nature-forest dark:text-white mb-1">
                  {step.title}
                </h3>
                <span className="text-[11px] font-semibold text-nature-primary block mb-2.5">
                  {step.tagline}
                </span>

                <p className="text-xs text-nature-muted dark:text-nature-mint/70 leading-relaxed mb-4">
                  {step.description}
                </p>

                <div className="pt-3 border-t border-nature-border dark:border-nature-forest/30 text-[11px] text-nature-forest dark:text-nature-mint font-medium">
                  {step.detail}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
