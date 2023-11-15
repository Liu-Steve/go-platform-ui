import { get } from '../net/index.js';
import mitt from 'mitt';
import { useRoomStore } from '../stores/RoomInformation.js'

export const bus = mitt();

const room = useRoomStore();

// WebSocket
var ws = null;
// WebSocket连接地址
var ws_url = 'wss://dragondj.space/ws'

// 创建WebSocket
// ws_create(ws_url);

// 创建WebSocket
function ws_create(url) {
	 try{
		// 判断是否支持 WebSocket
        if('WebSocket' in window){
			// 连接WebSocket
            ws = new WebSocket(url);
			// 初始化WebSocket事件(WebSocket对象, WebSocket连接地址)
			ws_event(ws, url);
        }
    }catch(e){
		// 重新连接WebSocket
        ws_recontent(url);
        console.log(e);
    }
}

function ws_close(){
    ws.close()
    room.ws_state = false
    ws_heartCheck.reset()
}

let chessboard = new Array(19).fill(Array(19).fill(-1));
let user2 = {id: "", name: ""};
let roomowner = {id: "", name: ""};
// let callBack = () => {};

// WebSocket 事件创建
function ws_event(ws, url) {
	ws.onopen = function (event) {
		// 心跳检测重置
		ws_heartCheck.reset().start();
		console.log("WebSocket已连接");
	};

	ws.onclose = function (event) {
		// 重新连接WebSocket
        ws_recontent(url);
		console.log("WebSocket连接已关闭");
	};

	ws.onerror = function (event) {
		// 重新连接WebSocket
        ws_recontent(url);
		console.log("WebSocket错误：", event);
	};

	ws.onmessage = function (event) {
		// 只要有数据，那就说明连接正常
		ws_heartCheck.reset().start();

		// 处理数据，只处理非心跳检测的数据
		if (event.data != 'Echo message: check') {
		  // 处理数据
          let data = JSON.parse(event.data);

          switch(data.mode){
            case 0://CHESS_WAIT
            chessboard = data.message.board;
            break;
            case 1://CHESS_START
            chessboard = data.message.board;
            break;
            case 2://CHESS_STOP_ONCE
            chessboard = data.message.board;
            break;
            case 3://CHESS_STOP_ONCE_ANOTHER
            chessboard = data.message.board;
            break;
            case 4://CHESS_REQUEST_STOP
            chessboard = data.message.board;
            break;
            case 10://ROOM_ENTER
            roomowner.id = data.message.createUserId
            roomowner.name = data.message.createUserName;
            user2.id = data.message.secondUserId;
            user2.name = get("/api/user/" + user2.id, 
                (message)=>{user2.name = message.result.username})
            break;
            case 11://ROOM_EXIT;
            user2.id = "";
            user2.name = "";
            roomowner.id = localStorage.getItem("userid");
            roomowner.name = get("/api/user/" + roomowner.id, 
            (message)=>{roomowner.name = message.result.username});
            break;
          }
            // callBack(roomowner, user2, chessboard);
            bus.emit("websocket", {roomowner: roomowner, user2: user2, chessboard: chessboard})

		}
	};
}

// function registerCallBack(func) {
//     callBack = func;
// }

// function unregisterCallBack() {
//     callBack = () => {};
// }

// 重新连接websocker(WebSocket连接地址)
function ws_recontent(url) {
    if(room.ws_state){
	    // 延迟避免请求过多
	    setTimeout(function () {
	    	ws_create(url);
	    }, 2000);
    }
}

// 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，这样服务端会抛异常。
window.onbeforeunload = function() {
    ws_close()
} 

// WebSocket心跳检测
var ws_heartCheck = {
    timeout: 5000,			// 5秒一次心跳
    timeoutObj: null,		// 执行心跳的定时器
    serverTimeoutObj: null,	// 服务器超时定时器
    reset: function(){		// 重置方法
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){		// 启动方法
        var self = this;
        this.timeoutObj = setTimeout(function(){
            // 这里发送一个心跳信息，后端收到后，返回一个消息，在onmessage拿到返回的心跳（信息）就说明连接正常
            ws.send("check");
			// 如果超过一定时间还没重置，说明后端主动断开了
            self.serverTimeoutObj = setTimeout(function(){
				// 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                ws.close();
            }, self.timeout);
        }, this.timeout);
    }
}


export {
    ws,
    ws_url,
    ws_create,
    ws_close,
    chessboard,
    user2,
    roomowner,
    // registerCallBack,
    // unregisterCallBack
}