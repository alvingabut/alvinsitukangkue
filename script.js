/* ===== Tombol overlay: dipasang PERTAMA supaya tetap jalan walau bagian 3D error ===== */
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
  try{
    if(a==='start'||a==='retry')init();
    else if(a==='next'){S.day++;startDay()}
    else if(a==='pause')pause();
    else if(a==='resume')resume();
    else if(a==='acc')decide(true);
    else if(a==='rej')decide(false)
  }catch(err){alert('Error: '+err.message);console.error(err)}});

if(typeof THREE==='undefined'){
  document.querySelector('#ov').innerHTML='<div class="box"><h2>⚠️ three.js gagal dimuat</h2><p>Periksa koneksi internet lalu muat ulang halaman.</p></div>';
  throw new Error('THREE tidak ditemukan')}
const $=s=>document.querySelector(s),R=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const C=[{k:'roti',e:'🍞',n:'Roti',c:4,p:10,t:3},{k:'cup',e:'🧁',n:'Cupcake',c:6,p:16,t:4},{k:'donat',e:'🍩',n:'Donat',c:8,p:21,t:5},{k:'tart',e:'🎂',n:'Kue Tart',c:16,p:42,t:8}];
const CL=[0x6c8cff,0x58b87a,0xe67e9a,0xf0a040,0x9b6bd6,0x40b5c4],DUR=60,NM=['Rina','Budi','Sari','Dewi','Andi','Mita','Joko','Lia'],SN=['Mengaduk adonan 🥣','Memanggang 🔥','Menghias ✨'];
let S=null,tm,DT=.016,nk=0,kb=0,PO=null;
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(tm);tm=setTimeout(()=>e.classList.remove('on'),2400)}
function ov(h){$('#ov').innerHTML='<div class="box">'+h+'</div>';$('#ov').classList.add('on');if(S)S.run=false;if(document.exitPointerLock)document.exitPointerLock()}

/* ===== Dunia 3D ===== */
const cv=$('#c'),ren=new THREE.WebGLRenderer({canvas:cv,antialias:true});
ren.setPixelRatio(Math.min(devicePixelRatio,2));
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(72,1,.1,60);
function rs(){ren.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}rs();addEventListener('resize',rs);
const amb=new THREE.AmbientLight(0xffffff,.75),sun=new THREE.DirectionalLight(0xffffff,.6),lamp=new THREE.PointLight(0xffd9a0,.3,22);
sun.position.set(4,8,6);lamp.position.set(0,3.1,0);sc.add(amb,sun,lamp);
const DAY=new THREE.Color(0xbfe6ff),NIGHT=new THREE.Color(0x15122e);sc.background=DAY.clone();
const M=c=>new THREE.MeshLambertMaterial({color:c});
function box(w,h,d,x,y,z,c,p){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);(p||sc).add(m);return m}
const tx={};
function spr(t,s,f){f=f||96;const key=t+f;if(!tx[key]){const k=document.createElement('canvas');k.width=k.height=128;const g=k.getContext('2d');g.font=f+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,64,70);tx[key]=new THREE.CanvasTexture(k)}
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx[key],transparent:true,depthWrite:false}));sp.scale.set(s,s,1);return sp}
function person(sh,hat){const g=new THREE.Group();
  box(.5,.8,.3,0,.8,0,sh,g);box(.14,.7,.14,-.32,.8,0,sh,g);box(.14,.7,.14,.32,.8,0,sh,g);
  box(.18,.5,.2,-.12,.25,0,0x444466,g);box(.18,.5,.2,.12,.25,0,0x444466,g);
  const h=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),M(0xf1c9a5));h.position.y=1.4;g.add(h);
  box(.05,.05,.04,-.08,1.43,.2,0x222222,g);box(.05,.05,.04,.08,1.43,.2,0x222222,g);
  if(hat)box(.3,.3,.3,0,1.72,0,hat,g);return g}
const hit=[];
function reg(g,u,x,y,z,ry){g.userData=u;g.position.set(x,y,z);g.rotation.y=ry||0;sc.add(g);hit.push(g);return g}
// lantai, jalan, dinding, atap (tekstur dibuat lewat canvas, tanpa file gambar)
const AN=ren.capabilities.getMaxAnisotropy();
function ctex(sz,draw){const k=document.createElement('canvas');k.width=k.height=sz;const g=k.getContext('2d');draw(g,sz);
  const t=new THREE.CanvasTexture(k);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=AN;return t}
function nz(g,s,n,a){for(let i=0;i<n;i++){g.fillStyle='rgba('+(Math.random()<.5?'0,0,0':'255,255,255')+','+Math.random()*a+')';g.fillRect(Math.random()*s,Math.random()*s,1+Math.random()*2,1+Math.random()*2)}}
const TXT={
 plaster:ctex(256,(g,s)=>{g.fillStyle='#f7dbe2';g.fillRect(0,0,s,s);for(let x=0;x<s;x+=32){g.fillStyle='rgba(255,255,255,.35)';g.fillRect(x,0,14,s)}nz(g,s,2500,.07)}),
 brick:ctex(256,(g,s)=>{g.fillStyle='#cdbfae';g.fillRect(0,0,s,s);for(let r=0;r<8;r++)for(let c=-1;c<5;c++){const x=c*64+(r%2?32:0),h=Math.random()*20-10;g.fillStyle='rgb('+((170+h)|0)+','+((80+h)|0)+','+((58+h)|0)+')';g.fillRect(x+2,r*32+2,60,28)}nz(g,s,3000,.12)}),
 wood:ctex(256,(g,s)=>{for(let i=0;i<4;i++){g.fillStyle=i%2?'#7a4b2a':'#86552f';g.fillRect(i*64,0,64,s);g.fillStyle='#3b2412';g.fillRect(i*64,0,3,s);for(let j=0;j<25;j++){g.fillStyle='rgba(40,20,5,'+Math.random()*.25+')';g.fillRect(i*64+4+Math.random()*56,0,1,s)}}nz(g,s,800,.1)}),
 floor:ctex(256,(g,s)=>{for(let i=0;i<2;i++)for(let j=0;j<2;j++){g.fillStyle=(i+j)%2?'#f3a9c0':'#fff4e6';g.fillRect(i*128,j*128,128,128)}g.fillStyle='#d8c3b8';for(let i=0;i<2;i++){g.fillRect(i*128,0,3,s);g.fillRect(0,i*128,s,3)}nz(g,s,2500,.06)}),
 road:ctex(256,(g,s)=>{g.fillStyle='#454a52';g.fillRect(0,0,s,s);nz(g,s,6000,.18)}),
 pave:ctex(256,(g,s)=>{g.fillStyle='#b9b5ae';g.fillRect(0,0,s,s);g.fillStyle='#8f8b84';for(let i=0;i<4;i++){g.fillRect(i*64,0,2,s);g.fillRect(0,i*64,s,2)}nz(g,s,2500,.1)}),
 ceil:ctex(256,(g,s)=>{g.fillStyle='#fdf6ee';g.fillRect(0,0,s,s);g.fillStyle='#e6d9cc';for(let i=0;i<2;i++){g.fillRect(i*128,0,4,s);g.fillRect(0,i*128,s,4)}nz(g,s,1500,.05)}),
 roof:ctex(256,(g,s)=>{g.fillStyle='#5a2418';g.fillRect(0,0,s,s);for(let r=0;r<8;r++)for(let c=0;c<8;c++){const x=c*32+(r%2?16:0),h=Math.random()*20-10;g.fillStyle='rgb('+((165+h)|0)+','+((70+h)|0)+','+((45+h)|0)+')';g.fillRect(x,r*32,30,28);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,r*32+26,30,3)}nz(g,s,1500,.1)}),
 awn:ctex(128,(g,s)=>{for(let i=0;i<4;i++){g.fillStyle=i%2?'#ffffff':'#e8456b';g.fillRect(i*32,0,32,s)}nz(g,s,400,.05)})
};
function TM(t,rx,ry){const c=t.clone();c.needsUpdate=true;c.repeat.set(rx,ry);return new THREE.MeshLambertMaterial({map:c})}
function tbox(w,h,d,x,y,z,t,rx,ry){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),TM(t,rx,ry));m.position.set(x,y,z);sc.add(m);return m}
const PL=M(0xe9d3cf);
// dinding: sisi dalam plester bermotif, sisi luar bata. face/out = indeks sisi box (0:+x 1:-x 4:+z 5:-z)
function wall(w,h,d,x,y,z,face,out){const m=[PL,PL,PL,PL,PL,PL];
  m[face]=TM(TXT.plaster,(face<2?d:w)/2,h/2);m[out]=TM(TXT.brick,(out<2?d:w)/1.2,h/1.2);
  const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);sc.add(o);return o}
box(120,.1,120,0,-.3,0,0x8fcf8f);
tbox(14,.1,10,0,-.05,0,TXT.floor,14/1.6,10/1.6);
tbox(26,.1,12,0,-.06,11,TXT.road,13,6);
tbox(26,.14,1.6,0,0,5.8,TXT.pave,26/1.6,1);
wall(14,3.4,.2,0,1.7,-5,4,5);wall(.2,3.4,10,-7,1.7,0,0,1);wall(.2,3.4,10,7,1.7,0,1,0);
wall(5.8,3.4,.2,-4.1,1.7,5,5,4);wall(5.8,3.4,.2,4.1,1.7,5,5,4);wall(2.4,.9,.2,0,2.95,5,5,4);
// lis kayu bawah dinding (wainscot)
tbox(13.9,.8,.06,0,.4,-4.87,TXT.wood,13.9,.8);tbox(.06,.8,9.9,-6.87,.4,0,TXT.wood,9.9,.8);tbox(.06,.8,9.9,6.87,.4,0,TXT.wood,9.9,.8);
tbox(5.8,.8,.06,-4.1,.4,4.87,TXT.wood,5.8,.8);tbox(5.8,.8,.06,4.1,.4,4.87,TXT.wood,5.8,.8);
// plafon, balok kayu, lampu gantung
tbox(14,.1,10,0,3.45,0,TXT.ceil,14/1.6,10/1.6);
[-3.2,0,3.2].forEach(z=>box(14,.12,.2,0,3.34,z,0x6b4426));
[-4,-2,0].forEach(x=>{box(.02,.4,.02,x,3.2,.2,0x333333);const sh=new THREE.Mesh(new THREE.CylinderGeometry(.1,.28,.22,16),M(0xff9ec0));sh.position.set(x,2.95,.2);sc.add(sh);
  const bu=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),new THREE.MeshBasicMaterial({color:0xfff2c0}));bu.position.set(x,2.85,.2);sc.add(bu)});
// atap pelana di luar + dinding segitiga
[[1,.245],[-1,-.245]].forEach(a=>{const m=tbox(15,.15,5.9,0,4.1,a[0]*2.8,TXT.roof,10,4);m.rotation.x=a[1]});
box(15.2,.15,.3,0,4.85,0,0x6b2e20);
const gs=new THREE.Shape();gs.moveTo(-5.6,0);gs.lineTo(5.6,0);gs.lineTo(0,1.4);gs.closePath();
const gm=TM(TXT.brick,1/1.2,1/1.2);gm.side=THREE.DoubleSide;
[-7.05,7.05].forEach(x=>{const m=new THREE.Mesh(new THREE.ShapeGeometry(gs),gm);m.position.set(x,3.4,0);m.rotation.y=Math.PI/2;sc.add(m)});
// papan nama + kanopi bergaris
const sgc=document.createElement('canvas');sgc.width=512;sgc.height=128;const sg=sgc.getContext('2d');
sg.fillStyle='#ff7ea8';sg.fillRect(0,0,512,128);sg.strokeStyle='#fff';sg.lineWidth=8;sg.strokeRect(6,6,500,116);
sg.fillStyle='#fff';sg.font='bold 58px sans-serif';sg.textAlign='center';sg.textBaseline='middle';sg.fillText('🧁 Toko Kue Manis',256,68);
const sb=new THREE.Mesh(new THREE.PlaneGeometry(3.6,.9),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sgc)}));sb.position.set(0,2.95,5.11);sc.add(sb);
const aw=tbox(6,.05,1,0,2.44,5.6,TXT.awn,6,1);aw.rotation.x=.12;
// pintu kaca ganda yang bisa dibuka (klik / tekan E)
box(.12,2.5,.3,-1.26,1.25,5,0x4a2c14);box(.12,2.5,.3,1.26,1.25,5,0x4a2c14);box(2.6,.05,.5,0,.03,5,0xb8b2a8);
let dOp=0,dAm=0;
function leaf(dir){const g=new THREE.Group();g.position.set(-dir*1.2,0,0);const W=0x6b4426;
  box(1.15,.3,.06,dir*.6,.15,0,W,g);box(1.15,.12,.06,dir*.6,2.24,0,W,g);box(.1,2.3,.06,dir*.05,1.15,0,W,g);box(.1,2.3,.06,dir*1.15,1.15,0,W,g);
  const gl=new THREE.Mesh(new THREE.PlaneGeometry(1,1.75),new THREE.MeshLambertMaterial({color:0xaee4ff,transparent:true,opacity:.35,side:THREE.DoubleSide}));gl.position.set(dir*.6,1.2,0);g.add(gl);
  box(.04,.35,.08,dir*1.08,1.1,0,0xffd24d,g);return g}
const doorG=new THREE.Group(),lfL=leaf(1),lfR=leaf(-1);doorG.add(lfL,lfR);reg(doorG,{a:'door'},0,0,5);
// kasir
box(6,1.1,.9,-2.2,.55,1.2,0xff9ec0);box(6.2,.1,1.1,-2.2,1.15,1.2,0xffffff);box(.5,.35,.4,-.6,1.37,1.2,0x333333);
const cashier=person(0x7aa2ff);cashier.position.set(-3.6,0,.25);sc.add(cashier);
const stockSp={};C.forEach((c,i)=>{const s=spr(c.e,.6);s.position.set(-4.6+i*.8,1.55,1.2);sc.add(s);stockSp[c.k]=s});
// telepon pesanan online
const phn=new THREE.Group(),ps=spr('📱',.7),bl=spr('🔔',.5);box(.3,.06,.5,0,0,0,0x222222,phn);ps.position.y=.45;bl.position.set(.25,.95,0);phn.add(ps,bl);reg(phn,{a:'phone'},.3,1.2,1.2);
// dapur
box(5.6,1.1,1,3.6,.55,-3.2,0xc9a27a);box(5.8,.1,1.2,3.6,1.15,-3.2,0xffffff);
box(1.6,1.8,.8,5.6,.9,-4.5,0x444444);
// ruang dapur: lantai keramik, kompor, kap, kulkas, rak bahan, sekat & papan nama
for(let i=0;i<6;i++)for(let j=0;j<2;j++)box(1.04,.02,1.25,1.27+i*1.04,.01,-4.275+j*1.25,(i+j)%2?0xcfeee8:0xf4fffc);
box(6.2,1.4,.04,3.9,1.5,-4.86,0xdff3f0);
box(2.5,.9,.6,3.1,.45,-4.6,0x9aa3ad);box(2.6,.06,.66,3.1,.93,-4.6,0x333333);
const bn=[2.5,3.7].map(x=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.03,16),new THREE.MeshBasicMaterial({color:0x222222}));b.position.set(x,.97,-4.6);sc.add(b);return b});
const pot=new THREE.Mesh(new THREE.CylinderGeometry(.22,.2,.28,14),M(0xb0b8c4));pot.position.set(2.5,1.12,-4.6);sc.add(pot);
const pan=spr('🍳',.6);pan.position.set(3.7,1.25,-4.6);sc.add(pan);
box(2.6,.5,.7,3.1,2.6,-4.55,0x8a929c);box(.5,.55,.5,3.1,3.12,-4.65,0x8a929c);
box(.9,2.1,.8,1.25,1.05,-4.5,0xf0f3f5);box(.05,.6,.05,1.62,1.2,-4.08,0x888888);
const fr=spr('🧊',.4);fr.position.set(1.25,1.8,-4.07);sc.add(fr);
box(.3,.06,2,6.75,1.9,-3.7,0xa0764a);['🥚','🥛','🌾','🍫'].forEach((t,i)=>{const s=spr(t,.45);s.position.set(6.7,2.2,-4.4+i*.5);sc.add(s)});
box(.1,1.1,2.5,.7,.55,-3.65,0xff9ec0);box(6.4,.3,.15,3.9,3.15,-2.45,0xff9ec0);
const kc=document.createElement('canvas');kc.width=256;kc.height=64;const kg=kc.getContext('2d');kg.fillStyle='#fff';kg.font='bold 44px sans-serif';kg.textAlign='center';kg.textBaseline='middle';kg.fillText('👩‍🍳 DAPUR',128,34);
const ks=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(kc),transparent:true}));ks.scale.set(2.4,.6,1);ks.position.set(3.9,3.15,-2.33);sc.add(ks);
const kl=new THREE.PointLight(0xffe0b0,.6,9);kl.position.set(3.9,2.8,-3.6);sc.add(kl);
const glow=box(.8,.6,.05,5.6,1,-4.09,0xff9f43);glow.material=new THREE.MeshBasicMaterial({color:0x553322});
C.forEach((c,i)=>{const g=new THREE.Group();box(.7,.08,.6,0,0,0,0xb98a5e,g);const s=spr(c.e,.7);s.position.y=.45;g.add(s);const p=spr(c.c+'💰',.6,46);p.position.y=1;g.add(p);reg(g,{a:'bake',k:c.k},1.5+i*1.2,1.24,-3.2)});
const cook=person(0xffffff,0xffffff),cl2=spr('⚡',.7,46);cl2.position.y=2.2;cook.add(cl2);reg(cook,{a:'up'},2.6,0,-4.1);
// efek memasak: ikon tahap, bar progres, uap
const SG=['🥣','🔥','✨'].map(t=>{spr(t,1);return tx[t+96]}),wk=spr('🥣',1),
 stm=[0,1,2].map(()=>{const s=spr('💨',.5);sc.add(s);s.visible=false;return s}),
 pbg=new THREE.Sprite(new THREE.SpriteMaterial({color:0x553344})),pb=new THREE.Sprite(new THREE.SpriteMaterial({color:0xff7ea8}));
pbg.scale.set(1.5,.16,1);pbg.position.set(3.6,2.6,-3.25);pb.scale.set(1.4,.1,1);pb.position.z=-3.2;pb.position.y=2.6;
wk.visible=pb.visible=pbg.visible=false;sc.add(wk,pbg,pb);
// pengemis
const beg=person(0x7a6a55);const bs=spr('🙏',.6);bs.position.y=2;beg.add(bs);reg(beg,{a:'beg'},1.8,0,7.4,Math.PI);beg.visible=false;
box(.15,3,.15,-3.5,1.5,8,0x555555);

/* ===== Logika game ===== */
function init(){S={day:1,money:40,rep:5,stock:{},q:[],cur:null,prog:0,lvl:0,id:1,orders:[]};C.forEach(c=>S.stock[c.k]=0);startDay()}
function startDay(){Object.assign(S,{ph:'open',t:0,cust:[],th:[],thS:[],bs:'wait',bsh:0,sp:1,m0:S.money,st:0,run:true,
  pk:S.orders.filter(o=>!o.done&&o.due===S.day).map((o,i)=>({o:o,at:4+i*7})),inc:null,rt:R(6,12)});
  $('#ov').classList.remove('on');
  const n=S.pk.length;if(n)setTimeout(()=>toast('📋 '+n+' pesanan pre-order jatuh tempo hari ini!'),600)}
function bake(d){
  if(!S.cur&&S.q.length){S.cur=S.q.shift();S.prog=0}
  if(S.cur){S.prog+=d/(S.cur.t*Math.pow(.8,S.lvl));
    if(S.prog>=1){S.stock[S.cur.k]++;toast('✅ '+S.cur.e+' '+S.cur.n+' matang!');S.cur=null;S.prog=0}}}
function closeShop(){
  if(S.bs==='wait'){S.rep-=1;toast('😞 Pengemis pergi lapar (-1❤️)')}
  const mis=S.orders.filter(o=>!o.done&&o.due<=S.day);
  if(mis.length){mis.forEach(o=>o.done=1);S.rep-=mis.length;setTimeout(()=>toast('😞 '+mis.length+' pesanan gagal diantar (-'+mis.length+'❤️)'),1500)}
  S.inc=null;S.cust=[];S.ph='night';S.t=0;
  const n=Math.min(1+Math.floor(S.day/2),4);let t=2;
  for(let i=0;i<n;i++){S.thS.push(t);t+=R(3,5)}
  setTimeout(()=>toast('🌙 Toko tutup! Awas pencuri…'),800)}
function steal(h){
  S.th=S.th.filter(x=>x!==h);
  const pool=[];C.forEach(c=>{for(let i=0;i<S.stock[c.k];i++)pool.push(c.k)});
  const n=Math.min(pool.length,2+S.day);
  for(let i=0;i<n;i++){const j=Math.floor(Math.random()*pool.length);S.stock[pool[j]]--;pool.splice(j,1)}
  const loss=Math.floor(S.money*.1);S.money-=loss;S.st+=n;
  toast('🦹 Pencuri kabur bawa '+n+' kue & '+loss+'💰!')}
function endDay(){
  S.run=false;if(S.rep<=0)return over();
  ov('<h2>🌅 Hari '+S.day+' selesai</h2><p>Laba hari ini: <b>'+(S.money-S.m0>=0?'+':'')+(S.money-S.m0)+' 💰</b></p><p>Kue dicuri: '+S.st+'</p><p>Pesanan aktif: '+S.orders.filter(o=>!o.done).length+' 📋</p><p>Uang: '+S.money+' 💰 · Reputasi: '+S.rep+' ❤️</p><button class="b" data-a="next">Buka Hari '+(S.day+1)+'</button>')}
function over(){S.run=false;ov('<h2>💔 Toko Bangkrut</h2><p>Reputasi habis. Kamu bertahan sampai hari <b>'+S.day+'</b>.</p><button class="b" data-a="retry">Main Lagi</button>')}
function pause(){if(!S||!S.run)return;ov('<h2>⏸ Game Dijeda</h2><p>Waktu, pelanggan, dan pencuri berhenti.</p><button class="b" data-a="resume">▶ Lanjutkan</button>');S.paused=1}
function resume(){if(!S||!S.paused)return;S.paused=0;S.run=true;$('#ov').classList.remove('on')}
/* --- pre-order: dipesan 4 hari sebelum jadi --- */
function genOrder(ch){const k=C[Math.floor(R(0,C.length))],n=k.k==='tart'?Math.ceil(R(1,2.5)):Math.ceil(R(2,5)),total=Math.round(k.p*n*1.3);
  return{id:S.id++,k:k.k,n:n,ch:ch,who:NM[Math.floor(R(0,NM.length))],due:S.day+4,total:total,dp:Math.round(total/2),done:0}}
function openOrder(ch,c){const o=genOrder(ch),k=C.find(x=>x.k===o.k),e=k.e,on=ch==='on';PO={o:o,c:c};
  const L=on?[['t','📱 '+o.who+' (online)','Kak, aku mau pre-order '+o.n+' '+e+' '+k.n+', bisa?'],['m','🧁 Kamu','Bisa kak! Pesanan harus masuk 4 hari sebelum kue jadi ya, jadi siap hari ke-'+o.due+'.'],['t','📱 '+o.who,'Siap! Nanti kurir ojol yang ambil ya 🛵'],['m','🧁 Kamu','Total '+o.total+'💰, DP 50% = '+o.dp+'💰 ya kak.']]
  :[['t','🧑 '+o.who,'Halo! Aku mau pesan '+o.n+' '+e+' '+k.n+' untuk acara keluarga.'],['m','🧁 Kamu','Wah boleh! Kapan butuhnya?'],['t','🧑 '+o.who,'4 hari lagi ya, nanti aku ambil sendiri ke sini.'],['m','🧁 Kamu','Oke, siap hari ke-'+o.due+'. Total '+o.total+'💰, DP 50% = '+o.dp+'💰 sekarang.']];
  ov('<h2>'+(on?'📱 Pesanan Online':'📋 Pesanan Langsung')+'</h2><div class="chat">'+L.map((l,i)=>'<div class="ln '+l[0]+'" style="animation-delay:'+i*.7+'s"><small>'+l[1]+'</small>'+l[2]+'</div>').join('')+'</div><button class="b" data-a="acc">✅ Terima (+'+o.dp+'💰 DP)</button> <button class="b" data-a="rej" style="background:#999;box-shadow:0 4px 0 #666">❌ Tolak</button>')}
function decide(ok){if(!PO)return;const o=PO.o,c=PO.c;PO=null;
  if(c)S.cust=S.cust.filter(x=>x!==c);else S.inc=null;
  S.run=true;$('#ov').classList.remove('on');
  if(ok){S.money+=o.dp;S.orders.push(o);toast('👩‍🍳 "Siap, ditunggu hari ke-'+o.due+'!" DP +'+o.dp+'💰')}
  else toast('Pesanan ditolak')}
function tick(d){
  if(S.ph==='open'){
    S.t+=d;
    if(S.t>3&&!S.bsh){S.bsh=1;toast('🧎 Pengemis datang di depan toko! Beri dia kue')}
    S.sp-=d;
    if(S.sp<=0&&S.cust.length<4&&S.t<DUR-8){S.sp=Math.max(1.5,R(3,6)-S.day*.25);
      const used=S.cust.map(c=>c.s),s=[0,1,2,3].find(i=>!used.includes(i));
      S.cust.push({id:S.id++,s:s,k:C[Math.floor(R(0,Math.min(C.length,2+S.day)))].k,pat:1,ord:Math.random()<.3&&S.orders.filter(o=>!o.done).length<5&&!S.cust.some(c=>c.ord)?1:0})}
    const pk=S.pk.find(p=>p.at<=S.t);
    if(pk&&S.cust.length<4){S.pk.splice(S.pk.indexOf(pk),1);const u=S.cust.map(c=>c.s);
      S.cust.push({id:S.id++,s:[0,1,2,3].find(i=>!u.includes(i)),k:pk.o.k,pat:1,o:pk.o});
      toast(pk.o.ch==='on'?'🛵 Kurir datang ambil pesanan '+pk.o.who:'📦 '+pk.o.who+' datang ambil pesanan')}
    S.rt-=d;
    if(S.rt<=0){S.rt=R(14,22);if(!S.inc&&S.t<DUR-10&&S.orders.filter(o=>!o.done).length<5){S.inc=1;toast('📱 Ada pesan pre-order online!')}}
    S.cust.forEach(c=>c.pat-=d/(c.o?55:28));
    const lost=S.cust.filter(c=>c.pat<=0);
    if(lost.length){const n=lost.filter(c=>!c.o).length;S.rep-=.5*n;S.cust=S.cust.filter(c=>c.pat>0);toast(n?'😠 Pelanggan pergi (-'+.5*n+'❤️)':'😠 Pemesan menunggu terlalu lama, pesanan batal!')}
    if(S.t>=DUR)closeShop();
  }else{
    S.t+=d;
    while(S.thS.length&&S.thS[0]<=S.t){S.thS.shift();S.th.push({id:S.id++,p:0,hp:3,v:.12+S.day*.012,fl:0})}
    S.th.forEach(h=>{h.p+=h.v*d;h.fl=Math.max(0,h.fl-d)});
    S.th.filter(h=>h.p>=1).forEach(steal);
    if(!S.thS.length&&!S.th.length)endDay();
  }
  bake(d);if(S.run&&S.rep<=0)over()}
function act(u){
  if(!S||!S.run)return;
  const a=u.a;
  if(a==='door'){if(dOp&&pz>4.5&&pz<5.6){toast('Minggir dulu dari pintu 🚪');return}dOp=dOp?0:1;toast(dOp?'🚪 Pintu dibuka':'🚪 Pintu ditutup');return}
  if(a==='bake'){const c=C.find(x=>x.k===u.k);
    if(S.money<c.c)toast('Uang kurang 💸');else if(S.q.length>=4)toast('Antrean dapur penuh');
    else{S.money-=c.c;S.q.push(c);toast('👩‍🍳 Koki mulai '+c.e)}}
  else if(a==='up'){const uc=50*(S.lvl+1);
    if(S.lvl>=4)toast('Koki sudah secepat kilat ⚡');else if(S.money<uc)toast('Butuh '+uc+'💰');
    else{S.money-=uc;S.lvl++;toast('⚡ Koki makin cepat!')}}
  else if(a==='phone'){if(S.ph==='open'&&S.inc)openOrder('on',null);else toast('📱 Belum ada pesan baru')}
  else if(a==='cust'){
    const c=S.cust.find(x=>x.id===u.id);if(!c)return;
    const k=C.find(x=>x.k===c.k);
    if(c.ord){openOrder('off',c);return}
    const o=c.o;
    if(o){
      if(S.stock[o.k]<o.n){toast('Stok '+k.e+' kurang, butuh '+o.n);return}
      S.stock[o.k]-=o.n;const rest=o.total-o.dp,tip=c.pat>.5?5:0;S.money+=rest+tip;o.done=1;S.cust=S.cust.filter(x=>x!==c);kb=.4;
      toast((o.ch==='on'?'🛵 "Makasih kak, meluncur!" ':'🧑 "Kuenya cantik, makasih!" ')+'+'+(rest+tip)+'💰');return}
    if(S.stock[c.k]>0){S.stock[c.k]--;const tip=c.pat>.5?2:0;S.money+=k.p+tip;S.cust=S.cust.filter(x=>x!==c);kb=.4;toast('💵 +'+(k.p+tip)+(tip?' (tip!)':''))}
    else toast('Stok '+k.e+' habis! Suruh koki panggang')}
  else if(a==='beg'){
    if(S.ph!=='open'||S.bs!=='wait')return;
    const k=C.find(c=>S.stock[c.k]>0);
    if(!k){toast('Etalase kosong! Panggang kue dulu');return}
    S.stock[k.k]--;S.bs='fed';S.rep+=1;
    if(Math.random()<.4){const g=Math.floor(R(10,26));S.money+=g;toast('🙏 Didoakan: +1❤️ & bonus '+g+'💰')}
    else toast('🙏 Terima kasih! +1❤️')}
  else if(a==='thief'){
    const h=S.th.find(x=>x.id===u.id);if(!h)return;h.hp--;h.fl=.25;
    if(h.hp<=0){S.th=S.th.filter(x=>x!==h);S.money+=12;toast('🚔 Pencuri tertangkap! +12💰')}}}
function lab(u){
  if(!S||!S.run)return'';
  if(u.a==='door')return dOp?'Tutup pintu 🚪':'Buka pintu 🚪';
  if(u.a==='cust'){const c=S.cust.find(x=>x.id===u.id);if(!c)return'';const k=C.find(x=>x.k===c.k);
    if(c.ord)return'Terima pesanan pre-order 📋 (jadi 4 hari lagi)';
    if(c.o)return'Serahkan pesanan '+c.o.n+'× '+k.e+(c.o.ch==='on'?' ke kurir 🛵':'')+' (stok '+S.stock[c.k]+')';
    return'Layani pelanggan: '+k.e+' (stok '+S.stock[c.k]+')'}
  if(u.a==='bake'){const c=C.find(x=>x.k===u.k);return'Panggang '+c.e+' '+c.n+' (modal '+c.c+'💰)'}
  if(u.a==='beg')return'Beri kue ke pengemis 🙏';
  if(u.a==='phone')return S.inc?'📱 Baca pesanan online (masuk!)':'📱 Telepon (belum ada pesan)';
  if(u.a==='thief')return'TANGKAP PENCURI! 🦹';
  if(u.a==='up')return S.lvl>=4?'Koki sudah maksimal':'Koki lebih cepat ('+50*(S.lvl+1)+'💰)';return''}

/* ===== Entitas 3D ===== */
const vc=new Map(),vt=new Map();
function s3(m,list,mk,up){
  const ids=new Set(list.map(o=>o.id));
  m.forEach((g,id)=>{if(!ids.has(id)){sc.remove(g);hit.splice(hit.indexOf(g),1);m.delete(id)}});
  list.forEach(o=>{let g=m.get(o.id);if(!g){g=mk(o);g.userData.id=o.id;sc.add(g);hit.push(g);m.set(o.id,g)}up(g,o)})}
function mkCust(o){const g=person(CL[o.id%CL.length]),k=C.find(x=>x.k===o.k);
  const b=spr(o.o?(o.o.ch==='on'?'🛵':'📦'):o.ord?'📋':k.e,.6);b.position.y=2.05;g.add(b);
  const bar=new THREE.Sprite(new THREE.SpriteMaterial({color:0x35b97a}));bar.scale.set(.8,.08,1);bar.position.y=1.78;g.add(bar);
  g.position.set(-4.4+o.s*1.2,0,2.5);g.rotation.y=Math.PI;
  const bar=g.userData.bar;bar.scale.x=.8*Math.max(.02,o.pat);
  bar.material.color.set(o.pat>.5?0x35b97a:o.pat>.25?0xf4b400:0xe53935)}
function mkTh(){const g=person(0x222222,0x111111);g.userData={a:'thief',hp:-1,sp:null};return g}

function upTh(g,o){
  g.position.set(1.2+(-2.6-1.2)*o.p,0,6.5+(2.3-6.5)*o.p);
  g.rotation.y=Math.PI+(o.fl>0?Math.sin(performance.now()/30)*.3:0)}

/* ===== Kontrol pemain ===== */
const K={},B=[[-5.2,.8,.75,1.65],[.8,6.4,-3.7,-2.7]],TS=('ontouch' in window)||navigator.maxTouchPoints>0;
let yaw=Math.PI,pitch=0,px=-1,pz=-.5,mdown=0;
cam.rotation.order='YXZ';
function blocked(x,z){if(z>5.45)return x<-12||x>12||z>14;if(z>4.6)return !(dOp&&dAm>.5&&Math.abs(x)<1);if(x<-6.6||x>6.6||z<-4.6)return true;return B.some(b=>x>b[0]-.3&&x<b[1]+.3&&z>b[2]-.3&&z<b[3]+.3)}
function look(dx,dy){yaw-=dx;pitch=cl(pitch-dy,-1.2,1.2)}
function pick(nx,ny){const rc=new THREE.Raycaster();rc.setFromCamera({x:nx,y:ny},cam);rc.far=7;
  const r=rc.intersectObjects(hit.filter(g=>g.visible),true);
  for(const i of r){let o=i.object;while(o&&!hit.includes(o))o=o.parent;if(o&&o.userData&&o.userData.a)return o.userData}return null}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();K[k]=1;
  if(k==='e'){const u=pick(0,0);if(u)act(u)}
  if(k==='p'||k==='escape')pause()});
addEventListener('keyup',e=>K[e.key.toLowerCase()]=0);
cv.addEventListener('mousedown',()=>{mdown=1;if(!TS&&!document.pointerLockElement&&S&&S.run&&cv.requestPointerLock)cv.requestPointerLock();
  else{const u=pick(0,0);if(u)act(u)}});
addEventListener('mouseup',()=>mdown=0);
addEventListener('mousemove',e=>{if(document.pointerLockElement===cv||mdown)look(e.movementX*.003,e.movementY*.003)});
const TT={};
cv.addEventListener('touchstart',e=>{for(const t of e.changedTouches)TT[t.identifier]={x0:t.clientX,y0:t.clientY,x:t.clientX,y:t.clientY,t0:performance.now(),L:t.clientX<innerWidth/2}},{passive:false});
cv.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){const o=TT[t.identifier];if(!o)continue;
  if(!o.L)look((t.clientX-o.x)*.005,(t.clientY-o.y)*.005);o.x=t.clientX;o.y=t.clientY}},{passive:false});
cv.addEventListener('touchend',e=>{for(const t of e.changedTouches){const o=TT[t.identifier];delete TT[t.identifier];if(!o)continue;
  if(Math.hypot(t.clientX-o.x0,t.clientY-o.y0)<12&&performance.now()-o.t0<350){const u=pick(t.clientX/innerWidth*2-1,-(t.clientY/innerHeight)*2+1);if(u)act(u)}}});

/* ===== Tombol overlay & HUD ===== */
function hud(){
  $('#hDay').textContent='📅 Hari '+S.day;$('#hMoney').textContent='💰 '+S.money;$('#hRep').textContent='❤️ '+S.rep;
  $('#hPh').textContent=S.ph==='open'?'☀️ Buka':'🌙 Tutup';
  $('#tBar').style.width=(S.ph==='open'?S.t/DUR*100:100)+'%';
  $('#stockT').textContent='Stok: '+C.map(c=>c.e+S.stock[c.k]).join(' ');
  const st=S.cur?Math.min(2,Math.floor(S.prog*3)):-1;
  $('#ovenT').textContent=S.cur?'👩‍🍳 '+SN[st]+' · antre '+S.q.length:'👩‍🍳 Koki menganggur · antre '+S.q.length;
  $('#ordT').textContent=S.orders.filter(o=>!o.done).map(o=>{const k=C.find(x=>x.k===o.k);return'📋 '+o.n+k.e+' h'+o.due}).join(' · ')}
function fx(){
  const st=S.cur?Math.min(2,Math.floor(S.prog*3)):-1;
  wk.visible=pb.visible=pbg.visible=!!S.cur;
  if(S.cur){wk.material.map=SG[st];wk.position.set(2.6,2.7,-4.1);pb.scale.x=1.4*Math.max(.02,S.prog);pb.position.x=2.9+.7*Math.max(.02,S.prog)}
  stm.forEach((s,i)=>{s.visible=st===1;if(st===1){const t=performance.now()/600+i*.7;s.position.set(3.1+i*.4,1.4+(t%1)*.8,-4.5)}});
  C.forEach(c=>stockSp[c.k].visible=S.stock[c.k]>0)}

/* ===== Loop utama ===== */
let last=performance.now();
function loop(now){requestAnimationFrame(loop);
  const d=Math.min(.05,(now-last)/1000);last=now;
  if(S){
    if(S.run){tick(d);
      let mx=0,mz=0;
      if(K.w||K.arrowup)mz-=1;if(K.s||K.arrowdown)mz+=1;if(K.a||K.arrowleft)mx-=1;if(K.d||K.arrowright)mx+=1;
      for(const id in TT){const o=TT[id];if(o.L){mx+=cl((o.x-o.x0)/60,-1,1);mz+=cl((o.y-o.y0)/60,-1,1)}}
      const sp=3*d,fx_=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);
      const nx=px+(fx_*-mz+rx*mx)*sp,nz=pz+(fz*-mz+rz*mx)*sp;
      if(!blocked(nx,pz))px=nx;if(!blocked(px,nz))pz=nz}
    s3(vc,S.cust,mkCust,upCust);s3(vt,S.th,mkTh,upTh);
    beg.visible=S.ph==='open'&&!!S.bsh&&S.bs==='wait';
    sc.background.lerp(S.ph==='open'?DAY:NIGHT,.05);
    hud();fx();
    const u=S.run?pick(0,0):null,p=$('#prompt'),t=u?lab(u):'';
    p.style.display=t?'block':'none';p.textContent=t}
  kb=Math.max(0,kb-d);
  dAm+=(dOp-dAm)*Math.min(1,d*6);lfL.rotation.y=-dAm*1.55;lfR.rotation.y=dAm*1.55;
  cam.position.set(px,1.6-kb*.3,pz);cam.rotation.set(pitch,yaw,0);
  ren.render(sc,cam)}
requestAnimationFrame(loop);
