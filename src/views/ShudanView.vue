<template>
    <div style="display: flex; padding: 10px;">
        <div style="width: calc(100vh - 20px); height: calc(100vh - 20px);">
            <Goban :max-width="maxSize" :max-height="maxSize" :sign-map="signMap" :animate="true" :busy="false"
                :range-x="showCorner ? [8, 18] : undefined" :range-y="showCorner ? [12, 18] : undefined"
                :coord-x="chineseCoordx" :coord-y="chineseCoordy" :show-coordinates="false" :fuzzy-stone-placement="false"
                :animate-stone-placement="false" :paint-map="showPaintMap ? paintMap : undefined"
                :heat-map="showHeatMap ? heatMap : undefined" :marker-map="showMarkerMap ? markerMap : undefined"
                :ghost-stone-map="showGhostStones ? ghostStoneMap : undefined" :lines="showLines ? [
                    { type: 'line', v1: [15, 6], v2: [12, 15] },
                    { type: 'arrow', v1: [10, 4], v2: [5, 7] }
                ] : []" :dimmed-map="showDimmedStones ? dimmedMap : []"
                :selected-map="showSelection ? selectedMap : []" @click="onVertexClick" />
        </div>
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

        <div style="margin: 10px;float:right">
            <div>
                <el-button type="warning" @click="onReset">重置棋盘</el-button>
            </div>

        </div>

    </div>
</template>

<script>
import Goban from '../components/Shudan/Goban.vue';
import { ref } from "vue"

const chineseCoordx = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
const chineseCoordy = [19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

let rawSignMap = new Array(19 * 19).fill(0);

const paintMap = [];
const heatMap = [];
const markerMap = [];
const ghostStoneMap = [];
const dimmedMap = [];
const selectedMap = [];

const windowInnerWidth = document.documentElement.clientWidth;
const windowInnerHeight = document.documentElement.clientHeight;

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
            alternateCoordinates: false,
            showCorner: false,
            showDimmedStones: false,
            fuzzyStonePlacement: false,
            animateStonePlacement: false,
            showPaintMap: false,
            showHeatMap: false,
            showMarkerMap: false,
            showGhostStones: false,
            showLines: false,
            showSelection: false,
            isBusy: false,

            rawSignMap,
            chineseCoordx,
            chineseCoordy,
            paintMap,
            heatMap,
            markerMap,
            ghostStoneMap,
            dimmedMap,
            selectedMap,
            checkedNames: []
        };
    },

    mounted() {
        //窗口尺寸改变
        window.onresize = () => {
            return (() => {
                // this.$forceUpdate();//强制更新数据
                this.$router.go(0);
            })();
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
        }
    },

    computed: {
        checkBoxs: function () {
            return [
                { stateKey: 'showCoordinates', text: 'Show coordinates' },
                { stateKey: 'alternateCoordinates', text: 'Alternate coordinates' },
                { stateKey: 'showCorner', text: 'Show lower right corner only' },
                { stateKey: 'showDimmedStones', text: 'Dim dead stones' },
                { stateKey: 'fuzzyStonePlacement', text: 'Fuzzy stone placement' },
                { stateKey: 'animateStonePlacement', text: 'Animate stone placement' },
                { stateKey: 'showMarkerMap', text: 'Show markers' },
                { stateKey: 'showGhostStones', text: 'Show ghost stones' },
                { stateKey: 'showPaintMap', text: 'Show paint map' },
                { stateKey: 'showHeatMap', text: 'Show heat map' },
                { stateKey: 'showLines', text: 'Show lines' },
                { stateKey: 'showSelection', text: 'Show selection' },
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

    destroyed() {
        // 销毁
        window.onresize = null;
    },
};
</script>


<style>
body {
    font-family: "Segoe UI", Ubuntu, Helvetica, Arial, sans-serif;
}
</style>