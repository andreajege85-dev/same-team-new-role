/* Original instructional text: content.js. Approved revised scenario: scenario-content.js. */
const CONFIG = { introVideo: '', introRevision: '', greetingVideo: '', introCaptions: '', greetingCaptions: '', plannerUrl: '', surveyUrl: '', ...window.COURSE_MEDIA };
const P=window.APPROVED_SCRIPT;
const clean=s=>s.replace(/^"|"$/g,'');
const t=i=>clean(P[i]);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const para=i=>`<p>${esc(t(i))}</p>`;
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>para(a+i)).join('');
const KEY='same-team-course-v3';
let state={page:0,unlocked:0,intro:false,decision:0,selection:null,history:[],reflection:'',complete:false,prep:[],recap:[]};
try{const previous=localStorage.getItem(KEY)?null:JSON.parse(localStorage.getItem('same-team-course-v2')||localStorage.getItem('same-team-course-v1'));if(previous){state.introWatchedVersion=previous.introWatchedVersion;state.intro=previous.intro;state.reflection=previous.reflection||'';}const s=JSON.parse(localStorage.getItem(KEY));if(s&&Number.isInteger(s.page)&&s.page>=0&&s.page<=13)state={...state,...s};}catch{}
// Require a full 20-card round after upgrading the old 10-card activity.
if(state.sortVersion!==2){state.sortVersion=2;state.sortRound=null;state.sortPending=null;state.sortPassed=false;state.sortBest=0;state.complete=false;state.unlocked=Math.min(state.unlocked,2);if(state.page!==0&&state.page!==1)state.page=8;}
// Upgrade to submitted ten-card rounds; preserve established conversation progress.
if(state.sortGateVersion!==4){state.sortGateVersion=4;state.sortRound=null;state.sortPending=null;if(!state.scenarioStarted&&!state.scenarioFinished&&!state.complete)state.sortPassed=false;}
// Clear the old selected dialogue when upgrading; keep the learner's decision and course progress.
if(state.scenarioRevision!=='2026-11-14'){state.scenarioRevision='2026-11-14';state.selection=null;state.feedbackShown=false;state.history=[];}
// A placeholder viewed in an earlier version does not count as viewing this video.
const introVersion = CONFIG.introVideo + '|' + CONFIG.introRevision;
function introRequired(){return !!CONFIG.introVideo && state.introWatchedVersion !== introVersion && state.introSkippedVersion !== introVersion;}
let introFailed=false;
if(introRequired()){state.intro=false;state.page=0;}
migrateLearningState();retirePreviewState();
const decisions=window.REVISED_SCENARIO;
const main=document.querySelector('main');
let interactionRevision=0;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{document.querySelector('.save-note').textContent='Self-paced · Browser storage unavailable';}}
function btn(label,action,secondary=false){return `<button class="${secondary?'secondary':'primary'}" data-action="${action}">${esc(label)}${secondary?'':' <span aria-hidden="true">→</span>'}</button>`;}
function completionSurvey(){
 if(!CONFIG.surveyUrl)return '';
 const embed=new URL(CONFIG.surveyUrl);embed.searchParams.set('embedded','true');
 return '<section class="completion-survey" aria-labelledby="survey-heading"><div class="eyebrow">COURSE FEEDBACK</div><h2 id="survey-heading">Share your feedback</h2><p>Tell us how the training worked for you. Your training is already complete; submitting this survey is optional.</p><p class="notice">Responses are submitted through Google Forms.</p><p><a class="secondary" href="'+esc(CONFIG.surveyUrl)+'" target="_blank" rel="noopener noreferrer">Open survey in a new tab <span aria-hidden="true">↗</span></a></p><iframe class="survey-frame" src="'+esc(embed.href)+'" title="Same Team, New Role course feedback survey" loading="lazy" referrerpolicy="strict-origin-when-cross-origin">Open the survey using the link above.</iframe></section>';
}
function sectionHeader(label,time){return `<div class="section-top"><span>${label}</span><span>${time?time+' · ':''}SELF-PACED</span></div>`;}
function bubble(who,text){return `<div class="dialogue ${who==='You'?'you':''}"><div class="bubble"><small>${who==='You'?'YOU · SUPERVISOR':'ANDRETTI HUSSEGE · EMPLOYEE'}</small><p>${esc(text)}</p></div></div>`;}
function continuationBridge(decision){
 if(decision===0&&state.history[0]===2)return {audio:CONFIG.d1cBridgeAudio,text:"Okay, vacations aside... yes, the last two Friday reports came in after noon. I'd like to understand what's getting in the way of finishing them."};
 if(decision===1)return {audio:CONFIG.d2BridgeAudio,text:"What could you change about when you start the report, and what would help you protect that time?"};
 return null;
}
function continuation(decision){
 const src=CONFIG.followUps?.['d'+(decision+1)];
 const bridgeInfo=continuationBridge(decision);
 const bridge=bridgeInfo?bubble('You',bridgeInfo.text)+(bridgeInfo.audio?'<div class="supervisor-audio"><label for="bridge-audio">Supervisor follow-up</label><audio id="bridge-audio" controls preload="metadata" src="'+esc(bridgeInfo.audio)+'" aria-label="Supervisor transition before Andretti’s follow-up"></audio></div>':''):'';
 return bridge+bubble('Employee',decisions[decision].merge)+(src?'<div class="supervisor-audio"><label for="followup-audio">Listen to Andretti’s follow-up</label><audio id="followup-audio" controls preload="metadata" src="'+esc(src)+'" aria-label="Andretti Hussege shared follow-up"></audio><p class="notice" id="followup-status" role="status"></p></div>':'');
}
function mediaSettings(kind){return CONFIG.reactions?.[kind]||{video:CONFIG[kind+'Video'],captions:CONFIG[kind+'Captions']};}
function reactionKey(){return 'd'+(state.decision+1)+'-'+String.fromCharCode(97+state.selection);}
function video(kind){
 const src=mediaSettings(kind).video,cap=mediaSettings(kind).captions;
 if(!src)return '';
 return `<div class="course-video"><video id="${kind}-video" data-kind="${kind}" controls playsinline preload="metadata" aria-label="${kind==='intro'?'Opening video':kind==='greeting'?'Andretti Hussege greeting':'Andretti Hussege reaction'}" aria-describedby="${kind}-media-status"><source src="${esc(src)}" type="video/mp4">${cap?`<track default kind="captions" srclang="en" label="English" src="${esc(cap)}">`:''}Your browser does not support HTML video.</video><div class="video-tools"><button type="button" class="secondary cc-button" data-action="captions" data-kind="${kind}" aria-controls="${kind}-video" aria-pressed="${!!cap}" ${cap?'':'disabled'}>CC <span>${cap?'Captions on':'Captions pending'}</span></button><p class="notice" id="${kind}-media-status" role="status">${cap?'English captions available.':'Accurate English captions have not been supplied yet.'}</p></div></div>`;
}
function go(page){
 const route=routeDestination(page);if(!route)return;
 const previous=routeFor(state.page);
 if(previous?.id==='objectives'&&route.id==='facts')state.objectivesCompleted=true;
 if(route.id==='scenario'||previous?.id==='scenario')state.scenarioStarted=true;
 state.page=route.page;state.visitedRoutes=state.visitedRoutes||[];
 if(!state.visitedRoutes.includes(route.id))state.visitedRoutes.push(route.id);
 save();render();
}
function bindVideo(){
 const player=courseMedia();if(!player)return;
 if(player.dataset.kind!=='intro'&&mediaSettings(player.dataset.kind).reactionAudio){bindReactionAudio(player);return;}
 const kind=player.dataset.kind,cc=main.querySelector('.cc-button'),status=main.querySelector('#'+kind+'-media-status');
 const syncCC=()=>{if(!cc||!mediaSettings(kind).captions)return;const on=player.textTracks[0]?.mode==='showing';cc.setAttribute('aria-pressed',String(on));cc.innerHTML='CC <span>Captions '+(on?'on':'off')+'</span>';};
 if(mediaSettings(kind).captions){
   player.addEventListener('loadedmetadata',()=>{if(player.textTracks[0])player.textTracks[0].mode='showing';syncCC();});
   player.textTracks.addEventListener('change',syncCC);
   player.querySelector('track')?.addEventListener('error',()=>{cc.disabled=true;cc.textContent='CC · Captions unavailable';cc.setAttribute('aria-pressed','false');status.textContent='Captions could not be loaded for this video.';});
 }
 if(kind==='intro'){const fail=()=>showIntroFallback();player.addEventListener('error',fail);player.querySelector('source')?.addEventListener('error',fail);setTimeout(()=>{if(player.isConnected&&player.networkState===3&&player.readyState===0)fail();},2500);}
 else player.addEventListener('error',()=>{status.textContent='This video could not load. Read the dialogue on this page to continue.';});
 if(kind!=='intro'){const revision=interactionRevision;player.addEventListener('ended',()=>{if(interactionGuard(revision,kind))revealFeedback();});return;}
 let furthest=0;
 player.addEventListener('timeupdate',()=>{if(!player.seeking)furthest=Math.max(furthest,player.currentTime);});
 player.addEventListener('seeking',()=>{if(introRequired()&&player.currentTime>furthest+0.25){player.currentTime=furthest;status.textContent='Please finish watching the opening video before continuing. You can replay any part already watched.';}});
 player.addEventListener('ended',()=>{
   if(introRequired()&&(!Number.isFinite(player.duration)||furthest<player.duration-0.5))return;
   state.intro=true;state.introWatchedVersion=introVersion;save();
   // Reveal the approved hook without replacing the player or stealing keyboard focus.
   main.querySelector('#intro-after').hidden=false;
   main.querySelector('#intro-watch-note').textContent='Opening video viewed. You can now continue.';
   status.textContent='Opening video complete.';document.querySelector('#percent').textContent=courseProgress()+'%';document.querySelector('#progress').value=courseProgress();
   document.querySelector('#status').textContent='Opening video complete. Continue to Learning Objectives is now available below the video.';
   updateJourney();
 });
}
function updateJourney(){
 const current=routeFor(state.page)?.step;
 const detail=step=>step.id==='builder'&&current==='builder'?builderJourneyDetail():step.detail;
 document.querySelector('#journey').innerHTML=COURSE_STEPS.map((step,i)=>{const done=stepCompleted(step.id);return '<button class="nav-item '+(current===step.id?'active':'')+'" data-page="'+step.route+'" '+(canEnterRoute(step.route)?'':'disabled')+' '+(current===step.id?'aria-current="step"':'')+'><span class="nav-num" aria-hidden="true">'+(done?'✓':String(i+1).padStart(2,'0'))+'</span><span class="nav-title"><span class="sr-only">Step '+(i+1)+': </span>'+esc(step.label)+' <small>'+esc(detail(step))+'</small>'+(done?'<span class="sr-only">, completed</span>':'')+'</span></button>';}).join('');
}
function render(){
interactionRevision++;introFailed=false;
main.querySelectorAll('video,audio').forEach(player=>player.pause());
const percent=courseProgress();
document.querySelector('#progress-label').textContent='Course progress';
document.querySelector('#percent').textContent=percent+'%';document.querySelector('#progress').value=percent;
updateJourney();
let html='';
if(state.page===0){html=routeHeader('welcome','1 MIN')+`<div class="eyebrow">FROM PEER TO SUPERVISOR</div><h1>Same Team, New Role:<br>Giving Feedback That Works.</h1><p class="lede">${esc(clean(P[2].replace('[SUBTITLE] ','')))}</p>`;
html+='<div class="scenario-context"><div class="eyebrow">YOUR NEW ROLE</div><p>You were promoted six weeks ago. Laura Awesome, who used to sit across from you, now reports to you. Three weeks ago, you talked to her about her Friday reports. This is how it went.</p></div>';
if(CONFIG.introVideo)html+='<p class="intro-start"><strong>Start here:</strong> play the short introduction below.</p>';
html+=video('intro')||`<div class="video-panel"><div><div class="video-label">THE OPENING MOMENT</div><h2>Same team.<br>A different conversation.</h2><p>Opening video · Placeholder</p><button class="text-button" style="color:#d9edab" data-action="intro">Play Intro Video</button></div><button class="play" data-action="intro" aria-label="Play Intro Video">▶</button></div>`;
html+=`<div id="intro-fallback" hidden></div><p class="notice" id="intro-watch-note">${state.intro?(state.introSkippedVersion===introVersion&&state.introWatchedVersion!==introVersion?'You continued without the opening video.':'Opening video viewed.'):CONFIG.introVideo?'Play the opening video to the end to unlock the next section. Playback does not start automatically.':''}</p><div id="intro-after" ${state.intro?'':'hidden'}><div class="intro-copy">${para(6)}</div><div class="actions">${btn('Continue to Learning Objectives','objectives')}</div></div>`;
html+=`<div class="meta-row"><span>◷ &nbsp; 20 minutes</span><span>↔ &nbsp; Interactive practice</span><span>◎ &nbsp; Practice with feedback</span></div>`;
}else if(state.page===1){html=routeHeader('objectives','1 MIN')+`<h1>What You'll Learn</h1><div class="lede">${range(10,11)}</div>${para(14)}<ol class="objectives">${[15,16,17].map(i=>`<li>${esc(t(i))}</li>`).join('')}</ol><div class="actions">${btn('Prepare for the Card Sort','facts-first')}</div>`;
}else if(state.page===9){html=factsFirstPage();
}else if(state.page===8){html=sortPage();
}else if(state.page===2){html=foundationInstruction();
}else if(state.page===10){html=builderPage();
}else if(state.page===11){html=builderRewardPage();
}else if(state.page===12){html=judgmentPage();
}else if(state.page===13){html=takeawayPage();
}else if(state.page===3){const d=decisions[state.decision];html=routeHeader('scenario','3 DECISIONS')+`<h1>The conversation</h1>`;
if(state.decision===0)html+=`<div class="scenario-context"><div class="eyebrow">A SEPARATE PRACTICE CASE</div><p>You will now practice with Andretti Hussege, a different employee from Laura in the opening video.</p>${range(41,43)}</div>`;
html+=`<div class="meeting-header"><span class="avatar" aria-hidden="true">AH</span><div><strong>A conversation with Andretti Hussege</strong><small>You are the supervisor</small></div><span class="meeting-dot" aria-hidden="true"></span></div><div class="decision-track" role="img" aria-label="Decision ${state.decision+1} of 3">${[0,1,2].map(i=>`<span class="${i<=state.decision?'done':''}"></span>`).join('')}</div><div class="eyebrow">DECISION ${state.decision+1} OF 3 · ${esc(d.title)} · ${d.time}</div>`;
if(state.selection===null){if(state.decision===0)html+=video('greeting')+bubble('Employee',t(46));else html+=continuation(state.decision-1);}
if(state.selection===null){html+=`<h2 class="question">${esc(d.question)}</h2><p class="notice">Choose what you would say.</p><div class="choices">${[0,1,2].map(k=>`<button class="choice" data-choice="${k}"><span aria-hidden="true">${String.fromCharCode(65+k)}</span>${esc(d.choices[k].say)}</button>`).join('')}</div>`;
}else{const choice=d.choices[state.selection],key=reactionKey();
html+='<div class="selected-response" aria-label="Selected supervisor response"><div class="eyebrow">YOUR SELECTED RESPONSE · '+String.fromCharCode(65+state.selection)+'</div>'+bubble('You',choice.say)+'</div>';
const supervisorAudio=mediaSettings(key).supervisorAudio;
html+=supervisorAudio?'<div class="supervisor-audio"><label for="supervisor-audio">Your supervisor response</label><audio id="supervisor-audio" controls preload="metadata" src="'+esc(supervisorAudio)+'"></audio></div>':'<p class="notice">Supervisor audio pending. Read your selected response above.</p>';
html+='<p class="notice" id="interaction-status" role="status"></p>';
if(supervisorAudio)html+='<div class="actions">'+btn('Read Dialogue & Play Reaction','play-reaction',true)+'</div>';
html+='<div id="reaction-stage" '+(supervisorAudio&&!state.feedbackShown?'hidden':'')+'>';
html+=reactionMedia(key);
html+=bubble('Employee',choice.reaction)+'</div>';
html+=`<div class="actions">${btn('Replay Interaction','replay-interaction',true)}${btn(mediaSettings(key).reactionAudio?'Read Reaction & Continue to Feedback':'Continue to Feedback','show-feedback',true)}</div>`;
html+=`<div id="branch-feedback" ${state.feedbackShown?'':'hidden'}><div class="feedback"><div class="eyebrow">CONVERSATION INSIGHT</div><p>${esc(choice.feedback)}</p></div>${state.decision===2&&state.selection===0?continuation(state.decision):''}`;
if(state.decision===2)html+=`<p>Effective feedback is specific, respectful, and focused on improvement.</p><div class="actions">${btn('Try a Different Approach','retry',true)}${btn('Continue to Judgment Lab','scenario-finish')}</div>`;
else html+=`<div class="actions">${btn('Continue Conversation','next-decision')}${btn('Try Another Approach','retry',true)}</div>`;
html+='</div>';
}
if(state.decision>0||state.selection!==null)html+='<div class="actions">'+btn('Back to First Decision','first-decision',true)+'</div>';

}else if(state.page===6){html=completionPage();
}else{html=sectionHeader('OPTIONAL RESOURCE','OUTSIDE TRAINING TIME')+`<h1>Interactive Conversation Planner</h1><p class="lede">${esc(t(186))}</p><p class="notice">This separate resource is optional. Its use is not included in the 20-minute training duration.</p><div class="actions">${btn('Open Interactive Conversation Planner','open-planner')}${btn('Back to Completion','back-complete',true)}</div><p id="planner-status" role="status" class="notice">${CONFIG.plannerUrl?'Opens the separate Conversation Planner application.':'The Conversation Planner has not been connected yet.'}</p>`;}
main.innerHTML=`<section>${html}</section>`;
bindVideo();
bindSupervisorAudio();
bindBridgeAudio();
bindBuilderAudio();
bindActivityInputs();
bindImageFallbacks();
// Only one recording should be audible at a time, including the shared follow-up.
main.querySelectorAll('video,audio').forEach(player=>player.addEventListener('play',()=>{main.querySelectorAll('video,audio').forEach(other=>{if(other!==player)other.pause();});}));
main.querySelector('#followup-audio')?.addEventListener('error',()=>{const status=main.querySelector('#followup-status');if(status)status.textContent='Follow-up audio could not load. Andretti’s dialogue remains available above.';});
main.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',()=>{const key=el.dataset.reveal,k=Number(el.dataset.index);if(!key)return;state[key]=(state[key]||[]).filter(i=>i!==k);if(el.open){state[key].push(k);if(key==='prep'){state.essentialSeen=state.essentialSeen||[];if(!state.essentialSeen.includes(k))state.essentialSeen.push(k);}}save();updateEssentialProgress();updateJourney();document.querySelector('#percent').textContent=courseProgress()+'%';document.querySelector('#progress').value=courseProgress();}));
main.querySelector('#reflection')?.addEventListener('input',e=>{state.reflection=e.target.value;save();});
if(!([10,11].includes(state.page)&&focusBuilderStep())){main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
}
/* Intro video unavailable: plain-language message, the video's existing caption text as a transcript, and a way to continue. */
async function showIntroFallback(){
 const box=main.querySelector('#intro-fallback');if(!box||introFailed||state.page!==0)return;introFailed=true;
 const revision=interactionRevision,needsContinue=introRequired();
 box.innerHTML='<div class="media-pending"><h2 id="intro-fallback-heading">The opening video isn’t available right now</h2><p>Try reloading the page. If the video still doesn’t load, you can read its transcript below'+(needsContinue?' and continue the course without it.':'.')+'</p>'+(needsContinue?'<div class="actions">'+btn('Continue without the video','intro-skip')+'</div>':'')+'</div><details open class="intro-transcript"><summary>Video transcript</summary><div id="intro-transcript-body" aria-live="polite"><p class="notice">Loading transcript…</p></div></details>';
 box.hidden=false;
 const status=main.querySelector('#intro-media-status');if(status)status.textContent='The opening video could not load.';
 const live=document.querySelector('#status');if(live)live.textContent='The opening video could not be loaded. A transcript and a Continue without the video button are available below the video.';
 let html='';
 try{if(!CONFIG.introCaptions)throw Error('none');const cues=await loadCaptions(CONFIG.introCaptions);html=cues.map(c=>'<p>'+esc(c.text).replace(/\n/g,'<br>')+'</p>').join('');}catch{html='';}
 if(revision!==interactionRevision)return;
 const body=main.querySelector('#intro-transcript-body');
 if(body)body.innerHTML=html||'<p class="notice">The transcript could not be loaded either. The scenario description above introduces the situation, and you can continue without the video.</p>';
}
function skipIntro(){
 if(state.page!==0||!introFailed||!CONFIG.introVideo)return;
 state.intro=true;state.introSkippedVersion=introVersion;save();
 const after=main.querySelector('#intro-after');if(after)after.hidden=false;
 const note=main.querySelector('#intro-watch-note');if(note)note.textContent='You continued without the opening video.';
 main.querySelector('#intro-fallback [data-action=intro-skip]')?.closest('.actions')?.remove();
 document.querySelector('#percent').textContent=courseProgress()+'%';document.querySelector('#progress').value=courseProgress();
 document.querySelector('#status').textContent='Continuing without the opening video. Continue to Learning Objectives is now available below.';
 updateJourney();main.querySelector('#intro-after [data-action=objectives]')?.focus();
}
function interactionGuard(revision,key){return revision===interactionRevision&&state.page===3&&state.selection!==null&&reactionKey()===key;}
async function playReaction(){
 if(state.page!==3||state.selection===null)return;
 const revision=interactionRevision,key=reactionKey();
 main.querySelector('#supervisor-audio')?.pause();
 const stage=main.querySelector('#reaction-stage');if(stage)stage.hidden=false;
 const player=courseMedia();
 if(!mediaSettings(key).reactionAudio||!player){document.querySelector('#status').textContent='Reaction audio pending. Read Andretti’s response and continue to feedback.';return;}
 try{await player.play();}catch{if(interactionGuard(revision,key))main.querySelector('#interaction-status').textContent='Press Play on Andretti’s audio control to hear the reaction.';}
}
function bindSupervisorAudio(){
 const audio=main.querySelector('#supervisor-audio');
 if(state.page!==3||state.selection===null||!mediaSettings(reactionKey()).supervisorAudio||!audio)return;
 const revision=interactionRevision,key=reactionKey();
 audio.addEventListener('ended',()=>{if(interactionGuard(revision,key))playReaction();});
 audio.addEventListener('error',()=>{if(interactionGuard(revision,key)){main.querySelector('#interaction-status').textContent='Supervisor audio could not load. Read the selected dialogue; the employee reaction is available below.';playReaction();}});
}
async function startInteraction(){
 if(state.page!==3||state.selection===null)return;
 const revision=interactionRevision,key=reactionKey(),audio=main.querySelector('#supervisor-audio');
 if(!mediaSettings(key).supervisorAudio||!audio){await playReaction();return;}
 try{await audio.play();}catch{if(interactionGuard(revision,key))main.querySelector('#interaction-status').textContent='Press Play on the supervisor audio, or choose Read Dialogue & Play Reaction.';}
}
function replayInteraction(){
 if(state.page!==3||state.selection===null)return;
 state.feedbackShown=false;save();render();return startInteraction();
}
function hasBridge(){return state.page===3&&state.decision>0&&state.selection===null&&!!continuationBridge(state.decision-1)?.audio;}
function bindBridgeAudio(){
 if(!hasBridge())return;
 const bridge=main.querySelector('#bridge-audio'),revision=interactionRevision;
 if(!bridge)return;
 bridge.addEventListener('ended',()=>{if(revision===interactionRevision&&hasBridge())playFollowUp(true);});
 bridge.addEventListener('error',()=>{if(revision===interactionRevision&&hasBridge()){main.querySelector('#followup-status').textContent='Supervisor audio unavailable. Read the supervisor transition above.';playFollowUp(true);}});
}
async function playFollowUp(afterBridge=false){
 if(state.page!==3||state.selection!==null||state.decision===0)return;
 const src=CONFIG.followUps?.['d'+state.decision],audio=main.querySelector('#followup-audio'),revision=interactionRevision;
 if(!src||!audio)return;
 if(!afterBridge&&hasBridge()){const bridge=main.querySelector('#bridge-audio');if(bridge){try{await bridge.play();}catch{if(revision===interactionRevision)main.querySelector('#followup-status').textContent='Press Play on the supervisor follow-up; Andretti’s audio follows.';}return;}}
 try{await audio.play();}catch{if(revision===interactionRevision){const status=main.querySelector('#followup-status');if(status)status.textContent='Press Play to hear Andretti’s follow-up.';}}
}
function revealFeedback(){if(state.page!==3||state.selection===null)return;main.querySelector('#supervisor-audio')?.pause();courseMedia()?.pause();state.feedbackShown=true;save();const panel=main.querySelector('#branch-feedback');if(panel)panel.hidden=false;document.querySelector('#status').textContent='Conversation insight is available below the employee reaction.';updateJourney();document.querySelector('#percent').textContent=courseProgress()+'%';document.querySelector('#progress').value=courseProgress();}
function resumeScenario(){go('scenario');}
function replay(){if(!state.sortPassed){go(8);return;}state.decision=0;state.selection=null;state.feedbackShown=false;state.history=[];go(3);}
document.addEventListener('click',async e=>{const el=e.target.closest('button');if(!el)return;
if(el.dataset.factsChoice!==undefined){if(state.page!==9)return;const p=factsPracticeState(),choice=Number(el.dataset.factsChoice);if((choice!==0&&choice!==1)||Number(el.dataset.factsIndex)!==p.index)return;p.answers[p.index]=choice;save();refreshFactsCarousel();return;}
if(el.dataset.sort!==undefined){chooseSort(el.dataset.sort);return;}
if(sortingAction(el.dataset.action))return;
if(activityChoice(el)||activityAction(el.dataset.action))return;
if(el.dataset.page!==undefined){const p=/^\d+$/.test(el.dataset.page)?Number(el.dataset.page):el.dataset.page;if(canEnterRoute(p))go(p);return;}
if(el.dataset.choice!==undefined){if(state.selection!==null)return;state.selection=+el.dataset.choice;state.feedbackShown=false;state.history[state.decision]=state.selection;save();render();await startInteraction();return;}
switch(el.dataset.action){case'instruction-continue':if(routeFor(state.page)?.id==='instruction'&&state.sortPassed&&essentialsComplete()){state.instructionCompleted=true;go('builder');}break;case'facts-first':go(9);break;case'facts-back':moveFactsPractice(-1);break;case'facts-next':moveFactsPractice(1);break;case'facts-continue':if(state.page===9&&factsPracticeState().index===2&&factsPracticeState().answers.every(a=>a===0||a===1)){state.factsViewed=true;go(8);}break;case'replay-interaction':await replayInteraction();break;case'play-reaction':await playReaction();break;case'show-feedback':{const reactionStage=main.querySelector('#reaction-stage');if(reactionStage)reactionStage.hidden=false;revealFeedback();break;}case'scenario-finish':case'scenario-reflection':case'takeaways':if(state.feedbackShown&&state.decision===2){state.scenarioFinished=true;go('judgment');}break;case'captions':{const player=courseMedia();if(player?.dataset.kind==='intro'){const track=player.textTracks[0];if(track)track.mode=track.mode==='showing'?'disabled':'showing';}break;}case'intro':if(!CONFIG.introVideo){state.intro=true;save();render();}break;case'intro-skip':skipIntro();break;case'objectives':go(1);break;case'scenario':resumeScenario();break;case'next-decision':if(!state.feedbackShown||state.decision>=2)break;state.decision++;state.selection=null;state.feedbackShown=false;save();render();await playFollowUp();break;case'retry':state.selection=null;state.feedbackShown=false;save();render();break;case'reflection':go(4);break;case'review':go(5);break;case'complete':activityAction('takeaway-complete');break;case'first-decision':replay();break;case'replay':replay();break;case'planner':go(7);break;case'back-complete':go(6);break;case'open-planner':if(CONFIG.plannerUrl)window.open(CONFIG.plannerUrl,'_blank','noopener,noreferrer');else document.querySelector('#planner-status').textContent='The separate Conversation Planner is coming later. Your training is complete.';break;case'copy':{const field=document.querySelector('#reflection'),status=document.querySelector('#copy-status');if(!field.value.trim()){status.textContent='Add a reflection to copy, or continue without one.';break;}try{await navigator.clipboard.writeText(field.value);status.textContent='Reflection copied.';}catch{field.focus();field.select();status.textContent='Your reflection is selected. Press Ctrl+C (Windows) or Command+C (Mac) to copy.';}break;}}
});
document.querySelector('#restart').addEventListener('click',()=>{if(confirm('Restart the course and clear your saved progress and reflection?')){state={sortVersion:2,page:0,unlocked:0,intro:false,decision:0,selection:null,history:[],reflection:'',complete:false,prep:[],recap:[]};save();render();}});
render();




