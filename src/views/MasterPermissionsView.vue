<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Navbar -->
    <AppNavbar variant="default" :show-top-logout="true" />

    <!-- Body Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Admin Sidebar -->
      <AppSidebar mode="admin" theme="blue" />

      <!-- Main Content Area -->
      <main class="flex-1 bg-white p-8 md:p-10 overflow-y-auto text-left">
        <div class="max-w-6xl mx-auto">
          <!-- Page Header (Master Izin Akses 1) -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Master Izin Akses</h1>
          </div>

          <!-- Section Subtitle & Button -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">Daftar Izin Akses</h2>
            <button 
              @click="addPermission"
              class="px-4 py-2 bg-[#18181B] hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
            >
              <span>+ Tambah Izin Akses</span>
            </button>
          </div>

          <!-- Permissions Table -->
          <div class="bg-white border-t border-gray-200">
            <table class="w-full text-left text-sm text-gray-800">
              <thead>
                <tr class="border-b border-gray-200 text-xs font-bold text-gray-900">
                  <th class="py-4 font-bold w-1/4">Nama Izin</th>
                  <th class="py-4 font-bold w-2/4">Deskripsi</th>
                  <th class="py-4 font-bold w-1/4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr 
                  v-for="item in masterState.permissions" 
                  :key="item.id"
                  class="hover:bg-gray-50/50 transition"
                >
                  <td class="py-5 font-bold text-gray-900">{{ item.name }}</td>
                  <td class="py-5 text-gray-600 font-normal">{{ item.description }}</td>
                  <td class="py-5 text-center">
                    <button 
                      @click="onDelete(item.id)"
                      class="text-cyan-500 hover:text-cyan-700 transition p-1.5 rounded border border-cyan-100 hover:bg-cyan-50"
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
      </main>
    </div>
  </div>
</template>

<script setup>
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import { masterState, deleteMasterPermission } from '../stores/masterStore'
import { showToast } from '../stores/toastStore'

function onDelete(id) {
  deleteMasterPermission(id)
}

function addPermission() {
  masterState.permissions.push({
    id: Date.now(),
    name: 'Auditor View',
    description: 'Akses membaca log audit dan kepatuhan sistem',
  })
  showToast('Izin akses berhasil ditambahkan')
}
</script>
