
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import useSound from 'use-sound';
import { useUser } from './UserContext';

// Simple sound URLs for demo purposes
// In production, these should be local assets
const CORRECT_SFX = 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3';
const INCORRECT_SFX = 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3';
const LEVEL_UP_SFX = 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';

interface SoundContextType {
    playCorrect: () => void;
    playIncorrect: () => void;
    playLevelUp: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
    const { user } = useUser();

    const [playCorrect] = useSound(CORRECT_SFX, { volume: 0.5 });
    const [playIncorrect] = useSound(INCORRECT_SFX, { volume: 0.3 });
    const [playLevelUp] = useSound(LEVEL_UP_SFX, { volume: 0.6 });

    const playIfEnabled = (playFn: any) => {
        if (user?.preferences?.soundEnabled && playFn) {
            try {
                playFn();
            } catch (e) {
                console.warn("Audio playback failed", e);
            }
        }
    };

    return (
        <SoundContext.Provider value={{
            playCorrect: () => playIfEnabled(playCorrect),
            playIncorrect: () => playIfEnabled(playIncorrect),
            playLevelUp: () => playIfEnabled(playLevelUp)
        }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSFX() {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSFX must be used within a SoundProvider');
    }
    return context;
}
