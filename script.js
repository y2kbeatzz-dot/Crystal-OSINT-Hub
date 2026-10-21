'use strict';
const tracks=[
'Juice Wrld - floating v1.2 (margate159) (1).mp3',
'Juice Wrld - lets ride v1.2 (shoot DW).mp3',
'Glo Limit - Strives.mp3',
'juice - outta time.mp3',
'Juice Wrld - 256 NLMb what i claim (1).mp3'
];
const $=id=>document.getElementById(id),audio=$('audio'),play=$('play'),seek=$('seek'),playlist=$('playlist');
let index=0,shuffle=false,repeat=false,userSeeking=false;
const escapeHTML=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const filenameToUrl=name=>'music/'+encodeURIComponent(name);
function setTrack(i,autoPlay=false){index=(i+tracks.length)%tracks.length;audio.src=filenameToUrl(tracks[index]);audio.load();$('currentTitle').textContent=tracks[index];$('trackCount').textContent=`Track ${index+1} / ${tracks.length} • MP3`;$('currentTime').textContent='0:00';$('duration').textContent='0:00';seek.value=0;renderPlaylist();try{localStorage.setItem('crystal-track',String(index))}catch(e){}if(autoPlay)audio.play().catch(()=>updatePlayback())}
function renderPlaylist(){playlist.innerHTML=tracks.map((name,i)=>`<button type="button" data-i="${i}" class="${index===i?'active':''}"><span class="number">${String(i+1).padStart(2,'0')}.</span>${escapeHTML(name)} ${index===i?'♫':''}</button>`).join('')}
function formatTime(t){if(!Number.isFinite(t))return '0:00';return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0')}
function updatePlayback(){const playing=!audio.paused;play.textContent=playing?'Ⅱ PAUSE':'▶ PLAY';$('disc').classList.toggle('playing',playing);$('playerState').textContent=playing?'PLAYING ♫':'STOPPED'}
function advance(step=1){if(shuffle&&tracks.length>1){let next;do{next=Math.floor(Math.random()*tracks.length)}while(next===index);setTrack(next,true)}else{setTrack(index+step,true)}}
play.onclick=()=>{if(audio.paused)audio.play().catch(e=>{alert('Unable to play: '+e.message);updatePlayback()});else audio.pause()};$('next').onclick=()=>advance();$('prev').onclick=()=>{if(audio.currentTime>3)audio.currentTime=0;else advance(-1)};
$('shuffle').onclick=()=>{shuffle=!shuffle;$('shuffle').classList.toggle('on',shuffle);$('shuffle').setAttribute('aria-pressed',String(shuffle))};$('repeat').onclick=()=>{repeat=!repeat;$('repeat').classList.toggle('on',repeat);$('repeat').setAttribute('aria-pressed',String(repeat))};
audio.addEventListener('play',updatePlayback);audio.addEventListener('pause',updatePlayback);audio.addEventListener('ended',()=>{if(repeat){audio.currentTime=0;audio.play().catch(()=>{})}else advance()});audio.addEventListener('loadedmetadata',()=>{$('duration').textContent=formatTime(audio.duration)});audio.addEventListener('timeupdate',()=>{if(!userSeeking){seek.value=Number.isFinite(audio.duration)&&audio.duration?Math.round(audio.currentTime/audio.duration*100):0;$('currentTime').textContent=formatTime(audio.currentTime)}});audio.addEventListener('error',()=>{$('playerState').textContent='FILE NOT FOUND — extract all files';updatePlayback()});
seek.addEventListener('pointerdown',()=>userSeeking=true);seek.addEventListener('pointerup',()=>userSeeking=false);seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration)){audio.currentTime=audio.duration*Number(seek.value)/100;$('currentTime').textContent=formatTime(audio.currentTime)}});
let vol=.65;try{const v=localStorage.getItem('crystal-volume');if(v!==null)vol=Math.min(1,Math.max(0,Number(v)||0))}catch(e){}audio.volume=vol;$('volume').value=Math.round(vol*100);$('volumeLabel').textContent=Math.round(vol*100)+'%';$('volume').oninput=e=>{audio.volume=Number(e.target.value)/100;$('volumeLabel').textContent=e.target.value+'%';try{localStorage.setItem('crystal-volume',audio.volume)}catch(e){}};
playlist.addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(b)setTrack(Number(b.dataset.i),true)});
let savedIndex=0;try{savedIndex=Number(localStorage.getItem('crystal-track')||0)}catch(e){}setTrack(Number.isInteger(savedIndex)&&savedIndex>=0&&savedIndex<tracks.length?savedIndex:0);
let count=1;try{count=Number(sessionStorage.getItem('crystal-visits')||0)+1;sessionStorage.setItem('crystal-visits',count)}catch(e){}$('counter').textContent=String(count).padStart(6,'0');
const stars=$('stars');let enabled=true;try{enabled=localStorage.getItem('crystal-fx')!=='off'}catch(e){}function applyFx(){document.body.classList.toggle('fx-off',!enabled);$('effectsToggle').textContent='FX: '+(enabled?'ON':'OFF');$('effectsToggle').setAttribute('aria-pressed',String(enabled))}applyFx();$('effectsToggle').onclick=()=>{enabled=!enabled;applyFx();try{localStorage.setItem('crystal-fx',enabled?'on':'off')}catch(e){}};
for(let i=0;i<24;i++){const s=document.createElement('span');s.className='star'+(i%9===0?' cross':'');const size=i%9===0?5:1+i%4;s.style.cssText=`left:${(i*73.79)%100}%;top:${(i*41.27)%100}%;width:${size}px;height:${size}px;animation-delay:-${(i%13)*.29}s;--twinkle:${1.1+(i%7)*.39}s`;stars.appendChild(s)}


// Highly decorative old-web effects, with preferences and bounded cursor particles.
$('topVisitor').textContent=$('counter').textContent;
const confetti=$('pixelConfetti');
for(let i=0;i<0;i++){
  const particle=document.createElement('span');particle.className='confetti';
  particle.textContent=['✧','✦','♡','✳','+','⋆','✿'][i%7];
  particle.style.cssText=`left:${(i*43.17)%100}%;color:${['#ffa5fd','#72f9ff','#f6ff99','#fb72d1'][i%4]};--falltime:${9+i%13}s;--delay:-${i*.53}s;--sway:${(i%2?1:-1)*(30+i*4)}px;font-size:${9+i%12}px`;
  confetti.appendChild(particle)
}
const palettes=['ultraviolet','cyberpink','acidcyan','limewire','sunset','iceblue'];
const paletteNames=['ULTRAVIOLET','CYBERPINK','ACID CYAN','LIMEWIRE','SUNSET','ICE BLUE'];
let palette=0;try{const val=Number(localStorage.getItem('crystal-palette'));if(Number.isInteger(val)&&val>=0&&val<palettes.length)palette=val}catch(e){}
function updatePalette(){document.body.dataset.theme=palettes[palette];document.body.classList.remove('palette-candy','palette-cyber');$('colorToggle').textContent='COLOR: '+paletteNames[palette];$('colorToggle').title='Click to change theme — '+(palette+1)+' / '+palettes.length}
updatePalette();$('colorToggle').onclick=()=>{palette=(palette+1)%palettes.length;updatePalette();try{localStorage.setItem('crystal-palette',palette)}catch(e){}};
function savedPreference(key,fallback,valid){try{const v=localStorage.getItem(key);return valid.includes(v)?v:fallback}catch(e){return fallback}}
const fontPicker=$('fontChoice'),sizePicker=$('textSize');
fontPicker.value=savedPreference('crystal-font','verdana',['verdana','trebuchet','tahoma','georgia','mono','comic']);
sizePicker.value=savedPreference('crystal-size','normal',['normal','large','xl']);
function applyTypography(){document.body.dataset.font=fontPicker.value;document.body.dataset.size=sizePicker.value;try{localStorage.setItem('crystal-font',fontPicker.value);localStorage.setItem('crystal-size',sizePicker.value)}catch(e){}}
fontPicker.addEventListener('change',applyTypography);sizePicker.addEventListener('change',applyTypography);applyTypography();
let trailOn=savedPreference('crystal-sparkles','off',['on','off'])==='on';
const sparkleOverlay=document.createElement('div');sparkleOverlay.className='sparkle-spray';sparkleOverlay.setAttribute('aria-hidden','true');document.body.appendChild(sparkleOverlay);
for(let i=0;i<7;i++){const el=document.createElement('i');el.textContent=['✧','✦','✳','✩','✧','✶','✦'][i];el.style.cssText=`left:${5+(i*17.93)%90}%;top:${10+(i*27.13)%80}%;animation-delay:-${i*.47}s`;sparkleOverlay.appendChild(el)}
function updateTrail(){document.body.classList.toggle('sparkles-off',!trailOn);sparkleOverlay.hidden=!trailOn;$('trailToggle').textContent='SPARKLES: '+(trailOn?'ON':'OFF');$('trailToggle').setAttribute('aria-pressed',String(trailOn))}updateTrail();
$('trailToggle').onclick=()=>{trailOn=!trailOn;updateTrail();try{localStorage.setItem('crystal-sparkles',trailOn?'on':'off')}catch(e){}};
const guestForm=$('guestbookForm'),guestEntries=$('guestEntries');let notes=[];
try{const saved=JSON.parse(localStorage.getItem('crystal-guestbook')||'[]');if(Array.isArray(saved))notes=saved.slice(-12).filter(n=>typeof n.name==='string'&&typeof n.message==='string')}catch(e){}
function renderNotes(){guestEntries.replaceChildren();notes.slice().reverse().forEach(n=>{
  const entry=document.createElement('div');entry.className='guest-entry';const who=document.createElement('b');who.textContent=n.name;const when=document.createElement('span');when.textContent=n.time||'';const message=document.createElement('div');message.textContent=n.message;entry.append(who,when,message);guestEntries.append(entry)
})}
renderNotes();guestForm.onsubmit=e=>{e.preventDefault();const name=$('guestName').value.trim(),message=$('guestMessage').value.trim();if(!name||!message)return;notes.push({name:name.slice(0,30),message:message.slice(0,160),time:new Date().toLocaleDateString()});notes=notes.slice(-12);try{localStorage.setItem('crystal-guestbook',JSON.stringify(notes))}catch(e){}guestForm.reset();renderNotes()};
