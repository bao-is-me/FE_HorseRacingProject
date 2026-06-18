export const racecourses = [
  { id: "rc-1", racecourseName: "Churchill Downs", location: "Louisville, Kentucky", trackType: "Dirt" },
  { id: "rc-2", racecourseName: "Saigon Turf Club", location: "Ho Chi Minh City", trackType: "Turf" },
  { id: "rc-3", racecourseName: "Emerald Track", location: "Da Nang", trackType: "Synthetic" }
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
    status: "Completed"
  },
  {
    id: "race-5",
    tournamentId: "t-2",
    racecourseId: "rc-2",
    raceNumber: 3,
    startTime: "2026-07-06T13:45:00",
    trackLength: 1800,
    maxParticipants: 10,
    status: "Finished"
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
    status: "Confirmed"
  },
  {
    id: "reg-2",
    raceId: "race-1",
    horseId: "h-3",
    jockeyId: "039126e4",
    gateNumber: 5,
    ownerConfirmation: true,
    jockeyConfirmation: false,
    status: "Pending"
  },
  {
    id: "reg-3",
    raceId: "race-3",
    horseId: "h-4",
    jockeyId: "039126e4",
    gateNumber: 1,
    ownerConfirmation: true,
    jockeyConfirmation: true,
    status: "Confirmed"
  },
  {
    id: "reg-4",
    raceId: "race-4",
    horseId: "h-2",
    jockeyId: "039126e4",
    gateNumber: 4,
    ownerConfirmation: true,
    jockeyConfirmation: true,
    status: "Confirmed"
  },
  {
    id: "reg-5",
    raceId: "race-5",
    horseId: "h-1",
    jockeyId: "039126e4",
    gateNumber: 3,
    ownerConfirmation: true,
    jockeyConfirmation: true,
    status: "Confirmed"
  },
  {
    id: "reg-6",
    raceId: "race-5",
    horseId: "h-4",
    jockeyId: "039126e4",
    gateNumber: 6,
    ownerConfirmation: true,
    jockeyConfirmation: true,
    status: "Confirmed"
  }
];
