<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Navbar -->
    <AppNavbar variant="default" :show-top-logout="true" />

    <!-- Body Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Admin Sidebar -->
      <AppSidebar mode="admin" theme="blue" />

      <!-- Main Content -->
      <main class="flex-1 bg-white p-8 md:p-10 overflow-y-auto">
        <div class="max-w-6xl mx-auto">
          <!-- Page Header -->
          <div class="mb-8 text-left">
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Metrik Sistem</h1>
          </div>

          <!-- 6 Metrics Cards Grid (Matching L-023 Lihat Dasbor Kesehatan Sistem.png) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Card 1: Active user -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-sm font-semibold text-gray-900">Active user</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">245</div>
                </div>
              </div>
              <!-- Green Check Pill -->
              <div class="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>

            <!-- Card 2: Database Status -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2zm0 3c4.41 0 8 1.34 8 2.5S16.41 10 12 10s-8-1.34-8-2.5S7.59 5 12 5zm8 12.5c0 1.16-3.59 2.5-8 2.5s-8-1.34-8-2.5V15c1.78 1.22 4.8 2 8 2s6.22-.78 8-2v2.5zm0-4.5c0 1.16-3.59 2.5-8 2.5s-8-1.34-8-2.5V10.5c1.78 1.22 4.8 2 8 2s6.22-.78 8-2V13z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-sm font-semibold text-gray-900">Database Status</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">Online</div>
                </div>
              </div>
              <div class="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>

            <!-- Card 3: Vector DB -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2a4 4 0 0 0-4 4c0 .73.2 1.41.54 2H7a4 4 0 0 0-4 4c0 1.85 1.28 3.41 3 3.86V17a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-1.14c1.72-.45 3-2.01 3-3.86a4 4 0 0 0-4-4h-1.54c.34-.59.54-1.27.54-2a4 4 0 0 0-4-4z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-sm font-semibold text-gray-900">Vector DB</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">Healthy</div>
                </div>
              </div>
              <div class="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>

            <!-- Card 4: LLM Service -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0">
                  <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2a1 1 0 0 1 1 1v1h2a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1V7a3 3 0 0 1 3-3h2V3a1 1 0 0 1 1-1zm5 5H7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-8 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-6 5h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-sm font-semibold text-gray-900">LLM Service</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">Running</div>
                </div>
              </div>
              <div class="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>

            <!-- Card 5: Avg Response Time -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-sm font-semibold text-gray-900">Avg Response Time</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">2.3 s</div>
                </div>
              </div>
              <div class="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>

            <!-- Card 6: Documents Indexed -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-lime-100 text-lime-600 flex items-center justify-center flex-shrink-0">
                  <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="text-sm font-semibold text-gray-900">Documents Indexed</div>
                  <div class="text-2xl font-bold text-gray-900 mt-0.5">1,247</div>
                </div>
              </div>
              <div class="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
</script>
