import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { MOCK_TRANSACTIONS, MOCK_FIXED_COSTS, MOCK_SPENDING_DATA, fmt } from '../mockData';
import { useStore } from '../store';
import { LiveDot, Delta, CircularGauge, Badge } from '../components';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const actual = payload.find(p => p.dataKey === 'actual');
  const predicted = payload.find(p => p.dataKey === 'predicted');
  return (
    <div style={{ background: 'var(--surface-3)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>Day {label}</div>
      {actual?.value && <div style={{ color: '#2DD4BF' }}>Actual: {fmt(actual.value)}</div>}
      {predicted?.value && <div style={{ color: '#818CF8' }}>Predicted: {fmt(predicted.value)}</div>}
      {actual?.value && predicted?.value && (
        <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
          Delta: {fmt(Math.abs(actual.value - predicted.value))}
        </div>
      )}
    </div>
  );
};

function SpendingChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={MOCK_SPENDING_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
        <defs>
          <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={3000} stroke="rgba(74,222,128,0.15)" strokeDasharray="0" label={false} />
        <Line type="monotone" dataKey="predicted" stroke="#818CF8" strokeWidth={1.5} strokeDasharray="4 3" dot={false} strokeOpacity={0.7} />
        <Line type="monotone" dataKey="actual" stroke="#2DD4BF" strokeWidth={2} dot={false} connectNulls={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function MetricCards() {
  const { netWorth, portfolioValue, monthlyBudget, monthlySpent, balance, fixedCosts, savingsGoal } = useStore();
  const daysRemaining = 23;
  const safeToSpend = (balance - fixedCosts - savingsGoal) / daysRemaining;
  const gaugeColor = safeToSpend > 500 ? 'green' : safeToSpend > 200 ? 'amber' : 'red';
  const spendPct = (monthlySpent / monthlyBudget) * 100;

  return (
    <div className="grid-12" style={{ marginBottom: 16 }}>
      {/* Net Worth */}
      <div className="metric-card col-3">
        <div className="metric-label">Net Worth</div>
        <div className="metric-value">{fmt(netWorth)}</div>
        <Delta value={2.3} />
        <div style={{ marginTop: 8, display: 'flex', gap: 2 }}>
          {[40,55,45,60,52,68,65].map((h, i) => (
            <div key={i} style={{ flex: 1, height: h * 0.4, background: 'var(--teal)', opacity: 0.6, borderRadius: 2, alignSelf: 'flex-end' }} />
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>7-day sparkline</div>
      </div>

      {/* Safe-to-Spend */}
      <div className="metric-card col-3" style={{ alignItems: 'center' }}>
        <div className="metric-label" style={{ textAlign: 'center' }}>Safe-to-Spend</div>
        <CircularGauge value={safeToSpend} max={2000} color={gaugeColor} label={fmt(Math.max(0, safeToSpend))} />
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>{daysRemaining} days remaining</div>
      </div>

      {/* Monthly Spend */}
      <div className="metric-card col-3">
        <div className="metric-label">Monthly Spend</div>
        <div className="metric-value">{fmt(monthlySpent)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div className="progress-track" style={{ flex: 1 }}>
            <div className="progress-fill" style={{ width: `${spendPct}%`, background: spendPct > 85 ? 'var(--rose)' : spendPct > 65 ? 'var(--amber)' : 'var(--teal)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: 'var(--text-secondary)' }}>{Math.round(spendPct)}%</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Budget: {fmt(monthlyBudget)}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
          <Badge type="teal">Food 28%</Badge>
          <Badge type="amber">Bills 31%</Badge>
          <Badge type="muted">Other 41%</Badge>
        </div>
      </div>

      {/* Portfolio Value */}
      <div className="metric-card col-3">
        <div className="metric-label">Portfolio Value</div>
        <div className="metric-value">{fmt(portfolioValue)}</div>
        <Delta value={1.24} />
        <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
          <Badge type="teal">P&amp;L: +{fmt(24800)}</Badge>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Invested: {fmt(825200)}</div>
      </div>
    </div>
  );
}

function AIBrief() {
  const [loading, setLoading] = useState(false);
  const insights = [
    { icon: '📈', text: 'AWS cloud hosting bill was 12% lower than projected due to unused instance decommissioning.' },
    { icon: '⚠️', text: 'Monthly spend at 65% of budget — on track, but Food & Dining is running 18% above average.' },
    { icon: '💡', text: 'SIP auto-debit of ₹10,000 scheduled for tomorrow. Ensure balance above ₹15,000.' },
  ];

  return (
    <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderLeft: '3px solid var(--violet)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="panel-header" style={{ marginBottom: 0 }}>
        <div className="panel-title">
          <LiveDot status="green" />
          Today's Brief
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setLoading(true)} style={{ gap: 4 }}>↻ Refresh</button>
      </div>
      {insights.map((ins, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>{ins.icon}</span>
          <span>{ins.text}</span>
        </div>
      ))}
    </div>
  );
}

function Transactions() {
  const [hoveredId, setHoveredId] = useState(null);
  return (
    <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px' }}>
      <div className="panel-header">
        <div className="panel-title">Recent Transactions</div>
        <button className="btn btn-ghost btn-sm">View all</button>
      </div>
      {MOCK_TRANSACTIONS.slice(0, 8).map(tx => (
        <div
          key={tx.id}
          className="tx-row"
          onMouseEnter={() => setHoveredId(tx.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="tx-icon">{tx.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="tx-merchant">{tx.merchant}</div>
            <Badge type={tx.type === 'credit' ? 'teal' : 'muted'}>{tx.category}</Badge>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={`tx-amount ${tx.amount > 0 ? 'text-teal' : 'text-rose'}`}>
              {tx.amount > 0 ? '+' : ''}{fmt(tx.amount)}
            </div>
            <div className="tx-date">{tx.date}</div>
          </div>
          {hoveredId === tx.id && (
            <button className="btn btn-ghost btn-sm" style={{ position: 'absolute', right: 0, opacity: 0.9 }}>Edit</button>
          )}
        </div>
      ))}
    </div>
  );
}

function FixedCosts() {
  return (
    <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title">Upcoming Fixed Costs</div>
        <Badge type="rose">3 Due Soon</Badge>
      </div>
      {MOCK_FIXED_COSTS.map(cost => (
        <div key={cost.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            🔒
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{cost.name}</div>
            <div style={{ fontSize: 11, color: cost.daysLeft <= 3 ? 'var(--rose)' : 'var(--text-muted)' }}>
              {cost.daysLeft === 0 ? '⚠ Due Today' : `Due in ${cost.daysLeft} days`}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 13, fontWeight: 600 }}>{fmt(cost.amount)}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <MetricCards />

      {/* Row 2 */}
      <div className="grid-12">
        <div className="col-8" style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px' }}>
          <div className="panel-header">
            <div className="panel-title">Predictive Spending Analysis</div>
            <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 20, height: 2, background: '#2DD4BF', display: 'inline-block' }} /> Actual</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 20, height: 2, background: '#818CF8', display: 'inline-block', borderTop: '2px dashed #818CF8' }} /> Predicted</span>
            </div>
          </div>
          <SpendingChart />
        </div>
        <div className="col-4"><AIBrief /></div>
      </div>

      {/* Row 3 */}
      <div className="grid-12">
        <div className="col-8"><Transactions /></div>
        <div className="col-4"><FixedCosts /></div>
      </div>
    </div>
  );
}
