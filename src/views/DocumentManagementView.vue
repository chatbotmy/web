<template>
  <div class="h-screen bg-white flex flex-col overflow-hidden">
    <!-- Navbar -->
    <AppNavbar variant="default" :show-top-logout="true" @toggle-sidebar="mobileDrawerOpen = !mobileDrawerOpen" />

    <!-- Body Layout -->
    <div class="flex flex-1 overflow-hidden relative">
      <!-- Admin Sidebar -->
      <AppSidebar 
        mode="admin" 
        theme="blue" 
        :is-open-mobile="mobileDrawerOpen"
        @close-mobile="mobileDrawerOpen = false"
      />

      <!-- Main Content Area -->
      <main class="flex-1 bg-white p-6 md:p-10 overflow-y-auto h-full relative text-left">
        <div class="max-w-6xl mx-auto">
          <!-- Page Header & Action Buttons -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Manajemen Dokumen</h1>
              <p class="text-gray-500 text-sm mt-1">Daftar dokumen internal dan klasifikasi keamanan basis pengetahuan AI</p>
            </div>

            <div class="flex items-center gap-3">
              <!-- Indeks Dokumen Baru Button (Realistic AI Knowledge Sync) -->
              <button 
                @click="onStartIndexing"
                :disabled="documentState.isIndexing"
                class="px-4 py-2.5 bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <svg :class="['w-4 h-4', documentState.isIndexing ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>Perbarui Pengetahuan AI</span>
              </button>

              <!-- Tambah Dokumen Button -->
              <button 
                @click="openAddModal"
                class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
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
            <!-- Search Bar -->
            <div class="flex justify-end mb-6">
              <div class="relative w-full max-w-xs">
                <input 
                  v-model="documentState.searchQuery"
                  type="text" 
                  placeholder="Cari dokumen..."
                  class="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>

            <!-- Documents Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-gray-700">
                <thead>
                  <tr class="border-b border-gray-200 text-xs font-bold text-gray-700 select-none">
                    <th 
                      @click="toggleSort('name')"
                      class="pb-4 font-bold cursor-pointer hover:text-blue-600 transition"
                      title="Klik untuk mengurutkan nama"
                    >
                      <div class="flex items-center gap-1.5">
                        <span>Nama Dokumen</span>
                        <span class="text-xs text-gray-400 font-mono">
                          {{ sortField === 'name' ? (sortAsc ? '↑' : '↓') : '↕' }}
                        </span>
                      </div>
                    </th>
                    <th 
                      @click="toggleSort('type')"
                      class="pb-4 font-bold cursor-pointer hover:text-blue-600 transition"
                      title="Klik untuk mengurutkan tipe"
                    >
                      <div class="flex items-center gap-1.5">
                        <span>Tipe</span>
                        <span class="text-xs text-gray-400 font-mono">
                          {{ sortField === 'type' ? (sortAsc ? '↑' : '↓') : '↕' }}
                        </span>
                      </div>
                    </th>
                    <th class="pb-4 font-bold">Ukuran</th>
                    <th class="pb-4 font-bold">Klasifikasi Akses (Multiple)</th>
                    <th 
                      @click="toggleSort('uploadDate')"
                      class="pb-4 font-bold cursor-pointer hover:text-blue-600 transition"
                      title="Klik untuk mengurutkan tanggal upload"
                    >
                      <div class="flex items-center gap-1.5">
                        <span>Tanggal Upload</span>
                        <span class="text-xs text-gray-400 font-mono">
                          {{ sortField === 'uploadDate' ? (sortAsc ? '↑' : '↓') : '↕' }}
                        </span>
                      </div>
                    </th>
                    <th class="pb-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr 
                    v-for="doc in paginatedDocuments" 
                    :key="doc.id"
                    class="hover:bg-blue-50/30 transition"
                  >
                    <!-- Nama Dokumen with Document Icon -->
                    <td class="py-4 font-medium text-gray-900 flex items-center gap-2.5">
                      <svg class="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span>{{ doc.name }}</span>
                    </td>
                    <td class="py-4 text-gray-600 font-normal">
                      <span class="px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200/80 text-xs font-medium rounded-lg">
                        {{ doc.type }}
                      </span>
                    </td>
                    <td class="py-4 text-gray-600 font-normal">{{ doc.size }}</td>
                    
                    <!-- Multiple Klasifikasi Chips -->
                    <td class="py-4">
                      <div class="flex flex-wrap gap-1.5 items-center">
                        <span 
                          v-for="c in doc.classifications" 
                          :key="c"
                          :class="['px-2.5 py-1 rounded-lg text-xs font-medium border', getBadgeColor(c)]"
                        >
                          {{ c }}
                        </span>
                      </div>
                    </td>

                    <td class="py-4 text-gray-600 font-normal">{{ doc.uploadDate }}</td>
                    
                    <!-- Aksi Icons (View & Delete with Confirm) -->
                    <td class="py-4 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <button 
                          @click="viewDoc(doc)"
                          class="text-gray-400 hover:text-blue-600 transition p-1.5 rounded-lg hover:bg-blue-50 cursor-pointer" 
                          title="Lihat Detail Dokumen"
                        >
                          <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        <button 
                          @click="requestDelete(doc)"
                          class="text-gray-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50 cursor-pointer" 
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
              <div v-if="sortedDocuments.length === 0" class="text-center py-8 text-gray-400 text-sm">
                Dokumen tidak ditemukan dengan kata kunci "{{ documentState.searchQuery }}"
              </div>
            </div>

            <!-- Pagination Controls -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <div class="flex items-center gap-3">
                <span>Menampilkan {{ startDocIndex }} - {{ endDocIndex }} dari {{ totalDocs }} dokumen</span>
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

        <!-- Modal Tambah Dokumen Baru (Real File Input & Multiple Classifications) -->
        <div 
          v-if="documentState.showAddModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-xs" @click="documentState.showAddModal = false"></div>
          <transition
            appear
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-white rounded-2xl p-6 md:p-7 max-w-lg w-full text-left shadow-2xl relative z-10">
              <button 
                @click="documentState.showAddModal = false"
                class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded cursor-pointer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              <h3 class="text-lg font-bold text-gray-900 mb-1">Tambah Dokumen Baru</h3>
              <p class="text-xs text-gray-500 mb-5">Unggah berkas dokumen internal dan tentukan klasifikasi aksesnya</p>

              <form @submit.prevent="submitAddDoc" class="space-y-4">
                <!-- Real File Upload Area -->
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Pilih Berkas Dokumen</label>
                  <div 
                    @click="triggerFileInput"
                    class="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition bg-gray-50/50 hover:bg-blue-50/20 group"
                  >
                    <input 
                      ref="fileInputRef" 
                      type="file" 
                      class="hidden" 
                      accept=".pdf,.xlsx,.xls,.docx,.txt"
                      @change="onFileChange"
                    />
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                      </svg>
                    </div>
                    <p class="text-xs font-semibold text-gray-800">
                      {{ selectedFile ? selectedFile.name : 'Klik untuk memilih berkas dari komputer' }}
                    </p>
                    <p class="text-[11px] text-gray-400 mt-1">Format PDF, XLSX, DOCX (Maksimal 25 MB)</p>
                  </div>
                </div>

                <!-- Nama Dokumen Input -->
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Nama Berkas</label>
                  <input 
                    v-model="newDocForm.name"
                    type="text" 
                    placeholder="Contoh: Pedoman Operasional 2025.pdf"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <!-- Multiple Klasifikasi Checkboxes -->
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1">
                    Pilih Klasifikasi Akses Dokumen
                  </label>
                  <p class="text-[11px] text-gray-400 mb-2.5">
                    Tentukan kategori akses divisi yang berhak membaca berkas ini (bisa multiple)
                  </p>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <label 
                      v-for="c in availableClassifications" 
                      :key="c"
                      class="flex items-center gap-2 text-xs text-gray-700 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        :value="c" 
                        v-model="newDocForm.classifications" 
                        class="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{{ c }}</span>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
                >
                  Simpan & Daftarkan Dokumen
                </button>
              </form>
            </div>
          </transition>
        </div>

        <!-- Modal Lihat Dokumen (Preview Detail) -->
        <div 
          v-if="selectedPreviewDoc"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-xs" @click="selectedPreviewDoc = null"></div>
          <transition
            appear
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-white rounded-2xl p-6 md:p-7 max-w-md w-full text-left shadow-2xl relative z-10">
              <button 
                @click="selectedPreviewDoc = null"
                class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded cursor-pointer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {{ selectedPreviewDoc.type }}
                </div>
                <div>
                  <h3 class="text-base font-bold text-gray-900 leading-tight">{{ selectedPreviewDoc.name }}</h3>
                  <span class="text-xs text-gray-400">{{ selectedPreviewDoc.size }} • Diunggah {{ selectedPreviewDoc.uploadDate }}</span>
                </div>
              </div>

              <div class="p-3.5 bg-gray-50 rounded-xl mb-4 space-y-2.5 text-xs">
                <div>
                  <span class="text-gray-500 block mb-1">Klasifikasi Akses:</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span 
                      v-for="c in selectedPreviewDoc.classifications" 
                      :key="c"
                      :class="['px-2.5 py-0.5 rounded-md font-semibold border', getBadgeColor(c)]"
                    >
                      {{ c }}
                    </span>
                  </div>
                </div>
                <div class="flex justify-between pt-2 border-t border-gray-200/60">
                  <span class="text-gray-500">Status Vektor AI:</span>
                  <span class="text-green-600 font-semibold">✓ Terindeks (Vector Ready)</span>
                </div>
              </div>

              <p class="text-xs text-gray-500 mb-5 leading-relaxed">
                Dokumen ini aktif di dalam basis data RAG. Hanya karyawan yang memiliki salah satu izin akses klasifikasi di atas yang dapat memperoleh jawaban dari dokumen ini.
              </p>

              <button 
                @click="selectedPreviewDoc = null"
                class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-xl text-sm transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </transition>
        </div>

        <!-- Realistic AI Knowledge Indexing Progress Dialog -->
        <div 
          v-if="documentState.isIndexing"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="fixed inset-0 bg-black/50 backdrop-blur-xs"></div>
          <transition
            appear
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-white rounded-2xl p-7 max-w-md w-full text-center shadow-2xl border border-gray-100 relative z-10">
              <!-- Animated Robot AI Icon -->
              <div class="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20 animate-pulse">
                <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2a1 1 0 0 1 1 1v1h2a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1V7a3 3 0 0 1 3-3h2V3a1 1 0 0 1 1-1zm5 5H7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-8 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-6 5h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5z"/>
                </svg>
              </div>

              <h3 class="text-lg font-bold text-gray-900 tracking-tight">Memperbarui Pengetahuan AI</h3>
              <p class="text-xs text-gray-500 mt-1 mb-6">
                Sistem sedang memproses dokumen ke dalam indeks vektor semantik
              </p>

              <!-- Progress Bar -->
              <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-3">
                <div 
                  class="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  :style="{ width: documentState.indexingProgress + '%' }"
                ></div>
              </div>

              <!-- Stage text and percentage -->
              <div class="flex items-center justify-between text-xs text-gray-400 font-medium">
                <span class="truncate max-w-[260px] text-left text-gray-600 font-semibold">{{ documentState.indexingStage }}</span>
                <span>{{ documentState.indexingProgress }}%</span>
              </div>
            </div>
          </transition>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import { documentState, addDocument, deleteDocument, startIndexing } from '../stores/documentStore'
import { masterState } from '../stores/masterStore'
import { showConfirm } from '../stores/confirmStore'

const mobileDrawerOpen = ref(false)
const sortField = ref('name')
const sortAsc = ref(true)
const selectedPreviewDoc = ref(null)
const fileInputRef = ref(null)
const selectedFile = ref(null)

const availableClassifications = computed(() => {
  return masterState.classifications.map((c) => c.name)
})

function toggleSort(field) {
  if (sortField.value === field) {
    sortAsc.value = !sortAsc.value
  } else {
    sortField.value = field
    sortAsc.value = true
  }
}

const newDocForm = reactive({
  name: '',
  classifications: ['Public'],
})

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    newDocForm.name = file.name
  }
}

function openAddModal() {
  selectedFile.value = null
  newDocForm.name = ''
  newDocForm.classifications = ['Public']
  documentState.showAddModal = true
}

const filteredDocuments = computed(() => {
  if (!documentState.searchQuery) return documentState.documents
  const q = documentState.searchQuery.toLowerCase()
  return documentState.documents.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.classifications.some((c) => c.toLowerCase().includes(q)) ||
      d.type.toLowerCase().includes(q)
  )
})

const sortedDocuments = computed(() => {
  const list = [...filteredDocuments.value]
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

const totalDocs = computed(() => sortedDocuments.value.length)
const totalPages = computed(() => Math.ceil(totalDocs.value / pageSize.value) || 1)

const paginatedDocuments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedDocuments.value.slice(start, start + pageSize.value)
})

const startDocIndex = computed(() => {
  if (totalDocs.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const endDocIndex = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalDocs.value)
})

function getBadgeColor(name) {
  switch (name) {
    case 'Public':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Finance':
      return 'bg-violet-50 text-violet-700 border-violet-200'
    case 'HR':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Legal':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case 'IT':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'Sales':
      return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'Confidential':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    default:
      return 'bg-blue-50 text-blue-700 border-blue-200'
  }
}

function submitAddDoc() {
  const name = newDocForm.name || 'Dokumen Baru.pdf'
  const isXlsx = name.toLowerCase().endsWith('.xlsx') || name.toLowerCase().endsWith('.xls')
  addDocument({
    name: name,
    type: isXlsx ? 'Xlsx' : 'Pdf',
    size: selectedFile.value ? (selectedFile.value.size / (1024 * 1024)).toFixed(1) + ' MB' : '1.8 MB',
    classifications: [...newDocForm.classifications],
  })
}

function viewDoc(doc) {
  selectedPreviewDoc.value = doc
}

function requestDelete(doc) {
  showConfirm({
    title: 'Hapus Dokumen',
    message: `Apakah Anda yakin ingin menghapus "${doc.name}" dari sistem? Dokumen tidak akan lagi tersedia untuk chatbot AI.`,
    confirmText: 'Hapus Dokumen',
    isDanger: true,
    onConfirm: () => {
      deleteDocument(doc.id)
    },
  })
}

function onStartIndexing() {
  startIndexing()
}
</script>
