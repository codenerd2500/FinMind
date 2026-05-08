import React, { useState, useRef, useEffect } from 'react';
import { LiveDot, TypingIndicator, Badge } from '../components';
import { useStore } from '../store';
import { fmt } from '../mockData';

const INITIAL_MSGS = [
  { id: 1, role: 'agent', text: "Hello! I'm your AI Financial Concierge ✦ powered by Gemini. I can analyze your finances, answer questions about spending, investments, and goals. Add your financial data via **My Data** to get personalized insights. Ask me anything!" },
];

const SLASH_COMMANDS = [
  { cmd: '/balance', desc: 'Check current balance' },
  { cmd: '/spend', desc: 'Monthly spending summary' },
  { cmd: '/invest', desc: 'Portfolio overview' },
  { cmd: '/goal', desc: 'Goal progress' },
  { cmd: '/report', desc: 'Full financial report' },
  { cmd: '/budget', desc: 'Budget analysis' },
];

function ContextPanel({ userTransactions, monthlyBudget, monthlySpent, balance, bankAccounts }) {
  const hasData = userTransactions.length > 0;

  // Category totals
  const categoryTotals = {};
  userTransactions.filter(t => t.amount < 0).forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
  });
  const topCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const spendPct = monthlyBudget > 0 ? Math.min((monthlySpent / monthlyBudget) * 100, 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', padding: '0 0 0 16px', borderLeft: '0.5px solid var(--border)' }}>
      <div className="panel-title" style={{ padding: '4px 0' }}>Your Financial Context</div>

      {!hasData ? (
        <div style={{ background: 'var(--surface-2)', border: '0.5px solid rgba(200,128,63,0.4)', borderRadius: 'var(--radius-md)', padding: 14, fontSize: 12, color: 'var(--amber)' }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>No data yet</div>
          <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Go to <strong>My Data</strong> to add transactions and connect your bank account. The AI Concierge will then give you personalized insights.
          </div>
        </div>
      ) : (
        <>
          {/* Balance snapshot */}
          <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>BALANCE SNAPSHOT</div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 20, fontWeight: 700, color: balance >= 0 ? 'var(--teal)' : 'var(--rose)', marginBottom: 4 }}>
              {fmt(balance)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{userTransactions.length} transactions tracked</div>
          </div>

          {/* Budget */}
          <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>BUDGET USAGE</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span>{fmt(monthlySpent)} spent</span>
              <span style={{ color: 'var(--text-muted)' }}>{fmt(monthlyBudget)} budget</span>
            </div>
            <div className="progress-track" style={{ marginBottom: 6 }}>
              <div className="progress-fill" style={{ width: `${spendPct}%`, background: spendPct > 85 ? 'var(--rose)' : spendPct > 65 ? 'var(--amber)' : 'var(--teal)' }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{Math.round(spendPct)}% used</div>
          </div>

          {/* Top categories */}
          {topCategories.length > 0 && (
            <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>TOP SPENDING</div>
              {topCategories.map(([cat, amt]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span>{cat}</span>
                  <span style={{ fontFamily: 'var(--font-data)', color: 'var(--rose)' }}>{fmt(amt)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Bank accounts */}
      {bankAccounts.length > 0 && (
        <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>CONNECTED BANKS</div>
          {bankAccounts.map(acc => (
            <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>{acc.bankName}</span>
              <span style={{ fontFamily: 'var(--font-data)', color: 'var(--teal)' }}>{fmt(acc.balance)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Concierge() {
  const { userTransactions, monthlyBudget, monthlySpent, balance, netWorth, portfolioValue, bankAccounts, setConnectivity } = useStore();
  const [messages, setMessages] = useState(INITIAL_MSGS);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Mark AI as connected
  useEffect(() => { setConnectivity('ai', 'green'); }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const buildSlashResponse = (cmd) => {
    const hasData = userTransactions.length > 0;
    if (!hasData) return `I don't have your financial data yet. Please go to **My Data** to add your transactions first, then I can give you accurate information.`;

    const income = userTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const spendPct = monthlyBudget > 0 ? Math.round((monthlySpent / monthlyBudget) * 100) : 0;

    switch (cmd) {
      case '/balance': return `✦ **Balance Summary**\n• Net Balance: ${fmt(balance)}\n• Total Income: ${fmt(income)}\n• Total Expenses: ${fmt(monthlySpent)}\n• Transactions tracked: ${userTransactions.length}`;
      case '/spend': return `✦ **Spending Summary**\n• Monthly spend: ${fmt(monthlySpent)} of ${fmt(monthlyBudget)} budget (${spendPct}% used)\n• Remaining budget: ${fmt(Math.max(0, monthlyBudget - monthlySpent))}`;
      case '/invest': return `✦ **Portfolio Overview**\n• Portfolio Value: ${fmt(portfolioValue || 0)}\n• Add investment transactions in My Data to track your portfolio.`;
      default: return null;
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setShowCommands(false);
    setError(null);

    // Handle slash commands locally for speed
    const slashReply = buildSlashResponse(text);
    if (slashReply) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), role: 'agent', text: slashReply }]);
        setTyping(false);
        scrollToBottom();
      }, 600);
      return;
    }

    // Call real Gemini API via backend
    try {
      const context = {
        balance,
        monthlySpent,
        monthlyBudget,
        netWorth,
        portfolioValue,
        transactionCount: userTransactions.length,
        bankAccountCount: bankAccounts.length,
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, context }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now(), role: 'agent', text: data.response, model: data.model }]);
    } catch (err) {
      setError('Failed to reach the AI. Please check your connection.');
      setMessages(prev => [...prev, {
        id: Date.now(), role: 'agent',
        text: `⚠️ I couldn't connect to the AI backend. Error: ${err.message}. Make sure GEMINI_API_KEY is set in Cloud Run environment variables.`,
      }]);
    } finally {
      setTyping(false);
      scrollToBottom();
    }
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
            <Badge type="teal">Gemini Flash</Badge>
            {userTransactions.length > 0 && <Badge type="green">{userTransactions.length} txns</Badge>}
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={msg.role === 'user' ? 'msg-user' : 'msg-agent'}>
              {msg.role === 'agent' && <div className="msg-agent-name">Concierge ✦ {msg.model === 'gemini-1.5-flash' && <span style={{ fontSize: 10, color: 'var(--teal)', marginLeft: 4 }}>Gemini</span>}</div>}
              <div className={msg.role === 'user' ? 'msg-user-text' : 'msg-agent-text'} style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              {msg.role === 'agent' && (
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <button className="btn btn-ghost btn-sm">Copy</button>
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
            {SLASH_COMMANDS
              .filter(c => c.cmd.startsWith(input) || input === '/')
              .map(({ cmd, desc }) => (
                <div
                  key={cmd}
                  onClick={() => { setInput(cmd); setShowCommands(false); }}
                  style={{ padding: '6px 12px', borderRadius: 4, cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontFamily: 'var(--font-data)', fontSize: 12, color: 'var(--teal)', minWidth: 70 }}>{cmd}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</span>
                </div>
              ))}
          </div>
        )}

        {/* Input bar */}
        <div className="chat-input-bar">
          <input
            className="chat-input"
            value={input}
            onChange={handleInputChange}
            placeholder='Ask anything about your finances... or type "/" for commands'
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={typing}
          />
          <button className="btn btn-copper" onClick={sendMessage} style={{ padding: '8px 18px' }} disabled={typing}>
            {typing ? '...' : 'Send'}
          </button>
        </div>
      </div>

      {/* Context Panel (35%) */}
      <div style={{ flex: '0 0 35%', padding: '16px 0 16px 16px', overflowY: 'auto' }}>
        <ContextPanel
          userTransactions={userTransactions}
          monthlyBudget={monthlyBudget}
          monthlySpent={monthlySpent}
          balance={balance}
          bankAccounts={bankAccounts}
        />
      </div>
    </div>
  );
}
