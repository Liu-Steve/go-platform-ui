<template>
    <div style="text-align: center; margin: 0 20px;">
        <div style="margin-top: 100px;">
            <div style="font-size: 25px;font-weight: bold;">新用户注册</div>
            <div style="font-size: 14px; color:grey">欢迎注册我们的围棋平台</div>
        </div>

        <div style="margin-top: 50px;">
            <el-input v-model="form.username" type="text" placeholder="用户名">
                <template #prefix>
                    <el-icon>
                        <User />
                    </el-icon>
                </template>
            </el-input>
            <el-input v-model="form.password" type="password" placeholder="密码" style="margin-top: 10px;">
                <template #prefix>
                    <el-icon>
                        <Lock />
                    </el-icon>
                </template>
            </el-input>
            <el-input v-model="form.password_repeat" type="password" placeholder="重复密码" style="margin-top: 10px;">
                <template #prefix>
                    <el-icon>
                        <Lock />
                    </el-icon>
                </template>
            </el-input>
            <el-input v-model="form.email" type="email" placeholder="电子邮件" style="margin-top: 10px;">
                <template #prefix>
                    <el-icon>
                        <Message />
                    </el-icon>
                </template>
            </el-input>
        </div>

        <div style="margin-top: 10px;">
            <el-row :gutter="10">
                <el-col :span="17">
                    <el-input v-model="form.code" type="email" placeholder="验证码">
                        <template #prefix>
                            <el-icon>
                                <EditPen />
                            </el-icon>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="success">获取验证码</el-button>
                </el-col>
            </el-row>
        </div>

        <div style="margin-top: 75px;">
            <el-button style="width: 270px;" type="warning" plain>
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
import { reactive } from "vue";

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

</script>

<style scoped></style>
