import{_ as x,k as T,br as D,r as l,ac as I,m as S,n as d,q as g,s as r,t as n,bI as E,G as p,v as i,E as w,C as R,a2 as B,F as K,x as h,a3 as N,y as Q,J as q,K as F}from"./index.473a68e4.js";import{u as W,b as z}from"./use-quasar.6502b0e2.js";import{u as M,C as V}from"./collectionSubmission.00463ec6.js";import{C as j}from"./formattingTools.f1849d04.js";import{C as G}from"./FireAcctInfoDialogue.8dcd7846.js";import"./user_store.67f2cfd7.js";import"./index.bfeaebb5.js";import"./rtl.1e8aab47.js";import"./server-api.40cb4079.js";import"./index.74226843.js";import"./SplashPage.342d73f3.js";import"./QSpace.57d54283.js";import"./QResizeObserver.e704c908.js";const J=s=>(q("data-v-5e8239b6"),s=s(),F(),s),L={class:"btn-container"},X=J(()=>r("section",{class:"info-container"},[r("h4",null,"This is where info will go on how to use this page.")],-1)),Y={key:1},$=T({__name:"DashPage",setup(s){const f=W(),{api:m,connection:C,program:y}=M(),c=D();l({rewardMint:"REWTvQ7zqtfoedwsPGCX9TF59HvAoM76LobtzmPPpko",collectionName:"TestEyes",collectionAddress:"CG4KDtfDDvYWP4ChqxKVLXjxjrg8VT28RoMpJgjYosFs",ratePerDay:3,fireEligible:!0,phoenixRelation:{kind:"Affiliate"},rewardSymbol:"$EYE"});const u=l(null),v=l(null),a=l([]),b=new I("REWTvQ7zqtfoedwsPGCX9TF59HvAoM76LobtzmPPpko");S(async()=>{const t=c.value?.publicKey.toBase58();if(console.log(u.value),!a.value?.length){await(await y.value.account.collectionRewardInfo.all()).map(o=>{console.log("DashPasge:57",o.account),o.account.manager.toBase58()==t&&(a.value=[...a.value,o])});return}});async function P(t,e){if(u.value=null,!m.value)return!1;v.value=await m.value.getAccounts({user:c.value.publicKey,collectionName:t,rewardMint:e});const{RewTok:o,stateBump:O,statePDA:A,rewardWallet:U,funderTokenAta:Z,userAccountPDA:ee,userRewardAta:oe,nftCollectionAddress:te}=v.value,_=await V.fetch(C,A);!_||(u.value=_.toJSON())}async function k(t,e){if(t.target.innerText?e=t.target.innerText:e=void 0,typeof e!="string")return f.notify({color:"red-10",textColor:"white",icon:"warning",message:"So that didn't work. . . sorry",caption:"Was Expecting Type To Be 'string' . . . contact the dev.",position:"top"});const o=await j(e);return f.notify({...o})}return(t,e)=>(d(),g(K,null,[r("section",L,[n(p,{dark:"",label:"Add New",icon:"add",class:E(a.value.length?void 0:"add-btn"),to:"/admin/new"},null,8,["class"]),n(p,{dark:"",label:"Stats",icon:"query_stats"},{default:i(()=>[n(z,null,{default:i(()=>[h("Coming Soon.")]),_:1})]),_:1}),n(p,{dark:"",label:"Active Collections",onClick:e[0]||(e[0]=o=>P("TestEyes",w(b).toBase58())),icon:"person"})]),X,a.value?(d(),R(G,{key:0,collectionPDAs:a.value},null,8,["collectionPDAs"])):(d(),g("section",Y,[n(B,{dark:"",class:"no-collections"},{default:i(()=>[n(N,{class:"text-h5 text-center"},{default:i(()=>[h(" No Collections Found for "),r("div",{class:"pubkey",onClick:e[1]||(e[1]=o=>k(o))},Q(w(c)?.publicKey),1)]),_:1})]),_:1})]))],64))}});var _e=x($,[["__scopeId","data-v-5e8239b6"],["__file","/home/proto/PhoenixProj/Repos/EmberBed/app/src/pages/admin/DashPage.vue"]]);export{_e as default};
