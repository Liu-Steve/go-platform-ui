<template>
    <div class="box">
        <div class="board">
            <Goban :max-width="maxSize" :max-height="maxSize" :sign-map="signMap" :animate="isAnimate" :busy="isBusy"
                :coord-x="chineseCoordx" :coord-y="chineseCoordy" :show-coordinates="showCoordinates" @click="onVertexClick"
                style="text-align: center;" />
        </div>

        <div class="user">
            <el-row>
                <el-col :span="12">
                    <img :src="blackUrl" class="stone">
                    <!-- todo:userid -->
                    <span style="font-size: large;">用户1</span>
                    <el-icon v-show="player_is_black">
                        <CaretLeft />
                    </el-icon>
                </el-col>
                <el-col :span="12">
                    <img :src="whiteUrl" class="stone">
                    <!-- todo:userid -->
                    <span style="font-size: large;">用户2</span>
                    <el-icon v-show="!player_is_black">
                        <CaretLeft />
                    </el-icon>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-button type="warning" @click="onReset">重置棋盘</el-button>
                </el-col>
                <el-col :span="8">
                    <el-button type="warning" @click="{ showDialog = true; console.log(blackPlayer) }">显示弹窗</el-button>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="6">
                    <el-button type="success" @click="">停一手</el-button>
                </el-col>
                <el-col :span="6">
                    <el-button type="warning" @click="">认输</el-button>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-button type="primary" @click="">开始新游戏</el-button>
                </el-col>

                <el-col :span="6">
                    <el-button type="danger" @click="exitRoom">退出房间</el-button>
                </el-col>
            </el-row>

        </div>
    </div>

    <!-- 创建棋局弹窗 -->
    <el-dialog title="开始游戏" v-model="showDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false">
        <div style="text-align: center;">
            <el-row>
                <el-col>
                    房间ID：   {{ roomId }}
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <img :src="blackUrl" class="stone">
                    <span style="font-size: large;">{{ blackPlayer.name }}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <img :src="whiteUrl" class="stone">
                    <span style="font-size: large;">{{ whitePlayer.name }}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-button type="warning" @click="changePlayer">切换黑白方</el-button>
                </el-col>
            </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showDialog = false">取 消</el-button>
            <el-button type="primary" @click="createGame">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import Goban from '../components/Shudan/Goban.vue';
import { ref, reactive } from "vue";
import { get, post } from "../net";
import black from '../components/Shudan/css/stone_1.png'
import white from '../components/Shudan/css/stone_-1.png'
import { CaretLeft } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus';
import { chessboard, user2, roomowner } from '@/net/websocket.js'
//import { router } from "../router"

const chineseCoordx = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
const chineseCoordy = [19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const windowInnerWidth = document.documentElement.clientWidth;
const windowInnerHeight = document.documentElement.clientHeight;

let rawSignMap = new Array(19 * 19).fill(0);
let cur_player = ref(1);

export default {
    name: 'Shudan',

    components: {
        Goban,
        CaretLeft,
    },

    // setup() {
    //     let showDialog = reactive({ state: true });

    //     return{
    //         showDialog,
    //     }
    // },

    data: function () {
        return {
            signMap: JSON.parse(JSON.stringify(rawSignMap)),
            maxSize: Math.min(windowInnerWidth, windowInnerHeight),
            showCoordinates: false,
            isBusy: false,
            isAnimate: false,
            player_is_black: true,
            showDialog: true,

            blackUrl: black,
            whiteUrl: white,

            rawSignMap,
            chineseCoordx,
            chineseCoordy,

            blackPlayer: roomowner,
            whitePlayer: user2,
            roomId: localStorage.getItem("roomid"),
            //todo
            // roomId,
            // username_Owner,
            // username_User2,

            // blackPlayer: username_Owner,
            // whitePlayer,

        };
    },

    methods: {
        onVertexClick: function (offset) {
            if (rawSignMap[offset] == 0) {
                rawSignMap[offset] = cur_player.value;
                cur_player.value = -cur_player.value;
                this.player_is_black = cur_player.value === 1 ? true : false;
                this.signMap = JSON.parse(JSON.stringify(rawSignMap));
            }
        },
        onReset: function () {
            rawSignMap = new Array(19 * 19).fill(0);
            this.signMap = JSON.parse(JSON.stringify(rawSignMap));
            cur_player.value = 1;
            this.player_is_black = true;
        },
        exitRoom: function () {
            get("/api/room/exit/" + localStorage.getItem("userid") + "/" + localStorage.getItem("roomid"),
                () => { ElMessage.success("返回成功") });
            this.$router.push('/index');
        },
        changePlayer: function () {
            let tmp = this.blackPlayer;
            this.blackPlayer = this.whitePlayer;
            this.whitePlayer = tmp;
        },
        createGame: function () {
            post("/api/userId1/" + localStorage.getItem("userid") + localStorage.getItem("roomid"),
                { whitePlayerId: this.whitePlayer.id, blackPlayerId: this.blackPlayer.id, boardSize: 19, timeToDrop: 60 },
                () => { });
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


<style scope>
.box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    background-color: antiquewhite;
}

.board {
    flex: 7;
}

.user {
    flex: 3;
    /* text-align: center; */
    margin-top: 60px;
}

.el-row {
    margin-bottom: 20px;
}

.stone {
    width: 50px;
    height: auto;
    vertical-align: middle;
}
</style>

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