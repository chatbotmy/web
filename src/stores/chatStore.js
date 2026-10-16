import { reactive } from 'vue'

const dummyConversations = {
  curr: {
    title: 'Sesi Saat Ini',
    messages: [
      {
        sender: 'user',
        text: 'Cara Mengajukan Cuti',
        time: '10:14',
      },
      {
        sender: 'bot',
        text: `Berikut cara mengajukan cuti:
1. Cek aturan cuti di perusahaan (jenis cuti & syaratnya).
2. Tentukan tanggal cuti dan koordinasi singkat dengan atasan/tim.
3. Ajukan secara resmi lewat aplikasi HR atau email.
4. Tunggu persetujuan dari atasan/HR.
5. Lakukan serah terima pekerjaan (handover) sebelum cuti dimulai.`,
        feedback: null,
      },
    ],
  },
  it: {
    title: 'IT Policy',
    messages: [
      {
        sender: 'user',
        text: 'Bagaimana ringkasan IT Security Policy kantor kita?',
        time: '09:00',
      },
      {
        sender: 'bot',
        text: `Ringkasan IT Security Policy:
1. Kata sandi wajib diganti setiap 90 hari minimal 12 karakter.
2. Dilarang menginstal perangkat lunak tanpa izin tim IT Support.
3. Selalu kunci layar laptop (Win + L) saat meninggalkan meja kerja.
4. Gunakan VPN perusahaan saat mengakses jaringan kantor dari luar.`,
        feedback: 'up',
      },
    ],
  },
  laptop: {
    title: 'Prosedur Membawa Laptop ke Rumah',
    messages: [
      {
        sender: 'user',
        text: 'Bagaimana prosedur membawa laptop kantor ke luar/rumah?',
        time: 'Kemarin',
      },
      {
        sender: 'bot',
        text: `Prosedur Membawa Laptop Kantor:
1. Isi formulir izin peminjaman / mobilitas perangkat di portal Asset Management.
2. Dapatkan persetujuan Head of Department (HOD).
3. Pastikan enkripsi BitLocker aktif dan terdaftar di inventaris tim IT.
4. Jangan tinggalkan perangkat di kendaraan umum tanpa pengawasan.`,
        feedback: null,
      },
    ],
  },
  company: {
    title: 'Profil Perusahaan',
    messages: [
      {
        sender: 'user',
        text: 'Bisakah jelaskan visi dan misi perusahaan?',
        time: '3 hari lalu',
      },
      {
        sender: 'bot',
        text: `Visi & Misi Perusahaan:
- Visi: Menjadi pelopor solusi teknologi cerdas, aman, dan berintegritas tinggi di Asia Tenggara.
- Misi:
  1. Memberikan layanan terbaik berbasis AI dan otomatisasi.
  2. Menjaga kerahasiaan dan kepatuhan data sesuai standar ISO 27001.
  3. Membangun kultur kerja kolaboratif dan inovatif.`,
        feedback: 'up',
      },
    ],
  },
}

import { authState } from './authStore'
import { recordAuditLog } from './auditStore'

export const chatState = reactive({
  currentInput: '',
  activeSessionId: 'curr',
  isLoading: false,
  historyList: [
    { id: 'curr', title: 'Sesi Saat Ini', subtitle: 'Hari Ini' },
    { id: 'it', title: 'IT Policy', subtitle: '2 Jam Lalu' },
    { id: 'laptop', title: 'Prosedur Membawa Laptop ke Rumah', subtitle: 'Kemarin' },
    { id: 'company', title: 'Profil Perusahaan', subtitle: '3 Hari Lalu' },
  ],
  quickPrompts: [
    'Cara Mengajukan Cuti',
    'Bocoran Rencana Merger Direksi',
    'Siapa Juara Piala Dunia 2022?',
    'Kebijakan Remote Working',
  ],
  messages: [...dummyConversations.curr.messages],
  feedbackGiven: null,
})

export function selectSession(sessionId) {
  chatState.activeSessionId = sessionId
  chatState.feedbackGiven = null
  if (dummyConversations[sessionId]) {
    chatState.messages = [...dummyConversations[sessionId].messages]
  } else {
    chatState.messages = []
  }
}

export function selectQuickPrompt(promptText) {
  chatState.currentInput = promptText
}

export function sendMessage(customText) {
  const query = (customText || chatState.currentInput).trim()
  if (!query || chatState.isLoading) return

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // Push user message
  chatState.messages.push({
    sender: 'user',
    text: query,
    time: currentTime,
  })

  chatState.currentInput = ''
  chatState.isLoading = true

  // Simulate smart RAG response
  setTimeout(() => {
    const qLower = query.toLowerCase()
    const currentUser = authState.currentUser || { name: 'Karyawan Demo', username: 'user_demo', role: 'Finance' }
    const isCeoOrAdmin = currentUser.role === 'CEO' || currentUser.roleType === 'admin'

    // Skenario 1: Pertanyaan dokumen rahasia di luar hak akses peran (Confidential / Critical)
    const isConfidentialQuery = 
      qLower.includes('merger') || 
      qLower.includes('bocoran') || 
      qLower.includes('rahasia') || 
      qLower.includes('gaji direksi') || 
      qLower.includes('dewan komisaris') || 
      qLower.includes('akuisisi')

    // Skenario 2: Pertanyaan di luar cakupan dokumen internal perusahaan
    const isOutOfScopeQuery = 
      qLower.includes('piala dunia') || 
      qLower.includes('presiden') || 
      qLower.includes('resep') || 
      qLower.includes('cuaca') || 
      qLower.includes('puisi') || 
      qLower.includes('game') || 
      qLower.includes('juara') ||
      qLower.includes('siapa kamu')

    let reply = ''

    if (isConfidentialQuery && !isCeoOrAdmin) {
      reply = `⛔ Akses Ditolak (Pelanggaran Izin Dokumen)\n\nDokumen terkait ("Rencana Strategis & Merger Q4.pdf") berada di bawah klasifikasi "Confidential" dengan Tingkat Keamanan "Critical".\n\nPeran akun Anda saat ini (${currentUser.role}) tidak memiliki izin akses untuk membaca klasifikasi berkas tersebut. Upaya akses ini telah dicatat secara otomatis dalam Log Audit Keamanan Sistem.`
      
      recordAuditLog({
        user: currentUser.name,
        username: currentUser.username,
        action: 'Query Chatbot (Akses Ditolak)',
        detailText: `Upaya akses dokumen rahasia: "${query}"`,
        documents: ['Rencana-Merger-Q4.pdf'],
        status: 'Gagal',
      })
    } else if (isOutOfScopeQuery) {
      reply = `⚠️ Di Luar Cakupan Dokumen Internal\n\nSistem AI Chatbot ini dibatasi secara ketat hanya untuk mencari informasi berbasis dokumen resmi operasional perusahaan (SOP, HR, Kebijakan Kantor, dan Finansial).\n\nPertanyaan Anda ("${query}") berada di luar lingkup pengetahuan dokumen internal kami. Silakan ajukan pertanyaan seputar prosedur kerja, kebijakan HR, atau operasional kantor.`

      recordAuditLog({
        user: currentUser.name,
        username: currentUser.username,
        action: 'Query Chatbot (Di Luar Cakupan)',
        detailText: `Pertanyaan di luar cakupan dokumen: "${query}"`,
        documents: [],
        status: 'Warning',
      })
    } else if (qLower.includes('cuti')) {
      reply = `Berikut cara mengajukan cuti:\n1. Cek aturan cuti di perusahaan (jenis cuti & syaratnya).\n2. Tentukan tanggal cuti dan koordinasi singkat dengan atasan/tim.\n3. Ajukan secara resmi lewat aplikasi HR atau email.\n4. Tunggu persetujuan dari atasan/HR.\n5. Lakukan serah terima pekerjaan (handover) sebelum cuti dimulai.`
      recordAuditLog({
        user: currentUser.name,
        username: currentUser.username,
        action: 'Query Chatbot',
        detailText: `Pertanyaan prosedur cuti`,
        documents: ['Pedoman-Karyawan-2025.pdf'],
        status: 'Berhasil',
      })
    } else if (qLower.includes('remote') || qLower.includes('wfh')) {
      reply = `Kebijakan Remote Working (WFA/WFH):\n1. Kuota WFH maksimal 2 hari per minggu sesuai persetujuan manajer divisi.\n2. Wajib hadir online di Slack / Teams selama jam kerja reguler (09.00 - 17.00).\n3. Lakukan daily check-in dan perbarui status pekerjaan.`
      recordAuditLog({
        user: currentUser.name,
        username: currentUser.username,
        action: 'Query Chatbot',
        detailText: `Pertanyaan kebijakan remote working`,
        documents: ['Kebijakan-WFH-2025.pdf'],
        status: 'Berhasil',
      })
    } else if (qLower.includes('reimburse') || qLower.includes('klaim')) {
      reply = `Prosedur Reimbursement:\n1. Kumpulkan bukti transaksi resmi (maksimal 30 hari sejak transaksi).\n2. Buka portal Keuangan > Pengajuan Klaim.\n3. Unggah foto bukti dan isi rincian biaya pengeluaran.\n4. Tim Finance akan memproses pencairan maksimal 5 hari kerja setelah disetujui.`
      recordAuditLog({
        user: currentUser.name,
        username: currentUser.username,
        action: 'Query Chatbot',
        detailText: `Pertanyaan prosedur reimbursement`,
        documents: ['SOP-Klaim-Reimbursement.pdf'],
        status: 'Berhasil',
      })
    } else {
      reply = `Berdasarkan dokumen internal yang ditemukan:\n\nTerkait pertanyaan "${query}", sistem merekomendasikan untuk mengikuti SOP standar operasional perusahaan dan berkoordinasi dengan departemen terkait sesuai hak akses yang berlaku.`
      recordAuditLog({
        user: currentUser.name,
        username: currentUser.username,
        action: 'Query Chatbot',
        detailText: `Pertanyaan umum dokumen: "${query}"`,
        documents: ['Panduan-Operasional-Internal.pdf'],
        status: 'Berhasil',
      })
    }

    chatState.messages.push({
      sender: 'bot',
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      feedback: null,
    })

    if (!dummyConversations[chatState.activeSessionId]) {
      dummyConversations[chatState.activeSessionId] = {
        title: query.slice(0, 25),
        messages: [],
      }
    }
    dummyConversations[chatState.activeSessionId].messages = [...chatState.messages]

    chatState.isLoading = false
  }, 1200)
}

export function giveFeedback(type, index) {
  chatState.feedbackGiven = type
  if (typeof index === 'number' && chatState.messages[index]) {
    chatState.messages[index].feedback = type
    return
  }
  for (let i = chatState.messages.length - 1; i >= 0; i--) {
    if (chatState.messages[i].sender === 'bot') {
      chatState.messages[i].feedback = type
      break
    }
  }
}

export function createNewChat() {
  const newId = 'session_' + Date.now()
  const title = `Percakapan Baru #${chatState.historyList.length + 1}`
  chatState.historyList.unshift({
    id: newId,
    title: title,
    subtitle: 'Baru Saja',
  })
  dummyConversations[newId] = {
    title: title,
    messages: [],
  }
  chatState.activeSessionId = newId
  chatState.messages = []
  chatState.currentInput = ''
  chatState.feedbackGiven = null
}

export function deleteSession(sessionId) {
  // Remove from historyList
  const idx = chatState.historyList.findIndex((item) => item.id === sessionId)
  if (idx !== -1) {
    chatState.historyList.splice(idx, 1)
  }
  delete dummyConversations[sessionId]

  // If deleted session was active, select another session or clear
  if (chatState.activeSessionId === sessionId) {
    if (chatState.historyList.length > 0) {
      selectSession(chatState.historyList[0].id)
    } else {
      chatState.activeSessionId = null
      chatState.messages = []
    }
  }
}

export function resetChat() {
  chatState.messages = []
  chatState.currentInput = ''
  chatState.feedbackGiven = null
  chatState.isLoading = false
}
