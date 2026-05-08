import React from 'react';
import { BrowserRouter, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStore } from './store';
import { LiveDot } from './components';
import Dashboard from './pages/Dashboard';
import Concierge from './pages/Concierge';
import TradingArena from './pages/TradingArena';
import Portfolio from './pages/Portfolio';
import Insights from './pages/Insights';

const qc = new QueryClient();

const NAV_ITEMS = [
  { path: '/', label: 'Command Center', icon: '⌖', exact: true },
  { path: '/concierge', label: 'AI Concierge', icon: '✦' },
  { path: '/trading', label: 'Trading Arena', icon: '◈' },
  { path: '/portfolio', label: 'Portfolio', icon: '◬' },
  { path: '/insights', label: 'Smart Insights', icon: '◉' },
];

function Sidebar() {
  const { user, connectivity } = useStore();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">FM</div>
        <div>
          <div className="sidebar-logo-text">FinMind</div>
          <div className="sidebar-logo-sub">Precision Terminal</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="icon" style={{ fontFamily: 'monospace', fontSize: 18 }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 20px', borderTop: '0.5px solid var(--border)', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--copper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000' }}>
            {user.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 10, color: 'var(--copper)' }}>{user.tier}</div>
          </div>
        </div>
        <div className="sidebar-section-label" style={{ padding: '0 0 6px' }}>Connectivity</div>
        {[
          { label: 'Bank', status: connectivity.bank },
          { label: 'Market', status: connectivity.market },
          { label: 'AI Agent', status: connectivity.ai },
        ].map(c => (
          <div key={c.label} className="connectivity-item">
            <LiveDot status={c.status} />
            <span>{c.label}</span>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: c.status === 'green' ? 'var(--green)' : c.status === 'amber' ? 'var(--amber)' : 'var(--rose)' }}>
              {c.status === 'green' ? 'Live' : c.status === 'amber' ? 'Degraded' : 'Down'}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

const PAGE_TITLES = {
  '/': 'Command Center',
  '/concierge': 'AI Financial Concierge',
  '/trading': 'Trading Arena',
  '/portfolio': 'Portfolio Watch',
  '/insights': 'Smart Insights',
};

function Topbar({ path }) {
  const now = new Date();
  return (
    <div className="topbar">
      <div className="topbar-title">{PAGE_TITLES[path] || 'FinMind'}</div>
      <div className="topbar-right">
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 12, color: 'var(--text-muted)' }}>
          {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 12, color: 'var(--text-secondary)' }}>
          {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
          <LiveDot status="green" /> NSE Live
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <div className="app-shell">
          <Sidebar />
          <div className="main-area">
            <Routes>
              <Route path="/" element={<><Topbar path="/" /><div className="page-content"><Dashboard /></div></>} />
              <Route path="/concierge" element={<><Topbar path="/concierge" /><div className="page-content" style={{ overflow: 'hidden' }}><Concierge /></div></>} />
              <Route path="/trading" element={<><Topbar path="/trading" /><div className="page-content" style={{ overflow: 'hidden', padding: '12px' }}><TradingArena /></div></>} />
              <Route path="/portfolio" element={<><Topbar path="/portfolio" /><div className="page-content"><Portfolio /></div></>} />
              <Route path="/insights" element={<><Topbar path="/insights" /><div className="page-content"><Insights /></div></>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
