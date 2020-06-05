<template>
  <transition-group
      class="messages"
      :class="{ focus }"
      name="messages"
      tag="div"
      id="messages"
    >
    <cg-chat-card
      v-for="message in messages"
      :key="message.id"
      :user="message.user"
      :message="message"
      :timeSent="message.timeSent"
      class="message messages-item"
      @ack="ack"
      @park="park"
      :buttons="buttons"
    />
  </transition-group>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import CgChatCard from '@/apps/components/CgChatCard.vue';
import Message from '@/interfaces/Message';

export default Vue.extend({
  components: {
    CgChatCard,
  },
  props: {
    buttons: {
      type: Boolean,
      default: true,
    },
    focus: {
      type: Boolean,
      default: false,
    },
    messages: {
      type: Array as PropType<Message[]>,
      required: true,
    },
  },
  methods: {
    ack(message: Message) {
      this.$emit('ack', message);
    },
    park(message: Message) {
      this.$emit('park', message);
    },
  },
});
</script>
