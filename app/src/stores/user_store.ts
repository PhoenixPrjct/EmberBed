import { defineStore } from 'pinia';

// import { LocalStorage } from 'quasar';
type State = {
  wallet: string;
  type: 'User' | 'Admin' | null;
  nftsHeld: number;
}
export const useUserStore = defineStore('user', {
  state: () => <State>({
    wallet: '' as State['wallet'],
    type: null as State['type'],
    nftsHeld: 0 as State['nftsHeld']
  }),
  getters: {
    getType: (state) => state.type,
    getPk: (state) => state.wallet,
    getHeld: (state) => state.nftsHeld,
  },

  actions: {
    setUser(pk: State['wallet'], type: State['type'], nftsHeld: State['nftsHeld']) {
      console.log('SettingUser', pk, type)
      localStorage.setItem('EbUser', JSON.stringify([pk, type, nftsHeld]))
      this.type = type;
      this.wallet = pk;
      this.nftsHeld = nftsHeld;
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
    setHeld(v: number) {
      console.log(v, "EmberBed Eligible NFTs Found")
      const lsUser = localStorage.getItem('EbUser')
      if (!lsUser) return
      const lsUserObj = JSON.parse(lsUser)
      lsUserObj[2] = v
      localStorage.setItem('EbUser', JSON.stringify(lsUserObj))
      this.nftsHeld = v

    },
    logout() {
      localStorage.clear();
      this.wallet = '' as State['wallet'];
      this.type = null as State['type'];
      this.nftsHeld = 0 as State['nftsHeld']
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
