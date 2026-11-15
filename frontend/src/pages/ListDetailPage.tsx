import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingList, ShoppingItem, ShoppingCategory } from '../types';
import { listsApi, itemsApi } from '../services/api';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { ItemRow } from '../components/lists/ItemRow';
import { ProgressBar } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { CommaInputModal } from '../components/lists/CommaInputModal';
import { AddItemModal } from '../components/lists/AddItemModal';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Plus,
  Layers,
  Copy,
  CheckCircle2,
  Trash2,
  Edit2,
  MapPin,
  ShoppingBag
} from 'lucide-react';

export const ListDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'purchased'>('all');

  // Modals
  const [commaModalOpen, setCommaModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  const fetchListDetail = async () => {
    if (!id) return;
    try {
      const data = await listsApi.getList(id);
      setList(data);
      setEditTitle(data.title);
    } catch (err: any) {
      error(err.message || 'Failed to load list details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListDetail();

    if (!isSupabaseConfigured || !supabase || !id) return;

    // Realtime synchronization for instant cross-device updates
    const channel = supabase
      .channel(`shopping_list_realtime_${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_items',
          filter: `list_id=eq.${id}`,
        },
        () => {
          fetchListDetail();
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [id]);

  const handleToggleItem = async (itemId: string) => {
    if (!list || !list.items) return;

    // Optimistic UI update
    const previousItems = [...list.items];
    const targetItem = list.items.find((i) => i.id === itemId);
    if (!targetItem) return;

    const newPurchased = !targetItem.is_purchased;
    const updatedItems = list.items.map((i) =>
      i.id === itemId ? { ...i, is_purchased: newPurchased } : i
    );

    const completedCount = updatedItems.filter((i) => i.is_purchased).length;
    const totalCount = updatedItems.length;
    const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const isNowAllCompleted = completedCount === totalCount && totalCount > 0 && list.status === 'active';
    const isNowReopened = completedCount < totalCount && list.status === 'completed';

    setList({
      ...list,
      items: updatedItems,
      completed_items: completedCount,
      progress_percent: percent,
      status: isNowAllCompleted ? 'completed' : isNowReopened ? 'active' : list.status,
    });

    try {
      await itemsApi.toggleItem(list.id, itemId);

      if (isNowAllCompleted) {
        success('Shopping completed! Your list has been moved to Completed Lists.');
        window.dispatchEvent(new CustomEvent('digitick:list_completed', { detail: { listId: list.id } }));
        setTimeout(() => {
          navigate('/completed');
        }, 1200);
      }
    } catch (err: any) {
      setList({
        ...list,
        items: previousItems,
      });
      error('Failed to update item status');
    }
  };

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    if (!list || !list.items) return;

    const updatedItems = list.items.map((i) =>
      i.id === itemId ? { ...i, quantity: newQty } : i
    );
    setList({ ...list, items: updatedItems });

    try {
      await itemsApi.updateItem(list.id, itemId, { quantity: newQty });
    } catch (err: any) {
      error('Failed to update quantity');
      fetchListDetail();
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!list) return;
    try {
      await itemsApi.deleteItem(list.id, itemId);
      success('Item removed');
      fetchListDetail();
    } catch (err: any) {
      error('Failed to delete item');
    }
  };

  const handleSaveIndividualItem = async (itemData: {
    name: string;
    quantity: number;
    unit: string;
    category: ShoppingCategory;
    notes?: string;
  }) => {
    if (!list) return;

    if (editingItem) {
      await itemsApi.updateItem(list.id, editingItem.id, itemData);
      success('Item updated');
      setEditingItem(null);
    } else {
      await itemsApi.addItem(list.id, itemData);
      success(`Added "${itemData.name}"`);
    }
    fetchListDetail();
  };

  const handleAddCommaItems = async (rawText: string) => {
    if (!list) return;
    const added = await itemsApi.addCommaSeparated(list.id, rawText);
    success(`Added ${added.length} products to your list!`);
    fetchListDetail();
  };

  const handleRenameList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!list || !editTitle.trim()) return;

    try {
      await listsApi.updateList(list.id, editTitle.trim());
      success('List renamed');
      setRenameModalOpen(false);
      fetchListDetail();
    } catch (err: any) {
      error('Failed to rename list');
    }
  };

  const handleDuplicate = async () => {
    if (!list) return;
    try {
      const copy = await listsApi.duplicateList(list.id);
      success(`Duplicated as "${copy.title}"`);
      navigate(`/lists/${copy.id}`);
    } catch (err: any) {
      error('Failed to duplicate list');
    }
  };

  const handleCompleteList = async () => {
    if (!list) return;
    try {
      await listsApi.completeList(list.id);
      success('List completed! Saved to shopping history.');
      navigate('/completed');
    } catch (err: any) {
      error('Failed to complete list');
    }
  };

  const handleDeleteList = async () => {
    if (!list) return;
    if (!window.confirm(`Delete list "${list.title}"?`)) return;
    try {
      await listsApi.deleteList(list.id);
      success('List deleted');
      navigate('/lists');
    } catch (err: any) {
      error('Failed to delete list');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-nature-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="p-8 text-center">
        <p className="text-nature-muted mb-4">List not found.</p>
        <Button onClick={() => navigate('/lists')}>Back to Lists</Button>
      </div>
    );
  }

  const items = list.items || [];
  const pendingItems = items.filter((i) => !i.is_purchased);
  const purchasedItems = items.filter((i) => i.is_purchased);

  const displayedItems =
    filter === 'pending'
      ? pendingItems
      : filter === 'purchased'
      ? purchasedItems
      : items;

  const isAllComplete = items.length > 0 && pendingItems.length === 0;

  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-fadeIn pb-10">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/lists')}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-nature-muted hover:text-nature-forest dark:hover:text-darknature-highlight transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lists</span>
        </button>

        <div className="flex items-center space-x-1.5">
          <Button
            variant="outline"
            size="sm"
            icon={<MapPin className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" />}
            onClick={() => navigate(`/stores?list_id=${list.id}`)}
          >
            Find Stores
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Copy className="w-3.5 h-3.5" />}
            onClick={handleDuplicate}
          >
            Duplicate
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteList}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* List Header Card */}
      <div className="bg-nature-white dark:bg-darknature-card rounded-2xl p-5 border border-nature-border dark:border-darknature-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3.5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge status={list.status} size="sm" />
              <button
                onClick={() => setRenameModalOpen(true)}
                className="text-nature-muted hover:text-nature-forest dark:hover:text-darknature-highlight transition-colors p-1 rounded-md"
                title="Rename list"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
              {list.title}
            </h2>
          </div>

          {/* Quick Action Input Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Layers className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" />}
              onClick={() => setCommaModalOpen(true)}
            >
              Comma-Separated Input
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setEditingItem(null);
                setItemModalOpen(true);
              }}
            >
              Add Item
            </Button>
          </div>
        </div>

        {/* Real-time Flat Progress Bar */}
        <ProgressBar
          current={list.completed_items}
          total={list.total_items}
          percentage={list.progress_percent}
          size="md"
        />

        {/* Completion Celebration Prompt */}
        {isAllComplete && list.status === 'active' && (
          <div className="mt-4 p-3.5 rounded-xl bg-nature-mint dark:bg-darknature-mint border border-nature-border dark:border-darknature-border flex flex-col sm:flex-row items-center justify-between gap-2.5 text-nature-forest dark:text-darknature-highlight">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-nature-primary dark:text-darknature-primary flex-shrink-0" />
              <span className="text-xs font-bold">
                All {items.length} items purchased! Ready to complete this shopping trip?
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              onClick={handleCompleteList}
            >
              Move to Completed Lists
            </Button>
          </div>
        )}
      </div>

      {/* Filter Tabs & Item Counters */}
      <div className="flex items-center justify-between border-b border-nature-border dark:border-darknature-border pb-2">
        <div className="flex space-x-1.5">
          {(['all', 'pending', 'purchased'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize transition-colors ${
                filter === tab
                  ? 'bg-nature-forest text-white dark:bg-darknature-primary dark:text-darknature-bg'
                  : 'text-nature-muted hover:text-nature-text dark:hover:text-darknature-text hover:bg-nature-offwhite dark:hover:bg-darknature-sidebar'
              }`}
            >
              {tab} (
              {tab === 'all'
                ? items.length
                : tab === 'pending'
                ? pendingItems.length
                : purchasedItems.length}
              )
            </button>
          ))}
        </div>

        <span className="text-xs text-nature-muted dark:text-darknature-muted font-medium">
          {pendingItems.length} remaining
        </span>
      </div>

      {/* Items List */}
      {displayedItems.length > 0 ? (
        <div className="space-y-2">
          {displayedItems.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={handleToggleItem}
              onEdit={(it) => {
                setEditingItem(it);
                setItemModalOpen(true);
              }}
              onDelete={handleDeleteItem}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center rounded-2xl bg-nature-white dark:bg-darknature-card border border-dashed border-nature-border dark:border-darknature-border">
          <ShoppingBag className="w-9 h-9 text-nature-muted dark:text-darknature-muted mx-auto mb-2" />
          <h4 className="text-sm font-bold text-nature-forest dark:text-darknature-text mb-1">
            {filter === 'pending'
              ? 'No pending items! All items have been checked.'
              : filter === 'purchased'
              ? 'No purchased items yet.'
              : 'This shopping list is currently empty.'}
          </h4>
          <p className="text-xs text-nature-muted max-w-sm mx-auto mb-4">
            Add products individually or paste a comma-separated list like "Apple, Milk, Bread, Eggs".
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Layers className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" />}
              onClick={() => setCommaModalOpen(true)}
            >
              Paste Comma List
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setEditingItem(null);
                setItemModalOpen(true);
              }}
            >
              Add Single Item
            </Button>
          </div>
        </div>
      )}

      {/* Comma-Separated Input Modal */}
      <CommaInputModal
        isOpen={commaModalOpen}
        onClose={() => setCommaModalOpen(false)}
        onSubmit={handleAddCommaItems}
      />

      {/* Add or Edit Item Modal */}
      <AddItemModal
        isOpen={itemModalOpen}
        onClose={() => {
          setItemModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSaveIndividualItem}
        initialItem={editingItem}
      />

      {/* Rename Modal */}
      <Modal
        isOpen={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        title="Rename Shopping List"
      >
        <form onSubmit={handleRenameList} className="space-y-4 pt-1">
          <Input
            autoFocus
            label="List Title"
            value={editTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2 pt-2 border-t border-nature-border dark:border-darknature-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRenameModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!editTitle.trim()}>
              Save Title
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
