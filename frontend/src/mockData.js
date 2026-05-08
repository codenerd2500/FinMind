// Mock data — replace with real API calls in Phase 2

export const MOCK_TRANSACTIONS = [
  { id: 1, merchant: 'Swiggy', icon: '🍔', category: 'Food & Dining', amount: -680, date: 'May 08', type: 'debit' },
  { id: 2, merchant: 'HDFC Dividends', icon: '💰', category: 'Investment', amount: 1200, date: 'May 07', type: 'credit' },
  { id: 3, merchant: 'Zomato', icon: '🍕', category: 'Food & Dining', amount: -420, date: 'May 07', type: 'debit' },
  { id: 4, merchant: 'Amazon', icon: '📦', category: 'Shopping', amount: -2340, date: 'May 06', type: 'debit' },
  { id: 5, merchant: 'Salary Credit', icon: '🏦', category: 'Income', amount: 95000, date: 'May 05', type: 'credit' },
  { id: 6, merchant: 'Jio Postpaid', icon: '📱', category: 'Utilities', amount: -1499, date: 'May 05', type: 'debit' },
  { id: 7, merchant: 'Netflix', icon: '🎬', category: 'Entertainment', amount: -649, date: 'May 04', type: 'debit' },
  { id: 8, merchant: 'Ola Cab', icon: '🚕', category: 'Transport', amount: -340, date: 'May 04', type: 'debit' },
  { id: 9, merchant: 'Apollo Pharmacy', icon: '💊', category: 'Health', amount: -890, date: 'May 03', type: 'debit' },
  { id: 10, merchant: 'SIP - HDFC Flexi', icon: '📈', category: 'Investment', amount: -10000, date: 'May 01', type: 'debit' },
];

export const MOCK_FIXED_COSTS = [
  { id: 1, name: 'House Rent', amount: 25000, dueDate: 'May 10', daysLeft: 2 },
  { id: 2, name: 'LIC Premium', amount: 8500, dueDate: 'May 15', daysLeft: 7 },
  { id: 3, name: 'EMI - Car Loan', amount: 12400, dueDate: 'May 08', daysLeft: 0 },
  { id: 4, name: 'Electricity', amount: 1800, dueDate: 'May 20', daysLeft: 12 },
  { id: 5, name: 'Internet (Airtel)', amount: 999, dueDate: 'May 22', daysLeft: 14 },
];

export const MOCK_SPENDING_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  actual: i < 8 ? Math.round(2000 + Math.random() * 3000) : null,
  predicted: Math.round(2500 + Math.sin(i * 0.4) * 1200 + Math.random() * 400),
}));

export const MOCK_HOLDINGS = [
  { symbol: 'RELIANCE', company: 'Reliance Industries', avgBuy: 2410, cmp: 2845, qty: 50, sentiment: 'BULLISH' },
  { symbol: 'TCS', company: 'Tata Consultancy Services', avgBuy: 3650, cmp: 3912, qty: 20, sentiment: 'NEUTRAL' },
  { symbol: 'HDFC BANK', company: 'HDFC Bank Ltd', avgBuy: 1480, cmp: 1522, qty: 100, sentiment: 'BULLISH' },
  { symbol: 'INFY', company: 'Infosys Ltd', avgBuy: 1520, cmp: 1390, qty: 75, sentiment: 'BEARISH' },
  { symbol: 'WIPRO', company: 'Wipro Ltd', avgBuy: 440, cmp: 468, qty: 200, sentiment: 'NEUTRAL' },
];

export const MOCK_SECTOR_ALLOC = [
  { name: 'Technology', value: 42, color: '#818CF8' },
  { name: 'Banking', value: 28, color: '#2DD4BF' },
  { name: 'Energy', value: 18, color: '#C8803F' },
  { name: 'Healthcare', value: 8, color: '#4ADE80' },
  { name: 'Others', value: 4, color: '#9CA3AF' },
];

export const MOCK_WATCHLIST = [
  { symbol: 'TCS', name: 'Tata Consult.', price: 3912.45, change: 1.24 },
  { symbol: 'RELIANCE', name: 'Reliance Ind.', price: 2845.10, change: 0.87 },
  { symbol: 'NIFTY 50', name: 'NIFTY 50 Index', price: 22456.80, change: -0.34 },
  { symbol: 'HDFC BANK', name: 'HDFC Bank', price: 1522.30, change: 0.45 },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1390.60, change: -1.12 },
  { symbol: 'WIPRO', name: 'Wipro Ltd', price: 468.20, change: 2.10 },
];

export const MOCK_GOALS = [
  { id: 1, name: 'MacBook Pro M3', target: 150000, saved: 62000, fundingMethod: 'savings' },
  { id: 2, name: 'Goa Trip', target: 50000, saved: 22000, fundingMethod: 'both' },
  { id: 3, name: 'Emergency Fund', target: 300000, saved: 180000, fundingMethod: 'savings' },
];

export const MOCK_SUBSCRIPTIONS = [
  { id: 1, name: 'Netflix', icon: '🎬', amount: 649, frequency: 'Monthly', lastCharged: 'Apr 08', status: 'Active' },
  { id: 2, name: 'Spotify', icon: '🎵', amount: 119, frequency: 'Monthly', lastCharged: 'Apr 12', status: 'Unused' },
  { id: 3, name: 'Adobe CC', icon: '🎨', amount: 2200, frequency: 'Monthly', lastCharged: 'Apr 01', status: 'Active' },
  { id: 4, name: 'Hotstar', icon: '⭐', amount: 299, frequency: 'Monthly', lastCharged: 'Mar 15', status: 'Unused' },
  { id: 5, name: 'GitHub Pro', icon: '🐙', amount: 750, frequency: 'Monthly', lastCharged: 'Apr 28', status: 'Active' },
];

export const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n);
export const fmtNum = (n) => new Intl.NumberFormat('en-IN').format(n);
