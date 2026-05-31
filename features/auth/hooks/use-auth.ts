import { useAuthStore } from "../store/auth-store";

export function useAuth() {
  return useAuthStore();
}

export function useIsAdmin() {
  return useAuthStore(
    (s) => s.user?.role === "admin" || s.user?.role === "super_admin"
  );
}

export function useIsSuperAdmin() {
  return useAuthStore((s) => s.user?.role === "super_admin");
}

export function useCurrentUser() {
  return useAuthStore((s) => s.user);
}
