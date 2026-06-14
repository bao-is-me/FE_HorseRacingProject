import {
  Activity,
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Flag,
  Gauge,
  Gavel,
  Home,
  LayoutDashboard,
  LogIn,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  Wallet
} from "lucide-react";

export const roleMenus = {
  Guest: [
    { id: "login", label: "Login", icon: LogIn },
    { id: "register", label: "Register", icon: UserPlus },
    { id: "public-races", label: "Public Races", icon: Trophy }
  ],
  Spectator: [
    { id: "home", label: "Home", icon: Home },
    { id: "spectator-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "races", label: "Races", icon: CalendarDays },
    { id: "predictions", label: "Prediction / Bet", icon: Sparkles },
    { id: "bet-history", label: "Betting History", icon: ClipboardList },
    { id: "live-results", label: "Live Results", icon: Activity },
    { id: "rankings", label: "Rankings", icon: Medal },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: UserCog }
  ],
  HorseOwner: [
    { id: "home", label: "Home", icon: Home },
    { id: "owner-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-horses", label: "My Horses", icon: ShieldCheck },
    { id: "register-race", label: "Register Horse", icon: ClipboardCheck },
    { id: "jockey-selection", label: "Jockey Selection", icon: UserCheck },
    { id: "horse-schedule", label: "Horse Schedule", icon: CalendarDays },
    { id: "owner-results", label: "Results & Prizes", icon: Trophy },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: UserCog }
  ],
  Jockey: [
    { id: "home", label: "Home", icon: Home },
    { id: "jockey-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "ride-invitations", label: "Ride Invitations", icon: Bell },
    { id: "jockey-schedule", label: "My Schedule", icon: CalendarDays },
    { id: "assigned-races", label: "Assigned Races", icon: Flag },
    { id: "rankings", label: "Rankings", icon: Medal },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: UserCog }
  ],
  Referee: [
    { id: "home", label: "Home", icon: Home },
    { id: "referee-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "race-monitoring", label: "Race Monitoring", icon: Gauge },
    { id: "horse-check", label: "Horse Check", icon: ClipboardCheck },
    { id: "violations", label: "Violations", icon: AlertTriangle },
    { id: "result-form", label: "Result Form", icon: CheckCircle2 },
    { id: "race-report", label: "Race Report", icon: ClipboardList },
    { id: "profile", label: "Profile", icon: UserCog }
  ],
  Admin: [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "user-management", label: "Users", icon: Users },
    { id: "account-approval", label: "Approvals", icon: UserCheck },
    { id: "tournaments", label: "Tournaments", icon: Trophy },
    { id: "racecourses", label: "Racecourses", icon: Flag },
    { id: "race-management", label: "Races", icon: CalendarDays },
    { id: "horse-management", label: "Horses", icon: ShieldCheck },
    { id: "jockey-assignment", label: "Jockey Assignment", icon: UserCheck },
    { id: "referee-assignment", label: "Referee Assignment", icon: Gavel },
    { id: "result-publishing", label: "Result Publishing", icon: ClipboardCheck },
    { id: "bet-management", label: "Bets", icon: CircleDollarSign },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: UserCog }
  ]
};

export const defaultPageByRole = {
  Guest: "login",
  Spectator: "home",
  HorseOwner: "home",
  Jockey: "home",
  Referee: "home",
  Admin: "admin-dashboard"
};
