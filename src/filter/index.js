import Vue from 'vue'

Vue.filter('textareaToHtml',function(value){
	let text = value||'';
	if(text){
		text = text.replace(/\r\n/g,"<br>")
		text = text.replace(/\n/g,"<br>")
		//替换所有的空格（中文空格、英文空格都会被替换）
		text = text.replace(/\s/g,"&nbsp;")
	}			
	return text
})

Vue.filter('formatDate',function(value,format){
	if(!value) return ''
	format = format||'YYYY-MM-DD HH:mm';
	return Vue.prototype.$moment(value).format(format)
})

Vue.filter('round',function(value){
	value = Number(value)
	return Math.round(value*100*100)/100||0
})

Vue.filter('round',function(value){
	value = Number(value)
	return Math.round(value*100*100)/100||0
})
Vue.filter('formatPrice', function(value) {
  if(!value) return '0.00';
  //var intPart = Number(value).toFixed(0); //获取整数部分
  var intPart = parseInt(value); //获取整数部分
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

  var floatPart = ".00"; //预定义小数部分
  var value2Array = value.toString().split(".");

  //=2表示数据有小数位
  if(value2Array.length == 2) {
      floatPart = value2Array[1].toString(); //拿到小数部分

      if(floatPart.length == 1) { //补0,实际上用不着
          return intPartFormat + "." + floatPart + '0';
      } else {
          return intPartFormat + "." + floatPart;
      }

  } else {
      return intPartFormat + floatPart;
  }

})

