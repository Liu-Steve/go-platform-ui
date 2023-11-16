<template>
    <div style="width: 100vw;height: 100vh;overflow:hidden;">
        <!-- 背景图片 -->
        <div>
            <el-image style="width: 100%;height: 100%; ;opacity: 0.5;filter: blur(3px);" fit="cover"
                :src="background"></el-image>
        </div>

        <!-- 中央卡片 -->
        <el-card class="card">
            <el-row style="height: 100px;">
                <el-col>
                    <h1 style="font-size: 48px; text-align: center;">
                        欢迎来到围棋平台
                    </h1>
                </el-col>
            </el-row>

            <el-row style="margin-top: 10px;">
                <el-col style="text-align: center;">
                    <el-text size="large">
                        您好,{{ form.username }}
                        <el-button @click="logout" class="button" type="danger" plain>
                            退出登录
                        </el-button>
                    </el-text>
                </el-col>
            </el-row>

            <el-row style="margin-top: 30px;height:250px;">
                <el-col :span="12">
                    <el-button @click="createRoom" type="success" plain class="button1">
                        <div style="width: 100px;height: 150px;">
                            <el-image :src="home_img"></el-image>
                            <p style="text-align: center;"> 创建房间</p>
                        </div>
                    </el-button>
                </el-col>

                <el-col :span="12">
                    <el-button @click="joinRoomDialogVisible.state = true" type="success" plain class="button1">
                        <div style="width: 100px;height: 150px;">
                            <el-image :src="plus_img"></el-image>
                            <p style="text-align: center;"> 加入房间</p>
                        </div>
                    </el-button>

                </el-col>
            </el-row>

        </el-card>
    </div>

    <!-- 创建房间弹窗 -->
    <el-dialog title="加入房间" v-model="joinRoomDialogVisible.state" width="30%">
        <el-form :model="form">
            <el-form-item label="房间ID">
                <el-input v-model="form.roomid" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="joinRoomDialogVisible.state = false">取 消</el-button>
            <el-button type="primary" @click="joinRoom">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script setup>
import { ElMessage, ElNotification } from 'element-plus';
import axios from "axios";
import { useRouter } from 'vue-router'
import { reactive } from "vue";
import { get, post, put } from '../net';
import { useRoomStore } from "../stores/roomInformation.js"
import { ws, ws_close } from "../net/websocket"
import { storeToRefs } from 'pinia'
import background from '../assets/img/test.jpg'
import home_img from '../assets/img/home.png'
import plus_img from '../assets/img/add.png'

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
    username: storeToRefs(room).username
})

const createRoom = () => {
    put('/api/room/' + room.userid, {},
        (message) => {
            room.roomid = message.result.roomId;
            room.roomowner.name = message.result.createUserName;
            room.roomowner.id = message.result.createUserId;
            room.isowner = true;
            // room.roomplayer.name = ''
            // room.roomplayer.id = ''
            // room.blackplayerid = room.roomowner.id;
            // room.blackplayername = room.roomowner.name;
            ElNotification({
                title: "创建成功",
                type: 'success'
            })
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
            room.isowner = false;
            router.push("/game");
        })
}

</script>

<style scoped>
.card {
    width: 800px;
    height: 550px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 30px;
}

.button1 {
    width: 70%;
    height: 100%;
    font-size: 24px;
    display: block;
    margin: 0 auto;
}
</style>