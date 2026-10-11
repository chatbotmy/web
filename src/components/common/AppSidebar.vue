<template>
  <aside 
    :class="[
      'w-64 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-5 transition-all duration-200 border-r border-gray-200 flex-shrink-0',
      theme === 'white' ? 'bg-white' : 'bg-[#EDF2FE]'
    ]"
  >
    <!-- Top Section -->
    <div>
      <!-- Brand & Collapse -->
      <div class="flex items-center justify-between mb-8">
        <h2 class="font-bold text-gray-900 text-lg tracking-tight">Sistem Chatbot</h2>
        <button class="text-gray-500 hover:text-gray-800 p-1 rounded hover:bg-black/5 transition" title="Collapse">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      <!-- User Chat History Mode -->
      <div v-if="mode === 'chat'">
        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Riwayat Percakapan
        </div>
        <div class="text-xs text-gray-400 font-medium mb-3">Chats</div>

        <div class="space-y-2">
          <!-- Active Session -->
          <div 
            class="bg-white rounded-xl p-3 shadow-sm border border-blue-100 cursor-pointer relative"
          >
            <div class="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r"></div>
            <div class="font-medium text-sm text-gray-900 pl-2">Sesi saat ini</div>
            <div class="text-xs text-gray-400 pl-2 mt-0.5">Hari ini</div>
          </div>

          <!-- Other Chat History -->
          <button 
            v-for="item in ['IT Policy', 'Prosedur membawa laptop ke rumah', 'Company profile perusahaan']"
            :key="item"
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white/60 rounded-lg transition"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <!-- Admin Panel Mode -->
      <div v-else-if="mode === 'admin'">
        <div class="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
          Admin Panel
        </div>

        <nav class="space-y-1.5">
          <router-link
            to="/admin/metrics"
            v-slot="{ isActive }"
          >
            <div 
              :class="[
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer',
                isActive ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <span>Metrik Sistem</span>
            </div>
          </router-link>

          <router-link
            to="/admin/roles"
            v-slot="{ isActive }"
          >
            <div 
              :class="[
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer',
                isActive ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <span>Manajemen Peran</span>
            </div>
          </router-link>

          <router-link
            to="/admin/documents"
            v-slot="{ isActive }"
          >
            <div 
              :class="[
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer',
                isActive ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>Dokumen</span>
            </div>
          </router-link>

          <router-link
            to="/admin/master-permissions"
            v-slot="{ isActive }"
          >
            <div 
              :class="[
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer',
                isActive ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
              <span>Master Izin Akses</span>
            </div>
          </router-link>

          <router-link
            to="/admin/master-classifications"
            v-slot="{ isActive }"
          >
            <div 
              :class="[
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer',
                isActive ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              <span>Master Klasifikasi</span>
            </div>
          </router-link>
        </nav>
      </div>

      <!-- Audit Mode -->
      <div v-else-if="mode === 'audit'">
        <div class="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
          Audit Sistem
        </div>

        <nav class="space-y-1.5">
          <router-link
            to="/audit/logs"
            v-slot="{ isActive }"
          >
            <div 
              :class="[
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer',
                isActive ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <span>Log Audit</span>
            </div>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Bottom Action: Keluar Button -->
    <div class="pt-4">
      <button 
        @click="logout"
        class="w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm transition"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <span>Keluar</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  mode: {
    type: String,
    default: 'admin', // 'chat' | 'admin' | 'audit'
  },
  theme: {
    type: String,
    default: 'blue', // 'blue' | 'white'
  },
})

const router = useRouter()

function logout() {
  router.push('/login')
}
</script>
