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
                    <el-button @click="createRoomDialogVisible.state = true" type="success" plain class="button1">
                        <div style="width: 100px;height: 150px;">
                            <el-image :src="home_img"></el-image>
                            <p style="text-align: center;">创建房间</p>
                        </div>
                    </el-button>
                </el-col>

                <el-col :span="12">
                    <el-button @click="joinRoomDialogVisible.state = true;" type="success" plain class="button1">
                        <div style="width: 100px;height: 150px;">
                            <el-image :src="plus_img"></el-image>
                            <p style="text-align: center;">加入房间</p>
                        </div>
                    </el-button>

                </el-col>
            </el-row>

        </el-card>
    </div>

    <!-- 创建房间弹窗 -->
    <el-dialog title="选择游戏种类" v-model="createRoomDialogVisible.state" width="20%">
        <el-row>
            <el-col :span="12" style="text-align: center;">
                <el-button @click="createRoom" type="success" size="large" plain>
                    与人对弈
                </el-button>
            </el-col>
            <el-col :span="12" style="text-align: center;">
                <el-button @click="" type="success" size="large" plain>
                    人机对弈
                </el-button>
            </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer" style="text-align: center;margin-top: 30px;">
            <el-button @click="createRoomDialogVisible.state = false" type="primary">返 回</el-button>
        </div>
    </el-dialog>

    <!-- 加入房间弹窗 -->
    <el-dialog title="加入房间" v-model="joinRoomDialogVisible.state" width="30%" :before-close="resetData()">

        <el-row>
            <el-col :span="12">
                <el-text size="large" tag="h3">
                    当前可加入房间：
                </el-text>
            </el-col>
            <el-col :span="12">
                <el-button @click=resetData() style="float: right;margin-right: 25px;" type="primary">刷 新</el-button>
            </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
            <el-col>
                <el-table :data="roomList" stripe empty-text="暂无房间" height="250">
                    <el-table-column label="房间ID" prop="roomId" />
                    <el-table-column label="房主" prop="createUserName" />
                    <el-table-column label="人数" prop="personCount" />
                    <el-table-column width="100px">
                        <template #default="scope">
                            <el-button type="success" @click="joinRoom(room.userid, scope.row.roomId)">
                                加 入
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <el-row style="margin-top: 10px;">
            <el-col>
                <el-text size="large" tag="h3">
                    输入房间ID加入：
                </el-text>
            </el-col>
        </el-row>

        <el-row style="margin-top: 10px;">
            <el-col>
                <el-form :model="form">
                    <el-form-item label="房间ID">
                        <el-row :gutter="10" style="width: 100%;">
                            <el-col :span="20">
                                <el-input v-model="form.roomid" autocomplete="off"></el-input>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="success" @click="joinRoom(room.userid, form.roomid)">加 入</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>

                </el-form>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script setup>
import { ElMessage, ElNotification } from 'element-plus';
import axios from "axios";
import { useRouter } from 'vue-router'
import { nextTick, reactive, ref } from "vue";
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

let createRoomDialogVisible = reactive({ state: false });
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

const joinRoom = (userid, roomid) => {
    get("/api/room/enter/" + userid + "/" + roomid,
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

let roomList = ref();

const resetData = () => {
    get("/api/room/list",
        (message) => {
            roomList.value = [];
            for (let i = 0, len = message.result.length; i < len; i++) {
                if (message.result[i].personCount === 1) {
                    roomList.value.push(message.result[i])
                }
            }
        })
    form.roomid = '';
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