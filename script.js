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
// lantai, jalan, dinding
box(14,.1,10,0,-.05,0,0xf6dfc0);box(26,.1,12,0,-.06,11,0x9aa3ad);
[[14,3.4,.2,0,1.7,-5],[.2,3.4,10,-7,1.7,0],[.2,3.4,10,7,1.7,0],[5.8,3.4,.2,-4.1,1.7,5],[5.8,3.4,.2,4.1,1.7,5],[2.4,.9,.2,0,2.95,5]].forEach(a=>box(a[0],a[1],a[2],a[3],a[4],a[5],0xffd6e4));
const sign=spr('🧁',1.4);sign.position.set(0,3.8,5.2);sc.add(sign);
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
  g.userData={a:'cust',bar:bar};return g}
function upCust(g,o){
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
function blocked(x,z){if(x<-6.6||x>6.6||z<-4.6||z>4.6)return true;return B.some(b=>x>b[0]-.3&&x<b[1]+.3&&z>b[2]-.3&&z<b[3]+.3)}
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
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
  if(a==='start'||a==='retry')init();
  else if(a==='next'){S.day++;startDay()}
  else if(a==='pause')pause();
  else if(a==='resume')resume();
  else if(a==='acc')decide(true);
  else if(a==='rej')decide(false)});
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
  cam.position.set(px,1.6-kb*.3,pz);cam.rotation.set(pitch,yaw,0);
  ren.render(sc,cam)}
requestAnimationFrame(loop);
