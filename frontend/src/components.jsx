import React from 'react';

// ── Live Dot
export function LiveDot({ status = 'green' }) {
  return <span className={`live-dot ${status}`} />;
}

// ── Metric Delta Badge
export function Delta({ value, suffix = '%' }) {
  const positive = value >= 0;
  return (
    <span className={`metric-delta ${positive ? 'positive' : 'negative'}`}>
      {positive ? '▲' : '▼'} {Math.abs(value)}{suffix}
    </span>
  );
}

// ── SVG Circular Gauge
export function CircularGauge({ value, max, color, label }) {
  const pct = Math.min(value / max, 1);
  const r = 36; const cx = 44; const cy = 44;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const colorMap = { green: '#4ADE80', amber: '#FBB343', red: '#FB7185' };
  const stroke = colorMap[color] || '#4ADE80';

  return (
    <div className="gauge-wrap">
      <svg width={88} height={88} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={stroke} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease', filter: `drop-shadow(0 0 6px ${stroke})` }}
        />
      </svg>
      <div style={{ textAlign: 'center', marginTop: -70, marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 15, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Today</div>
      </div>
    </div>
  );
}

// ── Typing Indicator
export function TypingIndicator() {
  return (
    <div className="msg-agent" style={{ marginTop: 4 }}>
      <div className="msg-agent-name">Concierge ✦</div>
      <div className="msg-agent-text">
        <div className="typing-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

// ── Order Confirmation Modal
export function OrderConfirmModal({ order, onConfirm, onCancel }) {
  if (!order) return null;
  const total = order.qty * order.price;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">⚠ Confirm Order</div>
        <div className="modal-body">
          <strong>{order.action} {order.qty} × {order.symbol}</strong> at ₹{order.price.toLocaleString('en-IN')}<br />
          Total: <strong>₹{total.toLocaleString('en-IN')}</strong>
          {order.balancePct && <><br />This will use <strong>{order.balancePct}%</strong> of your available balance.</>}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-copper" onClick={onConfirm}>Confirm & Execute →</button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton Loader
export function Skeleton({ width = '100%', height = 16, borderRadius = 4 }) {
  return <div className="skeleton" style={{ width, height, borderRadius }} />;
}

// ── Badge
export function Badge({ type = 'muted', children }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

// ── Pill Toggle
export function PillToggle({ options, value, onChange }) {
  return (
    <div className="pill-toggle">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`pill-option ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
