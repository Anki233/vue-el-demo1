import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import router from "./router.js"
import store from "./store"

import {
	Message
} from 'element-ui'

let loading = null
let requestCount = 0

// 显示loading
function showLoading() {
	if(requestCount === 0) {
		loading = Message({
			message: '加载中...',
			duration:0
		});
	}
	requestCount++
}
// 隐藏loading
function hideLoading() {
	if(requestCount > 0) {
		requestCount--
	}
	if(loading && requestCount === 0) {
		loading.close()
	}
}

// Add a request interceptor
axios.interceptors.request.use((config) => {
	// 添加header头的token
	let token = window.sessionStorage.getItem('token')
	if (config.token === true) {
		config.headers['token'] = token
	}
	if(config.loading === true) {
		// 显示loading
		showLoading()
	}
	// Do something before request is sent
	return config;
}, (error) => {
	// 隐藏loading
	hideLoading()
	// Do something with request error
	return Promise.reject(error);
});

// 添加相应拦截器
axios.interceptors.response.use((response) => {
	// 隐藏loading
	hideLoading()
	// Do something with response data
	return response;
}, (err) => {
	// 全局错误提示
	if (err.response && err.response.data && err.response.data.errorCode) {
		Message.error(err.response.data.msg)
	}
	// 隐藏loading
	hideLoading()
	return Promise.reject(err);
});

// 引入拖拽排序
import VueDND from 'awe-dnd'
Vue.use(VueDND)

// 引入全局配置文件
import $conf from "./common/config/config.js"
Vue.prototype.$conf = $conf

Vue.directive('auth',{
	inserted(el,binding,vnode,oldVnode) {
		let user = window.sessionStorage.getItem('user')
		user = user ?JSON.parse(user) : {}
		if(!user.super) {
			let rules = user.ruleNames ? user.ruleNames : []
			let v = rules.find(item=> item === blinding.value)
			if(!v) {
				el.parentNode.removeChild(e)
			}
		}
	}
})

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
