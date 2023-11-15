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
                <el-button @click="joinRoomDialogVisible.state = true" class="button" type="success" size="large"
                    plain>加入房间</el-button>
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
import { useRoomStore } from "../stores/RoomInformation.js"
import { ws, ws_close } from "../net/websocket"

const router = useRouter();

const room = useRoomStore();

const logout = () => {
    localStorage.removeItem('Authorization')
    axios.defaults.headers.common['Authorization'] = null
    ws_close()
    ElMessage.success('已退出登录')
    router.push('/')
}

let joinRoomDialogVisible = reactive({ state: false });
let form = reactive({
    roomid: '',
})

const createRoom = () => {
    put('/api/room/' + room.userid, {},
        (message) => {
            room.roomid = message.result.roomId;
            room.roomowner.name = message.result.createUserName;
            room.roomowner.id = message.result.createUserId;
            // room.roomplayer.name = ''
            // room.roomplayer.id = ''
            // room.blackplayerid = room.roomowner.id;
            // room.blackplayername = room.roomowner.name;
            ElMessage.success('创建成功!');
            router.push('/game');
        })
}

const joinRoom = () => {
    get("/api/room/enter/" + room.userid + "/" + form.roomid,
        (message) => {
            room.roomid = message.result.roomId
            room.roomowner.id = message.result.createUserId;
            room.roomowner.name = message.result.createUserName;
            room.roomplayer.name = room.username
            room.roomplayer.id = room.userid

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