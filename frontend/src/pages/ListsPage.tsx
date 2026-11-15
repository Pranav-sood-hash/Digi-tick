import React, { useState, useEffect } from 'react';
import { ShoppingList } from '../types';
import { listsApi } from '../services/api';
import { ListCard } from '../components/lists/ListCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useToast } from '../context/ToastContext';
import { Plus, Search, CheckSquare } from 'lucide-react';

export const ListsPage: React.FC = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renamingListId, setRenamingListId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');
  const { success, error } = useToast();

  const fetchLists = async () => {
    try {
      const data = await listsApi.getLists('active');
      setLists(data);
    } catch (err: any) {
      error(err.message || 'Failed to load shopping lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
    const handleReload = () => fetchLists();
    window.addEventListener('digitick:list_created', handleReload);
    window.addEventListener('digitick:list_completed', handleReload);
    return () => {
      window.removeEventListener('digitick:list_created', handleReload);
      window.removeEventListener('digitick:list_completed', handleReload);
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await listsApi.createList(newTitle.trim());
      success(`List "${newTitle.trim()}" created!`);
      setNewTitle('');
      setCreateModalOpen(false);
      fetchLists();
    } catch (err: any) {
      error(err.message || 'Failed to create list');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await listsApi.duplicateList(id);
      success('List duplicated');
      fetchLists();
    } catch (err: any) {
      error(err.message || 'Failed to duplicate list');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;
    try {
      await listsApi.deleteList(id);
      success('List deleted');
      fetchLists();
    } catch (err: any) {
      error(err.message || 'Failed to delete list');
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingListId || !renamingTitle.trim()) return;
    try {
      await listsApi.updateList(renamingListId, renamingTitle.trim());
      success('List renamed');
      setRenameModalOpen(false);
      fetchLists();
    } catch (err: any) {
      error(err.message || 'Failed to rename list');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await listsApi.completeList(id);
      success('List moved to Completed!');
      fetchLists();
    } catch (err: any) {
      error(err.message || 'Failed to complete list');
    }
  };

  const filteredLists = lists.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fadeIn pb-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
            My Shopping Lists
          </h2>
          <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
            Active household checklists, pantry replenishment, and grocery plans
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          Add New List
        </Button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Search your lists..."
          icon={<Search className="w-4 h-4 text-nature-muted" />}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid of lists */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-6 h-6 border-2 border-nature-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredLists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onRename={(id, title) => {
                setRenamingListId(id);
                setRenamingTitle(title);
                setRenameModalOpen(true);
              }}
              onComplete={handleComplete}
            />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center rounded-2xl bg-nature-white dark:bg-darknature-card border border-dashed border-nature-border dark:border-darknature-border">
          <CheckSquare className="w-10 h-10 text-nature-muted dark:text-darknature-muted mx-auto mb-2" />
          <h4 className="text-sm font-bold text-nature-forest dark:text-darknature-text mb-1">
            {search ? 'No lists matched your search' : 'No active shopping lists'}
          </h4>
          <p className="text-xs text-nature-muted max-w-sm mx-auto mb-4">
            {search
              ? 'Try searching with a different keyword or create a new list.'
              : 'Create multiple lists for weekly groceries, kitchen staples, or personal care.'}
          </p>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create New List
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add New Shopping List"
        description="Name your list (e.g. Weekly Groceries, Monthly Household, Kitchen Essentials)"
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-1">
          <Input
            autoFocus
            label="List Name"
            placeholder="e.g. Weekly Groceries"
            value={newTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2 pt-2 border-t border-nature-border dark:border-darknature-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!newTitle.trim()}>
              Create List
            </Button>
          </div>
        </form>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        title="Rename Shopping List"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4 pt-1">
          <Input
            autoFocus
            label="New List Name"
            value={renamingTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRenamingTitle(e.target.value)}
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
            <Button type="submit" variant="primary" disabled={!renamingTitle.trim()}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
