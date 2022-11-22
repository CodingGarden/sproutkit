<template>
  <!-- <transition-group
      class="messages"
      :class="{ focus }"
      name="messages"
      tag="div"
      id="messages"
    > -->
  <div class="messages">
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
  </div>
  <!-- </transition-group> -->
</template>

<script lang="ts">
import * as Vue from 'vue';

import CgChatCard from '@/apps/components/CgChatCard.vue';
import Message from '@/interfaces/Message';

export default Vue.defineComponent({
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
      type: Array as Vue.PropType<Message[]>,
      required: true,
    },
  },
  mounted() {
    document.addEventListener('mousemove', (e) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
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
