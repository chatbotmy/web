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
      <main class="flex-1 bg-white p-6 md:p-10 overflow-y-auto h-full text-left">
        <div class="max-w-6xl mx-auto">
          <!-- Page Header (Master Klasifikasi) -->
          <div class="mb-8">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Master Klasifikasi</h1>
            <p class="text-gray-500 text-sm mt-1">Pengaturan tingkat kerahasiaan dan klasifikasi keamanan dokumen</p>
          </div>

          <!-- Section Subtitle & Button -->
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Daftar Klasifikasi Dokumen</h2>
              <p class="text-xs text-gray-400">Total {{ masterState.classifications.length }} klasifikasi terdaftar</p>
            </div>
            <button 
              @click="showAddModal = true"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Tambah Klasifikasi</span>
            </button>
          </div>

          <!-- Classifications Table Container -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-gray-800">
                <thead class="bg-gray-50/80 border-b border-gray-200">
                  <tr class="text-xs font-bold text-gray-700 whitespace-nowrap">
                    <th class="py-3.5 px-5">Nama Klasifikasi</th>
                    <th class="py-3.5 px-4">Deskripsi Kerahasiaan</th>
                    <th class="py-3.5 px-4 text-center">Tingkat Keamanan</th>
                    <th class="py-3.5 px-4 text-center">Jumlah Dokumen</th>
                    <th class="py-3.5 px-5 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr 
                    v-for="item in paginatedClassifications" 
                    :key="item.id"
                    class="hover:bg-blue-50/30 transition whitespace-nowrap"
                  >
                    <td class="py-4 px-5 font-bold text-gray-900 whitespace-nowrap">
                      {{ item.name }}
                    </td>
                    <td class="py-4 px-4 text-gray-600 font-normal text-xs whitespace-nowrap truncate max-w-xs md:max-w-md" :title="item.description">
                      {{ item.description }}
                    </td>
                    <!-- Security Level Badge (Title Case) -->
                    <td class="py-4 px-4 text-center whitespace-nowrap">
                      <span 
                        :class="[
                          'px-2.5 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 border',
                          getLevelColor(item.level)
                        ]"
                      >
                        <span :class="['w-1.5 h-1.5 rounded-full', item.level === 'Low' ? 'bg-emerald-500' : item.level === 'Medium' ? 'bg-blue-500' : item.level === 'High' ? 'bg-amber-500' : 'bg-rose-500']"></span>
                        <span>{{ item.level }}</span>
                      </span>
                    </td>
                    <td class="py-4 px-4 text-center whitespace-nowrap">
                      <span class="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-lg inline-block">
                        {{ item.docCount }} Berkas
                      </span>
                    </td>
                    <td class="py-4 px-5 text-center whitespace-nowrap">
                      <button 
                        @click="onDelete(item.id)"
                        class="text-gray-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Hapus Klasifikasi"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination Controls -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 text-xs text-gray-500">
              <div class="flex items-center gap-3">
                <span>Menampilkan {{ startClassIndex }} - {{ endClassIndex }} dari {{ totalClassifications }} klasifikasi</span>
                <div class="flex items-center gap-1.5 ml-2">
                  <label class="text-gray-400">Per halaman:</label>
                  <select 
                    v-model="pageSize" 
                    @change="currentPage = 1"
                    class="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option :value="3">3</option>
                    <option :value="5">5</option>
                    <option :value="10">10</option>
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

        <!-- Modal Tambah Klasifikasi -->
        <div 
          v-if="showAddModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-xs" @click="showAddModal = false"></div>
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
                @click="showAddModal = false"
                class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded cursor-pointer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              <h3 class="text-lg font-bold text-gray-900 mb-1">Tambah Klasifikasi Baru</h3>
              <p class="text-xs text-gray-500 mb-4">Tentukan label klasifikasi dan tingkat kerahasiaan</p>

              <form @submit.prevent="submitAdd" class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Nama Klasifikasi</label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    placeholder="Contoh: Internal Only" 
                    required
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Tingkat Keamanan</label>
                  <select 
                    v-model="form.level"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Deskripsi Klasifikasi</label>
                  <textarea 
                    v-model="form.description" 
                    rows="3"
                    placeholder="Jelaskan kriteria berkas yang masuk ke kategori ini" 
                    required
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  class="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
                >
                  Simpan Klasifikasi
                </button>
              </form>
            </div>
          </transition>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import { masterState, deleteMasterClassification, addMasterClassification } from '../stores/masterStore'
import { showConfirm } from '../stores/confirmStore'

const mobileDrawerOpen = ref(false)
const showAddModal = ref(false)

const currentPage = ref(1)
const pageSize = ref(5)

const totalClassifications = computed(() => masterState.classifications.length)
const totalPages = computed(() => Math.ceil(totalClassifications.value / pageSize.value) || 1)

const paginatedClassifications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return masterState.classifications.slice(start, start + pageSize.value)
})

const startClassIndex = computed(() => {
  if (totalClassifications.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const endClassIndex = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalClassifications.value)
})

const form = reactive({
  name: '',
  level: 'Medium',
  description: '',
})

function getLevelColor(level) {
  switch (level) {
    case 'Low':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Medium':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'High':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Critical':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

function submitAdd() {
  addMasterClassification({
    name: form.name,
    level: form.level,
    description: form.description,
  })
  form.name = ''
  form.description = ''
  showAddModal.value = false
}

function onDelete(id) {
  const cls = masterState.classifications.find((c) => c.id === id)
  showConfirm({
    title: 'Hapus Klasifikasi Dokumen',
    message: `Apakah Anda yakin ingin menghapus klasifikasi "${cls?.name || 'ini'}"? Berkas dengan klasifikasi ini mungkin perlu ditugaskan ulang.`,
    confirmText: 'Hapus Klasifikasi',
    isDanger: true,
    onConfirm: () => {
      deleteMasterClassification(id)
    }
  })
}
</script>
