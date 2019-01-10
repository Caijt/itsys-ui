import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'
import qs from 'qs'

const BASE_URL = baseUrl + '/delivery_task' 

export default {	
	excelUploadUrl:BASE_URL+'/importExcel',
	getDetailsQrcode(id){
		return BASE_URL+'/getDetailsQrcode/id/'+id
	},
	getPrint(id){
		return request({
			url: BASE_URL + '/getPrint',
			method:'get',
			params:{ id }
		})
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
			params:{ id }
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
	getList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getList',
			method:'get',
			params
		})
	},
	getProgressList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProgressList',
			method:'get',
			params
		})
	},
	exportProgressExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportProgressExcel?'+queryStr );
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
	create(){
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
	},
	loadConfirm(id){
		return request({
			url: BASE_URL + '/loadConfirm',
			method:'post',
			data:{
				id
			}
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