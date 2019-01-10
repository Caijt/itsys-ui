<template>
	<div id='main' style='width:100%;height:500px'></div>
</template>
<script>
	export default{
		data(){
			return {

			}
		},
		mounted(){
			this.test()
		},
		methods:{
			test(){
				let echarts = require('echarts')
				let chart = echarts.init(document.getElementById('main'))
				chart.setOption({
			    title: {
			        text: 'ECharts 入门示例'
			    },
			    tooltip: {},
			    xAxis: {
			        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
			    },
			    yAxis: {},
			    series: [{
			        name: '销量',
			        type: 'bar',
			        data: [5, 20, 36, 10, 10, 20]
			    }]
				});
			}
		}
	}
</script>