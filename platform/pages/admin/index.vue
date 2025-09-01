<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] p-4">
    <UCard class="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl shadow-lg">
      <UCardHeader>
        <h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-center">Admin panel</h1>
      </UCardHeader>
      <UCardBody>
        <p class="text-gray-600 mt-3 md:mt-5 text-center text-sm md:text-base">Welcome to the admin panel</p>
      </UCardBody>
      <UCardFooter>
        <p class="text-gray-500 text-center text-sm md:text-base">You can manage your application here</p>
        <div class="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mt-4 md:mt-6">
          <UButton 
            class="cursor-pointer w-full sm:w-auto" 
            color="primary" 
            @click="$router.push('/admin/new-car')"
          >
            Add new car
          </UButton>
          <UButton 
            class="cursor-pointer w-full sm:w-auto" 
            color="primary" 
            @click="$router.push('/admin/list-cars')"
          >
            View all cars
          </UButton>
          <UButton 
            class="cursor-pointer w-full sm:w-auto" 
            color="primary" 
            @click="$router.push('/admin/new-admin')"
          >
            Add new admin
          </UButton>
        </div>
      </UCardFooter>
    </UCard>
  </div>
</template>
<script setup>
definePageMeta({
  middleware: ['auth']
})
</script>