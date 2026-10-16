<template>
  <header class="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
    <!-- Brand / Title & Mobile Hamburger Button -->
    <div class="flex items-center gap-3">
      <!-- Mobile hamburger toggle button -->
      <button 
        @click="$emit('toggle-sidebar')"
        class="p-2 -ml-1 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 md:hidden transition"
        title="Buka Menu"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
        <!-- Robot Face Icon Matching Design -->
        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2a1 1 0 0 1 1 1v1h2a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1V7a3 3 0 0 1 3-3h2V3a1 1 0 0 1 1-1zm5 5H7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-8 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-6 5h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5z"/>
        </svg>
      </div>
      <span class="font-bold text-lg md:text-xl text-gray-900 tracking-tight truncate max-w-[200px] md:max-w-none">
        {{ titleText }}
      </span>
    </div>

    <!-- Right: Clean Profile Popup with Logout -->
    <div class="relative" ref="dropdownRef">
      <button 
        @click="isOpen = !isOpen"
        class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition focus:outline-none cursor-pointer"
      >
        <div 
          :class="[
            'w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0',
            variant === 'auditor' ? 'bg-zinc-800 text-white' : 'bg-blue-100 text-blue-700'
          ]"
        >
          {{ userInitial }}
        </div>
        <div class="hidden sm:flex flex-col text-left">
          <span class="text-sm font-semibold text-gray-900 leading-tight">{{ userName }}</span>
          <span class="text-xs text-gray-500 leading-tight">{{ userRole }}</span>
        </div>
        <svg 
          :class="['w-4 h-4 text-gray-400 transition-transform duration-200 hidden sm:block', isOpen ? 'rotate-180' : '']" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Clean & Essential Profile Popup (Not Overkill) -->
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div 
          v-if="isOpen" 
          class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 text-left"
        >
          <!-- User info -->
          <div class="px-3 py-2.5 bg-gray-50 rounded-xl mb-1.5">
            <p class="text-xs text-gray-400 font-medium">Masuk Sebagai</p>
            <p class="text-sm font-bold text-gray-900 truncate">{{ userName }}</p>
            <p class="text-xs text-blue-600 font-semibold mt-0.5">{{ userRole }}</p>
          </div>

          <!-- Clean Logout Button -->
          <button 
            @click="handleLogout"
            class="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition text-left cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Keluar Akun</span>
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { authState, logoutUser } from '../../stores/authStore'

const props = defineProps({
  variant: {
    type: String,
    default: 'default', // 'default' | 'auditor'
  },
  showTopLogout: {
    type: Boolean,
    default: true,
  },
  titleOverride: {
    type: String,
    default: '',
  },
})

defineEmits(['toggle-sidebar'])

const router = useRouter()
const isOpen = ref(false)
const dropdownRef = ref(null)

const titleText = computed(() => {
  if (props.titleOverride) return props.titleOverride
  if (props.variant === 'auditor') return 'Chatbot Cerdas & Aman'
  return 'Chatbot Aman & Cerdas'
})

const userName = computed(() => authState.currentUser.name)
const userRole = computed(() => authState.currentUser.role)
const userInitial = computed(() => authState.currentUser.initial)

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleLogout() {
  isOpen.value = false
  logoutUser()
  router.push('/login')
}
</script>
