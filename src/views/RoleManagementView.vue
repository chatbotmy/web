<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Navbar -->
    <AppNavbar variant="default" :show-top-logout="true" />

    <!-- Body Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Admin Sidebar -->
      <AppSidebar mode="admin" theme="blue" />

      <!-- Main Content Area -->
      <main class="flex-1 bg-white p-8 md:p-10 overflow-y-auto relative">
        <div class="max-w-6xl mx-auto">
          <!-- Page Header -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-left">
              <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Peran</h1>
              <p class="text-gray-500 text-sm mt-1">Daftar peran dan izin akses</p>
            </div>
            <!-- Add Role Button -->
            <button 
              @click="roleState.showAddModal = true"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Tambah Peran</span>
            </button>
          </div>

          <!-- Role Cards List (Matching L-010 & Management Peran 1) -->
          <div class="space-y-6">
            <div 
              v-for="role in roleState.roles" 
              :key="role.id"
              class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left hover:shadow-md transition relative"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">{{ role.name }}</h3>
                  <div class="text-xs text-gray-500 mt-1 font-medium">{{ role.userCount }}</div>
                </div>

                <!-- Action Icons (Pencil & Trash) -->
                <div class="flex items-center gap-4">
                  <button 
                    @click="openEditModal(role)"
                    class="text-gray-600 hover:text-gray-900 transition p-1" 
                    title="Edit Peran"
                  >
                    <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </button>
                  <button 
                    @click="handleDelete(role.id)"
                    class="text-red-500 hover:text-red-700 transition p-1" 
                    title="Hapus Peran"
                  >
                    <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Permissions Badges Section -->
              <div class="mt-4 pt-2">
                <div class="text-xs font-semibold text-gray-700 mb-2">Izin akses</div>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="perm in role.permissions" 
                    :key="perm"
                    :class="['px-3.5 py-1 rounded-full text-xs font-medium', getBadgeColor(perm)]"
                  >
                    {{ perm }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Tambah Peran (L-015) -->
        <div 
          v-if="roleState.showAddModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        >
          <div class="bg-white rounded-2xl p-7 max-w-lg w-full text-left shadow-2xl relative">
            <!-- Close Button -->
            <button 
              @click="roleState.showAddModal = false"
              class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <h3 class="text-lg font-bold text-gray-900 mb-5">Tambah Peran</h3>

            <form @submit.prevent="submitAddRole" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Nama Peran</label>
                <input 
                  v-model="newRoleForm.name"
                  type="text" 
                  placeholder="Masukkan nama peran"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Pengguna</label>
                <input 
                  v-model="newRoleForm.userCount"
                  type="text" 
                  placeholder="Masukkan nama pengguna"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Izin Akses</label>
                <input 
                  v-model="newRoleForm.permissionsRaw"
                  type="text" 
                  placeholder="Masukkan izin akses (misal: Public, Finance)"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <!-- Teal Button (L-015 Tambah Peran) -->
              <button 
                type="submit"
                class="w-full mt-4 bg-[#008ba3] hover:bg-[#007b91] text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm"
              >
                Tambah Peran
              </button>
            </form>
          </div>
        </div>

        <!-- Modal Edit Peran (L-013) -->
        <div 
          v-if="roleState.showEditModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        >
          <div class="bg-white rounded-2xl p-7 max-w-lg w-full text-left shadow-2xl relative">
            <button 
              @click="roleState.showEditModal = false"
              class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <h3 class="text-lg font-bold text-gray-900 mb-5">Edit Peran</h3>

            <form @submit.prevent="submitEditRole" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Nama Peran</label>
                <input 
                  v-model="editRoleForm.name"
                  type="text" 
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Pengguna</label>
                <input 
                  v-model="editRoleForm.userCount"
                  type="text" 
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Izin Akses (Dipisahkan Koma)</label>
                <input 
                  v-model="editRoleForm.permissionsRaw"
                  type="text" 
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit"
                class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm"
              >
                Simpan Perubahan
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
import { roleState, addRole, updateRole, deleteRole } from '../stores/roleStore'

const newRoleForm = reactive({
  name: '',
  userCount: '1 Pengguna',
  permissionsRaw: 'Public, HR',
})

const editRoleForm = reactive({
  id: null,
  name: '',
  userCount: '',
  permissionsRaw: '',
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
    case 'Confidential':
      return 'bg-[#FFE4E6] text-[#881337]'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function submitAddRole() {
  const perms = newRoleForm.permissionsRaw.split(',').map((p) => p.trim()).filter(Boolean)
  addRole({
    name: newRoleForm.name,
    userCount: newRoleForm.userCount,
    permissions: perms,
  })
  newRoleForm.name = ''
  newRoleForm.userCount = '1 Pengguna'
  newRoleForm.permissionsRaw = 'Public, HR'
}

function openEditModal(role) {
  editRoleForm.id = role.id
  editRoleForm.name = role.name
  editRoleForm.userCount = role.userCount
  editRoleForm.permissionsRaw = role.permissions.join(', ')
  roleState.showEditModal = true
}

function submitEditRole() {
  const perms = editRoleForm.permissionsRaw.split(',').map((p) => p.trim()).filter(Boolean)
  updateRole(editRoleForm.id, {
    name: editRoleForm.name,
    userCount: editRoleForm.userCount,
    permissions: perms,
  })
}

function handleDelete(id) {
  deleteRole(id)
}
</script>
