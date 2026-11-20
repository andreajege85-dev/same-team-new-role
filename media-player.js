/* Shared audio-caption support. Timing comes only from supplied WebVTT or verified timing data. */
const captionCache=new Map();
function courseMedia(){return main.querySelector('video[data-kind]')||main.querySelector('audio[data-kind]');}
function cueSeconds(value){const parts=value.trim().split(':').map(Number);if(parts.some(n=>!Number.isFinite(n)))return NaN;return parts.length===3?parts[0]*3600+parts[1]*60+parts[2]:parts.length===2?parts[0]*60+parts[1]:NaN;}
function parseWebVtt(text){
 if(!text.replace(/^\uFEFF/,'').startsWith('WEBVTT'))throw Error('Invalid WebVTT');
 return text.replace(/\r\n/g,'\n').split(/\n\s*\n/).flatMap(block=>{const lines=block.trim().split('\n'),i=lines.findIndex(l=>l.includes('-->'));if(i<0)return [];const times=lines[i].split('-->'),start=cueSeconds(times[0]),end=cueSeconds(times[1].trim().split(/\s+/)[0]);if(!Number.isFinite(start)||end<=start)throw Error('Invalid caption timing');return [{id:i>0?lines[i-1]:'',start,end,text:lines.slice(i+1).join('\n').replace(/<[^>]*>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')}];});
}
function loadCaptions(src){if(!captionCache.has(src))captionCache.set(src,fetch(src).then(r=>{if(!r.ok)throw Error('Captions unavailable');return r.text();}).then(parseWebVtt).catch(e=>{captionCache.delete(src);throw e;}));return captionCache.get(src);}
function reactionMedia(kind){
 const m=mediaSettings(kind),visible=state.captionsVisible!==false;
 return '<div class="reaction-still-player" data-reaction="'+esc(kind)+'"><figure class="reaction-scene">'+(m.image?'<img src="'+esc(m.image)+'" alt="Andretti Hussege seated across the office desk in his charcoal shirt.">':'<div class="media-pending">Andretti’s reaction image is not available. His dialogue remains below.</div>')+'<figcaption>Andretti Hussege</figcaption><div class="audio-captions reaction-caption" id="reaction-caption" aria-live="off" aria-label="Andretti reaction captions" hidden></div></figure>'+(m.reactionAudio?'<audio id="'+esc(kind)+'-audio" data-kind="'+esc(kind)+'" controls preload="metadata" aria-label="Andretti Hussege reaction audio" src="'+esc(m.reactionAudio)+'"></audio>':'<p class="notice">Reaction audio pending. Read Andretti’s dialogue below.</p>')+'<div class="video-tools"><button class="secondary cc-button" data-action="captions" aria-pressed="'+(!!m.captions&&visible)+'" '+(m.captions?'':'disabled')+'>CC <span>'+(m.captions?'Captions '+(visible?'on':'off'):'Captions pending')+'</span></button><p class="notice" id="'+esc(kind)+'-media-status" role="status">'+(m.captions?'English captions available.':'English captions pending; full dialogue is below.')+'</p></div></div>';
}
function bindReactionAudio(player){
 const key=player.dataset.kind,revision=interactionRevision,source=mediaSettings(key).captions;let cues=[];
 const sync=()=>{if(!interactionGuard(revision,key))return;const caption=main.querySelector('#reaction-caption'),button=main.querySelector('.cc-button'),visible=state.captionsVisible!==false,active=cues.filter(c=>player.currentTime>=c.start&&player.currentTime<c.end).map(c=>c.text).join('\n');if(caption){caption.textContent=active;caption.hidden=!visible||!active;}if(button){button.setAttribute('aria-pressed',String(visible&&!!source));button.innerHTML='CC <span>Captions '+(visible?'on':'off')+'</span>';}};
 player.addEventListener('timeupdate',sync);player.addEventListener('seeked',sync);
 const button=main.querySelector('.cc-button');button?.addEventListener('click',()=>{state.captionsVisible=state.captionsVisible===false;save();sync();});
 player.addEventListener('ended',()=>{if(interactionGuard(revision,key))revealFeedback();});
 player.addEventListener('error',()=>{if(interactionGuard(revision,key))main.querySelector('#'+key+'-media-status').textContent='Reaction audio could not load. You can read Andretti’s response and continue to feedback.';});
 if(source)loadCaptions(source).then(data=>{cues=data;sync();}).catch(()=>{if(interactionGuard(revision,key)){if(button)button.disabled=true;main.querySelector('#'+key+'-media-status').textContent='Captions could not load. Andretti’s complete dialogue is below.';}});
}
function bindImageFallbacks(){main.querySelectorAll('.reaction-scene img,.conversation-scene img').forEach(image=>image.addEventListener('error',()=>{image.hidden=true;const figure=image.closest('figure'),caption=figure?.querySelector('figcaption');if(caption)caption.textContent+=' · Image unavailable; dialogue remains accessible.';}));}
