import React, { useState, useRef } from 'react';
import { LiveDot, TypingIndicator, Badge } from '../components';

const INITIAL_MSGS = [
  { id: 1, role: 'agent', text: 'Hello! I\'m your AI Financial Concierge ✦. I\'ve analyzed your last 30 days of transactions. Ask me anything about your finances.' },
];

const SLASH_COMMANDS = ['/spend', '/balance', '/invest', '/goal', '/report'];

function ContextPanel({ lastTx }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', padding: '0 0 0 16px', borderLeft: '0.5px solid var(--border)' }}>
      <div className="panel-title" style={{ padding: '4px 0' }}>Contextual Data</div>

      {lastTx && (
        <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>PARSED TRANSACTION</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>{lastTx.icon}</span>
            <div>
              <div style={{ fontWeight: 600 }}>{lastTx.merchant}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{lastTx.category}</div>
            </div>
            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-data)', fontWeight: 600, color: 'var(--rose)' }}>
              -{lastTx.amount}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-copper btn-sm">Add to log</button>
            <button className="btn btn-ghost btn-sm">Wrong category?</button>
          </div>
        </div>
      )}

      {/* Anomaly Alert */}
      <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderLeft: '3px solid var(--rose)', borderRadius: 'var(--radius-md)', padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <Badge type="rose">HIGH</Badge>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Unusual transaction: ₹12,000 at unknown merchant on May 06. Was this you?
        </div>
      </div>

      {/* Budget Impact */}
      <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>BUDGET IMPACT</div>
        {[{ label: 'Food & Dining', pct: 68, color: 'var(--amber)' }, { label: 'Shopping', pct: 42, color: 'var(--teal)' }, { label: 'Transport', pct: 24, color: 'var(--violet)' }].map(b => (
          <div key={b.label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
              <span>{b.label}</span><span style={{ fontFamily: 'var(--font-data)' }}>{b.pct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${b.pct}%`, background: b.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Concierge() {
  const [messages, setMessages] = useState(INITIAL_MSGS);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [lastTx, setLastTx] = useState(null);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setShowCommands(false);

    // Simulate agent response
    setTimeout(() => {
      let reply = 'I\'ve received your message. Let me analyze your financial data...';

      if (text.toLowerCase().includes('spent') || text.toLowerCase().includes('₹')) {
        const match = text.match(/₹(\d+[\d,]*)/);
        const amount = match ? match[1] : '500';
        reply = `✦ Got it. I've logged ₹${amount} under "Food & Dining → Restaurants" for today. Your dining budget is now 68% used this month.`;
        setLastTx({ merchant: 'Restaurant', icon: '🍽️', category: 'Food & Dining', amount });
      } else if (text === '/balance') {
        reply = '✦ Current balance: ₹1,85,000. After upcoming fixed costs (₹49,198), your free balance is ₹1,35,802.';
      } else if (text === '/spend') {
        reply = '✦ Monthly spend so far: ₹52,400 out of ₹80,000 budget (65.5%). Top categories: Bills (31%), Food (28%), Shopping (18%).';
      } else if (text === '/invest') {
        reply = '✦ Portfolio value: ₹8,50,000 | Today\'s P&L: +₹10,250 (+1.24%). Best performer: RELIANCE +18.0%.';
      }

      setMessages(prev => [...prev, { id: Date.now(), role: 'agent', text: reply }]);
      setTyping(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setShowCommands(e.target.value.startsWith('/'));
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: 0 }}>
      {/* Chat Panel (65%) */}
      <div style={{ flex: '0 0 65%', display: 'flex', flexDirection: 'column', background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <LiveDot status="green" />
          <span style={{ fontWeight: 600, fontSize: 14 }}>AI Financial Concierge</span>
          <span style={{ color: 'var(--violet)', fontSize: 12 }}>✦</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Badge type="violet">LangChain</Badge>
            <Badge type="teal">GPT-4o</Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={msg.role === 'user' ? 'msg-user' : 'msg-agent'}>
              {msg.role === 'agent' && <div className="msg-agent-name">Concierge ✦</div>}
              <div className={msg.role === 'user' ? 'msg-user-text' : 'msg-agent-text'}>{msg.text}</div>
              {msg.role === 'agent' && (
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <button className="btn btn-ghost btn-sm">Add to log</button>
                  <button className="btn btn-ghost btn-sm">Ask follow-up</button>
                </div>
              )}
            </div>
          ))}
          {typing && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Slash command palette */}
        {showCommands && (
          <div style={{ margin: '0 16px', background: 'var(--surface-3)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 8 }}>
            {SLASH_COMMANDS.map(cmd => (
              <div key={cmd} onClick={() => { setInput(cmd); setShowCommands(false); }}
                style={{ padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-data)', fontSize: 12, color: 'var(--teal)' }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >{cmd}</div>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="chat-input-bar">
          <input
            className="chat-input"
            value={input}
            onChange={handleInputChange}
            placeholder='Ask anything... or type "/" for commands'
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button className="icon-btn" title="Attach receipt">📎</button>
          <button className="icon-btn" title="Voice input">🎤</button>
          <button className="btn btn-copper" onClick={sendMessage} style={{ padding: '8px 18px' }}>Send</button>
        </div>
      </div>

      {/* Context Panel (35%) */}
      <div style={{ flex: '0 0 35%', padding: '16px 0 16px 16px', overflow: 'y-auto' }}>
        <ContextPanel lastTx={lastTx} />
      </div>
    </div>
  );
}
