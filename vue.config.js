module.exports = {
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  devServer:{
  	port:8080,
  	open:true,
    host:'0.0.0.0',
  	proxy: {
      '/api': {
        target: 'http://127.0.0.1:89',
        //pathRewrite: {'^/api/' : '/'},
        changeOrigin: true
      },
      '/upload': {
        target: 'http://127.0.0.1:89',
        //pathRewrite: {'^/api/' : '/'},
        changeOrigin: true
      }      
    }
  }  
};
