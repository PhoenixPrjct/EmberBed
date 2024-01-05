import{a as _,f as p,g as W,L as V,bu as xe,r as M,aa as oe,am as G,aI as pe,ak as A,w as L,R as we,o as $,j,ap as I,U as K,bv as Z,ai as Te,Y as qe,bw as ke,bx as Ee,by as Se,az as He,aA as Ce,bz as Le,bA as We,bB as Me,T as Pe,aJ as Be,aq as ue,au as re,bC as Ae,ar as se,bD as $e,M as Re,i as ze,bE as _e}from"./index.3ba0a9f2.js";var Ue=_({name:"QItemSection",props:{avatar:Boolean,thumbnail:Boolean,side:Boolean,top:Boolean,noWrap:Boolean},setup(e,{slots:n}){const l=p(()=>`q-item__section column q-item__section--${e.avatar===!0||e.side===!0||e.thumbnail===!0?"side":"main"}`+(e.top===!0?" q-item__section--top justify-start":" justify-center")+(e.avatar===!0?" q-item__section--avatar":"")+(e.thumbnail===!0?" q-item__section--thumbnail":"")+(e.noWrap===!0?" q-item__section--nowrap":""));return()=>W("div",{class:l.value},V(n.default))}});function O(){if(window.getSelection!==void 0){const e=window.getSelection();e.empty!==void 0?e.empty():e.removeAllRanges!==void 0&&(e.removeAllRanges(),xe.is.mobile!==!0&&e.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}const je={target:{default:!0},noParentEvent:Boolean,contextMenu:Boolean};function Qe({showing:e,avoidEmit:n,configureAnchorEl:l}){const{props:t,proxy:a,emit:d}=j(),o=M(null);let r=null;function f(i){return o.value===null?!1:i===void 0||i.touches===void 0||i.touches.length<=1}const s={};l===void 0&&(Object.assign(s,{hide(i){a.hide(i)},toggle(i){a.toggle(i),i.qAnchorHandled=!0},toggleKey(i){oe(i,13)===!0&&s.toggle(i)},contextClick(i){a.hide(i),G(i),pe(()=>{a.show(i),i.qAnchorHandled=!0})},prevent:G,mobileTouch(i){if(s.mobileCleanup(i),f(i)!==!0)return;a.hide(i),o.value.classList.add("non-selectable");const c=i.target;A(s,"anchor",[[c,"touchmove","mobileCleanup","passive"],[c,"touchend","mobileCleanup","passive"],[c,"touchcancel","mobileCleanup","passive"],[o.value,"contextmenu","prevent","notPassive"]]),r=setTimeout(()=>{r=null,a.show(i),i.qAnchorHandled=!0},300)},mobileCleanup(i){o.value.classList.remove("non-selectable"),r!==null&&(clearTimeout(r),r=null),e.value===!0&&i!==void 0&&O()}}),l=function(i=t.contextMenu){if(t.noParentEvent===!0||o.value===null)return;let c;i===!0?a.$q.platform.is.mobile===!0?c=[[o.value,"touchstart","mobileTouch","passive"]]:c=[[o.value,"mousedown","hide","passive"],[o.value,"contextmenu","contextClick","notPassive"]]:c=[[o.value,"click","toggle","passive"],[o.value,"keyup","toggleKey","passive"]],A(s,"anchor",c)});function m(){I(s,"anchor")}function g(i){for(o.value=i;o.value.classList.contains("q-anchor--skip");)o.value=o.value.parentNode;l()}function y(){if(t.target===!1||t.target===""||a.$el.parentNode===null)o.value=null;else if(t.target===!0)g(a.$el.parentNode);else{let i=t.target;if(typeof t.target=="string")try{i=document.querySelector(t.target)}catch{i=void 0}i!=null?(o.value=i.$el||i,l()):(o.value=null,console.error(`Anchor: target "${t.target}" not found`))}}return L(()=>t.contextMenu,i=>{o.value!==null&&(m(),l(i))}),L(()=>t.target,()=>{o.value!==null&&m(),y()}),L(()=>t.noParentEvent,i=>{o.value!==null&&(i===!0?m():l())}),we(()=>{y(),n!==!0&&t.modelValue===!0&&o.value===null&&d("update:modelValue",!1)}),$(()=>{r!==null&&clearTimeout(r),m()}),{anchorEl:o,canShow:f,anchorEvents:s}}function De(e,n){const l=M(null);let t;function a(r,f){const s=`${f!==void 0?"add":"remove"}EventListener`,m=f!==void 0?f:t;r!==window&&r[s]("scroll",m,K.passive),window[s]("scroll",m,K.passive),t=f}function d(){l.value!==null&&(a(l.value),l.value=null)}const o=L(()=>e.noParentEvent,()=>{l.value!==null&&(d(),n())});return $(o),{localScrollTarget:l,unconfigureScrollTarget:d,changeScrollEvent:a}}const{notPassiveCapture:R}=K,S=[];function z(e){const n=e.target;if(n===void 0||n.nodeType===8||n.classList.contains("no-pointer-events")===!0)return;let l=Z.length-1;for(;l>=0;){const t=Z[l].$;if(t.type.name==="QTooltip"){l--;continue}if(t.type.name!=="QDialog")break;if(t.props.seamless!==!0)return;l--}for(let t=S.length-1;t>=0;t--){const a=S[t];if((a.anchorEl.value===null||a.anchorEl.value.contains(n)===!1)&&(n===document.body||a.innerRef.value!==null&&a.innerRef.value.contains(n)===!1))e.qClickOutside=!0,a.onClickOutside(e);else return}}function Ie(e){S.push(e),S.length===1&&(document.addEventListener("mousedown",z,R),document.addEventListener("touchstart",z,R))}function ee(e){const n=S.findIndex(l=>l===e);n>-1&&(S.splice(n,1),S.length===0&&(document.removeEventListener("mousedown",z,R),document.removeEventListener("touchstart",z,R)))}let te,ne;function le(e){const n=e.split(" ");return n.length!==2?!1:["top","center","bottom"].includes(n[0])!==!0?(console.error("Anchor/Self position must start with one of top/center/bottom"),!1):["left","middle","right","start","end"].includes(n[1])!==!0?(console.error("Anchor/Self position must end with one of left/middle/right/start/end"),!1):!0}function Ke(e){return e?!(e.length!==2||typeof e[0]!="number"||typeof e[1]!="number"):!0}const N={"start#ltr":"left","start#rtl":"right","end#ltr":"right","end#rtl":"left"};["left","middle","right"].forEach(e=>{N[`${e}#ltr`]=e,N[`${e}#rtl`]=e});function ie(e,n){const l=e.split(" ");return{vertical:l[0],horizontal:N[`${l[1]}#${n===!0?"rtl":"ltr"}`]}}function Oe(e,n){let{top:l,left:t,right:a,bottom:d,width:o,height:r}=e.getBoundingClientRect();return n!==void 0&&(l-=n[1],t-=n[0],d+=n[1],a+=n[0],o+=n[0],r+=n[1]),{top:l,bottom:d,height:r,left:t,right:a,width:o,middle:t+(a-t)/2,center:l+(d-l)/2}}function Ne(e,n,l){let{top:t,left:a}=e.getBoundingClientRect();return t+=n.top,a+=n.left,l!==void 0&&(t+=l[1],a+=l[0]),{top:t,bottom:t+1,height:1,left:a,right:a+1,width:1,middle:a,center:t}}function Ve(e,n){return{top:0,center:n/2,bottom:n,left:0,middle:e/2,right:e}}function ae(e,n,l,t){return{top:e[l.vertical]-n[t.vertical],left:e[l.horizontal]-n[t.horizontal]}}function ce(e,n=0){if(e.targetEl===null||e.anchorEl===null||n>5)return;if(e.targetEl.offsetHeight===0||e.targetEl.offsetWidth===0){setTimeout(()=>{ce(e,n+1)},10);return}const{targetEl:l,offset:t,anchorEl:a,anchorOrigin:d,selfOrigin:o,absoluteOffset:r,fit:f,cover:s,maxHeight:m,maxWidth:g}=e;if(Te.is.ios===!0&&window.visualViewport!==void 0){const C=document.body.style,{offsetLeft:b,offsetTop:T}=window.visualViewport;b!==te&&(C.setProperty("--q-pe-left",b+"px"),te=b),T!==ne&&(C.setProperty("--q-pe-top",T+"px"),ne=T)}const{scrollLeft:y,scrollTop:i}=l,c=r===void 0?Oe(a,s===!0?[0,0]:t):Ne(a,r,t);Object.assign(l.style,{top:0,left:0,minWidth:null,minHeight:null,maxWidth:g||"100vw",maxHeight:m||"100vh",visibility:"visible"});const{offsetWidth:w,offsetHeight:k}=l,{elWidth:P,elHeight:H}=f===!0||s===!0?{elWidth:Math.max(c.width,w),elHeight:s===!0?Math.max(c.height,k):k}:{elWidth:w,elHeight:k};let u={maxWidth:g,maxHeight:m};(f===!0||s===!0)&&(u.minWidth=c.width+"px",s===!0&&(u.minHeight=c.height+"px")),Object.assign(l.style,u);const x=Ve(P,H);let v=ae(c,x,d,o);if(r===void 0||t===void 0)D(v,c,x,d,o);else{const{top:C,left:b}=v;D(v,c,x,d,o);let T=!1;if(v.top!==C){T=!0;const q=2*t[1];c.center=c.top-=q,c.bottom-=q+2}if(v.left!==b){T=!0;const q=2*t[0];c.middle=c.left-=q,c.right-=q+2}T===!0&&(v=ae(c,x,d,o),D(v,c,x,d,o))}u={top:v.top+"px",left:v.left+"px"},v.maxHeight!==void 0&&(u.maxHeight=v.maxHeight+"px",c.height>v.maxHeight&&(u.minHeight=u.maxHeight)),v.maxWidth!==void 0&&(u.maxWidth=v.maxWidth+"px",c.width>v.maxWidth&&(u.minWidth=u.maxWidth)),Object.assign(l.style,u),l.scrollTop!==i&&(l.scrollTop=i),l.scrollLeft!==y&&(l.scrollLeft=y)}function D(e,n,l,t,a){const d=l.bottom,o=l.right,r=qe(),f=window.innerHeight-r,s=document.body.clientWidth;if(e.top<0||e.top+d>f)if(a.vertical==="center")e.top=n[t.vertical]>f/2?Math.max(0,f-d):0,e.maxHeight=Math.min(d,f);else if(n[t.vertical]>f/2){const m=Math.min(f,t.vertical==="center"?n.center:t.vertical===a.vertical?n.bottom:n.top);e.maxHeight=Math.min(d,m),e.top=Math.max(0,m-d)}else e.top=Math.max(0,t.vertical==="center"?n.center:t.vertical===a.vertical?n.top:n.bottom),e.maxHeight=Math.min(d,f-e.top);if(e.left<0||e.left+o>s)if(e.maxWidth=Math.min(o,s),a.horizontal==="middle")e.left=n[t.horizontal]>s/2?Math.max(0,s-o):0;else if(n[t.horizontal]>s/2){const m=Math.min(s,t.horizontal==="middle"?n.middle:t.horizontal===a.horizontal?n.right:n.left);e.maxWidth=Math.min(o,m),e.left=Math.max(0,m-e.maxWidth)}else e.left=Math.max(0,t.horizontal==="middle"?n.middle:t.horizontal===a.horizontal?n.left:n.right),e.maxWidth=Math.min(o,s-e.left)}var Ye=_({name:"QTooltip",inheritAttrs:!1,props:{...je,...ke,...Ee,maxHeight:{type:String,default:null},maxWidth:{type:String,default:null},transitionShow:{default:"jump-down"},transitionHide:{default:"jump-up"},anchor:{type:String,default:"bottom middle",validator:le},self:{type:String,default:"top middle",validator:le},offset:{type:Array,default:()=>[14,14],validator:Ke},scrollTarget:{default:void 0},delay:{type:Number,default:0},hideDelay:{type:Number,default:0}},emits:[...Se],setup(e,{slots:n,emit:l,attrs:t}){let a,d;const o=j(),{proxy:{$q:r}}=o,f=M(null),s=M(!1),m=p(()=>ie(e.anchor,r.lang.rtl)),g=p(()=>ie(e.self,r.lang.rtl)),y=p(()=>e.persistent!==!0),{registerTick:i,removeTick:c}=He(),{registerTimeout:w}=Ce(),{transitionProps:k,transitionStyle:P}=Le(e),{localScrollTarget:H,changeScrollEvent:u,unconfigureScrollTarget:x}=De(e,X),{anchorEl:v,canShow:C,anchorEvents:b}=Qe({showing:s,configureAnchorEl:ge}),{show:T,hide:q}=We({showing:s,canShow:C,handleShow:fe,handleHide:ve,hideOnRouteChange:y,processOnMount:!0});Object.assign(b,{delayShow:me,delayHide:he});const{showPortal:F,hidePortal:U,renderPortal:de}=Me(o,f,ye,"tooltip");if(r.platform.is.mobile===!0){const h={anchorEl:v,innerRef:f,onClickOutside(E){return q(E),E.target.classList.contains("q-dialog__backdrop")&&ue(E),!0}},Q=p(()=>e.modelValue===null&&e.persistent!==!0&&s.value===!0);L(Q,E=>{(E===!0?Ie:ee)(h)}),$(()=>{ee(h)})}function fe(h){F(),i(()=>{d=new MutationObserver(()=>B()),d.observe(f.value,{attributes:!1,childList:!0,characterData:!0,subtree:!0}),B(),X()}),a===void 0&&(a=L(()=>r.screen.width+"|"+r.screen.height+"|"+e.self+"|"+e.anchor+"|"+r.lang.rtl,B)),w(()=>{F(!0),l("show",h)},e.transitionDuration)}function ve(h){c(),U(),Y(),w(()=>{U(!0),l("hide",h)},e.transitionDuration)}function Y(){d!==void 0&&(d.disconnect(),d=void 0),a!==void 0&&(a(),a=void 0),x(),I(b,"tooltipTemp")}function B(){ce({targetEl:f.value,offset:e.offset,anchorEl:v.value,anchorOrigin:m.value,selfOrigin:g.value,maxHeight:e.maxHeight,maxWidth:e.maxWidth})}function me(h){if(r.platform.is.mobile===!0){O(),document.body.classList.add("non-selectable");const Q=v.value,E=["touchmove","touchcancel","touchend","click"].map(J=>[Q,J,"delayHide","passiveCapture"]);A(b,"tooltipTemp",E)}w(()=>{T(h)},e.delay)}function he(h){r.platform.is.mobile===!0&&(I(b,"tooltipTemp"),O(),setTimeout(()=>{document.body.classList.remove("non-selectable")},10)),w(()=>{q(h)},e.hideDelay)}function ge(){if(e.noParentEvent===!0||v.value===null)return;const h=r.platform.is.mobile===!0?[[v.value,"touchstart","delayShow","passive"]]:[[v.value,"mouseenter","delayShow","passive"],[v.value,"mouseleave","delayHide","passive"]];A(b,"anchor",h)}function X(){if(v.value!==null||e.scrollTarget!==void 0){H.value=Pe(v.value,e.scrollTarget);const h=e.noParentEvent===!0?B:q;u(H.value,h)}}function be(){return s.value===!0?W("div",{...t,ref:f,class:["q-tooltip q-tooltip--style q-position-engine no-pointer-events",t.class],style:[t.style,P.value],role:"tooltip"},V(n.default)):null}function ye(){return W(Be,k.value,be)}return $(Y),Object.assign(o.proxy,{updatePosition:B}),de}}),Xe=_({name:"QItem",props:{...re,...Ae,tag:{type:String,default:"div"},active:{type:Boolean,default:null},clickable:Boolean,dense:Boolean,insetLevel:Number,tabindex:[String,Number],focused:Boolean,manualFocus:Boolean},emits:["click","keyup"],setup(e,{slots:n,emit:l}){const{proxy:{$q:t}}=j(),a=se(e,t),{hasLink:d,linkAttrs:o,linkClass:r,linkTag:f,navigateOnClick:s}=$e(),m=M(null),g=M(null),y=p(()=>e.clickable===!0||d.value===!0||e.tag==="label"),i=p(()=>e.disable!==!0&&y.value===!0),c=p(()=>"q-item q-item-type row no-wrap"+(e.dense===!0?" q-item--dense":"")+(a.value===!0?" q-item--dark":"")+(d.value===!0&&e.active===null?r.value:e.active===!0?` q-item--active${e.activeClass!==void 0?` ${e.activeClass}`:""}`:"")+(e.disable===!0?" disabled":"")+(i.value===!0?" q-item--clickable q-link cursor-pointer "+(e.manualFocus===!0?"q-manual-focusable":"q-focusable q-hoverable")+(e.focused===!0?" q-manual-focusable--focused":""):"")),w=p(()=>{if(e.insetLevel===void 0)return null;const u=t.lang.rtl===!0?"Right":"Left";return{["padding"+u]:16+e.insetLevel*56+"px"}});function k(u){i.value===!0&&(g.value!==null&&(u.qKeyEvent!==!0&&document.activeElement===m.value?g.value.focus():document.activeElement===g.value&&m.value.focus()),s(u))}function P(u){if(i.value===!0&&oe(u,13)===!0){ue(u),u.qKeyEvent=!0;const x=new MouseEvent("click",u);x.qKeyEvent=!0,m.value.dispatchEvent(x)}l("keyup",u)}function H(){const u=Re(n.default,[]);return i.value===!0&&u.unshift(W("div",{class:"q-focus-helper",tabindex:-1,ref:g})),u}return()=>{const u={ref:m,class:c.value,style:w.value,role:"listitem",onClick:k,onKeyup:P};return i.value===!0?(u.tabindex=e.tabindex||"0",Object.assign(u,o.value)):y.value===!0&&(u["aria-disabled"]="true"),W(f.value,u,H())}}}),Je=_({name:"QList",props:{...re,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean,tag:{type:String,default:"div"}},setup(e,{slots:n}){const l=j(),t=se(e,l.proxy.$q),a=p(()=>"q-list"+(e.bordered===!0?" q-list--bordered":"")+(e.dense===!0?" q-list--dense":"")+(e.separator===!0?" q-list--separator":"")+(t.value===!0?" q-list--dark":"")+(e.padding===!0?" q-list--padding":""));return()=>W(e.tag,{class:a.value},V(n.default))}});function Ge(){return ze(_e)}export{Xe as Q,Ue as a,Ye as b,Je as c,O as d,je as e,Ke as f,De as g,Qe as h,Ie as i,ie as p,ee as r,ce as s,Ge as u,le as v};
