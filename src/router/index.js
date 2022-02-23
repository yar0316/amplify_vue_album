import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'
import Auth from '@aws-amplify/auth'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
import SignIn from '../views/SignIn.vue'
import AlbumIndex from '../views/album/Index.vue'
import AlbumCreate from '../views/album/Create.vue'
import AlbumEdit from '../views/album/Edit.vue'
import AlbumShow from '../views/album/Show.vue'
import PhotoCreate from '../views/photo/Create.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'AlbumIndex' }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/albums',
    name: 'AlbumIndex',
    component: AlbumIndex,
    meta: { requireAuth: true }
  },
  {
    path: '/albums/create',
    name: 'AlbumCreate',
    component: AlbumCreate,
    meta: { requireAuth: true }
  },
  {
    path: '/albums/edit',
    name: 'AlbumEdit',
    component: AlbumEdit,
    meta: { requireAuth: true }
  },
  {
    path: '/albums/show',
    name: 'AlbumShow',
    component: AlbumShow,
    meta: { requireAuth: true }
  },
  {
    path: '/photo/create',
    name: 'PhotoCreate',
    component: PhotoCreate,
    meta: { requireAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function getAuthenticatedUser () {
  return Auth.currentAuthenticatedUser()
    .then((data) => {
      if (data && data.signInUserSession) {
        store.commit('setUser', data)
        return data
      }
    })
    .catch((e) => {
      console.error(e)
      store.commit('setUser', null)
      return null
    })
}

let user

router.beforeResolve(async (to, from, next) => {
  user = await getAuthenticatedUser()

  if (to.name === 'Signin' && user) {
    return next({ name: 'AlbumIndex' })
  }

  return next()
})

onAuthUIStateChange((authState, authData) => {
  if (authState === AuthState.SignedIn && authData) {
    router.push({ name: 'AlbumIndex' })
  }
  if (authState === AuthState.SignedOut) {
    router.push({ name: 'SignIn' })
  }
})

export default router
