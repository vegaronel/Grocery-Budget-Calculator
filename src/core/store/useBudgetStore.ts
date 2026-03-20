import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Item, BudgetSession, PlannedItem } from '../../shared/types';
import { zustandStorage } from '../../storage/zustandStorage';

interface BudgetState {
  session: BudgetSession | null;
  items: Item[];
  lastDeletedItem: Item | null;
  plannedItems: PlannedItem[];
  previousGroceries: Item[];

  // Actions
  setBudget: (amount: number) => void;
  addItem: (item: Omit<Item, 'id' | 'total' | 'createdAt'>) => void;
  deleteItem: (id: string) => void;
  undoDelete: () => void;
  clearAll: () => void;
  clearSession: () => void;

  addPlannedItem: (name: string) => void;
  removePlannedItem: (id: string) => void;
  clearPlannedItems: () => void;
  importPlannedItems: (items: PlannedItem[]) => void;
}

const computeTotals = (items: Item[]) => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      session: null,
      items: [],
      lastDeletedItem: null,
      plannedItems: [],
      previousGroceries: [],

      setBudget: (amount: number) => {
        set((state) => ({
          session: {
            id: Date.now().toString(),
            budgetAmount: amount,
            totalSpent: state.session?.totalSpent || 0,
            createdAt: new Date().toISOString(),
          },
        }));
      },

      addItem: (itemData) => {
        set((state) => {
          const newItem: Item = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            name: itemData.name || 'Unnamed Item',
            price: itemData.price,
            quantity: itemData.quantity,
            total: itemData.price * itemData.quantity,
            createdAt: new Date().toISOString(),
          };

          const newItems = [...state.items, newItem];
          const newTotalSpent = computeTotals(newItems);

          return {
            items: newItems,
            session: state.session
              ? { ...state.session, totalSpent: newTotalSpent }
              : null,
          };
        });
      },

      deleteItem: (id: string) => {
        set((state) => {
          const itemToDelete = state.items.find((i) => i.id === id);
          if (!itemToDelete) return state;

          const newItems = state.items.filter((i) => i.id !== id);
          const newTotalSpent = computeTotals(newItems);

          return {
            items: newItems,
            lastDeletedItem: itemToDelete,
            session: state.session
              ? { ...state.session, totalSpent: newTotalSpent }
              : null,
          };
        });
      },

      undoDelete: () => {
        set((state) => {
          if (!state.lastDeletedItem) return state;

          const newItems = [...state.items, state.lastDeletedItem];
          const newTotalSpent = computeTotals(newItems);

          return {
            items: newItems,
            lastDeletedItem: null,
            session: state.session
              ? { ...state.session, totalSpent: newTotalSpent }
              : null,
          };
        });
      },

      clearAll: () => {
        set((state) => ({
          items: [],
          lastDeletedItem: null,
          session: state.session
            ? { ...state.session, totalSpent: 0 }
            : null,
        }));
      },

      clearSession: () => {
        set((state) => ({
          session: null,
          previousGroceries: state.items.length > 0 ? [...state.items] : state.previousGroceries,
          items: [],
          lastDeletedItem: null,
          plannedItems: [],
        }));
      },

      addPlannedItem: (name: string) => {
        set((state) => ({
          plannedItems: [
            ...state.plannedItems,
            {
              id: Date.now().toString() + Math.random().toString(36).substring(7),
              name: name.trim(),
              createdAt: new Date().toISOString(),
            }
          ]
        }));
      },

      removePlannedItem: (id: string) => {
        set((state) => ({
          plannedItems: state.plannedItems.filter((i) => i.id !== id)
        }));
      },

      clearPlannedItems: () => {
        set({ plannedItems: [] });
      },

      importPlannedItems: (items: PlannedItem[]) => {
        set((state) => ({
          plannedItems: [...state.plannedItems, ...items]
        }));
      },
    }),
    {
      name: 'budget-cart-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
