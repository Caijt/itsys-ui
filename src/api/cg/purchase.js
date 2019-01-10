import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'

const BASE_URL = baseUrl +'/purchase' 
const fields = [
	'order_id',
	'project_id',
	'plan_id',
	'purchase_price',
	'purchase_date',
	'delivery_date',
	'demand_plan',
	'purchase_status',
	'is_finish',
	'brand',
	'xc_purchase_price',
	'xc_purchase_date',
	'xc_delivery_date',
	'xc_demand_plan',
	'xc_is_finish',
	'xc_purchase_status',
	'xc_brand'
]

export default {
	getList(params){
		return request({
			url: BASE_URL + '/getList',
			method:'get',
			params
		})
	},
	getSummaryList(params){
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
		return request({
			url: BASE_URL + '/getSummaryListByOrder',
			method:'get',
			params
		})
	},
	getToPurchaseOrderTotal(){
		return request({
			url: BASE_URL + '/getToPurchaseOrderTotal',
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
	}
}