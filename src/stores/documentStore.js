import { reactive } from 'vue'
import { showToast } from './toastStore'

export const documentState = reactive({
  documents: [
    {
      id: 1,
      name: 'Paduan Karyawan 2025',
      type: 'PDF',
      size: '2.5  MB',
      classification: 'Public',
      uploadDate: '2025-01-15',
    },
    {
      id: 2,
      name: 'Laporan Keuangan Q1',
      type: 'XLSX',
      size: '1.7  MB',
      classification: 'Finance',
      uploadDate: '2025-01-17',
    },
    {
      id: 3,
      name: 'Kontrak Vendor ABC',
      type: 'PDF',
      size: '1.9  MB',
      classification: 'Legal',
      uploadDate: '2025-01-18',
    },
    {
      id: 4,
      name: 'Data Kompensasi 2025',
      type: 'PDF',
      size: '2.8  MB',
      classification: 'HR',
      uploadDate: '2025-02-01',
    },
    {
      id: 5,
      name: 'Invoice 2025',
      type: 'PDF',
      size: '2.5  MB',
      classification: 'Finance',
      uploadDate: '2025-02-08',
    },
    {
      id: 6,
      name: 'Asset Device Management',
      type: 'XLSX',
      size: '3.1  MB',
      classification: 'IT',
      uploadDate: '2025-02-19',
    },
    {
      id: 7,
      name: 'Quotation PQ-2301',
      type: 'PDF',
      size: '2.5  MB',
      classification: 'Sales',
      uploadDate: '2025-02-24',
    },
  ],
  searchQuery: '',
  showAddModal: false,
})

export function addDocument(docData) {
  const newDoc = {
    id: Date.now(),
    name: docData.name || 'Dokumen Baru 2025.pdf',
    type: docData.type || 'PDF',
    size: docData.size || '2.0  MB',
    classification: docData.classification || 'Public',
    uploadDate: new Date().toISOString().split('T')[0],
  }
  documentState.documents.unshift(newDoc)
  documentState.showAddModal = false
  showToast('Dokumen berhasil ditambahkan')
}

export function deleteDocument(id) {
  documentState.documents = documentState.documents.filter((d) => d.id !== id)
  showToast('Dokumen berhasil dihapus')
}

export function refreshIndex() {
  showToast('Index dokumen berhasil diperbarui')
}
