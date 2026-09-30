import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Trash2,
  Eye,
  Activity,
  FileCheck,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  MessageSquare,
} from 'lucide-react';
import type { StoredUserPlan, DashboardStats } from '../types/fitness.ts';
import { UserDetailsModal } from './UserDetailsModal.tsx';

interface AdminDashboardProps {
  onSelectUserPlan: (user: StoredUserPlan) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectUserPlan }) => {
  const [users, setUsers] = useState<StoredUserPlan[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPlansGenerated: 0,
    updatedPlans: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  // Search, Filter & Sort states
  const [search, setSearch] = useState('');
  const [goalFilter, setGoalFilter] = useState('all');
  const [intensityFilter, setIntensityFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'goal'>('newest');

  // Modal states
  const [selectedUser, setSelectedUser] = useState<StoredUserPlan | null>(null);
  const [modalTab, setModalTab] = useState<'profile' | 'original' | 'updated' | 'feedback'>('profile');
  const [userToDelete, setUserToDelete] = useState<StoredUserPlan | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (goalFilter !== 'all') queryParams.set('goal', goalFilter);
      if (intensityFilter !== 'all') queryParams.set('intensity', intensityFilter);
      if (experienceFilter !== 'all') queryParams.set('experience', experienceFilter);
      if (sortBy) queryParams.set('sortBy', sortBy);

      const [usersRes, statsRes] = await Promise.all([
        fetch(`/api/users?${queryParams.toString()}`),
        fetch('/api/stats'),
      ]);

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      if (usersData.success) {
        setUsers(usersData.users);
      }
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, goalFilter, intensityFilter, experienceFilter, sortBy]);

  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUserToDelete(null);
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset demo dataset with pre-seeded test profiles?')) {
      try {
        await fetch('/api/reset-demo', { method: 'POST' });
        fetchUsers();
      } catch (err) {
        console.error('Error resetting demo:', err);
      }
    }
  };

  const openModal = (user: StoredUserPlan, tab: 'profile' | 'original' | 'updated' | 'feedback') => {
    setSelectedUser(user);
    setModalTab(tab);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 no-print">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Admin & Coach Console
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
            FitBuddy Management Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor registered users, inspect original & updated fitness plans, and review feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Refresh user records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Restore sample test users"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Total Users
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-white mt-2">
            {stats.totalUsers}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Registered profiles</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Plans Generated
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-cyan-400 mt-2">
            {stats.totalPlansGenerated}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">7-day AI routines created</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Updated Plans
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-amber-400 mt-2">
            {stats.updatedPlans}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Feedback-based revisions</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Active Users
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-violet-300 mt-2">
            {stats.activeUsers}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Current active routines</span>
        </div>
      </div>

      {/* SECTION 11: SEARCH AND FILTER CONTROLS */}
      <div className="p-5 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search by Name or User ID */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or User ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Filter by Goal */}
          <div>
            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Goals</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="General Wellness">General Wellness</option>
              <option value="Strength">Strength</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Endurance">Endurance</option>
            </select>
          </div>

          {/* Filter by Intensity */}
          <div>
            <select
              value={intensityFilter}
              onChange={(e) => setIntensityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Intensities</option>
              <option value="Low">Low Intensity</option>
              <option value="Medium">Medium Intensity</option>
              <option value="High">High Intensity</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="goal">Sort: By Goal</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 10: USER TABLE */}
      <div className="rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[11px] font-extrabold tracking-wider">
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-3">Age</th>
                <th className="py-3.5 px-3">Weight</th>
                <th className="py-3.5 px-4">Goal</th>
                <th className="py-3.5 px-3">Intensity</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.userId}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* User ID */}
                    <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold text-xs">
                      {u.userId}
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      <div>{u.name}</div>
                      {u.email && (
                        <div className="text-[10px] font-normal text-emerald-400/90 flex items-center gap-1 mt-0.5">
                          <span>👤</span> {u.email}
                        </div>
                      )}
                    </td>

                    {/* Age */}
                    <td className="py-3.5 px-3 text-slate-300">
                      {u.age}
                    </td>

                    {/* Weight */}
                    <td className="py-3.5 px-3 text-slate-300">
                      {u.weightKg} kg
                    </td>

                    {/* Goal */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {u.goal}
                      </span>
                    </td>

                    {/* Intensity */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-xs font-bold ${
                          u.intensity === 'High'
                            ? 'text-red-400'
                            : u.intensity === 'Medium'
                            ? 'text-amber-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        {u.intensity}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {u.status === 'updated' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          Updated
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          Original
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <button
                          onClick={() => openModal(u, 'profile')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                          title="View Profile"
                        >
                          Profile
                        </button>

                        <button
                          onClick={() => openModal(u, 'original')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-medium border border-slate-700 transition-colors"
                          title="View Original Plan"
                        >
                          Original
                        </button>

                        {u.updatedPlan && (
                          <button
                            onClick={() => openModal(u, 'updated')}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-medium border border-slate-700 transition-colors"
                            title="View Updated Plan"
                          >
                            Updated
                          </button>
                        )}

                        {u.feedback && (
                          <button
                            onClick={() => openModal(u, 'feedback')}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-medium border border-slate-700 transition-colors"
                            title="View Feedback"
                          >
                            Feedback
                          </button>
                        )}

                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          initialTab={modalTab}
          onClose={() => setSelectedUser(null)}
          onSelectForActive={(user) => {
            onSelectUserPlan(user);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-red-500/40 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-heading font-bold text-white">Delete User Plan?</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Are you sure you want to delete <strong className="text-white">{userToDelete.name}</strong> ({userToDelete.userId})? This will permanently remove their original and updated workout plans.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(userToDelete.userId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
