<template>
  <div class="h-screen bg-white flex flex-col overflow-hidden">
    <!-- Navbar -->
    <AppNavbar variant="default" :show-top-logout="true" @toggle-sidebar="mobileDrawerOpen = !mobileDrawerOpen" />

    <!-- Body Layout -->
    <div class="flex flex-1 overflow-hidden relative">
      <!-- Audit Sidebar (L-024) -->
      <AppSidebar 
        mode="audit" 
        theme="blue" 
        :is-open-mobile="mobileDrawerOpen"
        @close-mobile="mobileDrawerOpen = false"
      />

      <!-- Main Content Area -->
      <main class="flex-1 bg-white p-6 md:p-10 overflow-y-auto h-full text-left">
        <div class="max-w-6xl mx-auto">
          <!-- Page Header -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Log Audit Sistem</h1>
              <p class="text-gray-500 text-sm mt-1">Pantau dan tinjau semua aktivitas pengguna untuk kepatuhan dan keamanan</p>
            </div>

            <!-- Export Log Button (Functional CSV Export) -->
            <button 
              @click="onExport"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer self-start md:self-auto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span>Ekspor Csv</span>
            </button>
          </div>

          <!-- 4 Summary Stat Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500">Total Log</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{{ totalCount }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">Aktivitas terekam</div>
              </div>
              <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500">Berhasil</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{{ successCount }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">Operasi normal</div>
              </div>
              <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500">Gagal</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{{ failCount }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">Akses ditolak / error</div>
              </div>
              <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500">Peringatan</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{{ warnCount }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">Perlu perhatian</div>
              </div>
              <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Search & Filter Controls (Requested: Select Option Dropdown) -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <!-- Search Bar -->
            <div class="relative flex-1 max-w-md">
              <input 
                v-model="auditState.searchQuery"
                type="text" 
                placeholder="Cari berdasarkan nama, aksi, atau IP..."
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            <!-- Filter Status Dropdown (Select Option as requested) -->
            <div class="flex items-center gap-2.5">
              <label class="text-xs font-medium text-gray-500 whitespace-nowrap">Filter Status:</label>
              <select 
                v-model="auditState.activeFilter"
                class="bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs min-w-[130px]"
              >
                <option value="Semua">Semua Status</option>
                <option value="Berhasil">✓ Berhasil</option>
                <option value="Gagal">✕ Gagal</option>
                <option value="Warning">⚠ Warning</option>
              </select>
            </div>
          </div>

          <!-- Logs Table with Interactive Column Sorting -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-gray-700">
                <thead>
                  <tr class="border-b border-gray-200 text-xs font-bold text-gray-700 select-none">
                    <!-- Sortable Timestamp Column -->
                    <th 
                      @click="toggleSort('timestamp')"
                      class="pb-4 font-bold cursor-pointer hover:text-blue-600 transition"
                      title="Klik untuk mengurutkan waktu"
                    >
                      <div class="flex items-center gap-1.5">
                        <span>Timestamp</span>
                        <span class="text-xs text-gray-400 font-mono">
                          {{ sortField === 'timestamp' ? (sortAsc ? '↑' : '↓') : '↕' }}
                        </span>
                      </div>
                    </th>

                    <!-- Sortable User Column -->
                    <th 
                      @click="toggleSort('user')"
                      class="pb-4 font-bold cursor-pointer hover:text-blue-600 transition"
                      title="Klik untuk mengurutkan nama"
                    >
                      <div class="flex items-center gap-1.5">
                        <span>User</span>
                        <span class="text-xs text-gray-400 font-mono">
                          {{ sortField === 'user' ? (sortAsc ? '↑' : '↓') : '↕' }}
                        </span>
                      </div>
                    </th>

                    <!-- Sortable Action Column -->
                    <th 
                      @click="toggleSort('action')"
                      class="pb-4 font-bold cursor-pointer hover:text-blue-600 transition"
                      title="Klik untuk mengurutkan aksi"
                    >
                      <div class="flex items-center gap-1.5">
                        <span>Aksi</span>
                        <span class="text-xs text-gray-400 font-mono">
                          {{ sortField === 'action' ? (sortAsc ? '↑' : '↓') : '↕' }}
                        </span>
                      </div>
                    </th>

                    <th class="pb-4 font-bold">Detail</th>
                    <th class="pb-4 font-bold">IP Address</th>

                    <!-- Sortable Status Column -->
                    <th 
                      @click="toggleSort('status')"
                      class="pb-4 font-bold text-center cursor-pointer hover:text-blue-600 transition"
                      title="Klik untuk mengurutkan status"
                    >
                      <div class="flex items-center justify-center gap-1.5">
                        <span>Status</span>
                        <span class="text-xs text-gray-400 font-mono">
                          {{ sortField === 'status' ? (sortAsc ? '↑' : '↓') : '↕' }}
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr 
                    v-for="log in paginatedLogs" 
                    :key="log.id"
                    class="hover:bg-blue-50/30 transition"
                  >
                    <td class="py-4 text-xs text-gray-500 whitespace-nowrap">{{ log.timestamp }}</td>
                    <td class="py-4 font-semibold text-gray-900 whitespace-nowrap">
                      <div>{{ log.user }}</div>
                      <div class="text-[11px] text-gray-400 font-normal">@{{ log.username }}</div>
                    </td>
                    <td class="py-4 whitespace-nowrap">
                      <span class="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100/80 rounded-lg text-xs font-medium">
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
                          class="px-2 py-0.5 bg-blue-50/60 text-blue-700 border border-blue-100 rounded-md text-[10px] font-medium"
                        >
                          📄 {{ d }}
                        </span>
                      </div>
                    </td>
                    <td class="py-4 text-xs font-mono text-gray-600 whitespace-nowrap">{{ log.ipAddress }}</td>
                    <td class="py-4 text-center whitespace-nowrap">
                      <span 
                        :class="[
                          'px-2.5 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 border',
                          getStatusColor(log.status)
                        ]"
                      >
                        <span :class="['w-1.5 h-1.5 rounded-full', log.status === 'Berhasil' ? 'bg-emerald-500' : log.status === 'Gagal' ? 'bg-rose-500' : 'bg-amber-500']"></span>
                        <span>{{ log.status }}</span>
                      </span>
                    </td>
                  </tr>

                  <!-- Empty state row -->
                  <tr v-if="sortedAndFilteredLogs.length === 0">
                    <td colspan="6" class="py-8 text-center text-sm text-gray-400">
                      Tidak ada log yang sesuai dengan filter atau kata kunci pencarian.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination Controls -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <div class="flex items-center gap-3">
                <span>Menampilkan {{ startLogIndex }} - {{ endLogIndex }} dari {{ totalLogs }} log</span>
                <div class="flex items-center gap-1.5 ml-2">
                  <label class="text-gray-400">Per halaman:</label>
                  <select 
                    v-model="pageSize" 
                    @change="currentPage = 1"
                    class="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                  </select>
                </div>
              </div>

              <!-- Page Buttons -->
              <div class="flex items-center gap-1.5">
                <button 
                  @click="currentPage--" 
                  :disabled="currentPage === 1"
                  class="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition font-medium"
                >
                  Sebelumnya
                </button>
                <div class="flex items-center gap-1">
                  <button 
                    v-for="p in totalPages" 
                    :key="p"
                    @click="currentPage = p"
                    :class="[
                      'w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center',
                      currentPage === p ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                    ]"
                  >
                    {{ p }}
                  </button>
                </div>
                <button 
                  @click="currentPage++" 
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition font-medium"
                >
                  Selanjutnya
                </button>
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
import { auditState, downloadLogsAsCsv } from '../stores/auditStore'

const mobileDrawerOpen = ref(false)
const sortField = ref('timestamp')
const sortAsc = ref(false) // Default newest first

const totalCount = computed(() => auditState.logs.length)
const successCount = computed(() => auditState.logs.filter((l) => l.status === 'Berhasil').length)
const failCount = computed(() => auditState.logs.filter((l) => l.status === 'Gagal').length)
const warnCount = computed(() => auditState.logs.filter((l) => l.status === 'Warning').length)

function toggleSort(field) {
  if (sortField.value === field) {
    sortAsc.value = !sortAsc.value
  } else {
    sortField.value = field
    sortAsc.value = true
  }
}

const sortedAndFilteredLogs = computed(() => {
  let list = [...auditState.logs]
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

  // Sorting
  list.sort((a, b) => {
    let valA = a[sortField.value] || ''
    let valB = b[sortField.value] || ''
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()

    if (valA < valB) return sortAsc.value ? -1 : 1
    if (valA > valB) return sortAsc.value ? 1 : -1
    return 0
  })

  return list
})

const currentPage = ref(1)
const pageSize = ref(5)

const totalLogs = computed(() => sortedAndFilteredLogs.value.length)
const totalPages = computed(() => Math.ceil(totalLogs.value / pageSize.value) || 1)

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedAndFilteredLogs.value.slice(start, start + pageSize.value)
})

const startLogIndex = computed(() => {
  if (totalLogs.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const endLogIndex = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalLogs.value)
})

function getStatusColor(status) {
  switch (status) {
    case 'Berhasil':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Gagal':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'Warning':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

function onExport() {
  downloadLogsAsCsv(sortedAndFilteredLogs.value, 'audit_log_filtered.csv')
}
</script>
