import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'

const BASE_URL = baseUrl + '/product_demand_plan' 
const fields = [
	'erp_order_no',
	'order_id',
	'project_id',
	'is_purchase',
	'purchase_type',
	'purchase_oa',
	'is_self',
	'self_area',
	'self_amount',
	'is_out',
	'out_area',
	'out_amount'
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
	getSummaryListByOrder(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummaryListByOrder',
			method:'get',
			params
		})
	},
	
	getToPlanOrderTotal (){
		return request({
			url: BASE_URL + '/getToPlanOrderTotal ',
			method:'get'
		})
	},
	create(data){
		data = commonJs.obj.copyByKey(data,fields)
		data.purchase_type=data.purchase_type.join(',')
		return request({
			url: BASE_URL + '/create',
			method:'post',
			data
		})
	},
	update(data){
		data = commonJs.obj.copyByKey(data,[...fields,'id'])
		data.purchase_type=data.purchase_type.join(',')
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