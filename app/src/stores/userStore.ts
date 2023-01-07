import { base64 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { hash } from '@project-serum/anchor/dist/cjs/utils/sha256';
import { format } from 'path';
import { defineStore } from 'pinia';

// import { LocalStorage } from 'quasar';
type State = {
  wallet: string;
  type: 'User' | 'Admin' | null;
}





export const useUserStore = defineStore('user', {
  state: () => <State>({
    wallet: '' as State['wallet'],
    type: null as State['type']
  }),
  getters: {
    getType: (state) => state.type,
    getPk: (state) => state.wallet
  },

  actions: {
    setUser(pk: string, type: State['type']) {
      console.log('SettingUser', pk, type)
      localStorage.setItem('EbUser', JSON.stringify([pk, type]))
      this.type = type;
      this.wallet = pk;
    },
    setPk(v: string) {
      console.log('setting PK to', v)
      const lsUser = localStorage.getItem('EbUser')
      if (!lsUser) return
      const parsed = JSON.parse(lsUser)
      console.log(parsed)

      this.wallet = v
    },
    setType(v: State['type']) {
      console.log('setting Type to', v)
      this.type = v
    },
    logout() {
      localStorage.clear();
      this.wallet = '' as State['wallet'];
      this.type = null as State['type'];
    }
  },
  hydrate(storeState, initialState) {
    console.log('hydrating')
    const lsUser = localStorage.getItem('EbUser')
    if (!lsUser) return
    const lsUserObj = JSON.parse(lsUser)
    storeState.type = lsUserObj[1]
    storeState.wallet = lsUserObj[0]
    initialState.type = null
    initialState.wallet = ''
  }
});
