export interface ChildProfile {
  username: string;
  displayName: string;
  avatar: string;
  password?: string;
  xp: number;
  level: number;
  streak: number;
  unlockedLevels: string[]; // e.g. ["1", "2"]
  completedQuizzes: {[levelId: string]: number}; // levelId: maxScore
  completedWorksheets: string[]; // nursery activity ids
}

export const DEMO_USERS = [
  {
    username: "aanya",
    password: "Teddy123",
    displayName: "Aanya",
    avatar: "🐻",
    xp: 120,
    level: 1,
    streak: 3
  },
  {
    username: "aarav",
    password: "Panda234",
    displayName: "Aarav",
    avatar: "🐼",
    xp: 250,
    level: 2,
    streak: 5
  },
  {
    username: "myra",
    password: "Cub345",
    displayName: "Myra",
    avatar: "🐨",
    xp: 90,
    level: 1,
    streak: 1
  },
  {
    username: "vihaan",
    password: "Star456",
    displayName: "Vihaan",
    avatar: "⭐",
    xp: 450,
    level: 3,
    streak: 7
  },
  {
    username: "kiaan",
    password: "Play567",
    displayName: "Kiaan",
    avatar: "🎮",
    xp: 310,
    level: 2,
    streak: 4
  }
];
