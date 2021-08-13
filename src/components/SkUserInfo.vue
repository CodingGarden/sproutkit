<template>
  <div class="user-info" :style="{ '--color': color }">
    <span class="badge" v-for="badge in badgeList" :key="badge.id">
      <img :srcset="badge.srcSet" :src="badge.url" :alt="badge.name" :title="badge.name">
    </span>
    <span class="name">{{name}}</span>
    <span v-if="countryCode" :class="`country flag-icon flag-icon-${countryCode}`"></span>
    <span v-if="team" class="team">
      <i :class="['team-badge', 'fab', `fa-${team}`]"></i>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Badge from '@/interfaces/Badge';
import getBadges from '@/lib/getBadges';

export default Vue.extend({
  data: () => ({
    badgeList: [] as Badge[],
  }),
  props: {
    /**
     * The username to display.
    */
    name: {
      required: true,
      type: String,
    },
    /**
     * The raw badge string from twitch irc.
    */
    badges: {
      default: '',
      type: String,
    },
    /**
     * The color of the username / team badge.
    */
    color: {
      default: 'inherit',
      type: String,
    },
    /**
     * The channel id the message was sent in. Ssed to retrieve channel specific badges.
    */
    channelId: String,
    /**
     * 2 Character Country code. Used to display a flag next to the users name.
    */
    countryCode: String,
    /**
     * The name of the team badge. Can be any valid font awesome brand name.
    */
    team: String,
  },
  async created() {
    if (this.$props.badges) {
      this.badgeList = await getBadges(
        this.$props.badges,
        this.$props.channelId,
      );
    }
  },
});
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Fira+Sans');

.user-info {
  --size: 25px;
  --color: inherit;
  display: flex;
  align-items: center;
  color: var(--color);

  .badge img {
    width: var(--size);
    height: var(--size);
    margin: 0.1rem;
  }

  .name {
    font-size: 1.2rem;
    margin: 0 0.5rem;
    font-family: 'Fira Sans', sans-serif;
    color: inherit;
  }

  .country {
    font-size: 1rem;
  }

  .team {
    margin-left: 0.25rem;
    color: inherit;
  }
}
</style>

<docs>
## Examples

```jsx
<sk-user-info
  name="Alca"
  badges="moderator/1,founder/0,sub-gifter/1"
  channelId="413856795"
/>
```

```jsx
<sk-user-info
  name="AndrewLaneX"
  badges="moderator/1,subscriber/0,premium/1"
  color="#169980"
  channelId="413856795"
/>
```

```jsx
<sk-user-info
  name="ShiDotMoe"
  badges="vip/1,subscriber/0"
  color="#FD6CB4"
  channelId="413856795"
/>
```

```jsx
<sk-user-info
  name="shaggieh"
  badges="vip/1,subscriber/0,bits-charity/1"
  color="#7000D7"
  channelId="413856795"
/>
```

```jsx
<sk-user-info
  name="whats_up_baby"
  color="#7074FA"
/>
```

## Country Flags

* Any valid country code from the `flag-icon` css library can be used.
* To include a country flag next to the username, pass the `countryCode` prop.
* You must include the CSS somewhere on your page:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css" integrity="sha512-Cv93isQdFwaKBV+Z4X8kaVBYWHST58Xb/jVOcV9aRsGSArZsgAnFIhMpDoMDcFNoUtday1hdjn0nGp3+KZyyFw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
```

```jsx
<sk-user-info
  name="Alca"
  color="#177DE3"
  badges="moderator/1,founder/0,sub-gifter/1"
  countryCode="us"
/>
```

```jsx
<sk-user-info
  name="nofhto"
  color="#5E315D"
  badges="subscriber/0,sub-gifter/1"
  countryCode="mx"
/>
```

## Teams

* Any valid brand from the font-awesome brands collection can be used
  * https://fontawesome.com/cheatsheet/free/brands
* To include a team next to the username, pass the `team` prop.
* You must include the font awesome CSS somewhere on your page:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/fontawesome.min.css" integrity="sha512-P9vJUXK+LyvAzj8otTOKzdfF1F3UYVl13+F8Fof8/2QNb8Twd6Vb+VD52I7+87tex9UXxnzPgWA3rH96RExA7A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/brands.min.css" integrity="sha512-sVSECYdnRMezwuq5uAjKQJEcu2wybeAPjU4VJQ9pCRcCY4pIpIw4YMHIOQ0CypfwHRvdSPbH++dA3O4Hihm/LQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
```

```jsx
<sk-user-info
  name="TheChosenFallen"
  color="#D9A432"
  countryCode="gb"
  team="pied-piper-hat"
/>
```


```jsx
<sk-user-info
  name="Alca"
  color="#177DE3"
  badges="moderator/1,founder/0,sub-gifter/1"
  countryCode="us"
  team="rebel"
/>
```
</docs>
