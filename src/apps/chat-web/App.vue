<template>
  <div id="app">
    <cg-message-list :focus="false" :buttons="false" :messages="recentMessages" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as timeago from 'timeago.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import 'flag-icon-css/css/flag-icon.min.css';

import CgMessageList from '@/apps/components/CgMessageList.vue';
import followMessages from '@/apps/lib/followMessages';
import { twitchChat, twitchUsers, twitchRewards } from '@/lib/services';
import Message from '@/interfaces/Message';
import User from '@/interfaces/User';

const getRandomFollowMessage = () => followMessages[Math.floor(Math.random() * followMessages.length)];

export default Vue.extend({
  components: {
    CgMessageList,
  },
  data: () => ({
    botId: '519135902',
    broadcasterId: '413856795',
    messages: [] as Message[],
  }),
  computed: {
    recentMessages(): Message[] {
      return this.messages.filter(
        // @ts-ignore
        (m) => !m.ack
            && m.type !== 'command',
        // && new Date(m.created_at) > Date.now() - 1000 * 60),
      ).slice(0, 20);
    },
  },
  async created() {
    const messageIds = new Set();
    const messages = await twitchChat.find({
      query: {
        commands: false,
      },
    });
    const allMessages = messages
      // @ts-ignore
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .filter((message: Message) => {
        if (messageIds.has(message.id)) return false;
        // @ts-ignore
        // if (new Date(message.created_at) < Date.now() - 1000 * 60) return false;
        messageIds.add(message.id);
        message.timeSent = timeago.format(message.created_at);
        return true;
      });
    const names = [
      ...new Set(allMessages.map((message: Message) => message.username)),
    ];
    const users = await twitchUsers.find({
      query: {
        names,
      },
    });
    const usersByName = users.reduce(
      (byName: Map<string, User>, user: User) => {
        byName.set(user.name, user);
        return byName;
      },
      new Map<string, User>(),
    );
    allMessages.forEach((message: any) => {
      const followedUsername = (message.message.match(
        /Thank you for following on Twitch (.*)!/,
      ) || [])[1];
      if (message.username === 'streamlabs' && followedUsername) {
        if (followedUsername) {
          message.type = 'follow';
          message.message = getRandomFollowMessage().replace(
            /\{\{username\}\}/g,
            `<strong>${followedUsername}</strong>`,
          );
          message.color = '#F8C630';
          message.badges_raw = '';
          message.user = {
            name: '',
            display_name: '👋 Follow  👋',
            logo: 'https://i.imgur.com/rD7b0Ki.png',
            follow: true,
          };
        }
      } else {
        if (message.message.match(/^!\w/)) {
          message.type = 'command';
        }

        if (message.msg_id === 'highlighted-message') {
          message.type = 'highlight';
        }

        message.user = usersByName.get(message.username) || {
          name: 'Not Found',
        };
      }
    });
    this.messages = allMessages;
    twitchRewards.on('created', (data: any) => {
      const { redemption } = data;
      const content = `${redemption.user.display_name
        || redemption.user.login} has redeemed: ${redemption.reward.title} - ${
        redemption.reward.prompt
      }`;

      const message = {
        id: redemption.id,
        message: content,
        content,
        name: '🎉 Reward Redemption 🎉',
        username: '🎉 Reward Redemption 🎉',
        display_name: '🎉 Reward Redemption 🎉',
        badges_raw: '',
        badges: {},
        created_at: new Date(data.timestamp),
        backgroundColor: redemption.reward.background_color,
        type: 'reward',
        user: {
          name: '',
          display_name: '🎉 Reward Redemption 🎉',
          logo: 'https://i.imgur.com/pukCZL7.png',
          follow: true,
          subscription: false,
        },
      };
      this.messages.unshift(message);
    });
    twitchChat.on('removed', (id: string) => {
      this.messages = this.messages.filter((m) => m.id !== id);
    });
    twitchChat.on('patched', (message: any) => {
      const existingMessage = this.messages.find((m) => m.id === message.id);
      if (existingMessage) {
        Object.entries(message).forEach(([prop, value]) => this.$set(existingMessage, prop, value));
      }
    });
    twitchChat.on('created', (message: any) => {
      const followedUsername = (message.message.match(
        /Thank you for following on Twitch (.*)!/,
      ) || [])[1];
      if (message.username === 'streamlabs' && followedUsername) {
        if (followedUsername) {
          message.type = 'follow';
          message.message = getRandomFollowMessage().replace(
            /\{\{username\}\}/g,
            followedUsername,
          );
          message.color = '#F8C630';
          message.badges_raw = '';
          message.user = {
            name: '',
            display_name: '👋 Follow  👋',
            logo: 'https://i.imgur.com/rD7b0Ki.png',
            follow: true,
          };
        }
      }
      if (message.message.match(/^!\w/)) {
        message.type = 'command';
      }

      if (message.msg_id === 'highlighted-message') {
        message.type = 'highlight';
      }
      message.timeSent = timeago.format(message.created_at);
      this.messages.unshift(message);
    });
    setInterval(() => {
      this.messages.forEach((message) => {
        message.timeSent = timeago.format(message.created_at);
      });
      this.messages = this.messages.slice(0, 500);
    }, 2000);
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto&family=Fira+Sans&family=Montserrat&family=Share+Tech+Mono&family=Share:ital,wght@0,400;0,700;1,400;1,700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: transparent;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700;
}

#app {
  width: 100%;
  height: 100%;
}

.flex-column-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.emoji {
  margin-right: 1rem;
}

.mono {
  font-family: "Share Tech Mono", monospace;
  font-size: 2rem;
}

*::-webkit-scrollbar {
  display: none;
}

.messages-item {
  transition: all 500ms ease-in;
}

.messages-move {
  transition: transform 500ms;
}

.messages-enter-active,
.messages-leave-active {
  transition: all 500ms ease-in;
}

.messages-enter,
.messages-leave-to {
  opacity: 0;
  transform: translateX(600px);
}

.message {
  margin: 0.25rem;
}

.messages {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.messages.focus {
  opacity: 0.2;
  transition: opacity 1s linear;
}

img[src$="#emote"] {
  height: 50px;
}

a,
a:visited {
  color: #e6af2e;
}
</style>
