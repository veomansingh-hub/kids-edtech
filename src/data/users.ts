// Demo users data seed for prototype authentication.
// PRODUCTION NOTE: Passwords must be hashed using a strong hashing algorithm (like bcrypt or argon2)
// and user authentication should be managed securely on a real backend (e.g. Firebase Auth or Supabase).

export interface ChildProfile {
  username: string;
  displayName: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  unlockedLevels: string[]; // e.g. ["1", "2"]
  completedQuizzes: {[levelId: string]: number}; // levelId: maxScore
  completedWorksheets: string[]; // nursery activity ids
}

export const DEMO_USERS = [
  {
    username: "jinay",
    password: "1111",
    displayName: "Jinay (KG)",
    avatar: "🦁"
  },
  {
    username: "kiaan",
    password: "2222",
    displayName: "Kiaan (UKG)",
    avatar: "🚀"
  },
  {
    username: "kiara",
    password: "3333",
    displayName: "Kiara (GK)",
    avatar: "⭐"
  },
  {
    username: "kayra",
    password: "4444",
    displayName: "Kayra (GK)",
    avatar: "🌸"
  },
  {
    username: "kinaya",
    password: "5678",
    displayName: "Kinaya (GK)",
    avatar: "🦋"
  }
];
