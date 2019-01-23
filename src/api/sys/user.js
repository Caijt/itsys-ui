import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'
import qs from 'qs'

const BASE_URL = baseUrl +'/user' 

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
	getProductList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProductList',
			method:'get',
			params
		})
	},
	save(data){
		data = commonJs.obj.copyByKey(data,[
			'id',
			'action',
			'login_name',
			'name',
			'qywx_user',
			'pwd',
			'change_pwd',
			'factory_ids',
			'company_ids',
			'role_ids'
		])
		return request({
			url: BASE_URL + '/save',
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
	undoReview(id){
		return request({
			url: BASE_URL + '/undoReview',
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
	loadFinish(task_id){
		return request({
			url: BASE_URL + '/loadFinish',
			method:'post',
			data:{
				task_id
			}
		})
	},
	undoLoadFinish(task_id){
		return request({
			url: BASE_URL + '/undoLoadFinish',
			method:'post',
			data:{
				task_id
			}
		})
	},
	review(data){
		data = commonJs.obj.copyByKey(data,['id'])
		return request({
			url: BASE_URL + '/review',
			method:'post',
			data
		})
	},
	driverSupply(data){
		data = commonJs.obj.copyByKey(data,[
			'id','driver_unit','driver_no','driver_name','driver_tel'])
		return request({
			url: BASE_URL + '/driverSupply',
			method:'post',
			data
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
	checkLoginNameUnique(login_name,id=null){
		return request({
			url: BASE_URL + '/checkLoginNameUnique',
			method:'get',
			params:{
				login_name,id
			}
		})
	},
}