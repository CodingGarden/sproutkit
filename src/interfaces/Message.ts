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
  first_msg: boolean;
  type?: string;
  user?: User;
  ack?: boolean;
  parked?: boolean;
  backgroundColor?: string;
  msg_id?: string;
  msg_param_color?: string;
  msg_param_cumulative_months?: string;
  msg_param_months?: string;
  msg_param_multimonth_duration?: string;
  msg_param_multimonth_tenure?: string;
  msg_param_should_share_streak?: string;
  msg_param_streak_months?: string;
  msg_param_sub_plan?: string;
  msg_param_sub_plan_name?: string;
  msg_param_was_gifted?: string;
  platform?: 'youtube',
}
