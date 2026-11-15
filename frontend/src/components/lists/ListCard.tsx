import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreVertical,
  Copy,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ShoppingList } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';

interface ListCardProps {
  list: ShoppingList;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, currentTitle: string) => void;
  onComplete?: (id: string) => void;
  onReuse?: (id: string) => void;
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  onDuplicate,
  onDelete,
  onRename,
  onComplete,
  onReuse,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(list.updated_at || list.created_at));

  const isCompleted = list.status === 'completed';

  return (
    <div className="relative bg-nature-white dark:bg-darknature-card rounded-2xl border border-nature-border dark:border-darknature-border p-4 transition-colors duration-150 hover:border-nature-primary dark:hover:border-darknature-primary flex flex-col justify-between group">
      <div>
        {/* Header & Options */}
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            <Badge status={list.status} size="sm" />
            {isCompleted && (
              <span className="text-[11px] font-semibold text-nature-forest dark:text-darknature-highlight flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-nature-primary dark:text-darknature-primary" /> Done
              </span>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md text-nature-muted hover:text-nature-text dark:hover:text-darknature-text hover:bg-nature-offwhite dark:hover:bg-darknature-sidebar transition-colors"
              aria-label="List options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-7 z-30 w-44 bg-nature-white dark:bg-darknature-card rounded-xl border border-nature-border dark:border-darknature-border py-1 text-xs font-medium shadow-card">
                  {onRename && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onRename(list.id, list.title);
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center space-x-2 text-nature-text dark:text-darknature-text hover:bg-nature-offwhite dark:hover:bg-darknature-sidebar"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-nature-muted" />
                      <span>Rename List</span>
                    </button>
                  )}

                  {onDuplicate && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDuplicate(list.id);
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center space-x-2 text-nature-text dark:text-darknature-text hover:bg-nature-offwhite dark:hover:bg-darknature-sidebar"
                    >
                      <Copy className="w-3.5 h-3.5 text-nature-muted" />
                      <span>Duplicate List</span>
                    </button>
                  )}

                  {!isCompleted && onComplete && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onComplete(list.id);
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center space-x-2 text-nature-forest dark:text-darknature-highlight hover:bg-nature-mint dark:hover:bg-darknature-mint"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-nature-primary" />
                      <span>Mark Complete</span>
                    </button>
                  )}

                  {isCompleted && onReuse && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onReuse(list.id);
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center space-x-2 text-nature-forest dark:text-darknature-highlight hover:bg-nature-mint dark:hover:bg-darknature-mint"
                    >
                      <Copy className="w-3.5 h-3.5 text-nature-primary" />
                      <span>Reuse into New List</span>
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(list.id);
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center space-x-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-t border-nature-border dark:border-darknature-border mt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete List</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* List Title */}
        <h3
          onClick={() => navigate(`/lists/${list.id}`)}
          className="text-base font-bold text-nature-forest dark:text-darknature-text tracking-tight hover:text-nature-primary dark:hover:text-darknature-highlight cursor-pointer transition-colors mb-2 line-clamp-1"
        >
          {list.title}
        </h3>

        {/* Flat Progress Bar */}
        <div className="my-3">
          <ProgressBar
            current={list.completed_items}
            total={list.total_items}
            percentage={list.progress_percent}
            size="sm"
          />
        </div>
      </div>

      {/* Footer Info & Open Button */}
      <div className="pt-2.5 border-t border-nature-border dark:border-darknature-border flex items-center justify-between">
        <div className="flex items-center text-[11px] text-nature-muted dark:text-darknature-muted space-x-1">
          <Clock className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>

        <button
          onClick={() => navigate(`/lists/${list.id}`)}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-nature-primary dark:text-darknature-highlight hover:text-nature-forest dark:hover:text-darknature-primary transition-colors"
        >
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
