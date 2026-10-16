import { reactive } from 'vue'
import { showToast } from './toastStore'

export const userState = reactive({
  users: [
    {
      id: 1,
      name: 'Alexander Hartanto',
      username: 'alex_ceo',
      email: 'alex@company.com',
      role: 'CEO',
      department: 'Executive Board',
      status: 'Aktif',
      joinDate: '2023-01-10',
      avatar: 'AH',
    },
    {
      id: 2,
      name: 'Rina Kusuma',
      username: 'rina_fin',
      email: 'rina.k@company.com',
      role: 'Finance',
      department: 'Finance & Accounting',
      status: 'Aktif',
      joinDate: '2023-03-15',
      avatar: 'RK',
    },
    {
      id: 3,
      name: 'Ahmad Rizki',
      username: 'karyawan_user',
      email: 'ahmad.r@company.com',
      role: 'Finance',
      department: 'Finance & Accounting',
      status: 'Aktif',
      joinDate: '2023-05-20',
      avatar: 'AR',
    },
    {
      id: 4,
      name: 'Maya Melinda',
      username: 'maya_hr',
      email: 'maya.m@company.com',
      role: 'HRD',
      department: 'Human Resources',
      status: 'Aktif',
      joinDate: '2023-07-01',
      avatar: 'MM',
    },
    {
      id: 5,
      name: 'Dewi Lestari',
      username: 'dewi_fin',
      email: 'dewi.l@company.com',
      role: 'Finance',
      department: 'Finance & Accounting',
      status: 'Aktif',
      joinDate: '2023-09-12',
      avatar: 'DL',
    },
    {
      id: 6,
      name: 'Dian Sastro',
      username: 'dian_hr',
      email: 'dian.s@company.com',
      role: 'HRD',
      department: 'Human Resources',
      status: 'Nonaktif',
      joinDate: '2023-11-05',
      avatar: 'DS',
    },
  ],
  searchQuery: '',
  filterRole: 'Semua', // 'Semua' | 'CEO' | 'Finance' | 'HRD'
  showAddModal: false,
  showEditModal: false,
})

export function addUser(userData) {
  const initials = (userData.name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const newUser = {
    id: Date.now(),
    name: userData.name,
    username: userData.username || userData.name.toLowerCase().replace(/\s+/g, '_'),
    email: userData.email,
    role: userData.role || 'Finance',
    department: userData.department || 'Operasional',
    status: userData.status || 'Aktif',
    joinDate: new Date().toISOString().split('T')[0],
    avatar: initials,
  }

  userState.users.unshift(newUser)
  userState.showAddModal = false
  showToast(`Karyawan ${newUser.name} berhasil ditambahkan`)
}

export function updateUser(id, updatedData) {
  const index = userState.users.findIndex((u) => u.id === id)
  if (index !== -1) {
    userState.users[index] = { ...userState.users[index], ...updatedData }
    showToast('Data karyawan berhasil diperbarui')
  }
  userState.showEditModal = false
}

export function deleteUser(id) {
  userState.users = userState.users.filter((u) => u.id !== id)
  showToast('Karyawan berhasil dihapus')
}

export function toggleUserStatus(id) {
  const user = userState.users.find((u) => u.id === id)
  if (user) {
    user.status = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif'
    showToast(`Status akun ${user.name} diubah menjadi ${user.status}`)
  }
}
