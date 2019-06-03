import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'
import qs from 'qs'

const BASE_URL = baseUrl +'/assetUseStatus' 

export default {
	getPrintQrcode(id){
		return BASE_URL+'/getPrintQrcode/id/'+id
	},
	getDetailsQrcode(id){
		return BASE_URL+'/getDetailsQrcode/id/'+id
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
		params = commonJs.obj.removeNullKey(params)
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
}