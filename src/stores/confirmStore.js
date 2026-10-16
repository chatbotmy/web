import { reactive } from 'vue'

export const confirmState = reactive({
  visible: false,
  title: 'Konfirmasi Tindakan',
  message: 'Apakah Anda yakin ingin menghapus data ini?',
  confirmText: 'Hapus',
  cancelText: 'Batal',
  onConfirmCallback: null,
})

export function showConfirm({
  title = 'Konfirmasi Hapus',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  confirmText = 'Hapus',
  cancelText = 'Batal',
  onConfirm = () => {},
}) {
  confirmState.title = title
  confirmState.message = message
  confirmState.confirmText = confirmText
  confirmText = cancelText
  confirmState.onConfirmCallback = onConfirm
  confirmState.visible = true
}

export function handleConfirm() {
  if (confirmState.onConfirmCallback) {
    confirmState.onConfirmCallback()
  }
  confirmState.visible = false
}

export function handleCancel() {
  confirmState.visible = false
}
