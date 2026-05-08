import React, { useState } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_HOLDINGS, MOCK_SECTOR_ALLOC, fmt } from '../mockData';
import { Skeleton, Badge } from '../components';

const SENTIMENT_BADGE = { BULLISH: 'teal', BEARISH: 'rose', NEUTRAL: 'amber' };

function HoldingsTable() {
  const [sortCol, setSortCol] = useState('symbol');
  const [sortDir, setSortDir] = useState('asc');
  const [expanded, setExpanded] = useState(null);
  const [sentimentLoaded, setSentimentLoaded] = useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setSentimentLoaded(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const sorted = [...MOCK_HOLDINGS].sort((a, b) => {
    const aVal = a[sortCol]; const bVal = b[sortCol];
    return sortDir === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const th = (key, label) => (
    <th onClick={() => handleSort(key)} style={{ cursor: 'pointer' }}>
      {label} {sortCol === key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 16 }}>
      <table className="data-table">
        <thead>
          <tr>
            {th('symbol', 'Symbol')}
            {th('company', 'Company')}
            {th('avgBuy', 'Avg Buy')}
            <th>CMP</th>
            {th('qty', 'Qty')}
            <th className="text-right">Invested</th>
            <th className="text-right">Value</th>
            <th className="text-right">P&L ₹</th>
            <th className="text-right">P&L %</th>
            <th>Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(h => {
            const invested = h.avgBuy * h.qty;
            const value = h.cmp * h.qty;
            const pl = value - invested;
            const plPct = (pl / invested) * 100;

            return (
              <React.Fragment key={h.symbol}>
                <tr onClick={() => setExpanded(expanded === h.symbol ? null : h.symbol)}>
                  <td style={{ fontWeight: 700, color: 'var(--copper)' }}>{h.symbol}</td>
                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{h.company}</td>
                  <td>₹{h.avgBuy.toLocaleString('en-IN')}</td>
                  <td style={{ color: h.cmp > h.avgBuy ? 'var(--teal)' : 'var(--rose)' }}>₹{h.cmp.toLocaleString('en-IN')}</td>
                  <td>{h.qty}</td>
                  <td className="text-right">{fmt(invested)}</td>
                  <td className="text-right">{fmt(value)}</td>
                  <td className={`text-right ${pl >= 0 ? 'text-teal' : 'text-rose'}`}>{pl >= 0 ? '+' : ''}{fmt(pl)}</td>
                  <td className={`text-right ${plPct >= 0 ? 'text-teal' : 'text-rose'}`}>{plPct >= 0 ? '+' : ''}{plPct.toFixed(2)}%</td>
                  <td>
                    {sentimentLoaded ? (
                      <Badge type={SENTIMENT_BADGE[h.sentiment]}>{h.sentiment}</Badge>
                    ) : (
                      <Skeleton width={60} height={18} borderRadius={99} />
                    )}
                  </td>
                </tr>
                {expanded === h.symbol && (
                  <tr>
                    <td colSpan={10} style={{ background: 'var(--surface-3)', padding: '16px' }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>7-DAY SPARKLINE</div>
                          <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 50 }}>
                            {[42,50,48,61,55,70,68].map((v, i) => (
                              <div key={i} style={{ flex: 1, height: `${v}%`, background: 'var(--teal)', opacity: 0.7, borderRadius: 2 }} />
                            ))}
                          </div>
                        </div>
                        <div style={{ flex: 2, background: 'rgba(129,140,248,0.06)', borderLeft: '3px solid var(--violet)', padding: '10px 14px', borderRadius: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                          <div style={{ color: 'var(--violet)', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Portfolio Agent Insight</div>
                          {h.symbol === 'INFY' ? 'Infosys has underperformed NIFTY IT by 8% this month. Earnings call in 5 days — watch for guidance revisions.' :
                            `${h.company} shows strong momentum. Current allocation is within recommended bounds for your risk profile.`}
                        </div>
                        <button style={{ background: 'none', border: '0.5px solid var(--border)', borderRadius: 4, padding: '6px 12px', fontSize: 11, color: 'var(--violet)', cursor: 'pointer' }}>
                          Ask Concierge →
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const AREA_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `May ${i + 1}`,
  portfolio: Math.round(800000 + i * 1200 + Math.sin(i * 0.5) * 15000),
  nifty: Math.round(800000 + i * 800 + Math.cos(i * 0.4) * 12000),
}));

export default function Portfolio() {
  const totalValue = MOCK_HOLDINGS.reduce((s, h) => s + h.cmp * h.qty, 0);
  const totalInvested = MOCK_HOLDINGS.reduce((s, h) => s + h.avgBuy * h.qty, 0);
  const totalPL = totalValue - totalInvested;
  const plPct = (totalPL / totalInvested) * 100;
  const [benchmark, setBenchmark] = useState('nifty');
  const [hoveredSector, setHoveredSector] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>Portfolio Value</div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{fmt(totalValue)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>Total P&amp;L</div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 28, fontWeight: 700, color: totalPL >= 0 ? 'var(--teal)' : 'var(--rose)' }}>
              {totalPL >= 0 ? '+' : ''}{fmt(totalPL)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>Return</div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 28, fontWeight: 700, color: plPct >= 0 ? 'var(--teal)' : 'var(--rose)' }}>
              {plPct >= 0 ? '+' : ''}{plPct.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <HoldingsTable />

      {/* Charts row */}
      <div className="grid-12">
        {/* Donut chart */}
        <div className="col-5" style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px' }}>
          <div className="panel-title" style={{ marginBottom: 16 }}>Sector Allocation</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <PieChart width={150} height={150}>
              <Pie data={MOCK_SECTOR_ALLOC} cx={75} cy={75} innerRadius={45} outerRadius={70} dataKey="value" onMouseEnter={(_, i) => setHoveredSector(i)} onMouseLeave={() => setHoveredSector(null)}>
                {MOCK_SECTOR_ALLOC.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={hoveredSector === null || hoveredSector === i ? 1 : 0.5} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ background: 'var(--surface-3)', border: '0.5px solid var(--border)', borderRadius: 8 }} />
            </PieChart>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MOCK_SECTOR_ALLOC.map((s, i) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{s.name}</span>
                  <span style={{ fontFamily: 'var(--font-data)', fontWeight: 600 }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance chart */}
        <div className="col-7" style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px' }}>
          <div className="panel-header">
            <div className="panel-title">Performance</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['nifty','sensex'].map(b => (
                <button key={b} onClick={() => setBenchmark(b)} style={{
                  padding: '3px 10px', borderRadius: 4, border: 'none', fontSize: 11, fontWeight: 600,
                  background: benchmark === b ? 'rgba(200,128,63,0.15)' : 'transparent',
                  color: benchmark === b ? 'var(--copper)' : 'var(--text-muted)', cursor: 'pointer',
                }}>{b.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={AREA_DATA}>
              <defs>
                <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: 'var(--surface-3)', border: '0.5px solid var(--border)', borderRadius: 8 }} formatter={v => [fmt(v)]} />
              <Area type="monotone" dataKey="portfolio" stroke="#2DD4BF" fill="url(#pfGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey={benchmark} stroke="#818CF8" fill="none" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Insights */}
      <div>
        <div className="panel-title" style={{ marginBottom: 12 }}>Agent Insights</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '⚖️', text: 'Your IT sector is overweight at 42%. Based on current market conditions, consider rebalancing 8% into Energy.' },
            { icon: '⚠️', text: 'HDFC Bank (8% of portfolio) has earnings in 3 days — historically volatile ±4%. Consider placing a protective stop.' },
          ].map((ins, i) => (
            <div key={i} className="insight-card">
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>{ins.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>{ins.text}</span>
                <button style={{ background: 'none', border: '0.5px solid var(--border)', borderRadius: 4, padding: '4px 10px', fontSize: 11, color: 'var(--violet)', cursor: 'pointer', flexShrink: 0 }}>
                  Ask Concierge →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
