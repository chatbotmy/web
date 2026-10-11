<template>
  <header class="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
    <!-- Brand / Title -->
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
        <!-- Robot Face Icon Matching Design -->
        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2a1 1 0 0 1 1 1v1h2a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1V7a3 3 0 0 1 3-3h2V3a1 1 0 0 1 1-1zm5 5H7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-8 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-6 5h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5z"/>
        </svg>
      </div>
      <span class="font-bold text-xl text-gray-900 tracking-tight">{{ titleText }}</span>
    </div>

    <!-- Right: User Avatar & Role Info / Keluar Button -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div 
          :class="[
            'w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm',
            variant === 'auditor' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
          ]"
        >
          {{ userInitial }}
        </div>
        <div class="flex flex-col text-left">
          <span class="text-sm font-semibold text-gray-900 leading-tight">{{ userName }}</span>
          <span class="text-xs text-gray-500 leading-tight">{{ userRole }}</span>
        </div>
      </div>

      <!-- Optional Logout in Header (like Dashboard Admin 1 & Auditor views) -->
      <button 
        v-if="showTopLogout"
        @click="logout"
        class="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <span>Keluar</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authState } from '../../stores/authStore'

const props = defineProps({
  variant: {
    type: String,
    default: 'default', // 'default' | 'auditor'
  },
  showTopLogout: {
    type: Boolean,
    default: false,
  },
  titleOverride: {
    type: String,
    default: '',
  },
})

const router = useRouter()

const titleText = computed(() => {
  if (props.titleOverride) return props.titleOverride
  if (props.variant === 'auditor') return 'Chatbot Cerdas & Aman'
  return 'Chatbot Aman & Cerdas'
})

const userName = computed(() => authState.currentUser.name)
const userRole = computed(() => authState.currentUser.role)
const userInitial = computed(() => authState.currentUser.initial)

function logout() {
  router.push('/login')
}
</script>
