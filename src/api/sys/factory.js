import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'
import qs from 'qs'

const BASE_URL = baseUrl +'/factory' 

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
	save(data){
		data = commonJs.obj.copyByKey(data,[
			'id',
			'action',
			'name',
			'address',
			'is_disabled'
		])
		return request({
			url: BASE_URL + '/save',
			method:'post',
			data
		})
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
			'action',
			'company_id',
			'no',
			'name',
			'price',
			'sign_date',
			'begin_date',
			'end_date',
			'is_remind',
			'remarks'
		])
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
	checkNameUnique(name,id=null){
		return request({
			url: BASE_URL + '/checkNameUnique',
			method:'get',
			params:{
				name,id
			}
		})
	},
}