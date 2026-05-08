import { create } from 'zustand';

export const useStore = create((set) => ({
  // User
  user: { name: 'Naveen', tier: 'Premium' },

  // Finance state
  netWorth: 4250000,
  portfolioValue: 850000,
  monthlyBudget: 80000,
  monthlySpent: 52400,
  balance: 185000,
  fixedCosts: 49198,
  savingsGoal: 20000,

  // Trading
  selectedSymbol: 'TCS',
  paperMode: true,
  activeTab: 'dashboard',
  orderConfirmPending: null,

  // Connectivity
  connectivity: { bank: 'green', market: 'green', ai: 'amber' },

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedSymbol: (sym) => set({ selectedSymbol: sym }),
  setPaperMode: (mode) => set({ paperMode: mode }),
  setPendingOrder: (order) => set({ orderConfirmPending: order }),
  clearPendingOrder: () => set({ orderConfirmPending: null }),
}));
