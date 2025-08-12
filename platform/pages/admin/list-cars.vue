<template>
  <div class="flex min-h-screen items-start sm:items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
    <UCard class="w-full max-w-6xl p-4 sm:p-6 shadow-2xl rounded-2xl bg-white relative">
      <!-- Back and Actions -->
      <div class="flex items-center justify-between mb-4">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="ghost"
          class="text-sm font-medium"
          @click="router.push('/admin')"
        >
          Back
        </UButton>

        <UButton color="primary" icon="i-heroicons-plus" @click="router.push('/admin/new-car')">
          Add new car
        </UButton>
      </div>

      <!-- Title -->
      <h1 class="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-800">Cars</h1>

      <!-- Search -->
      <div class="mb-6">
        <UInput
          v-model="query"
          placeholder="Search by make, model, year or description..."
          icon="i-heroicons-magnifying-glass-20-solid"
          variant="soft"
          class="w-full"
        />
      </div>

      <!-- Loading / Empty States -->
      <div v-if="pending" class="flex items-center justify-center py-20 text-gray-500">
        <UIcon name="i-heroicons-arrow-path-20-solid" class="animate-spin text-gray-500" />
        <span class="ml-2">Loading cars...</span>
      </div>

      <div v-else-if="filteredCars.length === 0" class="text-center text-gray-500 py-20">
        <p class="mb-3">No cars found.</p>
        <UButton color="primary" variant="soft" @click="refresh">Reload</UButton>
      </div>

      <!-- Cars Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <UCard v-for="car in filteredCars" :key="car.id" class="p-4 rounded-xl shadow">
          <!-- Cover Image -->
          <div class="w-full h-40 sm:h-44 rounded-lg overflow-hidden bg-gray-100 mb-3 flex items-center justify-center">
            <img v-if="coverSrcMap[car.id]" :src="coverSrcMap[car.id]" alt="Car image" class="w-full h-full object-cover" />
            <div v-else class="flex items-center justify-center w-full h-full text-gray-400">
              <UIcon name="i-heroicons-photo" class="w-10 h-10" />
            </div>
          </div>

          <div class="flex items-start justify-between mb-2">
            <h2 class="text-xl font-bold text-gray-800">
              {{ car.make }} {{ car.model }}
            </h2>
            <UBadge color="gray" variant="soft">{{ car.year }}</UBadge>
          </div>

          <div class="text-sm text-gray-600 line-clamp-3 mb-3" :title="car.description">
            {{ car.description }}
          </div>

          <div class="flex items-center justify-between mt-2">
            <div class="text-lg font-semibold text-gray-900">{{ formatPrice(car.price) }}</div>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
  
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const query = ref('')

const { api } = useApiFetch()

const { data, pending, error, refresh } = await useAsyncData('cars', async () => {
  const res = await api('/cars')
  if (res?.status !== 'success') {
    throw new Error(res?.message || 'Failed to fetch cars')
  }
  return res.data || []
})

if (error.value) {
  const toast = useToast()
  toast.add({
    title: 'Failed to load cars',
    description: error.value.message,
    color: 'error'
  })
}

const cars = computed(() => data.value || [])

const filteredCars = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return cars.value
  return cars.value.filter((c) => {
    const haystack = `${c.make} ${c.model} ${c.year} ${c.description}`.toLowerCase()
    return haystack.includes(q)
  })
})

function formatPrice(value) {
  const number = Number(value)
  if (Number.isNaN(number)) return String(value)
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(number)
}

const coverSrcMap = reactive({})
const objectUrls = new Set()

function deriveFirstImageSrc(car) {
  const images = Array.isArray(car?.images) ? car.images : []
  if (images.length === 0) return null
  const first = images[0]

  // String value: could be a URL or base64 without prefix
  if (typeof first === 'string') {
    if (first.startsWith('http') || first.startsWith('data:') || first.startsWith('blob:')) return first
    return `data:image/jpeg;base64,${first}`
  }

  // Object: try common fields
  const url = first.url || first.src
  if (typeof url === 'string') return url

  const dataString = first.base64 || first.image_base64 || first.imageData || first.image_data || first.data
  if (typeof dataString === 'string') {
    if (dataString.startsWith('data:')) return dataString
    return `data:image/jpeg;base64,${dataString}`
  }

  // Buffer-like: { type: 'Buffer', data: [...] }
  const bufferLike = first?.image_data || first?.data
  if (bufferLike && typeof bufferLike === 'object' && bufferLike.type === 'Buffer' && Array.isArray(bufferLike.data)) {
    if (process.client) {
      const bytes = new Uint8Array(bufferLike.data)
      const blob = new Blob([bytes], { type: 'image/jpeg' })
      const objUrl = URL.createObjectURL(blob)
      objectUrls.add(objUrl)
      return objUrl
    }
  }

  return null
}

function rebuildCoverSrcs() {
  // Revoke previous blob URLs to avoid leaks
  if (process.client) {
    for (const url of objectUrls) URL.revokeObjectURL(url)
    objectUrls.clear()
  }
  for (const car of cars.value) {
    const src = deriveFirstImageSrc(car)
    if (src) coverSrcMap[car.id] = src
    else delete coverSrcMap[car.id]
  }
}

if (process.client) {
  onMounted(rebuildCoverSrcs)
  watch(cars, rebuildCoverSrcs, { deep: true })
  onBeforeUnmount(() => {
    for (const url of objectUrls) URL.revokeObjectURL(url)
    objectUrls.clear()
  })
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}
</style>


