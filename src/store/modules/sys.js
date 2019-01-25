import configApi from '@/api/sys/config'

const sys = {
	state: {
		title : '',
		version:'',
		login:'',
		company:'',
		initConfig:false
	},
	getters: {
	},
	mutations: {
		SET_INITCONFIG( state, initConfig ) {
			state.initConfig = initConfig
		},
		SET_VERSION( state, version) {
			state.version = version
		},
		SET_LOGIN( state, login) {
			state.login = login
		},
		SET_TITLE( state, title) {
			state.title = title
		},
		SET_COMPANY( state, company) {
			state.company = company
		}
	},
	actions: {
		initSysConfig({ state,commit }, path) {
			return new Promise(( resolve, reject )=>{
				if(!state.initConfig){
					configApi.getValues(['system_title','version','login','company_name']).then(res=>{
						commit('SET_INITCONFIG',true)
						commit('SET_VERSION',res.data.version)
						commit('SET_LOGIN',res.data.login=='on'?true:false)
						commit('SET_TITLE',res.data.system_title)
						commit('SET_COMPANY',res.data.company_name)
						resolve()
					})
				}else{
					resolve()
				}
			})
			
		}
	}
}
export default sys
