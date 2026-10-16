<template>
  <div v-if="confirmState.visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Static / Smooth Fade Backdrop ONLY (No scaling!) -->
    <div 
      @click="handleCancel"
      class="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
    ></div>

    <!-- Dialog Card with scale transition -->
    <transition
      appear
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div class="relative bg-white rounded-2xl p-6 max-w-sm w-full text-left shadow-2xl border border-gray-100 z-10">
        <!-- Warning Icon -->
        <div class="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>

        <h3 class="text-base font-bold text-gray-900 tracking-tight">{{ confirmState.title }}</h3>
        <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">{{ confirmState.message }}</p>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-2.5 mt-6">
          <button 
            type="button"
            @click="handleCancel"
            class="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
          >
            Batal
          </button>
          <button 
            type="button"
            @click="handleConfirm"
            class="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition shadow-xs cursor-pointer"
          >
            {{ confirmState.confirmText }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { confirmState, handleConfirm, handleCancel } from '../../stores/confirmStore'
</script>
