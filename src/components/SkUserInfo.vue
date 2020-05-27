<template>
  <div class="user-info" :style="{ '--color': color }">
    <span class="badge" v-for="badge in badgeList" :key="badge.id">
      <img :src="badge.url" :alt="badge.name">
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
import getBadges from '@/utils/getBadges';

export default Vue.extend({
  data: () => ({
    badgeList: [] as Badge[],
  }),
  props: {
    name: {
      required: true,
      type: String,
    },
    badges: {
      default: '',
      type: String,
    },
    color: {
      default: 'inherit',
      type: String,
    },
    countryCode: String,
    team: String,
  },
  async created() {
    if (this.$props.badges) {
      this.badgeList = await getBadges(this.$props.badges);
    }
  },
});
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Fira+Sans');

.user-info {
  --size: 20px;
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
    margin: 0 0.25rem;
    font-family: 'Fira Sans', sans-serif;
    color: inherit;
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
/>
```

```jsx
<sk-user-info
  name="AndrewLaneX"
  badges="moderator/1,subscriber/0,premium/1"
  color="#169980"
/>
```

```jsx
<sk-user-info
  name="ShiDotMoe"
  badges="vip/1,subscriber/0"
  color="#FD6CB4"
/>
```

```jsx
<sk-user-info
  name="shaggieh"
  badges="vip/1,subscriber/0,bits-charity/1"
  color="#7000D7"
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
