import Vue from 'vue'
import store from '../store'
export default {
	convertTextarea(text){
		text = text||'';
		if(text){
			text = text.replace(/\r\n/g,"<br>")
			text = text.replace(/\n/g,"<br>")
			//替换所有的空格（中文空格、英文空格都会被替换）
			text = text.replace(/\s/g,"&nbsp;")
		}			
		return text
	},
	textareaToHtml(text){
		text = text||'';
		if(text){
			text = text.replace(/\r\n/g,"<br>")
			text = text.replace(/\n/g,"<br>")
			//替换所有的空格（中文空格、英文空格都会被替换）
			text = text.replace(/\s/g,"&nbsp;")
		}			
		return text
	},
	//
	round(value,point=2){
		value = Number(value)
		let a = Math.pow(10,point)
		return Math.round(value*a)/a||0
	},
	getProgressPercentage(value){
		value = Number(value) || 0
		if(value>1) return 100
		return Math.round(value*100*100)/100||0
	},
	//
	getProgress(value){
		value = Number(value) || 0
		if(value>1) return 100
		return Math.round(value*100*100)/100||0
	},
	//格式化日期格式
	formatDate(value,format='YYYY-MM-DD HH:mm'){
		if(!value) return ''
		return Vue.prototype.$moment(value).format(format)
	},
	hasUserPath(path){
		return store.state.user.menus.some((item,index)=>{
			return item.fullPath == path
		})
	},
	obj:{
		copyByKey(object,keys){
			let newObject = {}
			for(let key of keys){
				newObject[key] = object[key]
			}
			return newObject
		},
		//根据传入的对象，返回一个没有空值的新对象
		removeNullKey(obj){
			let newObj = {}
			for(let key of Object.keys(obj)){
				if(obj[key]!==null&&obj[key]!==''&&obj[key]!==undefined){
					newObj[key] = obj[key]
				}
			}
			return newObj
		}		
	},
	validateRules:{
		et0:(rule,value,callback)=>{
			if(value<=0){
				callback(new Error('必须大于0'))
			}else{
				callback()
			}
		}
	},
	toTreeData(data){
		let rootList=[]
		data.forEach((item,index)=>{
			if(item.parent_id==null){
				rootList.push(item)
			}
		})
    function convertTree(treeData){
      treeData.forEach(d=>{
        data.forEach((item,index)=>{
          if(item.parent_id && item.parent_id == d.id){
            if(!d.children) d.children = []
            d.children.push(item)
          }
        })
        if(d.children) convertTree(d.children)
      })
    }
    convertTree(rootList)
    return rootList
	}
	
}