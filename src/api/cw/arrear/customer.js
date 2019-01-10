import request from '@/utils/request'
import commonJs from '@/utils/common'

const base_url = '/api2/fh/customer_arrear/' 

export default {
	getList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: base_url + 'getList',
			method:'get',
			params
		})
	},
	getProjectListByCustomer(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: base_url + 'getProjectListByCustomer',
			method:'get',
			params
		})
	},
	getListByProject(projectId){
		return request({
			url: base_url + 'getListByProject',
			method:'get',
			params:{
				projectId
			}
		})
	},
	getNewProjectList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: base_url + 'getNewProjectList ',
			method:'get',
			params
		})
	},
	create(data){
		data=commonJs.obj.copyByKey(data,[
			'project_id',
			'company_id',
			'payment_price',
			'payment_date',
			'payment_method'
		])
		return request({
			url: base_url + 'create',
			method:'post',
			data
		})
	},
	update(data){
		data=commonJs.obj.copyByKey(data,[
			'id',
			'project_id',
			'company_id',
			'payment_price',
			'payment_date',
			'payment_method'
		])
		return request({
			url: base_url + 'update',
			method:'post',
			data
		})
	},
	del(id){
		return request({
			url: base_url + 'del',
			method:'post',
			data:{
				id
			}
		})
	}
}