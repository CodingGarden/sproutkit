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

<docs>
## Examples

```jsx
<sk-avatar
  image="https://static-cdn.jtvnw.net/jtv_user_pictures/3c45eced1bfca9e2-profile_image-300x300.jpeg"
/>
```

```jsx
<sk-avatar
  image="https://static-cdn.jtvnw.net/jtv_user_pictures/9208217791868efc-profile_image-300x300.png"
  subscriber-badge="https://static-cdn.jtvnw.net/badges/v1/5b8a0d76-4670-4f99-8874-964e20b7a839/3"
/>
```

```jsx
<sk-avatar
  image="https://static-cdn.jtvnw.net/jtv_user_pictures/a3bf78e1-97b5-4955-b8ac-46882b80cda2-profile_image-300x300.png"
  subscriber-badge="https://static-cdn.jtvnw.net/badges/v1/2b8f7e52-7000-42a4-81e7-9e5102529d12/3"
/>
```

## Custom Size

Size is a string that must be a valid CSS unit.

```jsx
<sk-avatar
  size="20px"
  image="https://static-cdn.jtvnw.net/jtv_user_pictures/majesticeye-profile_image-6839a0baf3ddd92e-300x300.png"
/>
```

```jsx
<sk-avatar
  size="10rem"
  image="https://static-cdn.jtvnw.net/jtv_user_pictures/6043c683-0db5-4e66-a37f-7df8b76bca71-profile_image-300x300.png"
  subscriber-badge="https://static-cdn.jtvnw.net/badges/v1/5b8a0d76-4670-4f99-8874-964e20b7a839/3"
/>
```
</docs>
