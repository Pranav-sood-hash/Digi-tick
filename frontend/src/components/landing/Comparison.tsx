import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export const Comparison: React.FC = () => {
  const comparisonRows = [
    {
      feature: 'List Durability',
      traditional: 'Paper lists get lost, torn, or left on the kitchen fridge',
      digitick: 'Digital lists stay safely synced across your phone and laptop',
    },
    {
      feature: 'Household Communication',
      traditional: 'Items buried under dozens of unrelated WhatsApp chat messages',
      digitick: 'One clean, dedicated household shopping list for the family',
    },
    {
      feature: 'In-Store Progress Tracking',
      traditional: 'Crisscrossing aisles trying to remember what you already picked up',
      digitick: '1-tap checkboxes with live percentage progress bar',
    },
    {
      feature: 'Weekly Routine Creation',
      traditional: 'Rewriting the same milk, bread, and egg staples every week',
      digitick: '1-click duplication of any past completed shopping trip',
    },
    {
      feature: 'Store Navigation',
      traditional: 'Searching Google Maps separately for bakeries and vegetable marts',
      digitick: 'Smart store recommendations matching your unbought list items',
    },
    {
      feature: 'Purchase Record',
      traditional: 'Scattered paper receipts or zero memory of past ingredient dates',
      digitick: 'Centralized completed shopping history ledger with PDF exports',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-nature-white dark:bg-nature-deepgreen relative overflow-hidden border-t border-nature-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-nature-primary bg-nature-mint dark:bg-nature-darkforest px-3 py-1 rounded-full border border-nature-primary/20">
            Honest Comparison
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
            Less remembering. More living.
          </h2>
          <p className="text-sm sm:text-base text-nature-muted dark:text-nature-mint/80 leading-relaxed">
            See how Digitick turns the friction of everyday grocery runs into an organized, stress-free routine.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-nature-offwhite dark:bg-nature-darkforest border border-nature-border dark:border-nature-forest/40 overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 bg-nature-forest text-white p-4 sm:p-5 text-xs font-bold uppercase tracking-wider">
            <div className="col-span-4 sm:col-span-3">Feature</div>
            <div className="col-span-4 sm:col-span-4 text-rose-200">Traditional Shopping</div>
            <div className="col-span-4 sm:col-span-5 text-nature-mint flex items-center gap-1.5">
              <span>The Digitick Way</span>
            </div>
          </div>

          <div className="divide-y divide-nature-border dark:divide-nature-forest/30">
            {comparisonRows.map((row, idx) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="grid grid-cols-12 p-4 sm:p-5 text-xs items-center hover:bg-nature-white/50 dark:hover:bg-nature-card/40 transition-colors"
              >
                <div className="col-span-4 sm:col-span-3 font-bold text-nature-forest dark:text-white pr-2">
                  {row.feature}
                </div>
                <div className="col-span-4 sm:col-span-4 text-nature-muted flex items-start space-x-2 pr-3">
                  <X className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{row.traditional}</span>
                </div>
                <div className="col-span-4 sm:col-span-5 font-semibold text-nature-forest dark:text-nature-mint flex items-start space-x-2">
                  <Check className="w-4 h-4 text-nature-primary flex-shrink-0 mt-0.5 stroke-[2.5]" />
                  <span className="leading-relaxed">{row.digitick}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
