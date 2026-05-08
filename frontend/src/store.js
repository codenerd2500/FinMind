import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CATEGORY_ICONS = {
  'Food & Dining': '🍔',
  'Shopping': '🛍️',
  'Transport': '🚕',
  'Utilities': '💡',
  'Entertainment': '🎬',
  'Health': '💊',
  'Investment': '📈',
  'Income': '💰',
  'Education': '📚',
  'Travel': '✈️',
  'Other': '📌',
};

export const useStore = create(
  persist(
    (set, get) => ({
      // User Profile
      user: { name: 'Naveen', tier: 'Premium' },
      setUserName: (name) => set((s) => ({ user: { ...s.user, name } })),

      // Financial Profile (user-editable)
      monthlyBudget: 80000,
      savingsGoal: 20000,
      setMonthlyBudget: (v) => set({ monthlyBudget: v }),
      setSavingsGoal: (v) => set({ savingsGoal: v }),

      // Bank accounts connected by user
      bankAccounts: [],
      addBankAccount: (account) =>
        set((s) => ({ bankAccounts: [...s.bankAccounts, { ...account, id: Date.now(), connectedAt: new Date().toLocaleDateString('en-IN') }] })),
      removeBankAccount: (id) =>
        set((s) => ({ bankAccounts: s.bankAccounts.filter((a) => a.id !== id) })),

      // User-entered transactions (persisted)
      userTransactions: [],
      addTransaction: (tx) =>
        set((s) => {
          const newTx = {
            ...tx,
            id: Date.now(),
            icon: CATEGORY_ICONS[tx.category] || '📌',
            type: tx.amount > 0 ? 'credit' : 'debit',
          };
          const userTransactions = [newTx, ...s.userTransactions];
          // Recompute derived stats
          const spent = userTransactions
            .filter((t) => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          const income = userTransactions
            .filter((t) => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
          return {
            userTransactions,
            monthlySpent: spent,
            balance: income - spent,
            netWorth: income - spent + s.portfolioValue,
          };
        }),
      removeTransaction: (id) =>
        set((s) => {
          const userTransactions = s.userTransactions.filter((t) => t.id !== id);
          const spent = userTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
          const income = userTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
          return { userTransactions, monthlySpent: spent, balance: income - spent };
        }),
      clearTransactions: () => set({ userTransactions: [], monthlySpent: 0 }),

      // Derived Finance state (recomputed when transactions change)
      netWorth: 0,
      portfolioValue: 0,
      monthlySpent: 0,
      balance: 0,
      fixedCosts: 49198,
      setPortfolioValue: (v) => set({ portfolioValue: v }),

      // Trading
      selectedSymbol: 'TCS',
      paperMode: true,
      activeTab: 'dashboard',
      orderConfirmPending: null,

      // Connectivity
      connectivity: { bank: 'red', market: 'green', ai: 'green' },
      setConnectivity: (key, status) =>
        set((s) => ({ connectivity: { ...s.connectivity, [key]: status } })),

      // Actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedSymbol: (sym) => set({ selectedSymbol: sym }),
      setPaperMode: (mode) => set({ paperMode: mode }),
      setPendingOrder: (order) => set({ orderConfirmPending: order }),
      clearPendingOrder: () => set({ orderConfirmPending: null }),
    }),
    {
      name: 'finmind-storage', // persists to localStorage
      partialize: (s) => ({
        user: s.user,
        userTransactions: s.userTransactions,
        bankAccounts: s.bankAccounts,
        monthlyBudget: s.monthlyBudget,
        savingsGoal: s.savingsGoal,
        netWorth: s.netWorth,
        portfolioValue: s.portfolioValue,
        monthlySpent: s.monthlySpent,
        balance: s.balance,
        fixedCosts: s.fixedCosts,
        connectivity: s.connectivity,
      }),
    }
  )
);

export const CATEGORY_ICONS_MAP = CATEGORY_ICONS;
