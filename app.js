const $=id=>document.getElementById(id);
const S={res:16,crt:true,anim:true,chaos:.3,symmetry:.8},locks={};let J,hist=[],hi=-1,tick=0;
let favs=[];try{favs=JSON.parse(localStorage.getItem('jokerFavs')||'[]');}catch(e){}
const randSeed=()=>1+Math.floor(Math.random()*999999);
const code=j=>[j.seed,TRAIT_KEYS.map(k=>j.traits[k].toString(36)).join(''),Math.round(j.chaos*100),Math.round(j.symmetry*100)].join('-');
function fromCode(s){const[a,b,c,d]=s.trim().split('-');if(!b||b.length!==TRAIT_KEYS.length)throw 0;const t={};TRAIT_KEYS.forEach((k,i)=>t[k]=Math.min(TRAITS[k].length-1,parseInt(b[i],36)));return{seed:+a,traits:t,chaos:(+c||0)/100,symmetry:(+d||0)/100};}
function push(j){hist=hist.slice(0,hi+1);hist.push(j);if(hist.length>40)hist.shift();hi=hist.length-1;show(j);}
function show(j){J=j;tick=0;draw();syncUI();renderStrips();const c=$('card');c.classList.add('pop');setTimeout(()=>c.classList.remove('pop'),150);}
function draw(){const sc=S.res===8?12:6,a=S.anim?{blink:tick%32>=30,jingle:Math.floor(tick/3)%2===1&&tick%32<12,tick:Math.floor(tick/2)}:{};drawJoker($('card'),J,S.res,sc,a,S.crt);}
function next(){push(newJoker(randSeed(),locks,J,S));}
function syncUI(){$('seed').value=J.seed;$('code').value=code(J);$('chaos').value=S.chaos;$('symmetry').value=S.symmetry;$('crt').checked=S.crt;$('anim').checked=S.anim;
 document.querySelectorAll('#resSeg button').forEach(b=>b.classList.toggle('on',+b.dataset.v===S.res));
 TRAIT_KEYS.forEach(k=>{$('sel-'+k).value=J.traits[k];$('lock-'+k).classList.toggle('locked',!!locks[k]);$('lock-'+k).textContent=locks[k]?'🔒':'🔓';});
 const isFav=favs.some(f=>code(f)===code(J));$('favBtn').textContent=isFav?'★ SAVED':'☆ FAVOURITE';
 const p=S.res===8?48:24;$('sizeNote').textContent=`4× = ${32*(S.res/8)*4}×${48*(S.res/8)*4}px · 8× = ${32*(S.res/8)*8}×${48*(S.res/8)*8}px · Print = ${32*(S.res/8)*p}×${48*(S.res/8)*p}px (about 6.4×9.7cm at 600dpi)`;}
const pretty=k=>k[0].toUpperCase()+k.slice(1);
function buildTraits(){const box=$('traits');TRAIT_KEYS.forEach(k=>{const d=document.createElement('div');d.className='trait';
 d.innerHTML=`<span>${pretty(k)}</span><select id="sel-${k}">${TRAITS[k].map((n,i)=>`<option value="${i}">${n}</option>`).join('')}</select><button id="lock-${k}" title="Lock">🔓</button><button id="roll-${k}" title="Reroll this trait">🎲</button>`;box.appendChild(d);
 d.querySelector('select').onchange=e=>{const j=structuredClone(J);j.traits[k]=+e.target.value;push(j);};
 d.querySelector('#lock-'+k).onclick=()=>{locks[k]=!locks[k];syncUI();};
 d.querySelector('#roll-'+k).onclick=()=>{const j=structuredClone(J);let v;do{v=Math.floor(Math.random()*TRAITS[k].length);}while(v===j.traits[k]&&TRAITS[k].length>1);j.traits[k]=v;push(j);};});}
function thumb(j,onClick,onRemove,cur){const w=document.createElement('div');w.className='thumb'+(cur?' cur':'');const c=drawJoker(document.createElement('canvas'),j,8,2,{},false);c.onclick=onClick;w.appendChild(c);
 if(onRemove){const x=document.createElement('button');x.className='x';x.textContent='✕';x.onclick=onRemove;w.appendChild(x);}return w;}
function renderStrips(){const h=$('history');h.innerHTML='';hist.map((j,i)=>[j,i]).reverse().forEach(([j,i])=>h.appendChild(thumb(j,()=>{hi=i;show(j);},null,i===hi)));
 const f=$('favs');f.innerHTML='';if(!favs.length)f.innerHTML='<p class="note">No favourites yet - press ☆ FAVOURITE.</p>';
 favs.forEach((j,i)=>f.appendChild(thumb(j,()=>push(structuredClone(j)),()=>{favs.splice(i,1);saveFavs();renderStrips();syncUI();})));}
function saveFavs(){try{localStorage.setItem('jokerFavs',JSON.stringify(favs));}catch(e){alert('Could not save favourites in this browser.');}}
function download(canvas,name){canvas.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},3000);},'image/png');}
function sheet(list,name){const sc=S.res===8?8:4,cw=32*(S.res/8)*sc,ch=48*(S.res/8)*sc,gap=sc*4,cols=3,rows=Math.ceil(list.length/cols);
 const c=document.createElement('canvas');c.width=cols*cw+(cols+1)*gap;c.height=rows*ch+(rows+1)*gap;const x=c.getContext('2d');x.fillStyle='#0a0018';x.fillRect(0,0,c.width,c.height);
 list.forEach((j,i)=>x.drawImage(drawJoker(document.createElement('canvas'),j,S.res,sc,{},S.crt),gap+(i%cols)*(cw+gap),gap+Math.floor(i/cols)*(ch+gap)));download(c,name);}
// wiring
$('newBtn').onclick=next;$('nextBtn').onclick=()=>{if(hi<hist.length-1){hi++;show(hist[hi]);}else next();};
$('prevBtn').onclick=()=>{if(hi>0){hi--;show(hist[hi]);}};
$('favBtn').onclick=()=>{const c=code(J),i=favs.findIndex(f=>code(f)===c);if(i>=0)favs.splice(i,1);else favs.unshift(structuredClone(J));saveFavs();syncUI();renderStrips();};
document.querySelectorAll('#resSeg button').forEach(b=>b.onclick=()=>{S.res=+b.dataset.v;draw();syncUI();});
$('crt').onchange=e=>{S.crt=e.target.checked;draw();};$('anim').onchange=e=>{S.anim=e.target.checked;tick=0;draw();};
['chaos','symmetry'].forEach(k=>$(k).oninput=e=>{S[k]=+e.target.value;J={...J,[k]:S[k]};draw();$('code').value=code(J);});
['chaos','symmetry'].forEach(k=>$(k).onchange=()=>push(structuredClone(J)));
$('seedGo').onclick=()=>{const s=parseInt($('seed').value);if(s>0)push(newJoker(s,{},null,S));};
$('codeGo').onclick=()=>{try{const j=fromCode($('code').value);S.chaos=j.chaos;S.symmetry=j.symmetry;push(j);}catch(e){alert("That card code doesn't look right.");}};
$('lockAll').onclick=()=>{TRAIT_KEYS.forEach(k=>locks[k]=true);syncUI();};$('unlockAll').onclick=()=>{TRAIT_KEYS.forEach(k=>locks[k]=false);syncUI();};
document.querySelectorAll('.exp').forEach(b=>b.onclick=()=>{const x=b.dataset.x,sc=x==='print'?(S.res===8?48:24):+x/(S.res===8?1:2)*(S.res===8?1:1);
 const scale=x==='print'?sc:(S.res===8?+x:+x);download(drawJoker(document.createElement('canvas'),J,S.res,scale,{},S.crt),`joker-${J.seed}-${x==='print'?'print':x+'x'}.png`);});
$('sheetBtn').onclick=()=>{const l=[J];for(let i=0;i<8;i++)l.push(newJoker(randSeed(),locks,J,S));sheet(l,`joker-sheet-${J.seed}.png`);};
$('favSheetBtn').onclick=()=>{if(!favs.length)return alert('Save some favourites first!');sheet(favs.slice(0,9),'joker-favourites.png');};
// tap & swipe
let sx=null,sy=null;const cab=$('cabinet');
cab.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
cab.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;
 if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){dx<0?$('nextBtn').click():$('prevBtn').click();}else if(Math.abs(dx)<10&&Math.abs(dy)<10)next();e.preventDefault();});
cab.addEventListener('click',e=>{if(!('ontouchstart' in window))next();});
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;if(e.key===' '||e.key==='ArrowRight'){e.preventDefault();$('nextBtn').click();}if(e.key==='ArrowLeft')$('prevBtn').click();});
setInterval(()=>{if(S.anim&&J){tick++;draw();}},140);
buildTraits();const u=new URLSearchParams(location.search).get('seed');push(newJoker(u?+u:randSeed(),{},null,S));
