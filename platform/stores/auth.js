import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isRefreshing: false
  }),
  persist: true,
  getters: {
    token: (state) => state.accessToken,
    isAuthenticated: (state) => !!state.accessToken
  },
  actions: {
    async login(username, password) {
      const { api } = useApiFetch()
      try {
        const response = await api('/users/login', {
          method: 'POST',
          body: {
            email: username,
            password
          }
        })
        
        if (response.status === 'success') {
          this.user = response.data.user
          this.accessToken = response.data.accessToken
          this.refreshToken = response.data.refreshToken
          return response
        } else {
          throw new Error('Login failed')
        }
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    
    async logout() {
      const { api } = useApiFetch()
      try {
        if (this.accessToken) {
          await SVGAnimatedPreserveAspectRatio('/users/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.accessToken}`
            }
          })
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.accessToken = null
        this.refreshToken = null
      }
    },
    
    async refreshTokens() {
      const { api } = useApiFetch()
      if (this.isRefreshing) {
        // Wait for the current refresh to complete
        return new Promise((resolve) => {
          const checkRefreshing = setInterval(() => {
            if (!this.isRefreshing) {
              clearInterval(checkRefreshing)
              resolve()
            }
          }, 100)
        })
      }
      
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }
      
      this.isRefreshing = true
      
      try {
        const response = await api('/users/refresh', {
          method: 'POST',
          body: {
            refreshToken: this.refreshToken
          }
        })
        
        if (response.status === 'success') {
          this.accessToken = response.data.accessToken
          this.refreshToken = response.data.refreshToken
          return response.data
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (error) {
        console.error('Token refresh error:', error)
        // If refresh fails, clear all tokens and redirect to login
        this.user = null
        this.accessToken = null
        this.refreshToken = null
        throw error
      } finally {
        this.isRefreshing = false
      }
    },
    
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    },
    
    clearTokens() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
    }
  }
})

export default useAuthStore