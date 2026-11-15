import React, { useState } from 'react';
import { ExtractedItem, ShoppingCategory, ShoppingList } from '../../types';
import { Button } from '../common/Button';
import { Plus, Trash2, CheckCircle2, AlertCircle, Sparkles, FolderPlus, ListPlus } from 'lucide-react';

interface OCRReviewTableProps {
  items: ExtractedItem[];
  rawText: string;
  isSimulated?: boolean;
  activeLists: ShoppingList[];
  onConfirm: (
    items: ExtractedItem[],
    options: { listId?: string; newListTitle?: string }
  ) => Promise<void>;
  onReset: () => void;
}

const CATEGORIES: ShoppingCategory[] = [
  'Produce',
  'Dairy & Eggs',
  'Bakery',
  'Pantry & Staples',
  'Beverages',
  'Meat & Seafood',
  'Snacks',
  'Personal Care',
  'Household',
  'Other',
];

const COMMON_UNITS = ['item', 'kg', 'g', 'packet', 'bottle', 'box', 'can', 'loaf', 'dozen', 'pieces', 'liter', 'ml'];

export const OCRReviewTable: React.FC<OCRReviewTableProps> = ({
  items: initialItems,
  rawText,
  isSimulated = false,
  activeLists,
  onConfirm,
  onReset,
}) => {
  const [items, setItems] = useState<ExtractedItem[]>(initialItems);
  const [saveMode, setSaveMode] = useState<'new' | 'existing'>('new');
  const [newListTitle, setNewListTitle] = useState('Scanned Shopping List');
  const [selectedListId, setSelectedListId] = useState<string>(
    activeLists.length > 0 ? activeLists[0].id : ''
  );
  const [saving, setSaving] = useState(false);

  const handleUpdateItem = (index: number, field: keyof ExtractedItem, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddMissingItem = () => {
    setItems((prev) => [
      ...prev,
      {
        name: 'New Product',
        quantity: 1,
        unit: 'item',
        category: 'Produce',
        notes: '',
        confidence: 1.0,
      },
    ]);
  };

  const handleSave = async () => {
    if (items.length === 0) return;

    setSaving(true);
    try {
      await onConfirm(items, {
        listId: saveMode === 'existing' ? selectedListId : undefined,
        newListTitle: saveMode === 'new' ? newListTitle.trim() : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-nature-white dark:bg-darknature-card rounded-2xl border border-nature-border dark:border-darknature-border p-5">
      {/* Notice & Status Banner */}
      {isSimulated && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start space-x-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Development Heuristic OCR Active</span>
            <span className="text-[11px] opacity-90">
              External Google Gemini API key not configured. Digitick heuristic handwriting engine extracted sample items below. Please review and edit before saving.
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-nature-forest dark:text-darknature-text flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-nature-primary dark:text-darknature-highlight" />
            Extracted Products ({items.length})
          </h3>
          <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
            Verify names, quantities, and categories before adding to your shopping records.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={handleAddMissingItem}
        >
          Add Missing Item
        </Button>
      </div>

      {/* Review Table */}
      <div className="overflow-x-auto rounded-xl border border-nature-border dark:border-darknature-border mb-5">
        <table className="w-full text-left text-xs">
          <thead className="bg-nature-offwhite dark:bg-darknature-sidebar text-nature-forest dark:text-darknature-highlight font-semibold border-b border-nature-border dark:border-darknature-border">
            <tr>
              <th className="p-2.5 pl-3">Product Name</th>
              <th className="p-2.5 w-20">Qty</th>
              <th className="p-2.5 w-28">Unit</th>
              <th className="p-2.5 w-36">Category</th>
              <th className="p-2.5 w-14 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nature-border/60 dark:divide-darknature-border/60">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-nature-offwhite/50 dark:hover:bg-darknature-sidebar/40">
                <td className="p-2 pl-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                    className="w-full font-semibold text-nature-text dark:text-darknature-text bg-transparent outline-none focus:bg-nature-offwhite dark:focus:bg-darknature-sidebar px-2 py-1 rounded-md border border-transparent focus:border-nature-border dark:focus:border-darknature-border"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(idx, 'quantity', parseFloat(e.target.value) || 1)}
                    className="w-full text-center font-medium text-nature-text dark:text-darknature-text bg-transparent outline-none focus:bg-nature-offwhite dark:focus:bg-darknature-sidebar px-1 py-1 rounded-md border border-transparent focus:border-nature-border dark:focus:border-darknature-border"
                  />
                </td>
                <td className="p-2">
                  <select
                    value={item.unit}
                    onChange={(e) => handleUpdateItem(idx, 'unit', e.target.value)}
                    className="w-full font-medium text-nature-text dark:text-darknature-text bg-transparent outline-none focus:bg-nature-offwhite dark:focus:bg-darknature-sidebar px-1.5 py-1 rounded-md border border-transparent focus:border-nature-border dark:focus:border-darknature-border"
                  >
                    {COMMON_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <select
                    value={item.category}
                    onChange={(e) => handleUpdateItem(idx, 'category', e.target.value as ShoppingCategory)}
                    className="w-full font-medium text-nature-text dark:text-darknature-text bg-transparent outline-none focus:bg-nature-offwhite dark:focus:bg-darknature-sidebar px-1.5 py-1 rounded-md border border-transparent focus:border-nature-border dark:focus:border-darknature-border"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDeleteItem(idx)}
                    className="p-1 rounded-md text-nature-muted hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-nature-muted">
                  No items in list. Click "Add Missing Item" to enter products manually.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Target Destination Selection */}
      <div className="p-3.5 rounded-xl bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border mb-5">
        <label className="text-xs font-semibold text-nature-forest dark:text-darknature-highlight block mb-2">
          Save Destination:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="saveMode"
              checked={saveMode === 'new'}
              onChange={() => setSaveMode('new')}
              className="text-nature-primary focus:ring-nature-primary"
            />
            <span className="text-xs font-semibold text-nature-text dark:text-darknature-text flex items-center gap-1.5">
              <FolderPlus className="w-3.5 h-3.5 text-nature-primary" /> Create New Shopping List
            </span>
          </label>

          {activeLists.length > 0 && (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="saveMode"
                checked={saveMode === 'existing'}
                onChange={() => setSaveMode('existing')}
                className="text-nature-primary focus:ring-nature-primary"
              />
              <span className="text-xs font-semibold text-nature-text dark:text-darknature-text flex items-center gap-1.5">
                <ListPlus className="w-3.5 h-3.5 text-nature-forest dark:text-darknature-highlight" /> Append to Existing List
              </span>
            </label>
          )}
        </div>

        <div className="mt-2.5">
          {saveMode === 'new' ? (
            <input
              type="text"
              placeholder="List name (e.g. Scanned Groceries)"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              className="w-full text-xs font-medium rounded-lg bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border px-3 py-1.5 outline-none focus:border-nature-primary text-nature-text dark:text-darknature-text"
            />
          ) : (
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              className="w-full text-xs font-medium rounded-lg bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border px-3 py-1.5 outline-none focus:border-nature-primary text-nature-text dark:text-darknature-text"
            >
              {activeLists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} ({l.total_items} items)
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Confirmation Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-nature-border dark:border-darknature-border">
        <Button variant="outline" size="sm" onClick={onReset}>
          Discard & Retake
        </Button>
        <Button
          variant="primary"
          size="md"
          loading={saving}
          disabled={items.length === 0}
          onClick={handleSave}
          icon={<CheckCircle2 className="w-4 h-4" />}
        >
          Confirm & Save {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </Button>
      </div>
    </div>
  );
};
