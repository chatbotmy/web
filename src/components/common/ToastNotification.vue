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
      class="fixed top-6 right-6 z-50 bg-white border border-gray-100 rounded-2xl p-4 shadow-xl shadow-blue-500/5 min-w-[280px] max-w-sm pointer-events-auto flex items-start gap-3"
    >
      <!-- Blue Status Icon -->
      <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
      </div>

      <div class="flex-1 text-left">
        <h4 class="font-bold text-gray-900 text-xs tracking-tight">{{ toastState.title }}</h4>
        <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ toastState.message }}</p>
      </div>

      <button 
        @click="hideToast"
        class="text-gray-400 hover:text-gray-700 transition p-1 rounded-lg hover:bg-gray-50 cursor-pointer -mr-1 -mt-1"
        title="Tutup Notifikasi"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { toastState, hideToast } from '../../stores/toastStore'
</script>
