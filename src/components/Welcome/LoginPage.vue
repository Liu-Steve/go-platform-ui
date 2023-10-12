<template>
    <div style="text-align: center; margin: 0 20px;">
        <div style="margin-top: 150px;">
            <div style="font-size: 25px;font-weight: bold;">登录</div>
            <div style="font-size: 14px; color:grey">进入系统前请先输入用户名和密码进行登录</div>
        </div>

        <div style="margin-top: 50px;">
            <el-input v-model="form.username" type="text" placeholder="用户名/邮箱">
                <template #prefix>
                    <el-icon>
                        <User />
                    </el-icon>
                </template>
            </el-input>
            <el-input v-model="form.password" type="password" style="margin-top:10px;" placeholder="密码">
                <template #prefix>
                    <el-icon>
                        <Lock />
                    </el-icon>
                </template>
            </el-input>
        </div>
        <el-row style="margin-top:5px">
            <el-col :span="12" style="text-align: left">
                <el-checkbox v-model="form.remembered" label="记住我" size="large" />
            </el-col>
            <el-col :span="12" style="text-align: right">
                <el-link>忘记密码？</el-link>
            </el-col>
        </el-row>
        <div style="margin-top: 40px;">
            <el-button @click="login" style="width: 270px;" type="success" plain>立即登录</el-button>
        </div>
        <el-divider>
            <span style="color:grey;font-size: 13px;">没有账号</span>
        </el-divider>
        <div>
            <el-button style="width: 270px;" type="warning" plain>注册账号</el-button>
        </div>
    </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue';
import { reactive } from "vue";
import { post } from '../../net';

const form = reactive({
    "id": 0,
    "username": "",
    "password": "",
    "email": "string",
    "remembered": false,
    "salt": 0,
    "status": 0,
    "createdDate": "2023-10-12T10:07:45.113Z",
    "updatedDate": "2023-10-12T10:07:45.113Z",
})

const login = () => {
    if (!form.username || !form.password) {
        ElMessage.warning('请填写用户名和密码')
    }
    else {
        post('/user/login', {
            "id": form.id,
            "username": form.username,
            "password": form.password,
            "email": form.email,
            "salt": form.salt,
            "status": form.status,
            "createdDate": form.createdDate,
            "updatedDate": form.updatedDate,
        }, (messge) => {
            ElMessage.success(message)
            router.push('/index')
        }
        )
    }
}
</script>

<style scoped></style>
