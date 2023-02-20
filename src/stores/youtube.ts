import { defineStore } from 'pinia';
import * as timeago from 'timeago.js';
import { youtubeChat, youtubeUsers } from '@/lib/services';
import TwitchUser from '@/interfaces/User';
import TwitchMessage from '@/interfaces/Message';
import { User as YouTubeUser, Message as YouTubeMessage } from '@/interfaces/YouTube';
import { avatarUrls } from '@/allowlist';

interface YouTubeState {
  listening: boolean;
  messages: TwitchMessage[];
  users: TwitchUser[];
  usersById: Map<string, TwitchUser>;
  messagesById: Map<string, TwitchMessage>;
}

function convertYouTubeUser(youtubeUser: YouTubeUser): TwitchUser {
  avatarUrls.add(youtubeUser.logo);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (window.electronAPI) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.electronAPI.allowAvatar(youtubeUser.logo);
  }
  return {
    _id: youtubeUser._id,
    name: youtubeUser.handle,
    created_at: new Date(youtubeUser.created_at),
    display_name: youtubeUser.handle,
    id: youtubeUser.id,
    logo: youtubeUser.logo,
    follow: true, // TODO: get if user is subscribed...
    subscription: youtubeUser.membership ? {
      created_at: new Date(), // TODO: get actual created date
      sub_plan: youtubeUser.membership.name,
    } : false,
  };
}

function convertYouTubeMessage(youtubeMessage: YouTubeMessage): TwitchMessage {
  return {
    _id: youtubeMessage._id,
    badge_info: youtubeMessage.user?.membership ? {
      subscriber: youtubeMessage.user.membership.loyaltyBadge,
    } : undefined,
    badges: {
      broadcaster: youtubeMessage.user?.is_chat_owner.toString(),
      moderator: youtubeMessage.user?.is_chat_moderator.toString(),
    },
    // color?: string;
    display_name: youtubeMessage.author_handle,
    // emotes?: null;
    // flags?: null;
    id: youtubeMessage.id,
    mod: !!youtubeMessage.user?.is_chat_moderator,
    // room_id?: string;
    // subscriber?: boolean;
    // tmi_sent_ts?: string;
    // turbo?: boolean;
    user_id: youtubeMessage.author_id,
    // user_type?: string;
    // emotes_raw?: null;
    // badge_info_raw?: string;
    badges_raw: '',
    username: youtubeMessage.author_handle,
    message_type: 'message',
    name: youtubeMessage.author_handle,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    created_at: youtubeMessage.created_at,
    // deleted_at?: null;
    message: youtubeMessage.message,
    parsedMessage: youtubeMessage.message,
    // content?: string;
    timeSent: youtubeMessage.timeSent,
    first_msg: false,
    // type?: string;
    user: youtubeMessage.user ? convertYouTubeUser(youtubeMessage.user) : undefined,
    // ack: false,
    // parked?: boolean;
    // backgroundColor?: string;
    // msg_id?: string;
    platform: 'youtube',
  };
}

export default defineStore('youtube', {
  state: (): YouTubeState => ({
    listening: false,
    messages: [],
    users: [],
    usersById: new Map<string, TwitchUser>(),
    messagesById: new Map<string, TwitchMessage>(),
  }),
  actions: {
    async init() {
      if (this.listening) return;
      this.listening = true;
      const messages = await youtubeChat.find();
      const userIds = [...new Set(messages.map(({ author_id }) => author_id))];
      const users = await youtubeUsers.find({
        query: {
          ids: userIds,
        },
      });
      this.usersById = users.reduce((byId: Map<string, TwitchUser>, user: YouTubeUser) => {
        byId.set(user.id, convertYouTubeUser(user));
        return byId;
      }, new Map<string, TwitchUser>());

      this.messagesById = messages.reduce(
        (byId: Map<string, TwitchMessage>, message: YouTubeMessage) => {
          const twitchMessage = convertYouTubeMessage(message);
          twitchMessage.user = this.usersById.get(message.author_id);
          twitchMessage.timeSent = timeago.format(message.created_at);
          byId.set(message.id, twitchMessage);
          return byId;
        },
        new Map<string, TwitchMessage>(),
      );

      this.messages = [...this.messagesById.values()].reverse().slice(0, 200);

      youtubeChat.on('created', (message: YouTubeMessage) => {
        if (this.messagesById.has(message.id)) return;
        const twitchMessage = convertYouTubeMessage(message);
        twitchMessage.timeSent = timeago.format(message.created_at);
        this.messages.unshift(twitchMessage);
        if (message.user) {
          this.usersById.set(message.author_id, convertYouTubeUser(message.user));
        }
      });

      setInterval(() => {
        if (this.messages.length > 200) {
          this.messages = this.messages.slice(0, 200);
        }
        this.messages.forEach((message) => {
          message.timeSent = timeago.format(message.created_at);
        });
      }, 2000);
    },
  },
});
