import create from 'zustand';

interface Participant {
    id: string;
    name: string;
    isReady: boolean;
}

interface GameState {
    isGameStarted: boolean;
    participants: Participant[];
    currentTurn: number;
    keywordType: string | null;
    remainingTime: number;
    setIsGameStarted: (isStarted: boolean) => void;
    setParticipants: (participants: Participant[]) => void;
    setParticipantReady: (id: string, isReady: boolean) => void;
    setCurrentTurn: (turn: number) => void;
    setKeywordType: (type: string) => void;
    setRemainingTime: (time: number) => void;
    addParticipant: (id: string, name: string) => void;
    removeParticipant: (id: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
    isGameStarted: false,
    participants: [],
    currentTurn: 0,
    keywordType: null,
    remainingTime: 90,
    setIsGameStarted: (isStarted) => set({ isGameStarted: isStarted }),
    setParticipants: (participants) => set({ participants }),
    setParticipantReady: (id, isReady) => set((state) => ({
      participants: state.participants.map((p) =>
        p.id === id ? { ...p, isReady } : p
      )
    })),
    setCurrentTurn: (turn) => set({ currentTurn: turn }),
    setKeywordType: (type) => set({ keywordType: type }),
    setRemainingTime: (time) => set({ remainingTime: time }),
    addParticipant: (id, name) => set((state) => ({
      participants: [...state.participants, { id, name, isReady: false }]
    })),
    removeParticipant: (id) => set((state) => ({
      participants: state.participants.filter((p) => p.id !== id)
    }))
  }));