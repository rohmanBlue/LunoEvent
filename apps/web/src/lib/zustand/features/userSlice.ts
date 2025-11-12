import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiCall from '@/helper/apiCloud'

type User = {
  email: string
  password: string
}

type UserState = {
  user: User | null
  isAuthenticated: boolean
  setSignIn: (user: User) => void
  setSignOut: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setSignIn: (user) => {
        localStorage.setItem('token', JSON.stringify(user))
        set({ user, isAuthenticated: true })
      },

      setSignOut: () => {
        localStorage.removeItem('token')
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'user-storage', // nama key di localStorage
    }
  )
) 
