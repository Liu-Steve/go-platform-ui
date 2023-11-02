<template>
    <div>
        <div>
            欢迎来到围棋平台
        </div>
        <div>
            <!-- todo:退出登录 -->
            <el-button @click="logout" type="danger" plain>退出登录</el-button>

            <el-button @click="$router.push('/game')" type="success" plain>开始下棋</el-button>
            <el-button @click="testfunc" type="success" plain>test</el-button>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import axios from "axios";
import { useRouter } from 'vue-router'
import { get, post } from '../net';
import { Loading } from 'element-plus/es/components/loading/src/service';

const router = useRouter();

const logout = () => {
    localStorage.removeItem('Authorization')
    axios.defaults.headers.common['Authorization'] = null
    ElMessage.success('已退出登录')
    router.push('/')
}

const testfunc = () => {
    // get("/api/hello/name", (data, status) => 
    // {
    //     ElMessage(data.resultMessage);
    //     console.log(data);
    //     console.log(status);

    // });

    var loc = window.location, new_uri; 
    if (loc.protocol === "https:") { 
        new_uri = "wss:"; 
    } else { 
        new_uri = "ws:"; 
    } 
    new_uri += "//" + loc.host + "/websocket path";

    let ws = new WebSocket(new_uri);
    ws.send("hello");
}

</script>

<style scoped></style>