<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Navbar -->
    <AppNavbar variant="default" :show-top-logout="true" />

    <!-- Body Layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <AppSidebar mode="chat" theme="blue" />

      <!-- Main Chat Area -->
      <main class="flex-1 flex flex-col justify-between h-[calc(100vh-4rem)] bg-white relative">
        <!-- Chat Content Area -->
        <div class="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-center">
          <!-- Empty / Welcome State (L-005 / User interface 1) -->
          <div v-if="chatState.messages.length === 0" class="max-w-2xl mx-auto w-full text-center my-auto">
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
            <div class="flex flex-wrap justify-center gap-3">
              <button
                v-for="prompt in chatState.quickPrompts"
                :key="prompt"
                @click="onSelectQuickPrompt(prompt)"
                class="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 text-sm font-medium rounded-xl border border-gray-200 hover:border-gray-300 transition shadow-xs"
              >
                {{ prompt }}
              </button>
            </div>
          </div>

          <!-- Active Conversation State (L-008 & L-009) -->
          <div v-else class="max-w-3xl mx-auto w-full space-y-6 my-auto py-4">
            <template v-for="(msg, idx) in chatState.messages" :key="idx">
              <!-- User Message -->
              <div v-if="msg.sender === 'user'" class="flex justify-end">
                <div class="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-2.5 text-sm font-medium shadow-xs max-w-md">
                  {{ msg.text }}
                </div>
              </div>

              <!-- Bot Response -->
              <div v-else class="flex items-start gap-3 justify-start">
                <!-- Bot Mini Icon -->
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0 mt-1">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2a1 1 0 0 1 1 1v1h2a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1V7a3 3 0 0 1 3-3h2V3a1 1 0 0 1 1-1zm5 5H7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-8 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-6 5h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5z"/>
                  </svg>
                </div>

                <div class="flex flex-col items-start">
                  <!-- Bot Text Bubble -->
                  <div class="bg-[#EEF2F9] text-gray-900 rounded-2xl rounded-tl-sm p-4 text-sm leading-relaxed whitespace-pre-line max-w-lg shadow-xs">
                    {{ msg.text }}
                  </div>

                  <!-- Thumbs Up / Down Feedback (L-008, L-009) -->
                  <div class="flex items-center gap-2 mt-2 ml-1 text-gray-600">
                    <button 
                      @click="onFeedback('up')"
                      :class="[
                        'p-1 rounded hover:text-black transition',
                        chatState.feedbackGiven === 'up' ? 'text-black font-bold scale-110' : 'text-gray-500'
                      ]"
                      title="Jawaban membantu"
                    >
                      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.22 8.79 7 9.3 7 9.83v7.34C7 18.27 7.73 19 8.63 19h8.04c.83 0 1.54-.5 1.84-1.22l3.32-6.9z"/>
                      </svg>
                    </button>

                    <button 
                      @click="onFeedback('down')"
                      :class="[
                        'p-1 rounded hover:text-black transition',
                        chatState.feedbackGiven === 'down' ? 'text-black font-bold scale-110' : 'text-gray-500'
                      ]"
                      title="Jawaban kurang tepat"
                    >
                      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h2V4zM2.17 11.12c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h5.5l-.92 4.65c-.05.22-.02.46.08.66.23.45.52.86.88 1.22L10 22l6.41-6.41c.37-.38.59-.89.59-1.42V6.83C17 5.73 16.27 5 15.37 5H7.33c-.83 0-1.54.5-1.84 1.22l-3.32 6.9z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Chat Input & Bottom Footer -->
        <div class="p-6 max-w-4xl mx-auto w-full">
          <!-- Text Input Box (L-006) -->
          <form @submit.prevent="handleSend" class="relative">
            <input 
              v-model="chatState.currentInput"
              type="text"
              placeholder="Ketik pertanyaan Anda di sini..."
              class="w-full pl-5 pr-14 py-3.5 bg-gray-50 md:bg-white rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-xs"
            />
            <button 
              type="submit"
              :disabled="!chatState.currentInput"
              :class="[
                'absolute right-2.5 top-2.5 w-9 h-9 rounded-xl flex items-center justify-center transition shadow-xs',
                chatState.currentInput ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-white cursor-not-allowed'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
              </svg>
            </button>
          </form>

          <!-- Footer Metadata (User interface 1) -->
          <div class="flex items-center justify-between text-xs text-gray-400 mt-2.5 px-2">
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
import { onMounted } from 'vue'
import AppNavbar from '../components/common/AppNavbar.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import { 
  chatState, 
  selectQuickPrompt, 
  sendMessage, 
  giveFeedback,
  loadSampleConversation,
  resetChat 
} from '../stores/chatStore'
import { showToast } from '../stores/toastStore'

function onSelectQuickPrompt(prompt) {
  selectQuickPrompt(prompt)
}

function handleSend() {
  if (chatState.currentInput.trim()) {
    sendMessage()
  }
}

function onFeedback(type) {
  giveFeedback(type)
}
</script>
