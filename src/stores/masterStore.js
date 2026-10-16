import { reactive } from 'vue'
import { showToast } from './toastStore'

export const masterState = reactive({
  permissions: [
    { id: 1, name: 'Public', description: 'Akses umum ke seluruh panduan dan pedoman kerja perusahaan', module: 'Dokumen', userCount: 38 },
    { id: 2, name: 'HR', description: 'Akses ke dokumen Human Resources dan data personalia', module: 'Dokumen', userCount: 2 },
    { id: 3, name: 'Finance', description: 'Akses ke dokumen keuangan, invoice, dan anggaran', module: 'Dokumen', userCount: 5 },
    { id: 4, name: 'Legal', description: 'Akses ke kontrak kerja sama dan dokumen hukum', module: 'Dokumen', userCount: 1 },
    { id: 5, name: 'Confidential', description: 'Akses ke dokumen rahasia dewan direksi', module: 'Keamanan', userCount: 1 },
    { id: 6, name: 'All Documents', description: 'Akses super admin ke seluruh berkas tanpa batasan', module: 'System', userCount: 1 },
  ],
  classifications: [
    { id: 1, name: 'Public', description: 'Dokumen yang dapat diakses semua karyawan', level: 'Low', docCount: 4 },
    { id: 2, name: 'HR', description: 'Dokumen terkait sumber daya manusia', level: 'Medium', docCount: 2 },
    { id: 3, name: 'Finance', description: 'Dokumen keuangan dan laporan budget perusahaan', level: 'High', docCount: 3 },
    { id: 4, name: 'Legal', description: 'Dokumen legal, perizinan, dan hukum', level: 'High', docCount: 1 },
    { id: 5, name: 'IT', description: 'Dokumen infrastruktur teknis dan keamanan sistem', level: 'Medium', docCount: 2 },
    { id: 6, name: 'Sales', description: 'Dokumen penawaran klien dan strategi penjualan', level: 'Medium', docCount: 1 },
    { id: 7, name: 'Confidential', description: 'Dokumen rahasia tingkat tinggi', level: 'Critical', docCount: 1 },
  ],
})

export function addMasterPermission(data) {
  masterState.permissions.push({
    id: Date.now(),
    name: data.name,
    description: data.description,
    module: data.module || 'Dokumen',
    userCount: 0,
  })
  showToast('Izin Akses Berhasil Ditambahkan')
}

export function deleteMasterPermission(id) {
  masterState.permissions = masterState.permissions.filter((p) => p.id !== id)
  showToast('Izin Akses Berhasil Dihapus')
}

export function addMasterClassification(data) {
  masterState.classifications.push({
    id: Date.now(),
    name: data.name,
    description: data.description,
    level: data.level || 'Medium',
    docCount: 0,
  })
  showToast('Klasifikasi Berhasil Ditambahkan')
}

export function deleteMasterClassification(id) {
  masterState.classifications = masterState.classifications.filter((c) => c.id !== id)
  showToast('Klasifikasi Berhasil Dihapus')
}
