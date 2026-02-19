
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


// Define the shape of the User State
export interface QuizResult {
    quizId: string;
    score: number;
    total: number;
    date: string; // ISO date string
}

interface UserPreferences {
    theme: 'light' | 'dark';
    soundEnabled: boolean;
}

interface UserState {
    name: string;
    email?: string;
    picture?: string;
    isAuthenticated: boolean;
    xp: number;
    level: number;
    completedQuizzes: string[]; // IDs of completed quizzes
    badges: string[];
    quizHistory: QuizResult[];
    streak: number;
    lastLoginDate?: string;
    preferences: UserPreferences;
}

interface UserContextType {
    user: UserState;
    login: () => void;
    logout: () => void;
    addXp: (amount: number) => void;
    completeQuiz: (quizId: string, score: number, total: number) => void;
    toggleTheme: () => void;
    toggleSound: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500]; // XP needed for each level

export function UserProvider({ children }: { children: ReactNode }) {
    // Initialize from localStorage if available
    const [user, setUser] = useState<UserState>(() => {
        const saved = localStorage.getItem('studygen_user');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migration: Ensure new fields exist if loading old data
            return {
                ...parsed,
                quizHistory: parsed.quizHistory || [],
                streak: parsed.streak || 0,
                preferences: parsed.preferences || { theme: 'dark', soundEnabled: true }
            };
        }
        return {
            name: 'Guest Explorer',
            isAuthenticated: false,
            xp: 0,
            level: 1,
            completedQuizzes: [],
            badges: [],
            quizHistory: [],
            streak: 0,
            preferences: { theme: 'dark', soundEnabled: true }
        };
    });

    useEffect(() => {
        localStorage.setItem('studygen_user', JSON.stringify(user));

        // Apply theme to body
        if (user.preferences.theme === 'light') {
            document.documentElement.classList.add('light-mode');
        } else {
            document.documentElement.classList.remove('light-mode');
        }
    }, [user]);

    // Check for streak on mount/login
    useEffect(() => {
        if (!user.lastLoginDate) return;

        const today = new Date().toISOString().split('T')[0];
        const lastLogin = user.lastLoginDate.split('T')[0];

        if (today !== lastLogin) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastLogin === yesterdayStr) {
                // Continued streak
                setUser(prev => ({ ...prev, streak: prev.streak + 1, lastLoginDate: new Date().toISOString() }));
            } else if (new Date(lastLogin) < yesterday) {
                // Broken streak
                setUser(prev => ({ ...prev, streak: 1, lastLoginDate: new Date().toISOString() }));
            } else {
                // Just update login date if same day (unlikely to hit this branch due to today check, but safe)
                setUser(prev => ({ ...prev, lastLoginDate: new Date().toISOString() }));
            }
        }
    }, []); // Run once on mount

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );

                setUser(prev => ({
                    ...prev,
                    name: userInfo.data.name,
                    email: userInfo.data.email,
                    picture: userInfo.data.picture,
                    isAuthenticated: true,
                    lastLoginDate: new Date().toISOString()
                }));
            } catch (error) {
                console.error("Google Login User Info Failed", error);
            }
        },
        onError: errorResponse => console.log(errorResponse),
    });

    const login = () => {
        googleLogin();
    };

    const logout = () => {
        googleLogout();
        setUser(prev => ({
            ...prev,
            name: 'Guest Explorer',
            email: undefined,
            picture: undefined,
            isAuthenticated: false,
            streak: 0
            // Keep XP/Badges for now unless explicitly clearing local storage
        }));
    };

    const addXp = (amount: number) => {
        setUser(prev => {
            const newXp = prev.xp + amount;
            let newLevel = prev.level;

            // Check for level up
            for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
                if (newXp >= LEVEL_THRESHOLDS[i]) {
                    newLevel = i + 1;
                }
            }

            // Unlock badges logic could go here

            return { ...prev, xp: newXp, level: newLevel };
        });
    };

    const completeQuiz = (quizId: string, score: number, total: number) => {
        const xpReward = score * 10;

        setUser(prev => {
            const isNew = !prev.completedQuizzes.includes(quizId);
            const newCompleted = isNew ? [...prev.completedQuizzes, quizId] : prev.completedQuizzes;
            const totalReward = isNew ? xpReward + 50 : xpReward;

            const newXp = prev.xp + totalReward;
            let newLevel = prev.level;
            for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
                if (newXp >= LEVEL_THRESHOLDS[i]) {
                    newLevel = i + 1;
                }
            }

            // check for badge awards
            let newBadges = [...prev.badges];
            if (newLevel >= 5 && !newBadges.includes('lvl5_wizard')) newBadges.push('lvl5_wizard');
            if (newLevel >= 10 && !newBadges.includes('lvl10_master')) newBadges.push('lvl10_master');

            const newHistory = [
                ...prev.quizHistory,
                { quizId, score, total, date: new Date().toISOString() }
            ];

            return {
                ...prev,
                xp: newXp,
                level: newLevel,
                completedQuizzes: newCompleted,
                badges: newBadges,
                quizHistory: newHistory
            };
        });
    };

    const toggleTheme = () => {
        setUser(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                theme: prev.preferences.theme === 'dark' ? 'light' : 'dark'
            }
        }));
    };

    const toggleSound = () => {
        setUser(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                soundEnabled: !prev.preferences.soundEnabled
            }
        }));
    };

    return (
        <UserContext.Provider value={{ user, login, logout, addXp, completeQuiz, toggleTheme, toggleSound }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
