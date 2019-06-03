import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'
import qs from 'qs'

const BASE_URL = baseUrl + '/contract'

export default {
	uploadAttachUrl: BASE_URL + '/uploadAttach',
	delAttachUrl: BASE_URL + '/delAttach',
	getPrintQrcode(id) {
		return BASE_URL + '/getPrintQrcode/id/' + id
	},
	getDetailsQrcode(id) {
		return BASE_URL + '/getDetailsQrcode/id/' + id
	},
	getDetails(id) {
		return request({
			url: BASE_URL + '/getDetails',
			method: 'get',
			params: { id }
		})
	},
	getForm(id) {
		return request({
			url: BASE_URL + '/getForm',
			method: 'get',
			params: {
				id
			}
		})
	},
	getTaskForm(id) {
		return request({
			url: BASE_URL + '/getTaskForm',
			method: 'get',
			params: {
				id
			}
		})
	},
	getPrint(id) {
		return request({
			url: BASE_URL + '/getPrint',
			method: 'get',
			params: {
				id
			}
		})
	},
	getSummary(params) {
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummary',
			method: 'get',
			params
		})
	},
	getList(params) {
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getList',
			method: 'get',
			params
		})
	},
	getPageList(params) {
		params = params && commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getPageList',
			method: 'get',
			params
		})
	},
	getPageListWithSummary(params) {
		params = params && commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getPageListWithSummary',
			method: 'get',
			params
		})
	},
	save(data) {
		data = commonJs.obj.copyByKey(data, [
			'id',
			'company_id',
			'supplier_id',
			'no',
			'name',
			'price',
			'pay',
			'sign_date',
			'begin_date',
			'end_date',
			'is_remind',
			'remarks',
			"attach_guid"
		])
		return request({
			url: BASE_URL + '/save',
			method: 'post',
			data
		})
	},
	del(id) {
		return request({
			url: BASE_URL + '/delete',
			method: 'delete',
			data: {
				id
			}
		})
	},
	getSummaryData(params) {
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummaryData',
			method: 'get',
			params
		})
	},
	loadFinish(task_id) {
		return request({
			url: BASE_URL + '/loadFinish',
			method: 'post',
			data: {
				task_id
			}
		})
	},
	exportExcel(params) {
		params = commonJs.obj.removeNullKey(params)
		let queryStr = qs.stringify(params)
		window.open(BASE_URL + '/exportExcel?' + queryStr);
	},
	getNearMonthSummary(params = {}) {
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getNearMonthSummary ',
			method: 'get',
			params
		})
	},
	getTimeStatistic(params) {
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getTimeStatistic',
			method: 'get',
			params
		})
	},
}