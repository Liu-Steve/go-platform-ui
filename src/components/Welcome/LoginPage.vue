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
            <!-- <el-button @click="router.push('/index')" style="width: 270px;" type="success" plain>立即登录</el-button> -->
        </div>
        <el-divider>
            <span style="color:grey;font-size: 13px;">没有账号</span>
        </el-divider>
        <div>
            <el-button @click="$router.push('register')" style="width: 270px;" type="warning" plain>
                注册账号
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue';
import { reactive } from "vue";
import { ws, ws_create } from '../../net/websocket';
import { get, post } from '../../net/index';
import { useRouter } from 'vue-router';
import axios from "axios";
import { useRoomStore } from '../../stores/roomInformation'
// import { getRowIdentity } from 'element-plus/es/components/table/src/util';

const router = useRouter();

const form = reactive({
    "username": "",
    "password": "",
    "remembered": false,
});

const room = useRoomStore();

//持久化账号密码
form.username = localStorage.getItem("username");
form.password = localStorage.getItem("password");
form.remembered = localStorage.getItem("remembered") == 'true' ? true: false;

const login = () => {
    if (!form.username || !form.password) {
        ElMessage.warning('请填写用户名和密码')
    }
    else {
        post('/api/user/login', {
            "feature": form.username,
            "password": form.password,
        }, (message) => {
            ElMessage.success('登陆成功!')
            if (form.remembered) {
                localStorage.setItem('username', form.username);
                localStorage.setItem("userid", message.result.user.id)
                localStorage.setItem('password', form.password); 
                localStorage.setItem("remembered", 'true')   // 持久化
            }
            else{
                localStorage.setItem('username', '');
                localStorage.setItem("userid", '')
                localStorage.setItem('password', ''); 
                localStorage.setItem("remembered", 'false')   // 取消持久化
            }
            //持久化用户的token
            axios.defaults.headers.common['Authorization'] = `Bearer ${message.result.token}`;
            localStorage.setItem("Authorization", message.result.token)

            //纪录用户信息
            room.userid = message.result.user.id
            room.username = form.username

            //建立websocket连接
            let url = "wss://dragondj.space/ws?Authorization=" + message.result.token;
            room.ws_state = true
            ws_create(url)
            //let ws = new WebSocket(url)
            //router.push('/index')

            //页面跳转
            router.push('/homepage')
        }
        )
    }
}

</script>

<style scoped></style>

