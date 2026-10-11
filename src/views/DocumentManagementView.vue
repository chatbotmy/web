<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Navbar -->
    <AppNavbar variant="default" :show-top-logout="true" />

    <!-- Body Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Admin Sidebar -->
      <AppSidebar mode="admin" theme="blue" />

      <!-- Main Content Area -->
      <main class="flex-1 bg-white p-8 md:p-10 overflow-y-auto relative text-left">
        <div class="max-w-6xl mx-auto">
          <!-- Page Header & Action Buttons (L-017) -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Dokumen</h1>
              <p class="text-gray-500 text-sm mt-1">Daftar dokumen internal dan klasifikasi</p>
            </div>

            <div class="flex items-center gap-3">
              <!-- Refresh Index Button -->
              <button 
                @click="onRefreshIndex"
                class="px-4 py-2.5 bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-xs transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>Refresh Index</span>
              </button>

              <!-- Tambah Dokumen Button -->
              <button 
                @click="documentState.showAddModal = true"
                class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Tambah Dokumen</span>
              </button>
            </div>
          </div>

          <!-- Document Table Container -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <!-- Search Bar (L-022) -->
            <div class="flex justify-end mb-6">
              <div class="relative w-full max-w-xs">
                <input 
                  v-model="documentState.searchQuery"
                  type="text" 
                  placeholder="Cari dokumen"
                  class="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>

            <!-- Documents Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-gray-700">
                <thead>
                  <tr class="border-b border-gray-200 text-xs font-bold text-gray-900">
                    <th class="pb-4 font-bold">Nama Dokumen</th>
                    <th class="pb-4 font-bold">Tipe</th>
                    <th class="pb-4 font-bold">Ukuran</th>
                    <th class="pb-4 font-bold">Klasifikasi</th>
                    <th class="pb-4 font-bold">Tanggal upload</th>
                    <th class="pb-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr 
                    v-for="doc in filteredDocuments" 
                    :key="doc.id"
                    class="hover:bg-gray-50/80 transition"
                  >
                    <!-- Nama Dokumen with Document Icon -->
                    <td class="py-4 font-medium text-gray-900 flex items-center gap-2.5">
                      <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span>{{ doc.name }}</span>
                    </td>
                    <td class="py-4 text-gray-600 font-normal">{{ doc.type }}</td>
                    <td class="py-4 text-gray-600 font-normal">{{ doc.size }}</td>
                    <!-- Klasifikasi Badge -->
                    <td class="py-4">
                      <span :class="['px-3.5 py-1 rounded-full text-xs font-medium', getBadgeColor(doc.classification)]">
                        {{ doc.classification }}
                      </span>
                    </td>
                    <td class="py-4 text-gray-600 font-normal">{{ doc.uploadDate }}</td>
                    <!-- Aksi Icons (Eye & Trash) -->
                    <td class="py-4 text-center">
                      <div class="flex items-center justify-center gap-3">
                        <button class="text-gray-600 hover:text-gray-900 transition p-1" title="Lihat Dokumen">
                          <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        <button 
                          @click="onDelete(doc.id)"
                          class="text-red-500 hover:text-red-700 transition p-1" 
                          title="Hapus Dokumen"
                        >
                          <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Empty state when searching -->
              <div v-if="filteredDocuments.length === 0" class="text-center py-8 text-gray-400 text-sm">
                Dokumen tidak ditemukan dengan kata kunci "{{ documentState.searchQuery }}"
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Tambah Dokumen (L-020) -->
        <div 
          v-if="documentState.showAddModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        >
          <div class="bg-white rounded-2xl p-7 max-w-lg w-full text-left shadow-2xl relative">
            <button 
              @click="documentState.showAddModal = false"
              class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <form @submit.prevent="submitAddDoc" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Upload dokumen</label>
                <!-- Upload Box Matching L-020 -->
                <div class="w-full bg-[#E5E7EB] hover:bg-gray-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer text-gray-600 transition">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  <input 
                    v-model="newDocForm.name"
                    type="text" 
                    placeholder="Upload dokumen (misal: SOP-2025.pdf)"
                    class="bg-transparent border-none text-sm w-full focus:outline-none text-gray-700 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Klasifikasi</label>
                <input 
                  v-model="newDocForm.classification"
                  type="text" 
                  placeholder="Masukkan klasifikasi dokumen"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <!-- Teal Button (L-020 Tambah Dokumen) -->
              <button 
                type="submit"
                class="w-full mt-4 bg-[#008ba3] hover:bg-[#007b91] text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm"
              >
                Tambah Dokumen
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import { documentState, addDocument, deleteDocument, refreshIndex } from '../stores/documentStore'

const newDocForm = reactive({
  name: 'Pedoman Kerja 2025.pdf',
  classification: 'Public',
})

const filteredDocuments = computed(() => {
  if (!documentState.searchQuery) return documentState.documents
  const q = documentState.searchQuery.toLowerCase()
  return documentState.documents.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.classification.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q)
  )
})

function getBadgeColor(name) {
  switch (name) {
    case 'Public':
      return 'bg-[#FEF9C3] text-[#713F12]'
    case 'Finance':
      return 'bg-[#EDE9FE] text-[#5B21B6]'
    case 'HR':
      return 'bg-[#DCFCE7] text-[#14532D]'
    case 'Legal':
      return 'bg-[#E0F2FE] text-[#075985]'
    case 'IT':
      return 'bg-[#FAE8FF] text-[#701A75]'
    case 'Sales':
      return 'bg-[#FFEDD5] text-[#7C2D12]'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function submitAddDoc() {
  addDocument({
    name: newDocForm.name,
    type: newDocForm.name.endsWith('.xlsx') ? 'XLSX' : 'PDF',
    size: '2.1  MB',
    classification: newDocForm.classification,
  })
}

function onDelete(id) {
  deleteDocument(id)
}

function onRefreshIndex() {
  refreshIndex()
}
</script>
