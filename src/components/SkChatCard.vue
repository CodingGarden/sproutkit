<template>
  <div class="chat-card" :style="{ '--color': color, '--background-color': backgroundColor }">
    <div class="info-line">
      <sk-avatar v-if="image" :image="image" />
      <sk-user-info
        class="user-info"
        :color="contrastedColor"
        :name="name"
        :badges="badges"
        :countryCode="countryCode"
        :team="team"
        :channelId="channelId"
      />
      <div class="info-line-end">
        <!-- @slot The space to the right of the user info. -->
        <slot name="info-line-end"></slot>
      </div>
    </div>
    <p v-if="sanitizedMessage" class="message" v-html="sanitizedMessage"></p>
    <p v-else class="message">{{message}}</p>
    <div class="action-line">
      <div class="line-start">
        <!-- @slot The bottom of the card to the left of the time sent. -->
        <slot name="action-line-start"></slot>
      </div>
      <span v-if="createdAt" class="time-sent">{{createdAt}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { getContrastedColor } from '@/lib/colors';
import sanitizeMessage from '@/lib/sanitizeMessage';
import SkAvatar from '@/components/SkAvatar.vue';
import SkUserInfo from '@/components/SkUserInfo.vue';

interface ChatCardData {
  sanitizedMessage: string;
}

export default Vue.extend({
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
  },
  computed: {
    sanitizedMessage(): string {
      return sanitizeMessage(
        this.$props.message,
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

  .message {
    padding: 0.5rem 0;
    margin: 0;
    overflow-wrap: break-word;
    height: 60%;
    max-height: 200px;
    overflow: auto;
  }

  .action-line {
    display: flex;
    justify-content: space-between;

    .line-start {
      flex-grow: 1;
    }

    .time-sent {
      font-size: 0.75rem;
    }
  }
}
</style>

<docs>
## Examples

```jsx
<sk-chat-card
  channelId="413856795"
  name="Alca"
  userColor="#177DE3"
  image="https://static-cdn.jtvnw.net/jtv_user_pictures/9208217791868efc-profile_image-300x300.png"
  badges="moderator/1,founder/0,sub-gifter/1"
  countryCode="us"
  team="rebel"
  message="Hello World"
  createdAt="42 seconds ago"
/>
```

## Message Sanitization

* Pass the `trustMessage` prop to sanitize and render a users message.

### Without Trust Message

```jsx
<sk-chat-card
  channelId="413856795"
  name="Alca"
  userColor="#177DE3"
  image="https://static-cdn.jtvnw.net/jtv_user_pictures/9208217791868efc-profile_image-300x300.png"
  badges="moderator/1,founder/0,sub-gifter/1"
  countryCode="us"
  team="rebel"
  message="<marquee><big><big><big>Hello World</big></big></big></marquee>"
  createdAt="42 seconds ago"
/>
```

### With Trust Message

```jsx
<sk-chat-card
  channelId="413856795"
  name="Alca"
  userColor="#177DE3"
  image="https://static-cdn.jtvnw.net/jtv_user_pictures/9208217791868efc-profile_image-300x300.png"
  badges="moderator/1,founder/0,sub-gifter/1"
  countryCode="us"
  team="rebel"
  message="<marquee><big><big><big>Hello World</big></big></big></marquee>"
  createdAt="42 seconds ago"
  trustMessage
/>
```

### Slots

### Info Line End

```jsx
<sk-chat-card
  channelId="413856795"
  name="Alca"
  userColor="#177DE3"
  image="https://static-cdn.jtvnw.net/jtv_user_pictures/9208217791868efc-profile_image-300x300.png"
  badges="moderator/1,founder/0,sub-gifter/1"
  countryCode="us"
  team="rebel"
  message="Hello World"
  createdAt="42 seconds ago"
>
  <template v-slot:info-line-end>
    <span style="position:absolute;right:0;">🦕</span>
  </template>
</sk-chat-card>
```

### Action Line Start

```jsx
<sk-chat-card
  channelId="413856795"
  name="Alca"
  userColor="#177DE3"
  image="https://static-cdn.jtvnw.net/jtv_user_pictures/9208217791868efc-profile_image-300x300.png"
  badges="moderator/1,founder/0,sub-gifter/1"
  countryCode="us"
  team="rebel"
  message="Hello World"
  createdAt="42 seconds ago"
>
  <template v-slot:action-line-start>
    <span>🦕</span>
  </template>
</sk-chat-card>
```
</docs>
