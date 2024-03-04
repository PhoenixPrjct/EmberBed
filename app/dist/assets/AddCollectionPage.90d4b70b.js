import{Q as ae,a as pe}from"./QImg.29019ee4.js";import{a as ge,r as x,N as ye,aB as be,aC as he,R as ke,g as we,L as _e,j as Se,bJ as Ve,aq as oe,aI as xe,bK as Ce,bL as Re,_ as Te,k as Ee,A as Ie,z as Ae,m as Pe,n as f,C as N,v as t,q as T,s as c,y as X,t as e,x as d,af as $,a4 as h,G as E,H as _,a5 as te,bI as Fe,E as Qe,F as Ne,u as Ue,a2 as Z,a6 as ne,D as Be,a3 as D,Q as z,I as se,J as Me,K as qe}from"./index.473a68e4.js";import{u as Le,b as ie,Q as k,a as g,c as ue}from"./use-quasar.6502b0e2.js";import{Q as re}from"./QSpace.57d54283.js";import{Q as je}from"./QSelect.268286ed.js";import{Q as $e}from"./QPage.b94e6653.js";import{T as De,u as We,k as Ke,n as Oe,o as ze,C as Ge,p as He,q as W,A as Je,t as Ye,w as Xe,M as Ze,N as el}from"./collectionSubmission.00463ec6.js";import{u as ll}from"./server-api.40cb4079.js";import"./QChip.aacf81f4.js";import"./rtl.1e8aab47.js";import"./user_store.67f2cfd7.js";import"./index.bfeaebb5.js";import"./index.74226843.js";async function al(){return await(await new De().resolve()).filterByClusterSlug("mainnet-beta").getList()}async function ol(m,U){const I=(await al()).filter(C=>C[m]==U);return I?(console.log(I),I):null}var tl=ge({name:"QForm",props:{autofocus:Boolean,noErrorFocus:Boolean,noResetFocus:Boolean,greedy:Boolean,onSubmit:Function},emits:["reset","validationSuccess","validationError"],setup(m,{slots:U,emit:y}){const I=Se(),C=x(null);let A=0;const R=[];function B(i){const V=typeof i=="boolean"?i:m.noErrorFocus!==!0,o=++A,u=(r,v)=>{y("validation"+(r===!0?"Success":"Error"),v)},n=r=>{const v=r.validate();return typeof v.then=="function"?v.then(w=>({valid:w,comp:r}),w=>({valid:!1,comp:r,err:w})):Promise.resolve({valid:v,comp:r})};return(m.greedy===!0?Promise.all(R.map(n)).then(r=>r.filter(v=>v.valid!==!0)):R.reduce((r,v)=>r.then(()=>n(v).then(w=>{if(w.valid===!1)return Promise.reject(w)})),Promise.resolve()).catch(r=>[r])).then(r=>{if(r===void 0||r.length===0)return o===A&&u(!0),!0;if(o===A){const{comp:v,err:w}=r[0];if(w!==void 0&&console.error(w),u(!1,v),V===!0){const K=r.find(({comp:q})=>typeof q.focus=="function"&&Ve(q.$)===!1);K!==void 0&&K.comp.focus()}}return!1})}function P(){A++,R.forEach(i=>{typeof i.resetValidation=="function"&&i.resetValidation()})}function b(i){i!==void 0&&oe(i);const V=A+1;B().then(o=>{V===A&&o===!0&&(m.onSubmit!==void 0?y("submit",i):i!==void 0&&i.target!==void 0&&typeof i.target.submit=="function"&&i.target.submit())})}function M(i){i!==void 0&&oe(i),y("reset"),xe(()=>{P(),m.autofocus===!0&&m.noResetFocus!==!0&&Q()})}function Q(){Ce(()=>{if(C.value===null)return;const i=C.value.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||C.value.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||C.value.querySelector("[autofocus], [data-autofocus]")||Array.prototype.find.call(C.value.querySelectorAll("[tabindex]"),V=>V.tabIndex!==-1);i?.focus({preventScroll:!0})})}ye(Re,{bindComponent(i){R.push(i)},unbindComponent(i){const V=R.indexOf(i);V!==-1&&R.splice(V,1)}});let S=!1;return be(()=>{S=!0}),he(()=>{S===!0&&m.autofocus===!0&&Q()}),ke(()=>{m.autofocus===!0&&Q()}),Object.assign(I.proxy,{validate:B,resetValidation:P,submit:b,reset:M,focus:Q,getValidationComponents:()=>R}),()=>we("form",{class:"q-form",ref:C,onSubmit:b,onReset:M},_e(U.default))}});const G=m=>(Me("data-v-99361acc"),m=m(),qe(),m),nl={key:0,class:"submission-loading"},sl={class:"text-h6"},il={class:"text-center"},ul={key:1,class:"q-pa-sm form--container",style:{width:"90%"}},rl={class:"general-info"},dl=G(()=>c("small",null,"This is how we categorize your NFT collection on the platform.",-1)),cl={class:"verify-collection--div"},fl={class:"tokenInfo"},ml=G(()=>c("h6",null,"Reward Token Info",-1)),vl=G(()=>c("span",{class:"flex justify-between"},[c("small",null,"What token is your community staking for?")],-1)),pl={key:0},gl=G(()=>c("i",null," *Reward Tokens Must be Registered with SPL TokenList ",-1)),yl=[gl],bl={class:"flex justify-around"},hl={key:1,class:"flex justify-around spl-search"},kl={key:0,class:"splToken-query"},wl={class:"token-inputs"},_l={key:3},Sl={key:4,class:"selected-token-info"},Vl=Ee({__name:"AddCollectionPage",setup(m){const U=Ie(),{wallet:y,api:I,connection:C,program:A}=We(),R=Ae().wallet,{server_api:B}=ll(),P=Le(),b=x(null),M=x(!1),Q=x(!1),S=x(!1),i=x(!1);function V(){i.value=!0}const o=x({loading:!1,options:["Name","Symbol","Address"],key:"Name",val:"",info:null,_info:null}),u=x({loading:!1,percent:0,message:""}),n=x({manager:"",rewardMint:"F1RELQfqm789aGdLsdXRusCnrVEhqWGg3rrRDQsFXvR8",collectionName:"TESTING_Founders",collectionAddress:"4rbLs9EqZPNh2z2qkU5csWdGQALm24CEJft6tkEEd37R",ratePerDay:5,fireEligible:!0,phoenixRelation:null,rewardSymbol:"TEST_FIRE",uuid:""}),F=x({pk:null,amount:0,eligible:!1});async function r(s){try{u.value={loading:!0,message:"Validating Info. . .",percent:5};const a=await await I.value?.getAccounts({user:y.value.publicKey,collectionName:s.collectionName,rewardMint:s.rewardMint});if(console.log({accounts:a}),!a)throw new Error("Generating PDAS Failed");const{statePDA:l,stateBump:p,rewardWallet:H}=a;if(s.uuid=l.toBase58(),s.bump=p,s.rewardWallet=H.toBase58(),!(await(await A.value.account.collectionRewardInfo.all()).map(L=>L.publicKey.toBase58())).includes(l.toBase58())){console.log(s);const L=await Ke(s);if(!L)throw new Error("Failed to validate collection");u.value.message="Info Checks Out, Moving On. . .";const{success:ce,info:j}=L;if(console.log(L.success,j),console.log(j),!ce||!j)throw new Error("Failed To Validate Collection Information");const{kind:ee}=j.phoenixRelation,J=Oe(ee);u.value={...u.value,percent:20,message:`Sending Initialization Fee for Collection

${J} \u2609

 ${ee} Price`};const Y=await ze(y.value.publicKey,J);if(!Y.success)throw new Error(Y.error);F.value.pk=y.value.publicKey,F.value.amount=J,F.value.eligible=!0;const fe=await Y.sig;u.value={...u.value,percent:50,message:`${fe} 

 Halfway there! Let's Go!!`};const me=Ge.fromJSON(j),O=await I.value?.initStatePda(y.value.publicKey,me);if(!O||O.error)throw new Error(`${O?.error.message}`);const{pdas:le,tx:ve}=await O;console.log({tx:ve,collection:le?.collectionInfoPDA,rewardWallet:le?.rewardWallet}),u.value={...u.value,percent:60,message:"Sent Collection Info On Chain"}}const de={pda:l,vca:s.collectionAddress,manager:y.value.publicKey.toBase58(),collection:s.collectionName,reward_wallet:H.toBase58()};if(u.value={...u.value,percent:80,message:"Indexing Collection on DB. . ."},(await B.collection.new(de)).Error)throw new Error("Collection Not Written to The Server");u.value={...u.value,percent:100,message:"Welcome Aboard!"},P.notify({type:"positive",position:"top",timeout:2e3,message:"Collection successfully initialized",caption:`Token Reward Wallet: ${H}`}),v(),u.value={loading:!1,percent:0,message:""};return}catch(a){if(console.error(a),F.value.eligible===!0&&F.value.pk){const l=await He(F.value.pk,F.value.amount);if(!l.success)throw new Error(l.error);P.notify({type:"success",message:"Init Fee Refunded Successfully",caption:JSON.stringify(l.sig),position:"top",timeout:3e3})}u.value={...u.value,percent:0,message:a.message?a.message:"Something went wrong, please try again"},P.notify({type:"negative",message:"Collection Information Not Valid",caption:a.message?a.message:"Not sure why. . .",position:"top",timeout:3e3}),u.value={message:a.message?a.message:"Something went wrong",loading:!1,percent:0};return}}function v(){console.log("Resetting Form."),o.value._info=null,o.value.info=null,o.value.key="name",o.value.val="",S.value=!1,n.value={}}function w(s){if(!b.value){P.notify({type:"negative",message:"Relations Information Hasn't Loaded Yet",position:"top",timeout:3e3});return}console.log({Relations:b.value});const a=b.value.Affiliates.includes(s),l=b.value.Saved.includes(s),p={founders:b.value.Founders.includes(s),members:b.value.Members.includes(s)};return a?(console.log("Affiliate"),W(Je)):l?(console.log("Saved"),W(Ye)):p.founders?W(Xe):p.members?W(Ze):(console.log("None"),W(el))}async function K(){o.value.loading=!0;try{o.value.key=o.value.key.toLowerCase().trim(),o.value.val.trim(),console.log("findSplToken",o.value);const s=await ol(o.value.key,o.value.val);if(console.log("findSplToken result",s),!s)throw new Error("No Token Found");o.value._info=[...s],o.value.info=Object.assign([],[...o.value._info]),o.value.info.length==1&&(n.value.rewardMint=o.value.info[0].address,n.value.rewardSymbol=o.value.info[0].symbol),o.value.loading=!1}catch{return o.value.loading=!1,o.value.info=null,null}}async function q(s){if(console.log("handleSplTokenClick",s),o.value.info?.length==1){n.value.rewardMint="",n.value.rewardSymbol="",o.value.info=null;return}if(s){n.value.rewardMint=s.address,n.value.rewardSymbol=s.symbol;const a=o.value.info?.filter(l=>{if(l==s)return l});a&&(o.value.info=a)}}return Pe(async()=>{if(console.log({info:n.value}),M.value=Object.values(n.value).every(s=>s!=null&&s!==0),!b.value){const s=await B.general.getRelations();if(console.log({relationsResult:s}),!s)return;b.value=s,console.log(b.value)}if(n.value.collectionAddress){if(!n.value.phoenixRelation){const s=w(n.value.collectionAddress);n.value.phoenixRelation=s||null,console.log("pr:",n.value?.phoenixRelation,`
`,"ca:",n.value?.collectionAddress)}n.value.phoenixRelation.kind=="None"&&n.value.fireEligible&&(n.value.phoenixRelation={kind:"EmberBed"})}y.value&&(n.value.manager=y.value.publicKey.toBase58()),R.value||U.push({path:"/admin"})}),(s,a)=>(f(),N($e,{class:"flex justify-center"},{default:t(()=>[u.value.loading?(f(),T("div",nl,[c("div",sl,[c("pre",il,"            "+X(u.value.message)+`
            `,1)]),e(ae,{size:"25px",value:u.value.percent,color:"accent",class:"q-mt-sm"},null,8,["value"]),e(ae,{size:"25px",value:100-u.value.percent,color:"secondary",class:"q-mt-sm"},null,8,["value"])])):(f(),T("div",ul,[e(tl,{onSubmit:a[14]||(a[14]=l=>r(n.value)),onReset:v,class:"q-gutter-md"},{default:t(()=>[c("section",rl,[c("h6",null,[d("EmberBed Info "),c("sub",null,X(n.value.uuid),1)]),dl,e($,{dark:"",spaced:""}),e(h,{dense:"",dark:"",filled:"",modelValue:n.value.collectionName,"onUpdate:modelValue":a[0]||(a[0]=l=>n.value.collectionName=l),"hide-hint":"",hint:"Collection Name: Bored Ape Yacht Club, DeGods, etc. ","lazy-rules":"",rules:[l=>l&&l.length>0||"This Must Have a Value"]},null,8,["modelValue","rules"]),c("div",cl,[e(h,{class:"verify-collection--input",dense:"",dark:"",filled:"","hide-hint":"",modelValue:n.value.collectionAddress,"onUpdate:modelValue":a[2]||(a[2]=l=>n.value.collectionAddress=l),placeholder:"Verified Collection Address"},{default:t(()=>[e(E,{icon:"info",onClick:a[1]||(a[1]=l=>V())})]),_:1},8,["modelValue"]),c("span",null,[c("div",null,[n.value.collectionAddress?_("",!0):(f(),N(E,{key:0,class:"center",target:"_blank",dark:"",flat:"",icon:"policy",href:"https://collections.metaplex.com/create-collection",label:"Create Collection On Metaplex"})),e(ie,null,{default:t(()=>[d(" Verify Your Collection on Metaplex")]),_:1})])])])]),e(re),e($,{dark:"",spaced:""}),e(re),c("section",fl,[ml,vl,e($,{dark:"",spaced:""}),n.value.rewardSymbol?_("",!0):(f(),T("small",pl,[...yl])),c("div",bl,[e(te,{dark:"",modelValue:S.value,"onUpdate:modelValue":a[3]||(a[3]=l=>S.value=l),class:"special",onchange:"()=> findSplToken.key = '' && findSplToken.val = ''",label:"Manual Token Entry?"},null,8,["modelValue"])]),S.value?_("",!0):(f(),T("div",hl,[o.value.info?.length?_("",!0):(f(),T("span",kl,[e(je,{dense:"",dark:"",modelValue:o.value.key,"onUpdate:modelValue":a[4]||(a[4]=l=>o.value.key=l),options:o.value.options},null,8,["modelValue","options"]),e(h,{dense:"",dark:"",modelValue:o.value.val,"onUpdate:modelValue":a[5]||(a[5]=l=>o.value.val=l)},null,8,["modelValue"]),e(E,{disable:!o.value.key||!o.value.val||o.value.loading,dark:"",dense:"",icon:"search",onClick:a[6]||(a[6]=l=>K())},null,8,["disable"])])),e(ie,null,{default:t(()=>[d("Search Metaplex Registry For Your Token")]),_:1})])),!o.value.loading&&o.value.info&&o.value.info.length!==1&&!S.value?(f(),T("div",{key:2,class:Fe(["token--container",Qe(P).screen.lt.md?"flex justify-around":void 0])},[(f(!0),T(Ne,null,Ue(o.value.info,l=>(f(),N(Z,{class:"token-card",dark:"",key:l.address},{default:t(()=>[l.logoURI?(f(),N(pe,{key:0,fit:"contain",class:"token-image",src:l.logoURI},null,8,["src"])):_("",!0),c("div",wl,[e(h,{dark:"",dense:"",readonly:"",modelValue:l.name,"onUpdate:modelValue":p=>l.name=p,label:"Name"},null,8,["modelValue","onUpdate:modelValue"]),e(h,{dark:"",dense:"",readonly:"",modelValue:l.symbol,"onUpdate:modelValue":p=>l.symbol=p,label:"Symbol"},null,8,["modelValue","onUpdate:modelValue"]),e(h,{dark:"",dense:"",readonly:"",modelValue:l.address,"onUpdate:modelValue":p=>l.address=p,label:"Mint Address"},null,8,["modelValue","onUpdate:modelValue"]),e(h,{dark:"",dense:"",readonly:"",modelValue:l.decimals,"onUpdate:modelValue":p=>l.decimals=p,label:"Decimals"},null,8,["modelValue","onUpdate:modelValue"])]),e(ne,{dark:"",class:"flex justify-center select-btn"},{default:t(()=>[e(E,{flat:"",dark:"",round:"",dense:"",label:"Select",onClick:p=>q(l)},null,8,["onClick"])]),_:2},1024)]),_:2},1024))),128))],2)):_("",!0),S.value?(f(),T("div",_l,[e(h,{dark:"",dense:"",modelValue:n.value.rewardMint,"onUpdate:modelValue":a[7]||(a[7]=l=>n.value.rewardMint=l),label:"Mint Address"},null,8,["modelValue"]),e(h,{dark:"",dense:"",modelValue:n.value.rewardSymbol,"onUpdate:modelValue":a[8]||(a[8]=l=>n.value.rewardSymbol=l),label:"Token Symbol"},null,8,["modelValue"])])):_("",!0),o.value.info?.length==1&&!S.value?(f(),T("div",Sl,[e(k,{class:"text-bold flex justify-center"},{default:t(()=>[o.value.info[0].logoURI?(f(),N(g,{key:0,avatar:""},{default:t(()=>[e(Be,{size:"75px",icon:`img:${o.value.info[0].logoURI}`},null,8,["icon"])]),_:1})):_("",!0),e(g,null,{default:t(()=>[d(X(o.value.info[0].name),1)]),_:1})]),_:1}),e(h,{dark:"",dense:"",readonly:"",modelValue:n.value.rewardMint,"onUpdate:modelValue":a[9]||(a[9]=l=>n.value.rewardMint=l),label:"Mint Address"},null,8,["modelValue"]),e(h,{dark:"",dense:"",readonly:"",modelValue:n.value.rewardSymbol,"onUpdate:modelValue":a[10]||(a[10]=l=>n.value.rewardSymbol=l),label:"Token Symbol"},null,8,["modelValue"]),e(g,{side:""},{default:t(()=>[o.value.info?.length==1?(f(),N(E,{key:0,color:"secondary",class:"special",flat:"",dark:"",label:"Reset Token Info",onClick:a[11]||(a[11]=l=>q())})):_("",!0)]),_:1})])):_("",!0),e(te,{dark:"",modelValue:n.value.fireEligible,"onUpdate:modelValue":a[12]||(a[12]=l=>n.value.fireEligible=l),class:"special",color:"accent",label:"$FIRE Redemption?"},null,8,["modelValue"]),n.value.rewardSymbol&&n.value.rewardMint?(f(),N(h,{key:5,class:"rate",type:"number",modelValue:n.value.ratePerDay,"onUpdate:modelValue":a[13]||(a[13]=l=>n.value.ratePerDay=l),dark:"",label:"Rate Per day"},null,8,["modelValue"])):_("",!0),c("div",null,[e(E,{disable:!M.value,dark:"",label:"Submit",type:"submit",color:"primary"},null,8,["disable"]),e(E,{dark:"",label:"Reset",type:"reset",color:"secondary",flat:"",class:"q-ml-sm"})])])]),_:1})])),e(se,{modelValue:Q.value,"onUpdate:modelValue":a[15]||(a[15]=l=>Q.value=l)},{default:t(()=>[e(Z,{class:"dialog"},{default:t(()=>[e(D,{title:"",class:"text-h6"},{default:t(()=>[d(" Allowing $FIRE Staking ")]),_:1}),e($,{dark:""}),e(D,{class:"fire-content"},{default:t(()=>[e(k,{class:"fire-item"},{default:t(()=>[e(g,{class:"fire-title text-subtitle1"},{default:t(()=>[d(" What does this mean? ")]),_:1}),e(g,{class:"fire-list text-body-2"},{default:t(()=>[e(ue,null,{default:t(()=>[e(k,null,{default:t(()=>[d(" Your holders will have the option to redeem for $FIRE tokens if they desire. ")]),_:1}),e(k,null,{default:t(()=>[d(" would be instead of redeeming your native token. ")]),_:1}),e(k,null,{default:t(()=>[d(" It is a choice for them each time they go to redeem their yield from staking. ")]),_:1})]),_:1})]),_:1})]),_:1}),e(k,{class:"fire-item"},{default:t(()=>[e(g,{class:"fire-title text-subtitle1"},{default:t(()=>[d(" Why Might This Be a Good Idea? ")]),_:1}),e(g,{class:"fire-list text-body-2"},{default:t(()=>[e(ue,null,{default:t(()=>[e(k,null,{default:t(()=>[d(" Added Utility to Holding Your NFTs ")]),_:1}),e(k,null,{default:t(()=>[d(" Reduced Upfront Cost to use EmberBed (50% off!) ")]),_:1}),e(k,null,{default:t(()=>[d(" $FIRE tokens will be available to cover all platform fees ** ")]),_:1})]),_:1})]),_:1})]),_:1}),d(" **After the PrjctPhoenix:Founder collection mint ")]),_:1}),e(D,null,{default:t(()=>[e(k,{class:"fire-item"},{default:t(()=>[e(g,{class:"fire-title text-subtitle1"},{default:t(()=>[d(" Have More Questions? ")]),_:1}),e(g,{class:"fire-list text-body-2"},{default:t(()=>[d(" Hop in our discord and ask, or @ us on Twitter. ")]),_:1})]),_:1}),e(ne,{class:"justify-around"},{default:t(()=>[e(E,{dark:"",flat:"",href:"https://discord.gg/s9SUKBWKuQ",target:"_blank"},{default:t(()=>[e(z,{name:"fab fa-discord"})]),_:1}),e(E,{dark:"",flat:"",href:"https://twitter.com/PrjctPhoenix",target:"_blank"},{default:t(()=>[e(z,{name:"fab fa-twitter"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(se,{modelValue:i.value,"onUpdate:modelValue":a[16]||(a[16]=l=>i.value=l)},{default:t(()=>[e(Z,{dark:""},{default:t(()=>[e(D,{title:"",class:"text-h6"},{default:t(()=>[d(" Why Verify? ")]),_:1}),e($,{spaced:"",dark:""}),e(D,null,{default:t(()=>[e(k,null,{default:t(()=>[e(g,{side:""},{default:t(()=>[e(z,{name:"grade"})]),_:1}),e(g,null,{default:t(()=>[d(" Verified Collections Don't Need to Add a Hashlist. ")]),_:1})]),_:1}),e(k,null,{default:t(()=>[e(g,{side:""},{default:t(()=>[e(z,{name:"grade"})]),_:1}),e(g,null,{default:t(()=>[d(" If you are a PrjctPhoenix Affiliate, this is how EmberBed verifies this and adds the proper relationship on-chain. ")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}))}});var Ll=Te(Vl,[["__scopeId","data-v-99361acc"],["__file","/home/proto/PhoenixProj/Repos/EmberBed/app/src/pages/admin/AddCollectionPage.vue"]]);export{Ll as default};
