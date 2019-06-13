<template>
    <div>
        <template v-for="m in filterMenus">
            <el-menu-item
                v-if="typeof(m.children)=='undefined' || m.children.length==0"
                :key="m.meta.id"
                :index="m.meta.fullPath"
            >{{m.meta.title}}</el-menu-item>
            <el-submenu v-else :index="m.meta.fullPath" :key="m.meta.id">
                <template slot="title">{{m.meta.title}}</template>
                <el-menu-tree :menus="m.children"></el-menu-tree>
            </el-submenu>
        </template>
    </div>
</template>
<script>
export default {
    name: "elMenuTree",
    props: {
        menus: {
            type: Array
        }
    },
    computed: {
        filterMenus() {
            return this.menus.filter(item => !item.meta.menuHide);
        }
    }
};
</script>