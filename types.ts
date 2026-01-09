
export enum CommissionRate {
  STANDARD = 50,
  PREMIUM = 100
}

export interface TicketEntry {
  id: string;
  date: string; // ISO Date YYYY-MM-DD
  timestamp: number;
  count: number;
  rate: number;
  totalCommission: number;
  sourceEmailSubject?: string;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  category: 'Rent' | 'Salary' | 'Utility' | 'Other';
  amount: number;
  description: string;
}

export interface DailyReport {
  date: string;
  ticketCount: number;
  totalCommission: number;
  isClosed: boolean;
}

export interface User {
  email: string;
  isLoggedIn: boolean;
}

export type ViewState = 'dashboard' | 'tickets' | 'expenses' | 'reports';
