<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <UButton
                    icon="i-heroicons-arrow-left"
                    color="gray"
                    variant="ghost"
                    @click="router.push('/admin/list-cars')"
                >
                    Back to Cars
                </UButton>

                <div class="flex gap-2">
                    <UButton
                        v-if="!isEditing"
                        color="primary"
                        icon="i-heroicons-pencil-square"
                        @click="startEditing"
                    >
                        Edit
                    </UButton>
                    <UButton
                        v-if="!isEditing && !pending"
                        color="red"
                        icon="i-heroicons-trash"
                        @click="confirmDelete"
                    >
                        Delete
                    </UButton>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="pending" class="flex items-center justify-center py-20">
                <UIcon
                    name="i-heroicons-arrow-path-20-solid"
                    class="animate-spin text-gray-500"
                />
                <span class="ml-2">Loading car details...</span>
            </div>

            <!-- Error State -->
            <UCard v-else-if="error" class="p-6">
                <div class="text-center text-red-600">
                    <UIcon
                        name="i-heroicons-exclamation-triangle"
                        class="w-12 h-12 mx-auto mb-4"
                    />
                    <h2 class="text-xl font-semibold mb-2">
                        Error Loading Car
                    </h2>
                    <p class="text-gray-600 mb-4">{{ error.message }}</p>
                    <UButton color="primary" @click="refresh"
                        >Try Again</UButton
                    >
                </div>
            </UCard>

            <!-- Car Details -->
            <div v-else-if="car" class="space-y-6">
                <!-- Car Header -->
                <UCard class="p-6">
                    <div class="flex flex-col lg:flex-row gap-6">
                        <!-- Images Section -->
                        <div class="lg:w-1/2">
                            <h3 class="text-lg font-semibold mb-4">Images</h3>

                            <!-- Image Upload (when editing) -->
                            <div v-if="isEditing" class="mb-4">
                                <UInput
                                    ref="fileInput"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    @change="handleImageUpload"
                                    class="hidden"
                                />
                                <UButton
                                    color="primary"
                                    variant="soft"
                                    icon="i-heroicons-photo"
                                    @click="$refs.fileInput.click()"
                                >
                                    Upload Images
                                </UButton>
                            </div>

                            <!-- Image Gallery -->
                            <div
                                v-if="car.images && car.images.length > 0"
                                class="grid grid-cols-2 md:grid-cols-3 gap-3"
                            >
                                <div
                                    v-for="(image, index) in car.images"
                                    :key="image.id || index"
                                    class="relative group"
                                >
                                    <img
                                        :src="getImageSrc(image)"
                                        :alt="`Car image ${index + 1}`"
                                        class="w-full h-32 object-cover rounded-lg"
                                    />
                                    <div
                                        v-if="isEditing"
                                        class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                                    >
                                        <UButton
                                            color="red"
                                            size="sm"
                                            icon="i-heroicons-trash"
                                            @click="deleteImage(image.id)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center py-8 text-gray-500">
                                <UIcon
                                    name="i-heroicons-photo"
                                    class="w-12 h-12 mx-auto mb-2"
                                />
                                <p>No images uploaded</p>
                            </div>
                        </div>

                        <!-- Car Info -->
                        <div class="lg:w-1/2">
                            <div v-if="!isEditing">
                                <h1
                                    class="text-3xl font-bold text-gray-800 mb-2"
                                >
                                    {{ car.make }} {{ car.model }}
                                </h1>
                                <UBadge
                                    :color="statusColor(car.status)"
                                    class="mb-4"
                                >
                                    {{ car.status }}
                                </UBadge>
                                <p class="text-gray-600 mb-4">
                                    {{ car.description }}
                                </p>
                                <div
                                    class="text-2xl font-bold text-gray-900 mb-4"
                                >
                                    {{ formatPrice(car.price) }}
                                </div>
                            </div>

                            <!-- Edit Form -->
                            <form
                                v-else
                                @submit.prevent="saveChanges"
                                class="space-y-4"
                            >
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <UInput
                                        v-model="editForm.make"
                                        label="Make"
                                        placeholder="Car make"
                                        required
                                    />
                                    <UInput
                                        v-model="editForm.model"
                                        label="Model"
                                        placeholder="Car model"
                                        required
                                    />
                                    <UInput
                                        v-model="editForm.year"
                                        label="Year"
                                        type="number"
                                        placeholder="Year"
                                        required
                                    />
                                    <UInput
                                        v-model="editForm.km"
                                        label="Kilometers"
                                        type="number"
                                        placeholder="Kilometers"
                                        required
                                    />
                                    <USelect
                                        v-model="editForm.fuel"
                                        label="Fuel Type"
                                        :options="fuelOptions"
                                        required
                                    />
                                    <USelect
                                        v-model="editForm.transmission"
                                        label="Transmission"
                                        :options="transmissionOptions"
                                        required
                                    />
                                    <UInput
                                        v-model="editForm.doors"
                                        label="Doors"
                                        type="number"
                                        placeholder="Number of doors"
                                        required
                                    />
                                    <UInput
                                        v-model="editForm.seats"
                                        label="Seats"
                                        type="number"
                                        placeholder="Number of seats"
                                        required
                                    />
                                    <UInput
                                        v-model="editForm.color"
                                        label="Color"
                                        placeholder="Car color"
                                        required
                                    />
                                    <UInput
                                        v-model="editForm.price"
                                        label="Price"
                                        type="number"
                                        step="0.01"
                                        placeholder="Price"
                                        required
                                    />
                                    <USelect
                                        v-model="editForm.status"
                                        label="Status"
                                        :options="statusOptions"
                                        required
                                    />
                                </div>

                                <UTextarea
                                    v-model="editForm.description"
                                    label="Description"
                                    placeholder="Car description"
                                    rows="3"
                                    required
                                />

                                <UInput
                                    v-model="editForm.warranty_expiration_date"
                                    label="Warranty Expiration Date"
                                    type="date"
                                    placeholder="Warranty expiration date"
                                />

                                <div class="flex gap-2 pt-4">
                                    <UButton
                                        type="submit"
                                        color="primary"
                                        :loading="saving"
                                    >
                                        Save Changes
                                    </UButton>
                                    <UButton
                                        color="gray"
                                        variant="soft"
                                        @click="cancelEditing"
                                    >
                                        Cancel
                                    </UButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </UCard>

                <!-- Car Specifications -->
                <UCard v-if="!isEditing" class="p-6">
                    <h3 class="text-xl font-semibold mb-4">Specifications</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="text-center p-4 bg-gray-50 rounded-lg">
                            <div class="text-2xl font-bold text-gray-800">
                                {{ car.year }}
                            </div>
                            <div class="text-sm text-gray-600">Year</div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-lg">
                            <div class="text-2xl font-bold text-gray-800">
                                {{ new Intl.NumberFormat().format(car.km) }}
                            </div>
                            <div class="text-sm text-gray-600">Kilometers</div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-lg">
                            <div
                                class="text-2xl font-bold text-gray-800 capitalize"
                            >
                                {{ car.fuel }}
                            </div>
                            <div class="text-sm text-gray-600">Fuel Type</div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-lg">
                            <div
                                class="text-2xl font-bold text-gray-800 capitalize"
                            >
                                {{ car.transmission }}
                            </div>
                            <div class="text-sm text-gray-600">
                                Transmission
                            </div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-lg">
                            <div class="text-2xl font-bold text-gray-800">
                                {{ car.doors }}
                            </div>
                            <div class="text-sm text-gray-600">Doors</div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-lg">
                            <div class="text-2xl font-bold text-gray-800">
                                {{ car.seats }}
                            </div>
                            <div class="text-sm text-gray-600">Seats</div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-lg">
                            <div class="text-2xl font-bold text-gray-800">
                                {{ car.color }}
                            </div>
                            <div class="text-sm text-gray-600">Color</div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-lg">
                            <div class="text-2xl font-bold text-gray-800">
                                {{ formatPrice(car.price) }}
                            </div>
                            <div class="text-sm text-gray-600">Price</div>
                        </div>
                    </div>
                </UCard>

                <!-- Additional Info -->
                <UCard
                    v-if="
                        !isEditing &&
                        (car.warranty_expiration_date ||
                            car.created_at ||
                            car.updated_at)
                    "
                    class="p-6"
                >
                    <h3 class="text-xl font-semibold mb-4">
                        Additional Information
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-if="car.warranty_expiration_date">
                            <div class="text-sm text-gray-600">
                                Warranty Expiration
                            </div>
                            <div class="font-semibold">
                                {{ formatDate(car.warranty_expiration_date) }}
                            </div>
                        </div>
                        <div v-if="car.created_at">
                            <div class="text-sm text-gray-600">Created</div>
                            <div class="font-semibold">
                                {{ formatDate(car.created_at) }}
                            </div>
                        </div>
                        <div v-if="car.updated_at">
                            <div class="text-sm text-gray-600">
                                Last Updated
                            </div>
                            <div class="font-semibold">
                                {{ formatDate(car.updated_at) }}
                            </div>
                        </div>
                    </div>
                        </UCard>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :is-open="showDeleteModal"
      title="Delete Car"
      :description="`Are you sure you want to delete ${car?.make} ${car?.model}? This action cannot be undone.`"
      confirm-label="Delete"
      confirm-color="red"
      @confirm="deleteCar"
      @close="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
definePageMeta({
    middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const { api } = useApiFetch();
const toast = useToast();

const carId = route.params.id;
const isEditing = ref(false);
const saving = ref(false);
const fileInput = ref(null);
const showDeleteModal = ref(false);

// Form data for editing
const editForm = ref({});

// Options for select fields
const fuelOptions = [
    { label: "Gasoline", value: "gasoline" },
    { label: "Diesel", value: "diesel" },
    { label: "Electric", value: "electric" },
    { label: "Hybrid", value: "hybrid" },
];

const transmissionOptions = [
    { label: "Manual", value: "manual" },
    { label: "Automatic", value: "automatic" },
];

const statusOptions = [
    { label: "Available", value: "available" },
    { label: "Sold", value: "sold" },
    { label: "Reserved", value: "reserved" },
];

// Fetch car data
const {
    data: car,
    pending,
    error,
    refresh,
} = await useAsyncData(`car-${carId}`, async () => {
    const res = await api(`/cars/${carId}`);
    if (res?.status !== "success") {
        throw new Error(res?.message || "Failed to fetch car");
    }
    return res.data;
});

// Initialize edit form
function initializeEditForm() {
    if (car.value) {
        editForm.value = {
            make: car.value.make,
            model: car.value.model,
            description: car.value.description,
            year: car.value.year,
            km: car.value.km,
            fuel: car.value.fuel,
            transmission: car.value.transmission,
            doors: car.value.doors,
            seats: car.value.seats,
            color: car.value.color,
            price: car.value.price,
            status: car.value.status,
            warranty_expiration_date: car.value.warranty_expiration_date,
        };
    }
}

// Start editing
function startEditing() {
    initializeEditForm();
    isEditing.value = true;
}

// Cancel editing
function cancelEditing() {
    isEditing.value = false;
    editForm.value = {};
}

// Save changes
async function saveChanges() {
    saving.value = true;
    try {
        const res = await api(`/cars/${carId}`, {
            method: "PUT",
            body: editForm.value,
        });

        if (res?.status === "success") {
            toast.add({
                title: "Success",
                description: "Car updated successfully",
                color: "green",
            });
            await refresh();
            isEditing.value = false;
        } else {
            throw new Error(res?.message || "Failed to update car");
        }
    } catch (error) {
        toast.add({
            title: "Error",
            description: error.message,
            color: "red",
        });
    } finally {
        saving.value = false;
    }
}

// Handle image upload
async function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images", file);
        });

        const res = await api(`/cars/${carId}/images`, {
            method: "POST",
            body: formData,
        });

        if (res?.status === "success") {
            toast.add({
                title: "Success",
                description: "Images uploaded successfully",
                color: "green",
            });
            await refresh();
        } else {
            throw new Error(res?.message || "Failed to upload images");
        }
    } catch (error) {
        toast.add({
            title: "Error",
            description: error.message,
            color: "red",
        });
    }
}

// Delete image
async function deleteImage(imageId) {
    try {
        const res = await api(`/cars/${carId}/images/${imageId}`, {
            method: "DELETE",
        });

        if (res?.status === "success") {
            toast.add({
                title: "Success",
                description: "Image deleted successfully",
                color: "green",
            });
            await refresh();
        } else {
            throw new Error(res?.message || "Failed to delete image");
        }
    } catch (error) {
        toast.add({
            title: "Error",
            description: error.message,
            color: "red",
        });
    }
}

// Confirm delete car
function confirmDelete() {
    // Safety check - ensure car data is loaded
    if (!car.value || !car.value.make || !car.value.model) {
        toast.add({
            title: "Error",
            description: "Car data not loaded yet",
            color: "red",
        });
        return;
    }

    showDeleteModal.value = true;
}

// Delete car
async function deleteCar() {
    try {
        const res = await api(`/cars/${carId}`, {
            method: "DELETE",
        });

        if (res?.status === "success") {
            toast.add({
                title: "Success",
                description: "Car deleted successfully",
                color: "green",
            });
            router.push("/admin/list-cars");
        } else {
            throw new Error(res?.message || "Failed to delete car");
        }
    } catch (error) {
        toast.add({
            title: "Error",
            description: error.message,
            color: "red",
        });
    }
}

// Utility functions
function formatPrice(value) {
    const number = Number(value);
    if (Number.isNaN(number)) return String(value);
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(number);
}

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
}

function statusColor(status) {
    switch ((status || "").toLowerCase()) {
        case "available":
            return "green";
        case "sold":
            return "red";
        case "reserved":
            return "yellow";
        default:
            return "gray";
    }
}

function getImageSrc(image) {
    if (typeof image === "string") {
        if (image.startsWith("http") || image.startsWith("data:")) return image;
        return `data:image/jpeg;base64,${image}`;
    }

    if (image.image_data) {
        if (typeof image.image_data === "string") {
            if (image.image_data.startsWith("data:")) return image.image_data;
            return `data:image/jpeg;base64,${image.image_data}`;
        }

        if (
            image.image_data.type === "Buffer" &&
            Array.isArray(image.image_data.data)
        ) {
            if (process.client) {
                const bytes = new Uint8Array(image.image_data.data);
                const blob = new Blob([bytes], { type: "image/jpeg" });
                return URL.createObjectURL(blob);
            }
        }
    }

    return null;
}
</script>
