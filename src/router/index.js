import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UserChatView from '../views/UserChatView.vue'
import SystemMetricsView from '../views/SystemMetricsView.vue'
import RoleManagementView from '../views/RoleManagementView.vue'
import DocumentManagementView from '../views/DocumentManagementView.vue'
import MasterPermissionsView from '../views/MasterPermissionsView.vue'
import MasterClassificationsView from '../views/MasterClassificationsView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import AuditLogView from '../views/AuditLogView.vue'
import AuditorDashboardView from '../views/AuditorDashboardView.vue'
import { authState } from '../stores/authStore'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: UserChatView,
    meta: { requiresAuth: true, roles: ['user', 'admin', 'auditor'] },
  },
  {
    path: '/admin/metrics',
    name: 'SystemMetrics',
    component: SystemMetricsView,
    meta: { requiresAuth: true, roles: ['admin', 'auditor'] },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: SystemMetricsView,
    meta: { requiresAuth: true, roles: ['admin', 'auditor'] },
  },
  {
    path: '/admin/roles',
    name: 'RoleManagement',
    component: RoleManagementView,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: UserManagementView,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/documents',
    name: 'DocumentManagement',
    component: DocumentManagementView,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/master-permissions',
    redirect: '/admin/master-classifications',
  },
  {
    path: '/admin/master-classifications',
    name: 'MasterClassifications',
    component: MasterClassificationsView,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/audit/logs',
    name: 'AuditLogs',
    component: AuditLogView,
    meta: { requiresAuth: true, roles: ['auditor', 'admin'] },
  },
  {
    path: '/auditor',
    redirect: '/audit/logs',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation Guard (Middleware)
router.beforeEach((to, from, next) => {
  const isLoggedIn = authState.isLoggedIn
  const userRole = authState.currentUser?.roleType || 'user'

  // If page is public (e.g. login)
  if (to.meta.public) {
    if (isLoggedIn && to.path === '/login') {
      // Redirect already logged in user to their dashboard
      if (userRole === 'admin') return next('/admin/metrics')
      if (userRole === 'auditor') return next('/audit/logs')
      return next('/chat')
    }
    return next()
  }

  // If route requires auth and user is not logged in
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  // Check role authorization
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    // If unauthorized, redirect to appropriate home
    if (userRole === 'admin') return next('/admin/metrics')
    if (userRole === 'auditor') return next('/audit/logs')
    return next('/chat')
  }

  next()
})

export default router
