import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UserChatView from '../views/UserChatView.vue'
import SystemMetricsView from '../views/SystemMetricsView.vue'
import RoleManagementView from '../views/RoleManagementView.vue'
import DocumentManagementView from '../views/DocumentManagementView.vue'
import MasterPermissionsView from '../views/MasterPermissionsView.vue'
import MasterClassificationsView from '../views/MasterClassificationsView.vue'
import AuditLogView from '../views/AuditLogView.vue'
import AuditorDashboardView from '../views/AuditorDashboardView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: UserChatView,
  },
  {
    path: '/admin/metrics',
    name: 'SystemMetrics',
    component: SystemMetricsView,
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: SystemMetricsView,
  },
  {
    path: '/admin/roles',
    name: 'RoleManagement',
    component: RoleManagementView,
  },
  {
    path: '/admin/documents',
    name: 'DocumentManagement',
    component: DocumentManagementView,
  },
  {
    path: '/admin/master-permissions',
    name: 'MasterPermissions',
    component: MasterPermissionsView,
  },
  {
    path: '/admin/master-classifications',
    name: 'MasterClassifications',
    component: MasterClassificationsView,
  },
  {
    path: '/audit/logs',
    name: 'AuditLogs',
    component: AuditLogView,
  },
  {
    path: '/auditor',
    name: 'AuditorDashboard',
    component: AuditorDashboardView,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
