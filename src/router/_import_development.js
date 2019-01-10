module.exports = file => require('@/views' + file).default
// module.exports = file => () => import('@/views' + file)