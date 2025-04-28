<!-- pages/login.vue -->
<template>
    <div class="flex min-h-screen items-center justify-center bg-[#F5F5F5]">
        <UCard class="w-full max-w-md p-8 shadow-lg bg-white">
            <h1 class="text-3xl font-bold text-center mb-6 text-[#1E1E1E]">
                Welcome Back
            </h1>

            <UForm @submit="onSubmit" :state="form" class="space-y-4 flex flex-col text-2xl">
                <UFormField
                    label="Email"
                    name="email"
                    :rules="{
                        required: true,
                        email: true
                    }"
                    :error-messages="{
                        required: 'Email is required',
                        email: 'Email must be valid'
                    }"
                >
                    <template #default>
                        <UInput
                            class="w-full"
                            v-model="form.email"
                            color="secondary"
                            type="email"
                            placeholder="Type your email"
                            variant="soft"
                            highlight
                        />
                    </template>
                </UFormField>
                <UFormField
                    label="Password"
                    name="password"
                    :rules="{
                        required: true,
                        minLength: 6
                    }"
                    :error-messages="{
                        required: 'Password is required',
                        minLength: 'Password must be at least 6 characters'
                    }"
                >
                    <template #default>
                        <UInput
                            class="w-full"
                            v-model="form.password"
                            color="secondary"
                            variant="soft"
                            type="password"
                            placeholder="Type your password"
                            highlight
                        />
                    </template>
                </UFormField>
                <UButton type="submit" variant="solid" size="lg" class="w-full mt-4 font-semibold text-lg text-amber-50 flex items-center justify-center" color="error">
                    <span>Login</span>
                </UButton>
            </UForm>
        </UCard>
    </div>
</template>

<script setup lang="ts">
const form = reactive({
    email: '',
    password: ''
})

function onSubmit() {
    console.log('Logging in with:', form)
    // You would call your API here
}
</script>
