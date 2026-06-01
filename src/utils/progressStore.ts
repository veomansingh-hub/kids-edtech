import { ChildProfile } from '../data/users';

const PROGRESS_KEY = 'curiokids_child_progress_v2';
const PAID_LOCKS_KEY = 'curiokids_paid_locks_v2';

// Local storage helper to manage child state dynamically.
export const getChildProgress = (username: string): ChildProfile => {
  const saved = localStorage.getItem(`${PROGRESS_KEY}_${username}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse progress for", username);
    }
  }

  // Check paid status
  const paidLevels = getPaidLevels(username);

  // Return fresh child record
  return {
    username,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    avatar: getDemoAvatar(username),
    xp: 0,
    level: 1,
    streak: 0,
    unlockedLevels: ["1", "2", ...paidLevels], // Level 1 & 2 are free initially
    completedQuizzes: {},
    completedWorksheets: []
  };
};

export const saveChildProgress = (username: string, progress: ChildProfile) => {
  localStorage.setItem(`${PROGRESS_KEY}_${username}`, JSON.stringify(progress));
};

export const resetChildProgress = (username: string): ChildProfile => {
  localStorage.removeItem(`${PROGRESS_KEY}_${username}`);
  return getChildProgress(username);
};

// Administrative unlocks
export const getPaidLevels = (username: string): string[] => {
  const saved = localStorage.getItem(`${PAID_LOCKS_KEY}_${username}`);
  return saved ? JSON.parse(saved) : [];
};

export const savePaidLevels = (username: string, levels: string[]) => {
  localStorage.setItem(`${PAID_LOCKS_KEY}_${username}`, JSON.stringify(levels));
  
  // Also sync the child progress unlocked list
  const progress = getChildProgress(username);
  const updatedUnlocked = Array.from(new Set([...progress.unlockedLevels, ...levels]));
  progress.unlockedLevels = updatedUnlocked;
  saveChildProgress(username, progress);
};

const getDemoAvatar = (username: string): string => {
  switch (username.toLowerCase()) {
    case 'leo': return '🦁';
    case 'maya': return '🦋';
    case 'arjun': return '🚀';
    case 'tara': return '⭐';
    case 'zoya': return '🌸';
    default: return '👶';
  }
};
