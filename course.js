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
try{const previous=localStorage.getItem(KEY)?null:JSON.parse(localStorage.getItem('same-team-course-v2')||localStorage.getItem('same-team-course-v1'));if(previous){state.introWatchedVersion=previous.introWatchedVersion;state.intro=previous.intro;state.reflection=previous.reflection||'';}const s=JSON.parse(localStorage.getItem(KEY));if(s&&Number.isInteger(s.page)&&s.page>=0&&s.page<=8)state={...state,...s};}catch{}
// Require a full 20-card round after upgrading the old 10-card activity.
if(state.sortVersion!==2){state.sortVersion=2;state.sortRound=null;state.sortPending=null;state.sortPassed=false;state.sortBest=0;state.complete=false;state.unlocked=Math.min(state.unlocked,2);if(state.page!==0&&state.page!==1)state.page=8;}
// Upgrade to submitted ten-card rounds; preserve established conversation progress.
if(state.sortGateVersion!==4){state.sortGateVersion=4;state.sortRound=null;state.sortPending=null;if(!state.scenarioStarted&&!state.scenarioFinished&&!state.complete)state.sortPassed=false;}
// Clear the old selected dialogue when upgrading; keep the learner's decision and course progress.
if(state.scenarioRevision!=='2026-11-14'){state.scenarioRevision='2026-11-14';state.selection=null;state.feedbackShown=false;state.history=[];}
// A placeholder viewed in an earlier version does not count as viewing this video.
const introVersion = CONFIG.introVideo + '|' + CONFIG.introRevision;
function introRequired(){return !!CONFIG.introVideo && state.introWatchedVersion !== introVersion;}
if(introRequired()){state.intro=false;state.page=0;}
const names=['Welcome','What you’ll learn','Sort the statements','The conversation','Conversation takeaways','Reflect & review'];
const pageOrder=[0,1,8,3,2,4];
function stage(page){return page===8?2:page>=4?5:pageOrder.indexOf(page);}
const times=['1 min','1 min','4 min','10 min','2 min','2 min'];
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
function sectionHeader(label,time){return `<div class="section-top"><span>${label}</span><span>${time} · SELF-PACED</span></div>`;}
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
 return `<div class="course-video"><video id="${kind}-video" data-kind="${kind}" controls playsinline preload="metadata" aria-label="${kind==='intro'?'Opening video':kind==='greeting'?'Andretti Hussege greeting':'Andretti Hussege reaction'}" aria-describedby="${kind}-media-status"><source src="${esc(src)}" type="video/mp4">${cap?`<track default kind="captions" srclang="en" label="English" src="${esc(cap)}">`:''}Your browser does not support HTML video.</video><div class="video-tools"><button type="button" class="secondary cc-button" data-action="captions" data-kind="${kind}" aria-controls="${kind}-video" aria-label="${cap?'Turn English captions off':'English captions unavailable'}" aria-pressed="${!!cap}" ${cap?'':'disabled'}>CC <span>${cap?'Captions on':'Captions pending'}</span></button><p class="notice" id="${kind}-media-status" role="status">${cap?'English captions available.':'Accurate English captions have not been supplied yet.'}</p></div></div>`;
}
function go(page){if(page>0&&introRequired())return;if(page!==8&&stage(page)>=3&&!state.sortPassed)return;if((page===2||(page>=4&&page!==8))&&!state.scenarioFinished)return;if(page===3||state.page===3)state.scenarioStarted=true;state.page=page;state.unlocked=Math.max(state.unlocked,stage(page));save();render();}
function bindVideo(){
 const player=main.querySelector('video');if(!player)return;
 const kind=player.dataset.kind,cc=main.querySelector('.cc-button'),status=main.querySelector('#'+kind+'-media-status');
 const syncCC=()=>{if(!cc||!mediaSettings(kind).captions)return;const on=player.textTracks[0]?.mode==='showing';cc.setAttribute('aria-pressed',String(on));cc.setAttribute('aria-label',on?'Turn English captions off':'Turn English captions on');cc.innerHTML='CC <span>Captions '+(on?'on':'off')+'</span>';};
 if(mediaSettings(kind).captions){
   player.addEventListener('loadedmetadata',()=>{if(player.textTracks[0])player.textTracks[0].mode='showing';syncCC();});
   player.textTracks.addEventListener('change',syncCC);
   player.querySelector('track')?.addEventListener('error',()=>{cc.disabled=true;cc.textContent='CC · Captions unavailable';cc.setAttribute('aria-pressed','false');status.textContent='The caption file could not load. Run the course through the local HTTP server and check the configured VTT path.';});
 }
 player.addEventListener('error',()=>{status.textContent='The video could not load. Check the media path in media-config.js and run the course using node serve.cjs.';});
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
   status.textContent='Opening video complete.';
   document.querySelector('#status').textContent='Opening video complete. Let’s Learn How is now available below the video.';
   updateJourney();
 });
}
function updateJourney(){
 const current=stage(state.page);
 document.querySelector('#journey').innerHTML=names.map((n,i)=>`<button class="nav-item ${current===i?'active':''}" data-page="${pageOrder[i]}" ${(i>state.unlocked&&!(i===3&&state.sortPassed))||(i>=3&&!state.sortPassed)||(i>0&&introRequired())?'disabled':''} ${current===i?'aria-current="step"':''} aria-label="${i+1}. ${n}, ${times[i]}"><span class="nav-num">${i<current||state.complete?'✓':String(i+1).padStart(2,'0')}</span><span class="nav-title">${n}<small>${times[i]}</small></span></button>`).join('');
}
function render(){
interactionRevision++;
main.querySelectorAll('video,audio').forEach(player=>player.pause());
const current=stage(state.page);const percent=state.complete?100:[0,5,10,30,80,90][current]+(state.page===3?Math.round(state.decision/3*50):state.page===8?Math.round((state.sortRound?.answers.length||0)*1):0);
document.querySelector('#percent').textContent=percent+'%';document.querySelector('#progress').value=percent;
updateJourney();
let html='';
if(state.page===0){html=sectionHeader('01 / WELCOME','1 MIN')+`<div class="eyebrow">FROM PEER TO SUPERVISOR</div><h1>Same Team, New Role:<br>Giving Feedback That Works.</h1><p class="lede">${esc(clean(P[2].replace('[SUBTITLE] ','')))}</p>`;
html+=video('intro')||`<div class="video-panel"><div><div class="video-label">THE OPENING MOMENT</div><h2>Same team.<br>A different conversation.</h2><p>Opening video · Placeholder</p><button class="text-button" style="color:#d9edab" data-action="intro">Play Intro Video</button></div><button class="play" data-action="intro" aria-label="Play Intro Video">▶</button></div>`;
if(CONFIG.introVideo)html+=`<div class="actions">${btn('Start Training','start-training')}</div>`;
html+=`<p class="notice" id="intro-watch-note">${state.intro?'Opening video viewed.':CONFIG.introVideo?'Play the opening video to the end to unlock the next section. Playback does not start automatically.':''}</p><div id="intro-after" ${state.intro?'':'hidden'}><div class="intro-copy">${para(6)}</div><div class="actions">${btn("Let's Learn How",'objectives')}</div></div>`;
html+=`<div class="meta-row"><span>◷ &nbsp; 20 minutes</span><span>↔ &nbsp; Interactive practice</span><span>◎ &nbsp; Practice with feedback</span></div>`;
}else if(state.page===1){html=sectionHeader('02 / PURPOSE & OBJECTIVES','1 MIN')+`<h1>What You'll Learn</h1><div class="lede">${range(10,11)}</div>${para(14)}<ol class="objectives">${[15,16,17].map(i=>`<li>${esc(t(i))}</li>`).join('')}</ol><div class="actions">${btn('Start the Card Sort','sorting')}</div>`;
}else if(state.page===8){html=sortPage();
}else if(state.page===2){html=sectionHeader('05 / CONVERSATION TAKEAWAYS','2 MIN')+`<h1>Three Moves for a Useful Feedback Conversation</h1><p class="notice">Select each move to explore the example.</p>`;
html+=[22,26,30].map((i,k)=>`<details data-reveal="prep" data-index="${k}" ${state.prep.includes(k)?'open':''}><summary><span><span class="eyebrow">0${k+1} &nbsp;</span> ${esc(t(i))}</span></summary><blockquote>${esc(P[i+1])}</blockquote>${para(i+2)}</details>`).join('');
html+=para(34)+para(147)+`<div class="actions">${btn('Continue to Reflection','reflection')}</div>`;
}else if(state.page===3){const d=decisions[state.decision];html=sectionHeader('04 / THE PERFORMANCE CONVERSATION','10 MIN')+`<h1>The conversation</h1>`;
if(state.decision===0)html+=`<div class="scenario-context"><div class="eyebrow">YOUR SITUATION</div>${range(41,43)}</div>`;
html+=`<div class="meeting-header"><span class="avatar" aria-hidden="true">AH</span><div><strong>A conversation with Andretti Hussege</strong><small>You are the supervisor</small></div><span class="meeting-dot" aria-hidden="true"></span></div><div class="decision-track" aria-label="Decision ${state.decision+1} of 3">${[0,1,2].map(i=>`<span class="${i<=state.decision?'done':''}"></span>`).join('')}</div><div class="eyebrow">DECISION ${state.decision+1} OF 3 · ${esc(d.title)} · ${d.time}</div>`;
if(state.selection===null){if(state.decision===0)html+=video('greeting')+bubble('Employee',t(46));else html+=continuation(state.decision-1);}
if(state.selection===null){html+=`<h2 class="question">${esc(d.question)}</h2><p class="notice">Choose what you would say.</p><div class="choices">${[0,1,2].map(k=>`<button class="choice" data-choice="${k}"><span aria-hidden="true">${String.fromCharCode(65+k)}</span>${esc(d.choices[k].say)}</button>`).join('')}</div>`;
}else{const choice=d.choices[state.selection],key=reactionKey();
html+='<div class="selected-response" aria-label="Selected supervisor response"><div class="eyebrow">YOUR SELECTED RESPONSE · '+String.fromCharCode(65+state.selection)+'</div>'+bubble('You',choice.say)+'</div>';
const supervisorAudio=mediaSettings(key).supervisorAudio;
html+=supervisorAudio?'<div class="supervisor-audio"><label for="supervisor-audio">Your supervisor response</label><audio id="supervisor-audio" controls preload="metadata" src="'+esc(supervisorAudio)+'"></audio></div>':'<p class="notice">Supervisor audio pending. Read your selected response above.</p>';
html+='<p class="notice" id="interaction-status" role="status"></p>';
if(supervisorAudio)html+='<div class="actions">'+btn('Read Dialogue & Play Reaction','play-reaction',true)+'</div>';
html+='<div id="reaction-stage" '+(supervisorAudio&&!state.feedbackShown?'hidden':'')+'>';
html+=mediaSettings(key).video?video(key):`<div class="reaction-placeholder" data-reaction="${key}"><div class="eyebrow">ANDRETTI HUSSEGE · ${key.toUpperCase()}</div><span class="reaction-play" aria-hidden="true">▷</span><h3>Andretti Hussege reaction video</h3><p class="notice">Video clip pending. Read the employee’s response below to continue.</p><span class="notice">Captions and video replay will be available when this clip is supplied.</span></div>`;
html+=bubble('Employee',choice.reaction)+'</div>';
html+=`<div class="actions">${btn('Replay Interaction','replay-interaction',true)}${btn(mediaSettings(key).video?'Read Reaction & Continue to Feedback':'Continue to Feedback','show-feedback',true)}</div>`;
html+=`<div id="branch-feedback" ${state.feedbackShown?'':'hidden'}><div class="feedback"><div class="eyebrow">CONVERSATION INSIGHT</div><p>${esc(choice.feedback)}</p></div>${state.decision===2&&state.selection===0?continuation(state.decision):''}`;
if(state.decision===2)html+=`<p>Effective feedback is specific, respectful, and focused on improvement.</p><div class="actions">${btn('Try a Different Approach','retry',true)}${btn('Continue to Reflection','scenario-reflection')}</div>`;
else html+=`<div class="actions">${btn('Continue Conversation','next-decision')}${btn('Try Another Approach','retry',true)}</div>`;
html+='</div>';
}
if(state.decision>0||state.selection!==null)html+='<div class="actions">'+btn('Back to First Decision','first-decision',true)+'</div>';

}else if(state.page===4){html=sectionHeader('06 / REFLECTION','2 MIN INCLUDING REVIEW')+`<h1>Putting It Into Practice</h1>${para(154)}<label for="reflection">${esc(t(156))}<br><span class="optional">Optional · Stored only in this browser. No submission or grading.</span></label><textarea id="reflection" placeholder="A thought to take into your next conversation…">${esc(state.reflection)}</textarea><div class="actions">${btn('Copy Reflection','copy',true)}${btn('Continue to Review','review')}</div><p class="notice" id="copy-status" role="status"></p>`;
}else if(state.page===5){html=sectionHeader('06 / REVIEW','PART OF YOUR 2-MINUTE REFLECTION')+`<h1>Three Things to Remember</h1>${para(160)}<ol class="objectives">${[161,162,163].map(i=>`<li>${esc(t(i))}</li>`).join('')}</ol>${para(164)}<h2>A moment to recall</h2><p class="notice">Select each prompt to reveal the answer. No score is assigned.</p>`;
html+=[166,168,170].map((i,k)=>`<details data-reveal="recap" data-index="${k}" ${state.recap.includes(k)?'open':''}><summary>${esc(clean(P[i].replace(/^Prompt \d: /,'')))}</summary><p>${esc(clean(P[i+1].replace('[REVEAL] ','')))}</p></details>`).join('');
html+=`<div class="intro-copy">${range(174,175)}</div><div class="actions">${btn('Complete Training','complete')}</div>`;
}else if(state.page===6){html=sectionHeader('YOUR LEARNING JOURNEY','COMPLETE')+`<div class="completion-mark" aria-hidden="true">✓</div><h1>Training Complete!</h1><p class="lede">Same Team, New Role: Giving Feedback That Works</p><div class="completion"><div class="eyebrow">TAKE IT INTO YOUR NEXT CONVERSATION</div>${range(174,175)}</div><p class="notice">The 20-minute training ends here. The Conversation Planner is introduced after completion and is not required.</p><div class="actions">${btn('Replay the Scenario','replay',true)}${btn('Explore Optional Conversation Planner','planner')}</div>${completionSurvey()}`;
}else{html=sectionHeader('OPTIONAL RESOURCE','OUTSIDE TRAINING TIME')+`<h1>Interactive Conversation Planner</h1><p class="lede">${esc(t(186))}</p><p class="notice">This separate resource is optional. Its use is not included in the 20-minute training duration.</p><div class="actions">${btn('Open Interactive Conversation Planner','open-planner')}${btn('Back to Completion','back-complete',true)}</div><p id="planner-status" role="status" class="notice">${CONFIG.plannerUrl?'Opens the separate Conversation Planner application.':'The Conversation Planner has not been connected yet.'}</p>`;}
main.innerHTML=`<section>${html}</section>`;
bindVideo();
bindSupervisorAudio();
bindBridgeAudio();
// Only one recording should be audible at a time, including the shared follow-up.
main.querySelectorAll('video,audio').forEach(player=>player.addEventListener('play',()=>{main.querySelectorAll('video,audio').forEach(other=>{if(other!==player)other.pause();});}));
main.querySelector('#followup-audio')?.addEventListener('error',()=>{const status=main.querySelector('#followup-status');if(status)status.textContent='Follow-up audio could not load. Andretti’s dialogue remains available above.';});
main.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',()=>{const key=el.dataset.reveal,k=Number(el.dataset.index);state[key]=state[key].filter(i=>i!==k);if(el.open)state[key].push(k);save();}));
main.querySelector('#reflection')?.addEventListener('input',e=>{state.reflection=e.target.value;save();});
main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
}
function interactionGuard(revision,key){return revision===interactionRevision&&state.page===3&&state.selection!==null&&reactionKey()===key;}
async function playReaction(){
 if(state.page!==3||state.selection===null)return;
 const revision=interactionRevision,key=reactionKey();
 main.querySelector('#supervisor-audio')?.pause();
 const stage=main.querySelector('#reaction-stage');if(stage)stage.hidden=false;
 const player=main.querySelector('video');
 if(!mediaSettings(key).video||!player){document.querySelector('#status').textContent='Reaction video pending. Read Andretti’s response and continue to feedback.';return;}
 try{await player.play();}catch{if(interactionGuard(revision,key))main.querySelector('#interaction-status').textContent='Press Play on Andretti’s video to watch the reaction.';}
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
function revealFeedback(){if(state.page!==3||state.selection===null)return;main.querySelector('#supervisor-audio')?.pause();main.querySelector('video')?.pause();state.feedbackShown=true;save();const panel=main.querySelector('#branch-feedback');if(panel)panel.hidden=false;document.querySelector('#status').textContent='Conversation insight is available below the employee reaction.';}
function resumeScenario(){if(!state.sortPassed){go(8);return;}state.scenarioStarted=true;go(3);}
function replay(){if(!state.sortPassed){go(8);return;}state.decision=0;state.selection=null;state.feedbackShown=false;state.history=[];go(3);}
document.addEventListener('click',async e=>{const el=e.target.closest('button');if(!el)return;
if(el.dataset.sort!==undefined){chooseSort(el.dataset.sort);return;}
if(sortingAction(el.dataset.action))return;
if(el.dataset.page!==undefined){const p=+el.dataset.page;if(stage(p)<=state.unlocked||(p===3&&state.sortPassed))go(p);return;}
if(el.dataset.choice!==undefined){if(state.selection!==null)return;state.selection=+el.dataset.choice;state.feedbackShown=false;state.history[state.decision]=state.selection;save();render();await startInteraction();return;}
switch(el.dataset.action){case'replay-interaction':await replayInteraction();break;case'play-reaction':await playReaction();break;case'scenario-reflection':if(state.feedbackShown&&state.decision===2){state.scenarioFinished=true;go(4);}break;case'show-feedback':revealFeedback();break;case'replay-reaction':{const player=main.querySelector('video');if(mediaSettings(reactionKey()).video&&player){player.currentTime=0;try{await player.play();}catch{document.querySelector('#status').textContent='Use the video Play control to replay this reaction.';}}else{state.feedbackShown=false;save();render();}break;}case'takeaways':if(state.feedbackShown&&state.decision===2){state.scenarioFinished=true;go(2);}break;case'start-training':{const player=main.querySelector('video');if(player){player.focus();try{await player.play();}catch{document.querySelector('#intro-media-status').textContent='Press Play on the video player to begin.';}}break;}case'captions':{const player=main.querySelector('video');const track=player?.textTracks[0];if(track){track.mode=track.mode==='showing'?'disabled':'showing';}break;}case'intro':if(!CONFIG.introVideo){state.intro=true;save();render();}break;case'objectives':go(1);break;case'scenario':resumeScenario();break;case'next-decision':if(!state.feedbackShown||state.decision>=2)break;state.decision++;state.selection=null;state.feedbackShown=false;save();render();await playFollowUp();break;case'retry':state.selection=null;state.feedbackShown=false;save();render();break;case'reflection':go(4);break;case'review':go(5);break;case'complete':state.complete=true;go(6);break;case'first-decision':replay();break;case'replay':replay();break;case'planner':go(7);break;case'back-complete':go(6);break;case'open-planner':if(CONFIG.plannerUrl)window.open(CONFIG.plannerUrl,'_blank','noopener,noreferrer');else document.querySelector('#planner-status').textContent='The separate Conversation Planner is coming later. Your training is complete.';break;case'copy':{const field=document.querySelector('#reflection'),status=document.querySelector('#copy-status');if(!field.value.trim()){status.textContent='Add a reflection to copy, or continue without one.';break;}try{await navigator.clipboard.writeText(field.value);status.textContent='Reflection copied.';}catch{field.focus();field.select();status.textContent='Your reflection is selected. Press Ctrl+C (Windows) or Command+C (Mac) to copy.';}break;}}
});
document.querySelector('#restart').addEventListener('click',()=>{if(confirm('Restart the course and clear your saved progress and reflection?')){state={sortVersion:2,page:0,unlocked:0,intro:false,decision:0,selection:null,history:[],reflection:'',complete:false,prep:[],recap:[]};save();render();}});
render();




