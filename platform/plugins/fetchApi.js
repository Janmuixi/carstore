import { useAuthStore } from '@/stores/auth.js'

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()

  const api = $fetch.create({
    baseURL: 'http://localhost:3001', // your express api
    headers: {
      Authorization: auth.token ? `Bearer ${auth.token}` : ''
    },
    credentials: 'include' // important if you use cookies
  })

  return {
    provide: {
      api
    }
  }
})
