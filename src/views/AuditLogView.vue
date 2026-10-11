<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Navbar -->
    <AppNavbar variant="default" :show-top-logout="true" />

    <!-- Body Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Audit Sidebar (L-024) -->
      <AppSidebar mode="audit" theme="blue" />

      <!-- Main Content Area -->
      <main class="flex-1 bg-white p-8 md:p-10 overflow-y-auto text-left">
        <div class="max-w-6xl mx-auto">
          <!-- Page Header -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Log Audit Sistem</h1>
              <p class="text-gray-500 text-sm mt-1">Pantau dan tinjau semua aktivitas pengguna untuk kepatuhan dan keamanan</p>
            </div>

            <!-- Export Log Button (L-024) -->
            <button 
              @click="onExport"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span>Export Log</span>
            </button>
          </div>

          <!-- 4 Summary Stat Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left">
              <div class="text-xs font-semibold text-gray-500">Total Log</div>
              <div class="text-3xl font-bold text-gray-900 mt-2">{{ totalCount }}</div>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left">
              <div class="text-xs font-semibold text-gray-500">Berhasil</div>
              <div class="text-3xl font-bold text-gray-900 mt-2">{{ successCount }}</div>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left">
              <div class="text-xs font-semibold text-gray-500">Gagal</div>
              <div class="text-3xl font-bold text-gray-900 mt-2">{{ failCount }}</div>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left">
              <div class="text-xs font-semibold text-gray-500">Warning</div>
              <div class="text-3xl font-bold text-gray-900 mt-2">{{ warnCount }}</div>
            </div>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            <!-- Search Bar -->
            <div class="relative flex-1 max-w-lg">
              <input 
                v-model="auditState.searchQuery"
                type="text" 
                placeholder="Cari log berdasarkan nama, username, dan aksi"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            <!-- Filter Buttons (Semua, Berhasil, Gagal, Warning) -->
            <div class="flex items-center gap-2">
              <button 
                @click="auditState.activeFilter = 'Semua'"
                :class="[
                  'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition',
                  auditState.activeFilter === 'Semua' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                ]"
              >
                <span>Semua</span>
              </button>

              <button 
                @click="auditState.activeFilter = 'Berhasil'"
                :class="[
                  'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border',
                  auditState.activeFilter === 'Berhasil' 
                    ? 'bg-green-50 border-green-500 text-green-700 shadow-xs' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                ]"
              >
                <span class="text-green-600 font-bold">✓</span>
                <span>Berhasil</span>
              </button>

              <button 
                @click="auditState.activeFilter = 'Gagal'"
                :class="[
                  'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border',
                  auditState.activeFilter === 'Gagal' 
                    ? 'bg-red-50 border-red-500 text-red-700 shadow-xs' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                ]"
              >
                <span class="text-red-500 font-bold">✕</span>
                <span>Gagal</span>
              </button>

              <button 
                @click="auditState.activeFilter = 'Warning'"
                :class="[
                  'px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border',
                  auditState.activeFilter === 'Warning' 
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-xs' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                ]"
              >
                <span class="text-amber-500 font-bold">⚠</span>
                <span>Warning</span>
              </button>
            </div>
          </div>

          <!-- Logs Table -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-700">
              <thead>
                <tr class="border-b border-gray-200 text-xs font-bold text-gray-900">
                  <th class="pb-4 font-bold">Timestamp</th>
                  <th class="pb-4 font-bold">User</th>
                  <th class="pb-4 font-bold">Aksi</th>
                  <th class="pb-4 font-bold">Detail</th>
                  <th class="pb-4 font-bold">IP Address</th>
                  <th class="pb-4 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr 
                  v-for="log in filteredLogs" 
                  :key="log.id"
                  class="hover:bg-gray-50/80 transition"
                >
                  <td class="py-4 text-xs text-gray-500 whitespace-nowrap">{{ log.timestamp }}</td>
                  <td class="py-4 font-semibold text-gray-900 whitespace-nowrap">{{ log.user }}</td>
                  <td class="py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                      {{ log.action }}
                    </span>
                  </td>
                  <td class="py-4 text-xs text-gray-700 max-w-xs">
                    <div>{{ log.detailText }}</div>
                    <!-- Document Pills if any -->
                    <div v-if="log.documents && log.documents.length" class="flex flex-wrap gap-1.5 mt-1.5">
                      <span 
                        v-for="d in log.documents" 
                        :key="d"
                        class="px-2 py-0.5 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded text-[10px] font-mono"
                      >
                        📄 {{ d }}
                      </span>
                    </div>
                  </td>
                  <td class="py-4 text-xs font-mono text-gray-600 whitespace-nowrap">{{ log.ipAddress }}</td>
                  <td class="py-4 text-center whitespace-nowrap">
                    <span 
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1',
                        getStatusColor(log.status)
                      ]"
                    >
                      <span>{{ log.status === 'Berhasil' ? '✓' : log.status === 'Gagal' ? '✕' : '⚠' }}</span>
                      <span>{{ log.status }}</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="filteredLogs.length === 0" class="text-center py-8 text-gray-400 text-sm">
              Tidak ada log yang sesuai dengan filter atau kata kunci saat ini.
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import { auditState, exportLogs } from '../stores/auditStore'

const totalCount = computed(() => auditState.logs.length)
const successCount = computed(() => auditState.logs.filter((l) => l.status === 'Berhasil').length)
const failCount = computed(() => auditState.logs.filter((l) => l.status === 'Gagal').length)
const warnCount = computed(() => auditState.logs.filter((l) => l.status === 'Warning').length)

const filteredLogs = computed(() => {
  let list = auditState.logs
  if (auditState.activeFilter !== 'Semua') {
    list = list.filter((l) => l.status === auditState.activeFilter)
  }
  if (auditState.searchQuery) {
    const q = auditState.searchQuery.toLowerCase()
    list = list.filter(
      (l) =>
        l.user.toLowerCase().includes(q) ||
        l.username.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.detailText.toLowerCase().includes(q) ||
        l.ipAddress.includes(q)
    )
  }
  return list
})

function getStatusColor(status) {
  switch (status) {
    case 'Berhasil':
      return 'bg-green-100 text-green-700'
    case 'Gagal':
      return 'bg-red-100 text-red-700'
    case 'Warning':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function onExport() {
  exportLogs()
}
</script>
