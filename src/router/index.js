import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'
import Auth from '@aws-amplify/auth'
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
    component: AlbumIndex
  },
  {
    path: '/albums/create',
    name: 'AlbumCreate',
    component: AlbumCreate
  },
  {
    path: '/albums/edit',
    name: 'AlbumEdit',
    component: AlbumEdit
  },
  {
    path: '/albums/show',
    name: 'AlbumShow',
    component: AlbumShow
  },
  {
    path: '/photo/create',
    name: 'PhotoCreate',
    component: PhotoCreate
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

router.beforeResolve(async (to, from, next) => {
  await getAuthenticatedUser()

  return next()
})

export default router
