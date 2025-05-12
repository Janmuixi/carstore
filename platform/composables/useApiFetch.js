export default function () {
  const auth = useAuthStore()
  const config = useRuntimeConfig();
  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      Authorization: auth.token ? `Bearer ${auth.token}` : ''
    }
  })

  return {
    api
  }
};


