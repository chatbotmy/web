<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
    <!-- Router View for pages -->
    <router-view />

    <!-- Global Toast Notification matching screenshot popup -->
    <ToastNotification />

    <!-- Global Confirmation Modal for deletion dialogs -->
    <ConfirmModal />
  </div>
</template>

<script setup>
import ToastNotification from './components/common/ToastNotification.vue'
import ConfirmModal from './components/common/ConfirmModal.vue'
</script>
