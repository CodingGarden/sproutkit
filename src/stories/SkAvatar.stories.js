import SkAvatar from "../components/SkAvatar.vue";

const userImages = {
  user1:
    "https://static-cdn.jtvnw.net/jtv_user_pictures/3c45eced1bfca9e2-profile_image-300x300.jpeg",
  user2:
    "https://static-cdn.jtvnw.net/jtv_user_pictures/9208217791868efc-profile_image-300x300.png",
  user3:
    "https://static-cdn.jtvnw.net/jtv_user_pictures/39ae2223-abdb-4811-950a-ed3cddc392b0-profile_image-300x300.png",
};

const badges = {
  noIcon: "",
  subIcon: "https://static-cdn.jtvnw.net/badges/v1/5b8a0d76-4670-4f99-8874-964e20b7a839/3",
  subIcon2: "https://static-cdn.jtvnw.net/badges/v1/2b8f7e52-7000-42a4-81e7-9e5102529d12/3",
};

export default {
  title: "Sproutkit/Avatar",
  component: SkAvatar,
  argTypes: {
    subscriberBadge: {
      options: Object.keys(badges),
      mapping: badges,
      control: {
        type: "radio",
        labels: {
          noIcon: "Non Subscriber",
          subIcon: "Example Image 1",
          subIcon2: "Example Image 2",
        },
      },
    },
  },
};

const Template = (args) => ({
  components: { SkAvatar },
  setup() {
    return { args };
  },
  template: '<sk-avatar v-bind="args" />',
});

export const NonSubscriber = Template.bind({});
NonSubscriber.args = {
  image: userImages.user1,
  subscriberBadge: badges.noIcon,
};

export const Subscriber = Template.bind({});
Subscriber.args = {
  image: userImages.user2,
  subscriberBadge: badges.subIcon,
};

export const Large = Template.bind({});
Large.args = {
  size: "10rem",
  image: userImages.user3,
  subscriberBadge: badges.subIcon2,
};
