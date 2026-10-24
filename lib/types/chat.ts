export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarBg: string;
  senderAvatarColor: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
  cheerReaction?: string;
}

export interface PeerProfile {
  id: string;
  rank: number;
  name: string;
  avatarBg: string;
  avatarColor: string;
  tasksDone: number;
  streak: number;
  points: number;
  focusTask: string;
  status: "focusing" | "break" | "idle";
  bio: string;
  quickCheers: string[];
}
