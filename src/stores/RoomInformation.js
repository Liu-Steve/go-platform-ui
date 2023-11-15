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
  const roomid = 0
  const user1id = 0
  const user1name = ''
  const user2id = 0
  const user2name = ''
  const ws_state = false

  return { roomid, user1id, user1name, user2id, user2name, ws_state}
})
