<template>
    <div>
        <el-input
            :value="displayName"
            :placeholder="placeholder"
            readonly
            clearable
            @click.native="$emit('click')"
        >
            <i
                style="cursor: pointer;"
                v-show="hasValue"
                slot="suffix"
                class="el-input__icon el-icon-close"
                @click.stop="clear"
            ></i>
        </el-input>
    </div>
</template>
<script>
export default {
    props: {
        value: {},
        placeholder:{
            type:String,
            default:"点击选择"
        }
    },
    data() {
        return {
            name: ""
        };
    },
    computed: {
        hasValue() {
            return this.value != undefined && this.value != null && this.value != "";
        },
        displayName() {
            return this.hasValue ? this.name : "";
        }
    },
    methods: {
        clear() {
            this.name = "";
            this.$emit("input", null);
        },
        setName(name) {
            this.name = name;
        }
    }
};
</script>

