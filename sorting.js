/* Uses the course renderer, storage and navigation; no external dependencies. */
const SORT_ROUND_SIZE=10;
const SORT_PASS_ACCURACY=0.8;
function ensureSortRound(){
 if(state.sortRound?.ids?.length===SORT_ROUND_SIZE)return;
 state.sortPending=null;
 const previous=new Set(state.sortRound?.ids||[]);
 const shuffle=items=>{for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}return items;};
 const topics=shuffle(Array.from({length:window.SORTING_PAIRS.length},(_,i)=>i)).slice(0,SORT_ROUND_SIZE);
 const types=shuffle(Array.from({length:SORT_ROUND_SIZE},(_,i)=>i%2));
 let ids=topics.map((topic,i)=>topic*2+types[i]);
 // Avoid an identical round, while keeping ten cards of each category.
 if(ids.every(id=>previous.has(id)))ids=ids.map(id=>id^1);
 state.sortRound={ids,answers:[],round:(state.sortRound?.round||0)+1};save();
}
function sortCard(id){const pair=window.SORTING_PAIRS[Math.floor(id/2)];return {text:pair[id%2===0?1:2],category:id%2===0?'characterization':'observable',reason:window.SORTING_EXPLANATIONS[Math.floor(id/2)][id%2]};}
function sortScore(){return state.sortRound.answers.filter((answer,i)=>answer===sortCard(state.sortRound.ids[i]).category).length;}
function sortPage(){
 ensureSortRound();const round=state.sortRound,n=round.answers.length,score=sortScore();
 save();
 let html=routeHeader('sorting','10 STATEMENTS')+'<h1>Facts or characterizations?</h1><p class="lede">Some feedback sounds specific until you look a little closer.</p><p>Sort each statement as <strong>observable behavior</strong> or a <strong>characterization</strong>. Classify all <strong>10 statements</strong>, then select <strong>Submit Round</strong> to see your accuracy. Score at least <strong>8 out of 10 (80%)</strong> to continue to training, or choose another practice round. Each card counts once; feedback follows your choice.</p>';
 html+=sortTracker();
 if(n===SORT_ROUND_SIZE&&!round.submitted){html+='<div class="sort-result"><h2>Ready to submit?</h2><p>You have answered all 10 statements. Submit your round to see your percentage and next steps.</p><div class="actions">'+btn('Submit Round','sort-submit')+'</div></div>';}
 else if(n===SORT_ROUND_SIZE){const passed=score/SORT_ROUND_SIZE>=SORT_PASS_ACCURACY;
 html+=`<div class="sort-result"><div class="eyebrow">ROUND ${round.round} RESULTS</div><h2>${score} / ${SORT_ROUND_SIZE} · ${Math.round(score/SORT_ROUND_SIZE*100)}%</h2><p>${passed?'You met the 80% goal. Ready for the conversation, or want to keep sharpening your eye?':state.sortPassed?'This practice round is below 80%. Your earlier passing result still unlocks the training.':'You need 8 out of 10 correct (80%) to continue. Review your feedback, then try another round.'}</p><div class="actions">${state.sortPassed?btn(state.scenarioStarted?'Resume the Conversation':'Continue to the Training','scenario'):''}${btn(state.sortPassed?'Continue Practicing':'Try Another Round','sort-new',true)}</div></div>`;
 html+='<h2>Your round, reviewed</h2>'+round.ids.map((id,i)=>{const card=sortCard(id),correct=round.answers[i]===card.category;return `<details><summary><span>${correct?'✓ Correct':'↻ Review'} · Card ${i+1}</span></summary><blockquote>${esc(card.text)}</blockquote><p>Your choice: <strong>${sortLabel(round.answers[i])}</strong>. Classification: <strong>${sortLabel(card.category)}</strong>.</p><p>${esc(card.reason)}</p></details>`;}).join('');
 }else{
 const card=sortCard(round.ids[n]),chosen=state.sortPending;
 html+=`<div class="sort-meta"><span>ROUND ${round.round} · CARD ${n+1} OF ${SORT_ROUND_SIZE}</span><span>${n+(state.sortPending?1:0)} answered</span></div><div id="sort-card" class="sort-card" ${chosen?'':'data-draggable="true"'} tabindex="0" aria-label="Statement to classify"><span class="eyebrow">THE STATEMENT</span><blockquote>“${esc(card.text)}”</blockquote><p class="notice">Drag to a category, or choose a category with its button.</p></div><div class="sort-bins"><button class="sort-bin" data-sort="observable" ${chosen?'disabled':''}><strong>Observable behavior</strong><span>Choose this category</span></button><button class="sort-bin" data-sort="characterization" ${chosen?'disabled':''}><strong>Characterization</strong><span>Choose this category</span></button></div>`;
 if(chosen){const correct=chosen===card.category;html+=`<div class="feedback" tabindex="-1" id="sort-feedback" role="status" aria-describedby="sort-live-summary"><div class="eyebrow">${correct?'CORRECT':'TAKE ANOTHER LOOK'}</div><p>This is <strong>${sortLabel(card.category).toLowerCase()}</strong>.</p><p>${esc(card.reason)}</p></div><div class="actions">${btn(n===SORT_ROUND_SIZE-1?'Finish Round':'Next Statement','sort-next')}</div>`;}
 if(state.sortPassed)html+=`<p class="notice">You met the 80% goal. Continue to the training now, or keep practicing—your choice. Your access stays unlocked.</p><div class="actions">${btn(state.scenarioStarted?'Resume the Conversation':'Continue to the Training','scenario',true)}</div>`;
 }
 return html;
}
function sortLabel(category){return category==='observable'?'Observable behavior':'Characterization';}
function chooseSort(category){if(state.page!==8||state.sortPending||state.sortRound.answers.length>=SORT_ROUND_SIZE||!['observable','characterization'].includes(category))return;state.sortPending=category;save();render();main.querySelector('#sort-feedback')?.focus();}
function finishSortCard(){if(!state.sortPending)return;state.sortRound.answers.push(state.sortPending);state.sortPending=null;save();render();}
function sortingAction(action){if(action==='sorting'){go(8);return true;}if(action==='sort-next'){finishSortCard();return true;}if(action==='sort-submit'){if(state.sortRound.answers.length!==SORT_ROUND_SIZE)return true;state.sortRound.submitted=true;if(sortScore()/SORT_ROUND_SIZE>=SORT_PASS_ACCURACY){state.sortPassed=true;state.sortBest=Math.max(state.sortBest||0,Math.round(sortScore()/SORT_ROUND_SIZE*100));}save();render();return true;}if(action==='sort-new'){const previous=state.sortRound;state.sortRound=null;state.sortPending=null;ensureSortRound();state.sortRound.round=(previous?.round||0)+1;save();render();return true;}return false;}
/* Pointer dragging works from any child of the statement card on mouse, pen and touch. */
let sortDrag=null;
function sortDropTarget(x,y){const target=document.elementFromPoint(x,y)?.closest('[data-sort]');return target&&!target.disabled?target:null;}
function clearSortDrag(){
 if(!sortDrag)return;const drag=sortDrag;sortDrag=null;
 if(drag.frame)cancelAnimationFrame(drag.frame);
 drag.ghost?.remove();document.querySelectorAll('.sort-drop-active').forEach(el=>el.classList.remove('sort-drop-active'));
 drag.card.classList.remove('sort-dragging');if(drag.card.hasPointerCapture?.(drag.id))drag.card.releasePointerCapture(drag.id);
}
function paintSortDrag(){
 const drag=sortDrag;if(!drag?.active)return;
 drag.ghost.style.left=(drag.x-140)+'px';drag.ghost.style.top=(drag.y-35)+'px';
 document.querySelectorAll('.sort-drop-active').forEach(el=>el.classList.remove('sort-drop-active'));
 sortDropTarget(drag.x,drag.y)?.classList.add('sort-drop-active');
 const edge=70;const speed=drag.y>window.innerHeight-edge?14:drag.y<edge?-14:0;
 if(speed)window.scrollBy(0,speed);
 drag.frame=requestAnimationFrame(paintSortDrag);
}
document.addEventListener('pointerdown',e=>{
 const card=e.target.closest?.('#sort-card[data-draggable]');if(!card||state.page!==8||state.sortPending||(e.button!==undefined&&e.button!==0))return;
 sortDrag={card,id:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,active:false};card.setPointerCapture(e.pointerId);
});
document.addEventListener('pointermove',e=>{
 const drag=sortDrag;if(!drag||drag.id!==e.pointerId)return;drag.x=e.clientX;drag.y=e.clientY;
 if(!drag.active&&Math.hypot(drag.x-drag.startX,drag.y-drag.startY)>8){
  drag.active=true;drag.card.classList.add('sort-dragging');drag.ghost=document.createElement('div');drag.ghost.className='sort-drag-ghost';drag.ghost.setAttribute('aria-hidden','true');drag.ghost.textContent=drag.card.querySelector('blockquote').textContent;document.body.appendChild(drag.ghost);paintSortDrag();
 }
 if(drag.active)e.preventDefault();
},{passive:false});
document.addEventListener('pointerup',e=>{
 if(!sortDrag||sortDrag.id!==e.pointerId)return;const target=sortDrag.active?sortDropTarget(e.clientX,e.clientY):null;
 clearSortDrag();if(target){e.preventDefault();chooseSort(target.dataset.sort);}
});
document.addEventListener('pointercancel',clearSortDrag);
window.addEventListener('blur',clearSortDrag);

function sortMetrics(){
 const n=state.sortRound.answers.length;
 const pending=n<SORT_ROUND_SIZE&&!!state.sortPending;
 const answered=n+(pending?1:0);
 const correct=sortScore()+(pending&&state.sortPending===sortCard(state.sortRound.ids[n]).category?1:0);
 return {answered,correct,accuracy:answered?Math.round(correct/answered*100):0,completion:Math.round(answered/SORT_ROUND_SIZE*100)};
}
function sortTracker(){
 const {answered,completion}=sortMetrics();
 return '<section class="sort-tracker" aria-label="Live card sorting progress"><div class="sort-accuracy"><div class="eyebrow">STATEMENTS ANSWERED</div><strong>'+answered+'<span> / 10</span></strong><span class="sort-target">Goal: 80% after submission</span></div><div class="sort-progress-detail"><label for="sort-round-progress">Round progress <strong>'+completion+'%</strong></label><progress id="sort-round-progress" value="'+answered+'" max="10"></progress><p id="sort-live-summary" aria-live="polite">'+(state.sortRound.submitted?'Round submitted. Your results are below.':answered===10?'All statements answered. Submit your round to see your accuracy.':'Complete all 10 statements, then submit to see your accuracy.')+'</p></div></section>';
}
