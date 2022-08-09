<template>
  <div id="app">
    <div class="boxes">
      <div class="message-box">
        {{message || 'Welcome! Starting soon... ⬇️'}}
      </div>
    </div>
    <div class="video-wrapper">
      <video class="video" autoplay muted loop src="https://i.imgur.com/1uAhoFz.mp4"></video>
      <div v-if="credits" class="credits"></div>
      <div class="video-controls">
        <div class="video-scrub-bar"></div>
        <div class="video-button play">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" stroke-width="2" fill="white" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        </div>
        <div class="video-button next">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" fill="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
        </div>
        <div class="video-button volume">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        </div>
        <div class="video-button live">
          <span>LIVE</span>
        </div>
      </div>
    </div>
    <div class="countdown" v-if="!hideTimer">
      <p class="countdown-message">
        <span id="counter">{{counter}}</span>
      </p>
    </div>
    <div class="video-info">
      <p>chill garden radio - music to code/study to</p>
      <div class="links">
        <p>
          <img class="emoji" src="https://i.imgur.com/4sQrpoT.png"> coding.garden/support
        </p>
        <p>
          <img class="emoji" src="https://i.imgur.com/hF6nceh.png"> coding.garden/discord
        </p>
        <p>
          <img class="emoji" src="https://i.imgur.com/zaPlNYm.png"> coding.garden/videos
        </p>
        <p>
          <img class="emoji" src="https://i.imgur.com/i8koB4k.png"> coding.garden/gear
        </p>
      </div>
    </div>
    <cg-message-list :focus="false" :buttons="false" :messages="recentMessages" />
    <div class="up-next">
      <p>Up Next</p>
      <div class="up-next-preview">
        <img src="https://i.imgur.com/Y7rMbWo.png">
        <div class="up-next-info">
          <p class="up-next-title">{{next.title}}</p>
          <!-- <p class="up-next-subtitle">Category: {{next.category}}</p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as Vue from 'vue';
import * as timeago from 'timeago.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import 'flag-icon-css/css/flag-icon.min.css';

import CgMessageList from '@/apps/components/CgMessageList.vue';
import followMessages from '@/apps/lib/followMessages';
import { twitchChat, twitchUsers, twitchRewards } from '@/lib/services';
import Message from '@/interfaces/Message';
import User from '@/interfaces/User';

const getRandomFollowMessage = () => followMessages[Math.floor(Math.random() * followMessages.length)];

export default Vue.defineComponent({
  components: {
    CgMessageList,
  },
  data: () => ({
    botId: '519135902',
    broadcasterId: '413856795',
    messages: [] as Message[],
    counter: '5:00',
    startTime: Date.now(),
    message: '',
    hideTimer: false,
    credits: false,
    next: {
      title: 'CODING GARDEN',
      category: 'Just Chatting',
    },
  }),
  computed: {
    recentMessages(): Message[] {
      return this.messages.filter(
        // @ts-ignore
        (m) => !m.ack
            && m.type !== 'command',
        // && new Date(m.created_at) > Date.now() - 1000 * 60),
      ).slice(0, 10);
    },
  },
  methods: {
    updateCountdown() {
      if (this.hideTimer) return (this.counter = '');
      const totalSecondsLeft = ((this.startTime - Date.now()) / 1000) | 0;
      const minutesLeft = Math.abs((totalSecondsLeft / 60) | 0);
      const secondsLeft = Math.abs(totalSecondsLeft % 60);
      if (totalSecondsLeft < 0 && this.counter) {
        this.counter = '';
        setTimeout(this.updateCountdown, 500);
      } else if (totalSecondsLeft < 0 && !this.counter) {
        this.counter = '00:00';
        setTimeout(this.updateCountdown, 500);
      } else {
        this.counter = `${minutesLeft
          .toString()
          .padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
        setTimeout(this.updateCountdown, 500);
      }
    },
  },
  async created() {
    // window.startAnmiation();
    const params = new URLSearchParams(window.location.search);
    if (params.get('credits')) {
      this.message = '{💚}Join us in the raid...{💚}';
      this.hideTimer = true;
      this.credits = true;
      this.next.title = '{🌱} Coding {💚} Garden {🌱} Raid';
      this.next.category = 'TBD';
    }
    this.startTime = Date.now() + 1000 * 13 * 60;
    this.updateCountdown();
    const messageIds = new Set();
    this.messages = [];
    if (!this.credits) {
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
        if (message.username === 'samwisegardener' && followedUsername) {
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
    }
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
        Object
          .entries(message)
          .forEach(([prop, value]) => existingMessage[prop] = value);
      }
    });
    twitchChat.on('created', (message: any) => {
      if (message.user_id === this.broadcasterId) {
        if (message.message.startsWith('!settimer')) {
          const args = message.message.split(' ');
          args.shift();
          const time = args.shift();
          if (time) {
            this.startTime = Date.now() + 1000 * time * 60;
          }
          return;
        }

        if (message.message.startsWith('!setmessage')) {
          const args = message.message.split(' ');
          args.shift();
          this.message = `${args.join(' ')} `;
          return;
        }

        if (message.message.startsWith('!toggletimer')) {
          this.hideTimer = !this.hideTimer;
          if (!this.hideTimer) {
            this.updateCountdown();
          }
          return;
        }
      }
      const followedUsername = (message.message.match(
        /Thank you for following on Twitch (.*)!/,
      ) || [])[1];
      if (message.username === 'samwisegardener' && followedUsername) {
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
      this.messages = this.messages.filter((m) => m.type !== 'command').slice(0, 10);
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

#__bs_notify__ {
  display: none !important;
}

body {
  background: #181818;
  color: white;
  font-family: Roboto, sans-serif;
  font-size: 2.5rem;
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

#logo {
  opacity: 0;
  position: fixed;
  width: 400px;
  z-index: 10;
  transition: opacity 1s linear;
}

main {
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

.info {
  margin: 2rem;
}

.mono {
  font-family: "Share Tech Mono", monospace;
  font-size: 2rem;
}

*::-webkit-scrollbar {
  display: none;
}

#app {
  position: relative;
  width: 100%;
  height: 100%;
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
  margin: 0.5rem 0;
  margin: 0.5rem;
}

.messages {
  position: absolute;
  right: 0.5rem;
  bottom: 20vh;
  font-size: 0.5rem;
  width: 600px;
  display: flex;
  flex-direction: column-reverse;
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

.video-wrapper {
  width: 65vw;
  height: calc(65vw * (9/16));
  position: fixed;
  top: 7rem;
  left: 3rem;
}

.video-controls {
  position: absolute;
  width: 100%;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: flex;
  align-items: center;
}

.video-scrub-bar {
  height: 5px;
  background: #FC0D1B;
  position: absolute;
  top: 0;
  width: 100%;
}

.video-button.play {
  margin-left: 2rem;
  margin-right: 2rem;
}

.video-button {
  margin-left: 1rem;
}

.video-button.volume {
  margin-left: 2rem;
  transform: scale(1.2);
}

.video-button.live {
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-button.live:before {
  display: inline-block;
  width: 6px;
  height: 6px;
  vertical-align: 4%;
  margin-right: 5px;
  background: #FC0D1B;
  content: '';
  border-radius: 6px;
}

.video {
  width: 100%;
  height: 100%;
  background: black;
  border: none;
}

.video-info {
  position: fixed;
  top: calc((65vw * (9/16)) + 8rem);
  margin-left: 3rem;
  font-size: 1.5rem;
  width: 65vw;
}

.links {
  width: 100%;
  margin-top: 1rem;
}

.links p {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  font-size: 1.5rem;
  color: #44A4F6;
}

.boxes {
  width: 65vw;
  display: flex;
  margin-left: 3rem;
  padding-top: 1rem;
  justify-content: space-between;
  font-family: "Press Start 2P";
}

.message-box {
  background: black;
  padding: 0.5rem;
  width: 100%;
  border: 10px solid #e3e2e1;
  transition: opacity 1s ease-in-out;
}

.countdown {
  background: black;
  padding: 0.5rem;
  border: 10px solid #e3e2e1;
  width: 280px;
  height: 80px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  font-family: "Press Start 2P";
  left: calc((65vw + 2rem) - 280px);
  top: 8rem;
}

.up-next {
  position: fixed;
  right: 1rem;
  top: calc(80vh + 0.5rem);
  font-size: 1.25rem;
  width: 30vw;
  border-top: 1px solid rgb(170, 170, 170);;
  padding-top: 1rem;
}

.up-next-preview {
  display: flex;
  margin-top: 1rem;

  img {
    outline: 1px solid white;
  }
}

.up-next-title {
  margin-left: 1rem;
}

.up-next-subtitle {
  color: rgb(170, 170, 170);
  margin-top: 1rem;
  margin-left: 1rem;
}

.credits {
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

big, h1, h2 {
  font-size: 0.8em;
}
</style>
