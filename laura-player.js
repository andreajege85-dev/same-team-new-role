/* One audio element plays the three original exchanges. No synthesized audio or guessed timing. */
let lauraSession=null;
function finishBuilderReview(){
 if(routeFor(state.page)?.id!=='builder-reward'||!builderReady())return;
 main.querySelector('#builder-audio')?.pause();
 builderState().reviewedSignature=builderSignature();save();updateLauraReviewControls();
 const panel=main.querySelector('#builder-personal-feedback');if(panel){panel.tabIndex=-1;panel.focus({preventScroll:true});}
}
function updateLauraReviewControls(){
 const reviewed=builderReviewed();for(const id of ['builder-personal-feedback','builder-model-section']){const el=main.querySelector('#'+id);if(el)el.hidden=!reviewed;}
 const button=main.querySelector('#builder-continue');if(button)button.disabled=!reviewed;
}
function syncBuilderCaptions(){if(lauraSession?.valid())lauraSession.sync();}
function bindBuilderAudio(){
 lauraSession=null;
 if(routeFor(state.page)?.id!=='builder-reward'||!builderReady())return;
 const player=main.querySelector('#builder-audio'),revision=interactionRevision,signature=builderSignature(),sequence=selectedLauraExchanges();
 const session={index:0,cues:[],activeTurn:null,finished:false,failed:false,request:0,valid:()=>revision===interactionRevision&&routeFor(state.page)?.id==='builder-reward'&&builderSignature()===signature};
 lauraSession=session;
 const status=message=>{if(session.valid()){const el=main.querySelector('#builder-media-status');if(el)el.textContent=message;}};
 const panel=main.querySelector('#builder-transcript-panel'),follow=main.querySelector('#builder-autofollow');
 const followActive=()=>{if(!session.valid()||builderState().autoFollow===false||session.activeTurn===null||!panel)return;const row=main.querySelector('#builder-turn-'+session.activeTurn);if(!row)return;const box=panel.getBoundingClientRect(),item=row.getBoundingClientRect();if(item.top<box.top+8||item.bottom>box.bottom-8){const top=Math.max(0,panel.scrollTop+item.top-box.top-12);panel.scrollTo({top,behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}};
 const setFollow=enabled=>{if(!session.valid())return;builderState().autoFollow=enabled;if(follow)follow.checked=enabled;save();const note=main.querySelector('#builder-follow-status');if(note)note.textContent=enabled?'Automatic scrolling on.':'Automatic scrolling off. Read at your own pace.';if(enabled)followActive();};
 follow?.addEventListener('change',()=>setFollow(follow.checked));
 const manual=()=>{if(builderState().autoFollow!==false){panel?.scrollTo({top:panel.scrollTop,behavior:'instant'});setFollow(false);}};
 for(const event of ['wheel','touchstart','pointerdown'])panel?.addEventListener(event,manual,{passive:true});
 panel?.addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))manual();});
 session.followActive=followActive;
 const paint=()=>{
  if(!session.valid())return;const index=session.index,cue=session.cues.find(c=>player&&player.currentTime>=c.start&&player.currentTime<c.end);
  const match=cue?.id.match(/^turn-(\d+)/),turn=match?Number(match[1])-1:null;
  const previous=session.activeTurn;if(turn!==null)session.activeTurn=index*2+turn;
  if(previous!==session.activeTurn){main.querySelectorAll('[data-builder-turn]').forEach(el=>{const on=Number(el.dataset.builderTurn)===session.activeTurn;el.classList.toggle('active-turn',on);if(on)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current');});followActive();}
  const button=main.querySelector('#builder-play');if(button)button.textContent=player&&!player.paused?'Pause Conversation':session.finished?'Play Again':'Play Conversation';
  const progress=main.querySelector('#builder-clip-status'),progressText='Exchange '+(index+1)+' of 3 · Decision '+(index+1)+String.fromCharCode(65+builderState().answers[index])+(session.finished?' · Conversation complete':'');if(progress&&progress.textContent!==progressText)progress.textContent=progressText;
 };
 session.sync=paint;
 session.load=async(index,play)=>{
  if(!session.valid()||!player)return;const request=++session.request;session.index=index;session.cues=[];session.failed=false;session.finished=false;
  player.pause();const exchange=sequence[index];
  if(!exchange.media.audio){session.failed=true;status('This exchange recording is unavailable. Read the selected transcript and choose View Feedback to continue.');paint();return;}
  player.src=exchange.media.audio;player.load();paint();
  status(exchange.media.captions?'English captions available.':'Verified timed captions are not yet available for this recording. The complete speaker-labeled transcript is below.');
  if(exchange.media.captions)loadCaptions(exchange.media.captions).then(cues=>{if(session.valid()&&request===session.request){session.cues=cues;paint();}}).catch(()=>{if(session.valid()&&request===session.request)status('Timed captions could not load. Read the complete transcript below.');});
  if(play)try{await player.play();}catch(error){if(error?.name==='AbortError')return;if(session.valid()&&request===session.request)status('Playback paused. Press Play to continue this exchange, or read the transcript and view feedback.');}
 };
 session.play=async(replay)=>{
  if(!session.valid()||!player)return;if(replay||session.finished){await session.load(0,true);return;}
  if(!player.paused){player.pause();paint();return;}
  if(session.failed){await session.load(session.index,true);return;}
  try{await player.play();paint();}catch(error){if(error?.name!=='AbortError')status('Use the audio Play control, or read the selected transcript and view feedback.');}
 };
 if(player){
  for(const event of ['timeupdate','seeked','play','pause'])player.addEventListener(event,paint);
  player.addEventListener('ended',()=>{if(!session.valid()||session.failed)return;if(session.index<2)session.load(session.index+1,true);else{session.finished=true;builderState().reviewedSignature=signature;save();updateLauraReviewControls();status('Your conversation is complete. Explore your personalized feedback, revise a choice, or continue.');paint();}});
  player.addEventListener('error',()=>{if(session.valid()){session.failed=true;player.pause();status('This exchange recording could not load. The complete transcript remains available; choose Read Conversation & View Feedback to continue.');paint();}});
  session.load(0,false);
 }
 bindLauraModelAudio(revision);updateLauraReviewControls();
}
async function playBuilder(replay){if(lauraSession?.valid())await lauraSession.play(replay);}
function bindLauraModelAudio(revision){
 const player=main.querySelector('#builder-model-audio'),cfg=CONFIG.builder?.model;if(!player||!cfg)return;
 let cues=[];const valid=()=>revision===interactionRevision&&routeFor(state.page)?.id==='builder-reward';
 const sync=()=>{if(!valid())return;const cue=cues.find(c=>player.currentTime>=c.start&&player.currentTime<c.end),match=cue?.id.match(/^turn-(\d+)/),turn=match?Number(match[1])-1:null;
 main.querySelectorAll('[data-model-turn]').forEach(el=>{const on=turn!==null&&Number(el.dataset.modelTurn)===turn;el.classList.toggle('active-turn',on);if(on)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current');});
 const caption=main.querySelector('#builder-model-caption');if(caption){caption.textContent=cue?.text||'';caption.hidden=!cue;}};
 for(const event of ['timeupdate','seeked'])player.addEventListener(event,sync);
 player.addEventListener('error',()=>{if(valid())main.querySelector('#builder-model-status').textContent='Model audio could not load. Its full transcript is below; this example is optional.';});
 const details=main.querySelector('#builder-model');details?.addEventListener('toggle',()=>{if(!details.open)player.pause();});
 if(cfg.captions)loadCaptions(cfg.captions).then(data=>{if(valid()){cues=data;sync();}}).catch(()=>{if(valid())main.querySelector('#builder-model-status').textContent='Model timed captions unavailable. Its complete transcript is below.';});
 else main.querySelector('#builder-model-status').textContent='The full transcript is below. Timed captions await verification against this recording.';
}
