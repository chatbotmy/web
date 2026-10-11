import { reactive } from 'vue'
import { showToast } from './toastStore'

export const roleState = reactive({
  roles: [
    {
      id: 1,
      name: 'CEO',
      userCount: '1 Pengguna',
      permissions: ['Public', 'Finance', 'HR', 'Legal', 'IT', 'Sales', 'Confidential'],
    },
    {
      id: 2,
      name: 'Finance',
      userCount: '25 Pengguna',
      permissions: ['Public', 'Finance'],
    },
    {
      id: 3,
      name: 'HRD',
      userCount: '12 Pengguna',
      permissions: ['Public', 'HR'],
    },
  ],
  showAddModal: false,
  showEditModal: false,
  selectedRole: null,
  roleToDelete: null,
})

export function addRole(roleData) {
  const newRole = {
    id: Date.now(),
    name: roleData.name || 'Peran Baru',
    userCount: roleData.userCount || '1 Pengguna',
    permissions: roleData.permissions && roleData.permissions.length > 0
      ? roleData.permissions
      : ['Public'],
  }
  roleState.roles.push(newRole)
  roleState.showAddModal = false
  showToast('Peran berhasil ditambahkan')
}

export function updateRole(id, roleData) {
  const index = roleState.roles.findIndex((r) => r.id === id)
  if (index !== -1) {
    roleState.roles[index] = { ...roleState.roles[index], ...roleData }
    showToast('Peran berhasil diperbarui')
  }
  roleState.showEditModal = false
}

export function deleteRole(id) {
  roleState.roles = roleState.roles.filter((r) => r.id !== id)
  showToast('Peran berhasil dihapus')
}
