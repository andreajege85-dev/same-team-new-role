/* Current approved branching dialogue; three supervisor choices revised November 17, 2026. */
window.REVISED_SCENARIO = [
  {
    "title": "Opening the Conversation",
    "question": "How would you begin the conversation?",
    "time": "3 min",
    "merge": "Part of the difficulty is deciding what to do when a last-minute request conflicts with finishing the report.",
    "choices": [
      {
        "say": "Thanks for meeting with me. The last two Friday reports came in after noon. Before we talk about next steps, how has the Friday workload been going?",
        "reaction": "It's been tight. A few requests have come in late in the week, and I've been trying to finish those alongside the report.",
        "feedback": "Establishes the facts and invites context, although the broad workload question may need a more focused follow-up."
      },
      {
        "say": "Andretti, I'm starting to think your Friday reports have their own time zone. Unfortunately, ours still says noon.",
        "reaction": "Wow. Okay. I know they've been late, but I've actually been working pretty hard to keep up.",
        "feedback": "Sarcasm may seem harmless, especially between former peers, but it can make an employee feel criticized rather than supported. Focus on the missed deadlines without making the conversation personal."
      },
      {
        "say": "Andretti, before we get into anything else, how are you holding up with the Friday workload? I know things have been pretty hectic lately. Honestly, I think we're all overdue for a vacation.",
        "reaction": "Ha! Seriously. Anyway, what's up? You needed something?",
        "feedback": "This approach builds rapport and acknowledges workload pressures, but it doesn't clearly introduce the missed deadlines. A supportive opening is useful, provided the supervisor transitions into a specific discussion of the performance concern."
      }
    ]
  },
  {
    "title": "Clarifying Expectations",
    "question": "How would you clarify what needs to happen?",
    "time": "3 min",
    "merge": "I can start the report on Thursday. Checking priorities earlier in the week would make that easier to protect.",
    "choices": [
      {
        "say": "The report needs to be submitted by noon every Friday. If another request could interfere, check with me before switching priorities. Would that give you enough direction?",
        "reaction": "Yes, that would give me a clearer starting point. If you're unavailable, I'd want to know whether to keep working on the report.",
        "feedback": "Establishes a clear deadline and a way to resolve conflicts, while revealing the need for a backup arrangement."
      },
      {
        "say": "I know you've been juggling a lot, and I appreciate the effort you're putting in. Let's make sure the Friday reports are submitted by noon. I'd like you to manage the other requests as they come in and use your best judgment about what needs immediate attention.",
        "reaction": "Okay... I'll do my best. But I'm still not sure what you want me to do when everything feels urgent.",
        "feedback": "This approach acknowledges effort, reinforces the deadline, and encourages independence. However, it leaves Andretti without clear guidance for handling competing urgent requests. Autonomy works best when expectations and escalation procedures are understood."
      },
      {
        "say": "Andretti, it's a report, not a rocket launch. I really shouldn't have to explain how deadlines work.",
        "reaction": "I know how deadlines work. I'm trying to explain that other requests keep coming in, and I don't always know which one takes priority.",
        "feedback": "Dismissing the employee's concerns can increase defensiveness and discourage communication. Understanding competing responsibilities is essential to developing a workable solution."
      }
    ]
  },
  {
    "title": "Establishing Follow-Up",
    "question": "How would you close the conversation?",
    "time": "4 min",
    "merge": "That gives me something to think about. A short recap would help me keep the deadline and next steps straight.",
    "choices": [
      {
        "say": "Let's check priorities Wednesday morning, and have you flag any remaining risk by Thursday noon. We'll keep Friday at noon as the deadline and meet Monday for ten minutes to review. Is that workable?",
        "reaction": "Yes. I can bring my current requests on Wednesday. If something new comes in after Thursday noon, I'll still need to raise it with you.",
        "feedback": "Establishes clear checkpoints, support, and follow-up. Any new risks should still be communicated as they arise."
      },
      {
        "say": "Here's the plan. No more late reports. Ever. And if Friday rolls around and that report isn't on my desk by noon, we're going to have a very different conversation.",
        "reaction": "Okay... but what happens if another urgent request comes in? I can't exactly make more hours appear in the day.",
        "feedback": "Threatening consequences without addressing known barriers does not create a realistic improvement plan. Accountability should include clear steps, available support, and reasonable follow-up."
      },
      {
        "say": "I'd like you to take ownership of the next report and apply what we've discussed. Let's see how the new approach works this Friday, and we can make adjustments if needed. I think that gives us a good starting point.",
        "reaction": "Uh, sure. I'll give it a shot. So... are we done?",
        "feedback": "This approach encourages ownership and allows for adjustments, but doesn't establish specific checkpoints, a process for communicating obstacles, or a scheduled follow-up. Employee independence should be supported by clear expectations and accountability."
      }
    ]
  }
];
