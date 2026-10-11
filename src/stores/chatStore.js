import { reactive } from 'vue'

export const chatState = reactive({
  currentInput: '',
  activeSession: 'Sesi saat ini',
  historyList: [
    { id: 'curr', title: 'Sesi saat ini', subtitle: 'Hari ini', active: true },
    { id: 'it', title: 'IT Policy', active: false },
    { id: 'laptop', title: 'Prosedur membawa laptop ke rumah', active: false },
    { id: 'company', title: 'Company profile perusahaan', active: false },
  ],
  quickPrompts: [
    'Cara mengajukan cuti',
    'Kebijakan remote working',
    'Prosedur reimbursement',
  ],
  messages: [],
  feedbackGiven: null, // 'up' | 'down' | null
})

export function selectQuickPrompt(promptText) {
  chatState.currentInput = promptText
}

export function sendMessage(customText) {
  const query = customText || chatState.currentInput
  if (!query) return

  chatState.messages.push({
    sender: 'user',
    text: query,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })

  // Simulated bot response matching the screenshot
  setTimeout(() => {
    chatState.messages.push({
      sender: 'bot',
      text: `Berikut cara mengajukan cuti:
1. Cek aturan cuti di perusahaan (jenis cuti & syaratnya).
2. Tentukan tanggal cuti dan koordinasi singkat dengan atasan/tim.
3. Ajukan secara resmi lewat aplikasi HR atau email.
4. Tunggu persetujuan dari atasan/HR.
5. Lakukan handover sebelum cuti dimulai.`,
      feedback: null,
    })
  }, 300)

  chatState.currentInput = ''
}

export function giveFeedback(type) {
  chatState.feedbackGiven = type
  if (chatState.messages.length > 0) {
    const lastMsg = chatState.messages[chatState.messages.length - 1]
    if (lastMsg.sender === 'bot') {
      lastMsg.feedback = type
    }
  }
}

export function resetChat() {
  chatState.messages = []
  chatState.currentInput = ''
  chatState.feedbackGiven = null
}

export function loadSampleConversation() {
  chatState.messages = [
    {
      sender: 'user',
      text: 'Cara Mengajukan Cuti',
    },
    {
      sender: 'bot',
      text: `Berikut cara mengajukan cuti:
1. Cek aturan cuti di perusahaan (jenis cuti & syaratnya).
2. Tentukan tanggal cuti dan koordinasi singkat dengan atasan/tim.
3. Ajukan secara resmi lewat aplikasi HR atau email.
4. Tunggu persetujuan dari atasan/HR.
5. Lakukan handover sebelum cuti dimulai.`,
      feedback: null,
    },
  ]
}
