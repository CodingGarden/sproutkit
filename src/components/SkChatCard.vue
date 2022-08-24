<template>
  <div class="chat-card" :class="{ me }" :style="{ '--color': color, '--background-color': backgroundColor }">
    <div class="info-line">
      <sk-avatar v-if="image && !me" :image="image" />
      <sk-user-info
        class="user-info"
        :color="contrastedColor"
        :altName="altName"
        :name="name"
        :badges="badges"
        :countryCode="countryCode"
        :team="team"
        :teamColor="teamColor"
        :channelId="channelId"
        :pronoun="pronoun"
      />
      <!-- <span v-if="me" class="me">
        <span v-if="sanitizedMessage" :style="{ color: contrastedColor }" v-html="sanitizedMessage"></span>
        <span v-else :style="{ color: contrastedColor }">{{message}}</span>
      </span> -->
      <div class="info-line-end" :class="{ 'info-line-end-me': me  }">
        <!-- @slot The space to the right of the user info. -->
        <slot name="info-line-end"></slot>
      </div>
    </div>
    <span v-if="sanitizedMessage" :style="{ color: me ? contrastedColor : '' }" class="message" v-html="sanitizedMessage"></span>
    <span v-if="!sanitizedMessage" :style="{ color: me ? contrastedColor : '' }" class="message">{{message}}</span>
    <div class="action-line" v-if="!me">
      <div class="line-start">
        <!-- @slot The bottom of the card to the left of the time sent. -->
        <slot name="action-line-start"></slot>
      </div>
      <span v-if="createdAt" class="time-sent">{{createdAt}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import * as Vue from 'vue';

import { getContrastedColor } from '@/lib/colors';
import sanitizeMessage from '@/lib/sanitizeMessage';
import SkAvatar from '@/components/SkAvatar.vue';
import SkUserInfo from '@/components/SkUserInfo.vue';

interface ChatCardData {
  sanitizedMessage: string;
}

export default Vue.defineComponent({
  components: {
    SkAvatar,
    SkUserInfo,
  },
  props: {
    /**
     * The color of message text.
    */
    color: {
      type: String,
      default: '#FFFFFF',
    },
    /**
     * The color of team.
    */
    teamColor: String,
    /**
     * The background color of the card.
    */
    backgroundColor: {
      type: String,
      default: '#18181B',
    },
    /**
     * The color of the username / team badge.
    */
    userColor: {
      type: String,
      default: '#FFFFFF',
    },
    /**
     * The channel id the message was sent in. Ssed to retrieve channel specific badges.
    */
    channelId: String,
    /**
     * The username to display.
    */
    name: String,
    /**
     * The alt-name to display.
    */
    altName: String,
    /**
     * The avatar image to display.
    */
    image: String,
    /**
     * The raw badge string from twitch irc.
    */
    badges: String,
    /**
     * 2 Character Country code. Used to display a flag next to the users name.
    */
    countryCode: String,
    /**
     * The name of the team badge. Can be any valid font awesome brand name.
    */
    team: String,
    /**
     * The pronoun to display
    */
    pronoun: String,
    /**
     * The message text to display.
    */
    message: String,
    /**
     * The time the message was sent.
    */
    createdAt: String,
    /**
     * Set to true to sanitize the message with DOMPurify
    */
    trustMessage: {
      type: Boolean,
      default: false,
    },
    /**
     * Set to true if the message text color should be the same as the user color
    */
    me: Boolean,
  },
  computed: {
    sanitizedMessage(): string {
      return sanitizeMessage(
        this.$props.message || '',
        this.$props.trustMessage,
      );
    },
    contrastedColor(): string {
      return getContrastedColor(
        this.$props.userColor,
        this.$props.backgroundColor,
      );
    },
  },
});
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css?family=Montserrat&display=swap");

.chat-card {
  font-family: "Montserrat", sans-serif;
  --background-color: #392f5a;
  --color: #fff;
  --border-radius: 1rem;
  --font-size: 1.5rem;
  background-color: var(--background-color);
  color: var(--color);
  padding: 1rem;
  border-radius: var(--border-radius);
  font-size: var(--font-size);

  .info-line {
    display: flex;
    position: relative;
  }

  .user-info {
    margin-left: 0.5rem;
  }

  &.me {
    margin-left: 0.5rem;
    max-height: 200px;
    overflow-wrap: break-word;
    overflow: auto;
    .message {
      font-style: italic;
      margin: 0;
      display: inline;
    }
  }

  .message {
    display: block;
    padding: 0.1rem 0;
    margin: 0.2rem 0 0 0;
    overflow-wrap: break-word;
    height: 60%;
    max-height: 200px;
    overflow: auto;

    :deep(span[data-wrapper]):hover::after {
      content: attr(data-title);
      background: rgba(0, 0, 0, 0.7);
      border-radius: 0.5rem;
      padding: 0.5rem;
      font-size: 1rem;
      position: fixed;
      top: var(--mouse-y);
      left: var(--mouse-x);
    }
  }


  .action-line {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-top: 1rem;

    .line-start {
      flex-grow: 1;
    }

    .time-sent {
      font-size: 0.75rem;
      min-width: 15%;
      text-align: right;
      position: absolute;
      bottom: 0;
      right: 0.5rem;
    }
  }

  .info-line-end {
    opacity: 0;
    transition: opacity 200ms linear;
  }
}

.chat-card:hover {
  .info-line-end {
    opacity: 1;
  }
}
</style>