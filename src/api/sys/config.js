import request from '@/utils/request'
import baseUrl from './baseUrl'
import commonJs from '@/utils/common'
import qs from 'qs'

const BASE_URL = baseUrl+'/config'

export default {
	getValue(key){
		return request({
			url: BASE_URL+'/getValue',
			method:'get',
			params:{
				key
			}
		})
	},
	getValues(keys){
		return request({
			url: BASE_URL+'/getValues',
			method:'get',
			params:{
				keys
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
		data = commonJs.obj.copyByKey(data,[
			'id',
			'action',
			'key',
			'value',
			'remarks'
		])
		return request({
			url: BASE_URL + '/save',
			method:'post',
			data
		})
	},
	del(key){
		return request({
			url: BASE_URL + '/del',
			method:'post',
			data:{
				key
			}
		})
	},
	checkKeyUnique(key,action=null){
		return request({
			url: BASE_URL + '/checkKeyUnique',
			method:'get',
			params:{
				key,action
			}
		})
	},
}