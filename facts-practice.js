/* Ungraded preparation; these statements are separate from the scored card bank. */
const FACTS_PRACTICE=[
 {statement:'Jordan has missed two Friday noon deadlines, even after we discussed the expectation.',correct:0,feedback:'This identifies a specific, verifiable pattern without assuming why it happened.'},
 {statement:"Casey doesn't seem particularly committed to meeting our team's deadlines.",correct:1,feedback:"This interprets Casey's motivation rather than describing a specific action."},
 {statement:"Morgan interrupted two coworkers during Monday's meeting.",correct:0,feedback:'Even though the behavior may be undesirable, it is observable and specific.'}
];
function factsPracticeState(){
 if(!state.factsPractice||state.factsPractice.version!==1)state.factsPractice={version:1,index:0,answers:[null,null,null]};
 return state.factsPractice;
}
function factsSlideContent(index){
 const p=factsPracticeState(),q=FACTS_PRACTICE[index],answer=p.answers[index],answered=answer===0||answer===1;
 return '<blockquote class="facts-statement" id="facts-statement-'+index+'" tabindex="-1">“'+esc(q.statement)+'”</blockquote><div class="choices">'+['Observable behavior','Characterization'].map((label,i)=>'<button class="choice" data-facts-choice="'+i+'" data-facts-index="'+index+'" aria-pressed="'+(answer===i)+'"><span aria-hidden="true">'+String.fromCharCode(65+i)+'</span>'+label+'</button>').join('')+'</div>'+(answered?'<div class="feedback" id="facts-feedback-'+index+'" tabindex="-1" role="status"><div class="eyebrow">'+(answer===q.correct?'YES—THAT FITS':'TAKE ANOTHER LOOK')+'</div><p>'+(answer===q.correct?'':'This is '+(q.correct===0?'observable behavior':'a characterization')+'. ')+esc(q.feedback)+'</p></div>':'<p class="notice">Choose a category to see feedback before continuing. This practice does not affect your score.</p>');
}
function factsCarouselControls(){
 const p=factsPracticeState(),answered=p.answers[p.index]===0||p.answers[p.index]===1;
 return '<button class="secondary" data-action="facts-back" '+(p.index===0?'disabled':'')+'>Back</button>'+(p.index<2?'<button class="primary" data-action="facts-next" '+(answered?'':'disabled')+'>Next <span aria-hidden="true">→</span></button>':'<button class="primary" data-action="facts-continue" '+(p.answers.every(a=>a===0||a===1)?'':'disabled')+'>Finish Practice &amp; Start Card Sort <span aria-hidden="true">→</span></button>');
}
function factsFirstPage(){
 const p=factsPracticeState();
 return sectionHeader('03 / BEFORE THE CARD SORT','60–90 SEC')+'<h1>Facts First, Labels Later</h1><p class="lede">Start with what happened, rather than what you assume it means.</p><div class="facts-definitions"><section><h2>Observable behavior</h2><p>An action that can be seen, heard, or verified.</p><blockquote>“The report arrived at 2 p.m. instead of noon”</blockquote></section><section><h2>Characterization</h2><p>A judgment or assumption about personality, attitude, or intentions.</p><blockquote>“You’re clearly not taking your responsibilities seriously.”</blockquote></section></div><p>Behavior-based feedback is <strong>specific</strong>: it identifies what happened. It is <strong>actionable</strong>: the employee can understand what to change. By focusing on actions rather than judging the person, it is <strong>less likely to create defensiveness</strong> and leaves room to understand their perspective.</p><section class="facts-practice" aria-labelledby="facts-question" aria-roledescription="carousel"><div class="facts-carousel-meta"><div class="eyebrow">TRY IT · NOT SCORED</div><span id="facts-question-count" aria-live="polite">Question '+(p.index+1)+' of 3</span></div><progress id="facts-practice-progress" aria-label="Practice question progress" max="3" value="'+(p.index+1)+'"></progress><h2 id="facts-question">How would you classify this statement?</h2><div class="facts-carousel-window"><div class="facts-carousel-track" id="facts-carousel-track" style="transform:translateX(-'+(p.index*100)+'%)">'+FACTS_PRACTICE.map((q,i)=>'<div class="facts-slide" id="facts-slide-'+i+'" data-slide-index="'+i+'" role="group" aria-roledescription="slide" aria-label="Question '+(i+1)+' of 3" aria-hidden="'+(p.index!==i)+'" '+(p.index!==i?'inert':'')+'>'+factsSlideContent(i)+'</div>').join('')+'</div></div><div class="actions facts-carousel-controls" id="facts-carousel-controls">'+factsCarouselControls()+'</div></section><div class="actions">'+btn('Back to Learning Objectives','objectives',true)+'</div>';
}
function refreshFactsCarousel(move=false){
 const p=factsPracticeState();
 if(!move)main.querySelector('#facts-slide-'+p.index).innerHTML=factsSlideContent(p.index);
 main.querySelector('#facts-carousel-track').style.transform='translateX(-'+(p.index*100)+'%)';
 main.querySelectorAll('.facts-slide').forEach((slide,i)=>{slide.inert=i!==p.index;slide.setAttribute('aria-hidden',String(i!==p.index));});
 main.querySelector('#facts-question-count').textContent='Question '+(p.index+1)+' of 3';
 main.querySelector('#facts-practice-progress').value=p.index+1;
 main.querySelector('#facts-carousel-controls').innerHTML=factsCarouselControls();
 main.querySelector(move?'#facts-statement-'+p.index:'#facts-feedback-'+p.index)?.focus({preventScroll:true});
}
function moveFactsPractice(delta){
 if(state.page!==9)return;const p=factsPracticeState();
 if(delta===1&&p.answers[p.index]!==0&&p.answers[p.index]!==1)return;
 const index=p.index+delta;if(index<0||index>=3)return;
 p.index=index;save();refreshFactsCarousel(true);
}
