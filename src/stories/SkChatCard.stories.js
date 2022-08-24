import SkChatCard from "../components/SkChatCard.vue";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/solid.min.css";
import "@fortawesome/fontawesome-free/css/brands.min.css";
import "flag-icon-css/css/flag-icon.min.css";
import { default as pronouns } from "../lib/pronouns.ts";

const userImage =
  "https://static-cdn.jtvnw.net/jtv_user_pictures/9208217791868efc-profile_image-300x300.png";

// These are from Twitch's preset colors
const colors = {
  red: "#ff0000",
  blue: "0000ff",
  green: "008000",
  firebrick: "b22222",
  coral: "ff7f50",
  yellowgreen: "9acd32",
  orangered: "ff4500",
  seagreen: "2e8b57",
  goldenrod: "daa520",
  chocolate: "d2691e",
  cadetblue: "5f9ea0",
  dodgerblue: "1e90ff",
  hotpink: "ff69b4",
  blueviolet: "8a2be2",
  springgreen: "00ff7f",
};

export default {
  title: "Sproutkit/ChatCard",
  component: SkChatCard,
  args: {
    name: "Alca",
    message: "<marquee><big><big><big>Hello World</big></big></big></marquee>",
    pronoun: "he",
    userColor: "#177DE3",
    image: userImage,
    badges: "moderator/1,founder/0,sub-gifter/5000",
    countryCode: "us",
    team: "rebel",
    color: "#FFFFFF",
    backgroundColor: "#392f5a",
    createdAt: "42 seconds ago",
    channelId: "413856795",
    teamColor: 'FFFFFF'
  },
  argTypes: {
    pronoun: {
      options: [...pronouns.keys()],
      mapping: pronouns,
      control: {
        type: "select",
      },
    },
    userColor: {
      control: {
        type: "color",
        presetColors: Object.values(colors),
      },
    },
  },
};

const Template = (args) => {
  // This is to remove the hash when using the color picker from storybook. The Vue component expects a hex code *without* the hash.
  args.teamColor = args.teamColor.slice(1)
  return {
    components: { SkChatCard },
    setup() {
      return { args };
    },
    template: `<sk-chat-card v-bind="args">${args.slot}</sk-chat-card>`,
  };
};

export const Untrusted = Template.bind({});

export const Trusted = Template.bind({});
Trusted.args = {
  trustMessage: true,
};

export const WithInfoLineEnd = Template.bind({});
WithInfoLineEnd.args = {
  slot: '<template v-slot:info-line-end><span style="position:absolute;right:0;">🦕</span></template>',
};

export const WithActionLineStart = Template.bind({});
WithActionLineStart.args = {
  slot: "<template v-slot:action-line-start><span>🦕</span></template>",
};

export const Small = Template.bind({});
Small.decorators = [() => ({ template: '<div style="scale: .5;"><story /></div>' })];
