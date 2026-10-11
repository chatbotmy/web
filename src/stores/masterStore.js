import { reactive } from 'vue'
import { showToast } from './toastStore'

export const masterState = reactive({
  permissions: [
    { id: 1, name: 'All Documents', description: 'Akses ke semua dokumen tanpa batasan' },
    { id: 2, name: 'HR', description: 'Akses ke dokumen Human Resources' },
    { id: 3, name: 'Finance', description: 'Akses ke dokumen keuangan' },
    { id: 4, name: 'Legal', description: 'Akses ke dokumen legal' },
    { id: 5, name: 'Confidential', description: 'Akses ke dokumen rahasia' },
    { id: 6, name: 'Public Documents', description: 'Akses ke dokumen publik' },
  ],
  classifications: [
    { id: 1, name: 'Public', description: 'Dokumen yang dapat diakses semua karyawan', level: 'LOW' },
    { id: 2, name: 'HR', description: 'Dokumen terkait sumber daya manusia', level: 'MEDIUM' },
    { id: 3, name: 'Finance', description: 'Dokumen keuangan perusahaan', level: 'HIGH' },
    { id: 4, name: 'Legal', description: 'Dokumen legal dan hukum', level: 'HIGH' },
    { id: 5, name: 'Confidential', description: 'Dokumen rahasia tingkat tinggi', level: 'CRITICAL' },
  ],
})

export function deleteMasterPermission(id) {
  masterState.permissions = masterState.permissions.filter((p) => p.id !== id)
  showToast('Izin akses berhasil dihapus')
}

export function deleteMasterClassification(id) {
  masterState.classifications = masterState.classifications.filter((c) => c.id !== id)
  showToast('Klasifikasi berhasil dihapus')
}
