import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: '首页',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/device',
    component: Layout,
    redirect: '/device/list',
    name: 'device',
    meta: { title: '设备管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'ListDevice',
        component: () => import('@/views/device/list'),
        meta: { title: '设备列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'AddDevice',
        component: () => import('@/views/device/create'),
        meta: { title: '新增设备', icon: 'form' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/device/edit'),
        name: 'EditDevice',
        meta: { title: '编辑设备', noCache: true, activeMenu: '/device/list' },
        hidden: true
      }
    ]
  },
  {
    path: '/miner',
    component: Layout,
    redirect: '/miner/list',
    name: 'miner',
    meta: { title: '矿工管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'listMiner',
        component: () => import('@/views/miner/list'),
        meta: { title: '矿工列表', icon: 'table' }
      },
      // {
      //   path: 'add',
      //   name: 'addMiner',
      //   component: () => import('@/views/miner/create'),
      //   meta: { title: '新增矿工', icon: 'form' }
      // },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/miner/edit'),
        name: 'EditMiner',
        meta: { title: '编辑矿工', noCache: true, activeMenu: '/miner/list' },
        hidden: true
      }
    ]
  },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  {
    path: '/trade',
    component: Layout,
    redirect: '/trade',
    children: [
      {
        path: 'trade',
        name: '申请列表',
        component: () => import('@/views/trade/list'),
        meta: { title: '申请列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'user',
    meta: { title: '设置', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'ListUser',
        component: () => import('@/views/user/list'),
        meta: { title: '管理员列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'AddUser',
        component: () => import('@/views/user/create'),
        meta: { title: '新增管理员', icon: 'form' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/user/edit'),
        name: 'EditUser',
        meta: {
          title: '编辑管理员',
          noCache: true,
          activeMenu: '/user/list'
        },
        hidden: true
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/views/logs/list'),
        meta: { title: '日志列表', icon: 'table' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
