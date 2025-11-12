import { create } from 'zustand'

type AppState = {
  isLoading: boolean
  setLoading: (val: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  setLoading: (val) => set({ isLoading: val }),
}))
