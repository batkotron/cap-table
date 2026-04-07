'use client';

import { useState, useMemo } from 'react';
import {
  snapshot,
  applyRound,
  toCSV,
  type Holder,
  type HolderType,
  type PricedRound,
} from '@/lib/cap-table';

const fmt = (n: number) => n.toLocaleString('en-AU', { maximumFractionDigits: 0 });
const pct = (n: number) => (n * 100).toFixed(2) + '%';
const money = (n: number) =>
  '$' + n.toLocaleString('en-AU', { maximumFractionDigits: 0 });

export default function Page() {
  const [holders, setHolders] = useState<Holder[]>([
    { id: '1', name: 'Founder 1', type: 'founder', shares: 5_000_000 },
    { id: '2', name: 'Founder 2', type: 'founder', shares: 5_000_000 },
    { id: '3', name: 'Initial option pool', type: 'pool', shares: 1_000_000 },
  ]);

  const [rounds, setRounds] = useState<PricedRound[]>([
    {
      id: 'r1',
      name: 'Seed',
      preMoneyValuation: 8_000_000,
      newInvestment: 2_000_000,
      investorName: 'Seed investors',
      optionPoolTarget: 0.10,
    },
  ]);

  const addHolder = () => {
    setHolders([
      ...holders,
      {
        id: Date.now().toString(),
        name: 'New holder',
        type: 'employee',
        shares: 100_000,
      },
    ]);
  };
  const updateHolder = (id: string, patch: Partial<Holder>) =>
    setHolders(holders.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  const removeHolder = (id: string) =>
    setHolders(holders.filter((h) => h.id !== id));

  const addRound = () => {
    setRounds([
      ...rounds,
      {
        id: 'r' + Date.now(),
        name: `Round ${rounds.length + 1}`,
        preMoneyValuation: 20_000_000,
        newInvestment: 5_000_000,
        investorName: 'Series A lead',
        optionPoolTarget: 0.10,
      },
    ]);
  };
  const updateRound = (id: string, patch: Partial<PricedRound>) =>
    setRounds(rounds.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const removeRound = (id: string) => setRounds(rounds.filter((r) => r.id !== id));

  // Compute final cap table by applying each round in order
  const finalHolders = useMemo(() => {
    let current = [...holders];
    for (const round of rounds) {
      current = applyRound(current, round);
    }
    return current;
  }, [holders, rounds]);

  const initialSnap = useMemo(() => snapshot(holders), [holders]);
  const finalSnap = useMemo(() => snapshot(finalHolders), [finalHolders]);

  const founderInitial = initialSnap.holders
    .filter((h) => h.type === 'founder')
    .reduce((s, h) => s + h.ownership, 0);
  const founderFinal = finalSnap.holders
    .filter((h) => h.type === 'founder')
    .reduce((s, h) => s + h.ownership, 0);

  const downloadCSV = () => {
    const csv = toCSV(finalSnap);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cap-table.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <header>
        <h1>Cap Table</h1>
        <p>
          Free, open-source cap table for early-stage founders. Track founders,
          options, and priced rounds. Export to CSV.
        </p>
      </header>

      <div className="card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Initial holders</h2>
        {holders.map((h) => (
          <div key={h.id} className="row">
            <div>
              <label className="label">Name</label>
              <input
                value={h.name}
                onChange={(e) => updateHolder(h.id, { name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Type</label>
              <select
                value={h.type}
                onChange={(e) =>
                  updateHolder(h.id, { type: e.target.value as HolderType })
                }
              >
                <option value="founder">Founder</option>
                <option value="employee">Employee</option>
                <option value="advisor">Advisor</option>
                <option value="pool">Option pool</option>
                <option value="investor">Investor</option>
              </select>
            </div>
            <div>
              <label className="label">Shares</label>
              <input
                type="number"
                value={h.shares}
                onChange={(e) =>
                  updateHolder(h.id, { shares: Number(e.target.value) })
                }
              />
            </div>
            <button className="danger" onClick={() => removeHolder(h.id)}>
              Remove
            </button>
          </div>
        ))}
        <button onClick={addHolder} style={{ marginTop: 8 }}>
          + Add holder
        </button>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Priced rounds</h2>
        {rounds.map((r) => (
          <div key={r.id} className="round-row">
            <div>
              <label className="label">Round name</label>
              <input
                value={r.name}
                onChange={(e) => updateRound(r.id, { name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Investor</label>
              <input
                value={r.investorName}
                onChange={(e) =>
                  updateRound(r.id, { investorName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Pre-money ($)</label>
              <input
                type="number"
                value={r.preMoneyValuation}
                onChange={(e) =>
                  updateRound(r.id, { preMoneyValuation: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="label">Investment ($)</label>
              <input
                type="number"
                value={r.newInvestment}
                onChange={(e) =>
                  updateRound(r.id, { newInvestment: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="label">Pool target (%)</label>
              <input
                type="number"
                value={r.optionPoolTarget * 100}
                onChange={(e) =>
                  updateRound(r.id, {
                    optionPoolTarget: Number(e.target.value) / 100,
                  })
                }
              />
            </div>
            <button className="danger" onClick={() => removeRound(r.id)}>
              Remove
            </button>
          </div>
        ))}
        <button onClick={addRound} style={{ marginTop: 8 }}>
          + Add round
        </button>
      </div>

      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: '1.1rem' }}>Final cap table</h2>
          <button className="secondary" onClick={downloadCSV}>
            Download CSV
          </button>
        </div>
        <p className="muted" style={{ marginBottom: 12 }}>
          Total shares: <strong>{fmt(finalSnap.totalShares)}</strong>
          {' • '}
          Founder ownership: <strong>{pct(founderInitial)}</strong> →{' '}
          <strong>{pct(founderFinal)}</strong>
          {' • '}
          Founder dilution:{' '}
          <strong>{pct(founderInitial - founderFinal)}</strong>
        </p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Shares</th>
              <th>Ownership</th>
            </tr>
          </thead>
          <tbody>
            {finalSnap.holders.map((h, i) => (
              <tr key={i}>
                <td>{h.name}</td>
                <td>{h.type}</td>
                <td>{fmt(h.shares)}</td>
                <td>{pct(h.ownership)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer>
        Free and open-source. Built by{' '}
        <a href="https://batko.ai" target="_blank" rel="noopener">
          Michael Batko
        </a>
        . More fundraising tools at{' '}
        <a href="https://batko.ai/raise" target="_blank" rel="noopener">
          batko.ai/raise
        </a>
        .{' '}
        <a
          href="https://github.com/batkotron/cap-table"
          target="_blank"
          rel="noopener"
        >
          View source
        </a>
        .
      </footer>
    </div>
  );
}
