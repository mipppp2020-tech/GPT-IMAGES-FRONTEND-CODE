import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AiecRole } from '@/domain/types';

export type AiecTheme = 'sunlight' | 'slate';

interface AppValue {
  /** The session's single role. Never a set — see source requirement §10. */
  role: AiecRole;
  online: boolean;
  setOnline: (v: boolean) => void;
  /** Demo mode drives the DemoRibbon; real sessions run with it false. */
  demo: boolean;
}

const AppContext = createContext<AppValue | null>(null);

export function AppProvider({
  children,
  role = 'rider',
  demo = true,
}: {
  children: ReactNode;
  role?: AiecRole;
  demo?: boolean;
}) {
  const [online, setOnline] = useState(true);
  const value = useMemo(() => ({ role, online, setOnline, demo }), [role, online, demo]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
