<template>
	<div>
		<template v-for='m in menus' v-if='!m.meta.menuHide'>
			<el-menu-item :index="m.meta.fullPath" v-if="typeof(m.children)=='undefined' || m.children.length==0">{{m.meta.title}}</el-menu-item>
			<el-submenu v-else="m.children.length>0" :index="m.meta.fullPath">
		    <template slot="title">{{m.meta.title}}</template>
		    <el-menu-tree :menus='m.children'></el-menu-tree>
		  </el-submenu>
		</template>	
	</div>
</template>
<script>
	export default {
		name:'elMenuTree',
    props: {
	    menus: {
	      type: Array
	    }
	  }
	}
</script>