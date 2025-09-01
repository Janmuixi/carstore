<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <!-- Modal Content -->
        <div
          class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ title }}
            </h3>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4">
            <p class="text-gray-600">
              {{ description }}
            </p>
          </div>
          
          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
            <UButton
              color="gray"
              variant="soft"
              @click="handleCancel"
            >
              Cancel
            </UButton>
            <UButton
              :color="confirmColor"
              @click="handleConfirm"
            >
              {{ confirmLabel }}
            </UButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  confirmLabel: {
    type: String,
    default: 'Confirm'
  },
  confirmColor: {
    type: String,
    default: 'primary'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}

const handleBackdropClick = () => {
  emit('cancel')
  emit('close')
}
</script>
