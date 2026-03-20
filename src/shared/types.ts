export interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  createdAt: string;
}

export interface BudgetSession {
  id: string;
  budgetAmount: number;
  totalSpent: number;
  createdAt: string;
}

export interface PlannedItem {
  id: string;
  name: string;
  createdAt: string;
}
