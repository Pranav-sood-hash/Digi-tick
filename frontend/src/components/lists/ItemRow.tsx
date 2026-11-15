import React from 'react';
import { ShoppingItem } from '../../types';
import { Badge } from '../common/Badge';
import { Check, Trash2, Edit2, Plus, Minus, StickyNote } from 'lucide-react';

interface ItemRowProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
  onQuantityChange: (id: string, newQty: number) => void;
}

export const ItemRow: React.FC<ItemRowProps> = ({
  item,
  onToggle,
  onEdit,
  onDelete,
  onQuantityChange,
}) => {
  const handleStepQty = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextQty = Math.max(0.5, item.quantity + delta);
    onQuantityChange(item.id, nextQty);
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border transition-colors duration-150 ${
        item.is_purchased
          ? 'bg-nature-offwhite/80 dark:bg-darknature-sidebar/60 border-nature-border/70 dark:border-darknature-border/60'
          : 'bg-nature-white dark:bg-darknature-card border-nature-border dark:border-darknature-border hover:border-nature-primary/50 dark:hover:border-darknature-primary/50'
      }`}
    >
      {/* Checkbox & Item Details */}
      <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
        <button
          onClick={() => onToggle(item.id)}
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors duration-150 flex-shrink-0 ${
            item.is_purchased
              ? 'bg-nature-primary dark:bg-darknature-primary text-white dark:text-darknature-bg border border-nature-primary dark:border-darknature-primary'
              : 'border border-nature-border dark:border-darknature-border hover:border-nature-primary dark:hover:border-darknature-primary bg-nature-white dark:bg-darknature-card'
          }`}
          aria-label={item.is_purchased ? 'Mark as pending' : 'Mark as purchased'}
        >
          {item.is_purchased && <Check className="w-3.5 h-3.5 stroke-[2.8]" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span
              onClick={() => onToggle(item.id)}
              className={`text-sm font-semibold cursor-pointer truncate select-none ${
                item.is_purchased
                  ? 'line-through text-nature-muted dark:text-darknature-muted'
                  : 'text-nature-text dark:text-darknature-text hover:text-nature-primary dark:hover:text-darknature-highlight'
              }`}
            >
              {item.name}
            </span>
            <Badge category={item.category} size="sm" className="hidden sm:inline-flex" />
          </div>

          {/* Notes & mobile category */}
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="sm:hidden">
              <Badge category={item.category} size="sm" />
            </span>
            {item.notes && (
              <span className="text-[11px] text-nature-muted dark:text-darknature-muted flex items-center gap-1 truncate">
                <StickyNote className="w-3 h-3 flex-shrink-0" />
                {item.notes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Stepper & Actions */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        {/* Quantity Controls */}
        <div className="flex items-center rounded-lg bg-nature-offwhite dark:bg-darknature-sidebar p-0.5 border border-nature-border dark:border-darknature-border">
          <button
            onClick={(e) => handleStepQty(-1, e)}
            disabled={item.quantity <= 0.5}
            className="w-5 h-5 flex items-center justify-center rounded text-nature-muted hover:text-nature-text dark:hover:text-darknature-text disabled:opacity-30 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-semibold px-2 min-w-12 text-center text-nature-forest dark:text-darknature-highlight select-none">
            {item.quantity} {item.unit}
          </span>
          <button
            onClick={(e) => handleStepQty(1, e)}
            className="w-5 h-5 flex items-center justify-center rounded text-nature-muted hover:text-nature-text dark:hover:text-darknature-text transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center space-x-0.5">
          <button
            onClick={() => onEdit(item)}
            className="p-1 rounded-md text-nature-muted hover:text-nature-text dark:hover:text-darknature-text hover:bg-nature-offwhite dark:hover:bg-darknature-sidebar transition-colors"
            aria-label="Edit item"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 rounded-md text-nature-muted hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            aria-label="Delete item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
