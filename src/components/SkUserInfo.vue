<template>
  <div class="user-info" :style="{ '--color': color }">
    <span class="badge" v-for="badge in badgeList" :key="badge.id">
      <img :srcset="badge.srcSet" :src="badge.url" :alt="badge.name" :title="badge.name">
    </span>
    <span class="name">{{ name }} <span v-if="altName">({{ altName }})</span></span>
    <span v-if="pronoun" class="pronouns">({{ pronouns }})</span>
    <span v-if="countryCode" :class="`country flag-icon flag-icon-${countryCode}`"></span>
    <span v-if="team" class="team">
      <i v-if="!simpleIcon" :title="team" :class="['team-badge', faClass, `fa-${team}`]"></i>
      <div
        :style="{ fill: `#${simpleIcon.hex}` }"
        class="simple-icon"
        v-if="simpleIcon"
        v-html="simpleIcon.svg"
      >
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import * as Vue from 'vue';

import Badge from '@/interfaces/Badge';
import getBadges from '@/lib/getBadges';
import pronouns from '@/lib/pronouns';

import { solidIcons, brandIcons, simpleIcons } from '@/lib/faIcons';
import { SimpleIcon } from 'simple-icons';

export default Vue.defineComponent({
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
     * The alt-name to display.
    */
    altName: {
      default: '',
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
     * The preferred pronoun of the user.
    */
    pronoun: {
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
  computed: {
    pronouns(): string {
      return pronouns.get(this.pronoun) || '';
    },
    simpleIcon(): SimpleIcon | null {
      const icon = simpleIcons.get(this.$props.team || '');
      if (icon) {
        return icon;
      }
      return null;
    },
    faClass(): string {
      if (solidIcons.has(this.$props.team || '')) return 'fa-solid';
      if (brandIcons.has(this.$props.team || '')) return 'fa-brands';
      return '';
    },
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
    font-size: 1.3rem;
    margin: 0 0.5rem;
    font-family: 'Fira Sans', sans-serif;
    color: inherit;
  }

  .country {
    font-size: 1rem;
  }

  .team {
    margin-left: 0.35rem;
    color: inherit;
  }

  .simple-icon {
    width: 28px;
    height: 28px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .pronouns {
    font-size: 1rem;
    margin-right: 0.75rem;
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
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/css/flag-icon.min.css" integrity="sha256-YjcCvXkdRVOucibC9I4mBS41lXPrWfqY2BnpskhZPnw=" crossorigin="anonymous" />
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
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/fontawesome.min.css" integrity="sha256-CuUPKpitgFmSNQuPDL5cEfPOOJT/+bwUlhfumDJ9CI4=" crossorigin="anonymous" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/brands.min.css" integrity="sha256-wfbbsQFYKnizQi/WLPXS3wVDu0Dpi2yUQpZBDsb2H1s=" crossorigin="anonymous" />
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
