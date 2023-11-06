<template>
    <div>
        <div>
            欢迎来到围棋平台
        </div>
        <div>
            <!-- todo:退出登录 -->
            <el-button @click="logout" type="danger" plain>退出登录</el-button>

            <!-- <el-button @click="$router.push('/game')" type="success" plain>开始下棋</el-button> -->
            <el-button @click="createRoom" type="success" plain>创建房间</el-button>
            <el-button @click="joinRoom" type="success" plain>加入房间</el-button>

        </div>
        <!-- 创建房间弹窗 -->
        <div>
            <el-dialog title="收货地址" v-model="createRoomDialogVisible.state">
                <el-form :model="form">
                    <el-form-item label="活动名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="活动区域" :label-width="formLabelWidth">
                        <el-select v-model="form.region" placeholder="请选择活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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

const router = useRouter();

const logout = () => {
    localStorage.removeItem('Authorization')
    axios.defaults.headers.common['Authorization'] = null
    ElMessage.success('已退出登录')
    router.push('/')
}

let createRoomDialogVisible = reactive({state: false});
let form = reactive({
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
    })

const createRoom = () => {
    put('/api/room/' + localStorage.getItem("userid"), {}, 
    (message) => {
    ElMessage.success('创建成功!');
    router.push('/game');
    })
}

const joinRoom = () => {
    createRoomDialogVisible.state = true;
}

</script>

<style scoped></style>