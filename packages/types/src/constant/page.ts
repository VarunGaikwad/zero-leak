import { Dispatch, SetStateAction } from "react";
import { LucideIcon } from "lucide-react";

import {
  Bell,
  LayoutDashboard,
  PieChart,
  Settings,
  Tag,
  Target,
  Wallet,
  ArrowLeftRight,
} from "lucide-react";

export type MenuType = {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  path: string;
};

export type TransactionType = "in" | "out";

export type Transaction = {
  id: number;
  datetime: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
};

export const PATHS = {
  home: "/",
  transactions: "/transactions",
  categories: "/categories",
  goals: "/goals",
  budget: "/budget",
  reports: "/reports",
  alerts: "/alerts",
  settings: "/settings",
} as const;

export type AppPath = (typeof PATHS)[keyof typeof PATHS];

export const MENU = [
  {
    title: "Home",
    Icon: LayoutDashboard,
    subtitle: "Overview & summary",
    path: PATHS.home,
  },
  {
    title: "Transactions",
    Icon: ArrowLeftRight,
    subtitle: "Income & expenses",
    path: PATHS.transactions,
  },
  {
    title: "Categories",
    Icon: Tag,
    subtitle: "Organize spending",
    path: PATHS.categories,
  },
  {
    title: "Goals",
    Icon: Target,
    subtitle: "Track your targets",
    path: PATHS.goals,
  },
  {
    title: "Budget",
    Icon: Wallet,
    subtitle: "Monthly limits",
    path: PATHS.budget,
  },
  {
    title: "Reports",
    Icon: PieChart,
    subtitle: "Charts & insights",
    path: PATHS.reports,
  },
  {
    title: "Alerts",
    Icon: Bell,
    subtitle: "Leaks & warnings",
    path: PATHS.alerts,
  },
  {
    title: "Settings",
    Icon: Settings,
    subtitle: "App preferences",
    path: PATHS.settings,
  },
] as const satisfies readonly MenuType[];

export type TransactionForm = {
  datetime: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Food", color: "#10b981", iconName: "Utensils" },
  { id: 2, name: "Transport", color: "#3b82f6", iconName: "Bus" },
  { id: 3, name: "Salary", color: "#22c55e", iconName: "Banknote" },
  { id: 4, name: "Shopping", color: "#ec4899", iconName: "ShoppingBag" },
  { id: 5, name: "Utilities", color: "#f59e0b", iconName: "Zap" },
];

export const CATEGORIES = DEFAULT_CATEGORIES.map((c) => c.name);

export type OutletContext = {
  onAdd: () => void;
  onEdit: (t: Transaction) => void;
  transactions: Transaction[];
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
};



export function getLocalDatetime() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // minutes → milliseconds
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
}

export const EMPTY_FORM: TransactionForm = {
  datetime: "",
  description: "",
  category: "Food",
  type: "out",
  amount: 0,
};

export function formatAmount(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

export function formatDate(datetime: string) {
  const d = new Date(datetime);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const hours = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]}, ${hours}:${mins}`;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    datetime: "2026-03-13T09:30",
    description: "Grocery shopping",
    category: "Food",
    type: "out",
    amount: 2400,
  },
  {
    id: 2,
    datetime: "2026-03-12T18:00",
    description: "Monthly salary",
    category: "Salary",
    type: "in",
    amount: 85000,
  },
  {
    id: 3,
    datetime: "2026-03-11T08:15",
    description: "Metro card recharge",
    category: "Transport",
    type: "out",
    amount: 500,
  },
  {
    id: 4,
    datetime: "2026-03-10T14:20",
    description: "Amazon order",
    category: "Shopping",
    type: "out",
    amount: 3200,
  },
  {
    id: 5,
    datetime: "2026-03-09T11:00",
    description: "Electricity bill",
    category: "Utilities",
    type: "out",
    amount: 1800,
  },
  {
    id: 6,
    datetime: "2026-03-08T17:45",
    description: "Freelance payment",
    category: "Salary",
    type: "in",
    amount: 25000,
  },
  {
    id: 7,
    datetime: "2026-03-07T20:30",
    description: "Restaurant dinner",
    category: "Food",
    type: "out",
    amount: 1200,
  },
  {
    id: 8,
    datetime: "2026-03-06T09:00",
    description: "Uber ride",
    category: "Transport",
    type: "out",
    amount: 320,
  },
];

export type Category = {
  id: number;
  name: string;
  color: string; // hex value e.g. "#10b981"
  iconName: string; // lucide icon name e.g. "Utensils"
};

export type BudgetPeriod = "monthly" | "yearly";

export type CategoryBudget = {
  id: number;
  category: string;
  limit: number;
  period: BudgetPeriod;
};

export type MonthlyBudget = {
  limit: number;
  period: BudgetPeriod;
};
