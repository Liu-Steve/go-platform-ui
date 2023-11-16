import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router'

const token = localStorage.getItem('Authorization');
if (token !== null && token !== '') {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const defaultError = () => ElMessage.error('发生了一些错误，请联系管理员')
const defaultFailure = (message, resultCode) => ElMessage.warning(message + "错误代码: " + resultCode)

function post(url, data, success, failure = defaultFailure, error = defaultError) {
    axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        // 状态代码 2xx
        if (response.data.resultCode != 0) {
            failure(response.data.resultMessage, response.data.resultCode)
        } else {
            success(response.data, response.status)
        }
    }).catch((err) => {
        if (err.response) {
            if (err.response.status === 401) {   // 未登录
                router.push('/')
                return
            }
            if (err.response.status === 403) {   // 无访问权限
                ElMessage.warning('对不起，您没有权限访问')
                return
            }
            // 其他状态代码超出 2xx 情形
            ElMessage.warning(`请求错误 HTTP 代码: ${err.response.status}`)
            console.error(err.response)
        }
        else if (err.request) {
            ElMessage.warning('请求超时')
            console.error(err.request)
        }
        else {
            error()
            console.error(err.message)
        }
        console.log(err.config)
    })
}

function get(url, success, failure = defaultFailure, error = defaultError) {
    axios.get(url).then((response) => {
        // 状态代码 2xx
        if (response.data.resultCode != 0) {
            failure(response.data.resultMessage, response.data.resultCode)
        } else {
            success(response.data, response.status)
        }
    }).catch((err) => {
        if (err.response) {
            if (err.response.status == 401) {   // 未登录
                router.push('/')
                return
            }
            if (err.response.status == 403) {   // 无访问权限
                ElMessage.warning('对不起，您没有权限访问')
                return
            }
            // 其他状态代码超出 2xx 情形
            ElMessage.warning(`请求错误 HTTP 代码: ${err.response.status}`)
            console.error(err.response)
        }
        else if (err.request) {
            ElMessage.warning('请求超时')
            console.error(err.request)
        }
        else {
            error()
            console.error(err.message)
        }
        console.log(err.config)
    })
}

function put(url, data, success, failure = defaultFailure, error = defaultError) {
    axios.put(url, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        // 状态代码 2xx
        if (response.data.resultCode != 0) {
            failure(response.data.resultMessage, response.data.resultCode)
        } else {
            success(response.data, response.status)
        }
    }).catch((err) => {
        if (err.response) {
            if (err.response.status === 401) {   // 未登录
                router.push('/')
                return
            }
            if (err.response.status === 403) {   // 无访问权限
                ElMessage.warning('对不起，您没有权限访问')
                return
            }
            // 其他状态代码超出 2xx 情形
            ElMessage.warning(`请求错误 HTTP 代码: ${err.response.status}`)
            console.error(err.response)
        }
        else if (err.request) {
            ElMessage.warning('请求超时')
            console.error(err.request)
        }
        else {
            error()
            console.error(err.message)
        }
        console.log(err.config)
    })
}

export default {
    setup() {
        const router = useRouter();
        return router
    },
}

export { get, post, put }