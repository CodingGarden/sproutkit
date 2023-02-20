export interface Membership {
  id: string;
  name: string;
  loyaltyBadge: string;
  time_as_member: string;
}

export interface User {
  _id: string;
  id: string;
  created_at: string;
  display_name: string;
  handle: string;
  is_chat_moderator: boolean;
  is_chat_owner: boolean;
  is_verified: boolean;
  logo: string;
  membership: Membership | null;
}

export interface Message {
  _id: string;
  id: string;
  author_display_name: string;
  author_handle: string;
  author_id: string;
  created_at: string;
  deleted_at: null;
  live_chat_id: string;
  message: string;
  timeSent: string;
  user?: User;
}
