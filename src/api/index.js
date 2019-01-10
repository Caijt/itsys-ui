import request from '@/utils/request'
import baseUrl from './baseUrl'

const BASE_URL = baseUrl + '/index' 

export default {
	//获取更新记录列表
	getUpdateRecordList(params){
		return request({
			url: BASE_URL + '/getUpdateRecordList',
			method:'get',
			params
		})
	},
	//修改密码
	modifyPwd(data){
		return request({
			url: BASE_URL + '/modifyPwd',
			method:'post',
			data
		})
	},
	//获取登录日志列表
	getLoginLogList(params){
		return request({
			url: BASE_URL + '/getLoginLogList',
			method:'get',
			params
		})
	}
}