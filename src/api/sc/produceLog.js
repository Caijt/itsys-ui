import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'
import qs from 'qs'

const BASE_URL = baseUrl +'/produce_log' 
const fields = [
	'order_id',
	'produce_list',
	'produce_date',
	'produce_amount',
	'produce_area'
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
	getOrderForm(order_id){
		return request({
			url: BASE_URL + '/getOrderForm',
			method:'get',
			params:{
				order_id
			}
		})
	},
	getLogForm(id){
		return request({
			url: BASE_URL + '/getLogForm',
			method:'get',
			params:{
				id
			}
		})
	},
	getOrderPrint(order_id){
		return request({
			url: BASE_URL + '/getOrderPrint',
			method:'get',
			params:{
				order_id
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
	getProductList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProductList',
			method:'get',
			params
		})
	},
	getProductSummaryList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProductSummaryList',
			method:'get',
			params
		})
	},
	getOrderList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getOrderList',
			method:'get',
			params
		})
	},
	getOrderTotal(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getOrderTotal',
			method:'get',
			params
		})
	},
	getNewOrderList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getNewOrderList',
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
	updateProduceStatus(data){
		data = commonJs.obj.copyByKey(data,['id','produce_status_remarks'])
		return request({
			url: BASE_URL + '/updateProduceStatus',
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
	exportOrderExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportOrderExcel?'+queryStr );
	},
	exportProductExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportProductExcel?'+queryStr );
	},
	exportSummaryExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportSummaryExcel?'+queryStr );
	},
	getNearMonthSummary(params={}){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getNearMonthSummary ',
			method:'get',
			params
		})
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