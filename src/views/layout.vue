<template>
	<el-container style='height:100%' >
		<el-header style='padding:0px;box-shadow:0px 0px 8px  rgba(0,0,0,.4);z-index: 1' :height='headerHeight'>
			<el-menu 
				class='_layout-header' 
				router 
				mode="horizontal" 
				:default-active="modulePath" 
				background-color="#304156" 
				text-color="#fff" 
				active-text-color="#409EFF" 
				style='border:none'
				ref='elHeader'>
			  <el-menu-item 
			  	v-for='m in $store.state.user.routers.slice(0,maxHeaderMenu)' 
			  	:index="m.path" 
			  	:key='m.meta.id'>
					{{ m.meta.title }}
				</el-menu-item>
				<el-submenu index="/more" v-if='$store.state.user.routers.length>maxHeaderMenu'>
			    <template slot="title">更多</template>
			    <el-menu-item 
			    	v-for='m in $store.state.user.routers.slice(maxHeaderMenu)'
			    	:index="m.path" 
			  		:key='m.meta.id'>
			    	{{ m.meta.title }}
			    </el-menu-item>
			  </el-submenu>
				<el-submenu index="/my" style='float:right;'>
			    <template slot="title">{{$store.state.user.name}}</template>
			    <!-- <el-menu-item index="/my/setting" >配置</el-menu-item> -->
			    <el-menu-item index='' @click='logout'>注销</el-menu-item>
			  </el-submenu>
			  <el-menu-item  index='' style='float:right' @click='contactDialog=true'>帮助</el-menu-item>
			</el-menu>
		</el-header>
		<el-container style='overflow: auto;'>
			<el-aside style='width:200px;box-shadow:0px 0px 10px  rgba(0,0,0,.12);z-index: 1'>
				<el-scrollbar class='_scroll'>
					<el-menu 
						class='_layout-nav'
						:default-active='$route.path' 
						:default-openeds="openedMenus" 
						router 
						ref='menu'
						style='border:none'
						@select='select'>
					  <el-menu-tree v-for='menu in $store.state.user.routers' v-show='menu.path==modulePath'  :menus='menu.children||[]' :key='menu.path'></el-menu-tree>
					</el-menu>
				</el-scrollbar>
			</el-aside>
			 <el-container>
      <el-main style='padding:25px;'>
				<el-breadcrumb separator="/" style='margin-bottom: 20px'>
				  <el-breadcrumb-item 
				  	v-for='m in $route.matched'
				  	v-if='!m.meta.menuHide'
				  	:key='m.meta.id' :to='m.path' 
				  	@click.native='itemClick'>
				  	{{m.meta.title}}
				  </el-breadcrumb-item>
				</el-breadcrumb>
				<router-view style='margin-bottom:25px'/>
			</el-main>
			<el-footer height='35px' style='text-align: center;border-top:1px solid #EBEEF5'>
				<el-button type='text' @click='checkVersion'>Copyright © 2019 广东金刚玻璃科技股份有限公司 | 版本：v<span ref='version'>20190115001</span></el-button>
				<!-- <el-button type='text' @click='contactDialog=true'>系统帮助</el-button> -->
			</el-footer>
			<el-dialog :visible.sync="contactDialog" title='系统帮助' class='c-dialog-fixed'>
				<el-row :gutter='10'>
					<el-col :span='16'>
						<el-form class='c-form-text' label-position='top'>
							<el-form-item label='系统操作文档'>
								<el-button type='text' icon='el-icon-document' @click='down("help1.pdf")'>金刚防火窗产供销系统流程说明</el-button>
								<el-button type='text' icon='el-icon-document' @click='down("help2.pdf")'>项目进度查询操作</el-button>
							</el-form-item>
							<el-form-item label='技术支持电话'>
								<span>0754-82534808</span>
							</el-form-item>
							<el-form-item label='QQ交流群'>
								<span>366933271（用手机QQ扫描右侧二维码加入交流群）</span>
							</el-form-item>
						</el-form>
					</el-col>
					<el-col :span='8'>
						<img src='static/qun.jpg' style='max-width: 100%'/>
					</el-col>
				</el-row>
			</el-dialog>
    </el-container>
	</el-container>
</el-container>
</template>
<script>
	import ElMenuTree from '@/components/common/elMenuTree'
	import sysConfigApi from '@/api/sys/config'
	export default {
		components: { ElMenuTree },
		data() {
			return {
				operationDialog:false,
				contactDialog:false,
				headerHeight:'60px',
				openedMenus:[],
				currentMenus:[],
				menuPath:'',
				maxHeaderMenu:10
			}
		},
		created(){
			this.checkVersion()
		},
		beforeRouteEnter(to,from,next){
			next(vm=>{
				// let modulePath = vm.modulePath
				// let currentModule = vm.$store.state.user.menus.find(m=>m.path==modulePath)
				// let currentMenus =  currentModule?currentModule.children:[]
				// vm.openedMenus = []
				// vm.currentMenus = [...currentMenus]
				// vm.menuPath = to.path
				// setTimeout(()=>{
					
				// 	console.log('asdf')
				// },0)				
			})
		},
		mounted(){
			window.addEventListener('resize',this.resize)
		},
		destroyed() {
		  window.removeEventListener('resize', this.resize)
		},
		methods:{
			logout(){
				this.$confirm('您确定注销退出系统吗？','提示',{
					type:'warning'
				}).then(()=>{
					this.$store.dispatch('logout')
				})
				
			},
			select(index,indexPath){
				//console.log(this.$refs.menu.defaultActive)
			},
			resize(){
				this.headerHeight=this.$refs.elHeader.$el.clientHeight+'px'
			},
			itemClick(){
				// console.log('df')
				// console.log(this.$route.path)
				// this.menuPath = this.$route.path
				// setTimeout((v)=>{
				// 	console.log(this.$route.path)
				// 	this.menuPath = '/yyzx'
				// 	console.log(v)
				// },1000)
			},
			down(d){
				window.open('static/'+d)
			},
			checkVersion(e){
				sysConfigApi.getValue('version').then(res=>{
		      let remoteVersion = res.data
		      let localVersion = this.$refs.version.innerText
		      if(remoteVersion !==localVersion){
		        this.$confirm('<b>检测本地系统版本与服务器系统版本不一致，是否进行刷新加载更新内容？</b><br/>本地版本：v'+localVersion+'<br/>服务器版本：v'+remoteVersion,'更新提示',{
		          type:'warning',
		          dangerouslyUseHTMLString:true,
		          confirmButtonText: '刷新',
		        }).then(()=>{
		          window.location.reload()
		        })
		      }else{
		      	if(e){
		      		this.$message.success('本地系统版本与服务器版本已一致，无需更新')
		      	}
		      }
	    	})
			}
		},
		computed:{
			modulePath(){
				let e=this.$route.matched.length == 0?this.$route.path:this.$route.matched[0].path
				return e?e:'/'
			}
		},
		
	}
</script>
<style lang='scss'>
	._layout-header.el-menu--horizontal > .el-menu-item.is-active{
		border-bottom-width:4px;
	}
	._layout-header.el-menu--horizontal > .el-submenu.is-active > .el-submenu__title{
		border-bottom-width:4px;
	}
	._layout-nav .el-menu-item.is-active{
		background-color:#ecf5ff;
		border-right:4px solid #409EFF ;
	}
	._scroll{
		 height:100%;
		 .el-scrollbar__wrap{
			overflow-x:auto;
		}
	}
</style>