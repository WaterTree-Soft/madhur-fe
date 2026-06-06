export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: import("@/types").User | null;
  jwt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginDialogOpen: boolean;
  openLoginDialog: () => void;
  closeLoginDialog: () => void;
  login: (data: LoginFormData) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  setUser: (user: import("@/types").User | null) => void;
  rehydrate: () => Promise<void>;
}
