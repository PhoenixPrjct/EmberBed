import{a0 as o}from"./index.473a68e4.js";const n=o("user",{state:()=>({wallet:"",type:null,nftsHeld:0}),getters:{getType:e=>e.type,getPk:e=>e.wallet,getHeld:e=>e.nftsHeld},actions:{setUser(e,t,s){console.log("SettingUser",e,t),localStorage.setItem("EbUser",JSON.stringify([e,t,s])),this.type=t,this.wallet=e,this.nftsHeld=s},setPk(e){console.log("setting PK to",e);const t=localStorage.getItem("EbUser");if(!t)return;const s=JSON.parse(t);console.log(s),this.wallet=e},setType(e){console.log("setting Type to",e),this.type=e},setHeld(e){console.log(e,"EmberBed Eligible NFTs Found");const t=localStorage.getItem("EbUser");if(!t)return;const s=JSON.parse(t);s[2]=e,localStorage.setItem("EbUser",JSON.stringify(s)),this.nftsHeld=e},logout(){localStorage.clear(),this.wallet="",this.type=null,this.nftsHeld=0}},hydrate(e,t){console.log("hydrating");const s=localStorage.getItem("EbUser");if(!s)return;const l=JSON.parse(s);e.type=l[1],e.wallet=l[0],t.type=null,t.wallet=""}});export{n as u};
