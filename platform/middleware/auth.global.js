export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  if (!auth.user && !['login', 'register'].includes(to.name)) {
    return navigateTo('/login')
  }
})