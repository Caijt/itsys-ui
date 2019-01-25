import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'

const BASE_URL = baseUrl +'/store' 
const fields = [
	'project_id',
	'order_id',
	'contract_id',
	'xc_storage_date',
	'material_type',
	'material_status',
	'material_stock',
	'other_material_stock',
	'hardware_storage_date',
	'hardware_status',
	'hardware_stock'
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
	getSummaryList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummaryList',
			method:'get',
			params
		})
	},
	getListByProject(projectId){
		return request({
			url: BASE_URL + '/getListByProject',
			method:'get',
			params:{
				projectId
			}
		})
	},
	getSummaryListByOrder(params){
		params = commonJs.obj.removeNullKey(params)
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummaryListByOrder',
			method:'get',
			params
		})
	},
	getToStorageOrderTotal(){
		return request({
			url: BASE_URL + '/getToStorageOrderTotal',
			method:'get'
		})
	},
	getTodoProjectList (){
		return request({
			url: BASE_URL + '/getTodoProjectList ',
			method:'get'
		})
	},
	create(data){
		data = commonJs.obj.copyByKey(data,fields)
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
	},
	getTotal (params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getTotal',
			method:'get',
			params
		})
	},
}