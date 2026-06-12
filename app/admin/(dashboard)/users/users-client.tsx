"use client";

import React, { useState } from "react";
import { type DashboardUser } from "@/lib/db-queries";
import { createUserAction, updateUserAction, deleteUserAction } from "./actions";
import { Pagination } from "@/components/ui/pagination";
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  X,
  ShieldAlert,
  Search,
  Key,
  ShieldCheck,
  Calendar,
} from "lucide-react";

const AVAILABLE_PERMISSIONS = [
  "User Management",
  "Product Management",
  "Enquiry Management",
  "Enquiry View",
  "Contact Management",
  "Contact View",
  "Blogs Management",
  "FAQs Management",
];

interface UsersClientProps {
  initialUsers: DashboardUser[];
  currentUserEmail: string;
}

export function UsersClient({ initialUsers, currentUserEmail }: UsersClientProps) {
  const [users, setUsers] = useState<DashboardUser[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DashboardUser | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  // Filter users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  function openCreateForm() {
    setEditingUser(null);
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  }

  function openEditForm(user: DashboardUser) {
    setEditingUser(user);
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
      let result;
      if (editingUser) {
        result = await updateUserAction(editingUser.email, null, formData);
      } else {
        result = await createUserAction(null, formData);
      }

      if (result.success) {
        setFormSuccess(
          editingUser
            ? "User permissions updated successfully!"
            : "New user created successfully!"
        );

        // Update local state without full reload
        const name = formData.get("name") as string;
        const email = (editingUser?.email || formData.get("email")) as string;
        const selectedPermissions = formData.getAll("permissions") as string[];

        if (editingUser) {
          setUsers(
            users.map((u) =>
              u.email.toLowerCase() === email.toLowerCase()
                ? { ...u, name, permissions: selectedPermissions }
                : u
            )
          );
        } else {
          setUsers([
            ...users,
            {
              id: email.toLowerCase(),
              email: email.toLowerCase(),
              name,
              passwordHash: "",
              salt: "",
              permissions: selectedPermissions,
              createdAt: new Date().toISOString(),
            },
          ]);
        }

        setTimeout(() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }, 1000);
      } else {
        setFormError(result.error || "An error occurred");
      }
    } catch (err) {
      console.error(err);
      setFormError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(email: string) {
    setLoading(true);
    try {
      const result = await deleteUserAction(email);
      if (result.success) {
        setUsers(users.filter((u) => u.email.toLowerCase() !== email.toLowerCase()));
        setDeletingUser(null);
      } else {
        alert(result.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="size-6 text-primary" />
            User Management
          </h1>
          <p className="text-xs text-slate-500">
            Create internal admin accounts and assign permissions for roles
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="h-10 inline-flex items-center gap-2 px-4 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/15 transition-all"
        >
          <UserPlus className="size-4" />
          <span>Create User</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="size-4" />
        </span>
        <input
          type="text"
          placeholder="Filter users by name or email..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full h-10 pl-9 pr-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-all"
        />
      </div>

      {/* Users table */}
      <div className="overflow-x-auto rounded-[1.5rem] border border-slate-800 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6">User Account</th>
              <th className="py-4 px-6">Granted Permissions</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-12 text-center text-slate-500">
                  No admin users found matching the search criteria.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => {
                const isSelf = user.email.toLowerCase() === currentUserEmail.toLowerCase();
                return (
                  <tr key={user.email} className="hover:bg-white/2 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-white flex items-center gap-2">
                          {user.name}
                          {isSelf && (
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase">
                              You
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-md">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.length === 0 ? (
                          <span className="text-[10px] font-bold text-slate-600 italic">
                            No Permissions
                          </span>
                        ) : (
                          user.permissions.map((perm) => (
                            <span
                              key={perm}
                              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300"
                            >
                              <ShieldCheck className="size-3 text-sky-400" />
                              {perm}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(user)}
                          disabled={isSelf}
                          className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                          title={isSelf ? "Use configuration settings for self updates" : "Edit user"}
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(user.email)}
                          disabled={isSelf}
                          className="size-8 inline-flex items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-rose-400"
                          title={isSelf ? "Self-deletion is protected" : "Delete user"}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <Pagination
          totalItems={filteredUsers.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Slide-out Sidebar Form (Drawer Modal) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50 animate-fadeIn">
          {/* Backdrop closer */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsFormOpen(false)} />

          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl p-6 md:p-8 animate-slideLeft">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {editingUser ? <Edit2 className="size-5 text-primary" /> : <UserPlus className="size-5 text-primary" />}
                  {editingUser ? "Edit User Permissions" : "Create New User"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {editingUser ? `Updating account for ${editingUser.email}` : "Configure access details"}
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="size-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-6 space-y-6">
              {formError && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive-foreground flex gap-2">
                  <ShieldAlert className="size-4 shrink-0 text-rose-400 mt-0.5" />
                  <span className="font-semibold text-rose-300">{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-300 flex gap-2">
                  <ShieldCheck className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="font-semibold">{formSuccess}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-name">
                    Full Name
                  </label>
                  <input
                    id="form-name"
                    name="name"
                    type="text"
                    required
                    defaultValue={editingUser?.name || ""}
                    placeholder="Enter name"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="form-email">
                    Email Address
                  </label>
                  <input
                    id="form-email"
                    name="email"
                    type="email"
                    required
                    disabled={!!editingUser}
                    defaultValue={editingUser?.email || ""}
                    placeholder="user@example.com"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all disabled:opacity-50 disabled:bg-slate-950 disabled:text-slate-500"
                  />
                </div>

                {/* Password (Optional for edit) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5" htmlFor="form-password">
                    Password {editingUser && <span className="text-[10px] text-slate-500 font-normal italic">(Leave blank to keep current)</span>}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-600">
                      <Key className="size-3.5" />
                    </span>
                    <input
                      id="form-password"
                      name="password"
                      type="password"
                      required={!editingUser}
                      placeholder={editingUser ? "••••••••" : "At least 6 characters"}
                      className="w-full h-11 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Permissions checklist */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Permissions Checklist
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {AVAILABLE_PERMISSIONS.map((perm) => {
                      const isDefaultChecked = editingUser?.permissions.includes(perm) || false;
                      return (
                        <label
                          key={perm}
                          className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-950 hover:border-slate-700 transition-all cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            name="permissions"
                            value={perm}
                            defaultChecked={isDefaultChecked}
                            className="size-4 mt-0.5 rounded border-slate-800 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-slate-950"
                          />
                          <span className="text-xs font-semibold text-slate-300 leading-tight">
                            {perm}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer footer actions */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="h-11 px-6 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-6 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all flex items-center justify-center min-w-28"
                >
                  {loading ? (
                    <div className="size-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                  ) : editingUser ? (
                    "Save Changes"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="size-8 shrink-0 text-rose-500" />
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white">Delete Admin User?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the admin account for{" "}
              <span className="font-bold text-white">{deletingUser}</span>? They will lose access to
              the management portal immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="h-10 px-4 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(deletingUser)}
                className="h-10 px-4 rounded-xl bg-rose-500 text-xs font-bold text-white hover:bg-rose-600 transition-all flex items-center justify-center min-w-20"
              >
                {loading ? (
                  <div className="size-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
