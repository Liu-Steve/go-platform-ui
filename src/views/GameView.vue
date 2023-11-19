<template>
    <div style="width: 100vw;height:100vh;overflow:hidden;display: flex;background-color: antiquewhite;" ref="box">
        <!-- 左边棋盘 -->
        <div style="flex:1;">
            <Goban :max-width="maxSize" :max-height="maxSize" :sign-map="signMap" :selected-map="selectedMap"
                @click="onVertexClick" style="text-align: center;" />
        </div>

        <!-- 右边菜单 -->
        <div style="width:450px;margin-right: 15px;">
            <!-- 第一行，显示房间号的卡片 -->
            <el-row style="margin-top: 30px;">
                <el-col>
                    <el-card class="card">
                        <el-text style="font-size: 20px;">
                            房间ID： {{ roomId }}
                        </el-text>
                    </el-card>
                </el-col>
            </el-row>

            <!-- 第二行，显示用户名 -->
            <el-row style="margin-top: 30px;">
                <el-col>
                    <el-card class="card">
                        <el-text style="font-size: 20px;">
                            用户名： {{ userName }}
                        </el-text>
                    </el-card>
                </el-col>
            </el-row>

            <!-- 第三行，显示当前黑白棋的卡片 -->
            <el-row :gutter="20" style="margin-top: 20px;">
                <el-col :span="12">
                    <el-card class="card">
                        <el-text style="font-size: 20px;">
                            <img :src="blackStone" class="stone">
                            <span>{{ " " + blackPlayer.name }}</span>
                            <el-icon v-show="playerIsBlack">
                                <CaretLeft />
                            </el-icon>
                        </el-text>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="card">
                        <el-text style="font-size: 20px;">
                            <img :src="whiteStone" class="stone">
                            <span>{{ " " + whitePlayer.name }}</span>
                            <el-icon v-show="!playerIsBlack">
                                <CaretLeft />
                            </el-icon>
                        </el-text>
                    </el-card>
                </el-col>
            </el-row>

            <!-- 第四行，按钮卡片 -->
            <el-row style="margin-top: 20px;">
                <el-col>
                    <el-card class="card">


                        <el-row style="margin-top: 10px;">
                            <el-col :span="6">
                                <el-button type="success" @click="waitOneStep">停一手</el-button>
                            </el-col>
                            <el-col :span="6">
                                <el-button type="warning" @click="surrender">认输</el-button>
                            </el-col>
                        </el-row>

                        <el-row style="margin-top: 10px;">
                            <el-col :span="6">
                                <el-button type="danger" @click="exitRoom">退出房间</el-button>
                            </el-col>
                        </el-row>
                    </el-card>

                </el-col>
            </el-row>
        </div>
    </div>

    <!-- 创建棋局弹窗 -->
    <el-dialog title="开始游戏" v-model="showDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false" :before-close="resetData()">
        <div style="text-align: center;">
            <el-row v-show="isOwner">
                <el-col>
                    <el-text style="font-size: large;">房间ID： {{ roomId }}</el-text>
                </el-col>
            </el-row>
            <el-row v-show="isOwner">
                <el-col>
                    <el-text>
                        <img :src="blackStone" class="stone">
                        <span style="font-size: large;">{{ " " + blackPlayer.name }}</span>
                    </el-text>
                </el-col>
            </el-row>
            <el-row v-show="isOwner">
                <el-col>
                    <el-text>
                        <img :src="whiteStone" class="stone">
                        <span style="font-size: large;">{{ " " + whitePlayer.name }}</span>
                    </el-text>
                </el-col>
            </el-row>
            <el-row v-show="isOwner">
                <el-col>
                    <el-button type="warning" @click="changePlayer">切换黑白方</el-button>
                </el-col>
            </el-row>
            <!-- 另外一个用户的界面 -->
            <el-row v-show="!isOwner">
                <el-col>
                    <el-text>
                        等待房主开始游戏
                    </el-text>
                </el-col>
            </el-row>
            <el-row v-show="!isOwner">
                <el-col>
                    <el-button type="danger" @click="exitRoom">退出房间</el-button>
                </el-col>
            </el-row>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: right;" v-show="isOwner">
            <el-button @click="exitRoom">退出房间</el-button>
            <el-button type="primary" @click="createGame" :disabled="disableStartGame">开始游戏</el-button>
        </div>
    </el-dialog>

    <!-- 游戏结束弹窗 -->
    <el-dialog title="游戏结束" v-model="showDialogEnd" width="30%" :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false" :before-close="resetData()">

        <!-- 认输时显示 -->
        <div v-show=!isNotSurrender>
            <el-row>
                <el-col style="text-align: center;">
                    <el-text style="font-size: large;">{{ Winner }}</el-text>
                </el-col>
            </el-row>
        </div>

        <!-- 正常结束时显示 -->
        <div v-show=isNotSurrender>
            <div style="text-align: center;" v-show="waitForResult">
                <el-text size="large">
                    等待结果中……
                </el-text>
            </div>

            <div style="text-align: center;" v-show="!waitForResult">
                <div>
                    <el-row>
                        <el-col style="text-align: center;">
                            <el-text style="font-size: large;">{{ Winner }}</el-text>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-text>
                                <img :src="blackStone" class="stone">
                                <span style="font-size: large;">{{ " " + blackPlayer.name }}：</span>
                                <span style="font-size: large;">{{ " " + blackCount + "目" }}</span>
                            </el-text>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-text>
                                <img :src="whiteStone" class="stone">
                                <span style="font-size: large;">{{ " " + whitePlayer.name }}：</span>
                                <span style="font-size: large;">{{ " " + whiteCount + "目" }}</span>
                            </el-text>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>

        <div slot="footer" class="dialog-footer" style="text-align: right;margin-top: 20px;" v-show="!waitForResult">
            <el-button type="success" @click="{ showDialogEnd = false; showDialog = true }"
                v-show="isOwner">开始新游戏</el-button>
            <el-button type="success" @click="{ showDialogEnd = false; showDialog = true }"
                v-show="!isOwner">等待下一局</el-button>
            <el-button type="danger" @click="exitRoom">退出房间</el-button>
        </div>
    </el-dialog>
</template>


<script>
import Goban from '../components/Shudan/Goban.vue';
import { ref, reactive, getCurrentInstance, VueElement } from "vue";
import { get, post } from "../net";
import black from '../components/Shudan/css/stone_1.png'
import white from '../components/Shudan/css/stone_-1.png'
import { CaretLeft } from "@element-plus/icons-vue";
import { ElMessage, ElNotification } from 'element-plus';
import { useRoomStore } from '../stores/roomInformation';
import { storeToRefs } from 'pinia'
//import { router } from "../router"

const room = useRoomStore();

export default {
    name: 'Game',

    components: {
        Goban,
        CaretLeft,
    },

    data: function () {
        return {
            signMap: storeToRefs(room).jsonchessboard,
            maxSize: 480,
            isBusy: false,

            blackStone: black,
            whiteStone: white,

            // rawSignMap: storeToRefs(room).chessboard,

            // cur_player: true,
            playerIsBlack: storeToRefs(room).playerisblack,

            roomId: storeToRefs(room).roomid,
            userName: storeToRefs(room).username,
            isOwner: storeToRefs(room).isowner,
            blackPlayer: storeToRefs(room).blackplayer,
            whitePlayer: storeToRefs(room).whiteplayer,
            Winner: storeToRefs(room).winner,
            whiteCount: storeToRefs(room).whitecount,
            blackCount: storeToRefs(room).blackcount,
            selectedMap: storeToRefs(room).selectedmap,

            showDialog: storeToRefs(room).showdialog,
            showDialogEnd: storeToRefs(room).showdialogend,
            isNotSurrender: storeToRefs(room).isnotsurrender,
            disableStartGame: storeToRefs(room).disablestartgame,
            waitForResult: storeToRefs(room).waitforresult,

        };
    },

    // created() {
    //     // registerCallBack((roomowner, user2, chessboard) => {
    //     //     this.blackPlayer.id = roomowner; 
    //     //     this.whitePlayer = user2;
    //     // });
    //     bus.on("websocket", e => {
    //         // this.blackPlayer = 0;
    //         // this.whitePlayer = 0;
    //         // this.blackPlayer = e.roomowner;
    //         // this.whitePlayer = e.user2;
    //         if (!this.changePlayers) {
    //             Object.assign(this.whitePlayer, e.user2);
    //             Object.assign(this.blackPlayer, e.roomowner);
    //         }
    //         let Cboard = new Array(19 * 19).fill(0);
    //         for (let i = 0; i < 19; i++) {
    //             for (let j = 0; j < 19; j++) {
    //                 if (e.chessboard[i][j] === -1) Cboard[i * 19 + j] = 0;
    //                 else if (e.chessboard[i][j] === 0) Cboard[i * 19 + j] = 1;
    //                 else if (e.chessboard[i][j] === 1) Cboard[i * 19 + j] = -1;
    //             }
    //         }

    //         this.rawSignMap = Cboard
    //         this.signMap = JSON.parse(JSON.stringify(rawSignMap));
    //     });
    // },

    methods: {
        onVertexClick: function (offset) {
            if (room.gamestart && room.isdrop) {
                if (room.chessboard[offset] === 0) {
                    room.isdrop = false;

                    let y = parseInt(offset / 19);
                    let x = parseInt(offset - 19 * y);

                    post("/api/chessBoard/drops/" + room.userid + "/" + room.roomid, { "dropPosition": [y, x] },
                        (message) => { },
                        (failure, resultcode) => {
                            if (resultcode === 12003) {
                                room.isdrop = true;
                            }
                        });
                }
            }

        },
        // onReset: function () {
        // room.chessboard = new Array(19 * 19).fill(0);
        // this.signMap = JSON.parse(JSON.stringify(room.chessboard));
        // // cur_player.value = 1;
        // this.player_is_black = true;
        // },
        exitRoom: function () {
            get("/api/room/exit/" + room.userid + "/" + room.roomid,
                () => {
                    ElNotification({
                        title: "返回成功",
                        type: 'success'
                    })
                });
            room.blackplayer.id = ''
            room.blackplayer.name = ''
            room.whiteplayer.id = ''
            room.whiteplayer.name = ''
            room.showdialog = true;
            room.showdialogend = false;
            room.gamestart = false;
            room.disablestartgame = true;
            this.$router.push('/homepage');
        },
        changePlayer: function () {
            let tmp = room.blackplayer
            room.blackplayer = room.whiteplayer
            room.whiteplayer = tmp
        },
        createGame: function () {
            post("/api/chessBoard/" + room.userid + "/" + room.roomid,
                { whitePlayerId: room.whiteplayer.id, blackPlayerId: room.blackplayer.id, boardSize: 19, timeToDrop: 60 },
                () => { });
            room.gamestart = false;
            this.showDialog = false;
        },
        resetData: function () {
            this.blackPlayer = storeToRefs(room).blackplayer;
            this.whitePlayer = storeToRefs(room).whiteplayer;
        },
        waitOneStep: function () {
            if (room.gamestart) {
                if (room.isdrop) {
                    room.isdrop = false;
                    room.playerisblack = !room.playerisblack;
                    get("/api/chessBoard/stop_once/" + room.userid + "/" + room.roomid, () => { });
                }
            }
        },
        surrender: function () {
            if (room.gamestart) {
                room.winner = "你选择投降"
                room.gamestart = false;
                room.showdialogend = true;
                room.isnotsurrender = false;
                room.selectedmap = Array(19 * 19).fill(false);
                get("/api/chessBoard/over_request/" + room.userid + '/' + room.roomid, () => { })
            }
        },
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
        this.maxSize = Math.min(this.$refs.box.offsetWidth, this.$refs.box.offsetHeight);
    },

    destroyed() {
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