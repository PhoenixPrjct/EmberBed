import{a as $e,bM as Qe,bN as gt,bO as ht,bP as yt,bx as Pt,au as Ht,by as _t,bz as Rt,r as B,f as m,ar as Lt,az as Dt,aA as Kt,bA as Nt,bB as $t,bC as Qt,w as oe,bG as jt,ao as Wt,bH as Ut,bQ as rt,T as Xt,bR as Yt,g as C,L as Gt,aJ as Jt,o as je,j as We,bS as Zt,bK as el,bT as tl,aq as ve,S as ll,aI as ne,bU as ul,bV as nl,aB as ol,aC as al,av as il,bW as rl,bX as st,aG as qe,bY as sl,bZ as cl,am as De,Q as dl,b_ as fl,an as Ve,aa as vl,aF as ml,I as Sl,h as gl}from"./index.473a68e4.js";import{Q as hl}from"./QChip.aacf81f4.js";import{e as yl,v as ct,f as bl,g as wl,h as Cl,p as dt,r as ft,s as Vl,i as kl,a as xl,Q as Al}from"./use-quasar.6502b0e2.js";import{r as Ne,n as vt,Q as Ol}from"./rtl.1e8aab47.js";var Fl=$e({name:"QField",inheritAttrs:!1,props:{...Qe,tag:{type:String,default:"label"}},emits:gt,setup(){return ht(yt({requiredForAttr:!1,tagProp:!0}))}}),ql=$e({name:"QMenu",inheritAttrs:!1,props:{...yl,...Pt,...Ht,..._t,persistent:Boolean,autoClose:Boolean,separateClosePopup:Boolean,noRouteDismiss:Boolean,noRefocus:Boolean,noFocus:Boolean,fit:Boolean,cover:Boolean,square:Boolean,anchor:{type:String,validator:ct},self:{type:String,validator:ct},offset:{type:Array,validator:bl},scrollTarget:{default:void 0},touchPosition:Boolean,maxHeight:{type:String,default:null},maxWidth:{type:String,default:null}},emits:[...Rt,"click","escapeKey"],setup(e,{slots:c,emit:r,attrs:w}){let O=null,i,F,h;const y=We(),{proxy:T}=y,{$q:s}=T,S=B(null),b=B(!1),x=m(()=>e.persistent!==!0&&e.noRouteDismiss!==!0),p=Lt(e,s),{registerTick:K,removeTick:P}=Dt(),{registerTimeout:$}=Kt(),{transitionProps:W,transitionStyle:H}=Nt(e),{localScrollTarget:q,changeScrollEvent:me,unconfigureScrollTarget:z}=wl(e,v),{anchorEl:D,canShow:Z}=Cl({showing:b}),{hide:te}=$t({showing:b,canShow:Z,handleShow:re,handleHide:l,hideOnRouteChange:x,processOnMount:!0}),{showPortal:U,hidePortal:ae,renderPortal:L}=Qt(y,S,I,"menu"),ee={anchorEl:D,innerRef:S,onClickOutside(u){if(e.persistent!==!0&&b.value===!0)return te(u),(u.type==="touchstart"||u.target.classList.contains("q-dialog__backdrop"))&&ve(u),!0}},ie=m(()=>dt(e.anchor||(e.cover===!0?"center middle":"bottom start"),s.lang.rtl)),le=m(()=>e.cover===!0?ie.value:dt(e.self||"top start",s.lang.rtl)),Q=m(()=>(e.square===!0?" q-menu--square":"")+(p.value===!0?" q-menu--dark q-dark":"")),xe=m(()=>e.autoClose===!0?{onClick:V}:{}),ue=m(()=>b.value===!0&&e.persistent!==!0);oe(ue,u=>{u===!0?(Zt(g),kl(ee)):(rt(g),ft(ee))});function X(){el(()=>{let u=S.value;u&&u.contains(document.activeElement)!==!0&&(u=u.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||u.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||u.querySelector("[autofocus], [data-autofocus]")||u,u.focus({preventScroll:!0}))})}function re(u){if(O=e.noRefocus===!1?document.activeElement:null,jt(M),U(),v(),i=void 0,u!==void 0&&(e.touchPosition||e.contextMenu)){const _=Wt(u);if(_.left!==void 0){const{top:Y,left:Se}=D.value.getBoundingClientRect();i={left:_.left-Se,top:_.top-Y}}}F===void 0&&(F=oe(()=>s.screen.width+"|"+s.screen.height+"|"+e.self+"|"+e.anchor+"|"+s.lang.rtl,f)),e.noFocus!==!0&&document.activeElement.blur(),K(()=>{f(),e.noFocus!==!0&&X()}),$(()=>{s.platform.is.ios===!0&&(h=e.autoClose,S.value.click()),f(),U(!0),r("show",u)},e.transitionDuration)}function l(u){P(),ae(),o(!0),O!==null&&(u===void 0||u.qClickOutside!==!0)&&(((u&&u.type.indexOf("key")===0?O.closest('[tabindex]:not([tabindex^="-"])'):void 0)||O).focus(),O=null),$(()=>{ae(!0),r("hide",u)},e.transitionDuration)}function o(u){i=void 0,F!==void 0&&(F(),F=void 0),(u===!0||b.value===!0)&&(Ut(M),z(),ft(ee),rt(g)),u!==!0&&(O=null)}function v(){(D.value!==null||e.scrollTarget!==void 0)&&(q.value=Xt(D.value,e.scrollTarget),me(q.value,f))}function V(u){h!==!0?(Yt(T,u),r("click",u)):h=!1}function M(u){ue.value===!0&&e.noFocus!==!0&&tl(S.value,u.target)!==!0&&X()}function g(u){r("escapeKey"),te(u)}function f(){Vl({targetEl:S.value,offset:e.offset,anchorEl:D.value,anchorOrigin:ie.value,selfOrigin:le.value,absoluteOffset:i,fit:e.fit,cover:e.cover,maxHeight:e.maxHeight,maxWidth:e.maxWidth})}function I(){return C(Jt,W.value,()=>b.value===!0?C("div",{role:"menu",...w,ref:S,tabindex:-1,class:["q-menu q-position-engine scroll"+Q.value,w.class],style:[w.style,H.value],...xe.value},Gt(c.default)):null)}return je(o),Object.assign(T,{focus:X,updatePosition:f}),L}});const j=1e3,zl=["start","center","end","start-force","center-force","end-force"],bt=Array.prototype.filter,Ml=window.getComputedStyle(document.body).overflowAnchor===void 0?ll:function(e,c){e!==null&&(e._qOverflowAnimationFrame!==void 0&&cancelAnimationFrame(e._qOverflowAnimationFrame),e._qOverflowAnimationFrame=requestAnimationFrame(()=>{if(e===null)return;e._qOverflowAnimationFrame=void 0;const r=e.children||[];bt.call(r,O=>O.dataset&&O.dataset.qVsAnchor!==void 0).forEach(O=>{delete O.dataset.qVsAnchor});const w=r[c];w&&w.dataset&&(w.dataset.qVsAnchor="")}))};function ke(e,c){return e+c}function Ke(e,c,r,w,O,i,F,h){const y=e===window?document.scrollingElement||document.documentElement:e,T=O===!0?"offsetWidth":"offsetHeight",s={scrollStart:0,scrollViewSize:-F-h,scrollMaxSize:0,offsetStart:-F,offsetEnd:-h};if(O===!0?(e===window?(s.scrollStart=window.pageXOffset||window.scrollX||document.body.scrollLeft||0,s.scrollViewSize+=document.documentElement.clientWidth):(s.scrollStart=y.scrollLeft,s.scrollViewSize+=y.clientWidth),s.scrollMaxSize=y.scrollWidth,i===!0&&(s.scrollStart=(Ne===!0?s.scrollMaxSize-s.scrollViewSize:0)-s.scrollStart)):(e===window?(s.scrollStart=window.pageYOffset||window.scrollY||document.body.scrollTop||0,s.scrollViewSize+=document.documentElement.clientHeight):(s.scrollStart=y.scrollTop,s.scrollViewSize+=y.clientHeight),s.scrollMaxSize=y.scrollHeight),r!==null)for(let S=r.previousElementSibling;S!==null;S=S.previousElementSibling)S.classList.contains("q-virtual-scroll--skip")===!1&&(s.offsetStart+=S[T]);if(w!==null)for(let S=w.nextElementSibling;S!==null;S=S.nextElementSibling)S.classList.contains("q-virtual-scroll--skip")===!1&&(s.offsetEnd+=S[T]);if(c!==e){const S=y.getBoundingClientRect(),b=c.getBoundingClientRect();O===!0?(s.offsetStart+=b.left-S.left,s.offsetEnd-=b.width):(s.offsetStart+=b.top-S.top,s.offsetEnd-=b.height),e!==window&&(s.offsetStart+=s.scrollStart),s.offsetEnd+=s.scrollMaxSize-s.offsetStart}return s}function mt(e,c,r,w){c==="end"&&(c=(e===window?document.body:e)[r===!0?"scrollWidth":"scrollHeight"]),e===window?r===!0?(w===!0&&(c=(Ne===!0?document.body.scrollWidth-document.documentElement.clientWidth:0)-c),window.scrollTo(c,window.pageYOffset||window.scrollY||document.body.scrollTop||0)):window.scrollTo(window.pageXOffset||window.scrollX||document.body.scrollLeft||0,c):r===!0?(w===!0&&(c=(Ne===!0?e.scrollWidth-e.offsetWidth:0)-c),e.scrollLeft=c):e.scrollTop=c}function ze(e,c,r,w){if(r>=w)return 0;const O=c.length,i=Math.floor(r/j),F=Math.floor((w-1)/j)+1;let h=e.slice(i,F).reduce(ke,0);return r%j!==0&&(h-=c.slice(i*j,r).reduce(ke,0)),w%j!==0&&w!==O&&(h-=c.slice(w,F*j).reduce(ke,0)),h}const Tl={virtualScrollSliceSize:{type:[Number,String],default:null},virtualScrollSliceRatioBefore:{type:[Number,String],default:1},virtualScrollSliceRatioAfter:{type:[Number,String],default:1},virtualScrollItemSize:{type:[Number,String],default:24},virtualScrollStickySizeStart:{type:[Number,String],default:0},virtualScrollStickySizeEnd:{type:[Number,String],default:0},tableColspan:[Number,String]},pl={virtualScrollHorizontal:Boolean,onVirtualScroll:Function,...Tl};function Il({virtualScrollLength:e,getVirtualScrollTarget:c,getVirtualScrollEl:r,virtualScrollItemSizeComputed:w}){const O=We(),{props:i,emit:F,proxy:h}=O,{$q:y}=h;let T,s,S,b=[],x;const p=B(0),K=B(0),P=B({}),$=B(null),W=B(null),H=B(null),q=B({from:0,to:0}),me=m(()=>i.tableColspan!==void 0?i.tableColspan:100);w===void 0&&(w=m(()=>i.virtualScrollItemSize));const z=m(()=>w.value+";"+i.virtualScrollHorizontal),D=m(()=>z.value+";"+i.virtualScrollSliceRatioBefore+";"+i.virtualScrollSliceRatioAfter);oe(D,()=>{Q()}),oe(z,Z);function Z(){le(s,!0)}function te(l){le(l===void 0?s:l)}function U(l,o){const v=c();if(v==null||v.nodeType===8)return;const V=Ke(v,r(),$.value,W.value,i.virtualScrollHorizontal,y.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd);S!==V.scrollViewSize&&Q(V.scrollViewSize),L(v,V,Math.min(e.value-1,Math.max(0,parseInt(l,10)||0)),0,zl.indexOf(o)!==-1?o:s!==-1&&l>s?"end":"start")}function ae(){const l=c();if(l==null||l.nodeType===8)return;const o=Ke(l,r(),$.value,W.value,i.virtualScrollHorizontal,y.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd),v=e.value-1,V=o.scrollMaxSize-o.offsetStart-o.offsetEnd-K.value;if(T===o.scrollStart)return;if(o.scrollMaxSize<=0){L(l,o,0,0);return}S!==o.scrollViewSize&&Q(o.scrollViewSize),ee(q.value.from);const M=Math.floor(o.scrollMaxSize-Math.max(o.scrollViewSize,o.offsetEnd)-Math.min(x[v],o.scrollViewSize/2));if(M>0&&Math.ceil(o.scrollStart)>=M){L(l,o,v,o.scrollMaxSize-o.offsetEnd-b.reduce(ke,0));return}let g=0,f=o.scrollStart-o.offsetStart,I=f;if(f<=V&&f+o.scrollViewSize>=p.value)f-=p.value,g=q.value.from,I=f;else for(let u=0;f>=b[u]&&g<v;u++)f-=b[u],g+=j;for(;f>0&&g<v;)f-=x[g],f>-o.scrollViewSize?(g++,I=f):I=x[g]+f;L(l,o,g,I)}function L(l,o,v,V,M){const g=typeof M=="string"&&M.indexOf("-force")!==-1,f=g===!0?M.replace("-force",""):M,I=f!==void 0?f:"start";let u=Math.max(0,v-P.value[I]),_=u+P.value.total;_>e.value&&(_=e.value,u=Math.max(0,_-P.value.total)),T=o.scrollStart;const Y=u!==q.value.from||_!==q.value.to;if(Y===!1&&f===void 0){ue(v);return}const{activeElement:Se}=document,G=H.value;Y===!0&&G!==null&&G!==Se&&G.contains(Se)===!0&&(G.addEventListener("focusout",ie),setTimeout(()=>{G!==null&&G.removeEventListener("focusout",ie)})),Ml(G,v-u);const Me=f!==void 0?x.slice(u,v).reduce(ke,0):0;if(Y===!0){const se=_>=q.value.from&&u<=q.value.to?q.value.to:_;q.value={from:u,to:se},p.value=ze(b,x,0,u),K.value=ze(b,x,_,e.value),requestAnimationFrame(()=>{q.value.to!==_&&T===o.scrollStart&&(q.value={from:q.value.from,to:_},K.value=ze(b,x,_,e.value))})}requestAnimationFrame(()=>{if(T!==o.scrollStart)return;Y===!0&&ee(u);const se=x.slice(u,v).reduce(ke,0),ce=se+o.offsetStart+p.value,Te=ce+x[v];let Ae=ce+V;if(f!==void 0){const Be=se-Me,Oe=o.scrollStart+Be;Ae=g!==!0&&Oe<ce&&Te<Oe+o.scrollViewSize?Oe:f==="end"?Te-o.scrollViewSize:ce-(f==="start"?0:Math.round((o.scrollViewSize-x[v])/2))}T=Ae,mt(l,Ae,i.virtualScrollHorizontal,y.lang.rtl),ue(v)})}function ee(l){const o=H.value;if(o){const v=bt.call(o.children,u=>u.classList&&u.classList.contains("q-virtual-scroll--skip")===!1),V=v.length,M=i.virtualScrollHorizontal===!0?u=>u.getBoundingClientRect().width:u=>u.offsetHeight;let g=l,f,I;for(let u=0;u<V;){for(f=M(v[u]),u++;u<V&&v[u].classList.contains("q-virtual-scroll--with-prev")===!0;)f+=M(v[u]),u++;I=f-x[g],I!==0&&(x[g]+=I,b[Math.floor(g/j)]+=I),g++}}}function ie(){H.value!==null&&H.value!==void 0&&H.value.focus()}function le(l,o){const v=1*w.value;(o===!0||Array.isArray(x)===!1)&&(x=[]);const V=x.length;x.length=e.value;for(let g=e.value-1;g>=V;g--)x[g]=v;const M=Math.floor((e.value-1)/j);b=[];for(let g=0;g<=M;g++){let f=0;const I=Math.min((g+1)*j,e.value);for(let u=g*j;u<I;u++)f+=x[u];b.push(f)}s=-1,T=void 0,p.value=ze(b,x,0,q.value.from),K.value=ze(b,x,q.value.to,e.value),l>=0?(ee(q.value.from),ne(()=>{U(l)})):X()}function Q(l){if(l===void 0&&typeof window<"u"){const f=c();f!=null&&f.nodeType!==8&&(l=Ke(f,r(),$.value,W.value,i.virtualScrollHorizontal,y.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd).scrollViewSize)}S=l;const o=parseFloat(i.virtualScrollSliceRatioBefore)||0,v=parseFloat(i.virtualScrollSliceRatioAfter)||0,V=1+o+v,M=l===void 0||l<=0?1:Math.ceil(l/w.value),g=Math.max(1,M,Math.ceil((i.virtualScrollSliceSize>0?i.virtualScrollSliceSize:10)/V));P.value={total:Math.ceil(g*V),start:Math.ceil(g*o),center:Math.ceil(g*(.5+o)),end:Math.ceil(g*(1+o)),view:M}}function xe(l,o){const v=i.virtualScrollHorizontal===!0?"width":"height",V={["--q-virtual-scroll-item-"+v]:w.value+"px"};return[l==="tbody"?C(l,{class:"q-virtual-scroll__padding",key:"before",ref:$},[C("tr",[C("td",{style:{[v]:`${p.value}px`,...V},colspan:me.value})])]):C(l,{class:"q-virtual-scroll__padding",key:"before",ref:$,style:{[v]:`${p.value}px`,...V}}),C(l,{class:"q-virtual-scroll__content",key:"content",ref:H,tabindex:-1},o.flat()),l==="tbody"?C(l,{class:"q-virtual-scroll__padding",key:"after",ref:W},[C("tr",[C("td",{style:{[v]:`${K.value}px`,...V},colspan:me.value})])]):C(l,{class:"q-virtual-scroll__padding",key:"after",ref:W,style:{[v]:`${K.value}px`,...V}})]}function ue(l){s!==l&&(i.onVirtualScroll!==void 0&&F("virtualScroll",{index:l,from:q.value.from,to:q.value.to-1,direction:l<s?"decrease":"increase",ref:h}),s=l)}Q();const X=ul(ae,y.platform.is.ios===!0?120:35);nl(()=>{Q()});let re=!1;return ol(()=>{re=!0}),al(()=>{if(re!==!0)return;const l=c();T!==void 0&&l!==void 0&&l!==null&&l.nodeType!==8?mt(l,T,i.virtualScrollHorizontal,y.lang.rtl):U(s)}),je(()=>{X.cancel()}),Object.assign(h,{scrollTo:U,reset:Z,refresh:te}),{virtualScrollSliceRange:q,virtualScrollSliceSizeComputed:P,setVirtualScrollSize:Q,onVirtualScrollEvt:X,localResetVirtualScroll:le,padVirtualScroll:xe,scrollTo:U,reset:Z,refresh:te}}const St=e=>["add","add-unique","toggle"].includes(e),El=".*+?^${}()|[]\\",Bl=Object.keys(Qe);var Ll=$e({name:"QSelect",inheritAttrs:!1,props:{...pl,...il,...Qe,modelValue:{required:!0},multiple:Boolean,displayValue:[String,Number],displayValueHtml:Boolean,dropdownIcon:String,options:{type:Array,default:()=>[]},optionValue:[Function,String],optionLabel:[Function,String],optionDisable:[Function,String],hideSelected:Boolean,hideDropdownIcon:Boolean,fillInput:Boolean,maxValues:[Number,String],optionsDense:Boolean,optionsDark:{type:Boolean,default:null},optionsSelectedClass:String,optionsHtml:Boolean,optionsCover:Boolean,menuShrink:Boolean,menuAnchor:String,menuSelf:String,menuOffset:Array,popupContentClass:String,popupContentStyle:[String,Array,Object],useInput:Boolean,useChips:Boolean,newValueMode:{type:String,validator:St},mapOptions:Boolean,emitValue:Boolean,inputDebounce:{type:[Number,String],default:500},inputClass:[Array,String,Object],inputStyle:[Array,String,Object],tabindex:{type:[String,Number],default:0},autocomplete:String,transitionShow:String,transitionHide:String,transitionDuration:[String,Number],behavior:{type:String,validator:e=>["default","menu","dialog"].includes(e),default:"default"},virtualScrollItemSize:{type:[Number,String],default:void 0},onNewValue:Function,onFilter:Function},emits:[...gt,"add","remove","inputValue","newValue","keyup","keypress","keydown","filterAbort"],setup(e,{slots:c,emit:r}){const{proxy:w}=We(),{$q:O}=w,i=B(!1),F=B(!1),h=B(-1),y=B(""),T=B(!1),s=B(!1);let S=null,b=null,x,p,K,P=null,$,W,H,q;const me=B(null),z=B(null),D=B(null),Z=B(null),te=B(null),U=rl(e),ae=fl(ut),L=m(()=>Array.isArray(e.options)?e.options.length:0),ee=m(()=>e.virtualScrollItemSize===void 0?e.optionsDense===!0?24:48:e.virtualScrollItemSize),{virtualScrollSliceRange:ie,virtualScrollSliceSizeComputed:le,localResetVirtualScroll:Q,padVirtualScroll:xe,onVirtualScrollEvt:ue,scrollTo:X,setVirtualScrollSize:re}=Il({virtualScrollLength:L,getVirtualScrollTarget:kt,getVirtualScrollEl:tt,virtualScrollItemSizeComputed:ee}),l=yt(),o=m(()=>{const t=e.mapOptions===!0&&e.multiple!==!0,a=e.modelValue!==void 0&&(e.modelValue!==null||t===!0)?e.multiple===!0&&Array.isArray(e.modelValue)?e.modelValue:[e.modelValue]:[];if(e.mapOptions===!0&&Array.isArray(e.options)===!0){const n=e.mapOptions===!0&&x!==void 0?x:[],d=a.map(A=>Vt(A,n));return e.modelValue===null&&t===!0?d.filter(A=>A!==null):d}return a}),v=m(()=>{const t={};return Bl.forEach(a=>{const n=e[a];n!==void 0&&(t[a]=n)}),t}),V=m(()=>e.optionsDark===null?l.isDark.value:e.optionsDark),M=m(()=>st(o.value)),g=m(()=>{let t="q-field__input q-placeholder col";return e.hideSelected===!0||o.value.length===0?[t,e.inputClass]:(t+=" q-field__input--padding",e.inputClass===void 0?t:[t,e.inputClass])}),f=m(()=>(e.virtualScrollHorizontal===!0?"q-virtual-scroll--horizontal":"")+(e.popupContentClass?" "+e.popupContentClass:"")),I=m(()=>L.value===0),u=m(()=>o.value.map(t=>N.value(t)).join(", ")),_=m(()=>e.displayValue!==void 0?e.displayValue:u.value),Y=m(()=>e.optionsHtml===!0?()=>!0:t=>t!=null&&t.html===!0),Se=m(()=>e.displayValueHtml===!0||e.displayValue===void 0&&(e.optionsHtml===!0||o.value.some(Y.value))),G=m(()=>l.focused.value===!0?e.tabindex:-1),Me=m(()=>{const t={tabindex:e.tabindex,role:"combobox","aria-label":e.label,"aria-readonly":e.readonly===!0?"true":"false","aria-autocomplete":e.useInput===!0?"list":"none","aria-expanded":i.value===!0?"true":"false","aria-controls":`${l.targetUid.value}_lb`};return h.value>=0&&(t["aria-activedescendant"]=`${l.targetUid.value}_${h.value}`),t}),se=m(()=>({id:`${l.targetUid.value}_lb`,role:"listbox","aria-multiselectable":e.multiple===!0?"true":"false"})),ce=m(()=>o.value.map((t,a)=>({index:a,opt:t,html:Y.value(t),selected:!0,removeAtIndex:Ct,toggleOption:de,tabindex:G.value}))),Te=m(()=>{if(L.value===0)return[];const{from:t,to:a}=ie.value;return e.options.slice(t,a).map((n,d)=>{const A=ge.value(n)===!0,k=_e(n)===!0,R=t+d,E={clickable:!0,active:k,activeClass:Oe.value,manualFocus:!0,focused:!1,disable:A,tabindex:-1,dense:e.optionsDense,dark:V.value,role:"option","aria-selected":k===!0?"true":"false",id:`${l.targetUid.value}_${R}`,onClick:()=>{de(n)}};return A!==!0&&(h.value===R&&(E.focused=!0),O.platform.is.desktop===!0&&(E.onMousemove=()=>{i.value===!0&&he(R)})),{index:R,opt:n,html:Y.value(n),label:N.value(n),selected:E.active,focused:E.focused,toggleOption:de,setOptionIndex:he,itemProps:E}})}),Ae=m(()=>e.dropdownIcon!==void 0?e.dropdownIcon:O.iconSet.arrow.dropdown),Be=m(()=>e.optionsCover===!1&&e.outlined!==!0&&e.standout!==!0&&e.borderless!==!0&&e.rounded!==!0),Oe=m(()=>e.optionsSelectedClass!==void 0?e.optionsSelectedClass:e.color!==void 0?`text-${e.color}`:""),J=m(()=>He(e.optionValue,"value")),N=m(()=>He(e.optionLabel,"label")),ge=m(()=>He(e.optionDisable,"disable")),pe=m(()=>o.value.map(t=>J.value(t))),wt=m(()=>{const t={onInput:ut,onChange:ae,onKeydown:et,onKeyup:Je,onKeypress:Ze,onFocus:Ye,onClick(a){p===!0&&Ve(a)}};return t.onCompositionstart=t.onCompositionupdate=t.onCompositionend=ae,t});oe(o,t=>{x=t,e.useInput===!0&&e.fillInput===!0&&e.multiple!==!0&&l.innerLoading.value!==!0&&(F.value!==!0&&i.value!==!0||M.value!==!0)&&(K!==!0&&Ce(),(F.value===!0||i.value===!0)&&ye(""))},{immediate:!0}),oe(()=>e.fillInput,Ce),oe(i,Re),oe(L,Bt);function Ue(t){return e.emitValue===!0?J.value(t):t}function Pe(t){if(t!==-1&&t<o.value.length)if(e.multiple===!0){const a=e.modelValue.slice();r("remove",{index:t,value:a.splice(t,1)[0]}),r("update:modelValue",a)}else r("update:modelValue",null)}function Ct(t){Pe(t),l.focus()}function Xe(t,a){const n=Ue(t);if(e.multiple!==!0){e.fillInput===!0&&Fe(N.value(t),!0,!0),r("update:modelValue",n);return}if(o.value.length===0){r("add",{index:0,value:n}),r("update:modelValue",e.multiple===!0?[n]:n);return}if(a===!0&&_e(t)===!0||e.maxValues!==void 0&&e.modelValue.length>=e.maxValues)return;const d=e.modelValue.slice();r("add",{index:d.length,value:n}),d.push(n),r("update:modelValue",d)}function de(t,a){if(l.editable.value!==!0||t===void 0||ge.value(t)===!0)return;const n=J.value(t);if(e.multiple!==!0){a!==!0&&(Fe(e.fillInput===!0?N.value(t):"",!0,!0),fe()),z.value!==null&&z.value.focus(),(o.value.length===0||qe(J.value(o.value[0]),n)!==!0)&&r("update:modelValue",e.emitValue===!0?n:t);return}if((p!==!0||T.value===!0)&&l.focus(),Ye(),o.value.length===0){const k=e.emitValue===!0?n:t;r("add",{index:0,value:k}),r("update:modelValue",e.multiple===!0?[k]:k);return}const d=e.modelValue.slice(),A=pe.value.findIndex(k=>qe(k,n));if(A!==-1)r("remove",{index:A,value:d.splice(A,1)[0]});else{if(e.maxValues!==void 0&&d.length>=e.maxValues)return;const k=e.emitValue===!0?n:t;r("add",{index:d.length,value:k}),d.push(k)}r("update:modelValue",d)}function he(t){if(O.platform.is.desktop!==!0)return;const a=t!==-1&&t<L.value?t:-1;h.value!==a&&(h.value=a)}function Ie(t=1,a){if(i.value===!0){let n=h.value;do n=vt(n+t,-1,L.value-1);while(n!==-1&&n!==h.value&&ge.value(e.options[n])===!0);h.value!==n&&(he(n),X(n),a!==!0&&e.useInput===!0&&e.fillInput===!0&&Ee(n>=0?N.value(e.options[n]):$,!0))}}function Vt(t,a){const n=d=>qe(J.value(d),t);return e.options.find(n)||a.find(n)||t}function He(t,a){const n=t!==void 0?t:a;return typeof n=="function"?n:d=>d!==null&&typeof d=="object"&&n in d?d[n]:d}function _e(t){const a=J.value(t);return pe.value.find(n=>qe(n,a))!==void 0}function Ye(t){e.useInput===!0&&z.value!==null&&(t===void 0||z.value===t.target&&t.target.value===u.value)&&z.value.select()}function Ge(t){vl(t,27)===!0&&i.value===!0&&(Ve(t),fe(),Ce()),r("keyup",t)}function Je(t){const{value:a}=t.target;if(t.keyCode!==void 0){Ge(t);return}if(t.target.value="",S!==null&&(clearTimeout(S),S=null),b!==null&&(clearTimeout(b),b=null),Ce(),typeof a=="string"&&a.length!==0){const n=a.toLocaleLowerCase(),d=k=>{const R=e.options.find(E=>k.value(E).toLocaleLowerCase()===n);return R===void 0?!1:(o.value.indexOf(R)===-1?de(R):fe(),!0)},A=k=>{d(J)!==!0&&(d(N)===!0||k===!0||ye(a,!0,()=>A(!0)))};A()}else l.clearValue(t)}function Ze(t){r("keypress",t)}function et(t){if(r("keydown",t),ml(t)===!0)return;const a=y.value.length!==0&&(e.newValueMode!==void 0||e.onNewValue!==void 0),n=t.shiftKey!==!0&&e.multiple!==!0&&(h.value!==-1||a===!0);if(t.keyCode===27){De(t);return}if(t.keyCode===9&&n===!1){be();return}if(t.target===void 0||t.target.id!==l.targetUid.value||l.editable.value!==!0)return;if(t.keyCode===40&&l.innerLoading.value!==!0&&i.value===!1){ve(t),we();return}if(t.keyCode===8&&(e.useChips===!0||e.clearable===!0)&&e.hideSelected!==!0&&y.value.length===0){e.multiple===!0&&Array.isArray(e.modelValue)===!0?Pe(e.modelValue.length-1):e.multiple!==!0&&e.modelValue!==null&&r("update:modelValue",null);return}(t.keyCode===35||t.keyCode===36)&&(typeof y.value!="string"||y.value.length===0)&&(ve(t),h.value=-1,Ie(t.keyCode===36?1:-1,e.multiple)),(t.keyCode===33||t.keyCode===34)&&le.value!==void 0&&(ve(t),h.value=Math.max(-1,Math.min(L.value,h.value+(t.keyCode===33?-1:1)*le.value.view)),Ie(t.keyCode===33?1:-1,e.multiple)),(t.keyCode===38||t.keyCode===40)&&(ve(t),Ie(t.keyCode===38?-1:1,e.multiple));const d=L.value;if((H===void 0||q<Date.now())&&(H=""),d>0&&e.useInput!==!0&&t.key!==void 0&&t.key.length===1&&t.altKey===!1&&t.ctrlKey===!1&&t.metaKey===!1&&(t.keyCode!==32||H.length!==0)){i.value!==!0&&we(t);const A=t.key.toLocaleLowerCase(),k=H.length===1&&H[0]===A;q=Date.now()+1500,k===!1&&(ve(t),H+=A);const R=new RegExp("^"+H.split("").map(Le=>El.indexOf(Le)!==-1?"\\"+Le:Le).join(".*"),"i");let E=h.value;if(k===!0||E<0||R.test(N.value(e.options[E]))!==!0)do E=vt(E+1,-1,d-1);while(E!==h.value&&(ge.value(e.options[E])===!0||R.test(N.value(e.options[E]))!==!0));h.value!==E&&ne(()=>{he(E),X(E),E>=0&&e.useInput===!0&&e.fillInput===!0&&Ee(N.value(e.options[E]),!0)});return}if(!(t.keyCode!==13&&(t.keyCode!==32||e.useInput===!0||H!=="")&&(t.keyCode!==9||n===!1))){if(t.keyCode!==9&&ve(t),h.value!==-1&&h.value<d){de(e.options[h.value]);return}if(a===!0){const A=(k,R)=>{if(R){if(St(R)!==!0)return}else R=e.newValueMode;if(Fe("",e.multiple!==!0,!0),k==null)return;(R==="toggle"?de:Xe)(k,R==="add-unique"),e.multiple!==!0&&(z.value!==null&&z.value.focus(),fe())};if(e.onNewValue!==void 0?r("newValue",y.value,A):A(y.value),e.multiple!==!0)return}i.value===!0?be():l.innerLoading.value!==!0&&we()}}function tt(){return p===!0?te.value:D.value!==null&&D.value.contentEl!==null?D.value.contentEl:void 0}function kt(){return tt()}function xt(){return e.hideSelected===!0?[]:c["selected-item"]!==void 0?ce.value.map(t=>c["selected-item"](t)).slice():c.selected!==void 0?[].concat(c.selected()):e.useChips===!0?ce.value.map((t,a)=>C(hl,{key:"option-"+a,removable:l.editable.value===!0&&ge.value(t.opt)!==!0,dense:!0,textColor:e.color,tabindex:G.value,onRemove(){t.removeAtIndex(a)}},()=>C("span",{class:"ellipsis",[t.html===!0?"innerHTML":"textContent"]:N.value(t.opt)}))):[C("span",{[Se.value===!0?"innerHTML":"textContent"]:_.value})]}function lt(){if(I.value===!0)return c["no-option"]!==void 0?c["no-option"]({inputValue:y.value}):void 0;const t=c.option!==void 0?c.option:n=>C(Al,{key:n.index,...n.itemProps},()=>C(xl,()=>C(Ol,()=>C("span",{[n.html===!0?"innerHTML":"textContent"]:n.label}))));let a=xe("div",Te.value.map(t));return c["before-options"]!==void 0&&(a=c["before-options"]().concat(a)),gl(c["after-options"],a)}function At(t,a){const n=a===!0?{...Me.value,...l.splitAttrs.attributes.value}:void 0,d={ref:a===!0?z:void 0,key:"i_t",class:g.value,style:e.inputStyle,value:y.value!==void 0?y.value:"",type:"search",...n,id:a===!0?l.targetUid.value:void 0,maxlength:e.maxlength,autocomplete:e.autocomplete,"data-autofocus":t===!0||e.autofocus===!0||void 0,disabled:e.disable===!0,readonly:e.readonly===!0,...wt.value};return t!==!0&&p===!0&&(Array.isArray(d.class)===!0?d.class=[...d.class,"no-pointer-events"]:d.class+=" no-pointer-events"),C("input",d)}function ut(t){S!==null&&(clearTimeout(S),S=null),b!==null&&(clearTimeout(b),b=null),!(t&&t.target&&t.target.qComposing===!0)&&(Ee(t.target.value||""),K=!0,$=y.value,l.focused.value!==!0&&(p!==!0||T.value===!0)&&l.focus(),e.onFilter!==void 0&&(S=setTimeout(()=>{S=null,ye(y.value)},e.inputDebounce)))}function Ee(t,a){y.value!==t&&(y.value=t,a===!0||e.inputDebounce===0||e.inputDebounce==="0"?r("inputValue",t):b=setTimeout(()=>{b=null,r("inputValue",t)},e.inputDebounce))}function Fe(t,a,n){K=n!==!0,e.useInput===!0&&(Ee(t,!0),(a===!0||n!==!0)&&($=t),a!==!0&&ye(t))}function ye(t,a,n){if(e.onFilter===void 0||a!==!0&&l.focused.value!==!0)return;l.innerLoading.value===!0?r("filterAbort"):(l.innerLoading.value=!0,s.value=!0),t!==""&&e.multiple!==!0&&o.value.length!==0&&K!==!0&&t===N.value(o.value[0])&&(t="");const d=setTimeout(()=>{i.value===!0&&(i.value=!1)},10);P!==null&&clearTimeout(P),P=d,r("filter",t,(A,k)=>{(a===!0||l.focused.value===!0)&&P===d&&(clearTimeout(P),typeof A=="function"&&A(),s.value=!1,ne(()=>{l.innerLoading.value=!1,l.editable.value===!0&&(a===!0?i.value===!0&&fe():i.value===!0?Re(!0):i.value=!0),typeof k=="function"&&ne(()=>{k(w)}),typeof n=="function"&&ne(()=>{n(w)})}))},()=>{l.focused.value===!0&&P===d&&(clearTimeout(P),l.innerLoading.value=!1,s.value=!1),i.value===!0&&(i.value=!1)})}function Ot(){return C(ql,{ref:D,class:f.value,style:e.popupContentStyle,modelValue:i.value,fit:e.menuShrink!==!0,cover:e.optionsCover===!0&&I.value!==!0&&e.useInput!==!0,anchor:e.menuAnchor,self:e.menuSelf,offset:e.menuOffset,dark:V.value,noParentEvent:!0,noRefocus:!0,noFocus:!0,square:Be.value,transitionShow:e.transitionShow,transitionHide:e.transitionHide,transitionDuration:e.transitionDuration,separateClosePopup:!0,...se.value,onScrollPassive:ue,onBeforeShow:ot,onBeforeHide:Ft,onShow:qt},lt)}function Ft(t){at(t),be()}function qt(){re()}function zt(t){Ve(t),z.value!==null&&z.value.focus(),T.value=!0,window.scrollTo(window.pageXOffset||window.scrollX||document.body.scrollLeft||0,0)}function Mt(t){Ve(t),ne(()=>{T.value=!1})}function Tt(){const t=[C(Fl,{class:`col-auto ${l.fieldClass.value}`,...v.value,for:l.targetUid.value,dark:V.value,square:!0,loading:s.value,itemAligned:!1,filled:!0,stackLabel:y.value.length!==0,...l.splitAttrs.listeners.value,onFocus:zt,onBlur:Mt},{...c,rawControl:()=>l.getControl(!0),before:void 0,after:void 0})];return i.value===!0&&t.push(C("div",{ref:te,class:f.value+" scroll",style:e.popupContentStyle,...se.value,onClick:De,onScrollPassive:ue},lt())),C(Sl,{ref:Z,modelValue:F.value,position:e.useInput===!0?"top":void 0,transitionShow:W,transitionHide:e.transitionHide,transitionDuration:e.transitionDuration,onBeforeShow:ot,onBeforeHide:pt,onHide:It,onShow:Et},()=>C("div",{class:"q-select__dialog"+(V.value===!0?" q-select__dialog--dark q-dark":"")+(T.value===!0?" q-select__dialog--focused":"")},t))}function pt(t){at(t),Z.value!==null&&Z.value.__updateRefocusTarget(l.rootRef.value.querySelector(".q-field__native > [tabindex]:last-child")),l.focused.value=!1}function It(t){fe(),l.focused.value===!1&&r("blur",t),Ce()}function Et(){const t=document.activeElement;(t===null||t.id!==l.targetUid.value)&&z.value!==null&&z.value!==t&&z.value.focus(),re()}function be(){F.value!==!0&&(h.value=-1,i.value===!0&&(i.value=!1),l.focused.value===!1&&(P!==null&&(clearTimeout(P),P=null),l.innerLoading.value===!0&&(r("filterAbort"),l.innerLoading.value=!1,s.value=!1)))}function we(t){l.editable.value===!0&&(p===!0?(l.onControlFocusin(t),F.value=!0,ne(()=>{l.focus()})):l.focus(),e.onFilter!==void 0?ye(y.value):(I.value!==!0||c["no-option"]!==void 0)&&(i.value=!0))}function fe(){F.value=!1,be()}function Ce(){e.useInput===!0&&Fe(e.multiple!==!0&&e.fillInput===!0&&o.value.length!==0&&N.value(o.value[0])||"",!0,!0)}function Re(t){let a=-1;if(t===!0){if(o.value.length!==0){const n=J.value(o.value[0]);a=e.options.findIndex(d=>qe(J.value(d),n))}Q(a)}he(a)}function Bt(t,a){i.value===!0&&l.innerLoading.value===!1&&(Q(-1,!0),ne(()=>{i.value===!0&&l.innerLoading.value===!1&&(t>a?Q():Re(!0))}))}function nt(){F.value===!1&&D.value!==null&&D.value.updatePosition()}function ot(t){t!==void 0&&Ve(t),r("popupShow",t),l.hasPopupOpen=!0,l.onControlFocusin(t)}function at(t){t!==void 0&&Ve(t),r("popupHide",t),l.hasPopupOpen=!1,l.onControlFocusout(t)}function it(){p=O.platform.is.mobile!==!0&&e.behavior!=="dialog"?!1:e.behavior!=="menu"&&(e.useInput===!0?c["no-option"]!==void 0||e.onFilter!==void 0||I.value===!1:!0),W=O.platform.is.ios===!0&&p===!0&&e.useInput===!0?"fade":e.transitionShow}return sl(it),cl(nt),it(),je(()=>{S!==null&&clearTimeout(S),b!==null&&clearTimeout(b)}),Object.assign(w,{showPopup:we,hidePopup:fe,removeAtIndex:Pe,add:Xe,toggleOption:de,getOptionIndex:()=>h.value,setOptionIndex:he,moveOptionSelection:Ie,filter:ye,updateMenuPosition:nt,updateInputValue:Fe,isOptionSelected:_e,getEmittingOptionValue:Ue,isOptionDisabled:(...t)=>ge.value.apply(null,t)===!0,getOptionValue:(...t)=>J.value.apply(null,t),getOptionLabel:(...t)=>N.value.apply(null,t)}),Object.assign(l,{innerValue:o,fieldClass:m(()=>`q-select q-field--auto-height q-select--with${e.useInput!==!0?"out":""}-input q-select--with${e.useChips!==!0?"out":""}-chips q-select--${e.multiple===!0?"multiple":"single"}`),inputRef:me,targetRef:z,hasValue:M,showPopup:we,floatingLabel:m(()=>e.hideSelected!==!0&&M.value===!0||typeof y.value=="number"||y.value.length!==0||st(e.displayValue)),getControlChild:()=>{if(l.editable.value!==!1&&(F.value===!0||I.value!==!0||c["no-option"]!==void 0))return p===!0?Tt():Ot();l.hasPopupOpen===!0&&(l.hasPopupOpen=!1)},controlEvents:{onFocusin(t){l.onControlFocusin(t)},onFocusout(t){l.onControlFocusout(t,()=>{Ce(),be()})},onClick(t){if(De(t),p!==!0&&i.value===!0){be(),z.value!==null&&z.value.focus();return}we(t)}},getControl:t=>{const a=xt(),n=t===!0||F.value!==!0||p!==!0;if(e.useInput===!0)a.push(At(t,n));else if(l.editable.value===!0){const A=n===!0?Me.value:void 0;a.push(C("input",{ref:n===!0?z:void 0,key:"d_t",class:"q-select__focus-target",id:n===!0?l.targetUid.value:void 0,value:_.value,readonly:!0,"data-autofocus":t===!0||e.autofocus===!0||void 0,...A,onKeydown:et,onKeyup:Ge,onKeypress:Ze})),n===!0&&typeof e.autocomplete=="string"&&e.autocomplete.length!==0&&a.push(C("input",{class:"q-select__autocomplete-input",autocomplete:e.autocomplete,tabindex:-1,onKeyup:Je}))}if(U.value!==void 0&&e.disable!==!0&&pe.value.length!==0){const A=pe.value.map(k=>C("option",{value:k,selected:!0}));a.push(C("select",{class:"hidden",name:U.value,multiple:e.multiple},A))}const d=e.useInput===!0||n!==!0?void 0:l.splitAttrs.attributes.value;return C("div",{class:"q-field__native row items-center",...d,...l.splitAttrs.listeners.value},a)},getInnerAppend:()=>e.loading!==!0&&s.value!==!0&&e.hideDropdownIcon!==!0?[C(dl,{class:"q-select__dropdown-icon"+(i.value===!0?" rotate-180":""),name:Ae.value})]:null}),ht(l)}});export{Ll as Q};