// Simple cap table model.
// Holders own shares. The cap table is a list of holders.
// Adding a priced round creates new holders (investors + option pool top-up).

export type HolderType = 'founder' | 'employee' | 'advisor' | 'investor' | 'pool';

export interface Holder {
  id: string;
  name: string;
  type: HolderType;
  shares: number;
}

export interface PricedRound {
  id: string;
  name: string;
  preMoneyValuation: number;
  newInvestment: number;
  investorName: string;
  optionPoolTarget: number; // 0-1, post-money pool size
}

export interface CapTableSnapshot {
  holders: (Holder & { ownership: number })[];
  totalShares: number;
}

export function snapshot(holders: Holder[]): CapTableSnapshot {
  const total = holders.reduce((s, h) => s + h.shares, 0);
  return {
    holders: holders.map((h) => ({ ...h, ownership: total ? h.shares / total : 0 })),
    totalShares: total,
  };
}

/**
 * Apply a priced round to a list of holders. Returns the new list of holders.
 * Uses post-money option pool sizing (the pool is `optionPoolTarget` of the
 * post-round cap table; new investor isn't diluted by the pool top-up).
 */
export function applyRound(holders: Holder[], round: PricedRound): Holder[] {
  const sharesBefore = holders.reduce((s, h) => s + h.shares, 0);
  const pricePerShare = round.preMoneyValuation / sharesBefore;
  const newInvestorShares = round.newInvestment / pricePerShare;

  // Pool top-up math: pool / (sharesBefore + newInvestor + pool) = poolTarget
  const totalNonPool = sharesBefore + newInvestorShares;
  const poolShares =
    round.optionPoolTarget > 0
      ? (totalNonPool * round.optionPoolTarget) / (1 - round.optionPoolTarget)
      : 0;

  return [
    ...holders,
    {
      id: `${round.id}-investor`,
      name: round.investorName,
      type: 'investor',
      shares: newInvestorShares,
    },
    {
      id: `${round.id}-pool`,
      name: `${round.name} option pool`,
      type: 'pool',
      shares: poolShares,
    },
  ];
}

export function toCSV(snap: CapTableSnapshot): string {
  const header = 'Name,Type,Shares,Ownership';
  const rows = snap.holders.map(
    (h) => `${h.name},${h.type},${h.shares.toFixed(0)},${(h.ownership * 100).toFixed(2)}%`
  );
  return [header, ...rows].join('\n');
}
