<template>
  <div class="avatar" :style="{ '--size': size }">
    <img :src="image" />
    <span class="sub-badge" v-if="subscriberBadge">
      <img :src="subscriberBadge" />
    </span>
  </div>
</template>

<script lang="ts">
import * as Vue from 'vue';

export default Vue.defineComponent({
  props: {
    /**
     * The size of the Avatar. Can be any valid CSS unit.
    */
    size: {
      default: '50px',
      type: String,
    },
    /**
     * Any valid avatar url.
    */
    image: {
      required: true,
      type: String,
    },
    /**
     * Any valid image url. Position a subscriber badge image on top of the Avatar.
    */
    subscriberBadge: String,
  },
});
</script>

<style scoped lang="scss">
.avatar {
  position: relative;
  width: var(--size);
  height: calc(var(--size) * 1.1);

  img {
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    margin-bottom: 0.25rem;
  }

  .sub-badge img {
    position: absolute;
    bottom: calc(var(--size) * -0.08);
    width: calc(var(--size) * 0.5);
    height: calc(var(--size) * 0.5);
    right: calc(var(--size) * -0.1);
  }
}
</style>