import Vue from 'vue'
import axios from '@/utils/request'

Object.defineProperty(Vue.prototype, '$http', { value: axios })