module.exports = {
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  lintOnSave:false,//关闭eslint规范
  devServer:{
  	port:8080,
  	open:true,
    host:'0.0.0.0',
  	proxy: {
      '/api': {
        target: 'http://localhost:9000',
        //pathRewrite: {'^/api/' : '/'},
        changeOrigin: true
      },
      '/upload': {
        target: 'http://localhost:9000',
        //pathRewrite: {'^/api/' : '/'},
        changeOrigin: true
      }      
    }
  }  
};
