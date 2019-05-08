import request from '@/utils/request'
import baseUrl from './baseUrl'
const BASE_URL = baseUrl +'/auth' 
export default { 
	qywxAuthUrl: baseUrl + '/wx/a',
	login( username , password ) {
		return request({
	    url: BASE_URL + '/validate',
	    method: 'post',
	    data: {
	      username,
	      password
	    }
	  })
	},
	getUserInfo(){
		return request({
			url: BASE_URL + '/getUserInfo',
			method: 'get'
		})
	}
}