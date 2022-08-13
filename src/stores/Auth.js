import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {}
  }),

  getters: {
    getUser(state) {
      return state.user
    }
  },

  actions: {
    setUser(user) {
      this.user = user
    },
    logout() {
      this.user = {}
    }
  }
})
