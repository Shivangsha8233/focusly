import { PeerProfile, ChatMessage } from "../types/chat";

export const PEER_PROFILES: PeerProfile[] = [
  {
    id: "maya-r",
    rank: 1,
    name: "Maya R.",
    avatarBg: "#FFE3B0",
    avatarColor: "#7E5700",
    tasksDone: 6,
    streak: 12,
    points: 240,
    focusTask: "Drafting chapter 3 summary with 25m Pomodoro",
    status: "focusing",
    bio: "ADHD college student • Master of the 5-minute kickoff trick",
    quickCheers: [
      "🔥 You're on fire today, keep that momentum!",
      "🙌 How do you handle starting when you're overwhelmed?",
      "☕ Don't forget to take a quick water break!",
      "💪 High five on the 12-day streak!",
    ],
  },
  {
    id: "kiran-p",
    rank: 3,
    name: "Kiran P.",
    avatarBg: "#CFEBDD",
    avatarColor: "#1D5E3B",
    tasksDone: 3,
    streak: 9,
    points: 110,
    focusTask: "Organizing weekly meal prep checklist",
    status: "focusing",
    bio: "Design lead • Low-stimulation routines & soundscape enthusiast",
    quickCheers: [
      "🌿 Love your calm pace today!",
      "🎧 What kind of background sound do you use to focus?",
      "👏 9 days in a row is huge, proud of you!",
      "🧘 Remember: progress over perfection always.",
    ],
  },
  {
    id: "sam-t",
    rank: 4,
    name: "Sam T.",
    avatarBg: "#E3DEF8",
    avatarColor: "#493BB8",
    tasksDone: 3,
    streak: 2,
    points: 85,
    focusTask: "Clearing inbox with the 2-minute rule",
    status: "break",
    bio: "Software dev • Resetting streak without guilt",
    quickCheers: [
      "👋 Hey! How's your focus today?",
      "✨ Rebuilding streaks together!",
      "🎯 One tiny task at a time, we got this.",
      "🚀 Let's crush this next 15-minute block!",
    ],
  },
  {
    id: "elena-v",
    rank: 5,
    name: "Elena V.",
    avatarBg: "#FFE3B0",
    avatarColor: "#804A00",
    tasksDone: 2,
    streak: 5,
    points: 70,
    focusTask: "Writing client update email",
    status: "focusing",
    bio: "Freelancer • Body doubling keeps me accountable",
    quickCheers: [
      "🙌 Ready for the next focus sprint?",
      "⚡ Sending you focus energy!",
      "🎉 Celebrate every checked box!",
    ],
  },
];

export const INITIAL_COMMUNITY_MESSAGES: ChatMessage[] = [
  {
    id: "cm-1",
    senderId: "maya-r",
    senderName: "Maya R.",
    senderAvatarBg: "#FFE3B0",
    senderAvatarColor: "#7E5700",
    text: "Just hit my 6th task for today! Starting with the 5-min timer made all the difference.",
    timestamp: "10m ago",
    isCurrentUser: false,
    cheerReaction: "🔥 4",
  },
  {
    id: "cm-2",
    senderId: "kiran-p",
    senderName: "Kiran P.",
    senderAvatarBg: "#CFEBDD",
    senderAvatarColor: "#1D5E3B",
    text: "Stepping into the Quiet Focus Room for a 25m sprint if anyone wants to double! 🎧",
    timestamp: "6m ago",
    isCurrentUser: false,
    cheerReaction: "👏 3",
  },
  {
    id: "cm-3",
    senderId: "sam-t",
    senderName: "Sam T.",
    senderAvatarBg: "#E3DEF8",
    senderAvatarColor: "#493BB8",
    text: "Joining you Kiran! Finally tackling the inbox mountain today. No zero days! 💪",
    timestamp: "3m ago",
    isCurrentUser: false,
    cheerReaction: "🙌 2",
  },
];

export function generatePeerReply(peer: PeerProfile, userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("how") || lower.includes("tip") || lower.includes("trick") || lower.includes("focus")) {
    if (peer.id === "maya-r") {
      return "My #1 secret: I never commit to 'finishing' a task. I only commit to 5 minutes of opening the tab. Once dopamine kicks in, momentum takes over! Try it right now on your hardest task! 🚀";
    }
    if (peer.id === "kiran-p") {
      return "For me, brown noise + turning off all notifications for just 20 minutes is magic. Don't worry about finishing everything today—finishing one small step is a 100% win. 🌿";
    }
    return "Honestly, I use Spark's 'Break it down' button whenever my brain freezes. Taking 3 micro-steps of 5 mins each feels so much easier! ✨";
  }

  if (lower.includes("streak") || lower.includes("congrat") || lower.includes("proud") || lower.includes("great job") || lower.includes("fire")) {
    return `Thank you so much! Honestly, having this tribe cheering each other on is what keeps me going. Let's keep our streaks alive together! 🔥✨`;
  }

  if (lower.includes("water") || lower.includes("break") || lower.includes("rest") || lower.includes("tired")) {
    return `You read my mind! Just refilled my water bottle. Remember to unclench your jaw and drop your shoulders too! 💧☕`;
  }

  if (lower.includes("hi") || lower.includes("hey") || lower.includes("hello")) {
    return `Hey Alex! Great to see you in the tribe today! What task are you tackling right now? We're all rooting for you! 🙌`;
  }

  // General encouraging reply
  const generalReplies = [
    `Thanks for the cheer! Sending you huge focus vibes back—you've got this today! 💪✨`,
    `Love the energy! Let's conquer our next 25-minute sprint together. Tell me when you finish your next task! 🎯`,
    `Right back at you! Every small win counts. Let's keep stacking points on the leaderboard! 🌟`,
  ];
  return generalReplies[Math.floor(Math.random() * generalReplies.length)];
}
