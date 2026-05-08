import React, { useState, useEffect, useRef } from 'react';
import { MOCK_WATCHLIST, fmt } from '../mockData';
import { useStore } from '../store';
import { PillToggle, OrderConfirmModal, Badge } from '../components';

function Watchlist({ selected, onSelect }) {
  const [search, setSearch] = useState('');
  const filtered = MOCK_WATCHLIST.filter(w =>
    w.symbol.includes(search.toUpperCase()) || w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px', borderBottom: '0.5px solid var(--border)' }}>
        <input className="input" placeholder="Search symbol..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map(w => (
          <div key={w.symbol} className={`watch-row ${selected === w.symbol ? 'active' : ''}`} onClick={() => onSelect(w.symbol)}>
            <div style={{ flex: 1 }}>
              <div className="watch-symbol">{w.symbol}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{w.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="watch-price" style={{ color: w.change >= 0 ? 'var(--teal)' : 'var(--rose)' }}>
                ₹{w.price.toLocaleString('en-IN')}
              </div>
              <Badge type={w.change >= 0 ? 'teal' : 'rose'}>
                {w.change >= 0 ? '▲' : '▼'} {Math.abs(w.change)}%
              </Badge>
            </div>
          </div>
        ))}
      </div>
      {/* Broker mini-chat */}
      <div style={{ padding: 12, borderTop: '0.5px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>BROKER AGENT</div>
        <input className="input" placeholder='e.g. "Buy 10 TCS if < ₹3800"' style={{ marginBottom: 8 }} />
        <button className="btn btn-copper" style={{ width: '100%' }}>Place Order</button>
      </div>
    </div>
  );
}

function TradingChart({ symbol, paperMode }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const seriesRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lightweight-charts@4.1.1/dist/lightweight-charts.standalone.production.js';
    script.async = true;

    script.onload = () => {
      if (chartInstance.current) chartInstance.current.remove();

      const chart = window.LightweightCharts.createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 360,
        layout: { background: { color: 'transparent' }, textColor: '#9CA3AF' },
        grid: { vertLines: { color: 'rgba(255,255,255,0.05)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
        crosshair: { mode: 1 },
        rightPriceScale: { borderColor: 'rgba(255,255,255,0.08)' },
        timeScale: { borderColor: 'rgba(255,255,255,0.08)', timeVisible: true },
      });

      const series = chart.addCandlestickSeries({
        upColor: '#2DD4BF', downColor: '#FB7185',
        borderUpColor: '#2DD4BF', borderDownColor: '#FB7185',
        wickUpColor: '#2DD4BF', wickDownColor: '#FB7185',
      });

      // Generate synthetic candlestick data
      const now = Math.floor(Date.now() / 1000);
      const data = Array.from({ length: 60 }, (_, i) => {
        const t = now - (59 - i) * 3600;
        const base = 3800 + Math.sin(i * 0.3) * 200 + Math.random() * 100;
        const open = base + Math.random() * 40 - 20;
        const close = base + Math.random() * 40 - 20;
        return {
          time: t,
          open: Math.round(open),
          high: Math.round(Math.max(open, close) + Math.random() * 30),
          low:  Math.round(Math.min(open, close) - Math.random() * 30),
          close: Math.round(close),
        };
      });

      series.setData(data);
      chartInstance.current = chart;
      seriesRef.current = series;
    };

    document.head.appendChild(script);
    return () => { if (chartInstance.current) { chartInstance.current.remove(); chartInstance.current = null; } };
  }, [symbol]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={chartRef} style={{ width: '100%', height: 360 }} />
      {paperMode && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: 60, fontWeight: 900, color: 'rgba(255,255,255,0.04)', letterSpacing: 8, textTransform: 'uppercase' }}>SIMULATED</span>
        </div>
      )}
    </div>
  );
}

function OrderPanel({ symbol }) {
  const [tab, setTab] = useState('place');
  const [orderType, setOrderType] = useState('Limit');
  const [qty, setQty] = useState(10);
  const [price, setPrice] = useState(3912);
  const [stopLoss, setStopLoss] = useState('');
  const { setPendingOrder, orderConfirmPending, clearPendingOrder } = useStore();
  const [orders, setOrders] = useState([]);

  const submitOrder = () => {
    setPendingOrder({
      symbol, action: 'BUY', qty, price,
      total: qty * price,
      balancePct: Math.round((qty * price / 185000) * 100),
    });
  };

  const confirmOrder = () => {
    setOrders(prev => [...prev, { symbol, qty, price, status: 'Filled', action: 'BUY' }]);
    clearPendingOrder();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)' }}>
        {['place', 'active'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '10px', background: 'none', border: 'none', fontSize: 12, fontWeight: 600,
            color: tab === t ? 'var(--copper)' : 'var(--text-muted)',
            borderBottom: tab === t ? '2px solid var(--copper)' : '2px solid transparent',
            transition: 'all var(--transition)',
          }}>
            {t === 'place' ? 'Place Order' : `Active (${orders.length})`}
          </button>
        ))}
      </div>

      <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
        {tab === 'place' ? (
          <div className="order-form">
            <div className="form-group">
              <label className="form-label">Symbol</label>
              <input className="input" value={symbol} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Order Type</label>
              <select className="form-select" value={orderType} onChange={e => setOrderType(e.target.value)}>
                <option>Market</option><option>Limit</option><option>Bracket</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input className="input" type="number" value={qty} onChange={e => setQty(+e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input className="input" type="number" value={price} onChange={e => setPrice(+e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Stop Loss (₹)</label>
              <input className="input" type="number" value={stopLoss} onChange={e => setStopLoss(e.target.value)} placeholder="Optional" />
            </div>
            <div style={{ background: 'var(--surface-3)', borderRadius: 6, padding: '10px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>
              Estimated total: <strong style={{ fontFamily: 'var(--font-data)', color: 'var(--text-primary)' }}>{fmt(qty * price)}</strong>
            </div>
            <button className="btn btn-copper" style={{ width: '100%', justifyContent: 'center' }} onClick={submitOrder}>
              Buy {symbol}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {orders.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 20 }}>No active orders</div>}
            {orders.map((o, i) => (
              <div key={i} style={{ background: 'var(--surface-3)', borderRadius: 6, padding: '10px 12px', fontSize: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{o.action} {o.qty}x {o.symbol}</div>
                  <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-data)' }}>₹{o.price}</div>
                </div>
                <Badge type="teal">{o.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <OrderConfirmModal order={orderConfirmPending} onConfirm={confirmOrder} onCancel={clearPendingOrder} />
    </div>
  );
}

export default function TradingArena() {
  const { selectedSymbol, setSelectedSymbol, paperMode, setPaperMode } = useStore();
  const [chartType, setChartType] = useState('candlestick');
  const [timeframe, setTimeframe] = useState('1D');

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: 12 }}>
      {/* Left: Watchlist (280px) */}
      <div style={{ width: 280, flexShrink: 0, background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)' }}>
          <div className="panel-title">Watchlist</div>
        </div>
        <Watchlist selected={selectedSymbol} onSelect={setSelectedSymbol} />
      </div>

      {/* Center: Chart (fluid) */}
      <div style={{ flex: 1, background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Chart toolbar */}
        <div style={{ padding: '10px 16px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 16, color: 'var(--copper)' }}>{selectedSymbol}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['1D','1W','1M','3M','1Y'].map(tf => (
              <button key={tf} onClick={() => setTimeframe(tf)} style={{
                padding: '4px 8px', borderRadius: 4, border: 'none', fontSize: 11, fontWeight: 600,
                background: timeframe === tf ? 'rgba(200,128,63,0.15)' : 'transparent',
                color: timeframe === tf ? 'var(--copper)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}>{tf}</button>
            ))}
          </div>
          <PillToggle
            options={[{ label: 'Candle', value: 'candlestick' }, { label: 'Line', value: 'line' }]}
            value={chartType}
            onChange={setChartType}
          />
          <div style={{ marginLeft: 'auto' }}>
            <PillToggle
              options={[{ label: '🧪 Paper', value: true }, { label: '🔴 Real', value: false }]}
              value={paperMode}
              onChange={v => setPaperMode(v === true || v === 'true')}
            />
          </div>
        </div>
        <TradingChart symbol={selectedSymbol} paperMode={paperMode} />
        <div style={{ padding: '8px 16px', display: 'flex', gap: 8, borderTop: '0.5px solid var(--border)' }}>
          {['MA20','MA50','RSI','VWAP'].map(ind => (
            <Badge key={ind} type="muted">{ind}</Badge>
          ))}
        </div>
      </div>

      {/* Right: Order Panel (320px) */}
      <div style={{ width: 320, flexShrink: 0, background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <OrderPanel symbol={selectedSymbol} />
      </div>
    </div>
  );
}
