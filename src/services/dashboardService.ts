import type { DashboardSummary } from '../types';
import { apiGet } from './apiClient';

// Endpoint per contract section 24. The response shape is NOT yet defined by the contract.
export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    return (await import('./fixtures/dashboard')).dashboardFixture();
  }
  return apiGet<DashboardSummary>('/dashboard/school-admin');
}
