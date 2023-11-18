import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, doubleCount, increment }
// })

export const useRoomStore = defineStore('room', () => {
	//用户信息
	const userid = ref(0)
	const username = ref('')
	const ws_state = ref(false)

	//房间及对局信息
	const roomid = ref(0)
	const chessboard = ref(Array(19 * 19).fill(0));
	const jsonchessboard = ref(JSON.parse(JSON.stringify(Array(19 * 19).fill(0))));
	const roomplayer = ref({ id: "", name: "" });
	const roomowner = ref({ id: "", name: "" });
	const blackplayer = ref(roomowner)
	const whiteplayer = ref(roomplayer)
	const gamestart = ref(false)
	const showdialog = ref(true)
	const isowner = ref(false)
	const playerisblack = ref(true)
	const isdrop = ref(true)
	const disablestartgame = ref(true)
	const selectedmap = ref(Array(19 * 19).fill(false));

	//对局结束信息
	const winner = ref('')
	const whitecount = ref(0)
	const blackcount = ref(0)
	const showdialogend = ref(false)
	const waitforresult = ref(false)
	const isnotsurrender = ref(true)

	return {
		userid, username, ws_state,
		roomid, chessboard, jsonchessboard, roomplayer, roomowner, blackplayer, whiteplayer,
		gamestart, isowner, showdialog, playerisblack, isdrop, disablestartgame, selectedmap,
		winner, whitecount, blackcount, showdialogend, waitforresult, isnotsurrender
	}
})
