import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../services/api';
import { DashboardStats, ActivityItem } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import {
  Mail,
  Calendar,
  Camera,
  Edit2,
  Clock,
  Upload,
  UserCheck
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const { success, error } = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState(user?.full_name || '');
  const [avatarInput, setAvatarInput] = useState(user?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dashboardApi
      .getSummary()
      .then((data) => {
        setStats(data.stats);
        setActivities(data.recent_activity);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error('Please select an image file (PNG, JPG, WEBP)');
      return;
    }

    setUploadingAvatar(true);
    try {
      const updated = await uploadAvatar(file);
      setAvatarInput(updated.avatar_url || '');
      success('Photo uploaded and set as profile avatar!');
    } catch (err: any) {
      error(err.message || 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(nameInput.trim(), avatarInput.trim() || undefined);
      setEditModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const memberSince = user?.created_at
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(user.created_at))
    : 'Recently';

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-10">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
          Account Profile & Shopping Stats
        </h2>
        <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
          Household profile details, shopping milestones, and activity audit
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-nature-white dark:bg-darknature-card rounded-2xl p-5 md:p-6 border border-nature-border dark:border-darknature-border flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
        <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-5 text-center md:text-left">
          {/* Avatar with initial or picture */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-nature-mint dark:bg-darknature-mint text-nature-forest dark:text-darknature-highlight font-extrabold text-2xl flex items-center justify-center border-2 border-nature-border dark:border-darknature-border overflow-hidden">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                (user?.full_name || user?.email || 'U')[0].toUpperCase()
              )}
            </div>
            <button
              onClick={() => {
                setNameInput(user?.full_name || '');
                setAvatarInput(user?.avatar_url || '');
                setEditModalOpen(true);
              }}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-nature-forest text-white dark:bg-darknature-primary dark:text-darknature-bg hover:scale-105 transition-transform"
              title="Edit Profile"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold text-nature-forest dark:text-darknature-text">
              {user?.full_name || 'Household Shopper'}
            </h3>
            <p className="text-xs text-nature-muted dark:text-darknature-muted flex items-center justify-center md:justify-start gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" />
              {user?.email}
            </p>
            <p className="text-xs text-nature-muted dark:text-darknature-muted flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              Member since {memberSince}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Edit2 className="w-3.5 h-3.5" />}
          onClick={() => {
            setNameInput(user?.full_name || '');
            setAvatarInput(user?.avatar_url || '');
            setEditModalOpen(true);
          }}
        >
          Edit Profile
        </Button>
      </div>

      {/* Shopping Statistics Cards */}
      <section>
        <h3 className="text-base font-bold text-nature-forest dark:text-darknature-text tracking-tight mb-3">
          Household Shopping Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border">
            <span className="text-xs font-medium text-nature-muted dark:text-darknature-muted block mb-1">
              Total Lists Created
            </span>
            <span className="text-xl font-bold text-nature-forest dark:text-darknature-text">
              {stats?.total_lists || 0}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border">
            <span className="text-xs font-medium text-nature-muted dark:text-darknature-muted block mb-1">
              Active Lists
            </span>
            <span className="text-xl font-bold text-nature-primary dark:text-darknature-highlight">
              {stats?.active_lists || 0}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border">
            <span className="text-xs font-medium text-nature-muted dark:text-darknature-muted block mb-1">
              Trips Completed
            </span>
            <span className="text-xl font-bold text-nature-forest dark:text-darknature-primary">
              {stats?.completed_lists || 0}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-nature-white dark:bg-darknature-card border border-nature-border dark:border-darknature-border">
            <span className="text-xs font-medium text-nature-muted dark:text-darknature-muted block mb-1">
              Items Purchased
            </span>
            <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
              {stats?.total_items_purchased || 0}
            </span>
          </div>
        </div>
      </section>

      {/* Shopping Activity History */}
      <section className="bg-nature-white dark:bg-darknature-card rounded-2xl p-5 border border-nature-border dark:border-darknature-border">
        <h3 className="text-sm font-bold text-nature-forest dark:text-darknature-text tracking-tight flex items-center gap-1.5 mb-3.5">
          <Clock className="w-4 h-4 text-nature-primary dark:text-darknature-highlight" />
          Shopping Activity History
        </h3>

        {activities.length > 0 ? (
          <div className="divide-y divide-nature-border/60 dark:divide-darknature-border/60">
            {activities.map((act) => (
              <div key={act.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-nature-primary flex-shrink-0" />
                  <span className="font-medium text-nature-text dark:text-darknature-text">
                    {act.description}
                  </span>
                </div>
                <span className="text-[11px] text-nature-muted dark:text-darknature-muted flex-shrink-0">
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(act.created_at))}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-nature-muted py-5 text-center">
            No shopping activity recorded yet.
          </p>
        )}
      </section>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile Information"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
          <Input
            label="Full Name"
            placeholder="e.g. Alex Johnson"
            value={nameInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameInput(e.target.value)}
          />

          {/* Upload Photo Button */}
          <div>
            <label className="text-xs font-semibold text-nature-forest dark:text-darknature-highlight block mb-1.5">
              Profile Photo Upload
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                loading={uploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingAvatar ? 'Uploading...' : 'Upload Image from Computer'}
              </Button>
              {avatarInput && (
                <span className="text-[11px] text-nature-primary dark:text-darknature-highlight flex items-center gap-1 font-semibold">
                  <UserCheck className="w-3.5 h-3.5" /> Avatar attached
                </span>
              )}
            </div>
            <p className="text-[11px] text-nature-muted dark:text-darknature-muted mt-1">
              Supports JPG, PNG, WEBP files up to 5MB.
            </p>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-nature-border dark:border-darknature-border"></div>
            <span className="flex-shrink mx-2 text-[10px] text-nature-muted uppercase tracking-wider font-semibold">Or enter custom link</span>
            <div className="flex-grow border-t border-nature-border dark:border-darknature-border"></div>
          </div>

          <Input
            label="Avatar Image URL (Optional)"
            placeholder="https://images.unsplash.com/..."
            value={avatarInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarInput(e.target.value)}
            helperText="Paste any public image link or leave empty for letter avatar"
          />

          <div className="flex justify-end space-x-2 pt-2 border-t border-nature-border dark:border-darknature-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
