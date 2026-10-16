import { reactive } from 'vue'
import { showToast } from './toastStore'

export const masterPermissionsList = [
  'Public',
  'Finance',
  'HR',
  'Legal',
  'IT',
  'Sales',
  'Confidential',
]

export const roleState = reactive({
  roles: [
    {
      id: 1,
      name: 'CEO',
      description: 'Eksekutif tertinggi dengan akses penuh ke seluruh dokumen perusahaan',
      members: [
        { id: 'u1', name: 'Alexander Hartanto', email: 'alex@company.com', avatar: 'AH' }
      ],
      permissions: ['Public', 'Finance', 'HR', 'Legal', 'Confidential'],
    },
    {
      id: 2,
      name: 'Finance',
      description: 'Departemen keuangan dan anggaran operasional perusahaan',
      members: [
        { id: 'u2', name: 'Rina Kusuma', email: 'rina.k@company.com', avatar: 'RK' },
        { id: 'u3', name: 'Dewi Lestari', email: 'dewi.l@company.com', avatar: 'DL' },
        { id: 'u4', name: 'Ahmad Rizki', email: 'ahmad.r@company.com', avatar: 'AR' },
        { id: 'u5', name: 'Bambang Tri', email: 'bambang.t@company.com', avatar: 'BT' },
      ],
      permissions: ['Public', 'Finance'],
    },
    {
      id: 3,
      name: 'HRD',
      description: 'Departemen pengelolaan sumber daya manusia dan kebijakan karyawan',
      members: [
        { id: 'u6', name: 'Maya Melinda', email: 'maya.m@company.com', avatar: 'MM' },
        { id: 'u7', name: 'Dian Sastro', email: 'dian.s@company.com', avatar: 'DS' },
      ],
      permissions: ['Public', 'HR'],
    },
    {
      id: 4,
      name: 'Legal Counsel',
      description: 'Departemen hukum, audit regulasi, dan kontrak perjanjian',
      members: [
        { id: 'u8', name: 'Bagus Pratama', email: 'bagus.p@company.com', avatar: 'BP' },
      ],
      permissions: ['Public', 'Legal'],
    },
    {
      id: 5,
      name: 'IT Security',
      description: 'Pengelolaan infrastruktur server dan keamanan siber internal',
      members: [
        { id: 'u9', name: 'Fajar Nugraha', email: 'fajar.n@company.com', avatar: 'FN' },
        { id: 'u10', name: 'Eko Prasetyo', email: 'eko.p@company.com', avatar: 'EP' },
      ],
      permissions: ['Public', 'Confidential'],
    },
  ],
  showAddModal: false,
  showEditModal: false,
  showMembersModal: false,
  activeRoleForMembers: null,
})

export function addRole(roleData) {
  const newRole = {
    id: Date.now(),
    name: roleData.name || 'Peran Baru',
    description: roleData.description || 'Deskripsi peran baru',
    members: roleData.members || [],
    permissions: roleData.permissions && roleData.permissions.length > 0
      ? roleData.permissions
      : ['Public'],
  }
  roleState.roles.push(newRole)
  roleState.showAddModal = false
  showToast('Peran Berhasil Ditambahkan')
}

export function updateRole(id, roleData) {
  const index = roleState.roles.findIndex((r) => r.id === id)
  if (index !== -1) {
    roleState.roles[index] = { ...roleState.roles[index], ...roleData }
    showToast('Peran Berhasil Diperbarui')
  }
  roleState.showEditModal = false
}

export function deleteRole(id) {
  roleState.roles = roleState.roles.filter((r) => r.id !== id)
  showToast('Peran Berhasil Dihapus')
}

export function openMembersModal(role) {
  roleState.activeRoleForMembers = role
  roleState.showMembersModal = true
}
