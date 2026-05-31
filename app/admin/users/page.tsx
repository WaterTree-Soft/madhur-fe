"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { useCurrentUser, useIsSuperAdmin } from "@/features/auth";
import { useAuthStore } from "@/features/auth/store/auth-store";

interface ExpressUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ExpressUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoteTarget, setPromoteTarget] = useState<ExpressUser | null>(null);
  const [promoting, setPromoting] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ExpressUser | null>(null);
  const [revoking, setRevoking] = useState(false);
  const currentUser = useCurrentUser();
  const isSuperAdmin = useIsSuperAdmin();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const json = await res.json();
      setUsers(json.data ?? []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleMakeAdmin() {
    if (!promoteTarget) return;
    setPromoting(true);
    try {
      const res = await fetch(`/api/admin/users/${promoteTarget.id}/make-admin`, { method: "PUT" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Failed to promote user");
        return;
      }
      await fetchUsers();
    } catch {
      alert("Something went wrong");
    } finally {
      setPromoting(false);
      setPromoteTarget(null);
    }
  }

  async function handleRevokeAdmin() {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      const jwt = useAuthStore.getState().jwt;
      const res = await fetch(`/api/admin/users/${revokeTarget.id}/revoke-admin`, {
        method: "PUT",
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Failed to revoke admin access");
        return;
      }
      await fetchUsers();
    } catch {
      alert("Something went wrong");
    } finally {
      setRevoking(false);
      setRevokeTarget(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-3xl font-bold mb-6">Manage Users</h1>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2 sm:p-4 font-medium">User</th>
                <th className="text-left p-2 sm:p-4 font-medium">Email</th>
                <th className="text-left p-2 sm:p-4 font-medium">Role</th>
                <th className="text-left p-2 sm:p-4 font-medium">Joined</th>
                {isSuperAdmin && <th className="text-right p-2 sm:p-4 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => {
                const isAdmin = user.role === "admin";
                const isSuperAdminUser = user.role === "super_admin";
                const initials = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="p-2 sm:p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 shrink-0">
                          <AvatarFallback className="text-[10px] sm:text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium truncate max-w-[80px] sm:max-w-none">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-2 sm:p-4 text-muted-foreground truncate max-w-[100px] sm:max-w-none">{user.email}</td>
                    <td className="p-2 sm:p-4">
                      <Badge variant={isSuperAdminUser ? "destructive" : isAdmin ? "default" : "secondary"} className="text-[10px] sm:text-xs px-1.5 sm:px-2 whitespace-nowrap">
                        {isSuperAdminUser ? "super admin" : isAdmin ? "admin" : "user"}
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    {isSuperAdmin && (
                      <td className="p-2 sm:p-4 text-right">
                        {!isAdmin && !isSuperAdminUser && (
                          <Button variant="outline" size="sm" className="h-7 text-xs sm:h-9 sm:text-sm px-2 sm:px-3" onClick={() => setPromoteTarget(user)}>
                            <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Make Admin</span>
                          </Button>
                        )}
                        {isAdmin && user.id !== currentUser?.id && (
                          <Button variant="outline" size="sm" className="h-7 text-xs sm:h-9 sm:text-sm px-2 sm:px-3 text-destructive border-destructive/50 hover:bg-destructive/10" onClick={() => setRevokeTarget(user)}>
                            <ShieldOff className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Revoke Admin</span>
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={isSuperAdmin ? 5 : 4} className="p-8 text-center text-muted-foreground text-sm">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!promoteTarget} onOpenChange={(open) => { if (!open && !promoting) setPromoteTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Promote to Admin?</DialogTitle>
            <DialogDescription>
              Are you sure you want to make <strong>{promoteTarget?.name}</strong> ({promoteTarget?.email}) an admin?
              They will have full access to the admin panel.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setPromoteTarget(null)} disabled={promoting}>Cancel</Button>
            <Button onClick={handleMakeAdmin} disabled={promoting}>
              {promoting && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!revokeTarget} onOpenChange={(open) => { if (!open && !revoking) setRevokeTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Revoke Admin Access?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove admin access from <strong>{revokeTarget?.name}</strong> ({revokeTarget?.email})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setRevokeTarget(null)} disabled={revoking}>Cancel</Button>
            <Button variant="destructive" onClick={handleRevokeAdmin} disabled={revoking}>
              {revoking && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Revoke Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
