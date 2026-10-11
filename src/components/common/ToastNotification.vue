<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="toastState.visible"
      class="fixed top-6 right-6 z-50 bg-white border border-gray-900 rounded-2xl p-4 shadow-xl min-w-[300px] max-w-sm pointer-events-auto"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-2">
          <!-- Info Circle Icon -->
          <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="font-bold text-gray-900 text-sm tracking-tight">{{ toastState.title }}</span>
        </div>
        <button 
          @click="hideToast"
          class="text-gray-500 hover:text-gray-900 transition p-0.5 rounded"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="mt-1 text-sm text-gray-700 pl-7 font-normal">
        {{ toastState.message }}
      </div>
    </div>
  </transition>
</template>

<script setup>
import { toastState, hideToast } from '../../stores/toastStore'
</script>
