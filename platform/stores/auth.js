import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
    }),
  actions: {
    async login(username, password) {
      const response = await $fetch('/api/login', {
        method: 'POST',
        body: {
          username,
          password
        }
      })
      if (response.status === 200) {
        this.user = response.data.user
        this.token = response.data.token
      } else {
        throw new Error('Login failed')
      }
    },
    async logout() {
      const response = await $fetch('/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      if (response.status === 200) {
        this.user = null
        this.token = null
      } else {
        throw new Error('Logout failed')
      }
    },
  }
})
export default useAuthStore