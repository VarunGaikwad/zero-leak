export interface Category {
  id: string;
  title: string;
  type: "Expense" | "Income";
  icon: string;
  numberOfTransaction: number;
}

export interface Account {
  id: string;
  title: string;
  balance: number;
  currency: string;
  totalTransaction: number;
  type: string;
}

export interface Budget {
  id: string;
  title: string;
  spent: number;
  limit: number;
  category: { id: string; title: string; color?: string }[];
}

export interface Transaction {
  id: string;
  title: string;
  accountId: string;
  category: { title: string; isMain: boolean; icon?: string }[];
  note: string;
  amount: number;
  datetime: string;
}

export interface Subscription {
  id: string;
  name: string;
  accountId?: string;
  repeatNumber: number;
  repeatUnit: "day" | "week" | "month" | "year";
  amount: number;
  untilDate: string;
  upcomingPayDate: string;
  icon: string;
}

export let categories: Category[] = [
  { id: "1", title: "Grocery", icon: "ShoppingCart", numberOfTransaction: 0, type: "Expense" },
  { id: "2", title: "Transport", icon: "Train", numberOfTransaction: 0, type: "Expense" },
  { id: "3", title: "Food", icon: "UtensilsCrossed", numberOfTransaction: 0, type: "Expense" },
  { id: "4", title: "Health", icon: "HeartPulse", numberOfTransaction: 0, type: "Expense" },
  { id: "5", title: "Shopping", icon: "ShoppingBag", numberOfTransaction: 0, type: "Expense" },
  { id: "6", title: "Income", icon: "TrendingUp", numberOfTransaction: 0, type: "Income" },
  { id: "7", title: "Rent", icon: "Home", numberOfTransaction: 0, type: "Expense" },
];

export let accounts: Account[] = [
  { id: "a1", title: "Bank", balance: 0, currency: "¥", totalTransaction: 0, type: "Bank" },
];

export let budgets: Budget[] = [];
export let transactions: Transaction[] = [];
export let subscriptions: Subscription[] = [];
