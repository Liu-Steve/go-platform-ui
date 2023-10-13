<template>
    <div>
        <h1>围棋平台</h1>

        <div class="normalGameDiv" style="display: block">
            <label>玩家颜色设定：</label>
            <span class="userColorList">
                <input id="colorInput0" type="color" value="#000000">
                <input id="colorInput1" type="color" value="#ffffff">
            </span>
            <button class="animationSwitch-boardShake">落子棋盘振特效：false</button>
            <button class="animationSwitch-shockWave">吃子震荡波特效：true</button>
            <button class="animationSwitch-connect">棋子连接效果：false</button>
            <div class="table"></div>
        </div>
    </div>
</template>

<script setup>
import '../assets/scripts/tools.js';
import '../assets/scripts/point.js';
import '../assets/scripts/gameObject.js';
import '../assets/scripts/game.js';
import '../assets/scripts/normalGame.js';
import '../assets/scripts/index.js';

</script>

<style scoped></style>