import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'

const BASE_URL = baseUrl+'/company' 

export default {
	getList(params){
		return request({
			url: BASE_URL + '/getList',
			method:'get',
			params
		})
	},
	getInfo(id){
		return request({
			url: BASE_URL + '/getInfo',
			method:'get',
			params:{id}
		})
	},
	getEnumList(params){
		return request({
			url: BASE_URL + '/getEnumList',
			method:'get',
			params
		})
	},
	create(data){
		//过滤多于的字段
		data = commonJs.obj.copyByKey(data,['name','is_disabled'])
		return request({
			url: BASE_URL + '/create',
			method:'post',
			data
		})
	},
	//更新
	update(data){
		data = commonJs.obj.copyByKey(data,['id','name','is_disabled'])
		return request({
			url: BASE_URL + '/update',
			method:'post',
			data
		})
	},
	//删除
	del(id){
		return request({
			url: BASE_URL + '/del',
			method:'post',
			data:{
				id
			}
		})
	}
}