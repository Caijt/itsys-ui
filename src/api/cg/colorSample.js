import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'
import qs from 'qs'

const BASE_URL = baseUrl + '/color_sample' 
const fields = [
	'input_status',
	'sample_id',
	'project_id',
	'supplier',
	'is_finish',
	'finish_date',
	'remarks'
]
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
	getTodoTotal (){
		return request({
			url: BASE_URL + '/getTodoTotal ',
			method:'get'
		})
	},
	getTodoList (params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getTodoList',
			method:'get',
			params
		})
	},
	getProjectSummaryList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getProjectSummaryList ',
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
	remove(data){
		data = commonJs.obj.copyByKey(data,['id','del_remarks'])
		return request({
			url: BASE_URL + '/remove',
			method:'post',
			data
		})
	},
	recovery(id){
		return request({
			url: BASE_URL + '/recovery',
			method:'post',
			data:{
				id
			}
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
	checkNoUnique(order_no,id=null){
		return request({
			url: BASE_URL + '/checkNoUnique',
			method:'get',
			params:{
				order_no,id
			}
		})
	},
	check(data){
		data = commonJs.obj.copyByKey(data,['id','check_order_area'])
		return request({
			url: BASE_URL + '/check',
			method:'post',
			data
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
	exportExcel(params){
		params = commonJs.obj.removeNullKey(params)
		let queryStr=qs.stringify(params)
		window.open( BASE_URL+'/exportExcel?'+queryStr );
	},
}