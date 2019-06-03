import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'
import qs from 'qs'

const BASE_URL = baseUrl +'/asset' 

export default {
	excelUploadUrl:BASE_URL+'/importExcel',
	uploadAttachUrl:BASE_URL+'/uploadAttach',
	delAttachUrl:BASE_URL+'/delAttach',
	getPrintQrcode(id){
		return BASE_URL+'/getPrintQrcode/'+id
	},
	getDetailsQrcode(id){
		return BASE_URL+'/getDetailsQrcode/'+id
	},
	getDetails(id){
		return request({
			url: BASE_URL + '/getDetails',
			method:'get',
			params:{ id }
		})
	},
	getForm(id){
		return request({
			url: BASE_URL + '/getForm',
			method:'get',
			params:{
				id
			}
		})
	},
	getTaskForm(id){
		return request({
			url: BASE_URL + '/getTaskForm',
			method:'get',
			params:{
				id
			}
		})
	},
	getPrint(id){
		return request({
			url: BASE_URL + '/getPrint',
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
	getList(params){
		params = params && commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getList',
			method:'get',
			params
		})
	},
	getPageList(params){
		params = params && commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getPageList',
			method:'get',
			params
		})
	},
	getPageListWithSummary(params){
		params = params && commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getPageListWithSummary',
			method:'get',
			params
		})
	},
	create(){
		return request({
			url: BASE_URL + '/create',
			method:'post'
		})
	},
	save(data){
		data = commonJs.obj.copyByKey(data,[
			'id',
			'company_id',
			'type_id',
			'supplier_id',
			'model',
			'diy_no',			
			'inbound_date',
			'price',
			'amount',
			'sn',
			'source',
			'is_stock_warning',
			'stock_warning_id',
			'remarks',
			"attach_guid"
		])
		return request({
			url: BASE_URL + '/save',
			method:'post',
			data
		})
	},
	del(id){
		return request({
			url: BASE_URL + '/delete',
			method:'delete',
			data:{
				id
			}
		})
	},
	getSummaryData(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummaryData',
			method:'get',
			params
		})
	},
	exportExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportExcel?'+queryStr );
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
	getPropList({ prop, keyword }){
		return request({
			url: BASE_URL + '/getPropList',
			method:'get',
			params:{ 
				prop,keyword
			}
		})
	}
}