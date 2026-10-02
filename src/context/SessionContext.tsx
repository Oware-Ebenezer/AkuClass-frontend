import { createContext, useContext, type ReactNode } from 'react';
import type { User } from '../types';

export interface Session {
  user: User;
  schoolName: string;
  academicYear: string;
  termName: string;
}

// PLACEHOLDER until auth is wired: replace with GET /api/v1/auth/me.
const placeholder: Session = {
  user: { id: 'placeholder', fullName: 'Ama Mensah', role: 'SCHOOL_ADMIN' },
  schoolName: 'AkuClass Academy',
  academicYear: '2026/2027',
  termName: 'Term 1',
};

const SessionContext = createContext<Session>(placeholder);

export function SessionProvider({ children }: { children: ReactNode }) {
  return <SessionContext.Provider value={placeholder}>{children}</SessionContext.Provider>;
}
export const useSession = () => useContext(SessionContext);
