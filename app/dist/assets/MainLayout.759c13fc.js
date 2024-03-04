import{a as N,i as K,e as B,r as C,d as W,f,w as p,o as O,h as U,g as P,j as Y,l as G,k as L,m as z,n as h,q as x,s as g,t as o,Q as q,F as J,u as X,v as r,x as w,y as H,_ as j,z as Z,A as ee,B as te,C as ae,P as oe,D as I,E as Q,G as re,H as se,W as le,I as ne,J as ue,K as ie}from"./index.473a68e4.js";import{Q as ce,a as k,b as de,c as fe,d as ve}from"./QLayout.2d6072f1.js";import{Q as _e}from"./QResizeObserver.e704c908.js";import{_ as me}from"./logo_only.976939b9.js";import{Q as pe}from"./QChip.aacf81f4.js";import{g as he}from"./collectionSubmission.00463ec6.js";import{u as ge}from"./user_store.67f2cfd7.js";import{u as ye}from"./server-api.40cb4079.js";import"./SplashPage.342d73f3.js";import{F as xe}from"./FireAcctInfoDialogue.8dcd7846.js";import"./index.bfeaebb5.js";import"./index.74226843.js";import"./rtl.1e8aab47.js";import"./use-quasar.6502b0e2.js";import"./formattingTools.f1849d04.js";import"./QSpace.57d54283.js";var we=N({name:"QFooter",props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:["reveal","focusin"],setup(a,{slots:c,emit:v}){const{proxy:{$q:s}}=Y(),t=K(G,B);if(t===B)return console.error("QFooter needs to be child of QLayout"),B;const d=C(parseInt(a.heightHint,10)),l=C(!0),_=C(W.value===!0||t.isContainer.value===!0?0:window.innerHeight),u=f(()=>a.reveal===!0||t.view.value.indexOf("F")!==-1||s.platform.is.ios&&t.isContainer.value===!0),b=f(()=>t.isContainer.value===!0?t.containerHeight.value:_.value),y=f(()=>{if(a.modelValue!==!0)return 0;if(u.value===!0)return l.value===!0?d.value:0;const e=t.scroll.value.position+b.value+d.value-t.height.value;return e>0?e:0}),V=f(()=>a.modelValue!==!0||u.value===!0&&l.value!==!0),S=f(()=>a.modelValue===!0&&V.value===!0&&a.reveal===!0),$=f(()=>"q-footer q-layout__section--marginal "+(u.value===!0?"fixed":"absolute")+"-bottom"+(a.bordered===!0?" q-footer--bordered":"")+(V.value===!0?" q-footer--hidden":"")+(a.modelValue!==!0?" q-layout--prevent-focus"+(u.value!==!0?" hidden":""):"")),E=f(()=>{const e=t.rows.value.bottom,n={};return e[0]==="l"&&t.left.space===!0&&(n[s.lang.rtl===!0?"right":"left"]=`${t.left.size}px`),e[2]==="r"&&t.right.space===!0&&(n[s.lang.rtl===!0?"left":"right"]=`${t.right.size}px`),n});function i(e,n){t.update("footer",e,n)}function m(e,n){e.value!==n&&(e.value=n)}function R({height:e}){m(d,e),i("size",e)}function D(){if(a.reveal!==!0)return;const{direction:e,position:n,inflectionPoint:T}=t.scroll.value;m(l,e==="up"||n-T<100||t.height.value-b.value-n-d.value<300)}function M(e){S.value===!0&&m(l,!0),v("focusin",e)}p(()=>a.modelValue,e=>{i("space",e),m(l,!0),t.animate()}),p(y,e=>{i("offset",e)}),p(()=>a.reveal,e=>{e===!1&&m(l,a.modelValue)}),p(l,e=>{t.animate(),v("reveal",e)}),p([d,t.scroll,t.height],D),p(()=>s.screen.height,e=>{t.isContainer.value!==!0&&m(_,e)});const F={};return t.instances.footer=F,a.modelValue===!0&&i("size",d.value),i("space",a.modelValue),i("offset",y.value),O(()=>{t.instances.footer===F&&(t.instances.footer=void 0,i("size",0),i("offset",0),i("space",!1))}),()=>{const e=U(c.default,[P(_e,{debounce:0,onResize:R})]);return a.elevated===!0&&e.push(P("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),P("footer",{class:$.value,style:E.value,onFocusin:M},e)}}}),Ce="/assets/phoenix_logo.578e9975.png";const be={key:0,class:"wrapper"},Qe={id:"marquee"},Be={key:1,style:{"text-align":"center",width:"100%"}},Pe=L({__name:"CollectionsCarousel",setup(a){const c=C();return z(async()=>{c.value||(c.value=await he())}),(v,s)=>c.value?.length?(h(),x("div",be,[g("div",Qe,[o(q,{name:"grade"}),(h(!0),x(J,null,X(c.value,t=>(h(),x("span",{key:t},[o(pe,{outline:"",square:"",dark:""},{default:r(()=>[w(H(t),1)]),_:2},1024),o(q,{name:"grade"})]))),128))])])):(h(),x("div",Be," Welcome to EmberBed! "))}});var ke=j(Pe,[["__scopeId","data-v-31566cd6"],["__file","/home/proto/PhoenixProj/Repos/EmberBed/app/src/components/CollectionsCarousel.vue"]]);const A=a=>(ue("data-v-18ca20c2"),a=a(),ie(),a),Ve=A(()=>g("img",{src:me,alt:"Logo"},null,-1)),Fe={key:0},qe={type:"a",target:"_blank"},Ie={class:"footer",href:"https://prjctphoenix.xyz"},Le=A(()=>g("img",{src:Ce},null,-1)),ze={inset:"",class:"flex justify-center bg-primary copyright"},He=L({__name:"MainLayout",setup(a){async function c(){const _=await d.test();return console.log(_.message),_.message}const v=ge(),s=Z();ee();const t=new Date().getFullYear(),{server_api:d}=ye(),l=C(!1);return f(()=>c()),z(()=>{s.connected.value&&s.publicKey.value&&v.setPk(s.publicKey.value.toBase58()),s.connected.value||(oe.clear(),v.setPk(""),v.setType(null))}),(_,u)=>{const b=te("router-view");return h(),ae(ce,{view:"lHh Lpr lFf"},{default:r(()=>[o(fe,{elevated:""},{default:r(()=>[o(k,null,{default:r(()=>[o(de,null,{default:r(()=>[o(I,{square:""},{default:r(()=>[Ve]),_:1}),w(" EmberBed ")]),_:1}),Q(s).connected.value?(h(),x("span",Fe,[o(re,{dark:"",flat:"",onClick:u[0]||(u[0]=y=>l.value=!0)},{default:r(()=>[w("\u{1F525}")]),_:1})])):se("",!0),o(Q(le),{dark:""})]),_:1}),o(k,{dark:"",inset:""},{default:r(()=>[o(ke)]),_:1})]),_:1}),o(ve,null,{default:r(()=>[o(ne,{modelValue:l.value,"onUpdate:modelValue":u[1]||(u[1]=y=>l.value=y)},{default:r(()=>[o(Q(xe))]),_:1},8,["modelValue"]),o(b)]),_:1}),o(we,{reveal:"",class:"center bg-transparent"},{default:r(()=>[o(k,{class:"flex justify-center phoenix-footer"},{default:r(()=>[g("span",qe,[g("a",Ie,[w(" A PrjctPheonix "),o(I,null,{default:r(()=>[Le]),_:1}),w(" Product ")])])]),_:1}),g("small",ze,"\xA9 Copyright "+H(Q(t))+", Prjct Phoenix. All rights reserved.",1)]),_:1})]),_:1})}}});var Je=j(He,[["__scopeId","data-v-18ca20c2"],["__file","/home/proto/PhoenixProj/Repos/EmberBed/app/src/layouts/MainLayout.vue"]]);export{Je as default};
