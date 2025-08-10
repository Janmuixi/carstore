<template>
  <div class="flex flex-col items-center justify-center h-screen bg-[#F5F5F5]">
    <UCard class="w-120 shadow-lg">
      <UCardHeader>
        <h1 class="text-2xl font-bold">Admin panel</h1>
      </UCardHeader>
      <UCardBody>
        <p class="text-gray-600 mt-5">Welcome to the admin panel</p>
      </UCardBody>
      <UCardFooter>
        <p class="text-gray-500">You can manage your application here</p>
      </UCardFooter>
      <UCardActions class="flex justify-between gap-2 mt-10">
        <UButton class="cursor-pointer" color="primary" @click="$router.push('/admin/new-car')">
          Add new car
        </UButton>
        <UButton class="cursor-pointer" color="primary" @click="$router.push('/admin/login')">
          View all cars
        </UButton>
        <UButton class="cursor-pointer" color="primary" @click="$router.push('/admin/new-admin')">
          Add new admin
        </UButton>
      </UCardActions>
    </UCard>
  </div>
</template>
<script setup>
definePageMeta({
  middleware: ['auth']
})
</script>