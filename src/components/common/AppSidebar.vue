<template>
  <div>
    <!-- Mobile Backdrop Overlay -->
    <div 
      v-if="isOpenMobile"
      @click="$emit('close-mobile')"
      class="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
    ></div>

    <aside 
      :class="[
        'h-full flex flex-col justify-between transition-all duration-300 border-r border-gray-200 flex-shrink-0 z-30 select-none',
        theme === 'white' ? 'bg-white' : 'bg-[#EDF2FE]',
        // Desktop collapsed vs expanded width & padding
        isCollapsed ? 'md:w-16 md:px-2 md:py-4' : 'md:w-64 md:p-5',
        // Mobile drawer behavior (fixed overlay) vs Desktop (static full height)
        'fixed md:static inset-y-0 left-0 top-16 md:top-0 w-72 p-5',
        isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- Top Section -->
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Brand & Collapse Header -->
        <div 
          :class="[
            'flex items-center mb-6',
            isCollapsed ? 'justify-center' : 'justify-between'
          ]"
        >
          <h2 
            v-if="!isCollapsed" 
            class="font-bold text-gray-900 text-base tracking-tight truncate"
          >
            Sistem Chatbot
          </h2>

          <!-- Collapse / Expand Toggle Button -->
          <button 
            @click="toggleCollapse"
            class="text-gray-500 hover:text-gray-800 p-1.5 rounded-lg hover:bg-black/5 transition hidden md:flex items-center justify-center cursor-pointer" 
            :title="isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'"
          >
            <svg 
              :class="['w-4 h-4 transition-transform duration-300', isCollapsed ? 'rotate-180' : '']" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <!-- Mobile Close Button -->
          <button 
            @click="$emit('close-mobile')"
            class="text-gray-500 hover:text-gray-800 p-1.5 rounded-lg hover:bg-black/5 transition md:hidden cursor-pointer"
            title="Tutup Menu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- USER CHAT HISTORY MODE -->
        <div v-if="mode === 'chat'" class="flex-1 flex flex-col min-h-0">
          <!-- New Chat Button -->
          <button 
            @click="onNewChat"
            :class="[
              'mb-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center shadow-xs transition cursor-pointer',
              isCollapsed 
                ? 'w-10 h-10 rounded-xl mx-auto p-0' 
                : 'w-full py-2.5 px-3 rounded-xl gap-2'
            ]"
            title="Percakapan Baru"
          >
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
            </svg>
            <span v-if="!isCollapsed" class="truncate">Percakapan Baru</span>
          </button>

          <div v-if="!isCollapsed" class="text-xs font-semibold text-gray-500 tracking-wider mb-2">
            Riwayat Percakapan
          </div>

          <!-- Scrollable Chat List -->
          <div class="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
            <div 
              v-for="item in chatState.historyList"
              :key="item.id"
              class="relative group"
            >
              <button 
                @click="onSelectChat(item.id)"
                :class="[
                  'w-full text-left transition cursor-pointer flex items-center relative',
                  isCollapsed 
                    ? 'w-10 h-10 mx-auto rounded-xl justify-center p-0' 
                    : 'rounded-xl p-3 pr-8',
                  chatState.activeSessionId === item.id 
                    ? 'bg-white shadow-xs border border-blue-100 font-semibold text-blue-900' 
                    : 'text-gray-700 hover:bg-white/60'
                ]"
                :title="item.title"
              >
                <!-- Active Indicator Bar -->
                <div 
                  v-if="chatState.activeSessionId === item.id" 
                  class="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r"
                ></div>

                <!-- Icon for collapsed view -->
                <svg 
                  v-if="isCollapsed" 
                  class="w-4 h-4 text-gray-500 group-hover:text-blue-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>

                <!-- Expanded text view -->
                <div v-if="!isCollapsed" class="pl-2 overflow-hidden w-full">
                  <div class="text-sm truncate">{{ item.title }}</div>
                  <div class="text-xs text-gray-400 mt-0.5 font-normal">{{ item.subtitle }}</div>
                </div>
              </button>

              <!-- Delete Chat Session Button -->
              <button 
                v-if="!isCollapsed"
                @click.stop="onDeleteSession(item.id)"
                class="absolute right-2 top-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1 rounded cursor-pointer"
                title="Hapus Sesi Percakapan"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ADMIN PANEL MODE -->
        <div v-else-if="mode === 'admin'" class="flex-1 flex flex-col min-h-0">
          <div v-if="!isCollapsed" class="text-xs font-semibold text-gray-500 tracking-wider mb-2">
            Panel Admin
          </div>

          <nav class="space-y-4 overflow-y-auto flex-1 pr-0.5">
            <!-- Grup 1: Utama -->
            <div>
              <div v-if="!isCollapsed" class="text-[11px] font-semibold text-gray-400 tracking-wider px-3 pb-1.5">
                Utama
              </div>
              <div v-else class="border-t border-gray-200/40 my-1"></div>

              <div class="space-y-1">
                <!-- 1. Metrik Sistem -->
                <router-link
                  to="/admin/metrics"
                  v-slot="{ isActive }"
                  title="Metrik Sistem"
                >
                  <div 
                    :class="[
                      'flex items-center rounded-xl text-sm font-medium transition cursor-pointer',
                      isCollapsed ? 'w-10 h-10 mx-auto justify-center p-0' : 'gap-3 px-3.5 py-2.5',
                      isActive ? 'bg-white shadow-xs text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
                    ]"
                  >
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    <span v-if="!isCollapsed" class="truncate">Metrik Sistem</span>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- Grup 2: Pengguna & Peran -->
            <div>
              <div v-if="!isCollapsed" class="text-[11px] font-semibold text-gray-400 tracking-wider px-3 pb-1.5">
                Pengguna & Peran
              </div>
              <div v-else class="border-t border-gray-200/40 my-1"></div>

              <div class="space-y-1">
                <!-- 2. Manajemen Pengguna -->
                <router-link
                  to="/admin/users"
                  v-slot="{ isActive }"
                  title="Manajemen Pengguna"
                >
                  <div 
                    :class="[
                      'flex items-center rounded-xl text-sm font-medium transition cursor-pointer',
                      isCollapsed ? 'w-10 h-10 mx-auto justify-center p-0' : 'gap-3 px-3.5 py-2.5',
                      isActive ? 'bg-white shadow-xs text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
                    ]"
                  >
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                    </svg>
                    <span v-if="!isCollapsed" class="truncate">Manajemen Pengguna</span>
                  </div>
                </router-link>

                <!-- 3. Manajemen Peran -->
                <router-link
                  to="/admin/roles"
                  v-slot="{ isActive }"
                  title="Manajemen Peran"
                >
                  <div 
                    :class="[
                      'flex items-center rounded-xl text-sm font-medium transition cursor-pointer',
                      isCollapsed ? 'w-10 h-10 mx-auto justify-center p-0' : 'gap-3 px-3.5 py-2.5',
                      isActive ? 'bg-white shadow-xs text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
                    ]"
                  >
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    <span v-if="!isCollapsed" class="truncate">Manajemen Peran</span>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- Grup 3: Basis Dokumen -->
            <div>
              <div v-if="!isCollapsed" class="text-[11px] font-semibold text-gray-400 tracking-wider px-3 pb-1.5">
                Basis Dokumen
              </div>
              <div v-else class="border-t border-gray-200/40 my-1"></div>

              <div class="space-y-1">
                <!-- 4. Manajemen Dokumen -->
                <router-link
                  to="/admin/documents"
                  v-slot="{ isActive }"
                  title="Manajemen Dokumen"
                >
                  <div 
                    :class="[
                      'flex items-center rounded-xl text-sm font-medium transition cursor-pointer',
                      isCollapsed ? 'w-10 h-10 mx-auto justify-center p-0' : 'gap-3 px-3.5 py-2.5',
                      isActive ? 'bg-white shadow-xs text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
                    ]"
                  >
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span v-if="!isCollapsed" class="truncate">Manajemen Dokumen</span>
                  </div>
                </router-link>

                <!-- 5. Klasifikasi Dokumen -->
                <router-link
                  to="/admin/master-classifications"
                  v-slot="{ isActive }"
                  title="Klasifikasi Dokumen"
                >
                  <div 
                    :class="[
                      'flex items-center rounded-xl text-sm font-medium transition cursor-pointer',
                      isCollapsed ? 'w-10 h-10 mx-auto justify-center p-0' : 'gap-3 px-3.5 py-2.5',
                      isActive ? 'bg-white shadow-xs text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
                    ]"
                  >
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    <span v-if="!isCollapsed" class="truncate">Klasifikasi Dokumen</span>
                  </div>
                </router-link>
              </div>
            </div>
          </nav>
        </div>

        <!-- AUDIT MODE -->
        <div v-else-if="mode === 'audit'" class="flex-1 flex flex-col min-h-0">
          <div v-if="!isCollapsed" class="text-xs font-semibold text-gray-500 tracking-wider mb-4">
            Audit Sistem
          </div>

          <nav class="space-y-1.5 overflow-y-auto flex-1">
            <router-link
              to="/audit/logs"
              v-slot="{ isActive }"
              title="Log Audit"
            >
              <div 
                :class="[
                  'flex items-center rounded-xl text-sm font-medium transition cursor-pointer',
                  isCollapsed ? 'w-10 h-10 mx-auto justify-center p-0' : 'gap-3 px-3.5 py-2.5',
                  isActive ? 'bg-white shadow-xs text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
                ]"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <span v-if="!isCollapsed" class="truncate">Log Audit</span>
              </div>
            </router-link>

            <router-link
              to="/admin/metrics"
              v-slot="{ isActive }"
              title="Metrik Sistem"
            >
              <div 
                :class="[
                  'flex items-center rounded-xl text-sm font-medium transition cursor-pointer',
                  isCollapsed ? 'w-10 h-10 mx-auto justify-center p-0' : 'gap-3 px-3.5 py-2.5',
                  isActive ? 'bg-white shadow-xs text-blue-600 font-semibold' : 'text-gray-700 hover:bg-white/50'
                ]"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span v-if="!isCollapsed" class="truncate">Metrik Sistem</span>
              </div>
            </router-link>
          </nav>
        </div>
      </div>

      <!-- Bottom Info -->
      <div 
        :class="[
          'pt-4 border-t border-gray-200/60',
          isCollapsed ? 'text-center' : 'text-left'
        ]"
      >
        <span v-if="!isCollapsed" class="text-xs text-gray-400">v1.0.4 • Dokumen Internal</span>
        <span v-else class="text-[10px] text-gray-400 font-bold">v1</span>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { chatState, selectSession, createNewChat, deleteSession } from '../../stores/chatStore'
import { showConfirm } from '../../stores/confirmStore'

const props = defineProps({
  mode: {
    type: String,
    default: 'admin', // 'chat' | 'admin' | 'audit'
  },
  theme: {
    type: String,
    default: 'blue', // 'blue' | 'white'
  },
  isOpenMobile: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close-mobile'])

const isCollapsed = ref(false)

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

function onSelectChat(sessionId) {
  selectSession(sessionId)
  emit('close-mobile')
}

function onNewChat() {
  createNewChat()
  emit('close-mobile')
}

function onDeleteSession(sessionId) {
  showConfirm({
    title: 'Hapus Sesi Percakapan',
    message: 'Apakah Anda yakin ingin menghapus sesi percakapan ini? Riwayat obrolan tidak dapat dipulihkan.',
    confirmText: 'Hapus Sesi',
    isDanger: true,
    onConfirm: () => {
      deleteSession(sessionId)
    }
  })
}
</script>
