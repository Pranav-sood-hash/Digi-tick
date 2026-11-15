import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { ListCard } from '../components/lists/ListCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { DashboardData } from '../types';
import { dashboardApi, listsApi } from '../services/api';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useToast } from '../context/ToastContext';
import {
  Plus,
  ScanLine,
  Archive,
  ArrowRight,
  Clock,
  ListTodo,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renamingListId, setRenamingListId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');

  const fetchDashboardData = async () => {
    try {
      const summary = await dashboardApi.getSummary();
      setData(summary);
    } catch (err: any) {
      error(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleReload = () => fetchDashboardData();
    window.addEventListener('digitick:list_created', handleReload);
    window.addEventListener('digitick:list_completed', handleReload);

    // Supabase Realtime synchronization across devices
    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('dashboard_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'shopping_lists' },
          () => fetchDashboardData()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'shopping_activity' },
          () => fetchDashboardData()
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('digitick:list_created', handleReload);
      window.removeEventListener('digitick:list_completed', handleReload);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await listsApi.createList(newTitle.trim());
      success(`List "${newTitle.trim()}" created!`);
      setNewTitle('');
      setCreateModalOpen(false);
      fetchDashboardData();
    } catch (err: any) {
      error(err.message || 'Failed to create list');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await listsApi.duplicateList(id);
      success('List duplicated successfully!');
      fetchDashboardData();
    } catch (err: any) {
      error(err.message || 'Failed to duplicate list');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this shopping list?')) return;
    try {
      await listsApi.deleteList(id);
      success('List deleted');
      fetchDashboardData();
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
      fetchDashboardData();
    } catch (err: any) {
      error(err.message || 'Failed to rename list');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await listsApi.completeList(id);
      success('List moved to Completed!');
      fetchDashboardData();
    } catch (err: any) {
      error(err.message || 'Failed to complete list');
    }
  };

  const handleReuse = async (id: string) => {
    try {
      const reused = await listsApi.reuseList(id);
      success(`Reused into "${reused.title}"!`);
      navigate(`/lists/${reused.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to reuse list');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-nature-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {
    total_lists: 0,
    active_lists: 0,
    completed_lists: 0,
    total_items_purchased: 0,
    completion_rate: 0,
  };

  const activeLists = data?.active_lists || [];
  const completedLists = data?.recently_completed || [];
  const recentActivity = data?.recent_activity || [];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Welcome Greeting Banner */}
      <WelcomeBanner />

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create New List
        </Button>
        <Button
          variant="secondary"
          icon={<ScanLine className="w-4 h-4" />}
          onClick={() => navigate('/scan')}
        >
          Scan Paper List
        </Button>
        <Button
          variant="outline"
          icon={<Archive className="w-4 h-4 text-nature-muted" />}
          onClick={() => navigate('/completed')}
        >
          View Completed Lists
        </Button>
      </div>

      {/* Key Metrics Overview */}
      <StatsOverview stats={stats} />

      {/* Active Shopping Lists Section */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="text-lg font-bold text-nature-forest dark:text-darknature-text tracking-tight">
              Active Shopping Lists ({activeLists.length})
            </h3>
            <p className="text-xs text-nature-muted dark:text-darknature-muted">
              Current household requirements and shopping progress
            </p>
          </div>
          {activeLists.length > 0 && (
            <button
              onClick={() => navigate('/lists')}
              className="text-xs font-semibold text-nature-primary dark:text-darknature-highlight hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {activeLists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeLists.map((list) => (
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
          <div className="p-8 text-center rounded-2xl bg-nature-white dark:bg-darknature-card border border-dashed border-nature-border dark:border-darknature-border">
            <ListTodo className="w-9 h-9 text-nature-muted dark:text-darknature-muted mx-auto mb-2" />
            <h4 className="text-sm font-bold text-nature-forest dark:text-darknature-text mb-1">
              No active shopping lists
            </h4>
            <p className="text-xs text-nature-muted dark:text-darknature-muted max-w-sm mx-auto mb-4">
              Create a new digital list or scan a handwritten note with AI.
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setCreateModalOpen(true)}
            >
              Create Your First List
            </Button>
          </div>
        )}
      </section>

      {/* Grid: Recently Completed & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recently Completed */}
        <section className="bg-nature-white dark:bg-darknature-card rounded-2xl p-5 border border-nature-border dark:border-darknature-border">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h3 className="text-sm font-bold text-nature-forest dark:text-darknature-text tracking-tight flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-nature-primary dark:text-darknature-highlight" />
                Recently Completed
              </h3>
              <p className="text-xs text-nature-muted dark:text-darknature-muted">Past grocery trips and household essentials</p>
            </div>
            {completedLists.length > 0 && (
              <button
                onClick={() => navigate('/completed')}
                className="text-xs font-semibold text-nature-primary dark:text-darknature-highlight hover:underline"
              >
                See all
              </button>
            )}
          </div>

          {completedLists.length > 0 ? (
            <div className="space-y-2.5">
              {completedLists.map((list) => (
                <div
                  key={list.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border hover:border-nature-primary/40 transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-nature-text dark:text-darknature-text">
                      {list.title}
                    </h4>
                    <span className="text-[11px] text-nature-muted dark:text-darknature-muted">
                      {list.total_items} items • Completed{' '}
                      {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
                        new Date(list.completed_at || list.updated_at || list.created_at)
                      )}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReuse(list.id)}
                  >
                    Reuse List
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-nature-muted py-5 text-center">
              No completed lists yet. Finish a shopping list to see it here!
            </p>
          )}
        </section>

        {/* Activity Feed */}
        <section className="bg-nature-white dark:bg-darknature-card rounded-2xl p-5 border border-nature-border dark:border-darknature-border">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h3 className="text-sm font-bold text-nature-forest dark:text-darknature-text tracking-tight flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-nature-forest dark:text-darknature-highlight" />
                Recent Shopping Activity
              </h3>
              <p className="text-xs text-nature-muted dark:text-darknature-muted">Audit log of lists and scans</p>
            </div>
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="flex items-start space-x-2.5 text-xs p-2 rounded-lg hover:bg-nature-offwhite dark:hover:bg-darknature-sidebar transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-nature-primary mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-nature-text dark:text-darknature-text">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-nature-muted dark:text-darknature-muted">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(act.created_at))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-nature-muted py-5 text-center">
              No recent activity recorded yet.
            </p>
          )}
        </section>
      </div>

      {/* Create List Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Shopping List"
        description="Organize your household requirements (e.g. Weekly Groceries, Kitchen Essentials)"
      >
        <form onSubmit={handleCreateList} className="space-y-4 pt-1">
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

      {/* Rename List Modal */}
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
