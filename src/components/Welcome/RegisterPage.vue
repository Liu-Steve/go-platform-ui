<template>
    <div style="text-align: center; margin: 0 20px;">
        <div style="margin-top: 100px;">
            <div style="font-size: 25px;font-weight: bold;">新用户注册</div>
            <div style="font-size: 14px; color:grey">欢迎注册我们的围棋平台</div>
        </div>

        <div style="margin-top: 50px;">
            <el-form :model="form" :rules="rules" @validate="onValidate">
                <el-form-item prop="username">
                    <el-input v-model="form.username" type="text" placeholder="用户名">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="form.password" type="password" placeholder="密码">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password_repeat">
                    <el-input v-model="form.password_repeat" type="password" placeholder="重复密码">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="email">
                    <el-input v-model="form.email" type="email" placeholder="电子邮件">
                        <template #prefix>
                            <el-icon>
                                <Message />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="code">
                    <el-row :gutter="10">
                        <el-col :span="18">
                            <el-input v-model="form.code" type="email" placeholder="验证码">
                                <template #prefix>
                                    <el-icon>
                                        <EditPen />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="success" :disabled="!isEmailValid">获取验证码</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </div>

        <div style="margin-top: 75px;">
            <el-button @click="register" style="width: 270px;" type="warning" plain>
                立即注册
            </el-button>
        </div>

        <div style="margin-top: 20px;">
            <span style="font-size: 14px;color: grey;">已有帐号?</span>
            <el-link @click="router.push('/')" type="primary" style="translate: 0 -2px;">
                立即登录
            </el-link>
        </div>

    </div>
</template>

<script setup>
import { User, Lock, Message, EditPen } from '@element-plus/icons-vue';
import router from '../../router';
import { get, post } from '../../net';
import { reactive, ref } from "vue";

const form = reactive({
    "id": 0,
    "username": "",
    "password": "",
    "password_repeat": "",
    "email": "",
    "code": "",
    "salt": 0,
    "status": 0,
    "createdDate": "2023-10-12T13:09:58.634Z",
    "updatedDate": "2023-10-12T13:09:58.634Z",
})

const validateUsername = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入用户名'))
    }
    //中英文字符和数字
    else if (!/^[\u4E00-\u9FFFa-zA-Z0-9]+$/.test(value)) {
        callback(new Error('用户名不能包含特殊字符，只能是中文/英文'))
    }
    else {
        callback()
    }
}

const validatePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== form.password) {
        callback(new Error("两次输入的密码不一致"))
    } else {
        callback()
    }
}

const rules = {
    username: [
        {
            validator: validateUsername,
            trigger: ['blur', 'change']
        },
        {
            min: 2,
            max: 8,
            message: '用户名长度必须在2-8字符之间',
            trigger: ['blur', 'change']
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        },
        {
            min: 6,
            max: 16,
            message: '密码长度必须在6-16字符之间',
            trigger: ['blur', 'change']
        },
    ],
    password_repeat: [
        {
            validator: validatePassword,
            trigger: ['blur', 'change']
        },
    ],
    email: [
        {
            required: true,
            message: '请输入电子邮件',
            trigger: 'blur',
        },
        {
            type: 'email',
            message: '请输入合法的电子邮件地址',
            trigger: ['blur', 'change'],
        },
    ],
}

const isEmailValid = ref(false)

const onValidate = (prop, isValid) => {
    if (prop == 'email') {
        isEmailValid.value = isValid;
    }
}


const register = () =>{
    if (!form.username) {
        ElMessage.warning('请填写用户名')
    }
    else if(!form.password){
        ElMessage.warning('请填写密码')
    }
    else if(form.password_repeat != form.password){
        ElMessage.warning('两次填写的密码需一致')
    }
    else {
        post('/api/user/register', {
            "username": form.username,
            "password": form.password,
            "email": form.email,
        }, (response) => {
            if(response.resultCode != 0) ElMessage.warning('账号已被注册！')
            else {
                ElMessage.success('注册成功!')
                router.push('/')
            }
            // ElMessage.success('登陆成功!')
            // if (form.remembered) {
            //     localStorage.setItem('Authorization', message.token);   // 持久化
            // }
            // axios.defaults.headers.common['Authorization'] = `Bearer ${message.token}`;
            // router.push('/index')
        }
        )
    }
}


</script>

<style scoped></style>
