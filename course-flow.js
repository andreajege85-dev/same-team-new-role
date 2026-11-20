/* Named routes; old numeric page IDs are compatibility aliases, never ordering rules. */
const COURSE_ROUTES={welcome:{page:0,step:'welcome'},objectives:{page:1,step:'objectives'},facts:{page:9,step:'facts'},sorting:{page:8,step:'sorting'},instruction:{page:2,step:'instruction'},builder:{page:10,step:'builder'},'builder-reward':{page:11,step:'builder'},scenario:{page:3,step:'scenario'},judgment:{page:12,step:'judgment'},takeaway:{page:13,step:'takeaway'},completion:{page:6,step:'completion'},planner:{page:7,step:'completion'}};
const COURSE_STEPS=[
 {id:'welcome',route:'welcome',label:'Welcome',detail:'Opening video',weight:4},
 {id:'objectives',route:'objectives',label:'What you’ll learn',detail:'Learning objectives',weight:3},
 {id:'facts',route:'facts',label:'Facts First',detail:'3 practice statements',weight:8},
 {id:'sorting',route:'sorting',label:'Sort the statements',detail:'10 statements · 8/10 to pass',weight:15},
 {id:'instruction',route:'instruction',label:'Constructive feedback',detail:'Facts, context, and follow-up',weight:10},
 {id:'builder',route:'builder',label:'Build a Conversation',detail:'Practice with Laura Awesome',weight:15},
 {id:'scenario',route:'scenario',label:'Andretti Scenario',detail:'3 branching decisions',weight:20},
 {id:'judgment',route:'judgment',label:'Judgment Lab',detail:'3 workplace scenarios',weight:15},
 {id:'takeaway',route:'takeaway',label:'Workplace Takeaway',detail:'4 practical prompts',weight:7},
 {id:'completion',route:'completion',label:'Completion & Resources',detail:'Optional planner and survey',weight:3}
];
function routeFor(value){if(value==='reflection'||value==='review'||value===4||value===5)value='takeaway';if(typeof value==='string'&&COURSE_ROUTES[value])return {id:value,...COURSE_ROUTES[value]};const pair=Object.entries(COURSE_ROUTES).find(([,r])=>r.page===value);return pair?{id:pair[0],...pair[1]}:null;}
function stage(value){const r=routeFor(value);return r?COURSE_STEPS.findIndex(s=>s.id===r.step):0;}
function essentialsComplete(){return [0,1,2].every(i=>(state.essentialSeen||[]).includes(i));}
function essentialStatus(){const n=(state.essentialSeen||[]).filter(i=>[0,1,2].includes(i)).length;return n===3?'All three elements explored. You’re ready to build a conversation.':n+' of 3 elements explored. Open each section to continue.';}
function updateEssentialProgress(){const b=main.querySelector('#instruction-continue'),note=main.querySelector('#essential-count');if(b)b.disabled=!essentialsComplete();if(note)note.textContent=essentialStatus();}
function judgmentContentReady(){return JUDGMENT_SCENARIOS.every(s=>s.choices.length===3&&s.choices.every(c=>!!c.text&&!!c.feedback));}
function judgmentFinished(){const j=judgmentState();return judgmentContentReady()&&j.answers.every(a=>Number.isInteger(a)&&a>=0&&a<3);}
function judgmentCanContinue(){return judgmentFinished()||!!(CONFIG.localRevisionPreview&&judgmentState().previewed);}
function canEnterRoute(value){const r=routeFor(value);if(!r)return false;if(r.id==='welcome')return true;if(introRequired())return false;switch(r.id){case'objectives':case'facts':return true;case'sorting':return !!(state.factsViewed||state.sortPassed||state.sortRound?.answers.length);case'instruction':return !!state.sortPassed;case'builder':return !!(state.sortPassed&&state.instructionCompleted&&essentialsComplete());case'builder-reward':return !!(canEnterRoute('builder')&&builderReady());case'scenario':return !!(canEnterRoute('builder')&&builderState().completed);case'judgment':return !!(canEnterRoute('scenario')&&state.scenarioFinished);case'takeaway':return !!(canEnterRoute('judgment')&&judgmentCanContinue());case'completion':case'planner':return !!state.complete;default:return false;}}
function routeDestination(value){const r=routeFor(value);if(!r||introRequired()&&r.id!=='welcome')return null;if(canEnterRoute(r.id))return r;if(['completion','planner'].includes(r.id))return null;if(r.id==='sorting')return routeFor('facts');if(['instruction','builder','builder-reward','scenario','judgment','takeaway'].includes(r.id)){if(!state.sortPassed)return routeFor(canEnterRoute('sorting')?'sorting':'facts');if(!state.instructionCompleted||!essentialsComplete())return routeFor('instruction');if(r.id==='builder-reward'&&!builderReady())return routeFor('builder');if(!builderState().completed)return routeFor('builder');if(!state.scenarioFinished)return routeFor('scenario');if(!judgmentCanContinue())return routeFor('judgment');}return null;}
function stepCompleted(id){switch(id){case'welcome':return !introRequired()&&!!state.intro;case'objectives':return !!state.objectivesCompleted;case'facts':return !!state.factsViewed;case'sorting':return !!state.sortPassed;case'instruction':return !!(state.instructionCompleted&&essentialsComplete());case'builder':return !!builderState().completed;case'scenario':return !!state.scenarioFinished;case'judgment':return judgmentFinished();case'takeaway':return !!state.takeawayCompleted;case'completion':return !!state.complete&&!state.previewComplete;default:return false;}}
function courseProgress(){if(state.complete&&!state.previewComplete)return 100;return COURSE_STEPS.reduce((sum,s)=>sum+(stepCompleted(s.id)?s.weight:s.id==='builder'?Math.round(builderState().answers.filter(a=>Number.isInteger(a)&&a>=0&&a<3).length/3*s.weight*.8):s.id==='scenario'&&state.scenarioStarted?Math.round((state.decision+(state.feedbackShown?1:0))/3*s.weight):0),0);}
function routeHeader(value,time=''){const r=routeFor(value),s=COURSE_STEPS.find(x=>x.id===r.step);return sectionHeader(String(stage(r.id)+1).padStart(2,'0')+' / '+s.label.toUpperCase(),time);}
/* Judgment Lab is now complete: clear any "preview complete" state saved by an earlier local preview so progress stays accurate. */
function retirePreviewState(){
 if(CONFIG.localRevisionPreview)return;
 if(!state.previewComplete&&!state.judgment?.previewed)return;
 state.previewComplete=false;state.complete=false;if(state.judgment)state.judgment.previewed=false;
 const id=routeFor(state.page)?.id;
 if(['takeaway','completion','planner'].includes(id)){const next=routeDestination('takeaway');if(next)state.page=next.page;}
 save();
}
function migrateLearningState(){
 if(state.remainingRevision===1)return;
 const previous=routeFor(state.page);state.priorCompletion=state.priorCompletion||!!state.complete;state.complete=false;state.previewComplete=false;
 state.essentialSeen=[...new Set(state.essentialSeen||state.prep||[])].filter(i=>[0,1,2].includes(i));state.instructionCompleted=!!state.instructionCompleted&&essentialsComplete();
 state.objectivesCompleted=!!(state.objectivesCompleted||state.factsViewed||state.sortRound||state.sortPassed);state.visitedRoutes=state.visitedRoutes||[];
 state.builder=state.builder||{part:0,answers:[null,null,null],completed:false};state.judgment=state.judgment||{index:0,answers:[null,null,null],notes:['','',''],previewed:false};state.takeaway=state.takeaway||['','','',''];
 state.remainingRevision=1;state.foundationVersion=1;delete state.foundationResumeRoute;
 if(previous&&['scenario','judgment','takeaway','completion','planner'].includes(previous.id)){const next=routeDestination(previous.id==='completion'||previous.id==='planner'?'takeaway':previous.id);if(next)state.page=next.page;}
 else if(previous)state.page=previous.page;
}
function foundationInstruction(){
 return routeHeader('instruction','2 MIN')+'<h1>Constructive Feedback That Works</h1><section aria-labelledby="story-heading"><h2 id="story-heading">The Story We Tell Ourselves Isn’t Always the Whole Story</h2><p>A fact tells you what happened. An assumption adds a story about why. Before you act on that story, ask about the context.</p><div class="facts-definitions"><section><div class="eyebrow">OBSERVATION</div><p>“Taylor did not contribute verbally during the last three team meetings.”</p></section><section><div class="eyebrow">ASSUMPTION</div><p>“Taylor is no longer interested in the team’s work.”</p></section></div><div class="intro-copy"><div class="eyebrow">CONSTRUCTIVE OPENING</div><p>“Hi, Taylor. I noticed you haven&#39;t been speaking up as much as you usually do in our team meetings. Is everything going okay?”</p></div><p><strong>Describe what you know. Explore what you don’t know.</strong></p></section><section aria-labelledby="elements-heading"><h2 id="elements-heading">Three Essential Elements of Constructive Feedback</h2><p>Keep listening respectfully throughout. Select each element to explore the example.</p>'+[
 {title:'Describe specific, observable behavior without character judgments.',example:t(23),explanation:t(24)},
 {title:'Explore context, clarify expectations, and identify obstacles.',example:t(27),explanation:t(28)},
 {title:'Agree on actions, support, and a realistic follow-up.',example:t(31),explanation:t(32)}
 ].map((item,k)=>'<details data-reveal="prep" data-index="'+k+'" '+(state.prep.includes(k)?'open':'')+'><summary><span><span class="eyebrow">0'+(k+1)+' &nbsp;</span>'+esc(item.title)+'</span></summary><blockquote>'+esc(item.example)+'</blockquote><p>'+esc(item.explanation)+'</p></details>').join('')+'<p id="essential-count" class="notice" role="status" aria-live="polite">'+essentialStatus()+'</p><p>'+esc(t(34))+'</p><p>'+esc(t(147))+'</p></section>'+(state.foundationResumeRoute?'<p class="notice">This instruction has been added to the course. Your saved conversation choices and reflection are still available.</p>':'')+'<div class="actions">'+btn('Back to Card Sort','sorting',true)+'<button class="primary" id="instruction-continue" data-action="instruction-continue" '+(essentialsComplete()?'':'disabled')+'>Build a Conversation <span aria-hidden="true">→</span></button>'+'</div>';
}

