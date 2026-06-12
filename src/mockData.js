export const roles = {
  Admin: "Admin",
  Spectator: "Spectator",
  HorseOwner: "Horse Owner",
  Jockey: "Jockey",
  Referee: "Referee"
};

export const demoAccounts = [
  {
    id: "49497b99",
    email: "philong68687879@gmail.com",
    role: "Admin",
    status: "Active",
    fullName: "Nguyen Hoang Phi Long",
    phone: "0901001001",
    balance: 5600000
  },
  {
    id: "d8373cfc",
    email: "baon7311@gmail.com",
    role: "Spectator",
    status: "Active",
    fullName: "Nguyen Gia Bao",
    phone: "0902002002",
    balance: 1250000
  },
  {
    id: "e3ad08be",
    email: "owner@stalliongate.ai",
    role: "HorseOwner",
    status: "Pending",
    fullName: "Phan Thong",
    phone: "0903003003",
    balance: 4200000
  },
  {
    id: "039126e4",
    email: "jockey@gmail.com",
    role: "Jockey",
    status: "Active",
    fullName: "Nguyen Hoang Philong",
    phone: "0904004004",
    balance: 780000,
    experienceYears: 5,
    jockeyRating: 4.72
  },
  {
    id: "b9c1",
    email: "referee@stalliongate.ai",
    role: "Referee",
    status: "Active",
    fullName: "Track Referee",
    phone: "0905005005",
    balance: 0
  }
];

export const racecourses = [
  { id: "rc-1", racecourseName: "Churchill Downs", location: "Louisville, Kentucky", trackType: "Dirt" },
  { id: "rc-2", racecourseName: "Saigon Turf Club", location: "Ho Chi Minh City", trackType: "Turf" },
  { id: "rc-3", racecourseName: "Emerald Track", location: "Da Nang", trackType: "Synthetic" }
];

export const tournaments = [
  {
    id: "t-1",
    tournamentName: "Spring Derby Series",
    description: "Primary season tournament for approved horses.",
    startDate: "2026-06-12",
    endDate: "2026-06-28",
    status: "Scheduled"
  },
  {
    id: "t-2",
    tournamentName: "StallionGate Invitational",
    description: "High-profile invitational race day.",
    startDate: "2026-07-05",
    endDate: "2026-07-06",
    status: "BettingOpen"
  }
];

export const horses = [
  {
    id: "h-1",
    ownerId: "e3ad08be",
    horseName: "Silver Comet",
    age: 4,
    breed: "Thoroughbred",
    weight: 482,
    color: "Gray",
    status: "Healthy",
    recordWins: 7
  },
  {
    id: "h-2",
    ownerId: "e3ad08be",
    horseName: "Crimson Bolt",
    age: 5,
    breed: "Arabian",
    weight: 468,
    color: "Chestnut",
    status: "Resting",
    recordWins: 4
  },
  {
    id: "h-3",
    ownerId: "49497b99",
    horseName: "Night Ledger",
    age: 3,
    breed: "Thoroughbred",
    weight: 455,
    color: "Black",
    status: "Healthy",
    recordWins: 3
  },
  {
    id: "h-4",
    ownerId: "49497b99",
    horseName: "Aurora Lane",
    age: 4,
    breed: "Quarter Horse",
    weight: 474,
    color: "Bay",
    status: "Healthy",
    recordWins: 6
  }
];

export const races = [
  {
    id: "race-1",
    tournamentId: "t-1",
    racecourseId: "rc-1",
    raceNumber: 5,
    startTime: "2026-06-12T15:30:00",
    trackLength: 2000,
    maxParticipants: 10,
    status: "BettingOpen"
  },
  {
    id: "race-2",
    tournamentId: "t-1",
    racecourseId: "rc-2",
    raceNumber: 6,
    startTime: "2026-06-13T16:10:00",
    trackLength: 1600,
    maxParticipants: 8,
    status: "Scheduled"
  },
  {
    id: "race-3",
    tournamentId: "t-2",
    racecourseId: "rc-3",
    raceNumber: 1,
    startTime: "2026-07-05T14:00:00",
    trackLength: 1800,
    maxParticipants: 12,
    status: "Live"
  },
  {
    id: "race-4",
    tournamentId: "t-2",
    racecourseId: "rc-1",
    raceNumber: 2,
    startTime: "2026-07-05T17:15:00",
    trackLength: 2200,
    maxParticipants: 12,
    status: "ResultPending"
  }
];

export const registrations = [
  {
    id: "reg-1",
    raceId: "race-1",
    horseId: "h-1",
    jockeyId: "039126e4",
    gateNumber: 2,
    ownerConfirmation: true,
    jockeyConfirmation: true,
    status: "Confirmed",
    odds: 2.8
  },
  {
    id: "reg-2",
    raceId: "race-1",
    horseId: "h-3",
    jockeyId: "039126e4",
    gateNumber: 5,
    ownerConfirmation: true,
    jockeyConfirmation: false,
    status: "InvitationPending",
    odds: 3.4
  },
  {
    id: "reg-3",
    raceId: "race-3",
    horseId: "h-4",
    jockeyId: "039126e4",
    gateNumber: 1,
    ownerConfirmation: true,
    jockeyConfirmation: true,
    status: "Racing",
    odds: 2.2
  },
  {
    id: "reg-4",
    raceId: "race-4",
    horseId: "h-2",
    jockeyId: "039126e4",
    gateNumber: 4,
    ownerConfirmation: true,
    jockeyConfirmation: true,
    status: "ResultPending",
    odds: 4.1
  }
];

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

export const raceResults = [
  { id: "result-1", registrationId: "reg-3", finishPosition: 1, finishTime: 121450, isDisqualified: false },
  { id: "result-2", registrationId: "reg-4", finishPosition: 2, finishTime: 132880, isDisqualified: false }
];

export const reports = [
  {
    id: "report-1",
    raceId: "race-4",
    refereeId: "b9c1",
    incidentDescription: "Gate delay review for lane 4 before official confirmation.",
    penaltyApplied: "Under review",
    createdAt: "2026-06-05T14:20:00"
  },
  {
    id: "report-2",
    raceId: "race-3",
    refereeId: "b9c1",
    incidentDescription: "Clean race. No disqualification recorded.",
    penaltyApplied: "None",
    createdAt: "2026-06-05T15:05:00"
  }
];

export const prizes = [
  { id: "prize-1", registrationId: "reg-3", prizeType: "Champion", amount: 2500000, distributedAt: "2026-07-05T15:30:00" },
  { id: "prize-2", registrationId: "reg-4", prizeType: "Runner Up", amount: 1200000, distributedAt: null }
];

export const payments = [
  { id: "pay-1", accountId: "d8373cfc", amount: 500000, status: "Completed", createAt: "2026-06-05T09:30:00" },
  { id: "pay-2", accountId: "d8373cfc", amount: 250000, status: "Pending", createAt: "2026-06-05T12:15:00" }
];

export const notifications = [
  { id: "n-1", title: "Account approval queue", role: "Admin", severity: "Warning", message: "3 pending role requests require review." },
  { id: "n-2", title: "Race lock approaching", role: "Spectator", severity: "Info", message: "Race 5 betting closes 5 minutes before start time." },
  { id: "n-3", title: "Invitation pending", role: "Jockey", severity: "Warning", message: "Silver Comet invitation is waiting for confirmation." },
  { id: "n-4", title: "Result report needed", role: "Referee", severity: "Error", message: "Race 2 is waiting for official result confirmation." }
];

export const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value || 0);

export const formatDateTime = (value) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));

export function getRaceViewModel(race) {
  const tournament = tournaments.find((item) => item.id === race.tournamentId);
  const racecourse = racecourses.find((item) => item.id === race.racecourseId);
  const entries = registrations
    .filter((item) => item.raceId === race.id)
    .map((entry) => {
      const horse = horses.find((item) => item.id === entry.horseId);
      const jockey = demoAccounts.find((item) => item.id === entry.jockeyId);
      const result = raceResults.find((item) => item.registrationId === entry.id);
      return { ...entry, horse, jockey, result };
    });

  return { ...race, tournament, racecourse, entries };
}
