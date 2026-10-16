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
          <!-- Page Header (Master Izin Akses) -->
          <div class="mb-8">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Master Izin Akses</h1>
            <p class="text-gray-500 text-sm mt-1">Konfigurasi izin otorisasi dokumen internal dan modul sistem</p>
          </div>

          <!-- Section Subtitle & Button -->
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Daftar Izin Akses</h2>
              <p class="text-xs text-gray-400">Total {{ masterState.permissions.length }} izin terdaftar</p>
            </div>
            <button 
              @click="showAddModal = true"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Tambah Izin Akses</span>
            </button>
          </div>

          <!-- Permissions Table Container -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-gray-800">
                <thead class="bg-gray-50/80 border-b border-gray-200">
                  <tr class="text-xs font-bold text-gray-700">
                    <th class="py-3.5 px-5 w-1/4">Nama Izin</th>
                    <th class="py-3.5 px-4 w-1/6">Modul Terkait</th>
                    <th class="py-3.5 px-4 w-2/5">Deskripsi</th>
                    <th class="py-3.5 px-4 text-center">Pengguna Terkait</th>
                    <th class="py-3.5 px-5 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr 
                    v-for="item in masterState.permissions" 
                    :key="item.id"
                    class="hover:bg-blue-50/30 transition"
                  >
                    <td class="py-4 px-5 font-bold text-gray-900">
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span>{{ item.name }}</span>
                      </div>
                    </td>
                    <td class="py-4 px-4">
                      <span class="px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200/80 text-xs font-medium rounded-lg">
                        {{ item.module }}
                      </span>
                    </td>
                    <td class="py-4 px-4 text-gray-600 font-normal text-xs leading-relaxed">
                      {{ item.description }}
                    </td>
                    <td class="py-4 px-4 text-center">
                      <span class="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg inline-block">
                        {{ item.userCount }} Pengguna
                      </span>
                    </td>
                    <td class="py-4 px-5 text-center">
                      <button 
                        @click="onDelete(item.id)"
                        class="text-gray-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Hapus Izin Akses"
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
          </div>
        </div>

        <!-- Modal Tambah Izin Akses -->
        <div 
          v-if="showAddModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        >
          <div class="bg-white rounded-2xl p-6 md:p-7 max-w-md w-full text-left shadow-2xl relative">
            <button 
              @click="showAddModal = false"
              class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <h3 class="text-lg font-bold text-gray-900 mb-1">Tambah Izin Akses</h3>
            <p class="text-xs text-gray-500 mb-4">Buat master izin baru untuk otorisasi dokumen</p>

            <form @submit.prevent="submitAdd" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Nama Izin</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  placeholder="Contoh: Audit View" 
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Modul Sistem</label>
                <select 
                  v-model="form.module"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Dokumen">Dokumen</option>
                  <option value="System">System</option>
                  <option value="Keamanan">Keamanan</option>
                  <option value="Audit">Audit</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Deskripsi Izin</label>
                <textarea 
                  v-model="form.description" 
                  rows="3"
                  placeholder="Jelaskan cakupan dokumen atau batasan izin ini" 
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button 
                type="submit"
                class="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
              >
                Simpan Izin Akses
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import { masterState, deleteMasterPermission, addMasterPermission } from '../stores/masterStore'
import { showConfirm } from '../stores/confirmStore'

const mobileDrawerOpen = ref(false)
const showAddModal = ref(false)

const form = reactive({
  name: '',
  module: 'Dokumen',
  description: '',
})

function submitAdd() {
  addMasterPermission({
    name: form.name,
    module: form.module,
    description: form.description,
  })
  form.name = ''
  form.description = ''
  showAddModal.value = false
}

function onDelete(id) {
  const perm = masterState.permissions.find((p) => p.id === id)
  showConfirm({
    title: 'Hapus Izin Akses',
    message: `Apakah Anda yakin ingin menghapus izin akses "${perm?.name || 'ini'}"? Aturan hak akses terkait akan disesuaikan.`,
    confirmText: 'Hapus Izin',
    isDanger: true,
    onConfirm: () => {
      deleteMasterPermission(id)
    }
  })
}
</script>
