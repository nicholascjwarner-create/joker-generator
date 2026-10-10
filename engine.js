// ===== Joker engine: seeded traits -> pixel grid =====
function RNG(seed){let s=Math.imul((seed>>>0)^0x9e3779b9,2654435761)>>>0;s^=s>>>15;s=Math.imul(s,0x85ebca6b)>>>0;s^=s>>>13;s=s||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296;};}
function hashStr(t){let h=2166136261;for(const c of t){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function shade(hex,a){let n=parseInt(hex.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return'#'+((1<<24)|(f(r)<<16)|(f(g)<<8)|f(b)).toString(16).slice(1);}
const PALETTES=[
 {name:"Neon Nights",bg:["#14002e","#2b0057"],c:["#ff2bd6","#00e5ff","#ffe600"],gold:"#ffe600",card:"#fff4fb"},
 {name:"Pac Maze",bg:["#000000","#0b0b5c"],c:["#ffe600","#2121de","#ff1744"],gold:"#ffb000",card:"#ffffff"},
 {name:"Sunset Run",bg:["#2b0030","#ff2b5e"],c:["#ff8a00","#7c4dff","#ffe600"],gold:"#ffd23f",card:"#fff1d6"},
 {name:"CRT Green",bg:["#001a08","#003311"],c:["#00ff66","#b6ffb0","#ff00aa"],gold:"#b6ffb0",card:"#e9ffe9"},
 {name:"Ice Blaster",bg:["#00081a","#002b66"],c:["#00e5ff","#ffffff","#ff2bd6"],gold:"#7df9ff",card:"#f0fbff"},
 {name:"Lava Zone",bg:["#120000","#4a0000"],c:["#ff4d00","#ffe600","#00e5ff"],gold:"#ffb000",card:"#fff3e0"},
 {name:"Vapor Wave",bg:["#1b0f3a","#3a1c71"],c:["#ff71ce","#01cdfe","#05ffa1"],gold:"#fffb96",card:"#fdf0ff"},
 {name:"Game Boy",bg:["#9bbc0f","#8bac0f"],c:["#306230","#0f380f","#8bac0f"],gold:"#306230",card:"#cadc9f"},
 {name:"Fruit Machine",bg:["#3d0000","#7a0000"],c:["#ff1744","#ffe600","#00c853"],gold:"#ffd700",card:"#fffbe6"},
 {name:"Cosmic Coin",bg:["#000010","#1a0040"],c:["#d500f9","#ffd600","#00e676"],gold:"#ffd600",card:"#f6eaff"}];
const SKINS=["#ffe0bd","#f1c27d","#c68642","#8d5524","#ffffff","#b6f2c7","#bfe6ff","#ffd1f0"];
const TRAITS={
 palette:PALETTES.map(p=>p.name),pose:["Bust","Half body","Juggling","Holding card","Holding cherries","Holding dice"],
 face:["Round","Oval","Long","Square","Heart"],skin:["Peach","Tan","Brown","Deep","Clown white","Alien green","Ghost blue","Bubblegum"],
 eyes:["Dots","Wide","Wink","X eyes","Stars","Hearts","Sleepy","Shades"],brows:["None","Arched","Wicked","Worried"],
 mouth:["Grin","Big laugh","Smirk","Tongue out","Toothy","Oh!","Painted smile"],nose:["Red ball","Button","Pointy","None"],
 makeup:["None","Eye diamonds","Teardrop","Cheek star","Rosy cheeks","Harlequin half","Eye stripes"],
 hat:["Two points","Three points","Four floppy","Crown","Hood","Top hat","Pom-pom cap"],bells:["Gold bells","Pom-poms","No bells"],
 collar:["Ruff","Zigzag","Bow tie","Pointed","None"],costume:["Diamonds","Halves","Stripes","Polka dots","Checks"],
 background:["Diagonal stripes","Checkerboard","Diamonds","Sunburst","Starfield","Synthwave grid","Dots","Plain"],
 frame:["Classic card","Neon","Gold ornate","Arcade cabinet","Ticket","Double line"],corner:["J + star","J + heart","J + diamond","JOKER vertical","Coin","Crown"],
 layout:["Double-ended","Full figure"],seam:["Horizontal","Diagonal"],hair:["Ginger","Black","Blonde","Purple","Bald"]};
const TRAIT_KEYS=Object.keys(TRAITS);
function rollTrait(seed,k){if(k==='layout')return RNG(seed^hashStr(k))()<.75?0:1;return Math.floor(RNG(seed^hashStr(k))()*TRAITS[k].length);}
function newJoker(seed,locked={},prev=null,settings={chaos:.3,symmetry:.8}){const t={};TRAIT_KEYS.forEach(k=>t[k]=(locked[k]&&prev)?prev.traits[k]:rollTrait(seed,k));return{seed,traits:t,chaos:settings.chaos,symmetry:settings.symmetry};}
const MINI={J:"011 001 001 101 010",O:"010 101 101 101 010",K:"101 101 110 101 101",E:"111 100 110 100 111",R:"110 101 110 101 101",
 star:"00100 11111 01110 01010 10001",heart:"01010 11111 11111 01110 00100",diamond:"00100 01110 11111 01110 00100",coin:"01110 11011 11011 11011 01110",crown:"10101 11111 11111 00000 11111"};

function renderJoker(J,res,anim={}){
 const HD=res==='hd',S=HD?3:res===16?2:1,W=32*S,H=48*S,t=J.traits,DE=t.layout===0,P=PALETTES[t.palette],R=RNG(J.seed*2654435761+7),ch=J.chaos,sym=J.symmetry;
 const jit=a=>(R()-.5)*2*a*ch,asym=()=>R()>sym;
 const pose=t.pose,bust=pose===0,fs=DE?(bust?.98:.9):(bust?1.3:1),cy=DE?(bust?15.2:14.6):(bust?25:20.5),cxo=DE&&t.seam===1?-3.2:0;let mat='flat';
 const ops=[],add=(fig,test,col)=>ops.push({fig,test,col,mat});
 const L=(x,y)=>[(x-16-cxo)/fs,(y-cy)/fs];
 const F=(test,col,fig=true)=>add(fig,(x,y)=>{const[a,b]=L(x,y);return test(a,b);},typeof col==='function'?(x,y)=>{const[a,b]=L(x,y);return col(a,b);}:col);
 const ell=(cx,cy,rx,ry)=>(x,y)=>((x-cx)/rx)**2+((y-cy)/ry)**2<=1;
 const rect=(x0,y0,x1,y1)=>(x,y)=>x>=x0&&x<x1&&y>=y0&&y<y1;
 const seg=(x0,y0,x1,y1,r)=>(x,y)=>{const dx=x1-x0,dy=y1-y0,l=dx*dx+dy*dy||1;let u=((x-x0)*dx+(y-y0)*dy)/l;u=Math.max(0,Math.min(1,u));return(x-x0-u*dx)**2+(y-y0-u*dy)**2<=r*r;};
 const poly=pts=>(x,y)=>{let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const[xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c;}return c;};
 const mir=f=>(x,y)=>f(x,y)||f(-x,y);
 const [c0,c1,c2]=P.c,dark="#140818",skin=SKINS[t.skin];
 // ---- background (base coords)
 const bgA=P.bg[0],bgB=P.bg[1];
 const bgFn=[(x,y)=>((x+y)>>2)%2?bgA:bgB,(x,y)=>((x>>2)+(y>>2))%2?bgA:bgB,(x,y)=>(Math.abs((x%8)-4)+Math.abs((y%8)-4))<3?bgB:bgA,
  (x,y)=>{const a=Math.atan2(y-20,x-16);return Math.floor((a+Math.PI)/(Math.PI/8))%2?bgA:bgB;},
  null,(x,y)=>{if(y<30){const d=Math.hypot(x-16,y-30);return d<11&&!(y>22&&Math.floor(y)%3===0)?(y<25?c2:c0):bgA;}return(Math.floor(x-16)%(Math.max(1,Math.floor((y-28)/2)))===0||Math.floor(y)%3===0)?c0:bgB;},
  (x,y)=>(Math.floor(x)%4===1&&Math.floor(y)%4===1)?bgB:bgA,(x,y)=>y<24?bgA:bgB][t.background];
 const stars=[];if(t.background===4)for(let i=0;i<40;i++)stars.push([Math.floor(R()*32),Math.floor(R()*48),R()<.3?c2:"#ffffff"]);
 add(false,()=>true,(x,y)=>bgFn?bgFn(x,y):(stars.some(s=>s[0]===Math.floor(x)&&s[1]===Math.floor(y))?stars.find(s=>s[0]===Math.floor(x)&&s[1]===Math.floor(y))[2]:bgA));
 // ---- body / arms
 mat='cloth';
 const cst=t.costume,cosCol=(x,y)=>[(((Math.floor((x+y)/3)+Math.floor((x-y)/3))%2+2)%2)?c0:c1,x<0?c0:c1,(Math.floor(x/2.5)%2+2)%2?c0:c1,((Math.round(x)%4+4)%4===0&&(Math.round(y)%4+4)%4===0)?c2:c0,((Math.floor(x/3)+Math.floor(y/3))%2+2)%2?c0:c1][cst];
 const armSide=(side,hx,hy)=>{mat='cloth';F(seg(side*7.5,10,hx,hy+2,2.3),(x,y)=>cosCol(x,y));F(ell(hx+side*.2,hy+1.9,2.2,1.1),'#ffffff');mat='skin';F(ell(hx,hy,1.7,1.7),t.skin===4?"#ffffff":skin);F(rect(hx-1.6,hy-.5,hx+1.6,hy-.1),shade(skin,-.25));mat='cloth';};
 const hands={1:[[-6,19],[6,19]],2:[[-10,2],[10,2]],3:[[-6,19],[9.5,4]],4:[[-9.5,4],[6,19]],5:[[-6,19],[9.5,4]]}[pose];
 F(poly([[-8,8],[8,8],[14,40],[-14,40]]),cosCol);
 F(seg(0,10,0,30,.8),c2);mat='metal';[13,17,21,25].forEach(y=>F(ell(0,y,1.1,1.1),P.gold));mat='cloth';
 if(hands)hands.forEach(([hx,hy],i)=>armSide(i?1:-1,hx,hy));
 // ---- hood (behind face)
 if(t.hat===4){F(ell(0,-1,8.6,9.6),c0);F(poly([[-6,-7],[6,-7],[3,-16],[0,-17]]),c1);F(ell(0,-1,6.8,8),dark);}
 // ---- neck + face
 const fsh0rx=()=>[6,5.2,4.6,5.4,6][t.face];
 mat='skin';F(rect(-2,4,2,9),shade(skin,-.18));
 const hairC=["#c2410c","#1b1b2f","#f5c542","#7c3aed",null][t.hair];
 if(t.hat!==4){F(mir(ell(fsh0rx()+.1,.6,1.2,1.8)),skin);F(mir(ell(fsh0rx()+.1,.8,.5,.9)),shade(skin,-.3));}
 const fsh=[ell(0,0,6,6.5),ell(0,0,5.2,7),ell(0,.6,4.6,7.6),(x,y)=>Math.abs(x)<=5.4&&Math.abs(y)<=6.4&&!(Math.abs(x)>4.4&&Math.abs(y)>5.4),
  (x,y)=>ell(0,-1,6,5.6)(x,y)||poly([[-5.6,0],[5.6,0],[0,7.5]])(x,y)][t.face];
 mat='skin';const harl=t.makeup===5,hside=asym()?1:-1;
 F(fsh,(x,y)=>{let c=skin;if(harl&&x*hside>0)c=shade(c0,.55);return c;});
 if(hairC&&t.hat!==4){mat='cloth';F(mir((x,y)=>ell(5.2,-3,1.9,2.6)(x,y)&&!ell(3.4,-1.4,1.8,2.2)(x,y)),hairC);F(mir(ell(5.8,-.8,1,1.6)),hairC);}
 mat='flat';
 // ---- makeup
 const ex=2.6+jit(.4),ey=-.6+jit(.3);
 if(t.makeup===1){const d=(x,y)=>Math.abs(x-ex)/1.4+Math.abs(y-ey)/3.2<=1;const one=asym();F((x,y)=>d(x,y)||(!one&&d(-x,y)),c0);}
 if(t.makeup===2)F(seg(-ex,2.2,-ex,3.4,.55),"#2979ff");
 if(t.makeup===3){const st=MINI.star.split(' ');F((x,y)=>{const a=Math.floor(x-2.5),b=Math.floor(y-1);return a>=0&&a<5&&b>=0&&b<5&&st[b][a]==='1';},c2);}
 if(t.makeup===4)F(mir(ell(4,2.6,1.3,1)),"#ff6fa5");
 if(t.makeup===6)F(mir(rect(ex-.5,-4,ex+.5,3)),c1);
 // ---- eyes
 const blink=anim.blink,ev=blink&&t.eyes!==7?-1:t.eyes,E=(f,c)=>F(mir(f),c),Eone=(f,c,side)=>F((x,y)=>f(side*x,y),c);
 if(ev===-1)E(rect(ex-1,ey,ex+1,ey+.9),dark);
 if(ev===0&&!HD)E(rect(ex-.5,ey-1,ex+.6,ey+.9),dark);
 if(ev===0&&HD){E(ell(ex,ey,1.45,1.05),"#fdf6ff");E(ell(ex+.15,ey+.05,.8,.95),c1);E(ell(ex+.2,ey+.1,.42,.5),dark);E(rect(ex-.5,ey-.55,ex-.15,ey-.2),"#ffffff");E(rect(ex-1.5,ey-1.15,ex+1.5,ey-.75),dark);}
 if(ev===1){E(ell(ex,ey,1.5,1.6),"#ffffff");E(rect(ex-.4,ey-.6,ex+.7,ey+.9),dark);}
 if(ev===2){Eone(rect(ex-.5,ey-1,ex+.6,ey+.9),dark,1);Eone((x,y)=>seg(ex-1.2,ey+.4,ex+1.2,ey-.2,.45)(x,y),dark,-1);}
 if(ev===3)E((x,y)=>seg(ex-1,ey-1,ex+1,ey+1,.4)(x,y)||seg(ex-1,ey+1,ex+1,ey-1,.4)(x,y),dark);
 if(ev===4)E((x,y)=>Math.abs(x-ex)+Math.abs(y-ey)*1.6<1.4||rect(ex-.5,ey-1.8,ex+.5,ey+1.8)(x,y)||rect(ex-1.8,ey-.4,ex+1.8,ey+.5)(x,y),c2);
 if(ev===5)E((x,y)=>ell(ex-.6,ey-.4,.8,.8)(x,y)||ell(ex+.6,ey-.4,.8,.8)(x,y)||poly([[ex-1.4,ey-.2],[ex+1.4,ey-.2],[ex,ey+1.6]])(x,y),"#ff1744");
 if(ev===6){E(ell(ex,ey+.3,1.3,1),"#ffffff");E(rect(ex-1.4,ey-1,ex+1.4,ey+.3),shade(skin,-.25));E(rect(ex-.3,ey+.3,ex+.6,ey+1.1),dark);}
 if(ev===7){F(rect(-ex-1.9,ey-1.1,ex+1.9,ey+1.3),dark);E(rect(ex-1,ey-.6,ex,ey+.1),c1);}
 // brows
 const by=ey-2.4;if(t.brows===1)E((x,y)=>seg(ex-1.4,by+.5,ex,by-.3,.4)(x,y)||seg(ex,by-.3,ex+1.4,by+.5,.4)(x,y),dark);
 if(t.brows===2)E(seg(ex-1.6,by-.6,ex+1.2,by+.7,.45),dark);if(t.brows===3)E(seg(ex-1.4,by+.6,ex+1.2,by-.5,.4),dark);
 // nose
 if(t.nose===0){F(ell(0,1.9,1.35,1.25),"#ff1744");F(rect(-.6,1.2,0,1.7),"#ffb3c1");}
 if(t.nose===1)F(rect(-.5,1.5,.6,2.5),shade(skin,-.3));if(t.nose===2)F(poly([[-.6,.5],[.6,.5],[2.6,2.6],[-.4,2.6]]),shade(skin,-.2));
 // mouth
 const my=4.3+jit(.3),m=t.mouth,lip=t.skin===4?"#ff1744":dark;
 if(m===0)F((x,y)=>seg(-3,my-1.1,-1.5,my,.45)(x,y)||seg(-1.5,my,1.5,my,.45)(x,y)||seg(1.5,my,3,my-1.1,.45)(x,y),lip);
 if(m===1){F((x,y)=>ell(0,my-.4,2.8,1.9)(x,y)&&y>my-.9,dark);F(ell(0,my+.9,1.4,.7),"#ff4d6d");F(rect(-2.2,my-.9,2.2,my-.3),"#ffffff");}
 if(m===2)F((x,y)=>seg(-2,my,1.5,my,.45)(x,y)||seg(1.5,my,3,my-1.3,.45)(x,y),lip);
 if(m===3){F(seg(-2.4,my,2.4,my,.45),lip);F(ell(.6,my+1.2,.9,1.1),"#ff4d6d");}
 if(m===4){F(rect(-2.6,my-.9,2.6,my+.9),dark);F(rect(-2,my-.5,2,my+.4),"#ffffff");F((x,y)=>rect(-2,my-.5,2,my+.4)(x,y)&&Math.abs(Math.round(x))%2===1&&Math.abs(x-Math.round(x))<.3,dark);}
 if(m===5)F(ell(0,my,1.2,1.3),dark);
 if(m===6){F((x,y)=>ell(0,my-1.3,4,2.3)(x,y)&&!ell(0,my-2.4,3.4,2)(x,y),"#ff1744");F((x,y)=>seg(-3,my-1.1,3,my-1.1,.3)(x,y)&&ell(0,my-1.3,4,2.3)(x,y)&&!ell(0,my-2.4,3.4,2)(x,y),dark);}
 // ---- collar
 mat='cloth';const co=t.collar;
 if(co===0)F(ell(0,8.2,9,2.6),(x,y)=>{const a=Math.atan2(y-8.2,x);return Math.floor((a+Math.PI)/(Math.PI/7))%2?"#ffffff":c2;});
 if(co===1)for(let i=-4;i<4;i++)F(poly([[i*2.2,6.8],[(i+1)*2.2,6.8],[(i+.5)*2.2,11]]),i%2?c2:"#ffffff");
 if(co===2){F(mir(poly([[0,7.7],[4,5.8],[4,10],])),c0);F(ell(0,7.9,1.2,1.2),c2);}
 if(co===3){F(rect(-7,6.5,7,8.5),c1);[[-12,12],[-5,13.5],[5,13.5],[12,12]].forEach(([tx,ty],i)=>F(poly([[(i-2)*3.5,7],[(i-1)*3.5,7],[tx,ty]]),i%2?c0:c2));}
 // ---- hats
 mat='cloth';const tips=[],bellsOn=t.bells!==2,hc=i=>(i%2?c1:c0);
 const pointHat=(list)=>list.forEach(([b0,b1,tx,ty],i)=>{tx+=jit(1.2);ty+=jit(1.2);const mx=(b0+b1)/2+(tx-(b0+b1)/2)*.4,mY=Math.min(ty,-6)-3;
  const col=asym()&&i===list.length-1?c2:hc(i);F(poly([[b0,-4.6],[mx-1,mY],[tx,ty],[mx+1,mY+1],[b1,-4.6]]),col);tips.push([tx,ty]);});
 if(t.hat===0)pointHat([[-6.4,0,-11,-1],[0,6.4,11,-1]]);
 if(t.hat===1)pointHat([[-6.4,-1.5,-10.5,-6],[-2.2,2.2,0,-15.5],[1.5,6.4,10.5,-6]]);
 if(t.hat===2)pointHat([[-6.4,-2,-12,1],[-3,0,-5,-15],[0,3,5,-15],[2,6.4,12,1]]);
 if(t.hat<=2)F(rect(-6.6,-6.2,6.6,-4),(x,y)=>(Math.floor(x+20)+Math.floor(y+20))%2?c2:"#ffffff");
 if(t.hat===3){mat='metal';F(rect(-6,-8.5,6,-4.5),P.gold);F((x,y)=>y<-8.4&&y>-13&&[-6,-3,0,3,6].some(px=>Math.abs(x-px)*2.2<y+13.5),P.gold);[-3.2,0,3.2].forEach((gx,i)=>F(ell(gx,-6.5,.9,.9),[c0,c1,c0][i]));tips.push(...[-6,0,6].map(x=>[x,-13.5]));}
 if(t.hat===4)tips.push([0,-17]);
 if(t.hat===5){F(rect(-8.5,-6.6,8.5,-4.6),dark);F(rect(-5,-16,5,-6.4),dark);F(rect(-5,-9,5,-7),c0);F(rect(-3.6,-15,-2.6,-10),"#555555");}
 if(t.hat===6){F((x,y)=>ell(0,-4.6,6.8,5)(x,y)&&y<-4,(x,y)=>Math.floor(x/2.2+10)%2?c0:c1);F(rect(-6.8,-5.2,6.8,-3.8),"#ffffff");tips.push([0,-10.4]);}
 mat='metal';const jy=anim.jingle?-.8:0;
 if(t.hat!==5&&t.hat!==3)tips.forEach(([x,y],i)=>{if(!bellsOn)return;const dy=i%2?jy:-jy;
  if(t.bells===0){F(ell(x,y+dy,1.5,1.5),P.gold);F(rect(x-.6,y+dy-.9,x,y+dy-.3),"#ffffff");F(rect(x-.3,y+dy+.6,x+.3,y+dy+1.4),dark);}
  else F(ell(x,y+dy,1.6,1.6),i%2?"#ffffff":c2);});
 if(t.hat===3)tips.forEach(([x,y])=>F(ell(x,y,.8,.8),"#ffffff"));
 // ---- props
 mat='metal';
 if(pose===2){[[-12,-3],[12,-4],[9,-12]].forEach(([x,y],i)=>{x+=jit(1);F(ell(x,y,1.6,1.6),[c2,c0,c1][i]);F(rect(x-.9,y-.9,x-.2,y-.2),"#ffffff");});F(mir(seg(-11.5,-7,-10.8,-10,.3)),"#ffffff");}
 mat='flat';if(pose===3){F(rect(7.2,-3.5,12.8,3.6),"#ffffff");F((x,y)=>!rect(7.8,-2.9,12.2,3)(x,y)&&rect(7.2,-3.5,12.8,3.6)(x,y),dark);const h=MINI.heart.split(' ');F((x,y)=>{const a=Math.floor(x-7.5),b=Math.floor(y+2.4);return a>=0&&a<5&&b>=0&&b<5&&h[b][a]==='1';},"#ff1744");F(ell(9.5,4,1.7,1.7),skin);}
 if(pose===4){F(seg(-9.5,2.2,-8,-3.4,.35),"#00a83a");F(seg(-6.7,2.6,-8,-3.4,.35),"#00a83a");F(ell(-7,-3.6,1.3,.7),"#2ee84a");F(ell(-10,2.6,1.6,1.6),"#ff1744");F(ell(-6.6,3,1.6,1.6),"#d50032");F(rect(-10.6,1.8,-10,2.4),"#ffffff");}
 if(pose===5){F(rect(7.4,-.6,11.8,3.8),"#ffffff");F((x,y)=>!rect(7.9,-.1,11.3,3.3)(x,y)&&rect(7.4,-.6,11.8,3.8)(x,y),dark);[[8.6,.6],[10.6,2.6],[9.6,1.6]].forEach(([x,y])=>F(rect(x-.4,y-.4,x+.5,y+.5),"#ff1744"));F(ell(9.5,4.6,1.7,1.4),skin);}
 // ---- rasterize
 const N=W*H,base=new Array(N),flatTop=new Uint8Array(N),px=new Array(N),fig=new Uint8Array(N),oid=new Int16Array(N).fill(-1);
 for(let j=0;j<H;j++)for(let i=0;i<W;i++){const x=(i+.5)/S,y=(j+.5)/S;let c=null,f=0,id=-1,bc=null,top=-1;for(let n=0;n<ops.length;n++){const o=ops[n];if(o.test(x,y)){c=typeof o.col==='function'?o.col(x,y):o.col;f=o.fig?1:0;top=n;if(o.mat!=='flat'||!o.fig){id=n;bc=c;}}}const k=j*W+i;px[k]=c;fig[k]=f;oid[k]=id;base[k]=bc;flatTop[k]=top!==id?1:0;}
 if(res!==8){shadePass(W,H,S,base,fig,oid,ops,P,t);for(let k=0;k<N;k++)if(!flatTop[k])px[k]=base[k];}
 for(let k=0;k<N;k++){if(fig[k])continue;const i=k%W,j=(k/W)|0;const nb=[i>0&&k-1,i<W-1&&k+1,j>0&&k-W,j<H-1&&k+W].filter(v=>v!==false&&fig[v]);if(nb.length)px[k]=res===8?dark:mixHex(rampOf(px[nb[0]])[0],dark,.55);}
 // ---- double-ended composite (court card): bottom = top rotated 180 degrees
 if(DE){const src=px.slice(),diag=t.seam===1;for(let j=0;j<H;j++)for(let i=0;i<W;i++){const top=diag?(i/W+j/H<1):(j<H/2);if(!top)px[j*W+i]=src[(H-1-j)*W+(W-1-i)];}
  const u0=Math.max(1,S===3?2:S);for(let j=0;j<H;j++)for(let i=0;i<W;i++){const d=diag?Math.abs((i+.5)/W+(j+.5)/H-1)*H:Math.abs(j+.5-H/2);if(d<u0*.75)px[j*W+i]=P.gold;else if(d<u0*1.5)px[j*W+i]=dark;}}
 // ---- frame & corners in u-units
 const u=S===3?2:S,CW=W/u,CH=H/u;
 const put=(x,y,c)=>{for(let a=0;a<u;a++)for(let b=0;b<u;b++){const X=x*u+a,Y=y*u+b;if(X>=0&&X<W&&Y>=0&&Y<H)px[Y*W+X]=c;}};
 const fr=t.frame,edge=(x,y)=>Math.min(x,y,CW-1-x,CH-1-y);
 for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const e=edge(x,y),corner=(x<2||x>CW-3)&&(y<2||y>CH-3);
  if(fr===0){if(e===0)put(x,y,corner?null:dark);else if(e<=2)put(x,y,corner&&e===1&&(x===1||x===CW-2)&&(y===1||y===CH-2)?dark:P.card);else if(e===3)put(x,y,dark);}
  if(fr===1){if(e===0)put(x,y,dark);else if(e===1)put(x,y,c0);else if(e===2)put(x,y,dark);else if(e===3)put(x,y,c1);}
  if(fr===2){if(e===0)put(x,y,dark);else if(e<=2)put(x,y,(x+y)%2?P.gold:shade(P.gold,-.3));else if(e===3)put(x,y,dark);}
  if(fr===3){if(e===0)put(x,y,dark);else if(e<=1||(y<8&&y>0))put(x,y,y<8&&e>1?(y===7?dark:shade(c1,-.4)):c0);}
  if(fr===4){const sc=(x===0||x===CW-1)?(y%4===2):(y===0||y===CH-1)?(x%4===2):false;if(e===0)put(x,y,sc?null:P.card);else if(e===1)put(x,y,P.card);else if(e===2)put(x,y,c0);}
  if(fr===5){if(e===0||e===3)put(x,y,dark);else if(e===1)put(x,y,c1);else if(e===2)put(x,y,c2);}}
 if(fr===2)[[1,1],[CW-2,1],[1,CH-2],[CW-2,CH-2]].forEach(([x,y])=>put(x,y,"#ffffff"));
 const glyph=(g,ox,oy,c,flip)=>{const rows=MINI[g].split(' ');rows.forEach((r,y)=>[...r].forEach((v,x)=>{if(v==='1')put(flip?ox+r.length-1-x:ox+x,flip?oy+rows.length-1-y:oy+y,c);}));};
 const box=(x0,y0,w,h,c)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)put(x,y,c);};
 if(fr===3){["J","O","K","E","R"].forEach((g,i)=>glyph(g,Math.round(CW/2)-10+i*4,2,anim.blink?"#ffffff":c2));for(let x=2;x<CW-2;x+=3)put(x,1,(x+(anim.tick||0))%2?"#ffffff":c2);}
 const ink=fr===1||fr===3?c2:(t.palette===7?"#0f380f":c0),inset=fr===3?9:4,csym=["star","heart","diamond",null,"coin","crown"][t.corner];
 const symCol=t.corner===1?"#ff1744":(t.corner>=4?P.gold:ink);
 // index plate behind corner marks so they read over the art (classic court-card index)
 const plate=fr===1||fr===3?"#0a0018":P.card,ph=t.corner===3?Math.min(31,CH-inset-6):(t.corner<=2?12:6);
 if(res!==8){box(3,inset-1,5,ph+1,plate);box(CW-8,CH-inset-ph,5,ph+1,plate);}
 if(t.corner===3){["J","O","K","E","R"].forEach((g,i)=>{if(i*6+5<=ph)glyph(g,4,inset+i*6,ink);if(i*6+5<=ph)glyph(g,CW-7,CH-inset-5-i*6,ink,true);});}
 else{if(t.corner<=2)glyph("J",4,inset,ink);glyph(csym,t.corner<=2?3:3,t.corner<=2?inset+6:inset,symCol);
  if(t.corner<=2)glyph("J",CW-7,CH-inset-5,ink,true);glyph(csym,CW-8,t.corner<=2?CH-inset-11:CH-inset-5,symCol,true);}
 return{W,H,px};}

function mixHex(a,b,t){const p=h=>{const n=parseInt(h.slice(1,7),16);return[n>>16,(n>>8)&255,n&255];};const A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
const _ramps={};
function rampOf(c){if(!c||c[0]!=='#')return[c,c,c,c,c];c=c.slice(0,7);return _ramps[c]||(_ramps[c]=[mixHex(shade(c,-.62),'#1e0838',.4),mixHex(shade(c,-.34),'#4a1670',.25),c,mixHex(shade(c,.32),'#fff1b0',.25),mixHex(shade(c,.66),'#fffbe8',.35)]);}
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
// Light from top-left; height field from distance-to-region-edge; dithered 5-tone ramps
function shadePass(W,H,S,px,fig,oid,ops,P,t){
 const N=W*H,d=new Float32Array(N);for(let k=0;k<N;k++){const i=k%W,j=(k/W)|0,o=oid[k];d[k]=(i===0||j===0||i===W-1||j===H-1||oid[k-1]!==o||oid[k+1]!==o||oid[k-W]!==o||oid[k+W]!==o)?1:99;}
 for(let j=1;j<H;j++)for(let i=1;i<W;i++){const k=j*W+i;d[k]=Math.min(d[k],d[k-1]+1,d[k-W]+1,d[k-W-1]+1.4,(i<W-1?d[k-W+1]+1.4:99));}
 for(let j=H-2;j>=0;j--)for(let i=W-2;i>=0;i--){const k=j*W+i;d[k]=Math.min(d[k],d[k+1]+1,d[k+W]+1,d[k+W+1]+1.4,(i>0?d[k+W-1]+1.4:99));}
 const R=2.6*S,h=k=>Math.sqrt(Math.min(d[k],R)/R),Lx=-.7,Ly=-.75,rim=mixHex(P.c[1],'#ffffff',.45),out=px.slice();
 for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){const k=j*W+i;if(!fig[k])continue;if(oid[k]<0)continue;const o=ops[oid[k]],m=o.mat;if(m==='flat')continue;
  const gx=(h(k+1)-h(k-1))*R/2,gy=(h(k+W)-h(k-W))*R/2;let lum=.62+.42*(-(gx*Lx+gy*Ly))/Math.max(1,Math.hypot(gx,gy)*.9+.1)*Math.min(1,Math.hypot(gx,gy)*1.5)+(.5-j/H)*.1;
  if(m==='cloth'){const ph=oid[k]*1.7;lum+=.11*Math.sin(i/S*.75+Math.sin(j/S*.22+ph)*1.2+ph)*Math.min(1,d[k]/(1.5*S));}
  if(m==='metal'){lum=.5+(lum-.5)*1.7;}
  if(m==='skin')lum=.55+(lum-.55)*.85;
  // ambient occlusion: something drawn in front just above/left casts a soft shadow
  let ao=0;for(const[dx,dy]of[[0,-1],[-1,-1],[0,-2],[1,-1],[-1,0]]){const kk=(j+dy*Math.ceil(S/2))*W+i+dx*Math.ceil(S/2);if(kk>=0&&fig[kk]&&oid[kk]>oid[k]&&ops[oid[kk]].mat!=='flat'){ao++;}}
  lum-=Math.min(.32,ao*.09);
  let idx=Math.floor(lum*5+(BAYER[(j&3)*4+(i&3)]/16-.5)*(m==='skin'?.25:.5));
  if(m==='metal'&&lum>.9)idx=5;idx=Math.max(0,Math.min(5,idx));
  const ramp=rampOf(px[k]);let c=idx===5?'#ffffff':ramp[idx];
  // rim light on the shadow side silhouette
  if(!fig[k+1]||!fig[k+W+1]){if(i/W>.45)c=mixHex(ramp[3],rim,.55);}
  out[k]=c;}
 for(let k=0;k<N;k++)px[k]=out[k];}
function drawJoker(canvas,J,res,scale,anim,crt){const {W,H,px}=renderJoker(J,res,anim);canvas.width=W*scale;canvas.height=H*scale;const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);
 for(let i=0;i<px.length;i++){const v=px[i];if(!v||v==='transparent')continue;c.fillStyle=v;c.fillRect((i%W)*scale,Math.floor(i/W)*scale,scale,scale);}
 if(crt&&scale>=3){c.fillStyle='rgba(0,0,0,.28)';const st=Math.max(2,Math.round(scale/2));for(let y=0;y<canvas.height;y+=st*2)c.fillRect(0,y,canvas.width,st);
  const g=c.createRadialGradient(canvas.width/2,canvas.height/2,canvas.height*.3,canvas.width/2,canvas.height/2,canvas.height*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.35)');c.globalCompositeOperation='source-atop';c.fillStyle=g;c.fillRect(0,0,canvas.width,canvas.height);c.globalCompositeOperation='source-over';}
 return canvas;}
if(typeof module!=='undefined')module.exports={renderJoker,newJoker,TRAITS,TRAIT_KEYS,PALETTES};
