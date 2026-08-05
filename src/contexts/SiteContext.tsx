import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiFetch } from "./AuthContext";

export interface SiteStatus {
  registrationEnabled: boolean;
  likeModuleEnabled: boolean;
  noticeModuleEnabled: boolean;
  musicModuleEnabled: boolean;
}

interface SiteState {
  status: SiteStatus;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteContext = createContext<SiteState | undefined>(undefined);

const defaultStatus: SiteStatus = {
  registrationEnabled: true,
  likeModuleEnabled: true,
  noticeModuleEnabled: true,
  musicModuleEnabled: true,
};

export function SiteProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SiteStatus>(defaultStatus);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const r = await apiFetch<SiteStatus>("/admin/status");
      setStatus(r);
    } catch {
      setStatus(defaultStatus);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SiteContext.Provider value={{ status, loading, refresh }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be inside SiteProvider");
  return ctx;
}
