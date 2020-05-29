<template>
  <div class="chat-card" :style="{ '--color': color, '--background-color': backgroundColor }">
    <div class="info-line">
      <sk-avatar :image="user.logo" :subscriber="user.subscription" />
      <sk-user-info
        class="user-info"
        :name="user.display_name || user.name"
        :badges="message.badges_raw"
        :countryCode="user.country ? user.country.code : ''"
        :team="user.team || ''"
      />
      <div class="info-line-end">
        <slot name="info-line-end"></slot>
      </div>
    </div>
    <p class="message">{{message.content}}</p>
    <div class="action-line">
      <div class="line-start">
        <slot name="action-line-start"></slot>
      </div>
      <span class="time-sent">25 seconds ago</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import SkAvatar from '@/components/SkAvatar.vue';

export interface User {
  _id: string;
  name: string;
  bio: null;
  created_at: Date;
  display_name: string;
  id?: string;
  logo: string;
  type: string;
  updated_at: Date;
  follow: Follow | false;
  subscription: Subscription | false;
  team?: string;
  country?: Country;
}

export interface Follow {
  created_at: Date;
  notifications: boolean;
}

export interface Subscription {
  sub_plan: string;
  created_at: Date;
}

export interface Country {
  code: string;
  name: string;
}

export interface Message {
  _id: string;
  badge_info: BadgeInfo;
  badges: Badges;
  color: string;
  display_name: string;
  emotes: null;
  flags: null;
  id: string;
  mod: boolean;
  room_id: string;
  subscriber: boolean;
  tmi_sent_ts: string;
  turbo: boolean;
  user_id: string;
  user_type: string;
  emotes_raw: null;
  badge_info_raw: string;
  badges_raw: string;
  username: string;
  message_type: string;
  name: string;
  created_at: Date;
  deleted_at: null;
  message: string;
  content: string;
}

export interface BadgeInfo {
  subscriber: string;
}

export interface Badges {
  moderator: string;
  subscriber: string;
  premium: string;
}

export default Vue.extend({
  components: {
    SkAvatar,
  },
  props: {
    color: {
      type: String,
      default: '#FFF',
    },
    backgroundColor: {
      type: String,
      default: '#392F5A',
    },
    user: {
      type: Object as PropType<User>,
    },
    message: {
      type: Object as PropType<Message>,
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
  :user="{
    _id: '5ec8c09b56fd88771c27b535',
    name: 'andrewlanex',
    bio: null,
    created_at: '2019-01-29T23:53:58.00015Z',
    display_name: 'AndrewLaneX',
    id: '413167662',
    logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/d4aff31e-2bb2-4d96-907e-ffd6c5dd79c5-profile_image-300x300.png',
    type: 'user',
    updated_at: '2020-05-22T08:31:02.339314Z',
    follow: {
      created_at: '2020-05-18T15:49:48Z',
      notifications: true
    },
    subscription: {
      sub_plan: '1000',
      created_at: '2020-04-28T15:38:48.000Z'
    },
    country: {
      code: 'us',
      name: 'United States of America'
    },
    team: 'twitch'
  }"
  :message="{
    _id: '5ec6e0b636d9627d605aa4f3',
    badge_info: {
      subscriber: '1'
    },
    badges: {
      moderator: '1',
      subscriber: '0',
      premium: '1'
    },
    color: '#009D83',
    display_name: 'AndrewLaneX',
    emotes: null,
    flags: null,
    id: '4352e149-6024-45f2-a6f5-db9ed5494b66',
    mod: true,
    room_id: '413856795',
    subscriber: true,
    tmi_sent_ts: '1590091958386',
    turbo: false,
    user_id: '413167662',
    user_type: 'mod',
    emotes_raw: null,
    badge_info_raw: 'subscriber/1',
    badges_raw: 'moderator/1,subscriber/0,premium/1',
    username: 'andrewlanex',
    message_type: 'chat',
    name: 'AndrewLaneX',
    created_at: '2020-05-21T20:12:38.386Z',
    deleted_at: null,
    message: '!comment Hello World',
    content: 'Hello World'
  }"
/>
```

```jsx
<sk-chat-card
  backgroundColor="yellow"
  color="red"
  :user="{
    _id: '5ec8c09b56fd88771c27b535',
    name: 'andrewlanex',
    bio: null,
    created_at: '2019-01-29T23:53:58.00015Z',
    display_name: 'AndrewLaneX',
    id: '413167662',
    logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/d4aff31e-2bb2-4d96-907e-ffd6c5dd79c5-profile_image-300x300.png',
    type: 'user',
    updated_at: '2020-05-22T08:31:02.339314Z',
    follow: {
      created_at: '2020-05-18T15:49:48Z',
      notifications: true
    },
    subscription: {
      sub_plan: '1000',
      created_at: '2020-04-28T15:38:48.000Z'
    },
    country: {
      code: 'us',
      name: 'United States of America'
    },
    team: 'twitch'
  }"
  :message="{
    _id: '5ec6e0b636d9627d605aa4f3',
    badge_info: {
      subscriber: '1'
    },
    badges: {
      moderator: '1',
      subscriber: '0',
      premium: '1'
    },
    color: '#009D83',
    display_name: 'AndrewLaneX',
    emotes: null,
    flags: null,
    id: '4352e149-6024-45f2-a6f5-db9ed5494b66',
    mod: true,
    room_id: '413856795',
    subscriber: true,
    tmi_sent_ts: '1590091958386',
    turbo: false,
    user_id: '413167662',
    user_type: 'mod',
    emotes_raw: null,
    badge_info_raw: 'subscriber/1',
    badges_raw: 'moderator/1,subscriber/0,premium/1',
    username: 'andrewlanex',
    message_type: 'chat',
    name: 'AndrewLaneX',
    created_at: '2020-05-21T20:12:38.386Z',
    deleted_at: null,
    message: '!comment Hello World',
    content: 'Hello World'
  }"
/>
```

```jsx
<sk-chat-card
  backgroundColor="red"
  color="yellow"
  :user="{
    _id: '5ec8c09b56fd88771c27b535',
    name: 'andrewlanex',
    bio: null,
    created_at: '2019-01-29T23:53:58.00015Z',
    display_name: 'AndrewLaneX',
    id: '413167662',
    logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/d4aff31e-2bb2-4d96-907e-ffd6c5dd79c5-profile_image-300x300.png',
    type: 'user',
    updated_at: '2020-05-22T08:31:02.339314Z',
    follow: {
      created_at: '2020-05-18T15:49:48Z',
      notifications: true
    },
    subscription: {
      sub_plan: '1000',
      created_at: '2020-04-28T15:38:48.000Z'
    },
    country: {
      code: 'us',
      name: 'United States of America'
    },
    team: 'twitch'
  }"
  :message="{
    _id: '5ec6e0b636d9627d605aa4f3',
    badge_info: {
      subscriber: '1'
    },
    badges: {
      moderator: '1',
      subscriber: '0',
      premium: '1'
    },
    color: '#009D83',
    display_name: 'AndrewLaneX',
    emotes: null,
    flags: null,
    id: '4352e149-6024-45f2-a6f5-db9ed5494b66',
    mod: true,
    room_id: '413856795',
    subscriber: true,
    tmi_sent_ts: '1590091958386',
    turbo: false,
    user_id: '413167662',
    user_type: 'mod',
    emotes_raw: null,
    badge_info_raw: 'subscriber/1',
    badges_raw: 'moderator/1,subscriber/0,premium/1',
    username: 'andrewlanex',
    message_type: 'chat',
    name: 'AndrewLaneX',
    created_at: '2020-05-21T20:12:38.386Z',
    deleted_at: null,
    message: '!comment Hello World',
    content: 'Hello World'
  }"
/>
```

```jsx
<sk-chat-card
  backgroundColor="#262626"
  color="#ee4c4c"
  :user="{
    _id: '5ec8c09b56fd88771c27b535',
    name: 'andrewlanex',
    bio: null,
    created_at: '2019-01-29T23:53:58.00015Z',
    display_name: 'AndrewLaneX',
    id: '413167662',
    logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/d4aff31e-2bb2-4d96-907e-ffd6c5dd79c5-profile_image-300x300.png',
    type: 'user',
    updated_at: '2020-05-22T08:31:02.339314Z',
    follow: {
      created_at: '2020-05-18T15:49:48Z',
      notifications: true
    },
    subscription: {
      sub_plan: '1000',
      created_at: '2020-04-28T15:38:48.000Z'
    },
    country: {
      code: 'us',
      name: 'United States of America'
    },
    team: 'twitch'
  }"
  :message="{
    _id: '5ec6e0b636d9627d605aa4f3',
    badge_info: {
      subscriber: '1'
    },
    badges: {
      moderator: '1',
      subscriber: '0',
      premium: '1'
    },
    color: '#009D83',
    display_name: 'AndrewLaneX',
    emotes: null,
    flags: null,
    id: '4352e149-6024-45f2-a6f5-db9ed5494b66',
    mod: true,
    room_id: '413856795',
    subscriber: true,
    tmi_sent_ts: '1590091958386',
    turbo: false,
    user_id: '413167662',
    user_type: 'mod',
    emotes_raw: null,
    badge_info_raw: 'subscriber/1',
    badges_raw: 'moderator/1,subscriber/0,premium/1',
    username: 'andrewlanex',
    message_type: 'chat',
    name: 'AndrewLaneX',
    created_at: '2020-05-21T20:12:38.386Z',
    deleted_at: null,
    message: '!comment Hello World',
    content: 'Hello World'
  }"
/>
```

### Slots

### Info Line End

```jsx
<sk-chat-card
  :user="{
    _id: '5ec8c09b56fd88771c27b535',
    name: 'andrewlanex',
    bio: null,
    created_at: '2019-01-29T23:53:58.00015Z',
    display_name: 'AndrewLaneX',
    id: '413167662',
    logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/d4aff31e-2bb2-4d96-907e-ffd6c5dd79c5-profile_image-300x300.png',
    type: 'user',
    updated_at: '2020-05-22T08:31:02.339314Z',
    follow: {
      created_at: '2020-05-18T15:49:48Z',
      notifications: true
    },
    subscription: {
      sub_plan: '1000',
      created_at: '2020-04-28T15:38:48.000Z'
    },
    country: {
      code: 'us',
      name: 'United States of America'
    },
    team: 'twitch'
  }"
  :message="{
    _id: '5ec6e0b636d9627d605aa4f3',
    badge_info: {
      subscriber: '1'
    },
    badges: {
      moderator: '1',
      subscriber: '0',
      premium: '1'
    },
    color: '#009D83',
    display_name: 'AndrewLaneX',
    emotes: null,
    flags: null,
    id: '4352e149-6024-45f2-a6f5-db9ed5494b66',
    mod: true,
    room_id: '413856795',
    subscriber: true,
    tmi_sent_ts: '1590091958386',
    turbo: false,
    user_id: '413167662',
    user_type: 'mod',
    emotes_raw: null,
    badge_info_raw: 'subscriber/1',
    badges_raw: 'moderator/1,subscriber/0,premium/1',
    username: 'andrewlanex',
    message_type: 'chat',
    name: 'AndrewLaneX',
    created_at: '2020-05-21T20:12:38.386Z',
    deleted_at: null,
    message: '!comment Hello World',
    content: 'Hello World'
  }"
>
  <template v-slot:info-line-end>
    <span style="position:absolute;right:0;">🦕</span>
  </template>
</sk-chat-card>
```

### Action Line Start

```jsx
<sk-chat-card
  :user="{
    _id: '5ec8c09b56fd88771c27b535',
    name: 'andrewlanex',
    bio: null,
    created_at: '2019-01-29T23:53:58.00015Z',
    display_name: 'AndrewLaneX',
    id: '413167662',
    logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/d4aff31e-2bb2-4d96-907e-ffd6c5dd79c5-profile_image-300x300.png',
    type: 'user',
    updated_at: '2020-05-22T08:31:02.339314Z',
    follow: {
      created_at: '2020-05-18T15:49:48Z',
      notifications: true
    },
    subscription: {
      sub_plan: '1000',
      created_at: '2020-04-28T15:38:48.000Z'
    },
    country: {
      code: 'us',
      name: 'United States of America'
    },
    team: 'twitch'
  }"
  :message="{
    _id: '5ec6e0b636d9627d605aa4f3',
    badge_info: {
      subscriber: '1'
    },
    badges: {
      moderator: '1',
      subscriber: '0',
      premium: '1'
    },
    color: '#009D83',
    display_name: 'AndrewLaneX',
    emotes: null,
    flags: null,
    id: '4352e149-6024-45f2-a6f5-db9ed5494b66',
    mod: true,
    room_id: '413856795',
    subscriber: true,
    tmi_sent_ts: '1590091958386',
    turbo: false,
    user_id: '413167662',
    user_type: 'mod',
    emotes_raw: null,
    badge_info_raw: 'subscriber/1',
    badges_raw: 'moderator/1,subscriber/0,premium/1',
    username: 'andrewlanex',
    message_type: 'chat',
    name: 'AndrewLaneX',
    created_at: '2020-05-21T20:12:38.386Z',
    deleted_at: null,
    message: '!comment Hello World',
    content: 'Hello World'
  }"
>
  <template v-slot:action-line-start>
    <span>🦕</span>
  </template>
</sk-chat-card>
</docs>
