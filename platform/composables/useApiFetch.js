export default function () {
  const auth = useAuthStore()
  const config = useRuntimeConfig();
  
  const api = $fetch.create({
    baseURL: 'http://localhost:3001',
    headers: {
      Authorization: auth.token ? `Bearer ${auth.token}` : ''
    },
    onRequest({ request, options }) {
      console.log(options)
      options.baseURL = 'http://localhost:3001'
      // Update authorization header with current token
      if (auth.token) {
        options.headers = options.headers || {}
        options.headers.Authorization = `Bearer ${auth.token}`
      }
    },
    async onResponseError({ request, response, options }) {
      // If we get a 401/403 error and we have a refresh token, try to refresh
      if ((response.status === 401 || response.status === 403) && auth.refreshToken) {
        try {
          await auth.refreshTokens()
          
          // Retry the original request with the new token
          const newOptions = {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${auth.token}`
            }
          }
          
          // Retry the request
          return $fetch(request, newOptions)
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          // If refresh fails, redirect to login
          await auth.logout()
          await navigateTo('/admin/login')
          throw refreshError
        }
      }
      
      // If no refresh token or refresh failed, throw the original error
      throw response._data || new Error(`HTTP ${response.status}`)
    }
  })

  return {
    api
  }
}


