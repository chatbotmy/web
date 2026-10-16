import { reactive } from 'vue'

const savedUser = localStorage.getItem('auth_user')
const savedIsLoggedIn = localStorage.getItem('auth_logged_in') === 'true'

export const authState = reactive({
  isLoggedIn: savedIsLoggedIn,
  currentUser: savedUser ? JSON.parse(savedUser) : {
    username: 'user1',
    name: 'Ahmad Rizki',
    role: 'Karyawan Finance',
    roleType: 'user', // 'user' | 'admin' | 'auditor'
    initial: 'AR',
  },
  demoAccounts: {
    user: {
      username: 'karyawan_user',
      password: 'user123',
      name: 'Ahmad Rizki',
      role: 'Karyawan Finance',
      roleType: 'user',
      initial: 'AR',
      redirect: '/chat',
    },
    admin: {
      username: 'super_admin',
      password: 'admin123',
      name: 'Budi Santoso (Admin)',
      role: 'System Administrator',
      roleType: 'admin',
      initial: 'BS',
      redirect: '/admin/metrics',
    },
    auditor: {
      username: 'auditor_internal',
      password: 'audit123',
      name: 'Siti Nurhalizah',
      role: 'Auditor Kepatuhan',
      roleType: 'auditor',
      initial: 'SN',
      redirect: '/audit/logs',
    },
  },
})

export function loginAs(roleKey) {
  const account = authState.demoAccounts[roleKey]
  if (account) {
    authState.currentUser = {
      username: account.username,
      name: account.name,
      role: account.role,
      roleType: account.roleType,
      initial: account.initial,
    }
    authState.isLoggedIn = true
    localStorage.setItem('auth_logged_in', 'true')
    localStorage.setItem('auth_user', JSON.stringify(authState.currentUser))
    return account.redirect
  }
  return '/chat'
}

export function loginWithCredentials(username, password) {
  const u = username.toLowerCase().trim()
  const p = password.trim()

  // Match against demo accounts
  for (const key of Object.keys(authState.demoAccounts)) {
    const acc = authState.demoAccounts[key]
    if (acc.username.toLowerCase() === u && acc.password === p) {
      return loginAs(key)
    }
  }

  // Fallback heuristics for custom typing
  if (u.includes('admin')) {
    authState.currentUser = {
      username: username,
      name: 'Budi Santoso (Admin)',
      role: 'System Administrator',
      roleType: 'admin',
      initial: 'BS',
    }
    authState.isLoggedIn = true
    localStorage.setItem('auth_logged_in', 'true')
    localStorage.setItem('auth_user', JSON.stringify(authState.currentUser))
    return '/admin/metrics'
  } else if (u.includes('audit')) {
    authState.currentUser = {
      username: username,
      name: 'Siti Nurhalizah',
      role: 'Auditor Kepatuhan',
      roleType: 'auditor',
      initial: 'SN',
    }
    authState.isLoggedIn = true
    localStorage.setItem('auth_logged_in', 'true')
    localStorage.setItem('auth_user', JSON.stringify(authState.currentUser))
    return '/audit/logs'
  } else if (u && p) {
    authState.currentUser = {
      username: username,
      name: username,
      role: 'Karyawan',
      roleType: 'user',
      initial: username.charAt(0).toUpperCase(),
    }
    authState.isLoggedIn = true
    localStorage.setItem('auth_logged_in', 'true')
    localStorage.setItem('auth_user', JSON.stringify(authState.currentUser))
    return '/chat'
  }

  return null
}

export function logoutUser() {
  authState.isLoggedIn = false
  localStorage.removeItem('auth_logged_in')
  localStorage.removeItem('auth_user')
}

export function switchRole(roleType) {
  if (authState.demoAccounts[roleType]) {
    const acc = authState.demoAccounts[roleType]
    authState.currentUser = {
      username: acc.username,
      name: acc.name,
      role: acc.role,
      roleType: acc.roleType,
      initial: acc.initial,
    }
    authState.isLoggedIn = true
    localStorage.setItem('auth_logged_in', 'true')
    localStorage.setItem('auth_user', JSON.stringify(authState.currentUser))
  }
}
