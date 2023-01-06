import { defineStore, acceptHMRUpdate } from 'pinia';
import { LocalStorage } from 'quasar';
type State = {
  wallet: string;
  type: 'User' | 'Admin' | null;
}

export const useUserStore = defineStore('user', {
  state: () => <State>({
    wallet: LocalStorage.getItem('pk') || '',
    type: LocalStorage.getItem('userType') || null as State['type']
  }),
  getters: {
    getType: (state) => state.type,
    getPk: (state) => state.wallet
  },
  actions: {
    setPk(v: string) {
      localStorage.setItem('pk', v)
      this.wallet = v
    },
    setType(v: State['type']) {
      if (!v) {
        localStorage.removeItem('userType')
      } else {
        localStorage.setItem('userType', v!)

      }
      this.type = v
    }
  }
});
