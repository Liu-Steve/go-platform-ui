<template>
    <div>
        <div>
            欢迎来到围棋平台
        </div>
        <div>
            <!-- todo:退出登录 -->
            <el-button @click="$router.push('/')" type="danger" plain>退出登录</el-button>

            <el-button @click="$router.push('/chess')" type="success" plain>开始下棋</el-button>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';

const logout = () => {
    get('/user/logout', () => {
        ElMessage.success(message)
        router.push('/')
    })
}

</script>

<style scoped></style>