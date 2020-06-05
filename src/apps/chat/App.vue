<template>
  <div id="app" style="-webkit-app-region: drag">
    <div class="action-bar" :class="{ focus }" style="-webkit-app-region: drag">
      <input v-if="showSearch" ref="input" class="action-input" v-model="filter" />
      <button
        class="action-button"
        @click="toggleGreetings()"
        :class="{ active: filters.greeting }"
      >👋</button>
      <button
        class="action-button"
        @click="toggleFilter('follow')"
        :class="{ active: filters.follow }"
      >
        💚
        <span v-if="follows.length" class="count">{{follows.length}}</span>
      </button>
      <button
        class="action-button"
        @click="toggleFilter('reward')"
        :class="{ active: filters.reward }"
      >
        🎁
        <span v-if="rewards.length" class="count">{{rewards.length}}</span>
      </button>
      <button
        class="action-button"
        @click="toggleFilter('parked')"
        :class="{ active: filters.parked }"
      >
        🅿️
        <span v-if="parked.length" class="count">{{parked.length}}</span>
      </button>
      <button
        class="action-button"
        @click="toggleFilter('command')"
        :class="{ active: filters.command }"
      >
        🤖
      </button>
    </div>
    <cg-message-list @ack="ack" @park="park" :focus="focus" :messages="filteredMessages"/>
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

const getRandomFollowMessage = () => (
  followMessages[Math.floor(Math.random() * followMessages.length)]
);

export default Vue.extend({
  components: {
    CgMessageList,
  },
  data: () => ({
    botId: '519135902',
    broadcasterId: '413856795',
    showSearch: false,
    focus: false,
    filter: '',
    messages: [] as Message[],
    filters: {
      greeting: false,
      follow: false,
      reward: false,
      parked: false,
      command: false,
      vox: false,
    },
  }),
  computed: {
    follows(): Message[] {
      return this.messages.filter((m) => !m.ack && m.type === 'follow');
    },
    rewards(): Message[] {
      return this.messages.filter((m) => !m.ack && m.type === 'reward');
    },
    parked(): Message[] {
      return this.messages.filter((m) => !m.ack && m.parked);
    },
    filteredMessages(): Message[] {
      const regexp = new RegExp(this.filter, 'gi');
      return this.messages.filter(
        (m) => !m.ack && (m.message.match(regexp)
          || m.username.match(regexp))
          && (this.filters.follow ? m.type === 'follow' : true)
          && (this.filters.reward ? m.type === 'reward' : true)
          && (this.filters.parked ? m.parked : !m.parked)
          && (this.filters.command ? m.type === 'command' : m.type !== 'command'),
      );
    },
  },
  methods: {
    async ack(message: Message) {
      if (message.type === 'reward') {
        this.$set(message, 'ack', true);
      } else {
        await twitchChat.patch(message.id, {
          ack: true,
        });
      }
    },
    async park(message: Message) {
      await twitchChat.patch(message.id, {
        parked: true,
      });
    },
    toggleFilter(item: string) {
      // @ts-ignore
      this.filters[item] = !this.filters[item];
      Object
        .keys(this.filters)
        // @ts-ignore
        // eslint-disable-next-line
        .forEach((name) => item !== name ? this.filters[name] = false : '');
      this.filter = '';
      this.showSearch = false;
    },
    toggleGreetings() {
      if (this.filters.greeting) {
        this.toggleFilter('greeting');
        this.filter = '';
        this.showSearch = false;
      } else {
        this.toggleFilter('greeting');
        this.filter = 'hi|hello|hey|morning|afternoon';
        this.showSearch = true;
      }
    },
  },
  async created() {
    window.addEventListener('keydown', (event) => {
      if (event.code === 'KeyF' && event.metaKey) {
        this.showSearch = !this.showSearch;
        setTimeout(() => {
          if (this.$refs.input) {
            // @ts-ignore
            this.$refs.input.focus();
          } else {
            this.filter = '';
          }
        }, 200);
      }
    });
    const messageIds = new Set();
    const messages = await twitchChat.find({});
    const allMessages = messages
      // @ts-ignore
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .filter((message: Message) => {
        if (messageIds.has(message.id)) return false;
        messageIds.add(message.id);
        message.timeSent = timeago.format(message.created_at);
        return true;
      })
      // .slice(0, 100);
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
      console.log(data);
      const { redemption } = data;
      const content = `${redemption.user.display_name || redemption.user.login} has redeemed: ${redemption.reward.title} - ${redemption.reward.prompt}`;

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
        Object
          .entries(message)
          .forEach(([prop, value]) => this.$set(existingMessage, prop, value));
      }
    });
    twitchChat.on('created', (message: any) => {
      if (message.user_id === this.botId && message.message.includes('Focus mode ended')) {
        this.focus = false;
        return;
      }
      if (message.user_id === this.broadcasterId && message.message.startsWith('!focus')) {
        const command = message.message;
        if (command.startsWith('!focus-start') || command.startsWith('!focus-resume')) {
          this.focus = true;
        } else if (command.startsWith('!focus-pause') || command.startsWith('!focus-end')) {
          this.focus = false;
        }
        return;
      }
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
*::-webkit-scrollbar {
  display: none;
}

#app {
  position: relative;
}

.action-bar {
  position: fixed;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: 94%;
  margin: 0 auto;
  background: #191d32ee;
  padding: 0.5rem;
  border-radius: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .action-input {
    border-radius: 5px;
    flex: 1;
    font-size: 1.5rem;
    line-height: 2.8rem;
    width: 30%;
  }

  .action-button {
    outline: none;
    font-size: 2rem;
    margin: 0.25rem;
    font-family: "Fira Sans", sans-serif;
    color: #EDF2F4;
    background: #595F72;
    border-radius: 5px;
    padding: 0.25rem;
    cursor: pointer;
  }
  .action-button.active,
  .action-button:active {
    border: 2px solid black;
    background: #724e91;
  }

  &.focus {
    opacity: 0.2;
  }
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
  transform: translateY(-50px) translateX(600px);
}

.message {
  margin: 0.5rem 0;
}

.messages {
  margin-top: 15%;
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
