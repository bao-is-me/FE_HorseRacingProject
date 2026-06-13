export const DEFAULT_BALANCE = 1250000;
export const BET_TYPES = ["Win", "Place", "Show", "Quinella"];

export const bets = [
  {
    id: "bet-1",
    spectatorId: "d8373cfc",
    registrationId: "reg-1",
    betAmount: 200000,
    betType: "Win",
    payoutRatio: 2.8,
    status: "Pending"
  },
  {
    id: "bet-2",
    spectatorId: "d8373cfc",
    registrationId: "reg-3",
    betAmount: 150000,
    betType: "Place",
    payoutRatio: 1.7,
    status: "Won"
  },
  {
    id: "bet-3",
    spectatorId: "d8373cfc",
    registrationId: "reg-4",
    betAmount: 90000,
    betType: "Show",
    payoutRatio: 1.4,
    status: "Pending"
  }
];

export const payments = [
  { id: "pay-1", accountId: "d8373cfc", amount: 500000, status: "Completed", createAt: "2026-06-05T09:30:00" },
  { id: "pay-2", accountId: "d8373cfc", amount: 250000, status: "Pending", createAt: "2026-06-05T12:15:00" }
];
