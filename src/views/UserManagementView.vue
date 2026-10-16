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
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Manajemen Pengguna</h1>
              <p class="text-gray-500 text-sm mt-1">Kelola data akun karyawan dan penetapan peran akses chatbot</p>
            </div>

            <!-- Tambah Karyawan Button -->
            <button 
              @click="openAddModal"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer self-start md:self-auto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Tambah Karyawan</span>
            </button>
          </div>

          <!-- 4 Stat Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500">Total Karyawan</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{{ userState.users.length }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">Pengguna terdaftar</div>
              </div>
              <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500">Akun Aktif</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{{ activeCount }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">Dapat berinteraksi</div>
              </div>
              <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500">Akun Nonaktif</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{{ inactiveCount }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">Akses dihentikan</div>
              </div>
              <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                </svg>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-gray-500">Jumlah Peran</div>
                <div class="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{{ roleOptions.length }}</div>
                <div class="text-[11px] text-gray-400 mt-0.5">Divisi terkonfigurasi</div>
              </div>
              <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <!-- Search Bar -->
            <div class="relative flex-1 max-w-md">
              <input 
                v-model="userState.searchQuery"
                type="text" 
                placeholder="Cari berdasarkan nama, email, atau username..."
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            <!-- Filter Role Dropdown -->
            <div class="flex items-center gap-2.5">
              <label class="text-xs font-medium text-gray-500 whitespace-nowrap">Filter Peran:</label>
              <select 
                v-model="userState.filterRole"
                class="bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs min-w-[130px]"
              >
                <option value="Semua">Semua Peran</option>
                <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
          </div>

          <!-- Users Table Container -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
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
                        <span>Nama Karyawan</span>
                        <span class="text-xs text-gray-400 font-mono">
                          {{ sortField === 'name' ? (sortAsc ? '↑' : '↓') : '↕' }}
                        </span>
                      </div>
                    </th>
                    <th 
                      @click="toggleSort('role')"
                      class="pb-4 font-bold cursor-pointer hover:text-blue-600 transition"
                      title="Klik untuk mengurutkan peran"
                    >
                      <div class="flex items-center gap-1.5">
                        <span>Peran / Divisi</span>
                        <span class="text-xs text-gray-400 font-mono">
                          {{ sortField === 'role' ? (sortAsc ? '↑' : '↓') : '↕' }}
                        </span>
                      </div>
                    </th>
                    <th class="pb-4 font-bold">Departemen</th>
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
                    <th 
                      @click="toggleSort('joinDate')"
                      class="pb-4 font-bold cursor-pointer hover:text-blue-600 transition"
                      title="Klik untuk mengurutkan tanggal bergabung"
                    >
                      <div class="flex items-center gap-1.5">
                        <span>Tanggal Bergabung</span>
                        <span class="text-xs text-gray-400 font-mono">
                          {{ sortField === 'joinDate' ? (sortAsc ? '↑' : '↓') : '↕' }}
                        </span>
                      </div>
                    </th>
                    <th class="pb-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr 
                    v-for="user in paginatedUsers" 
                    :key="user.id"
                    class="hover:bg-blue-50/30 transition"
                  >
                    <!-- Avatar & User Info -->
                    <td class="py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-100 flex-shrink-0">
                          {{ user.avatar }}
                        </div>
                        <div>
                          <div class="font-semibold text-gray-900">{{ user.name }}</div>
                          <div class="text-xs text-gray-400">@{{ user.username }} • {{ user.email }}</div>
                        </div>
                      </div>
                    </td>

                    <!-- Role Badge -->
                    <td class="py-4">
                      <span :class="['px-2.5 py-1 rounded-lg text-xs font-medium border', getBadgeColor(user.role)]">
                        {{ user.role }}
                      </span>
                    </td>

                    <!-- Department -->
                    <td class="py-4 text-xs text-gray-600">
                      {{ user.department }}
                    </td>

                    <!-- Status Toggle -->
                    <td class="py-4 text-center">
                      <button 
                        @click="toggleUserStatus(user.id)"
                        :class="[
                          'px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition inline-flex items-center gap-1.5',
                          user.status === 'Aktif' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                        ]"
                        :title="'Klik untuk ubah ke ' + (user.status === 'Aktif' ? 'Nonaktif' : 'Aktif')"
                      >
                        <span :class="['w-1.5 h-1.5 rounded-full', user.status === 'Aktif' ? 'bg-emerald-500' : 'bg-gray-400']"></span>
                        <span>{{ user.status }}</span>
                      </button>
                    </td>

                    <td class="py-4 text-xs text-gray-500">{{ user.joinDate }}</td>

                    <!-- Actions -->
                    <td class="py-4 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <button 
                          @click="openEditModal(user)"
                          class="text-gray-400 hover:text-blue-600 transition p-1.5 rounded-lg hover:bg-blue-50 cursor-pointer" 
                          title="Edit Karyawan"
                        >
                          <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                          </svg>
                        </button>
                        <button 
                          @click="onDelete(user.id)"
                          class="text-gray-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50 cursor-pointer" 
                          title="Hapus Karyawan"
                        >
                          <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Empty State -->
                  <tr v-if="sortedAndFilteredUsers.length === 0">
                    <td colspan="6" class="py-8 text-center text-sm text-gray-400">
                      Tidak ada karyawan yang sesuai dengan kata kunci pencarian.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination Controls -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <div class="flex items-center gap-3">
                <span>Menampilkan {{ startUserIndex }} - {{ endUserIndex }} dari {{ totalUsers }} karyawan</span>
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

        <!-- Modal Tambah Karyawan -->
        <div 
          v-if="userState.showAddModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200" @click="userState.showAddModal = false"></div>
          <div class="relative bg-white rounded-2xl p-6 md:p-7 max-w-lg w-full text-left shadow-2xl z-10">
            <button 
              @click="userState.showAddModal = false"
              class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <h3 class="text-lg font-bold text-gray-900 mb-1">Tambah Karyawan Baru</h3>
            <p class="text-xs text-gray-500 mb-5">Daftarkan akun karyawan dan tetapkan peran akses dokumen</p>

            <form @submit.prevent="submitAddUser" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Nama Lengkap</label>
                <input 
                  v-model="newForm.name"
                  type="text" 
                  placeholder="Contoh: Budi Santoso"
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Username Akun</label>
                  <input 
                    v-model="newForm.username"
                    type="text" 
                    placeholder="Contoh: budi_s"
                    required
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Email Perusahaan</label>
                  <input 
                    v-model="newForm.email"
                    type="email" 
                    placeholder="budi@company.com"
                    required
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Peran / Hak Akses Dokumen</label>
                  <select 
                    v-model="newForm.role"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Departemen</label>
                  <input 
                    v-model="newForm.department"
                    type="text" 
                    placeholder="Contoh: Keuangan"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Kata Sandi Awal</label>
                <input 
                  v-model="newForm.password"
                  type="password" 
                  placeholder="Minimal 6 karakter"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit"
                class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition shadow-sm cursor-pointer"
              >
                Simpan & Daftarkan Karyawan
              </button>
            </form>
          </div>
        </div>

        <!-- Modal Edit Karyawan -->
        <div 
          v-if="userState.showEditModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200" @click="userState.showEditModal = false"></div>
          <div class="relative bg-white rounded-2xl p-6 md:p-7 max-w-lg w-full text-left shadow-2xl z-10">
            <button 
              @click="userState.showEditModal = false"
              class="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1 rounded cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <h3 class="text-lg font-bold text-gray-900 mb-1">Edit Data Karyawan</h3>
            <p class="text-xs text-gray-500 mb-5">Perbarui nama, peran akses, atau departemen karyawan</p>

            <form @submit.prevent="submitEditUser" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-900 mb-1.5">Nama Lengkap</label>
                <input 
                  v-model="editForm.name"
                  type="text" 
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Email</label>
                  <input 
                    v-model="editForm.email"
                    type="email" 
                    required
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Peran / Hak Akses</label>
                  <select 
                    v-model="editForm.role"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Departemen</label>
                  <input 
                    v-model="editForm.department"
                    type="text" 
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-900 mb-1.5">Status Akun</label>
                  <select 
                    v-model="editForm.status"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
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
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import { userState, addUser, updateUser, deleteUser, toggleUserStatus } from '../stores/userStore'
import { roleState } from '../stores/roleStore'
import { showConfirm } from '../stores/confirmStore'

const mobileDrawerOpen = ref(false)
const sortField = ref('name')
const sortAsc = ref(true)

const roleOptions = computed(() => {
  return roleState.roles.map((r) => r.name)
})

const activeCount = computed(() => userState.users.filter((u) => u.status === 'Aktif').length)
const inactiveCount = computed(() => userState.users.filter((u) => u.status === 'Nonaktif').length)

function toggleSort(field) {
  if (sortField.value === field) {
    sortAsc.value = !sortAsc.value
  } else {
    sortField.value = field
    sortAsc.value = true
  }
}

const newForm = reactive({
  name: '',
  username: '',
  email: '',
  role: 'Finance',
  department: 'Keuangan',
  password: '',
})

const editForm = reactive({
  id: null,
  name: '',
  email: '',
  role: 'Finance',
  department: '',
  status: 'Aktif',
})

function openAddModal() {
  newForm.name = ''
  newForm.username = ''
  newForm.email = ''
  newForm.role = roleOptions.value[0] || 'Finance'
  newForm.department = 'Operasional'
  newForm.password = ''
  userState.showAddModal = true
}

function submitAddUser() {
  addUser({
    name: newForm.name,
    username: newForm.username,
    email: newForm.email,
    role: newForm.role,
    department: newForm.department,
  })
}

function openEditModal(user) {
  editForm.id = user.id
  editForm.name = user.name
  editForm.email = user.email
  editForm.role = user.role
  editForm.department = user.department
  editForm.status = user.status
  userState.showEditModal = true
}

function submitEditUser() {
  updateUser(editForm.id, {
    name: editForm.name,
    email: editForm.email,
    role: editForm.role,
    department: editForm.department,
    status: editForm.status,
  })
}

function onDelete(id) {
  const user = userState.users.find((u) => u.id === id)
  showConfirm({
    title: 'Hapus Data Karyawan',
    message: `Apakah Anda yakin ingin menghapus akun karyawan "${user?.name || 'ini'}"? Akses login dan riwayat akan dihapus secara permanen.`,
    confirmText: 'Hapus Karyawan',
    isDanger: true,
    onConfirm: () => {
      deleteUser(id)
    }
  })
}

const sortedAndFilteredUsers = computed(() => {
  let list = [...userState.users]

  if (userState.filterRole !== 'Semua') {
    list = list.filter((u) => u.role === userState.filterRole)
  }

  if (userState.searchQuery) {
    const q = userState.searchQuery.toLowerCase()
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
    )
  }

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

const totalUsers = computed(() => sortedAndFilteredUsers.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalUsers.value / pageSize.value)))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedAndFilteredUsers.value.slice(start, start + pageSize.value)
})

const startUserIndex = computed(() => (totalUsers.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1))
const endUserIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalUsers.value))

function getBadgeColor(role) {
  switch (role) {
    case 'CEO':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Finance':
      return 'bg-violet-50 text-violet-700 border-violet-200'
    case 'HRD':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Legal':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    default:
      return 'bg-blue-50 text-blue-700 border-blue-200'
  }
}
</script>
