import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'

const BASE_URL = baseUrl+'/customer' 

export default {
	getList(params){
		return request({
			url: BASE_URL + '/getList',
			method:'get',
			params
		})
	},
	getEnumList(){
		return request({
			url: BASE_URL + '/getEnumList',
			method:'get'
		})
	},
	getInfo(id){
		return request({
			url: BASE_URL + '/getInfo',
			method:'get',
			params:{id}
		})
	},
	create(data){
		//过滤多于的字段
		data = commonJs.obj.copyByKey(data,['name','type','is_disabled'])
		return request({
			url: BASE_URL + '/create',
			method:'post',
			data
		})
	},
	//更新
	update(data){
		data = commonJs.obj.copyByKey(data,['id','name','type','is_disabled'])
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
	},
	checkNameUnique(name,id=null){
		return request({
			url: BASE_URL + '/checkNameUnique',
			method:'get',
			params:{
				name,id
			}
		})
	}
}