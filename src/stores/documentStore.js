import { reactive } from 'vue'
import { showToast } from './toastStore'

export const documentState = reactive({
  documents: [
    {
      id: 1,
      name: 'Panduan Karyawan 2025.pdf',
      type: 'Pdf',
      size: '2.5 MB',
      classifications: ['Public', 'HR'],
      uploadDate: '2025-01-15',
    },
    {
      id: 2,
      name: 'Laporan Keuangan Q1.xlsx',
      type: 'Xlsx',
      size: '1.7 MB',
      classifications: ['Finance'],
      uploadDate: '2025-01-17',
    },
    {
      id: 3,
      name: 'Kontrak Vendor Rekanan.pdf',
      type: 'Pdf',
      size: '1.9 MB',
      classifications: ['Legal', 'Finance'],
      uploadDate: '2025-01-18',
    },
    {
      id: 4,
      name: 'Struktur Kompensasi & Gaji.pdf',
      type: 'Pdf',
      size: '2.8 MB',
      classifications: ['HR', 'Confidential'],
      uploadDate: '2025-02-01',
    },
    {
      id: 5,
      name: 'Invoice Layanan Cloud 2025.pdf',
      type: 'Pdf',
      size: '2.5 MB',
      classifications: ['Finance', 'IT'],
      uploadDate: '2025-02-08',
    },
    {
      id: 6,
      name: 'Asset Device Management.xlsx',
      type: 'Xlsx',
      size: '3.1 MB',
      classifications: ['IT'],
      uploadDate: '2025-02-19',
    },
    {
      id: 7,
      name: 'Quotation Proyek ERP.pdf',
      type: 'Pdf',
      size: '2.5 MB',
      classifications: ['Sales', 'Finance'],
      uploadDate: '2025-02-24',
    },
  ],
  searchQuery: '',
  showAddModal: false,
  isIndexing: false,
  indexingProgress: 0,
  indexingStage: '',
})

export function addDocument(docData) {
  const newDoc = {
    id: Date.now(),
    name: docData.name || 'Dokumen Baru 2025.pdf',
    type: docData.type || 'PDF',
    size: docData.size || '1.8 MB',
    classifications: docData.classifications && docData.classifications.length > 0 
      ? docData.classifications 
      : ['Public'],
    uploadDate: new Date().toISOString().split('T')[0],
  }
  documentState.documents.unshift(newDoc)
  documentState.showAddModal = false
  showToast(`Dokumen ${newDoc.name} Berhasil Ditambahkan`)
}

export function deleteDocument(id) {
  documentState.documents = documentState.documents.filter((d) => d.id !== id)
  showToast('Dokumen Berhasil Dihapus')
}

export function startIndexing(onComplete = () => {}) {
  documentState.isIndexing = true
  documentState.indexingProgress = 0
  documentState.indexingStage = 'Membaca dan membedah dokumen PDF/XLSX...'

  const interval = setInterval(() => {
    documentState.indexingProgress += 10

    if (documentState.indexingProgress === 30) {
      documentState.indexingStage = 'Memecah teks menjadi potongan semantik (Semantic Chunking)...'
    } else if (documentState.indexingProgress === 60) {
      documentState.indexingStage = 'Menghasilkan representasi vektor embeddings dengan model AI...'
    } else if (documentState.indexingProgress === 85) {
      documentState.indexingStage = 'Menyinkronkan basis data vektor (Milvus/ChromaDB)...'
    } else if (documentState.indexingProgress >= 100) {
      clearInterval(interval)
      documentState.indexingProgress = 100
      documentState.indexingStage = 'Pembaruan basis pengetahuan AI selesai'
      setTimeout(() => {
        documentState.isIndexing = false
        showToast('Basis Pengetahuan Chatbot AI Berhasil Diperbarui')
        onComplete()
      }, 700)
    }
  }, 350)
}
