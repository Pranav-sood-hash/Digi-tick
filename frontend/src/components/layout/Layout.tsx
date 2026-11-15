import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { listsApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newListModalOpen, setNewListModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const { success, error } = useToast();

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    setCreating(true);
    try {
      await listsApi.createList(newListTitle.trim());
      success(`List "${newListTitle.trim()}" created!`);
      setNewListTitle('');
      setNewListModalOpen(false);
      window.dispatchEvent(new CustomEvent('digitick:list_created'));
    } catch (err: any) {
      error(err.message || 'Failed to create list');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-nature-offwhite dark:bg-darknature-bg text-nature-text dark:text-darknature-text overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-nature-text/40 dark:bg-black/70"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative z-10 w-72 h-full bg-nature-white dark:bg-darknature-sidebar border-r border-nature-border dark:border-darknature-border"
            >
              <Sidebar onClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenNewListModal={() => setNewListModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-8 p-4 md:p-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>

        <MobileNav onOpenNewListModal={() => setNewListModalOpen(true)} />
      </div>

      {/* Create New List Modal */}
      <Modal
        isOpen={newListModalOpen}
        onClose={() => setNewListModalOpen(false)}
        title="Create Shopping List"
        description="Name your list (e.g. Weekly Groceries, Kitchen Essentials, BBQ Night)"
      >
        <form onSubmit={handleCreateList} className="space-y-4 pt-1">
          <Input
            autoFocus
            label="List Name"
            placeholder="e.g. Weekly Groceries"
            value={newListTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewListTitle(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewListModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={creating}
              disabled={!newListTitle.trim()}
            >
              Create List
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
