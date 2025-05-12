export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  if (!auth.token && !['login', 'register'].includes(to.name)) {
    return navigateTo('/admin/login')
  } 
})