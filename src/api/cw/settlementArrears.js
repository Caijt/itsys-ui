import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'
import qs from 'qs'

const BASE_URL = baseUrl + '/settlement_arrears' 

export default {
	getInfo(id){
		return request({
			url: BASE_URL + '/getInfo',
			method:'get',
			params:{ id }
		})
	},
	getForm(id){
		return request({
			url: BASE_URL + '/getForm',
			method:'get',
			params:{ id }
		})
	},
	getCompanyList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getCompanyList',
			method:'get',
			params
		})
	},	
	getCustomerList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getCustomerList',
			method:'get',
			params
		})
	},	
	getProjectList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProjectList',
			method:'get',
			params
		})
	},	
	getContractList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getContractList',
			method:'get',
			params
		})
	},	
	getArrearsSummaryData(params={}){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getArrearsSummaryData',
			method:'get',
			params
		})
	},
	exportCustomerExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportCustomerExcel?'+queryStr );
	},
	exportProjectExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportProjectExcel?'+queryStr );
	},
	exportCompanyExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr = qs.stringify(params)
		window.open( BASE_URL+'/exportCompanyExcel?'+queryStr );
	},
	exportContractExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportContractExcel?'+queryStr );
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
	getToOrderProjectTotal (){
		return request({
			url: BASE_URL + '/getToOrderProjectTotal ',
			method:'get'
		})
	},
	getProjectSummaryList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProjectSummaryList',
			method:'get',
			params
		})
	},
	create(data){
		return request({
			url: BASE_URL + '/create',
			method:'post'
		})
	},
	update(data){
		data = commonJs.obj.copyByKey(data,[
			'id',
			'input_status',
			'area_id',
			'project',
			'contract_no',
			'db_no',
			'fh_no',
			'order_no',			
			'method',
			'plan_send_date',
			'company_id','salesman_name','salesman_tel',
			'receive_unit','receive_name','receive_tel','receive_address','remarks'
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
	delAttach(data){
		return request({
			url: BASE_URL + '/delAttach',
			method:'post',
			data
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
	}
}