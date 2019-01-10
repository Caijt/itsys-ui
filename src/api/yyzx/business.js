import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'

const BASE_URL = baseUrl + '/business'  

//基本字段
let fields = [
	'project_id',
	'offer_no',
	'quoter',
	'offer_content',
	'contract_check',
	'matching_degree',
	'is_submit'
]
export default {

	getList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getList',
			method:'get',
			params
		})
	},
	getTodoProjectList(){
		return request({
			url: BASE_URL + '/getTodoProjectList',
			method:'get'
		})
	},
	create(data){
		data = commonJs.obj.copyByKey(data,[...fields])
		return request({
			url: BASE_URL + '/create',
			method:'post',
			data
		})
	},
	update(data){
		data = commonJs.obj.copyByKey(data,[...fields,'id'])
		return request({
			url: BASE_URL + '/update',
			method:'post',
			data
		})
	},
	del(id){
		return request({
			url: BASE_URL + '/del',
			method:'post',
			data:{
				id
			}
		})
	}
}