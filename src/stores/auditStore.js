import { reactive } from 'vue'
import { showToast } from './toastStore'

export const auditState = reactive({
  logs: [
    {
      id: 1,
      timestamp: '2025-11-25 09:30:00',
      user: 'Ahmad Rizki',
      username: 'user123',
      action: 'Query sumitted',
      detailText: 'Cara Mengajukan cuti?',
      documents: ['Panduan-karyawan-2025.pdf', 'Kebijakan-HR.pdf'],
      ipAddress: '192.168.1.10',
      status: 'Berhasil',
    },
    {
      id: 2,
      timestamp: '2025-11-18 14:45:15',
      user: 'Siti Nurhalizah',
      username: 'siti_n',
      action: 'Login attempt',
      detailText: 'Login berhasil',
      documents: [],
      ipAddress: '192.168.1.53',
      status: 'Berhasil',
    },
    {
      id: 3,
      timestamp: '2025-11-17 16:10:20',
      user: 'Lia Anggraini',
      username: 'lia_a',
      action: 'Login attempt',
      detailText: 'Password incorrect',
      documents: [],
      ipAddress: '192.168.1.99',
      status: 'Gagal',
    },
    {
      id: 4,
      timestamp: '2025-11-10 11:00:00',
      user: 'Arief Wicaksono',
      username: 'arief_w',
      action: 'API Call',
      detailText: 'Mencoba query 50.000 entri data (melebihi batas normal 10.000).',
      documents: [],
      ipAddress: '192.168.1.40',
      status: 'Warning',
    },
    {
      id: 5,
      timestamp: '2025-11-09 08:05:55',
      user: 'Nadya Putri',
      username: 'nadya_p',
      action: 'Query submitted',
      detailText: 'Login berhasil',
      documents: [],
      ipAddress: '192.168.1.200',
      status: 'Berhasil',
    },
    {
      id: 6,
      timestamp: '2025-11-01 13:20:10',
      user: 'Budi Santoso',
      username: 'budi_s',
      action: 'Document View',
      detailText: 'Melihat dokumen pedoman operasional',
      documents: ['Pedoman-Operasional.pdf'],
      ipAddress: '192.168.1.88',
      status: 'Berhasil',
    },
    {
      id: 7,
      timestamp: '2025-10-28 10:15:33',
      user: 'Bambang Soedarmono',
      username: 'bambang_s',
      action: 'Akses Ditolak',
      detailText: 'Mencoba menanyakan isi dokumen confidential tanpa izin akses',
      documents: ['Struktur Kompensasi & Gaji.pdf'],
      ipAddress: '192.168.1.77',
      status: 'Gagal',
    },
    {
      id: 8,
      timestamp: '2025-10-25 15:40:02',
      user: 'Dewi Lestari',
      username: 'dewi_l',
      action: 'Out of Scope Query',
      detailText: 'Pertanyaan di luar konteks korporat ditolak otomatis oleh sistem',
      documents: [],
      ipAddress: '192.168.1.112',
      status: 'Warning',
    },
  ],
  searchQuery: '',
  activeFilter: 'Semua', // 'Semua' | 'Berhasil' | 'Gagal' | 'Warning'
})

export function downloadLogsAsCsv(logsToExport, filename = 'audit_logs.csv') {
  const data = logsToExport || auditState.logs
  if (!data || data.length === 0) {
    showToast('Tidak ada data log untuk diexport')
    return
  }

  const headers = ['ID', 'Timestamp', 'Pengguna', 'Username', 'Aksi', 'Detail', 'Dokumen', 'IP Address', 'Status']
  const rows = data.map((item) => [
    item.id,
    `"${item.timestamp}"`,
    `"${item.user}"`,
    `"${item.username}"`,
    `"${item.action}"`,
    `"${(item.detailText || '').replace(/"/g, '""')}"`,
    `"${(item.documents || []).join('; ')}"`,
    `"${item.ipAddress}"`,
    `"${item.status}"`,
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  showToast(`Berhasil mengunduh ${data.length} baris log CSV`)
}

export function recordAuditLog(logEntry) {
  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: logEntry.user || 'Karyawan Demo',
    username: logEntry.username || 'user_demo',
    action: logEntry.action || 'Query Chatbot',
    detailText: logEntry.detailText || '',
    documents: logEntry.documents || [],
    ipAddress: logEntry.ipAddress || '192.168.1.105',
    status: logEntry.status || 'Berhasil',
  }
  auditState.logs.unshift(newLog)
}

export function exportLogs() {
  downloadLogsAsCsv(auditState.logs, 'audit_logs_sistem.csv')
}

export function exportLogsCsv() {
  downloadLogsAsCsv(auditState.logs, 'audit_logs_kepatuhan.csv')
}
