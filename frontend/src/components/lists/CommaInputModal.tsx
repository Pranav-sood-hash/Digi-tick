import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Sparkles, Layers } from 'lucide-react';

interface CommaInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => Promise<void>;
}

export const CommaInputModal: React.FC<CommaInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Live preview of parsed items
  const parsedItems = text
    .replace(/\n/g, ',')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(text);
      setText('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Multi-Item Entry"
      description="Type or paste multiple products separated by commas. Digitick automatically detects quantities and categories."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div>
          <label className="text-xs font-semibold text-nature-forest dark:text-darknature-highlight block mb-1">
            Products (Comma-Separated)
          </label>
          <textarea
            autoFocus
            rows={4}
            className="w-full text-sm rounded-xl bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border p-3 outline-none focus:border-nature-primary dark:focus:border-darknature-primary focus:ring-1 focus:ring-nature-primary/20 text-nature-text dark:text-darknature-text placeholder-nature-muted/70 transition-colors"
            placeholder="e.g. 2 kg Apple, Banana, 2 packets Milk, 1 loaf Bread, 5 Eggs, Olive oil"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        {/* Live Detected Preview Chips */}
        {parsedItems.length > 0 && (
          <div className="p-3 rounded-xl bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border">
            <div className="flex items-center justify-between text-xs font-semibold text-nature-forest dark:text-darknature-highlight mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" />
                Detected {parsedItems.length} {parsedItems.length === 1 ? 'item' : 'items'}:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {parsedItems.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-nature-mint dark:bg-darknature-mint border border-nature-border dark:border-darknature-border font-medium text-nature-forest dark:text-darknature-highlight"
                >
                  <span className="text-nature-muted dark:text-darknature-muted mr-1 text-[10px]">{idx + 1}.</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2 border-t border-nature-border dark:border-darknature-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            disabled={parsedItems.length === 0}
            icon={<Layers className="w-4 h-4" />}
          >
            Add {parsedItems.length > 0 ? `${parsedItems.length} Items` : 'Items'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
