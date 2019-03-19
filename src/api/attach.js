import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'
import qs from 'qs'

const BASE_URL = baseUrl + '/attach' 
const fields = [
	
]
export default {	
	uploadUrl:BASE_URL+'/upload',
	uploadImgUrl:BASE_URL+'/uploadImg',
	getList(params){
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getList',
			method:'get',
			params
		})
	},	
	download(saveName){
		window.open( '/upload/attach/'+saveName );
	},	
	down(id){
		console.log(BASE_URL+'/download/id/'+id)
		window.open( BASE_URL+'/download/id/'+id );
	},
	del(id,url=BASE_URL + '/del'){
		return request({
			url,
			method:'post',
			data:{
				id
			}
		})
	},
	delImg(data){
		data = commonJs.obj.copyByKey(data,['id','attach_field'])
		return request({
			url: BASE_URL + '/delImg',
			method:'post',
			data
		})
	}
}