<template>
    <div style="display: flex; padding: 10px;">
        <div style="width: calc(100vh - 20px); height: calc(100vh - 20px);">
            <!-- 参数解释 -->
            <!-- max-width & max-height 长宽 -->
            <!-- sign-map 落子情况 -->
            <!-- animate 动画（暂时不明） -->
            <!-- busy 为1时棋盘不能下棋 -->
            <!-- range-x & range-y 显示局部棋盘 -->
            <!-- coord-x & coord-y 横纵坐标表示（目前效果不好） -->
            <!-- show-coordinates 是否显示坐标轴 -->
            <!-- fuzzy-stone-placement 暂时不清楚 -->
            <!-- animate-stone-placement 暂时不清楚 -->
            <!-- paint-map 显示黑色或白色的背景（暂时有问题） -->
            <!-- heat-map 显示文字数据 -->
            <!-- marker-map 显示标记（暂时有问题） -->
            <!-- ghost-stone-map 显示隐形棋子（暂时有问题）-->
            <!-- lines 显示线条 -->
            <!-- dimmed-map 显示无效的落子点（暂时有问题） -->
            <!-- selected-map 显示选中的点（暂时有问题） -->
            <Goban :max-width="maxSize" :max-height="maxSize" :sign-map="signMap" :animate="isAnimate" :busy="isBusy"
                :coord-x="chineseCoordx" :coord-y="chineseCoordy" :show-coordinates="showCoordinates"
                @click="onVertexClick" />
        </div>

        <div style="margin: 10px;float:right">
            <div>
                <el-button type="warning" @click="onReset">重置棋盘</el-button>
                <el-button type="warning" @click="exitRoom">退出房间</el-button>
            </div>
        </div>

    </div>
</template>

<script>
import Goban from '../components/Shudan/Goban.vue';
import { ref } from "vue";
import { get } from "../net";

const chineseCoordx = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
const chineseCoordy = [19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const windowInnerWidth = document.documentElement.clientWidth;
const windowInnerHeight = document.documentElement.clientHeight;

let rawSignMap = new Array(19 * 19).fill(0);
let cur_player = ref(1);

export default {
    name: 'Shudan',

    components: {
        Goban
    },

    data: function () {
        return {
            signMap: JSON.parse(JSON.stringify(rawSignMap)),
            maxSize: Math.min(windowInnerWidth, windowInnerHeight) - 15,
            showCoordinates: false,
            isBusy: false,
            isAnimate: false,

            rawSignMap,
            chineseCoordx,
            chineseCoordy,
        };
    },

    methods: {
        onVertexClick: function (offset) {
            console.log(offset);
            if (rawSignMap[offset] == 0) {
                rawSignMap[offset] = cur_player.value;
                cur_player.value = -cur_player.value;
                this.signMap = JSON.parse(JSON.stringify(rawSignMap));
            }
        },
        onReset: function () {
            rawSignMap = new Array(19 * 19).fill(0);
            this.signMap = JSON.parse(JSON.stringify(rawSignMap));
            cur_player.value = 1;
        },
        exitRoom: function() {
            get("/api/room/exit/" + localStorage.getItem("userid") + "/" + localStorage.getItem("roomid"), ()=>{});
        }
    },

    computed: {
        checkBoxs: function () {
            return [
                { stateKey: 'showCoordinates', text: 'Show coordinates' },
                { stateKey: 'isBusy', text: 'Busy' }
            ];
        }
    },

    watch: {
        checkedNames: function () {
            let { checkBoxs, checkedNames } = this;
            checkBoxs.map((value) => {
                let { stateKey } = value;
                let newState = checkedNames.indexOf(stateKey) > -1 ? true : false;
                if (this[stateKey] != newState)
                    this[stateKey] = newState;
            });
        }
    },

    mounted() {
        //窗口尺寸改变
        window.onresize = () => {
            return (() => {
                this.$router.go(0);
            })();
        };
    },

    destroyed() {
        // 销毁
        window.onresize = null;
    },
};
</script>


<style></style>