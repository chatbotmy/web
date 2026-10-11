import { reactive } from 'vue'

export const authState = reactive({
  currentUser: {
    username: 'user1',
    name: 'User 1',
    role: 'Karyawan Finance',
    roleType: 'user', // 'user' | 'admin' | 'auditor'
    initial: 'U',
  },
  users: {
    user: {
      username: 'user1',
      name: 'User 1',
      role: 'Karyawan Finance',
      roleType: 'user',
      initial: 'U',
    },
    admin: {
      username: 'admin1',
      name: 'Admin 1',
      role: 'Administrator',
      roleType: 'admin',
      initial: 'A',
    },
    auditor: {
      username: 'auditor1',
      name: 'Auditor 1',
      role: 'Auditor',
      roleType: 'auditor',
      initial: 'A',
    },
  },
})

export function switchRole(roleType) {
  if (authState.users[roleType]) {
    authState.currentUser = { ...authState.users[roleType] }
  }
}
