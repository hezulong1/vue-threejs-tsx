import{ref as h,watch as z,computed as T,createVNode as e,defineComponent as w,isVNode as _,onMounted as F,createTextVNode as S,withDirectives as U,vShow as G,createApp as X}from"vue";import{u as q,a as $,b as J,E as Z,P as Q,B as ee,D as te,$ as ne,c as O,h as oe,o as le,y as ae,z as N,N as re,K as se,H as ie,d as ce,e as j,t as ue,f as x,g as de,i as he,G as P,S as fe}from"./vendor-JITIf3EH.js";import*as b from"three";import{GLTFLoader as pe}from"three/addons/loaders/GLTFLoader.js";import{DRACOLoader as ve}from"three/addons/loaders/DRACOLoader.js";import{OrbitControls as ge}from"three/addons/controls/OrbitControls.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function a(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=a(o);fetch(o.href,s)}})();const we=q({mobile:0,tablet:768}),p=we.smallerOrEqual("tablet"),k=$({storageKey:"3d-color-scheme"}),me=J(k),E=h("zhCN");let y;const A=()=>{y=new VConsole({theme:k.value?"dark":"light"})};function ke(){p.value&&A(),z(p,t=>{t?A():(y==null||y.destroy(),y=void 0)}),z(k,A)}function R(t){E.value=t}function M(t){return{t:a=>T(()=>t[E.value][a]),locale:E.value}}const V=(t,n)=>{var r,o;const a={Docker:!0,centered:t.centered};return e("div",{class:a},[(o=(r=n.slots).default)==null?void 0:o.call(r)])};V.props={centered:Boolean};V.displayName="Docker";const g=w({name:"Hover",props:{side:String,content:String,disableClosingTrigger:Boolean},setup(t,n){return()=>{var a,r;return p.value?(r=(a=n.slots).default)==null?void 0:r.call(a):e(Z,{disableClosingTrigger:t.disableClosingTrigger},{default:()=>[e(Q,{asChild:!0},{default:()=>{var o,s;return[(s=(o=n.slots).default)==null?void 0:s.call(o)]}}),e(ee,{to:"#portal"},{default:()=>[e(te,{class:"TooltipContent",side:t.side},{default:()=>[e("span",null,[t.content]),e(ne,{class:"TooltipArrow",width:12,height:6},null)]})]})]})}}});function Ce(t){return typeof t=="function"||Object.prototype.toString.call(t)==="[object Object]"&&!_(t)}let H=function(t){return t.White="#ffffff",t.Black="#000000",t.Red="#ff3333",t.Blue="#0066ff",t.Yellow="#ffff33",t.Green="#33cc66",t.Gray="#808080",t}({});const De=w({name:"PencilColor",props:{modelValue:String},emits:["update:modelValue"],setup(t,{emit:n}){const a=O(t,"modelValue",n),r=T(()=>p.value?"horizontal":"vertical"),{t:o}=M({zhCN:{White:"白色",Black:"黑色",Red:"红色",Blue:"蓝色",Yellow:"黄色",Green:"绿色",Gray:"灰色"},en:{White:"White",Black:"Black",Red:"Red",Blue:"Blue",Yellow:"Yellow",Green:"Green",Gray:"Gray"}});return()=>{let s;return e(oe,{modelValue:a.value,"onUpdate:modelValue":c=>a.value=c,class:"PencilColor",orientation:r.value},Ce(s=le(H).map(([c,u])=>e(g,{content:o(c).value,side:"right"},{default:()=>[e(ae,{class:"PencilColorItem","aria-label":c,value:u,style:{background:u}},{default:()=>[e("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",class:"bi bi-check-lg",viewBox:"0 0 16 16"},[e("path",{d:"M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"},null)])]})]})))?s:{default:()=>[s]})}}}),be=w({name:"PencilAction",emits:{action:t=>!0},setup(t,n){const a=h(!1),r=h(!1),{t:o}=M({zhCN:{Draw:"自由书写",Eraser:"橡皮擦",Delete:"删除"},en:{Draw:"Draw",Eraser:"Eraser",Delete:"Delete"}});function s(l){a.value=l,r.value=!1,n.emit("action",l?"Draw":void 0)}function c(l){r.value=l,a.value=!1,n.emit("action",l?"Eraser":void 0)}function u(){a.value=!1,r.value=!1,n.emit("action","Delete")}return{drawPressed:a,eraserPressed:r,onDidDraw:s,onDidEraser:c,onDidDelete:u,t:o}},render(){return e("div",{class:"PencilAction"},[e(g,{content:this.t("Draw").value,side:"top"},{default:()=>[e(N,{class:"PencilActionItem",pressed:this.drawPressed,"onUpdate:pressed":this.onDidDraw},{default:()=>[e("svg",{"aria-hidden":"true",focusable:"false",role:"img",viewBox:"0 0 20 20",class:"",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round"},[e("g",{"stroke-width":"1.25"},[e("path",{"clip-rule":"evenodd",d:"m7.643 15.69 7.774-7.773a2.357 2.357 0 1 0-3.334-3.334L4.31 12.357a3.333 3.333 0 0 0-.977 2.357v1.953h1.953c.884 0 1.732-.352 2.357-.977Z"},null),e("path",{d:"m11.25 5.417 3.333 3.333"},null)])])]})]}),e(g,{content:this.t("Eraser").value,side:"top"},{default:()=>[e(N,{class:"PencilActionItem",pressed:this.eraserPressed,"onUpdate:pressed":this.onDidEraser},{default:()=>[e("svg",{"aria-hidden":"true",focusable:"false",role:"img",viewBox:"0 0 24 24",class:"",fill:"none","stroke-width":"2",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round"},[e("g",{"stroke-width":"1.5"},[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"},null),e("path",{d:"M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3"},null),e("path",{d:"M18 13.3l-6.3 -6.3"},null)])])]})]}),e(g,{content:this.t("Delete").value,side:"top"},{default:()=>[e("button",{class:"PencilActionItem",type:"button",onClick:this.onDidDelete},[e("svg",{"aria-hidden":"true",focusable:"false",role:"img",viewBox:"0 0 20 20",class:"",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round"},[e("path",{"stroke-width":"1.25",d:"M3.333 5.833h13.334M8.333 9.167v5M11.667 9.167v5M4.167 5.833l.833 10c0 .92.746 1.667 1.667 1.667h6.666c.92 0 1.667-.746 1.667-1.667l.833-10M7.5 5.833v-2.5c0-.46.373-.833.833-.833h3.334c.46 0 .833.373.833.833v2.5"},null)])])]})])}}),ye=w({name:"PencilWeight",props:{modelValue:Array},emits:["update:modelValue"],setup(t,{emit:n}){return{internalValue:O(t,"modelValue",n)}},render(){return e(re,{modelValue:this.internalValue,"onUpdate:modelValue":t=>this.internalValue=t,class:"PencilWeight",min:1,max:30,orientation:p.value?"horizontal":"vertical"},{default:()=>{var t;return[e(se,{class:"PencilWeightTrack"},{default:()=>[e(ie,{class:"PencilWeightRange"},null)]}),e(g,{side:"right",content:(t=this.internalValue)==null?void 0:t.join(""),disableClosingTrigger:!0},{default:()=>[e(ce,{class:"PencilWeightThumb"},{default:()=>{var n;return[p.value?(n=this.internalValue)==null?void 0:n.join(""):null]}})]})]}})}}),ze=w({setup(){const t=h(),n=h(H.Red),a=h([4]),r=h(),{width:o,height:s}=j();let c=h(!1),u={x:0,y:0},l;const m=i=>{l&&(l.fillStyle=i,l.strokeStyle=i)},C=()=>{l&&(l.clip(),l.clearRect(0,0,o.value,s.value),l.restore())},D=()=>{l&&(l.save(),l.beginPath(),l.arc(u.x,u.y,0,0,Math.PI*2),l.fill(),r.value==="Eraser"&&C())},v=(i,d)=>{if(!l)return;l.lineWidth=a.value[0];const f=()=>{l.moveTo(u.x,u.y),l.lineTo(i,d),l.stroke(),l.closePath()};r.value==="Eraser"?(l.save(),l.globalCompositeOperation="destination-out",f(),C()):f()};function B(i){r.value=i,l&&i==="Delete"&&l.clearRect(0,0,o.value,s.value)}ue(()=>{var i;l=(i=t.value)==null?void 0:i.getContext("2d"),l.lineCap="round",l.lineJoin="round",m(n.value)}),z(n,i=>{m(i)});const L=i=>{const d=i.buttons===0,f=i.buttons===1;return(d||f)??!0},Y=[x(t,"pointerdown",i=>{if(!L(i)||r.value!=="Draw"&&r.value!=="Eraser")return;c.value=!0;const d=i.target;d==null||d.setPointerCapture(i.pointerId);const{clientX:f,clientY:K}=i;u.x=f,u.y=K,D()}),x(t,"pointermove",i=>{if(!L(i)||r.value!=="Draw"&&r.value!=="Eraser"||!c.value)return;const{clientX:d,clientY:f}=i;v(d,f),u.x=d,u.y=f}),x(t,"pointerup",i=>{if(!L(i))return;c.value=!1;const d=i.target;d==null||d.releasePointerCapture(i.pointerId)})];return de(()=>{Y.forEach(i=>i())}),{canvasRef:t,pencilColor:n,pencilWeight:a,action:r,viewportWidth:o,viewportHeight:s,onDidAction:B}},render(){const t={Dashboard:!0,"cursor-pencil":this.action==="Draw","cursor-eraser":this.action==="Eraser"},n={left:!0,bottom:p.value};return e("div",{class:"GridView Draw up"},[e("div",{class:t},[e("canvas",{ref:"canvasRef",width:this.viewportWidth,height:this.viewportHeight},null)]),e(V,{centered:p.value,class:n},{default:()=>[e(De,{modelValue:this.pencilColor,"onUpdate:modelValue":a=>this.pencilColor=a},null),e(ye,{modelValue:this.pencilWeight,"onUpdate:modelValue":a=>this.pencilWeight=a},null)]}),e(V,{centered:!0,class:"bottom"},{default:()=>[e(be,{onAction:this.onDidAction},null)]})])}}),W=16183004,I=4479340,Ve=w({name:"Model",setup(t,n){const a=h(),{width:r,height:o}=j(),s=new b.Scene;s.background=new b.Color(k.value?I:W);const c=new b.PerspectiveCamera(45,r.value/o.value,.1,150);c.position.set(1.5,4,9);const u=new b.WebGLRenderer({antialias:!0});u.setSize(r.value,o.value,!0);const l=()=>{u.render(s,c)},m=new ge(c,u.domElement);m.addEventListener("change",l),m.target.set(0,2,0),m.update();const C=new ve;C.setDecoderPath("/vue-threejs-tsx/gltf/");const D=new pe;return D.setDRACOLoader(C),D.setPath("/vue-threejs-tsx/AVIFTest/"),D.load("forest_house.glb",function(v){s.add(v.scene),l()}),z(k,v=>{s.background=new b.Color(v?I:W),l()}),F(()=>{a.value&&(a.value.appendChild(u.domElement),z([r,o],([v,B])=>{c.aspect=v/B,c.updateProjectionMatrix(),u.setSize(v,B),l()}))}),{containerRef:a}},render(){return e("div",{class:"GridView Model"},[e("div",{class:"info"},[e("span",null,[S("Forest House by")," ",e("a",{href:"https://sketchfab.com/peachyroyalty",target:"_blank",rel:"noopener"},[S("peachyroyalty")])])]),e("div",{ref:"containerRef",class:"Dashboard"},null)])}});function Me(t){const{t:n}=M({zhCN:{close:"关闭画板"},en:{close:"Close"}});return e("a",{class:"IconButton as-close",title:n("close").value,"aria-label":"Close"},[e("svg",{"aria-hidden":!0,xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},[e("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M368 368L144 144"},null),e("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M368 144L144 368"},null)])])}const Be=w({emits:{action:(t,n)=>!0},setup(t,n){const a=h(!1),r=h(!1),o=h(""),{t:s}=M({zhCN:{UseDraw:"画板",LockScreen:"锁定",ChangeBackground:"切换背景","lock.screen":"锁定屏幕","unlock.screen":"解锁屏幕","change.background":"切换背景成功"},en:{UseDraw:"Draw",LockScreen:"Lock",ChangeBackground:"ChangeBackgroud","lock.screen":"Lock screen success","unlock.screen":"Unlock screen","change.background":"change background"}});function c(){n.emit("action","UseDraw")}function u(){a.value=!a.value,r.value=!0,o.value=a.value?s("lock.screen").value:s("unlock.screen").value,n.emit("action","LockScreen",a.value)}function l(){r.value=!0,o.value=s("change.background").value,n.emit("action","ChangeBackground")}return{t:s,isLocked:a,openToast:r,toastText:o,onDidUseDraw:c,onDidLockScreen:u,onDidChangeBackgroud:l}},render(){return e(V,{centered:!0,class:"bottom"},{default:()=>[e(he,{class:"Util",loop:!0},{default:()=>[e(g,{content:this.t("UseDraw").value,side:"top"},{default:()=>[e(P,{asChild:!0},{default:()=>[e("button",{class:"UtilItem",type:"button",onClick:this.onDidUseDraw},[e("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",class:"bi bi-palette",viewBox:"0 0 16 16"},[e("path",{d:"M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"},null),e("path",{d:"M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z"},null)])])]})]}),e(g,{content:this.t("LockScreen").value,side:"top"},{default:()=>[e(P,{asChild:!0},{default:()=>[e("button",{class:"UtilItem",type:"button",onClick:this.onDidLockScreen},[this.isLocked?e("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",class:"bi bi-lock",viewBox:"0 0 16 16"},[e("path",{d:"M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"},null)]):e("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",class:"bi bi-unlock",viewBox:"0 0 16 16"},[e("path",{d:"M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z"},null)])])]})]}),e(g,{content:this.t("ChangeBackground").value,side:"top"},{default:()=>[e(P,{asChild:!0},{default:()=>[e("button",{class:"UtilItem",type:"button",onClick:this.onDidChangeBackgroud},[k.value?e("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",class:"bi bi-moon",viewBox:"0 0 16 16"},[e("path",{d:"M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"},null)]):e("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",class:"bi bi-sun",viewBox:"0 0 16 16"},[e("path",{d:"M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"},null)])])]})]})]})]})}});function Le(t){const{t:n,locale:a}=M({zhCN:{locale:"中"},en:{locale:"EN"}});function r(o){o.preventDefault(),R(a==="zhCN"?"en":"zhCN")}return e("a",{class:"IconButton as-locale",title:n("locale").value,onClick:r},[e("span",null,[n("locale").value])])}const xe=w({name:"App",data(){return{renderDraw:!1,renderMask:!1,openToast:""}},mounted(){ke()},methods:{onDidAction(t,n){t==="UseDraw"?this.renderDraw=!0:t==="ChangeBackground"?me():t==="LockScreen"&&(this.renderMask=n)}},render(){return e(fe,null,{default:()=>[!p.value&&e(Le,{style:this.renderDraw?{top:"63px"}:null},null),this.renderDraw&&e(Me,{onClick:()=>this.renderDraw=!1},null),this.renderDraw&&e(ze,null,null),e(Ve,null,null),U(e("div",{class:"GridView Mask up",style:{transform:"scale(1.5)"}},null),[[G,this.renderMask&&!this.renderDraw]]),U(e(Be,{onAction:this.onDidAction,style:{zIndex:2}},null),[[G,!this.renderDraw]])]})}});X(xe).mount("#app");
