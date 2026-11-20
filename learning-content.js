/* Approved instructional choices; natural reward transcript supplied in the remaining-implementation brief. */
const BUILDER_PARTS=[
  {
    "title": "Open with facts and invite context",
    "prompt": "Name what happened without assuming why.",
    "question": "How would you open the conversation?",
    "productive": 0,
    "choices": [
      {
        "text": "Hey, Laura. Thanks for sitting down with me. I wanted to check in about those Friday reports. We talked about the noon deadline a few weeks ago, but the last two have come in a little late. What's going on?",
        "reaction": "Yeah, I know. It's just... I've had people coming to me with things they need done right away, usually toward the end of the week. And I guess I've been trying to get everything done.",
        "feedback": "This opening identifies the observable performance concern, references the previous conversation, and invites Laura to explain what is happening before suggesting solutions.",
        "label": "Direct and Curious",
        "key": "d1-a"
      },
      {
        "text": "Hey, Laura. I know things have been pretty hectic lately. How are you holding up? I feel like everyone's been juggling a million things.",
        "reaction": "Honestly? It's been a lot. I'm trying to keep up, but yeah, it's definitely been busy.",
        "feedback": "This opening demonstrates empathy and may help Laura feel comfortable, but it does not identify the missed deadline or explain the purpose of the conversation.",
        "label": "Supportive but Indirect",
        "key": "d1-b"
      },
      {
        "text": "Hey, Laura. I wanted to talk about the Friday reports. They've been coming in late, so I was thinking maybe you could start working on them earlier in the week?",
        "reaction": "I mean, I can try. It's just that other things keep coming up, especially toward the end of the week.",
        "feedback": "This approach raises the performance issue and offers a practical idea, but it suggests a solution before exploring what is causing the delays.",
        "label": "Solution Before Understanding",
        "key": "d1-c"
      }
    ]
  },
  {
    "title": "Clarify expectations and resolve competing priorities",
    "prompt": "Make the standard clear—and explain what to do when work conflicts.",
    "question": "What would you clarify next?",
    "productive": 1,
    "choices": [
      {
        "text": "Yeah, I know you've got a lot on your plate. I trust you to figure out what needs attention first. Just keep me posted if things get too hectic.",
        "reaction": "Okay, yeah. I can do that. I guess sometimes it's just hard to know what should come first.",
        "feedback": "The supervisor communicates trust and support, but Laura still lacks clear guidance about which tasks take priority when requests conflict.",
        "label": "Supportive but Vague",
        "key": "d2-a"
      },
      {
        "text": "Got it. Well, the Friday report still needs to be in by noon. If something comes up that might push it back, just check with me before switching gears. And if you can't reach me, stick with the report and send me a quick heads-up.",
        "reaction": "Okay, yeah. That would actually help. I wasn't sure what you wanted me to do when someone says something's urgent.",
        "feedback": "This response clearly reinforces the Friday noon deadline and provides a practical process for managing competing priorities, including what to do when the supervisor is unavailable.",
        "label": "Clear Expectations and Guidance",
        "key": "d2-b"
      },
      {
        "text": "Why don't we go through everything you've got on your plate right now and figure out what can wait? That way, we can make sure Friday's report gets done.",
        "reaction": "Yeah, we can do that. I just worry it'll happen again next week when new requests start coming in.",
        "feedback": "Reviewing the current workload together provides immediate support, but the supervisor has not established how Laura should handle future competing requests independently.",
        "label": "Helpful but Overly Directive",
        "key": "d2-c"
      }
    ]
  },
  {
    "title": "Establish actions, support, and follow-up",
    "prompt": "Agree on what happens next, when, and how you’ll review it.",
    "question": "How would you turn the discussion into a workable plan?",
    "productive": 2,
    "choices": [
      {
        "text": "How about you try setting aside some time earlier in the week for the report? Give that a shot for the next couple of weeks, and we'll see how things go.",
        "reaction": "Yeah, I can try that. Hopefully that'll give me enough time to get everything done.",
        "feedback": "This response suggests a practical improvement, but does not establish a specific review date or determine how the supervisor will support Laura if the strategy does not work.",
        "label": "Reasonable Idea, No Clear Follow-Up",
        "key": "d3-a"
      },
      {
        "text": "Okay, let's do this. Send me a quick update after Friday's report is in, and I'll take a look. If we're still running into problems, we can figure out what to change.",
        "reaction": "Okay, that works. I'll let you know how Friday goes.",
        "feedback": "This creates a way to review the outcome, but does not proactively address the barriers that might prevent Laura from meeting the next deadline.",
        "label": "Checks the Result, Doesn't Plan Ahead",
        "key": "d3-b"
      },
      {
        "text": "Yeah, I can see how that'd be frustrating. How about we block off Thursday morning for the report? We can touch base Wednesday to make sure nothing else is getting in the way, and then check in Monday to see how it went. Sound good?",
        "reaction": "Yeah, I think that would work. Having that time set aside would help. Thanks.",
        "feedback": "This establishes a specific action, advance support, and a scheduled follow-up while inviting Laura to participate in the plan.",
        "label": "Collaborative Plan and Follow-Up",
        "key": "d3-c"
      }
    ]
  }
];
const LAURA_CONVERSATION=[
 {speaker:'Supervisor',text:"Hey, Laura. Thanks for sitting down with me. I wanted to check in about those Friday reports. We talked about the noon deadline a few weeks ago, but the last two have come in a little late. What's going on?"},
 {speaker:'Laura',text:"Yeah, I know. It's just... I've had people coming to me with things they need done right away, usually toward the end of the week. And I guess I've been trying to get everything done."},
 {speaker:'Supervisor',text:"Okay, that makes sense. So when those requests come in, you're having to decide what takes priority?"},
 {speaker:'Laura',text:"Pretty much. And sometimes I don't really know which one should come first."},
 {speaker:'Supervisor',text:"Got it. Well, the Friday report still needs to be in by noon. So if something comes up that might push it back, just check with me before switching gears. And if you can't reach me, stick with the report and send me a quick heads-up."},
 {speaker:'Laura',text:"Okay, yeah. That would actually help. I wasn't sure what you wanted me to do when someone says something's urgent."},
 {speaker:'Supervisor',text:"Yeah, I can see how that'd be frustrating. How about we block off Thursday morning for the report? We can also touch base Wednesday to make sure nothing else is getting in the way."},
 {speaker:'Laura',text:"Yeah, I think that would work."},
 {speaker:'Supervisor',text:"Perfect. Let's try it this week, and then we can check in Monday for a few minutes and see how it went. Sound good?"},
 {speaker:'Laura',text:'Sounds good. Thanks.'}
];
/* Approved Judgment Lab content (unscored). "preferred" marks the approved preferred response for authoring and review; it is not shown to learners. */
const JUDGMENT_SCENARIOS=[
 {id:'quiet',title:'The Quiet Contributor',context:"Taylor has been participating less frequently in team meetings, although their work quality remains strong.",question:"How would you approach Taylor?",goal:'Distinguish observable behavior from assumptions and invite the employee’s perspective.',preferred:1,choices:[
  {text:"Hi, Taylor. I've noticed you've been quieter during meetings lately. Is something making it difficult for you to participate?",feedback:"This opens a supportive conversation, but it assumes something is preventing Taylor from participating. There may be no underlying problem."},
  {text:"Hi, Taylor. I noticed you haven't been speaking up as much as you usually do in our team meetings. Is everything going okay?",feedback:"This identifies a specific change without assuming why it's happening. It gives Taylor an opportunity to explain while keeping the conversation supportive."},
  {text:"Hey, Taylor. I just wanted to check in and see how everything's been going lately. Anything you want to talk about?",feedback:"This is approachable and supportive, but it doesn't explain what prompted the check-in. Taylor may not realize the supervisor has noticed a change in participation."}
 ]},
 {id:'priorities',title:'Competing Priorities',context:"Morgan consistently completes assigned work, but unexpected requests from other departments have begun interfering with agreed-upon deadlines. Morgan says that every request seems urgent.",question:"What would you say next?",goal:'Establish clear expectations and define when requests should be escalated.',preferred:0,choices:[
  {text:"Let's look at which requests actually need immediate attention and which can wait. Going forward, if something new might affect an existing deadline, check with me so we can decide what takes priority.",feedback:"This helps Morgan distinguish urgent work from competing demands and establishes when to ask for guidance. It supports independent decision-making without leaving Morgan to resolve conflicting expectations alone."},
  {text:"I trust your judgment, Morgan. Just focus on what seems most important at the time, and let me know if you run into any problems.",feedback:"This communicates trust, but Morgan has already expressed uncertainty about priorities. Without clearer guidance, the same conflicts may continue."},
  {text:"Why don't we meet for a few minutes every morning? We can go through your requests together and decide what you should work on first.",feedback:"Regular check-ins could provide immediate support, but requiring the supervisor to approve daily priorities may create unnecessary dependence. A clearer decision-making process would help Morgan work more independently."}
 ]},
 {id:'followup',title:'The Follow-Up Dilemma',context:"Jordan has occasionally submitted client records with missing information. During your conversation, Jordan suggests using a checklist before submitting each record.",question:"How would you respond to Jordan's suggestion?",goal:'Agree on specific expectations, a practical improvement strategy, and a defined review point.',preferred:2,choices:[
  {text:"I like that idea, Jordan. Let's try the checklist and see whether it helps. We can check in later to talk about how it's going.",feedback:"This encourages Jordan's initiative and supports improvement, but it leaves the checklist requirements and follow-up timing unclear."},
  {text:"That sounds like a good solution. Go ahead and use the checklist, and let me know if you have any more issues with the records.",feedback:"This gives Jordan ownership, but the supervisor hasn't established how success will be evaluated or when the results will be reviewed. The responsibility for identifying continued problems rests entirely with Jordan."},
  {text:"That's a good idea. Let's agree on what needs to be included in every record, then try the checklist for your next five cases. We can review those together on Friday and see how well it's working.",feedback:"This builds on Jordan's suggestion while establishing clear standards, a manageable trial, and a specific follow-up. Both the employee and supervisor have a role in evaluating progress."}
 ]}
];
const TAKEAWAY_PROMPTS=[
 {title:'What do I know?',hint:'Observable facts.'},
 {title:'What am I assuming?',hint:'Unverified motives or interpretations.'},
 {title:'What needs to change?',hint:'Clear expectations.'},
 {title:'What happens next?',hint:'Actions, support, and follow-up.'}
];
