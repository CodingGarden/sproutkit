import BadgeInfo from './BadgeInfo';
import Badges from './Badges';
import User from './User';

export default interface Message {
  _id?: string;
  badge_info?: BadgeInfo;
  badges?: Badges;
  color?: string;
  display_name: string;
  emotes?: null;
  flags?: null;
  id?: string;
  mod?: boolean;
  room_id?: string;
  subscriber?: boolean;
  tmi_sent_ts?: string;
  turbo?: boolean;
  user_id?: string;
  user_type?: string;
  emotes_raw?: null;
  badge_info_raw?: string;
  badges_raw: string;
  username: string;
  message_type?: string;
  name: string;
  created_at: Date;
  deleted_at?: null;
  message: string;
  parsedMessage?: string;
  content?: string;
  timeSent?: string;
  type?: string;
  user?: User;
  ack?: boolean;
  parked?: boolean;
  backgroundColor?: string;
}
