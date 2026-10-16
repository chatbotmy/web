<template>
  <div class="h-screen bg-white flex flex-col overflow-hidden">
    <!-- Navbar with Mobile Hamburger trigger -->
    <AppNavbar 
      variant="default" 
      :show-top-logout="true" 
      @toggle-sidebar="mobileDrawerOpen = !mobileDrawerOpen"
    />

    <!-- Body Layout -->
    <div class="flex flex-1 overflow-hidden relative">
      <!-- Sidebar -->
      <AppSidebar 
        mode="chat" 
        theme="blue" 
        :is-open-mobile="mobileDrawerOpen"
        @close-mobile="mobileDrawerOpen = false"
      />

      <!-- Main Chat Area -->
      <main class="flex-1 flex flex-col justify-between h-full bg-white relative overflow-hidden">
        <!-- Chat Content Area -->
        <div 
          ref="chatScrollContainer"
          class="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col justify-start"
        >
          <!-- Empty / Welcome State (L-005 / User interface 1) -->
          <div v-if="chatState.messages.length === 0" class="max-w-2xl mx-auto w-full text-center my-auto py-8">
            <!-- Center Chat Bubble Icon -->
            <div class="flex justify-center mb-6">
              <div class="w-16 h-16 text-blue-600 flex items-center justify-center">
                <svg class="w-16 h-16 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
            </div>

            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Selamat datang di Chatbot Cerdas & Aman
            </h1>
            <p class="text-gray-500 text-sm md:text-base mb-8">
              Ajukan pertanyaan tentang dokumen internal perusahaan
            </p>

            <!-- Quick Prompts Buttons -->
            <div class="flex flex-wrap justify-center gap-2.5">
              <button
                v-for="prompt in chatState.quickPrompts"
                :key="prompt"
                @click="onSelectQuickPrompt(prompt)"
                class="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs md:text-sm font-medium rounded-xl border border-gray-200 hover:border-blue-400 hover:text-blue-600 transition shadow-xs"
              >
                {{ prompt }}
              </button>
            </div>
          </div>

          <!-- Active Conversation State (L-008 & L-009) -->
          <div v-else class="max-w-3xl mx-auto w-full space-y-6 py-4">
            <template v-for="(msg, idx) in chatState.messages" :key="idx">
              <!-- User Message -->
              <div v-if="msg.sender === 'user'" class="flex justify-end">
                <div class="bg-blue-600 text-white rounded-2xl rounded-tr-xs px-5 py-3 text-sm font-medium shadow-xs max-w-[85%] md:max-w-md">
                  <p class="leading-relaxed">{{ msg.text }}</p>
                  <span class="block text-[10px] text-blue-200 text-right mt-1">{{ msg.time }}</span>
                </div>
              </div>

              <!-- Bot Response -->
              <div v-else class="flex items-start gap-3 justify-start">
                <!-- Bot Mini Icon -->
                <div class="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2a1 1 0 0 1 1 1v1h2a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1V7a3 3 0 0 1 3-3h2V3a1 1 0 0 1 1-1zm5 5H7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-8 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-6 5h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5z"/>
                  </svg>
                </div>

                <div class="flex flex-col items-start max-w-[85%] md:max-w-lg">
                  <!-- Bot Text Bubble -->
                  <div class="bg-[#EEF2F9] text-gray-900 rounded-2xl rounded-tl-xs p-4 text-sm leading-relaxed whitespace-pre-line shadow-xs text-left">
                    {{ msg.text }}
                  </div>

                  <!-- Thumbs Up / Down Feedback (L-008, L-009) with playful spring animations -->
                  <div class="flex items-center gap-2 mt-2 ml-1 text-gray-600">
                    <button 
                      @click="onFeedback('up', idx)"
                      :class="[
                        'p-1.5 rounded-lg transition duration-200 active:scale-75 flex items-center gap-1',
                        msg.feedback === 'up' 
                          ? 'text-blue-600 bg-blue-50 scale-110 shadow-xs' 
                          : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'
                      ]"
                      title="Jawaban membantu"
                    >
                      <svg 
                        :class="['w-4 h-4 fill-current transition-transform duration-300', msg.feedback === 'up' ? 'scale-125' : '']" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.22 8.79 7 9.3 7 9.83v7.34C7 18.27 7.73 19 8.63 19h8.04c.83 0 1.54-.5 1.84-1.22l3.32-6.9z"/>
                      </svg>
                      <span v-if="msg.feedback === 'up'" class="text-[11px] font-semibold text-blue-600 animate-fade-in">Membantu</span>
                    </button>

                    <button 
                      @click="onFeedback('down', idx)"
                      :class="[
                        'p-1.5 rounded-lg transition duration-200 active:scale-75 flex items-center gap-1',
                        msg.feedback === 'down' 
                          ? 'text-red-500 bg-red-50 scale-110 shadow-xs' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                      ]"
                      title="Jawaban kurang tepat"
                    >
                      <svg 
                        :class="['w-4 h-4 fill-current transition-transform duration-300', msg.feedback === 'down' ? 'scale-125' : '']" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h2V4zM2.17 11.12c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h5.5l-.92 4.65c-.05.22-.02.46.08.66.23.45.52.86.88 1.22L10 22l6.41-6.41c.37-.38.59-.89.59-1.42V6.83C17 5.73 16.27 5 15.37 5H7.33c-.83 0-1.54.5-1.84 1.22l-3.32 6.9z"/>
                      </svg>
                      <span v-if="msg.feedback === 'down'" class="text-[11px] font-semibold text-red-500 animate-fade-in">Kurang tepat</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- Waiting Bot Response Loading State (Like ChatGPT Three Dots) -->
            <div v-if="chatState.isLoading" class="flex items-start gap-3 justify-start animate-fade-in">
              <div class="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                <svg class="w-4 h-4 fill-current animate-pulse" viewBox="0 0 24 24">
                  <path d="M12 2a1 1 0 0 1 1 1v1h2a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1V7a3 3 0 0 1 3-3h2V3a1 1 0 0 1 1-1zm5 5H7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-8 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-6 5h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5z"/>
                </svg>
              </div>

              <!-- Typing bubble with bouncing dots -->
              <div class="bg-[#EEF2F9] rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style="animation-delay: 0ms;"></span>
                <span class="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style="animation-delay: 150ms;"></span>
                <span class="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style="animation-delay: 300ms;"></span>
                <span class="text-xs text-gray-500 font-medium ml-2">Menyiapkan jawaban...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input & Bottom Footer -->
        <div class="p-4 md:p-6 max-w-4xl mx-auto w-full">
          <!-- Text Input Box (L-006) -->
          <form @submit.prevent="handleSend" class="relative">
            <input 
              v-model="chatState.currentInput"
              type="text" 
              :disabled="chatState.isLoading"
              placeholder="Ketik pertanyaan Anda di sini... (tekan Enter)"
              class="w-full pl-5 pr-14 py-3.5 bg-gray-50 md:bg-white rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-xs disabled:opacity-70 disabled:cursor-not-allowed"
            />

            <!-- Send button / loader spinner -->
            <button 
              type="submit" 
              :disabled="!chatState.currentInput.trim() || chatState.isLoading"
              :class="[
                'absolute right-2.5 top-2.5 w-9 h-9 rounded-xl flex items-center justify-center transition shadow-xs',
                chatState.currentInput.trim() && !chatState.isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-90' 
                  : 'bg-gray-300 text-white cursor-not-allowed'
              ]"
            >
              <!-- Spinner when loading -->
              <svg 
                v-if="chatState.isLoading" 
                class="animate-spin w-4 h-4 text-white" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <!-- Arrow Icon -->
              <svg 
                v-else 
                class="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
              </svg>
            </button>
          </form>

          <!-- Footer Metadata (User interface 1) -->
          <div class="flex items-center justify-between text-[11px] md:text-xs text-gray-400 mt-2.5 px-2">
            <div class="flex items-center gap-1.5">
              <span>⚡</span>
              <span>Powered by RAG + Llama 3</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span>🔒</span>
              <span>End-to-end encrypted</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import { 
  chatState, 
  selectQuickPrompt, 
  sendMessage, 
  giveFeedback 
} from '../stores/chatStore'

const mobileDrawerOpen = ref(false)
const chatScrollContainer = ref(null)

function scrollToBottom() {
  nextTick(() => {
    if (chatScrollContainer.value) {
      chatScrollContainer.value.scrollTop = chatScrollContainer.value.scrollHeight
    }
  })
}

watch(
  () => chatState.messages.length,
  () => {
    scrollToBottom()
  }
)

watch(
  () => chatState.isLoading,
  () => {
    scrollToBottom()
  }
)

function onSelectQuickPrompt(prompt) {
  selectQuickPrompt(prompt)
}

function handleSend() {
  if (chatState.currentInput.trim()) {
    sendMessage()
    scrollToBottom()
  }
}

function onFeedback(type, index) {
  giveFeedback(type, index)
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
