import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'
import qs from 'qs'

const BASE_URL = baseUrl +'/receive_payment_project' 

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
	getDetails(id){
		return request({
			url: BASE_URL + '/getDetails',
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
	save(data){
		return request({
			url: BASE_URL + '/save',
			method:'post',
			data
		})
	},
	remove(data){
		return request({
			url: BASE_URL + '/remove',
			method:'post',
			data
		})
	},
	exportExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportExcel?'+queryStr)
	},
	getProjectStatisticList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProjectStatisticList',
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