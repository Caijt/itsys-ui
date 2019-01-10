import request from '@/utils/request'
import baseUrl from './baseUrl'

const BASE_URL = baseUrl+'/config'

export default {
	getValue(key){
		return request({
			url: BASE_URL + '/getValue',
			method:'get',
			params:{
				key
			}
		})
	},
}