import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'
import qs from 'qs'

const BASE_URL = baseUrl+'/project' 

let fields = [
	'contract_id',
	'is_new_contract',
	'contract_no',
	'name',
	'place',
	'project_area',
	'project_price',
	'dev'
]

export default {
	getInfo(id){
		return request({
			url: BASE_URL + '/getInfo',
			method:'get',
			params:{ id }
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
	getNearMonthSummary(params={}){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getNearMonthSummary ',
			method:'get',
			params
		})
	},
	exportExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportExcel?'+queryStr );
	},
	exportProgressExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportProgressExcel?'+queryStr );
	},
	getProgressList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProgressList',
			method:'get',
			params
		})
	},
	getProjectSummary(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProjectSummary',
			method:'get',
			params
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
	getDetails(id){
		return request({
			url: BASE_URL + '/getDetails',
			method:'get',
			params:{ id }
		})
	},
	updateViewLog(data){
		return request({
			url: BASE_URL +'/updateViewLog',
			method:'post',
			data
		})
	},
	getViewLog(id){
		return request({
			url: BASE_URL +'/getViewLog',
			method:'get',
			params:{ id }
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
	getDevList(key){
		return request({
			url: BASE_URL + '/getDevList',
			method:'get',
			params:{ key }
		})
	},
	getPlaceList(key){
		return request({
			url: BASE_URL + '/getPlaceList',
			method:'get',
			params:{ key }
		})
	},
	getCompanyList(key){
		return request({
			url: BASE_URL + '/getCompanyList',
			method:'get',
			params:{ key }
		})
	},
	getFieldList({ field, keyword }){
		return request({
			url: BASE_URL + '/getFieldList',
			method:'get',
			params:{ 
				field,keyword
			}
		})
	},
	getTimeStatistic(params={}){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getTimeStatistic',
			method:'get',
			params
		})
	},
}