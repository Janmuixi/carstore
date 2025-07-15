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
                    :disabled="!form.make || !form.model || !form.year || !form.price">
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
    price: v.pipe(
        v.number("Price cannot be empty"),
        v.minValue(10, "Value must be bigger than 10"),
        v.maxValue(100000000, "Value must be smaller than 100000000")
    ),
    description: v.pipe(v.string(), v.minLength(1, 'Must be at least 8 characters')),
    images: v.array(v.mimeType(["image/jpeg", "image/png"]), "Images must be files"),
})

const form = reactive({
    make: null,
    model: null,
    year: null,
    price: null,
    description: "",
})

const images = reactive([])

function triggerFileInput() {
    fileInput.value?.click()
}

function onImageUpload(event) {
    const files = event.target.files
    for (const file of files) {
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

async function onSubmit() {
    const { make, model, year, price } = form
    const { api } = useApiFetch()
    const formData = new FormData()

    formData.append("make", make)
    formData.append("model", model)
    formData.append("year", parseInt(year))
    formData.append("price", parseFloat(price))
    formData.append("description", form.description)
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