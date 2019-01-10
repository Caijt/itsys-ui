import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'
import qs from 'qs'

const BASE_URL = baseUrl +'/product' 
const fields = [
	'order_id',
	'project_id',
	'plan_id',
	'contract_id',
	'finish_area',
	'series',
	'model',
	'remarks',
	'window_style',
	'product_status',
	'product_date'
]

export default {
	getForm(id){
		return request({
			url: BASE_URL + '/getForm',
			method:'get',
			params:{
				id
			}
		})
	},
	getList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getList',
			method:'get',
			params
		})
	},
	getSummary(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummary',
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
	getToProductOrderTotal(){
		return request({
			url: BASE_URL + '/getToProductOrderTotal',
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
	productFinish(order_id){
		return request({
			url: BASE_URL + '/productFinish',
			method:'post',
			data:{
				order_id
			}
		})
	},
	updateInfo(data){
		data = commonJs.obj.copyByKey(data,['order_id','product_status'])
		return request({
			url: BASE_URL + '/updateInfo',
			method:'post',
			data
		})
	},
	exportExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportExcel?'+queryStr );
	},
	exportSummaryExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportSummaryExcel?'+queryStr );
	},
	getTimeStatistic(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getTimeStatistic',
			method:'get',
			params
		})
	},
}