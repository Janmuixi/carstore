<template>
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
        <UCard class="w-full max-w-md p-6 sm:p-8 shadow-2xl rounded-2xl bg-white relative">

            <!-- Stylish Back Button -->
            <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost"
                class="absolute top-4 left-4 text-sm font-medium" @click="router.push('/admin')">
                Back
            </UButton>

            <!-- Form Title -->
            <h1 class="text-3xl font-extrabold text-center mb-8 text-gray-800">
                Create New Admin User
            </h1>

            <!-- Form -->
            <UForm @submit="onSubmit" :schema="schema" :state="form" class="space-y-6 text-base">
                <UFormField label="Username" name="username">
                    <template #default>
                        <UInput class="w-full" v-model="form.username" color="primary" type="text" placeholder="e.g. adminuser"
                            variant="soft" highlight />
                    </template>
                </UFormField>

                <UFormField label="Email" name="email">
                    <template #default>
                        <UInput class="w-full" v-model="form.email" color="primary" type="email" placeholder="e.g. admin@example.com"
                            variant="soft" highlight />
                    </template>
                </UFormField>

                <UFormField label="Password" name="password">
                    <template #default>
                        <UInput class="w-full" v-model="form.password" color="primary" type="password"
                            placeholder="Enter a strong password" variant="soft" highlight />
                    </template>
                </UFormField>

                <!-- Submit Button -->
                <UButton type="submit" variant="solid" size="xl"
                    class="w-full mt-6 font-semibold text-lg flex items-center justify-center" color="primary"
                    :disabled="!form.username || !form.email || !form.password">
                    Create Admin
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

const schema = v.object({
    username: v.pipe(
        v.string("Username is required"),
        v.minLength(3, "Username must be at least 3 characters")
    ),
    email: v.pipe(
        v.string("Email is required"),
        v.minLength(1, "Email is required"),
        v.email("Must be a valid email")
    ),
    password: v.pipe(
        v.string("Password is required"),
        v.minLength(8, "Password must be at least 8 characters")
    )
})

const form = reactive({
    username: "",
    email: "",
    password: "",
})

async function onSubmit() {
    const { username, email, password } = form
    const { api } = useApiFetch()
    try {
        const res = await api("/users", {
            method: "POST",
            body: { username, email, password },
        })
        if (res.status == "success") {
            const toast = useToast()
            toast.add({
                title: "Admin created",
                description: "The admin user has been successfully created.",
                color: "success",
            })
            router.push("/admin")
        }
    } catch (error) {
        const toast = useToast()
        toast.add({
            title: "Failed to create admin",
            description: "An error occurred while creating the admin user.",
            color: "error",
        })
    }
}
</script>
