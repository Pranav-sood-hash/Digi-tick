import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'What is Digitick?',
      answer:
        'Digitick is a modern, environmentally-designed household shopping management platform that helps you create, organize, scan, and track shopping checklists across your family devices.',
    },
    {
      question: 'Can I scan a handwritten shopping list?',
      answer:
        'Yes! You can take a photograph using your smartphone camera or upload an image file from your computer. Digitick’s OCR and Vision AI transcribe your handwritten notes into an editable digital list with quantities and categories.',
    },
    {
      question: 'Can I create multiple shopping lists?',
      answer:
        'Yes. You can manage separate shopping lists simultaneously — for example, "Weekly Produce", "Monthly Pantry Staples", "Hardware Supplies", or "Party Groceries".',
    },
    {
      question: 'Can I use Digitick without location permission?',
      answer:
        'Yes, absolutely. All core shopping list management, OCR scanning, checkbox tracking, and history features work 100% without granting location access. Location is only used if you choose to explore Nearby Stores.',
    },
    {
      question: 'How does Nearby Stores work?',
      answer:
        'Nearby Stores uses your device location and the unpurchased categories on your active shopping list (such as Produce, Bakery, or Dairy) to highlight relevant neighborhood businesses and farmers markets within your radius.',
    },
    {
      question: 'Does Digitick guarantee that a store has a particular product?',
      answer:
        'No. Store recommendations are based on store business categories (e.g., Bakeries stock bread, Produce marts stock vegetables). Digitick does not track or guarantee live retail store inventories.',
    },
    {
      question: 'Can I access previous shopping lists?',
      answer:
        'Yes. When you check off all items on an active trip, the list automatically moves into Completed Lists. You can view past dates, print receipts, export clean PDFs, or duplicate any past trip into a fresh active list with 1 click.',
    },
    {
      question: 'Is Digitick free?',
      answer:
        'Yes! Digitick is completely free to use for personal household shopping management, with zero hidden paywalls or subscription traps for all core features.',
    },
    {
      question: 'Can I use Digitick on my phone?',
      answer:
        'Yes. Digitick is fully responsive across desktop, tablet, and mobile devices, including bottom thumb navigation and rear-camera scanning on smartphones.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-nature-white dark:bg-nature-deepgreen relative overflow-hidden border-t border-nature-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-nature-primary bg-nature-mint dark:bg-nature-darkforest px-3 py-1 rounded-full border border-nature-primary/20">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-nature-muted dark:text-nature-mint/80 leading-relaxed">
            Everything you need to know about using Digitick for your household shopping.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-nature-offwhite dark:bg-nature-darkforest border border-nature-border dark:border-nature-forest/40 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-nature-forest dark:text-white focus:outline-none cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-nature-primary transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs text-nature-muted dark:text-nature-mint/80 leading-relaxed border-t border-nature-border/60 dark:border-nature-forest/30 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
