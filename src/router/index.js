import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome.vue';
import User from '../components/User/User.vue';
import Rights from '../components/Rights/Rights.vue';
import Roles from '../components/Rights/Roles.vue';
import Cate from '../components/Goods/Cate.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [{
      path: "/",
      redirect: "/login"
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: "",
          component: Welcome
        },
        {
          path: "/welcome",
          component: Welcome
        },
        {
          path: '/users',
          component:User
        },
        {
          path: '/rights',
          component:Rights
        },
        {
          path: '/roles',
          component:Roles
        },
        {
          path: '/categories',
          component:Cate
        }
      ]
    }
  ]
});

// 需要使用一个判断操作来处理token的验证问题
// 导航守卫,to:表示要访问的路径，from表示的是从哪里来的，next是下一个要做的操作
router.beforeEach((to, from, next) => {
  // 如果请求是login页面那么直接处理请求即可，否则的话路由是其他功能的路由都需要token
  if (to.path == "/login") {
    return next();
  }
  const token = window.sessionStorage.getItem('token');
  if (!token) {
    return next('/login');
  }
  next();
})

export default router;
