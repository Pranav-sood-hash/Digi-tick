import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Check,
  CheckCircle2,
  ScanLine,
  MapPin,
  Store,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface HeroDemoItem {
  id: string;
  name: string;
  qty: string;
  category: string;
  checked: boolean;
}

export const Hero: React.FC = () => {
  // Interactive Hero State
  const [stage, setStage] = useState<'paper' | 'scanning' | 'digital' | 'completed'>('paper');
  const [items, setItems] = useState<HeroDemoItem[]>([
    { id: '1', name: 'Fresh Farm Apples', qty: '1 kg', category: 'Produce', checked: true },
    { id: '2', name: 'Almond Milk', qty: '1 L', category: 'Dairy & Eggs', checked: true },
    { id: '3', name: 'Whole Wheat Sourdough', qty: '1 loaf', category: 'Bakery', checked: true },
    { id: '4', name: 'Organic Olive Oil', qty: '500 ml', category: 'Pantry', checked: false },
  ]);

  // Automated stage progression preview for visitors
  useEffect(() => {
    const timer1 = setTimeout(() => setStage('scanning'), 2200);
    const timer2 = setTimeout(() => setStage('digital'), 3800);
    const timer3 = setTimeout(() => {
      // Check last item
      setItems((prev) => prev.map((item) => ({ ...item, checked: true })));
    }, 5400);
    const timer4 = setTimeout(() => setStage('completed'), 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const toggleItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      const allChecked = updated.every((i) => i.checked);
      if (allChecked) {
        setStage('completed');
      } else if (stage === 'completed') {
        setStage('digital');
      }
      return updated;
    });
  };

  const resetHeroDemo = () => {
    setItems([
      { id: '1', name: 'Fresh Farm Apples', qty: '1 kg', category: 'Produce', checked: false },
      { id: '2', name: 'Almond Milk', qty: '1 L', category: 'Dairy & Eggs', checked: false },
      { id: '3', name: 'Whole Wheat Sourdough', qty: '1 loaf', category: 'Bakery', checked: false },
      { id: '4', name: 'Organic Olive Oil', qty: '500 ml', category: 'Pantry', checked: false },
    ]);
    setStage('digital');
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const progressPercent = Math.round((checkedCount / items.length) * 100);

  return (
    <section
      id="home"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-nature-offwhite via-nature-white to-nature-mint/30 dark:from-nature-darkforest dark:via-nature-deepgreen dark:to-nature-darkforest"
    >
      {/* Subtle Grid Background Pattern (Render-inspired) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b5e3b0a_1px,transparent_1px),linear-gradient(to_bottom,#1b5e3b0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative Organic Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-nature-primary/10 dark:bg-nature-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Nature Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-nature-mint dark:bg-nature-darkforest border border-nature-forest/20 dark:border-nature-mint/20 text-nature-forest dark:text-nature-mint text-xs font-semibold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-nature-primary" />
            <span>Smart Household Shopping Management</span>
            <span className="text-[10px] bg-nature-primary text-white px-1.5 py-0.2 rounded font-bold">
              v2.0
            </span>
          </motion.div>

          {/* Oversized Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-nature-forest dark:text-nature-white leading-[1.08]"
          >
            Your Shopping List.{' '}
            <span className="text-nature-primary dark:text-nature-fresh block sm:inline">
              Finally Sorted.
            </span>
          </motion.h1>

          {/* Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-nature-muted dark:text-nature-mint/80 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            From handwritten notes to organized digital shopping lists. Create, scan, manage, and
            discover nearby stores — all in one place.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-nature-forest hover:bg-nature-primary text-white text-sm font-bold flex items-center justify-center space-x-2.5 transition-all duration-150 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started — Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-nature-white dark:bg-nature-darkforest text-nature-forest dark:text-nature-mint border border-nature-border dark:border-nature-forest/40 text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-150 hover:bg-nature-mint/40 shadow-xs hover:border-nature-forest/40"
            >
              <span>Explore Features</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Subtitle Quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs text-nature-muted dark:text-nature-mint/60 italic pt-1"
          >
            Less confusion. Less forgotten shopping. More organized everyday living.
          </motion.p>
        </div>

        {/* HERO ANIMATION: INTERACTIVE FLUID SHOPPING DEMONSTRATION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 md:mt-16 max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl md:rounded-3xl bg-nature-white dark:bg-nature-darkforest border border-nature-border dark:border-nature-forest/40 shadow-xl overflow-hidden p-4 sm:p-6 md:p-8">
            {/* Window Chrome Bar */}
            <div className="flex items-center justify-between border-b border-nature-border/80 dark:border-nature-forest/30 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="text-xs font-mono text-nature-muted dark:text-nature-mint/60 ml-2 hidden sm:inline">
                  digitick.app/live-trip
                </span>
              </div>

              {/* Progress & Reset Controls */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 text-xs text-nature-muted dark:text-nature-mint/70">
                  <span className="font-bold text-nature-forest dark:text-nature-mint">
                    {checkedCount} / {items.length}
                  </span>
                  <span>items purchased</span>
                </div>
                <button
                  onClick={resetHeroDemo}
                  title="Reset Demo"
                  className="p-1 rounded-lg text-nature-muted hover:text-nature-forest dark:hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stage Indicator Stepper */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { key: 'paper', label: '1. Paper Note' },
                { key: 'scanning', label: '2. AI Scan' },
                { key: 'digital', label: '3. Digital List' },
                { key: 'completed', label: '4. Done & Stores' },
              ].map((s) => (
                <div
                  key={s.key}
                  onClick={() => setStage(s.key as any)}
                  className={`text-center py-1.5 px-2 rounded-lg text-[11px] font-semibold cursor-pointer transition-all duration-200 ${
                    stage === s.key
                      ? 'bg-nature-forest text-white shadow-xs'
                      : 'bg-nature-offwhite dark:bg-nature-deepgreen text-nature-muted dark:text-nature-mint/70 hover:text-nature-text'
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>

            {/* Dynamic Stage Canvas */}
            <div className="min-h-[280px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {/* STAGE 1: PAPER NOTE */}
                {stage === 'paper' && (
                  <motion.div
                    key="paper-stage"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 shadow-sm rotate-[-1deg] font-mono text-amber-950 relative"
                  >
                    <div className="flex items-center justify-between border-b border-amber-300/50 pb-2 mb-3">
                      <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
                        Handwritten Paper Note
                      </span>
                      <span className="text-[11px] text-amber-600">On fridge magnet</span>
                    </div>
                    <ul className="space-y-2 text-sm italic leading-relaxed">
                      <li>• 1kg fresh apples</li>
                      <li>• almond milk (1L carton)</li>
                      <li>• whole wheat sourdough bread</li>
                      <li>• olive oil (cold pressed)</li>
                    </ul>
                    <div className="mt-4 pt-3 border-t border-amber-300/40 flex items-center justify-between text-xs text-amber-800">
                      <span>Prone to loss or forgetting</span>
                      <button
                        onClick={() => setStage('scanning')}
                        className="px-2.5 py-1 rounded bg-amber-900 text-amber-100 font-bold text-xs flex items-center gap-1 hover:bg-amber-800"
                      >
                        <ScanLine className="w-3.5 h-3.5" />
                        <span>Scan List</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STAGE 2: SCANNING ANIMATION */}
                {stage === 'scanning' && (
                  <motion.div
                    key="scanning-stage"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md relative bg-nature-offwhite dark:bg-nature-deepgreen rounded-2xl p-6 border border-nature-border dark:border-nature-forest/40 text-center space-y-4"
                  >
                    <div className="relative w-20 h-20 mx-auto rounded-2xl bg-nature-mint text-nature-forest flex items-center justify-center">
                      <ScanLine className="w-10 h-10 animate-pulse text-nature-primary" />
                      {/* Laser Scanning Beam */}
                      <motion.div
                        initial={{ top: 0 }}
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="absolute left-0 right-0 h-1 bg-nature-primary shadow-[0_0_8px_#2E8B57]"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-nature-forest dark:text-nature-white">
                        AI OCR Engine Analyzing Handwriting...
                      </h4>
                      <p className="text-xs text-nature-muted dark:text-nature-mint/70 mt-1">
                        Extracting items, units, quantities, and grocery aisles.
                      </p>
                    </div>
                    <div className="w-48 mx-auto bg-nature-border dark:bg-nature-forest/40 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.6 }}
                        className="h-full bg-nature-primary"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STAGE 3: INTERACTIVE DIGITAL CHECKLIST */}
                {stage === 'digital' && (
                  <motion.div
                    key="digital-stage"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="w-full space-y-4"
                  >
                    {/* Real-time Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-nature-forest dark:text-nature-mint">
                          Trip Progress ({progressPercent}%)
                        </span>
                        <span className="text-nature-muted dark:text-nature-mint/70 text-[11px]">
                          Click items below to mark as purchased
                        </span>
                      </div>
                      <div className="w-full bg-nature-mint dark:bg-nature-deepgreen h-2.5 rounded-full overflow-hidden border border-nature-border/50">
                        <motion.div
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-nature-primary rounded-full"
                        />
                      </div>
                    </div>

                    {/* Interactive List Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-150 cursor-pointer ${
                            item.checked
                              ? 'bg-nature-mint/60 dark:bg-nature-deepgreen/80 border-nature-primary/40 text-nature-muted'
                              : 'bg-nature-white dark:bg-nature-card border-nature-border dark:border-nature-forest/30 hover:border-nature-primary/50 text-nature-forest dark:text-white shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                item.checked
                                  ? 'bg-nature-primary border-nature-primary text-white'
                                  : 'border-nature-muted/50 bg-nature-white dark:bg-nature-deepgreen dark:border-nature-forest'
                              }`}
                            >
                              {item.checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                            </div>
                            <div>
                              <span
                                className={`text-xs font-bold block ${
                                  item.checked ? 'line-through opacity-60' : ''
                                }`}
                              >
                                {item.name}
                              </span>
                              <span className="text-[10px] text-nature-muted dark:text-nature-mint/60">
                                {item.qty}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-nature-mint text-nature-forest dark:bg-nature-forest/40 dark:text-nature-mint border border-nature-fresh/20">
                            {item.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STAGE 4: COMPLETED LIST & NEARBY STORE RADAR */}
                {stage === 'completed' && (
                  <motion.div
                    key="completed-stage"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.4 }}
                    className="w-full space-y-4"
                  >
                    {/* Success Banner */}
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                          <strong className="block text-xs">
                            🎉 Shopping Completed! Moved to Completed Lists.
                          </strong>
                          <span className="text-[11px] opacity-80">
                            Trip preserved in your history archive for 1-click reuse.
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={resetHeroDemo}
                        className="text-[11px] font-bold underline text-emerald-700 dark:text-emerald-300 hover:opacity-80"
                      >
                        Reset Demo
                      </button>
                    </div>

                    {/* Nearby Stores Card Match */}
                    <div className="p-4 rounded-xl bg-nature-offwhite dark:bg-nature-deepgreen border border-nature-border dark:border-nature-forest/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-nature-mint text-nature-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-bold text-nature-forest dark:text-white text-xs">
                              Green Harvest Farmers Market
                            </h5>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-800">
                              0.3 km
                            </span>
                          </div>
                          <p className="text-[11px] text-nature-muted dark:text-nature-mint/70 mt-0.5">
                            Matches 2 categories on your list (Produce, Bakery)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                        <span className="text-[10px] text-nature-muted dark:text-nature-mint/60 italic">
                          Category-based match
                        </span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
