import { create } from 'zustand';

const USERS_STORAGE_KEY = 'wholemart_local_users_v1';
const SESSION_STORAGE_KEY = 'wholemart_local_session_v1';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface AuthUser {
  uid: string;
  displayName: string;
  email: string;
}

export interface CreateAccountInput {
  displayName: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  createAccount: (input: CreateAccountInput) => Promise<boolean>;
  signIn: (input: SignInInput) => Promise<boolean>;
  signOut: () => void;
  clearError: () => void;
}

const isStoredUser = (value: unknown): value is StoredUser => {
  if (!value || typeof value !== 'object') return false;
  const user = value as Record<string, unknown>;
  return (
    typeof user.uid === 'string' &&
    typeof user.displayName === 'string' &&
    typeof user.email === 'string' &&
    typeof user.passwordHash === 'string' &&
    typeof user.passwordSalt === 'string' &&
    typeof user.createdAt === 'string'
  );
};

const loadUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter(isStoredUser) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const toAuthUser = (user: StoredUser): AuthUser => ({
  uid: user.uid,
  displayName: user.displayName,
  email: user.email,
});

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getSessionUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const userId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!userId) return null;
  const user = loadUsers().find((candidate) => candidate.uid === userId);
  return user ? toAuthUser(user) : null;
};

const createSalt = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const hashPassword = async (password: string, salt: string) => {
  if (!crypto.subtle) {
    throw new Error('Secure password storage is unavailable in this browser.');
  }

  const encoded = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const createUserId = () => crypto.randomUUID();

const setSession = (userId: string) => {
  localStorage.setItem(SESSION_STORAGE_KEY, userId);
};

export const hasLocalUsers = () => loadUsers().length > 0;

export const useAuthStore = create<AuthState>((set) => ({
  user: getSessionUser(),
  isLoading: false,
  error: null,

  createAccount: async ({ displayName, email, password }) => {
    const normalizedName = displayName.trim();
    const normalizedEmail = normalizeEmail(email);

    if (normalizedName.length < 2) {
      set({ error: 'Enter your full name.' });
      return false;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      set({ error: 'Enter a valid email address.' });
      return false;
    }

    if (password.length < 8) {
      set({ error: 'Password must contain at least 8 characters.' });
      return false;
    }

    const users = loadUsers();
    if (users.some((user) => user.email === normalizedEmail)) {
      set({ error: 'An account with this email already exists.' });
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const passwordSalt = createSalt();
      const passwordHash = await hashPassword(password, passwordSalt);
      const storedUser: StoredUser = {
        uid: createUserId(),
        displayName: normalizedName,
        email: normalizedEmail,
        passwordHash,
        passwordSalt,
        createdAt: new Date().toISOString(),
      };

      saveUsers([...users, storedUser]);
      setSession(storedUser.uid);
      set({ user: toAuthUser(storedUser), isLoading: false, error: null });
      return true;
    } catch {
      set({
        isLoading: false,
        error: 'The account could not be created. Please try again.',
      });
      return false;
    }
  },

  signIn: async ({ email, password }) => {
    const normalizedEmail = normalizeEmail(email);
    if (!EMAIL_PATTERN.test(normalizedEmail) || !password) {
      set({ error: 'Enter your email address and password.' });
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const user = loadUsers().find((candidate) => candidate.email === normalizedEmail);
      if (!user) {
        set({ isLoading: false, error: 'Email or password is incorrect.' });
        return false;
      }

      const passwordHash = await hashPassword(password, user.passwordSalt);
      if (passwordHash !== user.passwordHash) {
        set({ isLoading: false, error: 'Email or password is incorrect.' });
        return false;
      }

      setSession(user.uid);
      set({ user: toAuthUser(user), isLoading: false, error: null });
      return true;
    } catch {
      set({
        isLoading: false,
        error: 'Sign in could not be completed. Please try again.',
      });
      return false;
    }
  },

  signOut: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    set({ user: null, isLoading: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
