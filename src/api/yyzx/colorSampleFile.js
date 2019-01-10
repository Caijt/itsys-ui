import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'
import qs from 'qs'

const BASE_URL = baseUrl +'/color_sample_file' 
const fields = [
	'sample_id',
	'apply_id',	
	'input_status',	
	'file_no',
	'file_date',
	'file_remarks'
]

export default {
	attachUploadUrl: BASE_URL+'/uploadAttach',
	supplyAttachUploadUrl: BASE_URL+'/uploadSupplyAttach',
	getForm(id){
		return request({
			url: BASE_URL + '/getForm',
			method:'get',
			params:{
				id
			}
		})
	},
	getInfo(id){
		return request({
			url: BASE_URL + '/getInfo',
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
	getSupplyList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSupplyList',
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
	getProgressSummaryList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProgressSummaryList',
			method:'get',
			params
		})
	},
	getConfirmList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getConfirmList',
			method:'get',
			params
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
	getSummaryList(params){
		return request({
			url: BASE_URL + '/getSummaryList',
			method:'get',
			params
		})
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
	getSummaryListByOrder(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getSummaryListByOrder',
			method:'get',
			params
		})
	},
	getToConfirmTotal(){
		return request({
			url: BASE_URL + '/getToConfirmTotal',
			method:'get'
		})
	},
	getToConfirmList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getToConfirmList',
			method:'get',
			params
		})
	},
	getTodoProjectList (){
		return request({
			url: BASE_URL + '/getTodoProjectList ',
			method:'get'
		})
	},
	confirm(data){
		data = commonJs.obj.copyByKey(data,[
			'id','is_confirm','confirm_remarks','reSubmit','color_no'
		])
		return request({
			url: BASE_URL + '/confirm',
			method:'post',
			data
		})
	},
	create(data){
		data = commonJs.obj.copyByKey(data,[
			'sample_id',
			'apply_id',
		])
		return request({
			url: BASE_URL + '/create',
			method:'post',
			data
		})
	},
	createSupply(data){
		data = commonJs.obj.copyByKey(data,['content','sample_id'])
		return request({
			url: BASE_URL + '/createSupply',
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
	productFinish(order_id){
		return request({
			url: BASE_URL + '/productFinish',
			method:'post',
			data:{
				order_id
			}
		})
	},
	updateInfo(data){
		data = commonJs.obj.copyByKey(data,['order_id','product_status'])
		return request({
			url: BASE_URL + '/updateInfo',
			method:'post',
			data
		})
	},
	exportExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportExcel?'+queryStr );
	},
	exportConfirmExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportConfirmExcel?'+queryStr );
	},
	exportSummaryExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportSummaryExcel?'+queryStr );
	},
	exportProgressExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportProgressExcel?'+queryStr );
	},
	getProgressInfo(id){
		return request({
			url: BASE_URL + '/getProgressInfo',
			method:'get',
			params:{
				id
			}
		})
	},
	getStatusText(status){
		switch(status){
			case 'EDIT':
				return '等待提交'
			case 'SUBMIT':
				return '已申请等待归档'
			case 'FILE':
				return '已归档等待打板'
			case 'MAKE':
				return '已打板等待寄回'
			case 'DELIVERY':
				return '已寄出等待确认'
			case 'FINISH':
				return '客户已确认'
		}
	},
	undo(id){
		return request({
			url: BASE_URL + '/undo',
			method:'get',
			params:{
				id
			}
		})
	}
}