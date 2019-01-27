import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import layout from '@/views/layout'
import Cookies from 'js-cookie'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'// Progress 进度条样式

const _import = require('./_import_' + process.env.NODE_ENV);
Vue.use(Router)

let router = new Router({
  routes: [
    { path:'/', redirect:'/index/updateRecord'},
    // { 
    //   path:'/demo', 
    //   component:_import('/demo/index'),
    //   alias:'/',
    //   meta: {
    //     noAuth: true
    //   }
    // },
    {
      path: '/login',
      name: 'login',
      component: _import('/login'),
      meta: {
        noAuth: true
      }
    },
    {
      path: '/qywxAuth/:path?',
      name: 'qywxAuth',
      component: _import('/qywxAuth'),
      props:true,
      meta: {
        title:'微信企业认证',
        noAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(window.location)
  NProgress.start()
  store.dispatch('initSysConfig').then(()=>{
    /* 判断要访问的路由是否需要权限访问 */
    if( to.meta && to.meta.noAuth ){
      next()
    }else{
      /* 判断是否有sessionId */
      //if( store.getters.hasSession ) {
      //暂时处理hasSession有时返回false的bug
      if( Cookies.get( 'PHPSESSID' ) ? true : false ) {
        /* 判断是否已读取用户信息 */
        if( store.getters.hasUserInfo ) {
          next()
        }else {
          /* 获取用户信息 */
          store.dispatch('getUserInfo').then( res => {
            //newRouters.push( { path: '*', redirect: '/404', hidden: true } )
            //router.options.routes.push(...newRouters)
            //
            let menuList = res.data.menuList
            //console.log(res)

            let menuRouters = [] 
            /*先取出模块，没有父id的就是模块菜单*/
            menuList.forEach((m,i)=>{
              //console.log(i)
              if(m.parent_id==null){
                m.fullPath = '/'+m.path
                let module = {
                  path: '/' + m.path,
                  component: layout,
                  meta:{ id:m.id, title:m.title, fullPath:'/'+m.path},
                  children:[
                    {
                      path:'',
                      component:_import('/'+m.path+'/index'),
                      meta:{
                        menuHide:true,
                        title:m.title
                      }
                    }
                  ]
                }
                menuRouters.push(module)
              }
            })
            function convertTree(routers){
              routers.forEach(r=>{
                menuList.forEach((m,i)=>{
                  if(m.parent_id && m.parent_id == r.meta.id){
                    if(!r.children) r.children = []
                    m.fullPath = r.meta.fullPath+'/'+m.path
                    let menu = {
                      path: m.path,
                      //component: () => import('@/views'+r.meta.fullPath+'/'+m.path),
                      component: _import(r.meta.fullPath+'/'+m.path),
                      meta:{ id:m.id, title:m.title, fullPath:r.meta.fullPath+'/'+m.path}
                    }
                    r.children.push(menu)
                    //console.log(i)
                    //menuList.splice(i,1)
                   // i--
                  }
                })
                if(r.children) convertTree(r.children)
              })
            }
            convertTree(menuRouters)
            menuRouters.unshift({
              path:'/index',
              component: layout,
              meta:{ title:'首页', fullPath:'/index'},
              children:[
                { 
                  path:'updateRecord',
                  component:_import('/index/updateRecord'),
                  meta:{ title:'系统更新记录', fullPath:'/index/updateRecord'},
                },
                { 
                  path:'modifyPwd',
                  component:_import('/index/modifyPwd'),
                  meta:{ title:'修改密码', fullPath:'/index/modifyPwd'},
                },
                { 
                  path:'loginLog',
                  component:_import('/index/loginLog'),
                  meta:{ title:'登录日志', fullPath:'/index/loginLog'},
                }
              ]
            })
            store.dispatch('setRouters',menuRouters)
            router.addRoutes(menuRouters)
            router.addRoutes( [{ path: '*', redirect: '/index/updateRecord' } ])
            next({ ...to, replace: true })
          })
        }
      }else{
        next('/login')
      }
    }
  })
  
  
})

router.afterEach((to,from) => {
  NProgress.done() // 结束Progress
  if(to.meta && to.meta.title){
    document.title = to.meta.title + ' | '+ store.state.sys.title
  }else{
    document.title = store.state.sys.title
  }
})

export default router
