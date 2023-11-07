<template>
    <div class="box">
        <div class="board">
            <Goban :max-width="maxSize" :max-height="maxSize" :sign-map="signMap" :animate="isAnimate" :busy="isBusy"
                :coord-x="chineseCoordx" :coord-y="chineseCoordy" :show-coordinates="showCoordinates" @click="onVertexClick"
                style="text-align: center;" />
        </div>

        <div class="user">
            <el-row>
                <el-col>
                    房间ID： {{ roomId }}
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <img :src="blackUrl" class="stone">
                    <!-- todo:userid -->
                    <span style="font-size: large;">{{ blackPlayer.name }}</span>
                    <el-icon v-show="player_is_black">
                        <CaretLeft />
                    </el-icon>
                </el-col>
                <el-col :span="12">
                    <img :src="whiteUrl" class="stone">
                    <!-- todo:userid -->
                    <span style="font-size: large;">{{ whitePlayer.name }}</span>
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
                    <el-button type="primary" @click="createGame">开始新游戏</el-button>
                </el-col>

                <el-col :span="6">
                    <el-button type="danger" @click="exitRoom">退出房间</el-button>
                </el-col>
            </el-row>

        </div>

        <el-dialog title="开始游戏" v-model="showDialog" width="30%" :close-on-click-modal="false"
            :close-on-press-escape="false" :show-close="false" :key="Math.random()">
            <div style="text-align: center;">
                <el-row>
                    <el-col>
                        房间ID： {{ roomId }}
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
                        <el-button type="warning" @click="changePlayer" v-show="isOwner">切换黑白方</el-button>
                        <el-button type="warning" @click="tmpUpdate">刷新</el-button>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: right;">
                <!-- <el-button @click="showDialog = false">取 消</el-button> -->
                <el-button type="primary" @click="createGame" v-show="isOwner">确 定</el-button>
            </div>
        </el-dialog>
    </div>

    <!-- 创建棋局弹窗 -->
</template>

<script>
import Goban from '../components/Shudan/Goban.vue';
import { ref, reactive, getCurrentInstance, VueElement } from "vue";
import { get, post } from "../net";
import black from '../components/Shudan/css/stone_1.png'
import white from '../components/Shudan/css/stone_-1.png'
import { CaretLeft } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus';
import { chessboard, user2, roomowner, bus } from '../net/websocket.js'
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
            changePlayers: false,

            isOwner: roomowner.id == localStorage.getItem("userid"),
            //todo
            // roomId,
            // username_Owner,
            // username_User2,

            // blackPlayer: username_Owner,
            // whitePlayer,

        };
    },

    created() {
        // registerCallBack((roomowner, user2, chessboard) => {
        //     this.blackPlayer.id = roomowner; 
        //     this.whitePlayer = user2;
        // });
        bus.on("websocket", e => {
            // this.blackPlayer = 0;
            // this.whitePlayer = 0;
            // this.blackPlayer = e.roomowner;
            // this.whitePlayer = e.user2;
            if (!this.changePlayers) {
                Object.assign(this.whitePlayer, e.user2);
                Object.assign(this.blackPlayer, e.roomowner);
            }
            let Cboard = new Array(19 * 19).fill(0);
            for (let i = 0; i < 19; i++) {
                for (let j = 0; j < 19; j++) {
                    if (e.chessboard[i][j] === -1) Cboard[i * 19 + j] = 0;
                    else if (e.chessboard[i][j] === 0) Cboard[i * 19 + j] = 1;
                    else if (e.chessboard[i][j] === 1) Cboard[i * 19 + j] = -1;
                }
            }

            this.rawSignMap = Cboard
            this.signMap = JSON.parse(JSON.stringify(rawSignMap));
        });
    },

    methods: {
        onVertexClick: function (offset) {
            if (rawSignMap[offset] === 0) {
                rawSignMap[offset] = cur_player.value;
                // cur_player.value = -cur_player.value;
                this.player_is_black = !this.player_is_black;
            }

            let x = parseInt(offset / 19);
            let y = parseInt(offset - 19 * x);

            // this.signMap = JSON.parse(JSON.stringify(rawSignMap));
            post("/api/chessBoard/drops/" + localStorage.getItem("userid") + "/" + localStorage.getItem("roomid"), { "dropPosition": [y, x] },
                (message) => { });
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
            this.changePlayers = !this.changePlayers;
        },
        tmpUpdate: function () {
            console.log(roomowner.id);
            console.log(localStorage.getItem("userid"));
            console.log(roomowner.id == localStorage.getItem("userid"))

            this.$forceUpdate();
        },
        createGame: function () {
            post("/api/chessBoard/" + localStorage.getItem("userid") + "/" + localStorage.getItem("roomid"),
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
        },
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
        // unregisterCallBack();
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