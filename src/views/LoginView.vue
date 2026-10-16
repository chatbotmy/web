<template>
  <div class="min-h-screen bg-[#EDF2FE] flex flex-col justify-center items-center p-4">
    <!-- Login Card Matching L-001 -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 max-w-md w-full text-left">
      <!-- Robot Logo -->
      <div class="flex justify-center mb-4">
        <div class="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
          <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M12 2a1 1 0 0 1 1 1v1h2a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1V7a3 3 0 0 1 3-3h2V3a1 1 0 0 1 1-1zm5 5H7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-8 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-6 5h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5z"/>
          </svg>
        </div>
      </div>

      <!-- Heading -->
      <h1 class="text-2xl font-bold text-gray-900 text-center tracking-tight">Chatbot Aman & Cerdas</h1>
      <p class="text-sm text-gray-500 text-center mt-1 mb-6">Sistem Dokumen Internal</p>

      <!-- Role Selection Pill Tabs (Demo Options) -->
      <div class="mb-5">
        <label class="block text-xs font-semibold text-gray-500 tracking-wider mb-2">
          Pilih Peran Akses (Demo)
        </label>
        <div class="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-xl">
          <button 
            type="button"
            @click="selectRoleTab('user')"
            :class="[
              'py-2 px-2 text-xs font-semibold rounded-lg transition text-center truncate',
              selectedRoleKey === 'user' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Karyawan
          </button>
          <button 
            type="button"
            @click="selectRoleTab('admin')"
            :class="[
              'py-2 px-2 text-xs font-semibold rounded-lg transition text-center truncate',
              selectedRoleKey === 'admin' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Admin
          </button>
          <button 
            type="button"
            @click="selectRoleTab('auditor')"
            :class="[
              'py-2 px-2 text-xs font-semibold rounded-lg transition text-center truncate',
              selectedRoleKey === 'auditor' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Auditor
          </button>
        </div>
      </div>

      <!-- Quick Auto-Fill Helper Pill -->
      <div class="mb-4 bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 flex items-center justify-between text-xs">
        <div class="text-blue-800">
          <span class="font-medium text-gray-500">Demo: </span>
          <span class="font-semibold text-blue-900">{{ currentDemoInfo.username }}</span> / 
          <span class="font-mono text-gray-600">{{ currentDemoInfo.password }}</span>
        </div>
        <button 
          type="button"
          @click="autoFillDemo"
          class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-xs shadow-2xs transition active:scale-95 cursor-pointer"
        >
          Isi Otomatis
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-1.5">Username</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="Masukkan username"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-1.5">Password</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Masukkan password"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-11 transition"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-700 transition"
              title="Toggle password"
            >
              <!-- Eye / Eye-off icon matching screenshot L-001 & L-002 -->
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Error Alert (L-003) -->
        <div 
          v-if="hasError" 
          class="bg-red-100 text-red-600 rounded-xl p-3 text-sm text-center font-medium transition"
        >
          Login gagal, username atau password salah
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm mt-2"
        >
          Masuk
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authState, loginWithCredentials } from '../stores/authStore'

const router = useRouter()
const selectedRoleKey = ref('user')
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const hasError = ref(false)

const currentDemoInfo = computed(() => {
  return authState.demoAccounts[selectedRoleKey.value] || authState.demoAccounts.user
})

function selectRoleTab(roleKey) {
  selectedRoleKey.value = roleKey
  autoFillDemo()
}

function autoFillDemo() {
  const demo = currentDemoInfo.value
  username.value = demo.username
  password.value = demo.password
  hasError.value = false
}

// Initial autofill on load with user
onMounted(() => {
  autoFillDemo()
})

function handleLogin() {
  hasError.value = false

  if (username.value.toLowerCase() === 'error' || password.value.toLowerCase() === 'salah') {
    hasError.value = true
    return
  }

  const redirectUrl = loginWithCredentials(username.value, password.value)

  if (redirectUrl) {
    router.push(redirectUrl)
  } else {
    hasError.value = true
  }
}
</script>
