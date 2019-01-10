import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'
import qs from 'qs'

const BASE_URL = baseUrl + '/receive_payment_record'  

export default {
	excelUploadUrl:BASE_URL+'/importExcel',
	getForm(id){
		return request({
			url: BASE_URL + '/getForm',
			method:'get',
			params:{
				id
			}
		})
	},
	getInfo(id){
		return request({
			url: BASE_URL + '/getInfo',
			method:'get',
			params:{
				id
			}
		})
	},
	getArrearProjectTotal(){
		return request({
			url: BASE_URL + '/getArrearProjectTotal',
			method:'get'
		})
	},
	getSummaryList(params){
		return request({
			url: BASE_URL + '/getSummaryList',
			method:'get',
			params
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
	getLoanWriteoffList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getLoanWriteoffList',
			method:'get',
			params
		})
	},
	getTotalPrice(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getTotalPrice',
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
	getSummary(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummary',
			method:'get',
			params
		})
	},
	getSummaryListByProject(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummaryListByProject',
			method:'get',
			params
		})
	},
	getNewProjectList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getNewProjectList ',
			method:'get',
			params
		})
	},
	exportExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportExcel?'+queryStr)
	},
	create(){
		return request({
			url: BASE_URL + '/create',
			method:'post'
		})
	},	
	update(data){
		data = commonJs.obj.copyByKey(data,[
			'id',
			'input_status',
			'customer_id',
			'company_id',
			'contract_no',
			'salesman',
			'area',
			'currency_price',
			'payment_price',
			'payment_currency',
			'payment_date',
			'payment_method',
			'remarks',
			'projectList',
			'projectRemoveList'
		])
		return request({
			url: BASE_URL + '/update',
			method:'post',
			data
		})
	},
	writeoff(data){
		data = commonJs.obj.copyByKey(data,[
			'id',
			'customer_id',
			'projectList',
		])
		return request({
			url: BASE_URL + '/writeoff',
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
	undo(id){
		return request({
			url: BASE_URL + '/undo',
			method:'post',
			data:{
				id
			}
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
	getProjectStatisticList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProjectStatisticList',
			method:'get',
			params
		})
	},
	getCustomerStatisticList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getCustomerStatisticList',
			method:'get',
			params
		})
	},
	getCompanyStatisticList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getCompanyStatisticList',
			method:'get',
			params
		})
	},
}