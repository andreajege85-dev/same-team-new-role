/* Update these paths when final media is ready. No build step is required. */
window.COURSE_MEDIA = {
  introVideo: 'assets/intro/intro-stnr-v1.mp4',
  // Change this revision whenever you replace the video, even at the same path.
  introRevision: 'Intro_Video_STNR-2026-11-14-v1',
  // Set this to the verified WebVTT file once the actual audio is transcribed.
  introCaptions: '',
  greetingVideo: '',
  greetingCaptions: '',
  plannerUrl: '',
  d2BridgeAudio: 'assets/scenario/d2-bridge-v1.mp3',
  d1cBridgeAudio: 'assets/scenario/d1c-bridge-v1.mp3',
  // Shared employee continuation audio, reused for all choices in a decision.
  followUps: { d1: 'assets/scenario/d1-followup-v1.mp3', d2: 'assets/scenario/d2-followup-v1.mp3', d3: 'assets/scenario/d3-followup-v1.mp3' },
  // Nine separate slots. Set video and captions paths as each reaction clip is supplied.
  reactions: {
    'd1-a': { video: 'assets/scenario/d1-a-v2.mp4', captions: '', supervisorAudio: 'assets/scenario/supervisor-d1a-v1.mp3', supervisorAudioFile: 'Supervisor_D1A.mp3' },
    'd1-b': { video: 'assets/scenario/d1-b-v3.mp4', captions: '', supervisorAudio: 'assets/scenario/supervisor-d1b-v1.mp3', supervisorAudioFile: 'D1_Supervisor_B.mp3' },
    'd1-c': { video: 'assets/scenario/d1-c-v3.mp4', captions: '', supervisorAudio: 'assets/scenario/supervisor-d1c-v1.mp3', supervisorAudioFile: 'D1_Supervisor_C.mp3' },
    'd2-a': { video: 'assets/scenario/d2-a-v1.mp4', captions: '', supervisorAudio: 'assets/scenario/supervisor-d2a-v1.mp3', supervisorAudioFile: 'D2_OA.mp3' },
    'd2-b': { video: 'assets/scenario/d2-b-v2.mp4', captions: '', supervisorAudio: 'assets/scenario/supervisor-d2b-v1.mp3', supervisorAudioFile: 'D2_Supervisor_B.mp3' },
    'd2-c': { video: 'assets/scenario/d2-c-v2.mp4', captions: '', supervisorAudio: 'assets/scenario/supervisor-d2c-v1.mp3', supervisorAudioFile: 'D2_Supervisor_C.mp3' },
    'd3-a': { video: 'assets/scenario/d3-a-v1.mp4', captions: '', supervisorAudio: 'assets/scenario/supervisor-d3a-v1.mp3', supervisorAudioFile: 'D3_Supervisor_A.mp3' },
    'd3-b': { video: 'assets/scenario/d3-b-v2.mp4', captions: '', supervisorAudio: 'assets/scenario/supervisor-d3b-v1.mp3', supervisorAudioFile: 'D3_Supervisor_B.mp3' },
    'd3-c': { video: 'assets/scenario/d3-c-v1.mp4', captions: '', supervisorAudio: 'assets/scenario/supervisor-d3c-v1.mp3', supervisorAudioFile: 'D3_Supervisor_C.mp3' }
  }
};
