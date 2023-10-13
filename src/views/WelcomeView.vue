<script setup>
import background from '../assets/test.jpg'
</script>

<template>
    <div style="whdth: 100vw;height:100vh;overflow:hidden;display: flex;">
        <div style="flex:1;background-color: #6cf;">
            <el-image style="width: 100%;height: 100%;" fit="cover" :src="background" />
        </div>

        <div class="welcome-title">
            <div style="font-size: 30px;font-weight: bold;">欢迎来到围棋平台</div>
            <div style="margin-top: 20px;"></div>
        </div>

        <div style="width:400px;background-color: white;z-index: 1;">
            <router-view v-slot="{ Component }">
                <transition name="el-fade-in-linear" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<style scoped>
.welcome-title {
    position: absolute;
    bottom: 30px;
    left: 30px;
    color: white;
    text-shadow: 0 0 10px black;
}
</style>
