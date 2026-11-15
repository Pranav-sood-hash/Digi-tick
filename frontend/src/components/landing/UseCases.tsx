import React from 'react';
import { motion } from 'framer-motion';
import { Apple, ShoppingBag, Sparkles, UtensilsCrossed, BookOpen, CheckSquare } from 'lucide-react';

export const UseCases: React.FC = () => {
  const cases = [
    {
      icon: Apple,
      title: 'Weekly Groceries',
      items: ['Fresh organic vegetables', 'Milk & pasture eggs', 'Whole grain sourdough', 'Seasonal berries'],
      badge: 'Most Popular',
    },
    {
      icon: ShoppingBag,
      title: 'Monthly Household Staples',
      items: ['Basmati rice & flour', 'Cold pressed olive oil', 'Eco laundry detergent', 'Paper supplies & cleaning'],
      badge: 'Monthly Routine',
    },
    {
      icon: Sparkles,
      title: 'Personal Care & Hygiene',
      items: ['Herbal shampoo', 'Fluoride toothpaste', 'Handmade soap', 'Skincare essentials'],
      badge: 'Self-Care',
    },
    {
      icon: UtensilsCrossed,
      title: 'Kitchen & Cooking Supplies',
      items: ['Parchment baking paper', 'Aluminum foil', 'Ground spice refill', 'Coffee filter cones'],
      badge: 'Pantry',
    },
    {
      icon: BookOpen,
      title: 'Stationery & Home Office',
      items: ['Lined notebooks', 'Gel ink pens', 'Printer paper ream', 'Desk sticky notes'],
      badge: 'Work & School',
    },
    {
      icon: CheckSquare,
      title: 'General Household Errands',
      items: ['Hardware screws & tape', 'Pet food & treats', 'Garden soil & seeds', 'Light bulbs'],
      badge: 'Errands',
    },
  ];

  return (
    <section id="discover" className="py-20 md:py-28 bg-nature-white dark:bg-nature-deepgreen relative overflow-hidden border-t border-nature-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-nature-primary bg-nature-mint dark:bg-nature-darkforest px-3 py-1 rounded-full border border-nature-primary/20">
            Versatile Use Cases
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
            Not just groceries. Everything your household needs.
          </h2>
          <p className="text-sm sm:text-base text-nature-muted dark:text-nature-mint/80 leading-relaxed">
            Digitick adapts to every kind of household checklist — from weekend farmer's markets to
            large monthly pantry restocks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-3xl bg-nature-offwhite dark:bg-nature-darkforest border border-nature-border dark:border-nature-forest/40 hover:border-nature-primary/40 transition-all duration-200 shadow-2xs hover:shadow-xs group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-nature-mint dark:bg-nature-deepgreen text-nature-forest dark:text-nature-mint flex items-center justify-center transition-transform group-hover:scale-110">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-bold text-nature-forest dark:text-nature-mint bg-nature-mint dark:bg-nature-deepgreen px-2.5 py-1 rounded-full border border-nature-forest/10">
                    {c.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-nature-forest dark:text-white mb-3">
                  {c.title}
                </h3>

                <ul className="space-y-2 text-xs text-nature-muted dark:text-nature-mint/70 border-t border-nature-border dark:border-nature-forest/30 pt-3">
                  {c.items.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-nature-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
