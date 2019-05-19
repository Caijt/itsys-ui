import axios from 'axios'
import { Message } from 'element-ui'
import Qs from 'qs'
import store from '@/store'

const service = axios.create({
  //baseURL: process.env.BASE_API, // api的base_url 如果前端跟后端不在同一个服务器上，可以使用
  // timeout: 15000 // 请求超时时间
})
//这是post请求，可以直接发送对象

service.defaults.headers.delete["Content-Type"] = "application/x-www-form-urlencoded"
service.defaults.transformRequest = [(data)=> {return Qs.stringify(data,{indices:false})}]

service.defaults.paramsSerializer = (params)=> {
  return Qs.stringify(params,{indices:false})
}

// 可以在请求头添加对应信息
service.interceptors.request.use(config => {
  let token = sessionStorage.getItem("token")
  if (token) {
    config.headers['Authorization'] = "Bearer "+token // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})


/**
* respone拦截器
* 对请求返回的错误进统一处理
*/
service.interceptors.response.use(
  response => {
	  /**
	  * 对接口请求成功返回的错误进统一处理
		*/
    const res = response.data
    // code大于40000的为全局错误码，
    if(res.code > 40000) {
      // 40001：未检测到登录信息
      if(res.code == 40001) {
        
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
        store.dispatch('logout')
      }
      // 40002：
      if(res.code == 40002) {
      	//错误处理
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(res.message)
    }

    // code小于0的，为不可预料的错误码
    if (res.code < 0) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      // if (res.code == 401) {
      //   MessageBox.confirm('你的登录信息已过期，请重新登录', '确定登出', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload()// 为了重新实例化vue-router对象 避免bug
      //     })
      //   })
      // }
      return Promise.reject(res.message)
    } 
    
    // code为0视为正常，也有一些局部需要为1或者2，然后到页面具体处理的
    return response.data
  },
  error => {
  	/*
  	* 对接口请求失败进行统一处理
  	*/
    console.log('err:' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
