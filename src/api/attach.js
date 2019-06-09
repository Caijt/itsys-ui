import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'
import qs from 'qs'

const BASE_URL = baseUrl + '/attach'
const fields = [

]
export default {
	uploadUrl: BASE_URL + '/upload',
	uploadImgUrl: BASE_URL + '/uploadImg',
	getList(params) {
		params = commonJs.obj.removeNullKey(params)
		return request({
			url: BASE_URL + '/getList',
			method: 'get',
			params
		})
	},
	download(saveName) {
		window.open('/upload/attach/' + saveName);
	},
	down(file) {
		return request({
			url: BASE_URL + "/download",
			method: 'post',
			data: {
				id: file.id
			},
			responseType: "blob",
		}).then((res) => { 
			const blob = new Blob([res])
			const fileName = file.name;
			if ('download' in document.createElement('a')) { // 非IE下载
				const elink = document.createElement('a')
				elink.download = fileName
				elink.style.display = 'none'
				elink.href = URL.createObjectURL(blob)
				document.body.appendChild(elink)
				elink.click()
				URL.revokeObjectURL(elink.href) // 释放URL 对象
				document.body.removeChild(elink)
			} else { // IE10+下载
				navigator.msSaveBlob(blob, fileName)
			}
		})
	},
	del(id, url = BASE_URL + '/delete') {
		return request({
			url,
			method: 'delete',
			data: {
				id
			}
		})
	},
	delImg(data) {
		data = commonJs.obj.copyByKey(data, ['id', 'attach_field'])
		return request({
			url: BASE_URL + '/delImg',
			method: 'post',
			data
		})
	}
}