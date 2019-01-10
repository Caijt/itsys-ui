import request from '@/utils/request'
import baseUrl from './baseUrl'

const BASE_URL = baseUrl+'/update_record'

export default {
	getList(params){
		return request({
			url: BASE_URL + 'getList',
			method:'get',
			params
		})
	},
	getTodoProjectList(){
		return request({
			url: BASE_URL + 'getTodoProjectList',
			method:'get'
		})
	},
	create(data){
		return request({
			url: BASE_URL + 'create',
			method:'post',
			data
		})
	},
	update(data){
		return request({
			url: BASE_URL + 'update',
			method:'post',
			data
		})
	},
	del(id){
		return request({
			url: BASE_URL + 'del',
			method:'post',
			data:{
				id
			}
		})
	}
}