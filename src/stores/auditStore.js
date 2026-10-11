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
  ],
  searchQuery: '',
  activeFilter: 'Semua', // 'Semua' | 'Berhasil' | 'Gagal' | 'Warning'
})

export function exportLogs() {
  showToast('Log berhasil diexport')
}

export function exportLogsCsv() {
  showToast('Log berhasil diexport ke CSV')
}
