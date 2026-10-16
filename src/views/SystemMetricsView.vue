<template>
  <div class="h-screen bg-white flex flex-col overflow-hidden">
    <!-- Navbar -->
    <AppNavbar variant="default" :show-top-logout="true" @toggle-sidebar="mobileDrawerOpen = !mobileDrawerOpen" />

    <!-- Body Layout -->
    <div class="flex flex-1 overflow-hidden relative">
      <!-- Sidebar (Dynamic Admin or Audit) -->
      <AppSidebar 
        :mode="sidebarMode" 
        theme="blue" 
        :is-open-mobile="mobileDrawerOpen"
        @close-mobile="mobileDrawerOpen = false"
      />

      <!-- Main Content -->
      <main class="flex-1 bg-white p-6 md:p-10 overflow-y-auto h-full">
        <div class="max-w-6xl mx-auto">
          <!-- Page Header -->
          <div class="mb-8 text-left">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Metrik Sistem</h1>
            <p class="text-gray-500 text-sm mt-1">Pemantauan kesehatan infrastruktur server dan layanan AI Chatbot</p>
          </div>

          <!-- 6 Metrics Cards Grid (Seragam dengan Soft Blue Overlay Icon) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Card 1: Active user -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-xs font-semibold text-gray-500">Pengguna Aktif</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">245</div>
                </div>
              </div>
              <div class="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            </div>

            <!-- Card 2: Database Status -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2zm0 3c4.41 0 8 1.34 8 2.5S16.41 10 12 10s-8-1.34-8-2.5S7.59 5 12 5zm8 12.5c0 1.16-3.59 2.5-8 2.5s-8-1.34-8-2.5V15c1.78 1.22 4.8 2 8 2s6.22-.78 8-2v2.5zm0-4.5c0 1.16-3.59 2.5-8 2.5s-8-1.34-8-2.5V10.5c1.78 1.22 4.8 2 8 2s6.22-.78 8-2V13z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-xs font-semibold text-gray-500">Status Basis Data</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">Online</div>
                </div>
              </div>
              <div class="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            </div>

            <!-- Card 3: Vector DB -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2a4 4 0 0 0-4 4c0 .73.2 1.41.54 2H7a4 4 0 0 0-4 4c0 1.85 1.28 3.41 3 3.86V17a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-1.14c1.72-.45 3-2.01 3-3.86a4 4 0 0 0-4-4h-1.54c.34-.59.54-1.27.54-2a4 4 0 0 0-4-4z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-xs font-semibold text-gray-500">Vektor Embeddings</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">Healthy</div>
                </div>
              </div>
              <div class="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            </div>

            <!-- Card 4: LLM Service -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2a1 1 0 0 1 1 1v1h2a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1V7a3 3 0 0 1 3-3h2V3a1 1 0 0 1 1-1zm5 5H7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-8 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-6 5h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-xs font-semibold text-gray-500">Layanan Model AI</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">Running</div>
                </div>
              </div>
              <div class="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            </div>

            <!-- Card 5: Avg Response Time -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-xs font-semibold text-gray-500">Rerata Respon Bot</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">1.8 Detik</div>
                </div>
              </div>
              <div class="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            </div>

            <!-- Card 6: Documents Indexed -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-xs font-semibold text-gray-500">Dokumen Terindeks</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">1,247</div>
                </div>
              </div>
              <div class="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import { authState } from '../stores/authStore'

const mobileDrawerOpen = ref(false)
const sidebarMode = computed(() => {
  return authState.currentUser?.roleType === 'auditor' ? 'audit' : 'admin'
})
</script>
