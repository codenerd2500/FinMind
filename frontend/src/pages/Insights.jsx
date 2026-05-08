import React, { useState } from 'react';
import { MOCK_GOALS, MOCK_SUBSCRIPTIONS, fmt } from '../mockData';
import { Badge } from '../components';

function SubscriptionSieve() {
  const total = MOCK_SUBSCRIPTIONS.reduce((s, sub) => s + sub.amount, 0);
  const unused = MOCK_SUBSCRIPTIONS.filter(s => s.status === 'Unused').length;

  return (
    <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 16 }}>
      <div className="panel-header">
        <div className="panel-title">🔁 Subscription Sieve</div>
        <Badge type="rose">{unused} Unused</Badge>
      </div>
      <div style={{ background: 'var(--surface-3)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, borderLeft: '3px solid var(--amber)' }}>
        You're spending <strong style={{ color: 'var(--text-primary)' }}>{fmt(total)}/month</strong> on subscriptions.{' '}
        <strong style={{ color: 'var(--rose)' }}>{unused} appear unused</strong> based on app activity.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
        {MOCK_SUBSCRIPTIONS.map(sub => (
          <div key={sub.id} style={{ background: 'var(--surface-3)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 24 }}>{sub.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{sub.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last: {sub.lastCharged}</div>
              </div>
              <Badge type={sub.status === 'Active' ? 'teal' : sub.status === 'Unused' ? 'rose' : 'muted'}>
                {sub.status}
              </Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-data)', fontWeight: 600 }}>{fmt(sub.amount)}<span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></span>
              {sub.status === 'Unused' && (
                <button style={{ background: 'none', border: '0.5px solid var(--rose)', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: 'var(--rose)', cursor: 'pointer' }}>
                  Cancel →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalTracker() {
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', saved: 0 });

  return (
    <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 16 }}>
      <div className="panel-header">
        <div className="panel-title">🎯 Goal Tracker</div>
        <button className="btn btn-copper btn-sm" onClick={() => setShowModal(true)}>+ Add Goal</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {MOCK_GOALS.map(goal => {
          const pct = (goal.saved / goal.target) * 100;
          const remaining = goal.target - goal.saved;
          const etaMonths = Math.ceil(remaining / 20000);
          return (
            <div key={goal.id} className="goal-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontWeight: 600 }}>{goal.name}</div>
                <Badge type={pct > 70 ? 'teal' : pct > 40 ? 'amber' : 'muted'}>{Math.round(pct)}%</Badge>
              </div>
              <div className="progress-track" style={{ marginBottom: 10 }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 70 ? 'var(--teal)' : pct > 40 ? 'var(--amber)' : 'var(--copper)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                <span>Saved: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-data)' }}>{fmt(goal.saved)}</strong></span>
                <span>Target: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-data)' }}>{fmt(goal.target)}</strong></span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--violet)' }}>
                ✦ ETA: ~{etaMonths} months at current savings rate
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add New Goal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <label className="form-label">Goal Name</label>
                <input className="input" style={{ marginTop: 4 }} placeholder="e.g. MacBook Pro" value={newGoal.name} onChange={e => setNewGoal(g => ({ ...g, name: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Target Amount (₹)</label>
                <input className="input" style={{ marginTop: 4 }} type="number" placeholder="150000" value={newGoal.target} onChange={e => setNewGoal(g => ({ ...g, target: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Funding Method</label>
                <select className="form-select" style={{ marginTop: 4 }}>
                  <option value="savings">Savings</option>
                  <option value="trading">Trading Gains</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-copper" onClick={() => setShowModal(false)}>Create Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TradeSuggestions() {
  return (
    <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px' }}>
      <div className="panel-header">
        <div className="panel-title">💡 Trade Suggestions</div>
        <Badge type="violet">AI Generated</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { surplus: 12400, suggestion: 'Allocate ₹4,000 to your existing NIFTY 50 index position — aligns with your Moderate risk profile and long-term goal.', risk: 'LOW' },
          { surplus: 8400, suggestion: 'Consider adding ₹2,500 to HDFC Bank SIP — currently undervalued vs. peers by 12% based on P/E analysis.', risk: 'MED' },
        ].map((s, i) => (
          <div key={i} className="insight-card" style={{ borderLeftColor: 'var(--violet)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Monthly surplus: <strong style={{ fontFamily: 'var(--font-data)', color: 'var(--teal)' }}>{fmt(s.surplus)}</strong></span>
              <Badge type={s.risk === 'LOW' ? 'teal' : 'amber'}>{s.risk} RISK</Badge>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{s.suggestion}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm">View Reasoning</button>
              <button className="btn btn-copper btn-sm">Execute via Broker →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Insights() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <SubscriptionSieve />
      <GoalTracker />
      <TradeSuggestions />
    </div>
  );
}
