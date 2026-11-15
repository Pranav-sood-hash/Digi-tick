import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ShoppingCategory, ShoppingItem } from '../../types';
import { Check } from 'lucide-react';
import { Badge } from '../common/Badge';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: {
    name: string;
    quantity: number;
    unit: string;
    category: ShoppingCategory;
    notes?: string;
  }) => Promise<void>;
  initialItem?: ShoppingItem | null;
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

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialItem,
}) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('item');
  const [category, setCategory] = useState<ShoppingCategory>('Produce');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setQuantity(initialItem.quantity);
      setUnit(initialItem.unit);
      setCategory(initialItem.category);
      setNotes(initialItem.notes || '');
    } else {
      setName('');
      setQuantity(1);
      setUnit('item');
      setCategory('Produce');
      setNotes('');
    }
  }, [initialItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        quantity: Number(quantity) || 1,
        unit,
        category,
        notes: notes.trim() || undefined,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem ? 'Edit Item' : 'Add New Item'}
      description="Specify product details, quantities, and appropriate category."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <Input
          autoFocus
          label="Product Name"
          placeholder="e.g. Organic Bananas, Sourdough Bread, Almond Milk"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-nature-forest dark:text-darknature-highlight block mb-1">
              Quantity
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(0.5, prev - 1))}
                className="w-9 h-9 rounded-lg bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border text-nature-forest dark:text-darknature-text font-bold hover:bg-nature-mint dark:hover:bg-darknature-mint transition-colors flex items-center justify-center flex-shrink-0"
              >
                -
              </button>
              <input
                type="number"
                step="any"
                min="0.1"
                className="w-full text-center text-sm font-semibold rounded-lg bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border py-1.5 outline-none focus:border-nature-primary dark:focus:border-darknature-primary text-nature-text dark:text-darknature-text"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
              />
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-9 h-9 rounded-lg bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border text-nature-forest dark:text-darknature-text font-bold hover:bg-nature-mint dark:hover:bg-darknature-mint transition-colors flex items-center justify-center flex-shrink-0"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-nature-forest dark:text-darknature-highlight block mb-1">
              Unit
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full text-sm rounded-lg bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border px-3 py-2 outline-none focus:border-nature-primary dark:focus:border-darknature-primary text-nature-text dark:text-darknature-text transition-colors"
            >
              {COMMON_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-nature-forest dark:text-darknature-highlight block mb-1">
            Category
          </label>
          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium border text-left transition-colors ${
                  category === cat
                    ? 'border-nature-primary bg-nature-mint dark:bg-darknature-mint text-nature-forest dark:text-darknature-highlight font-semibold'
                    : 'border-nature-border dark:border-darknature-border hover:bg-nature-offwhite dark:hover:bg-darknature-sidebar text-nature-text dark:text-darknature-text'
                }`}
              >
                <Badge category={cat} size="sm" />
                {category === cat && <Check className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-nature-forest dark:text-darknature-highlight block mb-1">
            Optional Notes
          </label>
          <Input
            placeholder="e.g. Prefer green bananas, low-fat version"
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-nature-border dark:border-darknature-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            disabled={!name.trim()}
          >
            {initialItem ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
