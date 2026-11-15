import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Check,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Store,
  History,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DemoItem {
  id: string;
  name: string;
  qty: string;
  category: string;
  checked: boolean;
}

export const ProductDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'stores'>('active');
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState<DemoItem[]>([
    { id: '1', name: 'Almond Milk', qty: '1 L', category: 'Dairy & Eggs', checked: true },
    { id: '2', name: 'Fresh Strawberries', qty: '500 g', category: 'Produce', checked: true },
    { id: '3', name: 'Whole Wheat Sourdough', qty: '1 loaf', category: 'Bakery', checked: false },
    { id: '4', name: 'Olive Oil', qty: '1 bottle', category: 'Pantry', checked: false },
    { id: '5', name: 'Free-Range Eggs', qty: '12 pcs', category: 'Dairy & Eggs', checked: false },
  ]);

  const [completedArchive, setCompletedArchive] = useState([
    {
      title: 'Previous Weekend Pantry Restock',
      date: 'Completed 3 days ago',
      itemCount: 12,
    },
    {
      title: 'Monthly Cleaning & Supplies',
      date: 'Completed last week',
      itemCount: 8,
    },
  ]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Check if comma separated
    if (inputValue.includes(',')) {
      const parts = inputValue.split(',').map((p) => p.trim()).filter(Boolean);
      const newItems = parts.map((name, idx) => ({
        id: `${Date.now()}-${idx}`,
        name,
        qty: '1 qty',
        category: name.toLowerCase().includes('milk') || name.toLowerCase().includes('egg') ? 'Dairy & Eggs' : 'Produce',
        checked: false,
      }));
      setItems((prev) => [...prev, ...newItems]);
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          name: inputValue.trim(),
          qty: '1 qty',
          category: 'Produce',
          checked: false,
        },
      ]);
    }
    setInputValue('');
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const resetItems = () => {
    setItems([
      { id: '1', name: 'Almond Milk', qty: '1 L', category: 'Dairy & Eggs', checked: false },
      { id: '2', name: 'Fresh Strawberries', qty: '500 g', category: 'Produce', checked: false },
      { id: '3', name: 'Whole Wheat Sourdough', qty: '1 loaf', category: 'Bakery', checked: false },
      { id: '4', name: 'Olive Oil', qty: '1 bottle', category: 'Pantry', checked: false },
      { id: '5', name: 'Free-Range Eggs', qty: '12 pcs', category: 'Dairy & Eggs', checked: false },
    ]);
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const progressPercent = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;
  const isCompleted = items.length > 0 && checkedCount === items.length;

  return (
    <section id="demo" className="py-20 md:py-28 bg-nature-offwhite dark:bg-nature-darkforest relative overflow-hidden border-t border-nature-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-nature-forest dark:text-nature-mint px-3 py-1 rounded-full bg-nature-mint dark:bg-nature-deepgreen border border-nature-forest/20">
            Interactive Product Preview
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-nature-forest dark:text-nature-white tracking-tight">
            See Digitick in action.
          </h2>
          <p className="text-sm sm:text-base text-nature-muted dark:text-nature-mint/80 leading-relaxed">
            Test the live features right here in your browser. Add items, check off purchases, view
            progress updates, and experience the workflow before creating your account.
          </p>
        </div>

        {/* Demo Box */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-nature-white dark:bg-nature-card border border-nature-border dark:border-nature-forest/40 shadow-xl overflow-hidden p-6 sm:p-8">
          {/* Demo Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-nature-border dark:border-nature-forest/40 pb-4 mb-6 gap-3">
            <div className="flex items-center space-x-2 bg-nature-offwhite dark:bg-nature-deepgreen p-1.5 rounded-xl border border-nature-border dark:border-nature-forest/30 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'active'
                    ? 'bg-nature-forest text-white shadow-xs font-bold'
                    : 'text-nature-muted hover:text-nature-text'
                }`}
              >
                Active List ({items.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'completed'
                    ? 'bg-nature-forest text-white shadow-xs font-bold'
                    : 'text-nature-muted hover:text-nature-text'
                }`}
              >
                Completed Trips
              </button>
              <button
                onClick={() => setActiveTab('stores')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'stores'
                    ? 'bg-nature-forest text-white shadow-xs font-bold'
                    : 'text-nature-muted hover:text-nature-text'
                }`}
              >
                Matched Stores
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[11px] text-nature-muted font-medium hidden sm:inline">
                Interactive Demo Sandbox
              </span>
              <button
                onClick={resetItems}
                className="px-2.5 py-1 rounded-lg border border-nature-border text-nature-muted hover:text-nature-forest dark:hover:text-white flex items-center gap-1"
                title="Reset items"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="text-[11px]">Reset</span>
              </button>
            </div>
          </div>

          {/* TAB 1: ACTIVE SHOPPING LIST */}
          {activeTab === 'active' && (
            <div className="space-y-5">
              {/* Add item input bar */}
              <form onSubmit={handleAddItem} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type an item, or multiple items separated by commas..."
                  className="flex-1 text-xs p-3 rounded-xl bg-nature-offwhite dark:bg-nature-deepgreen border border-nature-border text-nature-text dark:text-white outline-none focus:border-nature-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-nature-forest hover:bg-nature-primary text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </form>

              {/* Live Progress Bar */}
              <div className="p-4 rounded-2xl bg-nature-offwhite dark:bg-nature-deepgreen border border-nature-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-nature-forest dark:text-nature-mint">
                      Weekly Household Grocery Essentials
                    </span>
                    <span className="text-nature-muted text-[11px] block">
                      {checkedCount} of {items.length} items purchased
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-nature-primary">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-nature-mint dark:bg-nature-darkforest h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-nature-primary rounded-full"
                  />
                </div>
              </div>

              {/* Completed Banner */}
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                    <div>
                      <strong className="block">🎉 Shopping Completed!</strong>
                      <span className="text-[11px] opacity-80">
                        In the live app, this list automatically moves to your Completed Lists ledger.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={resetItems}
                    className="text-[11px] font-bold text-emerald-800 underline ml-2"
                  >
                    Uncheck All
                  </button>
                </motion.div>
              )}

              {/* Items List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      item.checked
                        ? 'bg-nature-mint/40 dark:bg-nature-deepgreen/40 border-nature-primary/30 text-nature-muted'
                        : 'bg-nature-white dark:bg-nature-deepgreen border-nature-border text-nature-text dark:text-white hover:border-nature-primary/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          item.checked
                            ? 'bg-nature-primary border-nature-primary text-white'
                            : 'border-nature-muted/60 bg-white'
                        }`}
                      >
                        {item.checked && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </div>
                      <div>
                        <span className={`font-semibold block ${item.checked ? 'line-through opacity-60' : ''}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-nature-muted">{item.qty}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-medium bg-nature-mint text-nature-forest px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <button
                        onClick={(e) => deleteItem(item.id, e)}
                        className="text-nature-muted hover:text-rose-600 p-1 rounded"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: COMPLETED TRIPS LEDGER */}
          {activeTab === 'completed' && (
            <div className="space-y-3">
              <p className="text-xs text-nature-muted mb-2">
                All finished lists are permanently preserved in your account. You can reuse them in 1 click or export clean PDFs.
              </p>
              {completedArchive.map((arch, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-nature-offwhite dark:bg-nature-deepgreen border border-nature-border flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-nature-forest dark:text-white">{arch.title}</h4>
                    <span className="text-[11px] text-nature-muted">{arch.date} • {arch.itemCount} items</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('active');
                      resetItems();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-nature-forest text-white text-xs font-bold hover:bg-nature-primary transition-colors"
                  >
                    Reuse List
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MATCHED NEARBY STORES */}
          {activeTab === 'stores' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-nature-mint text-nature-forest text-xs leading-relaxed">
                <strong>Disclaimer:</strong> Suggestions are based on store categories and your list items. Actual product inventory may vary.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-nature-offwhite dark:bg-nature-deepgreen border border-nature-border space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-nature-primary">Produce & Fruits</span>
                  <h4 className="font-bold text-nature-forest dark:text-white">Central Market Greens</h4>
                  <p className="text-[11px] text-nature-muted">0.4 km away • Open Now</p>
                  <div className="pt-1 flex gap-1">
                    <span className="bg-nature-mint text-nature-forest text-[10px] px-1.5 py-0.5 rounded font-semibold">
                      Strawberries
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-nature-offwhite dark:bg-nature-deepgreen border border-nature-border space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-nature-primary">Artisan Bakery</span>
                  <h4 className="font-bold text-nature-forest dark:text-white">Rustic Bread Oven</h4>
                  <p className="text-[11px] text-nature-muted">0.6 km away • Open Now</p>
                  <div className="pt-1 flex gap-1">
                    <span className="bg-nature-mint text-nature-forest text-[10px] px-1.5 py-0.5 rounded font-semibold">
                      Sourdough
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Demonstration Callout */}
          <div className="mt-8 pt-5 border-t border-nature-border dark:border-nature-forest/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-nature-muted text-center sm:text-left">
              Interactive Demo Only — No account required to try. Data is not saved to your personal account.
            </span>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-nature-forest hover:bg-nature-primary text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Ready to organize your shopping? Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
