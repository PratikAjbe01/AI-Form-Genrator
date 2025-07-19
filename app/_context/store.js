import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // User state
  appUser: null,
  userLoading: true,
  update: false,
  setUpdate: (val) => set({ update: val }),
  fetchUser: async (email) => {
    set({ userLoading: true })
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      set({ appUser: data.credit })
    } catch (error) {
      console.error('User fetch error:', error)
    } finally {
      set({ userLoading: false })
    }
  },

  updateUserCredit: async (email, delta) => {
    try {
      const res = await fetch('/api/update-credit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, delta }),
      })
      const data = await res.json()
      if (data.success) {
        set({ appUser: data.newCredit })
      }
      return data
    } catch (error) {
      console.error('Credit update error:', error)
    }
  },

  // Forms state
  forms: [],
  formsLoading: true,
  fetchForms: async (email) => {
    set({ formsLoading: true })
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      set({ forms: data })
    } catch (error) {
      console.error('Forms fetch error:', error)
    } finally {
      set({ formsLoading: false })
    }
  },
})) 