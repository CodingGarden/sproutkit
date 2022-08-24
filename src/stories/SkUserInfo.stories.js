import SkUserInfo from "../components/SkUserInfo.vue";

export default {
  title: "Sproutkit/UserInfo",
  component: SkUserInfo,
};

const Template = (args) => ({
  components: { SkUserInfo },
  setup() {
    return { args };
  },
  template: '<sk-user-info v-bind="args" />',
});

export const Alca = Template.bind({});
Alca.args = {
  name: "Alca",
  badges: "moderator/1,founder/0,sub-gifter/1",
  channelId: "413856795",
};

export const AndrewLaneX = Template.bind({});
AndrewLaneX.args = {
  name: "AndrewLaneX",
  badges: "moderator/1,subscriber/0,premium/1",
  color: "#169980",
  channelId: "413856795",
};

export const ShiDotMoe = Template.bind({});
ShiDotMoe.args = {
  name: "ShiDotMoe",
  badges: "vip/1,subscriber/0",
  color: "#FD6CB4",
  channelId: "413856795",
};

export const shaggieh = Template.bind({});
shaggieh.args = {
  name: "shaggieh",
  badges: "vip/1,subscriber/0,bits-charity/1",
  color: "#7000D7",
  channelId: "413856795",
};
