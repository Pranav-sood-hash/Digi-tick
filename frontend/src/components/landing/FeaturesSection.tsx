import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Camera,
  CheckCircle2,
  History,
  Store,
  Shield,
  ArrowRight,
  ScanLine,
  Printer,
  Copy,
  Check
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  // Feature 1 demo state
  const [commaText, setCommaText] = useState('Apple, Banana, 2L Milk, Whole Wheat Bread, 6 Eggs');
  const [parsedItems, setParsedItems] = useState([
    { name: 'Apple', qty: '1 qty', cat: 'Produce' },
    { name: 'Banana', qty: '1 qty', cat: 'Produce' },
    { name: 'Milk', qty: '2L', cat: 'Dairy & Eggs' },
    { name: 'Whole Wheat Bread', qty: '1 loaf', cat: 'Bakery' },
    { name: 'Eggs', qty: '6 pcs', cat: 'Dairy & Eggs' },
  ]);

  const handleParse = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = commaText.split(',').map((p) => p.trim()).filter(Boolean);
    setParsedItems(
      parts.map((p) => ({
        name: p,
        qty: '1 qty',
        cat: p.toLowerCase().includes('milk') || p.toLowerCase().includes('egg') ? 'Dairy & Eggs' : 'Produce',
      }))
    );
  };

  // Feature 3 demo state
  const [trackerItems, setTrackerItems] = useState([
    { id: 1, name: 'Fresh Farm Tomatoes', checked: true },
    { id: 2, name: 'Greek Yogurt', checked: true },
    { id: 3, name: 'Brown Rice', checked: false },
  ]);

  const toggleTracker = (id: number) => {
    setTrackerItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const trackerDone = trackerItems.filter((i) => i.checked).length;
  const trackerPct = Math.round((trackerDone / trackerItems.length) * 100);

  return (
    <div id="features" className="py-20 md:py-28 bg-nature-white dark:bg-nature-deepgreen space-y-24 md:space-y-36">
      {/* FEATURE 01: SMART LIST CREATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-5"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-nature-primary bg-nature-mint dark:bg-nature-darkforest px-3 py-1 rounded-full border border-nature-primary/20">
              FEATURE 01 — Instant Creation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
              Create your list in seconds.
            </h2>
            <p className="text-sm text-nature-muted dark:text-nature-mint/80 leading-relaxed">
              Add products individually with quantity selectors, or simply paste a comma-separated
              sentence. Digitick automatically extracts quantities, units, and assigns store aisles.
            </p>
            <div className="p-3.5 rounded-xl bg-nature-offwhite dark:bg-nature-darkforest border border-nature-border text-xs text-nature-forest dark:text-nature-mint font-mono">
              <strong>Example:</strong> "Apple, Banana, 2L Milk, Whole Wheat Bread, 6 Eggs"
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-nature-offwhite dark:bg-nature-darkforest rounded-3xl p-6 sm:p-8 border border-nature-border dark:border-nature-forest/40 shadow-sm"
          >
            <form onSubmit={handleParse} className="space-y-3">
              <label className="text-xs font-bold text-nature-forest dark:text-nature-mint">
                Try Comma-Separated Input:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commaText}
                  onChange={(e) => setCommaText(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-nature-white dark:bg-nature-card border border-nature-border dark:border-nature-forest/40 text-nature-text dark:text-white outline-none focus:border-nature-primary"
                  placeholder="e.g. Milk, Bread, Apples, Eggs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-nature-forest text-white text-xs font-bold whitespace-nowrap hover:bg-nature-primary transition-colors"
                >
                  Split List
                </button>
              </div>
            </form>

            <div className="mt-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-nature-muted block">
                Automatically Transformed ({parsedItems.length} items):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {parsedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-nature-white dark:bg-nature-card border border-nature-border dark:border-nature-forest/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-nature-mint text-nature-forest flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-nature-forest dark:text-white">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[10px] bg-nature-mint text-nature-forest px-1.5 py-0.5 rounded font-medium">
                      {item.cat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURE 02: PAPER TO DIGITAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 order-2 lg:order-1 bg-nature-mint/40 dark:bg-nature-darkforest rounded-3xl p-6 sm:p-8 border border-nature-border dark:border-nature-forest/40"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Simulated Paper Photo */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 font-mono text-xs relative overflow-hidden rotate-[-1deg]">
                <div className="flex items-center justify-between border-b border-amber-300 pb-1.5 mb-2">
                  <span className="text-[10px] font-bold uppercase">Captured Photo</span>
                  <Camera className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <p className="italic leading-relaxed">
                  • 2kg Organic Apples
                  <br />
                  • Greek Yogurt (plain)
                  <br />
                  • Extra virgin olive oil
                </p>
                {/* Laser scan effect */}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-nature-primary shadow-[0_0_6px_#2E8B57] animate-pulse" />
              </div>

              {/* Extracted Structured Checklist */}
              <div className="p-4 rounded-2xl bg-nature-white dark:bg-nature-card border border-nature-border dark:border-nature-forest/40 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-nature-border">
                  <span className="font-bold text-[10px] uppercase text-nature-forest dark:text-nature-mint">
                    AI OCR Extracted
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    100% Parsed
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="p-1.5 rounded-lg bg-nature-offwhite dark:bg-nature-deepgreen flex justify-between items-center text-[11px]">
                    <span className="font-semibold">Organic Apples</span>
                    <span className="text-nature-muted">2 kg (Produce)</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-nature-offwhite dark:bg-nature-deepgreen flex justify-between items-center text-[11px]">
                    <span className="font-semibold">Greek Yogurt</span>
                    <span className="text-nature-muted">Plain (Dairy)</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-nature-offwhite dark:bg-nature-deepgreen flex justify-between items-center text-[11px]">
                    <span className="font-semibold">Olive Oil</span>
                    <span className="text-nature-muted">500ml (Pantry)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-nature-white dark:bg-nature-card border border-nature-border dark:border-nature-forest/40 text-[11px] text-nature-forest dark:text-nature-mint flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-nature-primary flex-shrink-0" />
              <span>
                <strong>Review before saving:</strong> You can edit quantities or delete misrecognized items before saving.
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 order-1 lg:order-2 space-y-5"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-nature-primary bg-nature-mint dark:bg-nature-darkforest px-3 py-1 rounded-full border border-nature-primary/20">
              FEATURE 02 — Vision AI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
              Your handwritten list. Digitized.
            </h2>
            <p className="text-sm text-nature-muted dark:text-nature-mint/80 leading-relaxed">
              Snap a photo with your mobile rear-facing camera or upload an image. Digitick’s OCR and
              vision models transcribe your notes into editable checklists with categories in seconds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURE 03: SMART SHOPPING TRACKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-5"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-nature-primary bg-nature-mint dark:bg-nature-darkforest px-3 py-1 rounded-full border border-nature-primary/20">
              FEATURE 03 — In-Store Mode
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
              Know exactly what you've picked up.
            </h2>
            <p className="text-sm text-nature-muted dark:text-nature-mint/80 leading-relaxed">
              Check off products as you move through grocery aisles. Watch your live shopping progress
              bar fill up. When the last item is checked, the list automatically transitions into your
              Completed Lists history.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-nature-offwhite dark:bg-nature-darkforest rounded-3xl p-6 sm:p-8 border border-nature-border dark:border-nature-forest/40 space-y-4"
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-nature-forest dark:text-white">Active Grocery Basket</span>
              <span className="text-nature-primary">{trackerPct}% Purchased</span>
            </div>

            <div className="w-full bg-nature-mint dark:bg-nature-deepgreen h-3 rounded-full overflow-hidden border border-nature-border">
              <div
                className="bg-nature-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${trackerPct}%` }}
              />
            </div>

            <div className="space-y-2 pt-2">
              {trackerItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleTracker(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    item.checked
                      ? 'bg-nature-mint/60 border-nature-primary/30 text-nature-muted'
                      : 'bg-nature-white dark:bg-nature-card border-nature-border dark:border-nature-forest/40 text-nature-forest dark:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        item.checked
                          ? 'bg-nature-primary border-nature-primary text-white'
                          : 'border-nature-muted'
                      }`}
                    >
                      {item.checked && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </div>
                    <span className={`text-xs font-semibold ${item.checked ? 'line-through opacity-60' : ''}`}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-nature-muted font-mono">
                    {item.checked ? 'Purchased' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            {trackerPct === 100 && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Shopping completed! List moved to Completed Lists archive.</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* FEATURE 04: COMPLETED SHOPPING HISTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 order-2 lg:order-1 bg-nature-offwhite dark:bg-nature-darkforest rounded-3xl p-6 sm:p-8 border border-nature-border dark:border-nature-forest/40 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-nature-border pb-3 mb-2 text-xs">
              <span className="font-bold text-nature-forest dark:text-nature-mint flex items-center gap-1.5">
                <History className="w-4 h-4 text-nature-primary" />
                <span>Completed Trips Ledger</span>
              </span>
              <span className="text-[10px] text-nature-muted">Chronological</span>
            </div>

            <div className="p-3.5 rounded-xl bg-nature-white dark:bg-nature-card border border-nature-border dark:border-nature-forest/40 flex items-center justify-between text-xs">
              <div>
                <h5 className="font-bold text-nature-forest dark:text-white">Weekly Produce & Dairy</h5>
                <span className="text-[10px] text-nature-muted">Completed on Nov 14 • 8 items</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  title="Reuse List"
                  className="px-2.5 py-1 rounded-lg bg-nature-forest text-white text-[11px] font-bold flex items-center gap-1 hover:bg-nature-primary"
                >
                  <Copy className="w-3 h-3" />
                  <span>Reuse</span>
                </button>
                <button
                  title="PDF / Print"
                  className="p-1 rounded-lg border border-nature-border text-nature-muted hover:text-nature-forest"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-nature-white dark:bg-nature-card border border-nature-border dark:border-nature-forest/40 flex items-center justify-between text-xs opacity-75">
              <div>
                <h5 className="font-bold text-nature-forest dark:text-white">Monthly Pantry & Staples</h5>
                <span className="text-[10px] text-nature-muted">Completed on Nov 02 • 15 items</span>
              </div>
              <span className="text-[10px] bg-nature-mint text-nature-forest px-2 py-0.5 rounded font-bold">
                Archived
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 order-1 lg:order-2 space-y-5"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-nature-primary bg-nature-mint dark:bg-nature-darkforest px-3 py-1 rounded-full border border-nature-primary/20">
              FEATURE 04 — List Ledger
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
              Your previous shopping, always within reach.
            </h2>
            <p className="text-sm text-nature-muted dark:text-nature-mint/80 leading-relaxed">
              Digitick stores completed shopping trips in your secure account. Revisit past items, print
              receipt checklists, export PDF files, or replicate any list into a fresh trip with 1 click.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURE 05: SMART NEARBY STORES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-5"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-nature-primary bg-nature-mint dark:bg-nature-darkforest px-3 py-1 rounded-full border border-nature-primary/20">
              FEATURE 05 — Store Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
              Find stores that match your shopping needs.
            </h2>
            <p className="text-sm text-nature-muted dark:text-nature-mint/80 leading-relaxed">
              Digitick connects your shopping list categories with your current GPS location to suggest
              nearby vegetable marts, bakeries, dairies, and supermarkets that stock matching items.
            </p>
            <div className="p-3 rounded-xl bg-nature-mint dark:bg-nature-darkforest border border-nature-border text-xs text-nature-forest dark:text-nature-mint leading-relaxed">
              <strong>Mandatory Disclaimer:</strong> Store recommendations are based on business
              categories. Actual product availability may vary.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-nature-offwhite dark:bg-nature-darkforest rounded-3xl p-6 sm:p-8 border border-nature-border dark:border-nature-forest/40 space-y-3"
          >
            {/* Store 1 */}
            <div className="p-4 rounded-xl bg-nature-white dark:bg-nature-card border border-nature-border dark:border-nature-forest/40 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-nature-primary">
                    Vegetable & Fruit Mart
                  </span>
                  <h4 className="font-bold text-sm text-nature-forest dark:text-white">
                    Fresh Harvest Farmers Mart
                  </h4>
                </div>
                <div className="text-right">
                  <span className="font-bold text-nature-forest dark:text-nature-mint block text-xs">
                    0.4 km
                  </span>
                  <span className="text-[11px] text-amber-600 font-semibold">4.8 ⭐</span>
                </div>
              </div>
              <div className="pt-2 border-t border-nature-border flex flex-wrap gap-1">
                <span className="bg-nature-mint text-nature-forest text-[10px] font-semibold px-2 py-0.5 rounded">
                  Organic Apples
                </span>
                <span className="bg-nature-mint text-nature-forest text-[10px] font-semibold px-2 py-0.5 rounded">
                  Tomatoes
                </span>
              </div>
            </div>

            {/* Store 2 */}
            <div className="p-4 rounded-xl bg-nature-white dark:bg-nature-card border border-nature-border dark:border-nature-forest/40 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-nature-primary">
                    Bakery & Confectionery
                  </span>
                  <h4 className="font-bold text-sm text-nature-forest dark:text-white">
                    Artisan Sourdough Bakery
                  </h4>
                </div>
                <div className="text-right">
                  <span className="font-bold text-nature-forest dark:text-nature-mint block text-xs">
                    0.7 km
                  </span>
                  <span className="text-[11px] text-amber-600 font-semibold">4.9 ⭐</span>
                </div>
              </div>
              <div className="pt-2 border-t border-nature-border flex flex-wrap gap-1">
                <span className="bg-nature-mint text-nature-forest text-[10px] font-semibold px-2 py-0.5 rounded">
                  Whole Wheat Sourdough
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURE 06: PERSONAL SHOPPING SPACE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-nature-forest text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-nature-mint bg-white/10 px-3 py-1 rounded-full border border-white/20">
              FEATURE 06 — Personal Cloud Space
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Your lists. Your account. Your data.
            </h2>
            <p className="text-sm sm:text-base text-nature-mint/80 leading-relaxed">
              Every user receives a unique authenticated profile. Shopping lists and historical receipts
              are encrypted, isolated via PostgreSQL Row Level Security (RLS), and synchronized in real
              time across phones, laptops, and tablets.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
