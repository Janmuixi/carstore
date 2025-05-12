<template>
  <div class="flex min-h-screen items-center justify-center bg-[#F5F5F5]">
      <UCard class="w-full max-w-lg p-8 shadow-lg bg-white">
          <h1 class="text-3xl font-bold text-center mb-6 text-[#1E1E1E]">
              Add a New Car
          </h1>

          <UForm
              @submit="onSubmit"
              :state="form"
              class="space-y-4 flex flex-col text-2xl"
          >
              <UFormField
                  label="Make"
                  name="make"
                  :rules="{
                      required: true,
                  }"
                  :error-messages="{
                      required: 'Make is required',
                  }"
              >
                  <template #default>
                      <UInput
                          class="w-full"
                          v-model="form.make"
                          color="secondary"
                          type="text"
                          placeholder="Enter car make"
                          variant="soft"
                          highlight
                      />
                  </template>
              </UFormField>

              <UFormField
                  label="Model"
                  name="model"
                  :rules="{
                      required: true,
                  }"
                  :error-messages="{
                      required: 'Model is required',
                  }"
              >
                  <template #default>
                      <UInput
                          class="w-full"
                          v-model="form.model"
                          color="secondary"
                          type="text"
                          placeholder="Enter car model"
                          variant="soft"
                          highlight
                      />
                  </template>
              </UFormField>

              <UFormField
                  label="Year"
                  name="year"
                  :rules="{
                      required: true,
                      numeric: true,
                      min: 1886,
                  }"
                  :error-messages="{
                      required: 'Year is required',
                      numeric: 'Year must be a number',
                      min: 'Year must be 1886 or later',
                  }"
              >
                  <template #default>
                      <UInput
                          class="w-full"
                          v-model="form.year"
                          color="secondary"
                          type="number"
                          placeholder="Enter car year"
                          variant="soft"
                          highlight
                      />
                  </template>
              </UFormField>

              <UFormField
                  label="Price"
                  name="price"
                  :rules="{
                      required: true,
                      numeric: true,
                      min: 0,
                  }"
                  :error-messages="{
                      required: 'Price is required',
                      numeric: 'Price must be a number',
                      min: 'Price must be 0 or greater',
                  }"
              >
                  <template #default>
                      <UInput
                          class="w-full"
                          v-model="form.price"
                          color="secondary"
                          type="number"
                          placeholder="Enter car price"
                          variant="soft"
                          highlight
                      />
                  </template>
              </UFormField>

              <!-- Image Upload Section -->
              <UFormField
                  label="Images"
                  name="images"
              >
                  <template #default>
                      <UInput
                          class="w-full"
                          type="file"
                          multiple
                          accept="image/*"
                          @change="onImageUpload"
                      />
                  </template>
              </UFormField>

              <!-- Display Uploaded Images -->
              <div v-if="images.length" class="mt-4">
                  <h2 class="text-lg font-semibold mb-2 text-[#1E1E1E]">Uploaded Images:</h2>
                  <div class="grid grid-cols-3 gap-4">
                      <div
                          v-for="(image, index) in images"
                          :key="index"
                          class="relative"
                      >
                          <img
                              :src="image.preview"
                              alt="Uploaded image"
                              class="w-full h-24 object-cover rounded"
                          />
                          <button
                              @click="removeImage(index)"
                              class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                          >
                              ✕
                          </button>
                      </div>
                  </div>
              </div>

              <UButton
                  type="submit"
                  variant="solid"
                  size="lg"
                  class="cursor-pointer w-full mt-4 font-semibold text-lg text-amber-50 flex items-center justify-center"
                  color="success"
              >
                  <span>Add Car</span>
              </UButton>
          </UForm>
      </UCard>
  </div>
</template>

<script setup>
onMounted(() => {
    
})
const form = reactive({
  make: "",
  model: "",
  year: "",
  price: "",
});

const images = reactive([]);

function onImageUpload(event) {
  const files = event.target.files;
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.push({
        file,
        preview: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  }
}

function removeImage(index) {
  images.splice(index, 1);
}

async function onSubmit() {
  const { make, model, year, price } = form;
  const { api } = useApiFetch();
  const formData = new FormData();

  formData.append("make", make);
  formData.append("model", model);
  formData.append("year", parseInt(year));
  formData.append("price", parseFloat(price));

  images.forEach((image, index) => {
    formData.append(`images[${index}]`, image.file);
  });

  try {
      const res = await api("/cars", {
          method: "POST",
          body: formData,
      });
      if (res.status == "success") {
          const toast = useToast();
          toast.add({
              title: "Car added",
              description: "The car has been successfully added.",
              color: "success",
          });
          const router = useRouter();
          router.push("/admin");
      }
  } catch (error) {
      const toast = useToast();
      toast.add({
          title: "Failed to add car",
          description: "An error occurred while adding the car.",
          color: "error",
      });
  }
}
</script>