import request from '@/utils/request'
import commonJs from '@/utils/common'
import baseUrl from './baseUrl'

const BASE_URL = baseUrl+'/project_problem' 

export default {
	getSummaryList(params){
		return request({
			url: BASE_URL + '/getSummaryList',
			method:'get',
			params
		})
	},
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
	resolve(data){
		return request({
			url: BASE_URL + '/resolve',
			method:'post',
			data
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
	getTodoProjectList (){
		return request({
			url: BASE_URL + '/getTodoProjectList ',
			method:'get'
		})
	},
	create(data){
		return request({
			url: BASE_URL + '/create',
			method:'post',
			data
		})
	},
	createByDep(data){
		return request({
			url: BASE_URL + '/createByDep',
			method:'post',
			data
		})
	},
	update(data){
		if(!data.is_finish) data.finish_date = null
		return request({
			url: BASE_URL + '/update',
			method:'post',
			data
		})
	},
	updateByDep(data){
		return request({
			url: BASE_URL + '/updateByDep',
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
	getDepText(dep){
		let text = ''
		switch(dep){
			case 'YYZX':
				text = '运营中心'
				break;
			case 'SALEPLAN':
				text = '销售部'
				break;
			case 'PRODUCTPLAN':
				text = '经营部'
				break;
			case 'PURCHASE':
				text = '采购部'
				break;
			case 'PRODUCT':
				text = '生产部'
				break;
			case 'STORE':
				text = '仓库'
				break;
			case 'TRANSPORT':
				text = '储运部'
				break;
			case 'FINANCE':
				text = '财务部'
				break;
			case 'ENGINEERING':
				text ='工程部'
				break;
			case 'BUSINESS':
				text = '商务部'
				break;
		}
		return text
	}
}