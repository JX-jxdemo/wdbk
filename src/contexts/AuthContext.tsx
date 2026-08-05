import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: number;
  username: string;
  role: "admin" | "user";
  birthday: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  setBirthday: (birthday: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const TOKEN_KEY = "neon_blog_token";

// 简易 fetch 封装，自动带 token
async function api<T = any>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`/api${path}`, { ...opts, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error((data && data.error) || `HTTP ${res.status}`);
  }
  return data as T;
}

export const apiFetch = api;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const r = await api<{ user: AuthUser | null }>("/auth/me");
      setUser(r.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (username: string, password: string) => {
    const r = await api<{ token: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem(TOKEN_KEY, r.token);
    setUser(r.user);
  };

  const register = async (username: string, password: string) => {
    const r = await api<{ token: string; user: AuthUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem(TOKEN_KEY, r.token);
    setUser(r.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const setBirthday = async (birthday: string | null) => {
    await api("/auth/me/birthday", {
      method: "PATCH",
      body: JSON.stringify({ birthday }),
    });
    setUser((u) => (u ? { ...u, birthday } : u));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token: localStorage.getItem(TOKEN_KEY),
        login,
        register,
        logout,
        refresh: fetchMe,
        setBirthday,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
