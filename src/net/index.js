import axios from "axios";
import { ElMessage } from "element-plus";

const defaultError = () => ElMessage.error('发生了一些错误，请联系管理员')
const defaultFailure = (message) => ElMessage.warning(message)

function post(url, data, success, failure = defaultFailure, error = defaultError) {
    axios.post(url, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true,
    }).then(({ data }) => {
        if (data.success) {
            success(data.message, data.status)
        }
        else {
            failure(data.message, data.status)
        }
    }).catch(error)
}

function get(url, success, failure = defaultFailure, error = defaultError) {
    axios.get(url)
    .then((response) => {
        // 状态代码 2xx
        success(response.data, response.status)
    }).catch((err) => {
        if (err.response) {
            // 状态代码超出 2xx
            failure(`请求错误，错误代码：${err.response.status}`)
            console.error(err.response)
        }
        else if (err.request) {
            failure('请求超时')
            console.error(err.request)
        }
        else {
            error()
            console.error(err.message)
        }
        console.log(err.config)
    })
}

export { get, post }