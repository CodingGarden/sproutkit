<template>
  <!-- TODO: do not hard code channel primary color -->
  <sk-chat-card
    :color="color"
    :backgroundColor="backgroundColor"
    channelId="413856795"
    :name="user.display_name || user.name"
    :altName="user.display_name?.toLowerCase() !== user.name?.toLowerCase() ? user.name : ''"
    :userColor="userColor"
    :image="trustUser ? (user.profile_image_url || user.logo) : ''"
    :badges="message.badges_raw"
    :countryCode="user.country ? user.country.code : ''"
    :team="user.team"
    :teamColor="user.team_color"
    :pronoun="user.pronoun"
    :message="content"
    :createdAt="message.timeSent"
    :trustMessage="trustMessage"
    :me="message.message_type === 'action'"
    :announcement="message.msg_id === 'announcement'"
    :announcementColor="message.msg_param_color?.toLowerCase()"
    channelPrimaryColor="#56BC58"
    class="message messages-item"
    :class="{
      highlight: message.type === 'highlight',
      resub: message.msg_id === 'resub',
    }"
  >
    <template v-slot:info-line-end>
      <div class="buttons" v-if="buttons">
        <div v-if="!message.parked" class="button" @click="$emit('park', message)">
          <svg
            stroke-width="2"
            fill="currentColor"
            height="24"
            viewBox="0 0 192 192"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="_11-park" data-name="11-park">
              <path
                d="m96 0a96 96 0 1 0 96 96 96.108 96.108 0 0 0 -96-96zm0 176a80 80 0 1 1 80-80 80.091 80.091 0 0 1 -80 80z"
              />
              <path
                d="m108 56h-28a8 8 0 0 0 -8 8v80h16v-32h20a28 28 0 0 0 0-56zm0 40h-20v-24h20a12 12 0 0 1 0 24z"
              />
            </g>
          </svg>
        </div>
        <div class="button" @click="$emit('ack', message)">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"
            />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
      </div>
    </template>
    <template v-slot:action-line-start>
      <div class="status-line">
        <span class="resub-info" v-if="message.msg_id === 'resub'">
          Subbed for {{message.msg_param_cumulative_months}} months
          <span v-if="message.msg_param_should_share_streak === '1'">
            with a {{message.msg_param_streak_months}} month streak.
          </span>
        </span>
        <span class="status" v-if="sanitizedStatus" v-html="sanitizedStatus"></span>
        <span class="country" v-if="user.country">
          {{user.country.name}}
        </span>
      </div>
    </template>
  </sk-chat-card>
</template>

<script lang="ts">
import * as Vue from 'vue';

import sanitizeMessage from '@/lib/sanitizeMessage';
import SkChatCard from '@/components/SkChatCard.vue';
import User from '@/interfaces/User';
import Message from '@/interfaces/Message';

export default Vue.defineComponent({
  components: {
    SkChatCard,
  },
  props: {
    buttons: {
      default: true,
      type: Boolean,
    },
    user: {
      required: true,
      type: Object as Vue.PropType<User>,
    },
    message: {
      required: true,
      type: Object as Vue.PropType<Message>,
    },
  },
  computed: {
    trustUser(): boolean {
      return !!(
        this.$props.message.badges?.broadcaster
        || this.$props.message.badges?.moderator
        || this.$props.message.badges?.vip
        || this.$props.user.follow
      );
    },
    color(): string {
      if (
        this.$props.message.type === 'follow'
        || this.$props.message.type === 'highlight'
        || this.$props.message.type === 'reward'
      ) return '#000000';
      return '#FFFFFF';
    },
    userColor(): string {
      if (
        this.$props.message.type === 'follow'
        || this.$props.message.type === 'highlight'
        || this.$props.message.type === 'reward'
      ) return '#000000';
      return typeof this.message.color === 'string' ? this.message.color : '#FFFFFF';
    },
    backgroundColor(): string {
      if (this.$props.message.first_msg) return '#56BC58DD';
      if (this.$props.message.backgroundColor) return `${this.$props.message.backgroundColor}CC`;
      if (this.$props.message.type === 'reward') return '#454ADEDD';
      if (this.$props.message.type === 'follow') return '#99B2DDDD';
      if (this.$props.message.type === 'highlight') return '#BD2D87DD';
      if (this.$props.message.platform === 'youtube') return '#95190CDD';
      return this.trustUser ? '#392F5ADD' : '#191D32AA';
    },
    content(): string {
      return (
        this.$props.message.parsedMessage
        || this.$props.message.content
        || this.$props.message.message
      );
    },
    trustMessage(): boolean {
      return (
        this.trustUser
        && new Date(this.user.created_at || Date.now())
          < new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
      );
    },
    sanitizedStatus(): string {
      return this.$props.user.status ? sanitizeMessage(
        this.$props.user.status,
        this.trustMessage,
      ) : '';
    },
  },
});
</script>

<style lang="scss">
.buttons {
  position: absolute;
  right: 0;
  display: flex;

  .button {
    margin: 0 0.25rem;
    cursor: pointer;
  }
}
.highlight {
  font-weight: bold;
  font-size: 2rem !important;
}

.resub {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E");
}

.resub-info {
  font-size: 1rem;
  font-style: italic;
}

.status-line {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.country {
  font-style: italic;
  font-size: 0.8rem;
  text-align: center;
}

.status {
  font-style: italic;
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 0.35rem;
  max-height: 2.5rem;
  max-width: 60%;
  p {
    display: inline-flex;
    align-items: center;
    width: 100%;
  }
  // overflow-y: hidden;

  img[src$="#emote"] {
    height: 25px;
    margin: 0.4rem;
  }
}

.message {
  overflow: hidden;
}

.message .status-line .status img {
  max-height: 50px;
}

.message .status-line .country {
  opacity: 0;
}

.message:hover .status-line .country {
  opacity: 1;
}

.message .status-line .country {
  transition: opacity 200ms linear;
}
</style>
