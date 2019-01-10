import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'
import qs from 'qs'

const BASE_URL = baseUrl + '/summary' 

export default {
	//项目应收款统计
	getProjectSummaryList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProjectSummaryList',
			method:'get',
			params
		})
	},
	//导出项目应收款Excel
	exportExcelProjectSummary(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportExcelProjectSummary?'+queryStr );
	},
	//客户应收款统计
	getCustomerSummaryList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getCustomerSummaryList',
			method:'get',
			params
		})
	},
	//导出客户应收款Excel
	exportExcelCustomerSummary(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportExcelCustomerSummary?'+queryStr );
	},
	//业绩公司应收款统计
	getCompanySummaryList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getCompanySummaryList',
			method:'get',
			params
		})
	},
	//导出业绩公司应收款Excel
	exportExcelCompanySummary(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportExcelCompanySummary?'+queryStr );
	},
}