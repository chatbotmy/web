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
          <!-- Page Header -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-left">
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Manajemen Peran</h1>
              <p class="text-gray-500 text-sm mt-1">Daftar peran, anggota terdaftar, dan hak akses dokumen</p>
            </div>
            <!-- Add Role Button -->
            <button 
              @click="openAddModal"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Tambah Peran</span>
            </button>
          </div>

          <!-- Role Cards List -->
          <div class="space-y-5">
            <div 
              v-for="role in paginatedRoles" 
              :key="role.id"
              class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left hover:shadow-md transition relative"
            >
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div class="flex items-center gap-3">
                    <h3 class="text-lg font-bold text-gray-900">{{ role.name }}</h3>
                    <!-- Clickable Members Pill -->
                    <button 
                      @click="roleState.openMembersModal ? roleState.openMembersModal(role) : openMembersModal(role)"
                      class="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                      title="Klik untuk melihat daftar anggota"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      <span>{{ role.members.length }} Anggota</span>
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-1.5">{{ role.description }}</p>
                </div>

                <!-- Action Icons -->
                <div class="flex items-center gap-3 self-end sm:self-auto">
                  <button 
                    @click="openEditModal(role)"
                    class="text-gray-500 hover:text-blue-600 transition p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer" 
                    title="Edit Peran"
                  >
                    <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </button>
                  <button 
                    @click="handleDelete(role)"
                    class="text-gray-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer" 
                    title="Hapus Peran"
                  >
                    <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Permission Badges List -->
              <div class="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between flex-wrap gap-2">
                <div class="flex flex-wrap gap-1.5 items-center">
                  <span class="text-xs text-gray-400 font-medium mr-1">Hak Akses:</span>
                  <span 
                    v-for="perm in role.permissions" 
                    :key="perm"
                    :class="[
                      'px-2.5 py-1 rounded-lg text-xs font-medium border',
                      getBadgeColor(perm)
                    ]"
                  >
                    {{ perm }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-xs text-xs text-gray-500">
            <div class="flex items-center gap-3">
              <span>Menampilkan {{ startItemIndex }} - {{ endItemIndex }} dari {{ totalItems }} peran</span>
              <div class="flex items-center gap-1.5 ml-2">
                <label class="text-gray-400">Per halaman:</label>
                <select 
                  v-model="pageSize" 
                  class="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option :value="2">2</option>
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

        <!-- Modal Tambah Peran -->
        <div 
          v-if="roleState.showAddModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200" @click="roleState.showAddModal = false"></div>
          <div class="relative bg-white rounded-2xl p-6 md:p-7 max-w-lg w-full text-left shadow-2xl z-10">
            <button 
              @click="roleState.showAddModal = false"
              class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <h3 class="text-lg font-bold text-gray-900 mb-1">Tambah Peran Baru</h3>
            <p class="text-xs text-gray-500 mb-5">Tentukan nama peran dan pilih hak akses dokumen</p>

            <form @submit.prevent="submitAddRole" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Nama Peran</label>
                <input 
                  v-model="newRoleForm.name" 
                  type="text" 
                  placeholder="Contoh: Legal Counsel"
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Deskripsi Peran</label>
                <input 
                  v-model="newRoleForm.description" 
                  type="text" 
                  placeholder="Deskripsi singkat tanggung jawab peran"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1">Pilih Hak Akses Klasifikasi Dokumen</label>
                <p class="text-[11px] text-gray-400 mb-2">Tentukan klasifikasi dokumen yang dapat dibaca oleh peran ini (bisa multiple)</p>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <label 
                    v-for="perm in classificationOptions" 
                    :key="perm"
                    class="flex items-center gap-2 text-xs text-gray-700 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      :value="perm" 
                      v-model="newRoleForm.permissions" 
                      class="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{{ perm }}</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
              >
                Simpan Peran
              </button>
            </form>
          </div>
        </div>

        <!-- Modal Edit Peran -->
        <div 
          v-if="roleState.showEditModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200" @click="roleState.showEditModal = false"></div>
          <div class="relative bg-white rounded-2xl p-6 md:p-7 max-w-lg w-full text-left shadow-2xl z-10">
            <button 
              @click="roleState.showEditModal = false"
              class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <h3 class="text-lg font-bold text-gray-900 mb-1">Edit Peran</h3>
            <p class="text-xs text-gray-500 mb-5">Perbarui informasi peran dan hak akses</p>

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
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Deskripsi Peran</label>
                <input 
                  v-model="editRoleForm.description"
                  type="text" 
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1">Pilih Hak Akses Klasifikasi Dokumen</label>
                <p class="text-[11px] text-gray-400 mb-2">Tentukan klasifikasi dokumen yang dapat dibaca oleh peran ini (bisa multiple)</p>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <label 
                    v-for="perm in classificationOptions" 
                    :key="perm"
                    class="flex items-center gap-2 text-xs text-gray-700 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      :value="perm" 
                      v-model="editRoleForm.permissions" 
                      class="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{{ perm }}</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>

        <!-- Modal Anggota Terdaftar (UX Professional Member List) -->
        <div 
          v-if="showMembersModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200" @click="showMembersModal = false"></div>
          <div class="relative bg-white rounded-2xl p-6 md:p-7 max-w-md w-full text-left shadow-2xl z-10">
            <button 
              @click="showMembersModal = false"
              class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <h3 class="text-lg font-bold text-gray-900 mb-1">
              Anggota Peran: {{ activeRole?.name }}
            </h3>
            <p class="text-xs text-gray-500 mb-4">Daftar pengguna internal yang memiliki peran ini</p>

            <div class="divide-y divide-gray-100 max-h-64 overflow-y-auto mb-5">
              <div 
                v-for="member in activeRole?.members" 
                :key="member.id"
                class="py-3 flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {{ member.avatar }}
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ member.name }}</div>
                    <div class="text-xs text-gray-400">{{ member.email }}</div>
                  </div>
                </div>
                <span class="text-[10px] bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded">Aktif</span>
              </div>
            </div>

            <button 
              @click="showMembersModal = false"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-xl text-sm transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import { roleState, addRole, updateRole, deleteRole } from '../stores/roleStore'
import { masterState } from '../stores/masterStore'
import { showConfirm } from '../stores/confirmStore'

const classificationOptions = computed(() => {
  return masterState.classifications.map((c) => c.name)
})

const mobileDrawerOpen = ref(false)
const showMembersModal = ref(false)
const activeRole = ref(null)

const currentPage = ref(1)
const pageSize = ref(3)

const totalItems = computed(() => roleState.roles.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))

const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return roleState.roles.slice(start, start + pageSize.value)
})

const startItemIndex = computed(() => (totalItems.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1))
const endItemIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value))

const newRoleForm = reactive({
  name: '',
  description: '',
  permissions: ['Public', 'HR'],
})

const editRoleForm = reactive({
  id: null,
  name: '',
  description: '',
  permissions: [],
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

function openAddModal() {
  newRoleForm.name = ''
  newRoleForm.description = ''
  newRoleForm.permissions = ['Public']
  roleState.showAddModal = true
}

function submitAddRole() {
  addRole({
    name: newRoleForm.name,
    description: newRoleForm.description,
    members: [
      { id: 'u_' + Date.now(), name: 'Pengguna Baru', email: 'user@company.com', avatar: 'PB' }
    ],
    permissions: [...newRoleForm.permissions],
  })
}

function openEditModal(role) {
  editRoleForm.id = role.id
  editRoleForm.name = role.name
  editRoleForm.description = role.description
  editRoleForm.permissions = [...role.permissions]
  roleState.showEditModal = true
}

function submitEditRole() {
  updateRole(editRoleForm.id, {
    name: editRoleForm.name,
    description: editRoleForm.description,
    permissions: [...editRoleForm.permissions],
  })
}

function openMembersModal(role) {
  activeRole.value = role
  showMembersModal.value = true
}

function handleDelete(role) {
  showConfirm({
    title: 'Hapus Peran',
    message: `Apakah Anda yakin ingin menghapus peran "${role.name}"? Pengguna dalam peran ini akan kehilangan hak akses dokumen terkait.`,
    confirmText: 'Hapus Peran',
    isDanger: true,
    onConfirm: () => {
      deleteRole(role.id)
    },
  })
}
</script>
