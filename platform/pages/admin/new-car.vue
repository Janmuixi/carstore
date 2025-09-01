<template>
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
        <UCard class="w-full max-w-2xl p-6 sm:p-8 shadow-2xl rounded-2xl bg-white relative">

            <!-- Stylish Back Button -->
            <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost"
                class="absolute top-4 left-4 text-sm font-medium" @click="router.push('/admin')">
                Back
            </UButton>

            <!-- Form Title -->
            <h1 class="text-4xl font-extrabold text-center mb-8 text-gray-800">
                Add a New Car
            </h1>

            <!-- Form -->
            <UForm @submit="onSubmit" :schema="schema" :state="form" class="space-y-6 text-base">
                <UFormField label="Make" name="make">
                    <template #default>
                        <UInput class="w-full" v-model="form.make" color="primary" type="text" placeholder="e.g. Toyota"
                            variant="soft" highlight />
                    </template>
                </UFormField>

                <UFormField label="Model" name="model">
                    <template #default>
                        <UInput class="w-full" v-model="form.model" color="primary" type="text"
                            placeholder="e.g. Corolla" variant="soft" highlight />
                    </template>
                </UFormField>

                <UFormField label="Year" name="year">
                    <template #default>
                        <UInput class="w-full" v-model="form.year" color="primary" type="number" placeholder="e.g. 2023"
                            variant="soft" highlight />
                    </template>
                </UFormField>

                <UFormField label="Kilometers" name="km">
                    <template #default>
                        <UInput class="w-full" v-model="form.km" color="primary" type="number" placeholder="e.g. 35000"
                            variant="soft" highlight />
                    </template>
                </UFormField>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormField label="Fuel" name="fuel">
                        <template #default>
                            <USelect class="w-full" v-model="form.fuel" :items="fuelOptions" option-attribute="label"
                                value-attribute="value" placeholder="Select fuel type" :loading="loadingOptions" />
                        </template>
                    </UFormField>

                    <UFormField label="Transmission" name="transmission">
                        <template #default>
                            <USelect class="w-full" v-model="form.transmission" :items="transmissionOptions" option-attribute="label"
                                value-attribute="value" placeholder="Select transmission" :loading="loadingOptions" />
                        </template>
                    </UFormField>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <UFormField label="Doors" name="doors">
                        <template #default>
                            <UInput class="w-full" v-model="form.doors" color="primary" type="number" placeholder="e.g. 4"
                                variant="soft" highlight />
                        </template>
                    </UFormField>

                    <UFormField label="Seats" name="seats">
                        <template #default>
                            <UInput class="w-full" v-model="form.seats" color="primary" type="number" placeholder="e.g. 5"
                                variant="soft" highlight />
                        </template>
                    </UFormField>

                    <UFormField label="Color" name="color">
                        <template #default>
                            <UInput class="w-full" v-model="form.color" color="primary" type="text" placeholder="e.g. Red"
                                variant="soft" highlight />
                        </template>
                    </UFormField>
                </div>

                <UFormField label="Price" name="price">
                    <template #default>
                        <UInput class="w-full" v-model="form.price" color="primary" type="number"
                            placeholder="e.g. 25000" variant="soft" highlight />
                    </template>
                </UFormField>

                <UFormField label="Description" name="description">
                    <template #default>
                        <UTextarea class="w-full" v-model="form.description" color="primary"
                            placeholder="Write a short description..." variant="soft" highlight autoresize />
                    </template>
                </UFormField>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormField label="Status (optional)" name="status">
                        <template #default>
                            <USelect class="w-full" v-model="form.status" :items="statusOptions" option-attribute="label"
                                value-attribute="value" placeholder="Choose status" :loading="loadingOptions" />
                        </template>
                    </UFormField>

                    <UFormField label="Warranty Expiration (optional)" name="warranty_expiration_date">
                        <template #default>
                            <UInput class="w-full" v-model="form.warranty_expiration_date" color="primary" type="date"
                                variant="soft" highlight />
                        </template>
                    </UFormField>
                </div>

                <!-- Image Upload Section -->
                <UFormField name="images">
                    <template #default>
                        <div class="flex items-center gap-4">
                            <UButton color="primary" variant="soft" :disabled="images.length >= 8"
                                @click="triggerFileInput">
                                Upload Images
                            </UButton>
                            <span class="text-sm text-gray-500">Max 8 images</span>
                            <input ref="fileInput" class="hidden" type="file" multiple accept="image/*"
                                @change="onImageUpload" />
                        </div>
                    </template>
                </UFormField>

                <!-- Uploaded Images Preview -->
                <div v-if="images.length" class="mt-4">
                    <h2 class="text-md font-semibold mb-3 text-gray-800">Uploaded Images</h2>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div v-for="(image, index) in images" :key="index"
                            class="relative group rounded-lg overflow-hidden shadow">
                            <img :src="image.preview" alt="Uploaded image"
                                class="w-full h-28 object-cover transition-transform group-hover:scale-105" />
                            <button @click="removeImage(index)"
                                class="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow">
                                ✕
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <UButton type="submit" variant="solid" size="xl"
                    class="w-full mt-6 font-semibold text-lg flex items-center justify-center" color="primary"
                    :disabled="!form.make || !form.model || !form.year || !form.price || !form.km || !form.fuel || !form.transmission || !form.doors || !form.seats || !form.color">
                    Add Car
                </UButton>
            </UForm>
        </UCard>
    </div>
</template>

<script setup>
import * as v from 'valibot'

definePageMeta({
    middleware: ['auth']
})

const router = useRouter()
const fileInput = ref(null)

const schema = v.object({
    make: v.pipe(v.string("Make is required"), v.minLength(1, "Make is required")),
    model: v.pipe(v.string("Model is required"), v.minLength(1, "Model is required")),
    year: v.pipe(
        v.number('Year cannot be empty'),
        v.minValue(1886, "Year must be greater than 1886"),
        v.maxValue(new Date().getFullYear(), "Year must be less than or equal to the current year")
    ),
    km: v.pipe(
        v.number('Kilometers cannot be empty'),
        v.minValue(0, 'Kilometers must be >= 0')
    ),
    fuel: v.pipe(v.string('Fuel cannot be empty'), v.minLength(1, 'Fuel cannot be empty')),
    transmission: v.pipe(v.string('Transmission cannot be empty'), v.minLength(1, 'Transmission cannot be empty')),
    doors: v.pipe(v.number('Doors cannot be empty'), v.minValue(1, 'Doors must be >= 1')),
    seats: v.pipe(v.number('Seats cannot be empty'), v.minValue(1, 'Seats must be >= 1')),
    color: v.pipe(v.string('Color cannot be empty'), v.minLength(1, 'Color cannot be empty')),
    price: v.pipe(
        v.number("Price cannot be empty"),
        v.minValue(10, "Value must be bigger than 10"),
        v.maxValue(100000000, "Value must be smaller than 100000000")
    ),
    description: v.pipe(v.string(), v.minLength(1, 'Must be at least 8 characters')),
    status: v.optional(v.string()),
    warranty_expiration_date: v.optional(v.string())
})

const form = reactive({
    make: null,
    model: null,
    year: null,
    km: null,
    fuel: null,
    transmission: null,
    doors: null,
    seats: null,
    color: null,
    price: null,
    description: "",
    status: null,
    warranty_expiration_date: null,
})

const images = reactive([])

function triggerFileInput() {
    fileInput.value?.click()
}

function onImageUpload(event) {
    const files = event.target.files
    for (const file of files) {
        // Validate file type using valibot
        const imageSchema = v.object({
            type: v.union([
                v.literal('image/jpeg'),
                v.literal('image/png')
            ], 'Only JPEG or PNG images are allowed')
        })

        const result = v.safeParse(imageSchema, { type: file.type })
        if (!result.success) {
            const toast = useToast()
            toast.add({
                title: "Invalid image type",
                description: "Only JPEG or PNG images are allowed.",
                color: "error",
            })
            continue
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            images.push({
                file,
                preview: e.target.result,
            })
        }
        reader.readAsDataURL(file)
    }
}

function removeImage(index) {
    images.splice(index, 1)
}

const fuelOptions = ref([])
const transmissionOptions = ref([])
const statusOptions = ref([])
const loadingOptions = ref(false)

onMounted(async () => {
    loadingOptions.value = true
    const { api } = useApiFetch()
    const res = await api('/caroptions')
    const data = res?.data || {}
    fuelOptions.value = (data.fuel || []).map(v => ({ label: capitalize(v), value: v }))
    transmissionOptions.value = (data.transmission || []).map(v => ({ label: capitalize(v), value: v }))
    statusOptions.value = (data.status || []).map(v => ({ label: capitalize(v), value: v }))
    loadingOptions.value = false
})

function capitalize(s) { return (s || '').charAt(0).toUpperCase() + (s || '').slice(1) }

async function onSubmit() {
    const { make, model, year, price, description, km, fuel, transmission, doors, seats, color, status, warranty_expiration_date } = form
    const { api } = useApiFetch()
    const formData = new FormData()
    
    formData.append("make", make)
    formData.append("model", model)
    formData.append("year", parseInt(year))
    formData.append("km", parseInt(km))
    formData.append("fuel", fuel)
    formData.append("transmission", transmission)
    formData.append("doors", parseInt(doors))
    formData.append("seats", parseInt(seats))
    formData.append("color", color)
    formData.append("price", parseFloat(price))
    formData.append("description", description)
    if (status) formData.append("status", status)
    if (warranty_expiration_date) formData.append("warranty_expiration_date", warranty_expiration_date)
    images.forEach((image, index) => {
        formData.append(`images[${index}]`, image.file)
    })

    try {
        const res = await api("/cars", {
            method: "POST",
            body: formData,
        })
        if (res.status == "success") {
            const toast = useToast()
            toast.add({
                title: "Car added",
                description: "The car has been successfully added.",
                color: "success",
            })
            router.push("/admin")
        }
    } catch (error) {
        const toast = useToast()
        toast.add({
            title: "Failed to add car",
            description: "An error occurred while adding the car.",
            color: "error",
        })
    }
}
</script>