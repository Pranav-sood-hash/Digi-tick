import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles, CheckCircle2 } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-nature-deepgreen text-white relative overflow-hidden border-t border-nature-forest/40">
      {/* Decorative Gradient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-nature-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b5e3b12_1px,transparent_1px),linear-gradient(to_bottom,#1b5e3b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-nature-forest/60 border border-nature-mint/20 text-nature-mint text-xs font-semibold shadow-xs"
        >
          <Leaf className="w-3.5 h-3.5 text-nature-fresh" />
          <span>Start Organizing Today — 100% Free</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight"
        >
          Make every shopping trip{' '}
          <span className="text-nature-fresh block sm:inline">a little simpler.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base sm:text-lg text-nature-mint/80 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Bring your shopping lists together. Stay organized. Never lose track of what you need.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-nature-primary hover:bg-nature-fresh text-white text-sm font-bold flex items-center justify-center space-x-2.5 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <span>Get Started — Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-nature-forest/80 hover:bg-nature-forest text-nature-mint border border-nature-mint/30 text-sm font-bold flex items-center justify-center transition-all hover:scale-105"
          >
            <span>Explore Demo</span>
          </a>
        </motion.div>

        {/* Floating Perks Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-nature-mint/70">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-nature-fresh" />
            <span>Instant "Weekly Essentials" Starter List</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-nature-fresh" />
            <span>Google & Manual Auth</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-nature-fresh" />
            <span>No Credit Card Required</span>
          </div>
        </div>
      </div>
    </section>
  );
};
