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
    username: "leo",
    password: "Leo@1234",
    displayName: "Leo",
    avatar: "🦁"
  },
  {
    username: "maya",
    password: "Maya@1234",
    displayName: "Maya",
    avatar: "🦋"
  },
  {
    username: "arjun",
    password: "Arjun@1234",
    displayName: "Arjun",
    avatar: "🚀"
  },
  {
    username: "tara",
    password: "Tara@1234",
    displayName: "Tara",
    avatar: "⭐"
  },
  {
    username: "zoya",
    password: "Zoya@1234",
    displayName: "Zoya",
    avatar: "🌸"
  }
];
