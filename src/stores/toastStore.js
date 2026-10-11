import { reactive } from 'vue'

export const toastState = reactive({
  visible: false,
  title: 'Notification',
  message: '',
  timeoutId: null,
})

export function showToast(message, title = 'Notification', duration = 3000) {
  if (toastState.timeoutId) {
    clearTimeout(toastState.timeoutId)
  }
  toastState.title = title
  toastState.message = message
  toastState.visible = true

  toastState.timeoutId = setTimeout(() => {
    toastState.visible = false
  }, duration)
}

export function hideToast() {
  if (toastState.timeoutId) {
    clearTimeout(toastState.timeoutId)
  }
  toastState.visible = false
}
