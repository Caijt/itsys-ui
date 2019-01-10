import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'
import qs from 'qs'

const BASE_URL = baseUrl + '/invoice_record' 

let fields = [
	'company_id',
	'project_id',
	'contract_id',
	'invoice_no',
	'invoice_price',
	'invoice_date',
	'remarks'
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
	getSummary(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummary',
			method:'get',
			params
		})
	},
	getToInvoiceProjectTotal(){
		return request({
			url: BASE_URL + '/getToInvoiceProjectTotal',
			method:'get'
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
	getSummaryListByProject(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummaryListByProject',
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
	getList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getList',
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
		window.open( BASE_URL+'/exportExcel?'+queryStr );
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