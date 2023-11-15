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
  const roomid = ref(0)
  const userid = ref(0)
  const username = ref('')
  const ws_state = ref(false)
  const chessboard = ref(Array(19 * 19).fill(0));
  const roomplayer = ref({id: "", name: ""});
  const roomowner = ref({id: "", name: ""});
  const blackplayer = ref(roomowner)
  const whiteplayer = ref(roomplayer)
  const gamestart = ref(false)
  const showdialog = ref(true)
  const isowner = ref(false)
  // const blackplayername = ref('')
  // const blackplayerid = ref('')
  // const whiteplayername = ref('')
  // const whiteplayerid = ref('')
  // const currentcolor = ref('black')

  return { roomid, userid, username, ws_state, chessboard, roomplayer, roomowner, blackplayer, whiteplayer, gamestart, isowner, showdialog }
})
