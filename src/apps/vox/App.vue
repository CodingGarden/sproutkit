<template>
<!--
  TODO:
  * show question number
  * link to question number
  * show comments
  * show upvotes
  * hide parked button
-->
  <div id="app" class="flex-column-center">
    <div class="text-center m-1">
      <h2 class="topic" @click="showInfo = !showInfo">Vox Populi</h2>
      <div v-if="showInfo">
        <p class="mono">!ask your message here</p>
        <p class="mono">!idea your message here</p>
        <p class="mono">!submit your message here</p>
        <p class="mono">!upvote #number</p>
        <p class="mono">!comment #number your comment here</p>
      </div>
    </div>
    <div id="messages" class="chat" :class="{ hidden: loading }">
      <div class="tabs">
        <a
          class="button"
          @click="selectedTab = 'questions'"
          :class="{ active: selectedTab === 'questions' }"
        >Questions ({{data.questions.length}})</a>
        <a
          class="button"
          @click="selectedTab = 'ideas'"
          :class="{ active: selectedTab === 'ideas' }"
        >Ideas ({{data.ideas.length}})</a>
        <a
          class="button"
          @click="selectedTab = 'submissions'"
          :class="{ active: selectedTab === 'submissions' }"
        >Submissions ({{data.submissions.length}})</a>
      </div>
      <transition-group class="messages" name="messages" tag="div" id="messages">
        <cg-chat-card
          v-for="message in sortedItems"
          :key="message.id"
          :user="message.user"
          :message="message"
          :timeSent="message.timeSent"
          class="message messages-item"
          @ack="ack"
        />
      </transition-group>
    </div>
    <div class="loading" :class="{ hidden: !loading }">
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="80%"
        height="100%"
        viewBox="0 0 24 30"
        style="enable-background:new 0 0 50 50;"
        xml:space="preserve"
      >
        <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="0.2; 1; .2"
            begin="0s"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="height"
            attributeType="XML"
            values="10; 20; 10"
            begin="0s"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="10; 5; 10"
            begin="0s"
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="8" y="10" width="4" height="10" fill="#333" opacity="0.2">
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="0.2; 1; .2"
            begin="0.15s"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="height"
            attributeType="XML"
            values="10; 20; 10"
            begin="0.15s"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="10; 5; 10"
            begin="0.15s"
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="16" y="10" width="4" height="10" fill="#333" opacity="0.2">
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="0.2; 1; .2"
            begin="0.3s"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="height"
            attributeType="XML"
            values="10; 20; 10"
            begin="0.3s"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="10; 5; 10"
            begin="0.3s"
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  </div>
</template>

<script>
import * as timeago from 'timeago.js';

import CgChatCard from '@/apps/components/CgChatCard.vue';
import { voxPopuli } from '@/lib/services';

const setTimesent = (item) => {
  item.timeSent = timeago.format(item.created_at);
};

const findAndRemove = (items, removeItem) => {
  const index = items.findIndex((item) => item.id === removeItem.id);
  if (index !== -1) {
    items.splice(index, 1);
  }
};

const itemsByCommand = {
  '!ask': 'questions',
  '!idea': 'ideas',
  '!submit': 'submissions',
};

export default {
  components: {
    CgChatCard,
  },
  created() {
    this.loadData();
  },
  data: () => ({
    loading: true,
    selectedTab: 'questions',
    usersByUsername: {},
    showInfo: true,
    data: {
      ideas: [],
      questions: [],
      submissions: [],
      users: [],
    },
  }),
  computed: {
    dataByNum() {
      const byNum = {};
      this.data.questions.forEach((item) => (byNum[item.num] = item));
      this.data.submissions.forEach((item) => (byNum[item.num] = item));
      this.data.ideas.forEach((item) => (byNum[item.num] = item));
      return byNum;
    },
    sortedItems() {
      let items = [];
      if (this.selectedTab === 'questions') {
        items = this.data.questions;
      } else if (this.selectedTab === 'ideas') {
        items = this.data.ideas;
      } else if (this.selectedTab === 'submissions') {
        items = this.data.submissions;
      }

      const sorted = items.sort((a, b) => {
        if (a.user.subscription && !b.user.subscription) return -1;
        if (!a.user.subscription && b.user.subscription) return 1;
        if (a.badges.moderator && !b.badges.moderator) return -1;
        if (b.badges.moderator && !a.badges.moderator) return 1;
        if (a.badges.vip && !b.badges.vip) return -1;
        if (b.badges.vip && !a.badges.vip) return 1;
        const diff = b.upvotes.length - a.upvotes.length;
        if (diff !== 0) return diff;
        return new Date(a.created_at) - new Date(b.created_at);
      });
      return sorted;
    },
  },
  methods: {
    async ack(message) {
      await voxPopuli.remove(message._id, {
        query: {
          key: localStorage.token,
        },
      });
    },
    onRemoved(message) {
      const args = message.message.split(' ');
      const command = args.shift();

      if (command.match(/^!(ask|idea|submit)$/)) {
        if (!message.num) return;
        if (itemsByCommand[command]) {
          findAndRemove(this.data[itemsByCommand[command]], message);
        }
      } else if (command.match(/^!(comment)/)) {
        const num = (args.shift() || '').replace('#', '');
        if (!num || isNaN(num) || !this.dataByNum[num]) return;
        if (command === '!comment') {
          findAndRemove(this.dataByNum[num].comments, message);
        }
      }
    },
    addLatestMessage(message) {
      this.$set(this.usersByUsername, message.username, message.user);
      const args = (message.parsedMessage || message.message).split(' ');
      const command = args.shift();
      if (command.match(/^!(ask|idea|submit)/)) {
        if (!message.num) return;
        const value = args.join(' ');
        message.content = value;
        message.comments = [];
        message.upvotes = [];
        message.upvote_count = 0;
        if (command === '!ask') {
          message.type = 'questions';
          this.data.questions.push(message);
        } else if (command === '!idea') {
          message.type = 'ideas';
          this.data.ideas.push(message);
        } else if (command === '!submit') {
          message.type = 'submissions';
          this.data.submissions.push(message);
        }
        processMessage(message);
      } else if (command.match(/^!(comment|upvote)/)) {
        const num = (args.shift() || '').replace('#', '');
        if (!num || isNaN(num) || !this.dataByNum[num]) return;
        if (command === '!comment') {
          message.content = args.join(' ');
          processMessage(message);
          this.dataByNum[num].comments.push(message);
        } else if (command === '!upvote') {
          this.dataByNum[num].upvotes.push(message.username);
          this.dataByNum[num].upvotes = [...new Set(this.dataByNum[num].upvotes)];
        }
      }
    },
    async loadData() {
      const data = await voxPopuli.find({});
      voxPopuli.on('created', (message) => {
        // this.addLatestMessage(message);
      });
      voxPopuli.on('removed', (message) => {
        this.onRemoved(message);
      });
      const usersByUsername = data.users.reduce((byName, user) => {
        byName[user.name] = user;
        return byName;
      }, {});
      const processMessages = (type) => (message) => {
        message.user = usersByUsername[message.username];
        message.type = type;
        message.upvotes = [...new Set(message.upvotes)];
        setTimesent(message);
        message.comments.forEach((comment) => {
          comment.user = usersByUsername[comment.username];
          setTimesent(comment);
        });
      };
      data.questions.forEach(processMessages('questions'));
      data.ideas.forEach(processMessages('ideas'));
      data.submissions.forEach(processMessages('submissions'));
      this.usersByUsername = usersByUsername;
      this.data = data;
      // if (window.location.hash) {
      //   const num = window.location.hash.split('-')[1];
      //   if (this.dataByNum.hasOwnProperty(num)) {
      //     const message = this.dataByNum[num];
      //     this.selectedTab = message.type;
      //   }
      // }
      this.loading = false;
      setInterval(() => {
        const setTimeSents = (message) => {
          setTimesent(message);
          message.comments.forEach(setTimesent);
        };
        this.data.questions.forEach(setTimeSents);
        this.data.ideas.forEach(setTimeSents);
        this.data.submissions.forEach(setTimeSents);
      }, 2000);
      // TODO: show loading thing, fade in ui
      // loading.style.opacity = 0;
      // main.style.opacity = 1;
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Fira+Sans&family=Montserrat&family=Share+Tech+Mono&family=Share:ital,wght@0,400;0,700;1,400;1,700&display=swap");

*::-webkit-scrollbar {
  display: none;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

body {
  background: black;
  color: white;
  font-family: "Share", sans-serif;
  font-size: 2.5rem;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  position: relative;
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
  position: fixed;
  width: 100px;
  margin: 2rem;
  background: black;
}

main {
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 1s;
}

.flex-column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-center {
  text-align: center;
}

.m-1 {
  margin: 1rem;
}

.emoji {
  font-family: FirefoxEmoji;
  font-size: 2.5rem;
  color: black;
}

.mono {
  font-family: "Share Tech Mono", monospace;
  font-size: 2rem;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transition: all 1s;
  pointer-events: none;
}

.loading svg rect,
.loading svg path {
  fill: #59bc5c;
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
  transform: translate(100%, -50px);
}

.message {
  margin: 0.5rem 0;
}

.messages {
  // margin-top: 15%;
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

.reply {
  box-shadow: 11px 10px 43px 0px rgba(0, 0, 0, 0.51);
}

.delete-button {
  margin-top: 0.25rem;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.delete-button svg line {
  stroke: white;
}

.delete-button svg polygon {
  stroke: white;
}

.author img.voter {
  margin: 0 0.5rem;
  width: 25px;
  height: 25px;
}

.tabs {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  background: black;
  width: 100%;
  z-index: 100;
}

a.button {
  display: inline-block;
  padding: 0.35em 1.2em;
  border: 0.1em solid #ffffff;
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.12em;
  box-sizing: border-box;
  text-decoration: none;
  font-weight: 300;
  color: #ffffff;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
}

a.button:hover,
a.button.active {
  color: #000000;
  background-color: #ffffff;
}

@media all and (max-width: 30em) {
  a.button {
    display: block;
    margin: 0.4em auto;
  }
}

@media all and (max-width: 846px) {
  #logo {
    display: none;
  }

  .tabs {
    font-size: 0.75rem;
  }

  .q-number span.anchor {
    top: -72px; /* adjust anchor for sticky header */
  }
}

@media all and (max-width: 800px) {
  .chat {
    width: 99%;
  }
  .message {
    flex-direction: column;
    width: 96%;
  }
}

.message .q-number {
  margin: 1rem;
}

.q-number span.anchor {
  display: block;
  position: relative;
  top: -90px; /* adjust anchor for sticky header */
}

.chat {
  position: relative;
  width: 80%;
  margin: 0;
  padding: 0;
  font-family: "Montserrat", sans-serif;
  font-size: 1.5rem;
}

.hidden {
  display: none;
}

.topic {
  cursor: pointer;
}
</style>
