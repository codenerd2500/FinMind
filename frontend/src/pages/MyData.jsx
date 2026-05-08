import React, { useState } from 'react';
import { useStore, CATEGORY_ICONS_MAP } from '../store';
import { Badge, LiveDot } from '../components';
import { fmt } from '../mockData';

const CATEGORIES = Object.keys(CATEGORY_ICONS_MAP);

const BANKS = [
  { id: 'sbi', name: 'State Bank of India', logo: '🏦', color: '#2563EB' },
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦', color: '#EF4444' },
  { id: 'icici', name: 'ICICI Bank', logo: '🏦', color: '#F97316' },
  { id: 'axis', name: 'Axis Bank', logo: '🏦', color: '#8B5CF6' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏦', color: '#EC4899' },
  { id: 'paytm', name: 'Paytm Payments Bank', logo: '💳', color: '#14B8A6' },
];

function AddTransactionForm({ onClose }) {
  const { addTransaction, monthlyBudget } = useStore();
  const [form, setForm] = useState({
    merchant: '',
    amount: '',
    category: 'Food & Dining',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    note: '',
    type: 'debit',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.merchant || !form.amount) return;
    const amount = parseFloat(form.amount);
    addTransaction({
      merchant: form.merchant,
      amount: form.type === 'debit' ? -Math.abs(amount) : Math.abs(amount),
      category: form.category,
      date: form.date,
      note: form.note,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose?.();
    }, 1200);
  };

  return (
    <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        ＋ Add Transaction
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>This will update your dashboard metrics</span>
      </div>
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--teal)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
          <div style={{ fontSize: 13 }}>Transaction added! Dashboard updated.</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Merchant */}
          <div style={{ gridColumn: '1/-1' }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>MERCHANT / DESCRIPTION</label>
            <input
              className="chat-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              placeholder="e.g. Swiggy, Salary, Amazon..."
              value={form.merchant}
              onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))}
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>AMOUNT (₹)</label>
            <input
              className="chat-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              required
            />
          </div>

          {/* Type */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>TYPE</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['debit', 'credit'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: 'var(--radius-md)',
                    border: `0.5px solid ${form.type === t ? (t === 'debit' ? 'var(--rose)' : 'var(--teal)') : 'var(--border)'}`,
                    background: form.type === t ? (t === 'debit' ? 'rgba(251,113,133,0.1)' : 'rgba(45,212,191,0.1)') : 'var(--surface-3)',
                    color: form.type === t ? (t === 'debit' ? 'var(--rose)' : 'var(--teal)') : 'var(--text-secondary)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  {t === 'debit' ? '↑ Expense' : '↓ Income'}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>CATEGORY</label>
            <select
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--surface-3)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 13,
                outline: 'none',
              }}
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{CATEGORY_ICONS_MAP[c]} {c}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>DATE</label>
            <input
              className="chat-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              placeholder="e.g. May 08"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </div>

          {/* Note */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>NOTE (optional)</label>
            <input
              className="chat-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
              placeholder="Optional note..."
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            />
          </div>

          {/* Submit */}
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            {onClose && <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>}
            <button type="submit" className="btn btn-copper">Add Transaction →</button>
          </div>
        </form>
      )}
    </div>
  );
}

function BankConnectSection() {
  const { bankAccounts, addBankAccount, removeBankAccount, setConnectivity } = useStore();
  const [connecting, setConnecting] = useState(null);
  const [accountNum, setAccountNum] = useState('');
  const [step, setStep] = useState('list'); // 'list' | 'form' | 'success'

  const handleConnect = (bank) => {
    setConnecting(bank);
    setStep('form');
  };

  const handleSubmitConnect = () => {
    setStep('loading');
    setTimeout(() => {
      addBankAccount({
        bankId: connecting.id,
        bankName: connecting.name,
        logo: connecting.logo,
        accountLast4: accountNum.slice(-4) || '****',
        balance: Math.floor(Math.random() * 200000) + 50000,
      });
      setConnectivity('bank', 'green');
      setStep('success');
      setAccountNum('');
      setTimeout(() => setStep('list'), 2000);
    }, 1500);
  };

  return (
    <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>🏦 Connect Bank Account</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Uses Account Aggregator (AA) framework — read-only, RBI regulated. Your credentials are never stored.
        </div>
      </div>

      {/* Connected accounts */}
      {bankAccounts.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>CONNECTED ACCOUNTS</div>
          {bankAccounts.map(acc => (
            <div key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--surface-3)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{acc.logo}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{acc.bankName}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>••••{acc.accountLast4} · Connected {acc.connectedAt}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)', fontFamily: 'var(--font-data)' }}>{fmt(acc.balance)}</div>
                <Badge type="teal">Live</Badge>
              </div>
              <button
                onClick={() => removeBankAccount(acc.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}
                title="Disconnect"
              >×</button>
            </div>
          ))}
        </div>
      )}

      {step === 'list' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {BANKS.map(bank => {
            const connected = bankAccounts.some(a => a.bankId === bank.id);
            return (
              <button
                key={bank.id}
                className="btn btn-ghost"
                disabled={connected}
                onClick={() => handleConnect(bank)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '16px 12px', opacity: connected ? 0.5 : 1,
                  border: `0.5px solid ${connected ? 'var(--teal)' : 'var(--border)'}`,
                }}
              >
                <span style={{ fontSize: 24 }}>{bank.logo}</span>
                <span style={{ fontSize: 11, textAlign: 'center', lineHeight: 1.3 }}>{bank.name}</span>
                {connected && <Badge type="teal">Connected</Badge>}
              </button>
            );
          })}
        </div>
      )}

      {step === 'form' && connecting && (
        <div style={{ padding: 20, background: 'var(--surface-3)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Connect {connecting.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>ACCOUNT NUMBER</div>
          <input
            className="chat-input"
            style={{ width: '100%', boxSizing: 'border-box', marginBottom: 16 }}
            placeholder="Enter your account number"
            value={accountNum}
            onChange={e => setAccountNum(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setStep('list')}>Back</button>
            <button className="btn btn-copper" onClick={handleSubmitConnect} disabled={!accountNum}>
              Authorize via AA Framework →
            </button>
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 24, marginBottom: 8, animation: 'spin 1s linear infinite' }}>⟳</div>
          <div style={{ fontSize: 13 }}>Authorizing connection...</div>
        </div>
      )}

      {step === 'success' && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--teal)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
          <div style={{ fontSize: 13 }}>Bank account connected successfully!</div>
        </div>
      )}
    </div>
  );
}

function FinancialProfileSection() {
  const { monthlyBudget, savingsGoal, setMonthlyBudget, setSavingsGoal, user, setUserName } = useStore();
  const [saved, setSaved] = useState(false);
  const [bgt, setBgt] = useState(monthlyBudget);
  const [sav, setSav] = useState(savingsGoal);
  const [name, setName] = useState(user.name);

  const handleSave = () => {
    setMonthlyBudget(Number(bgt));
    setSavingsGoal(Number(sav));
    setUserName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>⚙️ Financial Profile</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>YOUR NAME</label>
          <input
            className="chat-input"
            style={{ width: '100%', boxSizing: 'border-box' }}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>MONTHLY BUDGET (₹)</label>
          <input
            className="chat-input"
            style={{ width: '100%', boxSizing: 'border-box' }}
            type="number"
            value={bgt}
            onChange={e => setBgt(e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>MONTHLY SAVINGS GOAL (₹)</label>
          <input
            className="chat-input"
            style={{ width: '100%', boxSizing: 'border-box' }}
            type="number"
            value={sav}
            onChange={e => setSav(e.target.value)}
          />
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-copper" onClick={handleSave}>Save Profile →</button>
        {saved && <span style={{ fontSize: 12, color: 'var(--teal)' }}>✓ Saved — dashboard updated</span>}
      </div>
    </div>
  );
}

function TransactionHistorySection() {
  const { userTransactions, removeTransaction, clearTransactions } = useStore();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (userTransactions.length === 0) {
    return (
      <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
        <div style={{ fontSize: 13 }}>No transactions yet. Add your first one above!</div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>📋 Transaction History</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Badge type="teal">{userTransactions.length} entries</Badge>
          {!showConfirmClear ? (
            <button className="btn btn-ghost btn-sm" onClick={() => setShowConfirmClear(true)}>Clear All</button>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowConfirmClear(false)}>Cancel</button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--rose)', borderColor: 'var(--rose)' }} onClick={() => { clearTransactions(); setShowConfirmClear(false); }}>Confirm Clear</button>
            </>
          )}
        </div>
      </div>
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {userTransactions.map(tx => (
          <div key={tx.id} className="tx-row" style={{ position: 'relative' }}>
            <div className="tx-icon">{tx.icon}</div>
            <div style={{ flex: 1 }}>
              <div className="tx-merchant">{tx.merchant}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                <Badge type={tx.type === 'credit' ? 'teal' : 'muted'}>{tx.category}</Badge>
                {tx.note && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{tx.note}</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={`tx-amount ${tx.amount > 0 ? 'text-teal' : 'text-rose'}`}>
                {tx.amount > 0 ? '+' : ''}{fmt(tx.amount)}
              </div>
              <div className="tx-date">{tx.date}</div>
            </div>
            <button
              onClick={() => removeTransaction(tx.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, padding: '0 4px', marginLeft: 8 }}
              title="Delete"
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyData() {
  const { userTransactions, bankAccounts, balance, monthlySpent, monthlyBudget } = useStore();
  const [showForm, setShowForm] = useState(false);

  const totalIncome = userTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = userTransactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Income', value: fmt(totalIncome), color: 'var(--teal)', icon: '↓' },
          { label: 'Total Expenses', value: fmt(totalExpense), color: 'var(--rose)', icon: '↑' },
          { label: 'Net Balance', value: fmt(balance), color: balance >= 0 ? 'var(--teal)' : 'var(--rose)', icon: '=' },
          { label: 'Bank Accounts', value: bankAccounts.length, color: 'var(--violet)', icon: '🏦' },
        ].map(m => (
          <div key={m.label} className="metric-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Financial Profile */}
      <FinancialProfileSection />

      {/* Add Transaction */}
      {showForm ? (
        <AddTransactionForm onClose={() => setShowForm(false)} />
      ) : (
        <button
          className="btn btn-copper"
          onClick={() => setShowForm(true)}
          style={{ alignSelf: 'flex-start', padding: '10px 24px' }}
        >
          ＋ Add Transaction
        </button>
      )}

      {/* Transaction History */}
      <TransactionHistorySection />

      {/* Bank Connect */}
      <BankConnectSection />
    </div>
  );
}
