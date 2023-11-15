<template>
    <div>
        <el-image style="width: 100%;height: 100%;opacity: 0.5;filter: blur(3px);" fit="cover" :src="background"></el-image>
    </div>

    <el-card class="card">
        <el-row>
            <el-col>
                <h1 style="font-size: 48px; text-align: center;">
                    欢迎来到围棋平台
                </h1>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <el-button @click="createRoom" type="success" icon="CaretLeft" plain
                    style="width:200px;height: 200px;font-size: 24px;">
                    <div style="width: 100%;height: 100px;text-align: center;">
                        <el-image :src="plus_img"></el-image>
                        <p style="text-align: center;">创建房间</p>
                    </div>
                </el-button>
            </el-col>

            <el-col :span="12">
                <el-button @click="joinRoomDialogVisible.state = true" type="success" plain>
                    <el-icon>
                        <Plus />
                    </el-icon>
                    加入房间
                </el-button>

            </el-col>
        </el-row>

        <el-row style="margin-top: 300px;">
            <el-col :offset="20" :span="4">
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
    </el-card>
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
import background from '../assets/img/test.jpg'
import plus_img from '../assets/img/plus.png'
import { HomeFilled, Plus } from "@element-plus/icons-vue";

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
    get("/api/room/enter/" + localStorage.getItem("userid") + "/" + form.roomid,
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
.card {
    width: 1000px;
    height: 600px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 30px
}
</style>