<template>
    <div>
        <div>
            欢迎来到围棋平台
        </div>
        <div>
            <!-- todo:退出登录 -->
            <el-button @click="logout" type="danger" plain>退出登录</el-button>

            <el-button @click="$router.push('/game')" type="success" plain>开始下棋</el-button>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import axios from "axios";
import { useRouter } from 'vue-router'

const router = useRouter();

const logout = () => {
    localStorage.removeItem('Authorization')
    axios.defaults.headers.common['Authorization'] = null
    ElMessage.success('已退出登录')
    router.push('/')
}

</script>

<style scoped></style>