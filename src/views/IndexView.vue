<template>
    <div class="all">
        <div class="title">
            <h1 style="font-size: 48px;">
                欢迎来到围棋平台
            </h1>
        </div>


        <el-row style="text-align: center;">
            <el-col>
                <el-button @click="createRoom" class="button" type="success" size="large" plain>创建房间</el-button>
            </el-col>

            <el-col>
                <el-button @click="joinRoom" class="button" type="success" size="large" plain>加入房间</el-button>
            </el-col>

            <el-col>
                <el-button @click="logout" class="button" type="danger" size="large" plain>退出登录</el-button>
            </el-col>
        </el-row>

        <div>
            <!-- 创建房间弹窗 -->
            <el-dialog title="加入房间" v-model="joinRoomDialogVisible.state" width="40%">
                <el-form :model="form">
                    <el-form-item label="房间ID" :label-width="formLabelWidth">
                        <el-input v-model="form.roomid" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="joinRoomDialogVisible.state = false">取 消</el-button>
                    <el-button type="primary" @click="joinRoom">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import axios from "axios";
import { useRouter } from 'vue-router'
import { reactive } from "vue";
import { get, post, put } from '../net';
import { Loading } from 'element-plus/es/components/loading/src/service';
import { ref } from 'vue';
import { roomowner, user2 } from "../net/websocket"

const router = useRouter();

const logout = () => {
    localStorage.removeItem('Authorization')
    axios.defaults.headers.common['Authorization'] = null
    ElMessage.success('已退出登录')
    router.push('/')
}

let joinRoomDialogVisible = reactive({ state: false });
let form = reactive({
    roomid: '',
})

const createRoom = () => {
    put('/api/room/' + localStorage.getItem("userid"), {},
        (message) => {
            localStorage.setItem("roomid", message.result.roomId);
            roomowner.name = message.result.createUserName;
            roomowner.id = message.result.createUserId;
            ElMessage.success('创建成功!');
            router.push('/game');
        })
}

const joinRoom = () => {
    get("/api/room/enter/" + localStorage.getItem("userid") + form.roomid,
        (message) => {
            localStorage.setItem("roomid", message.result.roomId);
            roomowner.id = message.result.createUserId;
            roomowner.name = message.result.createUserName;
            user2.name = localStorage.getItem("username");
            user2.id = localStorage.getItem("userid");
            router.push("/game");
        })
}

</script>

<style scoped>
.all {
    width: 400px;
    height: 300px;
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
    margin: auto;
}

.title {
    text-align: center;
}

.button {
    margin-top: 10px;
    text-align: center;

}
</style>